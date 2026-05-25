"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const PLAY_RETRY_MS = 400;
const PLAY_MAX_ATTEMPTS = 14;

type DivisionVideoBgProps = {
  mp4: string;
  webm: string;
  className?: string;
};

/** Muted looping division backdrop (salmon / acuícola, etc.). */
export default function DivisionVideoBg({
  mp4,
  webm,
  className = "pointer-events-none fixed inset-0 z-0 h-[100dvh] w-full overflow-hidden",
}: DivisionVideoBgProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const playAttemptsRef = useRef(0);

  useEffect(() => {
    if (reduceMotion) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
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
      if (cancelled || playAttemptsRef.current >= PLAY_MAX_ATTEMPTS) return;
      playAttemptsRef.current += 1;
      retryTimer = window.setTimeout(attemptPlay, PLAY_RETRY_MS);
    };

    const onReady = () => {
      attemptPlay();
      scheduleRetry();
    };

    const onPlaying = () => {
      playAttemptsRef.current = PLAY_MAX_ATTEMPTS;
    };

    const onVisibilityChange = () => {
      if (!document.hidden) attemptPlay();
    };

    attemptPlay();
    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("playing", onPlaying);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("playing", onPlaying);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [reduceMotion, mp4, webm]);

  return (
    <div className={className} aria-hidden>
      <div className="absolute inset-0 bg-slate-950" />
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover motion-reduce:opacity-0"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
      >
        <source src={mp4} type="video/mp4" />
        <source src={webm} type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-slate-950/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/35 to-slate-950/88" />
      <div className="absolute inset-y-0 left-0 w-1/2 backdrop-blur-[2px]" />
    </div>
  );
}
