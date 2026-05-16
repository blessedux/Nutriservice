"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type RefObject } from "react";

import {
  HERO_SEA_AMBIENT_GAIN,
  HERO_SEA_AUDIO_SRC,
} from "@/lib/audio-gain";
import { getAmbientMasterMuted } from "@/lib/audio-master-state";

type MasterMutedEvent = CustomEvent<{ muted: boolean }>;

/**
 * Mar / cueva bajo el video del hero (solo `/`). Solo suena si el hero intersecta el viewport
 * (cualquier fracción visible). Respeta mute global y `hyperia:start-sound`.
 */
export function HeroSalmonAmbientAudio({
  heroRootRef,
}: {
  heroRootRef: RefObject<HTMLElement | null>;
}) {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (pathname !== "/") {
      audioRef.current?.pause();
      audioRef.current = null;
      return;
    }

    let cancelled = false;
    let sea: HTMLAudioElement | null = null;
    let io: IntersectionObserver | null = null;
    let onMaster: ((e: Event) => void) | null = null;
    let syncPlayback: (() => void) | null = null;
    let rafBind: number | null = null;

    const bind = () => {
      if (cancelled) return;
      const root = heroRootRef.current;
      if (!root) {
        rafBind = requestAnimationFrame(bind);
        return;
      }
      rafBind = null;

      sea = new Audio(HERO_SEA_AUDIO_SRC);
      sea.loop = true;
      sea.preload = "auto";
      audioRef.current = sea;

      let heroVisible = false;
      let masterMuted = getAmbientMasterMuted();

      syncPlayback = () => {
        if (!sea || cancelled) return;
        sea.volume = masterMuted ? 0 : HERO_SEA_AMBIENT_GAIN;
        if (!heroVisible) {
          sea.pause();
          return;
        }
        void sea.play().catch(() => {});
      };

      onMaster = (e: Event) => {
        const { muted } = (e as MasterMutedEvent).detail ?? {};
        if (typeof muted !== "boolean") return;
        masterMuted = muted;
        syncPlayback?.();
      };

      io = new IntersectionObserver(
        (entries) => {
          heroVisible = Boolean(entries[0]?.isIntersecting);
          syncPlayback?.();
        },
        { threshold: 0, rootMargin: "0px" },
      );
      io.observe(root);

      window.addEventListener(
        "hyperia:master-muted",
        onMaster as EventListener,
      );
      window.addEventListener("hyperia:start-sound", syncPlayback);

      syncPlayback();
    };

    rafBind = requestAnimationFrame(bind);

    return () => {
      cancelled = true;
      if (rafBind != null) cancelAnimationFrame(rafBind);
      if (onMaster && syncPlayback) {
        window.removeEventListener(
          "hyperia:master-muted",
          onMaster as EventListener,
        );
        window.removeEventListener("hyperia:start-sound", syncPlayback);
      }
      io?.disconnect();
      sea?.pause();
      audioRef.current = null;
    };
  }, [pathname, heroRootRef]);

  return null;
}
