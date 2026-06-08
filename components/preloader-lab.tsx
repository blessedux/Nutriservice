"use client";

import { useEffect, useState } from "react";
import { BlueprintLoader } from "@/components/blueprint-loader";

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}

type PreloaderLabProps = {
  /** Tiempo en ms para ir de 0 a 100 */
  counterDurationMs?: number;
  /** True once the page has loaded and the minimum display time has elapsed. */
  enterReady?: boolean;
  /** Called when the user clicks Enter; receives the sound preference. */
  onEnter?: (soundEnabled: boolean) => void;
};

export function PreloaderLab({
  counterDurationMs = 2400,
  enterReady = false,
  onEnter,
}: PreloaderLabProps) {
  const [percent, setPercent] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / counterDurationMs);
      const p = Math.min(100, Math.floor(easeOutQuad(t) * 100));
      setPercent(p);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else if (!cancelled) {
        setPercent(100);
      }
    };

    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [counterDurationMs]);

  const progress = Math.min(1, Math.max(0, percent / 100));

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center px-4 pb-10">
      {/* Progress bar + logo — centred */}
      <div className="absolute left-1/2 top-1/2 w-full max-w-2xl min-w-0 -translate-x-1/2 -translate-y-1/2">
        <div className="flex w-full min-w-0 items-center gap-1 sm:gap-2">
          <div
            className="relative h-0.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20"
            aria-hidden
          >
            <div
              className="absolute right-0 top-0 h-full w-full origin-right rounded-l-full bg-ns-green will-change-transform"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <BlueprintLoader className="shrink-0 scale-100" />
          <div
            className="relative h-0.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20"
            aria-hidden
          >
            <div
              className="absolute left-0 top-0 h-full w-full origin-left rounded-r-full bg-ns-green will-change-transform"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom stack: counter + sound toggle + enter */}
      <div className="relative z-[1] mt-auto flex w-full flex-col items-center gap-5">
        {/* Percentage counter */}
        <p className="font-mono text-[0.9375rem] font-medium tabular-nums tracking-wide text-white sm:text-[1.125rem]">
          {percent}
          <span className="text-[0.75rem] text-white/60 sm:text-[0.9375rem]">
            %
          </span>
        </p>

        {/* Sound preference + Enter — fades in once loading is done */}
        <div
          className="flex flex-col items-center gap-4 transition-[opacity,transform] duration-500 ease-out"
          style={{
            opacity: enterReady ? 1 : 0,
            transform: enterReady ? "translateY(0)" : "translateY(6px)",
            pointerEvents: enterReady ? "auto" : "none",
          }}
          aria-hidden={!enterReady}
        >
          {/* Label */}
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-white/45">
            ¿Con sonido?
          </p>

          {/* Off / On segmented toggle */}
          <div
            role="group"
            aria-label="Preferencia de sonido"
            className="flex items-center gap-px rounded-full border border-white/15 bg-white/[0.06] p-[3px] backdrop-blur-md"
          >
            {(
              [
                { value: false, label: "Sin sonido" },
                { value: true, label: "Con sonido" },
              ] as const
            ).map(({ value, label }) => {
              const active = soundEnabled === value;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSoundEnabled(value)}
                  className={[
                    "rounded-full px-4 py-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] transition-colors duration-200",
                    active
                      ? "bg-white/18 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                      : "text-white/40 hover:text-white/65",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Enter button */}
          <button
            type="button"
            aria-disabled={!enterReady}
            onClick={() => {
              if (!enterReady) return;
              onEnter?.(soundEnabled);
            }}
            className="rounded-full border border-white/25 bg-white/10 px-10 py-3 font-mono text-[0.8125rem] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/18 active:scale-[0.98]"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
