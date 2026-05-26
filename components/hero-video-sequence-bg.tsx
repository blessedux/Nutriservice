"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  dispatchHeroVideoClipChange,
  HERO_LANDING_VIDEO_SEQUENCE,
  type HeroVideoClip,
} from "@/lib/hero-video-sequence";
import { cn } from "@/lib/utils";

const CROSSFADE_MS = 1400;
const PLAY_RETRY_MS = 400;
const PLAY_MAX_ATTEMPTS = 14;

type HeroVideoSequenceBgProps = {
  playbackReady: boolean;
};

function setVideoSources(video: HTMLVideoElement, clip: HeroVideoClip) {
  video.loop = false;
  video.pause();
  while (video.firstChild) {
    video.removeChild(video.firstChild);
  }

  if (clip.mp4) {
    const mp4 = document.createElement("source");
    mp4.src = clip.mp4;
    mp4.type = "video/mp4";
    video.appendChild(mp4);
  }

  const webm = document.createElement("source");
  webm.src = clip.webm;
  webm.type = "video/webm";
  video.appendChild(webm);

  video.load();
}

function prepareVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.disablePictureInPicture = true;
}

async function playVideo(video: HTMLVideoElement): Promise<void> {
  prepareVideo(video);
  if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
    video.load();
  }
  try {
    await video.play();
  } catch {
    /* autoplay policies — retried by caller */
  }
}

export function HeroVideoSequenceBg({
  playbackReady,
}: HeroVideoSequenceBgProps) {
  const reduceMotion = useReducedMotion();
  const [frontIsA, setFrontIsA] = useState(true);
  const [crossfadeActive, setCrossfadeActive] = useState(false);

  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const clipIndexRef = useRef(0);
  const playCountRef = useRef(0);
  const transitioningRef = useRef(false);
  const mayPlayRef = useRef(false);
  const frontIsARef = useRef(true);

  const getFrontVideo = useCallback(() => {
    return frontIsARef.current ? videoARef.current : videoBRef.current;
  }, []);

  const getBackVideo = useCallback(() => {
    return frontIsARef.current ? videoBRef.current : videoARef.current;
  }, []);

  const crossfadeToClip = useCallback(
    async (nextIndex: number) => {
      if (transitioningRef.current) return;

      const backVideo = getBackVideo();
      const frontVideo = getFrontVideo();
      if (!backVideo || !frontVideo) return;

      const nextClip = HERO_LANDING_VIDEO_SEQUENCE[nextIndex];
      if (!nextClip) return;

      transitioningRef.current = true;
      setVideoSources(backVideo, nextClip);
      playCountRef.current = 0;
      clipIndexRef.current = nextIndex;
      dispatchHeroVideoClipChange(nextIndex);

      await new Promise<void>((resolve) => {
        const onReady = () => {
          backVideo.removeEventListener("canplay", onReady);
          resolve();
        };
        if (backVideo.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          resolve();
        } else {
          backVideo.addEventListener("canplay", onReady);
        }
      });

      await playVideo(backVideo);
      setCrossfadeActive(true);

      window.setTimeout(() => {
        frontVideo.pause();
        frontVideo.loop = false;
        frontIsARef.current = !frontIsARef.current;
        setFrontIsA(frontIsARef.current);
        setCrossfadeActive(false);
        transitioningRef.current = false;
      }, CROSSFADE_MS);
    },
    [getBackVideo, getFrontVideo],
  );

  const handleClipEnded = useCallback(() => {
    if (transitioningRef.current || !mayPlayRef.current) return;

    const frontVideo = getFrontVideo();
    if (!frontVideo) return;

    const clip = HERO_LANDING_VIDEO_SEQUENCE[clipIndexRef.current];
    if (!clip) return;

    playCountRef.current += 1;

    if (clip.loopAfterFirstPlay) {
      frontVideo.loop = true;
      void playVideo(frontVideo);
      return;
    }

    if (playCountRef.current < clip.playsBeforeAdvance) {
      frontVideo.currentTime = 0;
      void playVideo(frontVideo);
      return;
    }

    const nextIndex =
      (clipIndexRef.current + 1) % HERO_LANDING_VIDEO_SEQUENCE.length;
    void crossfadeToClip(nextIndex);
  }, [crossfadeToClip, getFrontVideo]);

  useEffect(() => {
    if (reduceMotion) return;
    const frontVideo = videoARef.current;
    if (!frontVideo) return;

    setVideoSources(frontVideo, HERO_LANDING_VIDEO_SEQUENCE[0]!);
    clipIndexRef.current = 0;
    playCountRef.current = 0;
    frontIsARef.current = true;
    setFrontIsA(true);
    dispatchHeroVideoClipChange(0);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    let retryTimer: number | undefined;
    let playAttempts = 0;

    const attemptPlay = () => {
      if (cancelled || !mayPlayRef.current) return;
      const frontVideo = getFrontVideo();
      if (!frontVideo) return;
      void playVideo(frontVideo);
    };

    const scheduleRetry = () => {
      if (cancelled || playAttempts >= PLAY_MAX_ATTEMPTS) return;
      playAttempts += 1;
      retryTimer = window.setTimeout(attemptPlay, PLAY_RETRY_MS);
    };

    const onReady = () => {
      attemptPlay();
      scheduleRetry();
    };

    const onPlaying = () => {
      playAttempts = PLAY_MAX_ATTEMPTS;
    };

    const onVisibilityChange = () => {
      if (!document.hidden) attemptPlay();
    };

    const unlock = () => {
      mayPlayRef.current = true;
      playAttempts = 0;
      attemptPlay();
    };

    const attachToFront = () => {
      const frontVideo = getFrontVideo();
      if (!frontVideo) return () => {};

      const onEnded = () => handleClipEnded();

      frontVideo.addEventListener("loadedmetadata", onReady);
      frontVideo.addEventListener("canplay", onReady);
      frontVideo.addEventListener("playing", onPlaying);
      frontVideo.addEventListener("ended", onEnded);

      return () => {
        frontVideo.removeEventListener("loadedmetadata", onReady);
        frontVideo.removeEventListener("canplay", onReady);
        frontVideo.removeEventListener("playing", onPlaying);
        frontVideo.removeEventListener("ended", onEnded);
      };
    };

    let detachFront = attachToFront();

    document.addEventListener("visibilitychange", onVisibilityChange);

    const onContentVisible = () => unlock();
    window.addEventListener("hyperia:hero-content-visible", onContentVisible);
    document.addEventListener("touchstart", unlock, { capture: true, once: true });
    document.addEventListener("click", unlock, { capture: true, once: true });

    if (playbackReady) {
      mayPlayRef.current = true;
      attemptPlay();
    }

    return () => {
      cancelled = true;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      detachFront();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("hyperia:hero-content-visible", onContentVisible);
    };
  }, [reduceMotion, playbackReady, frontIsA, getFrontVideo, handleClipEnded]);

  const videoClassName = (isFront: boolean) =>
    cn(
      "absolute inset-0 h-full w-full object-cover motion-reduce:opacity-0 transition-opacity duration-[1400ms] ease-in-out",
      isFront
        ? crossfadeActive
          ? "z-[1] opacity-0"
          : "z-[2] opacity-100"
        : crossfadeActive
          ? "z-[2] opacity-100"
          : "z-[1] opacity-0",
    );

  return (
    <>
      <div className="absolute inset-0 z-0 bg-slate-950" aria-hidden />
      <video
        ref={videoARef}
        className={videoClassName(frontIsA)}
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
      <video
        ref={videoBRef}
        className={videoClassName(!frontIsA)}
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
      <div
        className="absolute inset-y-0 left-0 z-[3] w-1/2 backdrop-blur-[2px]"
        aria-hidden
      />
    </>
  );
}
