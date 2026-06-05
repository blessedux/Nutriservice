"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import {
  getDivisionVideoSources,
  preloadDivisionVideos,
} from "@/lib/division-video-preload";
import type { ProductoDivisionSlug } from "@/lib/productos-divisions";
import { cn } from "@/lib/utils";

const PLAY_RETRY_MS = 400;
const PLAY_MAX_ATTEMPTS = 12;
const CROSSFADE_MS = 700;

const DIVISION_VIDEO_SOURCES = getDivisionVideoSources();

type DivisionVideosBgProps = {
  activeSlug?: ProductoDivisionSlug;
  className?: string;
};

/** All division backdrops stay mounted; opacity crossfade on `activeSlug` change. */
export default function DivisionVideosBg({
  activeSlug,
  className = "pointer-events-none fixed inset-0 z-0 h-[100dvh] w-full overflow-hidden",
}: DivisionVideosBgProps) {
  const reduceMotion = useReducedMotion();
  const videoRefs = useRef<Partial<Record<ProductoDivisionSlug, HTMLVideoElement>>>(
    {},
  );

  useEffect(() => {
    preloadDivisionVideos().catch(() => {});
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const attemptPlay = (video: HTMLVideoElement) => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
        video.load();
      }
      void video.play().catch(() => {});
    };

    for (const { slug } of DIVISION_VIDEO_SOURCES) {
      const video = videoRefs.current[slug];
      if (!video) continue;

      if (slug === activeSlug) {
        attemptPlay(video);
      } else {
        video.pause();
      }
    }
  }, [activeSlug, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !activeSlug) return;

    const video = videoRefs.current[activeSlug];
    if (!video) return;

    let cancelled = false;
    let attempts = 0;
    let retryTimer: number | undefined;

    const attemptPlay = () => {
      if (cancelled) return;
      video.muted = true;
      video.playsInline = true;
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
  }, [activeSlug, reduceMotion]);

  const showVideos = Boolean(activeSlug);

  return (
    <div className={className} aria-hidden>
      <div className="absolute inset-0 bg-slate-950" />

      {DIVISION_VIDEO_SOURCES.map(({ slug, mp4, webm }) => {
        const isActive = showVideos && activeSlug === slug;
        return (
          <video
            key={slug}
            ref={(el) => {
              if (el) videoRefs.current[slug] = el;
              else delete videoRefs.current[slug];
            }}
            className={cn(
              "absolute inset-0 h-full w-full object-cover motion-reduce:opacity-0",
              reduceMotion
                ? isActive
                  ? "opacity-100"
                  : "opacity-0"
                : cn(
                    "transition-opacity ease-out",
                    isActive ? "z-[2] opacity-100" : "z-[1] opacity-0",
                  ),
            )}
            style={
              reduceMotion
                ? undefined
                : { transitionDuration: `${CROSSFADE_MS}ms` }
            }
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
          >
            {mp4 ? <source src={mp4} type="video/mp4" /> : null}
            <source src={webm} type="video/webm" />
          </video>
        );
      })}

      <div
        className={cn(
          "absolute inset-0 bg-slate-950/50 transition-opacity ease-out",
          showVideos ? "opacity-100" : "opacity-0",
        )}
        style={reduceMotion ? undefined : { transitionDuration: `${CROSSFADE_MS}ms` }}
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/35 to-slate-950/88 transition-opacity ease-out",
          showVideos ? "opacity-100" : "opacity-0",
        )}
        style={reduceMotion ? undefined : { transitionDuration: `${CROSSFADE_MS}ms` }}
      />
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-1/2 backdrop-blur-[2px] transition-opacity ease-out",
          showVideos ? "opacity-100" : "opacity-0",
        )}
        style={reduceMotion ? undefined : { transitionDuration: `${CROSSFADE_MS}ms` }}
      />
    </div>
  );
}
