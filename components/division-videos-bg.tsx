"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { getDivisionVideoSources } from "@/lib/division-video-preload";
import type { ProductoDivisionSlug } from "@/lib/productos-divisions";
import { shouldAttemptBackgroundVideo } from "@/lib/video-capabilities";
import { cn } from "@/lib/utils";

const PLAY_RETRY_MS = 400;
const PLAY_MAX_ATTEMPTS = 12;
const CROSSFADE_MS = 700;

const DIVISION_VIDEO_SOURCES = getDivisionVideoSources();

type DivisionVideosBgProps = {
  activeSlug?: ProductoDivisionSlug;
  className?: string;
};

/** Only active division video is mounted and loaded */
export default function DivisionVideosBg({
  activeSlug,
  className = "pointer-events-none fixed inset-0 z-0 h-[100dvh] w-full overflow-hidden",
}: DivisionVideosBgProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canAttemptVideo, setCanAttemptVideo] = useState(true);

  useEffect(() => {
    setCanAttemptVideo(shouldAttemptBackgroundVideo());
  }, []);

  useEffect(() => {
    if (reduceMotion || !canAttemptVideo || !activeSlug) return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let attempts = 0;
    let retryTimer: number | undefined;

    const attemptPlay = () => {
      if (cancelled) return;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
        video.load();
      }
      void video.play().catch(() => {});
    };

    const scheduleRetry = () => {
      if (cancelled || attempts >= PLAY_MAX_ATTEMPTS) return;
      attempts += 1;
      retryTimer = window.setTimeout(attemptPlay, PLAY_RETRY_MS);
    };

    const onReady = () => {
      attemptPlay();
      scheduleRetry();
    };

    const onPlaying = () => {
      attempts = PLAY_MAX_ATTEMPTS;
    };

    attemptPlay();
    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("playing", onPlaying);

    return () => {
      cancelled = true;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("playing", onPlaying);
    };
  }, [activeSlug, reduceMotion, canAttemptVideo]);

  const showVideo = Boolean(activeSlug) && canAttemptVideo && !reduceMotion;
  const activeSource = DIVISION_VIDEO_SOURCES.find((s) => s.slug === activeSlug);

  return (
    <div className={className} aria-hidden>
      <div className="absolute inset-0 bg-slate-950" />

      {showVideo && activeSource ? (
        <video
          key={activeSlug}
          ref={videoRef}
          className={cn(
            "absolute inset-0 z-[2] h-full w-full object-cover transition-opacity ease-out",
            activeSource.slug === "mascotas" && "max-lg:object-[30%_center]",
          )}
          style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
        >
          {activeSource.mp4 ? (
            <source src={activeSource.mp4} type="video/mp4" />
          ) : null}
          <source src={activeSource.webm} type="video/webm" />
        </video>
      ) : null}

      <div
        className={cn(
          "absolute inset-0 bg-slate-950/50 transition-opacity ease-out",
          showVideo ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
      />
      <div
        className={cn(
          "absolute inset-0 bg-slate-950/25 transition-opacity ease-out",
          showVideo && activeSlug === "aves" ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/35 to-slate-950/88 transition-opacity ease-out",
          showVideo ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
      />
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-1/2 backdrop-blur-[2px] transition-opacity ease-out",
          showVideo ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
      />
    </div>
  );
}
