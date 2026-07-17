"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { shouldAttemptBackgroundVideo } from "@/lib/video-capabilities";
import { useMobileExperience } from "./use-mobile-experience";

export interface UseResilientBgVideoOptions {
  /** IntersectionObserver root margin (default: "160px") */
  rootMargin?: string;
  /** Mobile timeout in ms (default: 3000) */
  mobileTimeoutMs?: number;
  /** Desktop timeout in ms (default: 5000) */
  desktopTimeoutMs?: number;
  /** Skip capability check (force attempt) */
  forceAttempt?: boolean;
}

export interface UseResilientBgVideoReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  shouldLoadVideo: boolean;
  videoReady: boolean;
  videoFailed: boolean;
  useVideo: boolean;
  showVideo: boolean;
}

export function useResilientBgVideo(
  options: UseResilientBgVideoOptions = {},
): UseResilientBgVideoReturn {
  const {
    rootMargin = "160px",
    mobileTimeoutMs = 3000,
    desktopTimeoutMs = 5000,
    forceAttempt = false,
  } = options;

  const isMobile = useMobileExperience();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoReadyRef = useRef(false);

  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [canAttemptVideo, setCanAttemptVideo] = useState(true);

  const markVideoReady = useCallback(() => {
    videoReadyRef.current = true;
    setVideoReady(true);
  }, []);

  const failVideo = useCallback(() => {
    setVideoFailed(true);
  }, []);

  useEffect(() => {
    if (!forceAttempt) {
      setCanAttemptVideo(shouldAttemptBackgroundVideo());
    }
  }, [forceAttempt]);

  useEffect(() => {
    if (!canAttemptVideo) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [canAttemptVideo, rootMargin]);

  useEffect(() => {
    if (!shouldLoadVideo || !canAttemptVideo || videoFailed) return;
    videoRef.current?.load();
  }, [shouldLoadVideo, canAttemptVideo, videoFailed]);

  useEffect(() => {
    if (!shouldLoadVideo || !canAttemptVideo || videoFailed) return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const attemptPlay = () => {
      if (cancelled || videoFailed || videoReadyRef.current) return;

      video.muted = true;
      video.defaultMuted = true;

      void video
        .play()
        .then(() => {
          if (cancelled) return;
          if (video.paused) {
            failVideo();
            return;
          }
          markVideoReady();
        })
        .catch(() => {
          if (!cancelled) failVideo();
        });
    };

    const onPlaying = () => {
      if (!cancelled) markVideoReady();
    };

    const onError = () => {
      if (!cancelled) failVideo();
    };

    const onVisibilityChange = () => {
      if (!document.hidden && !videoReadyRef.current && !videoFailed) {
        attemptPlay();
      }
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("canplay", attemptPlay);
    video.addEventListener("loadeddata", attemptPlay);
    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibilityChange);

    attemptPlay();

    const timeoutMs = isMobile === true ? mobileTimeoutMs : desktopTimeoutMs;
    const timeout = window.setTimeout(() => {
      if (cancelled || videoReadyRef.current) return;
      if (
        video.paused ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        failVideo();
      }
    }, timeoutMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", attemptPlay);
      video.removeEventListener("loadeddata", attemptPlay);
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [
    shouldLoadVideo,
    canAttemptVideo,
    videoFailed,
    isMobile,
    mobileTimeoutMs,
    desktopTimeoutMs,
    failVideo,
    markVideoReady,
  ]);

  const useVideo = shouldLoadVideo && !videoFailed && canAttemptVideo;
  const showVideo = useVideo && videoReady;

  return {
    containerRef,
    videoRef,
    shouldLoadVideo,
    videoReady,
    videoFailed,
    useVideo,
    showVideo,
  };
}
