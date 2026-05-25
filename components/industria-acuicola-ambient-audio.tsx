"use client";

import { useEffect, useRef } from "react";

import { AUDIO_FADE_MS } from "@/lib/audio-constants";
import {
  HERO_SEA_AMBIENT_GAIN,
  HERO_SEA_AUDIO_SRC,
} from "@/lib/audio-gain";
import {
  broadcastFxMuted,
  getFxMuted,
} from "@/lib/audio-fx-state";
import {
  easeInQuad,
  easeOutQuad,
  fadeAudioVolume,
  killAudioFade,
} from "@/lib/audio-fade";
import { subscribeTabAudioHidden } from "@/lib/tab-audio-visibility";

const TAB_FX_FADE_MS = AUDIO_FADE_MS;

type FxMutedEvent = CustomEvent<{ muted: boolean }>;

/** Sea ambient loop for `/industrias/acuicola` — respects FX mute and tab visibility. */
export default function IndustriaAcuicolaAmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    broadcastFxMuted(false);

    let cancelled = false;
    let sea: HTMLAudioElement | null = null;
    let onFx: ((e: Event) => void) | null = null;
    let unsubscribeTab: (() => void) | null = null;
    const fadeToken = { gen: 0, raf: null as number | null };

    let fxMuted = getFxMuted();
    let tabHidden = false;

    const targetGain = () => {
      if (fxMuted || tabHidden) return 0;
      return HERO_SEA_AMBIENT_GAIN;
    };

    const syncPlayback = () => {
      if (!sea || cancelled) return;
      const next = targetGain();
      killAudioFade(fadeToken);

      if (next <= 0) {
        fadeAudioVolume(
          fadeToken,
          sea,
          sea.volume,
          0,
          TAB_FX_FADE_MS,
          easeOutQuad,
          () => {
            if (!cancelled && sea && targetGain() <= 0) {
              sea.pause();
            }
          },
        );
        return;
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

    window.addEventListener("hyperia:fx-muted", onFx as EventListener);
    window.addEventListener("hyperia:start-sound", syncPlayback);

    unsubscribeTab = subscribeTabAudioHidden((hidden) => {
      tabHidden = hidden;
      syncPlayback();
    });

    syncPlayback();

    return () => {
      cancelled = true;
      if (onFx) {
        window.removeEventListener("hyperia:fx-muted", onFx as EventListener);
      }
      window.removeEventListener("hyperia:start-sound", syncPlayback);
      unsubscribeTab?.();
      killAudioFade(fadeToken);
      sea?.pause();
      audioRef.current = null;
    };
  }, []);

  return null;
}
