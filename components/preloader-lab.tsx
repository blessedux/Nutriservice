"use client";

import { useEffect, useState } from "react";
import { BlueprintLoader } from "@/components/blueprint-loader";
import { cn } from "@/lib/utils";

/** Estados del proceso: cortas, claras, mismo registro (sustantivo / sustantivo + adj.) */
const LAB_PHRASES = [
  "Diagnóstico nutricional",
  "Formulación a presión",
  "Matrices lipídicas",
  "Microencapsulación",
  "Liberación controlada",
  "Estabilidad térmica",
  "Homogeneización de mezcla",
  "Dosificación precisa",
  "Curvas de solubilidad",
  "Control de humedad",
  "Envasado aséptico",
  "Trazabilidad por lote",
  "Validación analítica",
  "Optimización de proceso",
];

/** Debe coincidir con la duración en clases `animate-[preloader-phrase-*]` */
const PHRASE_ENTER_MS = 420;
const PHRASE_EXIT_MS = 420;

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

type PhrasePhase = "enter" | "stable" | "exit";

type PreloaderLabProps = {
  /** Tiempo en ms para ir de 0 a 100 */
  counterDurationMs?: number;
  /** Tiempo que la frase permanece fija tras el slide-in, antes del slide-out */
  wordIntervalMs?: number;
};

export function PreloaderLab({
  counterDurationMs = 2400,
  wordIntervalMs = 1040,
}: PreloaderLabProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<PhrasePhase>("enter");
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setPhase("enter");
      await sleep(PHRASE_ENTER_MS);
      if (cancelled) return;
      setPhase("stable");

      while (!cancelled) {
        await sleep(wordIntervalMs);
        if (cancelled) return;
        setPhase("exit");
        await sleep(PHRASE_EXIT_MS);
        if (cancelled) return;
        setPhraseIndex((i) => (i + 1) % LAB_PHRASES.length);
        setPhase("enter");
        await sleep(PHRASE_ENTER_MS);
        if (cancelled) return;
        setPhase("stable");
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [wordIntervalMs]);

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

  const phrase = LAB_PHRASES[phraseIndex];
  const progress = Math.min(1, Math.max(0, percent / 100));

  return (
    // DNA row at viewport center (same point as full-screen isotipo bg); phrase + counter sit at bottom.
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

      <div className="relative z-[1] mt-auto flex w-full min-w-0 max-w-2xl flex-col items-center gap-5 pt-6">
        <div className="relative min-h-[3.25rem] w-full overflow-hidden px-2 text-center sm:min-h-14">
          <p
            key={phraseIndex}
            className={cn(
              "font-mono absolute inset-x-0 bottom-0 mx-auto w-full max-w-prose text-balance text-sm font-medium leading-snug tracking-wide text-cyan-50/90 sm:text-base",
              phase === "enter" &&
                "animate-[preloader-phrase-enter_0.42s_ease-out_forwards]",
              phase === "stable" && "translate-y-0 opacity-100",
              phase === "exit" &&
                "animate-[preloader-phrase-exit_0.42s_ease-in_forwards]"
            )}
            aria-live="polite"
          >
            {phrase}
          </p>
        </div>

        <p className="font-mono text-[0.9375rem] font-medium tabular-nums tracking-wide text-white sm:text-[1.125rem]">
          {percent}
          <span className="text-[0.75rem] text-white/60 sm:text-[0.9375rem]">
            %
          </span>
        </p>
      </div>
    </div>
  );
}
