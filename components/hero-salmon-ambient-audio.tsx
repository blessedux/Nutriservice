"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type RefObject } from "react";

import {
  HERO_SEA_AMBIENT_GAIN,
  HERO_SEA_AUDIO_SRC,
} from "@/lib/audio-gain";
import { AUDIO_FADE_MS } from "@/lib/audio-constants";
import {
  easeInQuad,
  easeOutQuad,
  fadeAudioVolume,
  killAudioFade,
} from "@/lib/audio-fade";
import { getFxMuted } from "@/lib/audio-fx-state";
import { subscribeTabAudioHidden } from "@/lib/tab-audio-visibility";

type FxMutedEvent = CustomEvent<{ muted: boolean }>;

/**
 * Mar / cueva bajo el video del hero (solo `/`). Solo suena si el hero intersecta el viewport.
 * Respeta mute FX (independiente de la música), tab en segundo plano y `hyperia:start-sound`.
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
    let onFx: ((e: Event) => void) | null = null;
    let unsubscribeTab: (() => void) | null = null;
    let syncPlayback: (() => void) | null = null;
    let rafBind: number | null = null;
    const fadeToken = { gen: 0, raf: null as number | null };

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
      let fxMuted = getFxMuted();
      let tabHidden = false;

      syncPlayback = () => {
        if (!sea || cancelled) return;
        const silenced = fxMuted || tabHidden;
        const nextGain = silenced ? 0 : HERO_SEA_AMBIENT_GAIN;
        fadeAudioVolume(
          fadeToken,
          sea,
          sea.volume,
          nextGain,
          AUDIO_FADE_MS,
          silenced ? easeOutQuad : easeInQuad,
        );

        if (!heroVisible || fxMuted || tabHidden) {
          sea.pause();
          return;
        }
        void sea.play().catch(() => {});
      };

      onFx = (e: Event) => {
        const { muted } = (e as FxMutedEvent).detail ?? {};
        if (typeof muted !== "boolean") return;
        fxMuted = muted;
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

      window.addEventListener("hyperia:fx-muted", onFx as EventListener);
      window.addEventListener("hyperia:start-sound", syncPlayback);

      unsubscribeTab = subscribeTabAudioHidden((hidden) => {
        tabHidden = hidden;
        syncPlayback?.();
      });

      syncPlayback();
    };

    rafBind = requestAnimationFrame(bind);

    return () => {
      cancelled = true;
      if (rafBind != null) cancelAnimationFrame(rafBind);
      if (onFx) {
        window.removeEventListener("hyperia:fx-muted", onFx as EventListener);
      }
      if (syncPlayback) {
        window.removeEventListener("hyperia:start-sound", syncPlayback);
      }
      unsubscribeTab?.();
      io?.disconnect();
      killAudioFade(fadeToken);
      sea?.pause();
      audioRef.current = null;
    };
  }, [pathname, heroRootRef]);

  return null;
}
