"use client";

import { useCallback, useEffect, useState } from "react";

import { broadcastFxMuted, getFxMuted } from "@/lib/audio-fx-state";

type SoundFxToggleProps = {
  className?: string;
  buttonClassName?: string;
  labelClassName?: string;
  tone?: "on-dark" | "on-light";
  /** When false, FX stay off until the user taps (mobile menu). */
  autoEnable?: boolean;
};

function cx(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Toggles ambient SFX (hero sea, etc.) via `hyperia:fx-muted`.
 * Independent from background music (`hyperia:master-muted`).
 */
export function SoundFxToggle({
  className,
  buttonClassName,
  labelClassName,
  tone = "on-dark",
  autoEnable = true,
}: SoundFxToggleProps) {
  const [fxMuted, setFxMutedState] = useState(() =>
    autoEnable ? getFxMuted() : true,
  );

  const applyMuted = useCallback((next: boolean) => {
    setFxMutedState(next);
    broadcastFxMuted(next);
  }, []);

  useEffect(() => {
    applyMuted(!autoEnable);
  }, [applyMuted, autoEnable]);

  useEffect(() => {
    const onFx = (e: Event) => {
      const { muted } = (e as CustomEvent<{ muted: boolean }>).detail ?? {};
      if (typeof muted === "boolean") setFxMutedState(muted);
    };
    const onMaster = (e: Event) => {
      const { muted } = (e as CustomEvent<{ muted: boolean }>).detail ?? {};
      if (muted === false) applyMuted(false);
    };
    window.addEventListener("hyperia:fx-muted", onFx);
    window.addEventListener("hyperia:master-muted", onMaster);
    return () => {
      window.removeEventListener("hyperia:fx-muted", onFx);
      window.removeEventListener("hyperia:master-muted", onMaster);
    };
  }, [applyMuted]);

  const toggle = () => applyMuted(!fxMuted);

  const statusTone =
    tone === "on-dark"
      ? fxMuted
        ? "text-white/35"
        : "text-emerald-400/90"
      : fxMuted
        ? "text-[rgba(30,58,138,0.35)]"
        : "text-[#1e6bff]";

  return (
    <div className={cx("inline-flex w-full", className)}>
      <button
        type="button"
        aria-pressed={fxMuted}
        aria-label={fxMuted ? "Activar efectos de sonido" : "Silenciar efectos de sonido"}
        onClick={toggle}
        className={cx(
          "inline-flex w-full items-center justify-between gap-3 border-0 bg-transparent p-0 text-base font-medium shadow-none outline-none transition-opacity",
          "hover:opacity-90 active:opacity-80",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-0",
          tone === "on-light" && "focus-visible:ring-zinc-900/35",
          buttonClassName,
        )}
      >
        <span className={cx("select-none", labelClassName)}>FX</span>
        <span
          className={cx(
            "min-w-[2.25rem] text-right text-[10px] font-bold uppercase tracking-[0.2em]",
            statusTone,
          )}
        >
          {fxMuted ? "Off" : "On"}
        </span>
      </button>
    </div>
  );
}
