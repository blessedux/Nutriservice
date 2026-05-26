"use client";

import { useEffect, useState } from "react";
import { BlueprintLoader } from "@/components/blueprint-loader";

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}

type PreloaderLabProps = {
  /** Tiempo en ms para ir de 0 a 100 */
  counterDurationMs?: number;
};

export function PreloaderLab({
  counterDurationMs = 2400,
}: PreloaderLabProps) {
  const [percent, setPercent] = useState(0);

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

      <p className="relative z-[1] mt-auto font-mono text-[0.9375rem] font-medium tabular-nums tracking-wide text-white sm:text-[1.125rem]">
        {percent}
        <span className="text-[0.75rem] text-white/60 sm:text-[0.9375rem]">
          %
        </span>
      </p>
    </div>
  );
}
