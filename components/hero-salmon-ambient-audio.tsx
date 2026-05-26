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
import type { HeroVideoClipChangeDetail } from "@/lib/hero-video-sequence";
import { measureHomeFxPresence } from "@/lib/hero-fx-presence";
import { subscribeTabAudioHidden } from "@/lib/tab-audio-visibility";

const SCROLL_FX_MIN_GAIN = 0.004;
const TAB_FX_FADE_MS = AUDIO_FADE_MS;
const SALMON_FX_FADE_OUT_MS = 520;

type FxMutedEvent = CustomEvent<{ muted: boolean }>;
type HeroVideoClipEvent = CustomEvent<HeroVideoClipChangeDetail>;

/**
 * Mar / cueva (solo `/`), sincronizado con el clip de salmón del hero.
 * Se reproduce una sola vez mientras el fishpond está activo; se apaga al cambiar de video.
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
    let onHeroClip: ((e: Event) => void) | null = null;
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
    let salmonClipActive = true;
    let seaStarted = false;
    let seaFinished = false;

    const targetGain = () => {
      if (fxMuted || tabHidden || !salmonClipActive || seaFinished) return 0;
      return HERO_SEA_AMBIENT_GAIN * heroPresence;
    };

    const stopSea = (fadeMs = SALMON_FX_FADE_OUT_MS) => {
      if (!sea || cancelled) return;
      killAudioFade(fadeToken);
      fadeAudioVolume(
        fadeToken,
        sea,
        sea.volume,
        0,
        fadeMs,
        easeOutQuad,
        () => {
          if (!cancelled && sea) {
            sea.pause();
          }
        },
      );
    };

    const applyScrollGain = () => {
      if (!sea || cancelled || !salmonClipActive || seaFinished) return;

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

      if (!seaStarted) {
        seaStarted = true;
        sea.currentTime = 0;
      }

      void sea.play().catch(() => {});
      sea.volume = clampGain(next);
    };

    const fadeToMute = () => {
      stopSea(TAB_FX_FADE_MS);
    };

    const fadeFromMute = () => {
      if (!sea || cancelled || seaFinished || !salmonClipActive) return;
      heroPresence = measureHomeFxPresence();
      const next = targetGain();
      if (next <= SCROLL_FX_MIN_GAIN) return;

      killAudioFade(fadeToken);

      if (!seaStarted) {
        seaStarted = true;
        sea.currentTime = 0;
      }

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
      if (fxMuted || tabHidden || !salmonClipActive || seaFinished) {
        fadeToMute();
        return;
      }
      applyScrollGain();
    };

    const scheduleScrollUpdate = () => {
      if (rafScroll != null) return;
      rafScroll = requestAnimationFrame(() => {
        rafScroll = null;
        if (fxMuted || tabHidden || !salmonClipActive || seaFinished) return;
        applyScrollGain();
      });
    };

    const bind = () => {
      if (cancelled) return undefined;
      const root = heroRootRef.current;
      if (!root) {
        rafBind = requestAnimationFrame(bind);
        return undefined;
      }
      rafBind = null;

      sea = new Audio(HERO_SEA_AUDIO_SRC);
      sea.loop = false;
      sea.preload = "auto";
      audioRef.current = sea;

      const onSeaEnded = () => {
        seaFinished = true;
        sea?.pause();
      };
      sea.addEventListener("ended", onSeaEnded);

      onFx = (e: Event) => {
        const { muted } = (e as FxMutedEvent).detail ?? {};
        if (typeof muted !== "boolean") return;
        fxMuted = muted;
        syncPlayback?.();
      };

      onHeroClip = (e: Event) => {
        const { isSalmon } = (e as HeroVideoClipEvent).detail ?? {};
        if (typeof isSalmon !== "boolean") return;

        salmonClipActive = isSalmon;
        if (!isSalmon) {
          stopSea();
          return;
        }

        if (!seaStarted && !seaFinished) {
          syncPlayback?.();
        }
      };

      onScroll = () => scheduleScrollUpdate();
      onResize = () => scheduleScrollUpdate();

      window.addEventListener("hyperia:fx-muted", onFx as EventListener);
      window.addEventListener("hyperia:hero-video-clip", onHeroClip as EventListener);
      window.addEventListener("hyperia:start-sound", syncPlayback);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });

      unsubscribeTab = subscribeTabAudioHidden((hidden) => {
        tabHidden = hidden;
        syncPlayback?.();
      });

      syncPlayback?.();

      return () => {
        sea?.removeEventListener("ended", onSeaEnded);
      };
    };

    let unbindSea: (() => void) | undefined;
    rafBind = requestAnimationFrame(() => {
      unbindSea = bind();
    });

    return () => {
      cancelled = true;
      if (rafBind != null) cancelAnimationFrame(rafBind);
      if (rafScroll != null) cancelAnimationFrame(rafScroll);
      if (onFx) {
        window.removeEventListener("hyperia:fx-muted", onFx as EventListener);
      }
      if (onHeroClip) {
        window.removeEventListener(
          "hyperia:hero-video-clip",
          onHeroClip as EventListener,
        );
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
      unbindSea?.();
      killAudioFade(fadeToken);
      sea?.pause();
      audioRef.current = null;
    };
  }, [pathname, heroRootRef]);

  return null;
}
