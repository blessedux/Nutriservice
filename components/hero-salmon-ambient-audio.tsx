"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type RefObject } from "react";

import {
  HERO_SEA_AMBIENT_GAIN,
  HERO_SEA_AUDIO_SRC,
} from "@/lib/audio-gain";
import { AUDIO_FADE_MS } from "@/lib/audio-constants";
import {
  clampGain,
  easeInQuad,
  easeOutQuad,
  fadeAudioVolume,
  killAudioFade,
} from "@/lib/audio-fade";
import { getFxMuted } from "@/lib/audio-fx-state";
import { measureHomeFxPresence } from "@/lib/hero-fx-presence";
import { subscribeTabAudioHidden } from "@/lib/tab-audio-visibility";

const SCROLL_FX_MIN_GAIN = 0.004;
const TAB_FX_FADE_MS = AUDIO_FADE_MS;

type FxMutedEvent = CustomEvent<{ muted: boolean }>;

/**
 * Mar / cueva (solo `/`). SFX pleno al inicio; atenúa desde el primer scroll
 * y queda en silencio al llegar a industrias (antes de pasarla). Respeta mute FX y tab oculta.
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
    let onFx: ((e: Event) => void) | null = null;
    let unsubscribeTab: (() => void) | null = null;
    let onScroll: (() => void) | null = null;
    let onResize: (() => void) | null = null;
    let syncPlayback: (() => void) | null = null;
    let rafScroll: number | null = null;
    let rafBind: number | null = null;
    const fadeToken = { gen: 0, raf: null as number | null };

    let fxMuted = getFxMuted();
    let tabHidden = false;
    let heroPresence = 1;

    const targetGain = () => {
      if (fxMuted || tabHidden) return 0;
      return HERO_SEA_AMBIENT_GAIN * heroPresence;
    };

    const applyScrollGain = () => {
      if (!sea || cancelled) return;

      heroPresence = measureHomeFxPresence();
      const next = targetGain();

      killAudioFade(fadeToken);

      if (next <= SCROLL_FX_MIN_GAIN) {
        fadeAudioVolume(
          fadeToken,
          sea,
          sea.volume,
          0,
          420,
          easeOutQuad,
          () => {
            if (!cancelled && sea && targetGain() <= SCROLL_FX_MIN_GAIN) {
              sea.pause();
            }
          },
        );
        return;
      }

      void sea.play().catch(() => {});
      sea.volume = clampGain(next);
    };

    const fadeToMute = () => {
      if (!sea || cancelled) return;
      killAudioFade(fadeToken);
      fadeAudioVolume(
        fadeToken,
        sea,
        sea.volume,
        0,
        TAB_FX_FADE_MS,
        easeOutQuad,
        () => {
          if (!cancelled && sea && (fxMuted || tabHidden)) {
            sea.pause();
          }
        },
      );
    };

    const fadeFromMute = () => {
      if (!sea || cancelled) return;
      heroPresence = measureHomeFxPresence();
      const next = targetGain();
      if (next <= SCROLL_FX_MIN_GAIN) return;

      killAudioFade(fadeToken);
      void sea
        .play()
        .then(() => {
          if (!cancelled && sea) {
            fadeAudioVolume(
              fadeToken,
              sea,
              sea.volume,
              next,
              TAB_FX_FADE_MS,
              easeInQuad,
            );
          }
        })
        .catch(() => {});
    };

    syncPlayback = () => {
      if (!sea || cancelled) return;
      if (fxMuted || tabHidden) {
        fadeToMute();
        return;
      }
      applyScrollGain();
    };

    const scheduleScrollUpdate = () => {
      if (rafScroll != null) return;
      rafScroll = requestAnimationFrame(() => {
        rafScroll = null;
        if (fxMuted || tabHidden) return;
        applyScrollGain();
      });
    };

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

      onFx = (e: Event) => {
        const { muted } = (e as FxMutedEvent).detail ?? {};
        if (typeof muted !== "boolean") return;
        fxMuted = muted;
        syncPlayback();
      };

      onScroll = () => scheduleScrollUpdate();
      onResize = () => scheduleScrollUpdate();

      window.addEventListener("hyperia:fx-muted", onFx as EventListener);
      window.addEventListener("hyperia:start-sound", syncPlayback);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });

      unsubscribeTab = subscribeTabAudioHidden((hidden) => {
        tabHidden = hidden;
        syncPlayback();
      });

      syncPlayback();
    };

    rafBind = requestAnimationFrame(bind);

    return () => {
      cancelled = true;
      if (rafBind != null) cancelAnimationFrame(rafBind);
      if (rafScroll != null) cancelAnimationFrame(rafScroll);
      if (onFx) {
        window.removeEventListener("hyperia:fx-muted", onFx as EventListener);
      }
      if (syncPlayback) {
        window.removeEventListener("hyperia:start-sound", syncPlayback);
      }
      if (onScroll) {
        window.removeEventListener("scroll", onScroll);
      }
      if (onResize) {
        window.removeEventListener("resize", onResize);
      }
      unsubscribeTab?.();
      killAudioFade(fadeToken);
      sea?.pause();
      audioRef.current = null;
    };
  }, [pathname, heroRootRef]);

  return null;
}
