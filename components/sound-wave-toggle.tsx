"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";

import { AUDIO_FADE_MS } from "@/lib/audio-constants";
import { broadcastFxMuted } from "@/lib/audio-fx-state";
import { setAmbientMasterMuted } from "@/lib/audio-master-state";
import { easeInQuad, easeOutQuad } from "@/lib/audio-fade";
import { subscribeTabAudioHidden } from "@/lib/tab-audio-visibility";

const BASE_AMPLITUDE = 5;
const CANVAS_LOGICAL_PX = 56;
const DETAILS = 20;
const POINT_COUNT = DETAILS * 24;
const FADE_MS = AUDIO_FADE_MS;

type WaveTone = "on-dark" | "on-light";

type WaveParams = {
  speed: number;
  amplitude: number;
  frequency: number;
};

type FadeRefs = {
  gen: MutableRefObject<number>;
  raf: MutableRefObject<number | null>;
};

function defaultParams(): WaveParams {
  return {
    speed: 0.03,
    amplitude: BASE_AMPLITUDE,
    frequency: 0.4,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function killFade(refs: FadeRefs) {
  refs.gen.current += 1;
  if (refs.raf.current != null) {
    cancelAnimationFrame(refs.raf.current);
    refs.raf.current = null;
  }
}

function fadeVolumeAmplitude(
  refs: FadeRefs,
  audio: HTMLAudioElement,
  params: WaveParams,
  volFrom: number,
  volTo: number,
  ampFrom: number,
  ampTo: number,
  durationMs: number,
  ease: (t: number) => number,
  onComplete?: () => void,
) {
  killFade(refs);
  const token = refs.gen.current;
  const t0 = performance.now();
  const step = (now: number) => {
    if (token !== refs.gen.current) return;
    const raw = Math.min(1, (now - t0) / durationMs);
    const k = ease(raw);
    audio.volume = clamp(volFrom + (volTo - volFrom) * k, 0, 1);
    params.amplitude = ampFrom + (ampTo - ampFrom) * k;
    if (raw < 1) {
      refs.raf.current = requestAnimationFrame(step);
    } else {
      refs.raf.current = null;
      audio.volume = clamp(volTo, 0, 1);
      params.amplitude = ampTo;
      onComplete?.();
    }
  };
  refs.raf.current = requestAnimationFrame(step);
}

function cx(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export type SoundWaveToggleProps = {
  /** Public URL to looped audio (e.g. `/First_Blossom.mp3` in `public/`) */
  audioSrc: string;
  /** Caps unmuted volume (`HTMLMediaElement.volume`, 0–1). Default 1 (0 dBFS). */
  maxLinearGain?: number;
  className?: string;
  buttonClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
  label?: string;
  /** Stroke gradient: light wave on dark UI vs dark wave on light UI */
  tone?: WaveTone;
  /** When false, audio stays muted until the user taps the control (mobile menu). */
  autoBootstrap?: boolean;
};

/**
 * Canvas waveform + looping audio. Volume-only mute (playback keeps running).
 * Autoplay on mount when allowed; optional `window` event `hyperia:start-sound` retries.
 */
export function SoundWaveToggle({
  audioSrc,
  maxLinearGain = 1,
  className,
  buttonClassName,
  labelClassName,
  showLabel = true,
  label = "Sound",
  tone = "on-dark",
  autoBootstrap = true,
}: SoundWaveToggleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const maxLinearGainRef = useRef(maxLinearGain);
  useEffect(() => {
    maxLinearGainRef.current = clamp(maxLinearGain, 0, 1);
  }, [maxLinearGain]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const paramsRef = useRef<WaveParams>(defaultParams());
  const pointsRef = useRef<number[]>([]);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const aliveRef = useRef(false);
  const isFadingRef = useRef(false);
  const isMutedRef = useRef(false);
  const audioSessionReadyRef = useRef(false);
  const toneRef = useRef<WaveTone>(tone);
  const fadeGenRef = useRef(0);
  const fadeAnimRafRef = useRef<number | null>(null);
  const autoBootstrapRef = useRef(autoBootstrap);

  useEffect(() => {
    autoBootstrapRef.current = autoBootstrap;
  }, [autoBootstrap]);

  const fadeRefs = useMemo<FadeRefs>(
    () => ({ gen: fadeGenRef, raf: fadeAnimRafRef }),
    [],
  );

  const [isMuted, setIsMuted] = useState(() => !autoBootstrap);

  useEffect(() => {
    toneRef.current = tone;
  }, [tone]);

  const setMuted = useCallback((next: boolean) => {
    isMutedRef.current = next;
    setIsMuted(next);
  }, []);

  const fadeToMute = useCallback(() => {
    const audio = audioRef.current;
    const params = paramsRef.current;
    if (!audio || isFadingRef.current) return;
    isFadingRef.current = true;
    isMutedRef.current = true;
    setMuted(true);
    fadeVolumeAmplitude(
      fadeRefs,
      audio,
      params,
      audio.volume,
      0,
      params.amplitude,
      0,
      FADE_MS,
      easeOutQuad,
      () => {
        isFadingRef.current = false;
      },
    );
  }, [fadeRefs, setMuted]);

  const fadeToUnmute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isFadingRef.current) return;
    isFadingRef.current = true;
    void audio
      .play()
      .then(() => {
        if (!aliveRef.current || !audioRef.current) {
          isFadingRef.current = false;
          return;
        }
        audioSessionReadyRef.current = true;
        isMutedRef.current = false;
        setMuted(false);
        const a = audioRef.current;
        const p = paramsRef.current;
        fadeVolumeAmplitude(
          fadeRefs,
          a,
          p,
          a.volume,
          maxLinearGainRef.current,
          p.amplitude,
          BASE_AMPLITUDE,
          FADE_MS,
          easeInQuad,
          () => {
            isFadingRef.current = false;
          },
        );
      })
      .catch((err) => {
        console.warn("Sound playback failed (check audioSrc / format).", err);
        isFadingRef.current = false;
      });
  }, [fadeRefs, setMuted]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current || isFadingRef.current) return;
    if (isMutedRef.current) {
      fadeToUnmute();
    } else {
      fadeToMute();
    }
  }, [fadeToMute, fadeToUnmute]);

  useEffect(() => {
    aliveRef.current = true;
    paramsRef.current = defaultParams();
    pointsRef.current = Array.from({ length: POINT_COUNT }, (_, i) =>
      Math.sin((i * Math.PI) / DETAILS),
    );
    tRef.current = 0;

    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    const bootstrapAudible = async () => {
      if (!autoBootstrapRef.current) return;
      const a = audioRef.current;
      if (!a || audioSessionReadyRef.current) return;
      a.volume = 0;
      try {
        await a.play();
        if (!aliveRef.current) return;
        audioSessionReadyRef.current = true;
        const p = paramsRef.current;
        p.amplitude = 0;
        isFadingRef.current = true;
        isMutedRef.current = false;
        setMuted(false);
        fadeVolumeAmplitude(
          fadeRefs,
          a,
          p,
          0,
          maxLinearGainRef.current,
          0,
          BASE_AMPLITUDE,
          FADE_MS,
          easeOutQuad,
          () => {
            isFadingRef.current = false;
          },
        );
      } catch (err) {
        console.warn(
          "Audio autoplay was prevented. Tap Sound to enable.",
          err,
        );
        if (!aliveRef.current) return;
        a.volume = 0;
        paramsRef.current.amplitude = 0;
        isMutedRef.current = true;
        setMuted(true);
      }
    };

    if (!autoBootstrapRef.current) {
      isMutedRef.current = true;
      paramsRef.current.amplitude = 0;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
    ctxRef.current = ctx;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_LOGICAL_PX * dpr;
    canvas.height = CANVAS_LOGICAL_PX * dpr;
    canvas.style.width = `${CANVAS_LOGICAL_PX}px`;
    canvas.style.height = `${CANVAS_LOGICAL_PX}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const calc = () => {
      const t = tRef.current;
      const pts = pointsRef.current;
      for (let i = 0; i < pts.length; i++) {
        pts[i] = Math.sin((i * Math.PI) / DETAILS + t);
      }
    };

    const draw = () => {
      const context = ctxRef.current;
      if (!context) return;
      const { frequency, amplitude } = paramsRef.current;
      const size = CANVAS_LOGICAL_PX;
      const waveTone = toneRef.current;

      context.clearRect(0, 0, size, size);
      const gradient = context.createLinearGradient(0, 0, size, 0);
      if (waveTone === "on-dark") {
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.5, "white");
        gradient.addColorStop(1, "rgba(255,255,255,1)");
      } else {
        gradient.addColorStop(0, "rgba(0,0,0,0.85)");
        gradient.addColorStop(0.5, "rgba(0,0,0,1)");
        gradient.addColorStop(1, "rgba(0,0,0,0.85)");
      }

      context.beginPath();
      context.strokeStyle = gradient;
      context.lineWidth = 1;
      context.moveTo(0, size / 2);
      const pts = pointsRef.current;
      for (let index = 0; index < pts.length; index++) {
        const x = index * frequency;
        const envelope = clamp(index / 10, 0, 1);
        const y = pts[index]! * amplitude * envelope + size / 2;
        context.lineTo(x, y);
      }
      context.stroke();
    };

    const tick = () => {
      if (!aliveRef.current) return;
      tRef.current += paramsRef.current.speed;
      calc();
      draw();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    if (autoBootstrapRef.current) {
      void bootstrapAudible();
    }

    const onStartSound = () => {
      if (autoBootstrapRef.current) void bootstrapAudible();
    };
    window.addEventListener("hyperia:start-sound", onStartSound);

    const duckForHiddenTab = () => {
      const a = audioRef.current;
      if (!a) return;
      killFade(fadeRefs);
      isFadingRef.current = false;
      fadeVolumeAmplitude(
        fadeRefs,
        a,
        paramsRef.current,
        a.volume,
        0,
        paramsRef.current.amplitude,
        0,
        FADE_MS,
        easeOutQuad,
        () => {
          if (!aliveRef.current || !audioRef.current) return;
          audioRef.current.pause();
        },
      );
    };

    const restoreAfterVisibleTab = () => {
      const a = audioRef.current;
      if (!a || isMutedRef.current || !audioSessionReadyRef.current) return;
      killFade(fadeRefs);
      isFadingRef.current = true;
      void a
        .play()
        .then(() => {
          if (!aliveRef.current || !audioRef.current) {
            isFadingRef.current = false;
            return;
          }
          const playing = audioRef.current;
          const params = paramsRef.current;
          fadeVolumeAmplitude(
            fadeRefs,
            playing,
            params,
            playing.volume,
            maxLinearGainRef.current,
            0,
            BASE_AMPLITUDE,
            FADE_MS,
            easeInQuad,
            () => {
              isFadingRef.current = false;
            },
          );
        })
        .catch(() => {
          isFadingRef.current = false;
        });
    };

    const unsubscribeTab = subscribeTabAudioHidden((hidden) => {
      if (hidden) {
        duckForHiddenTab();
      } else {
        restoreAfterVisibleTab();
      }
    });

    return () => {
      aliveRef.current = false;
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      killFade(fadeRefs);
      unsubscribeTab();
      window.removeEventListener("hyperia:start-sound", onStartSound);
      const a = audioRef.current;
      if (a) {
        a.pause();
        audioRef.current = null;
      }
      ctxRef.current = null;
      isFadingRef.current = false;
      audioSessionReadyRef.current = false;
    };
  }, [audioSrc, fadeRefs, setMuted]);

  useEffect(() => {
    setAmbientMasterMuted(isMuted);
    window.dispatchEvent(
      new CustomEvent<{ muted: boolean }>("hyperia:master-muted", {
        detail: { muted: isMuted },
      }),
    );
    if (!isMuted) {
      broadcastFxMuted(false);
    }
  }, [isMuted]);

  return (
    <div className={cx("inline-flex", className)}>
      <button
        type="button"
        aria-pressed={isMuted}
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        onClick={toggleMute}
        className={cx(
          "inline-flex items-center gap-3 border-0 bg-transparent p-0 text-base font-medium text-zinc-100 shadow-none outline-none transition-opacity",
          "hover:opacity-90 active:opacity-80",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-0",
          "disabled:pointer-events-none disabled:opacity-50",
          tone === "on-light" && "text-zinc-900 focus-visible:ring-zinc-900/35",
          buttonClassName,
        )}
      >
        {showLabel ? (
          <span className={cx("select-none", labelClassName)}>{label}</span>
        ) : null}
        <canvas
          ref={canvasRef}
          className="block shrink-0"
          width={CANVAS_LOGICAL_PX * 2}
          height={CANVAS_LOGICAL_PX * 2}
          style={{ width: CANVAS_LOGICAL_PX, height: CANVAS_LOGICAL_PX }}
          aria-hidden
        />
      </button>
    </div>
  );
}
