"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type HeroCtaTone = "on-dark" | "on-light";

/** Matches `hero-head-line-up` duration in `globals.css`. */
const HERO_LINE_ANIM_MS = 780;

type HeroCtaBarProps = {
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
  /** Matches hero background so borders and secondary CTA stay readable. */
  tone?: HeroCtaTone;
  /** When false, CTAs stay hidden (hero intro not finished). */
  heroRevealReady?: boolean;
  /**
   * Longest `animationDelay` on hero headline/sublines (ms), before line motion runs.
   * Fade starts after that delay + line animation + buffer.
   */
  heroLastLineDelayMs?: number;
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export default function HeroCtaBar({
  primaryHref = "/contacto",
  primaryLabel = "Agendar evaluación técnica",
  secondaryHref = "#sistema",
  secondaryLabel = "Ver el sistema ↓",
  className,
  tone = "on-dark",
  heroRevealReady = true,
  heroLastLineDelayMs = 440,
}: HeroCtaBarProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [ctaVisible, setCtaVisible] = useState(false);

  const secondaryBtn =
    tone === "on-dark"
      ? "border-white/35 bg-transparent text-white hover:bg-white/10"
      : "border-blue-950/20 bg-sky-50/80 text-blue-950 hover:bg-sky-100";

  useEffect(() => {
    if (!heroRevealReady) {
      setCtaVisible(false);
      return;
    }
    if (reducedMotion) {
      setCtaVisible(true);
      return;
    }
    const bufferMs = 72;
    const delayMs = heroLastLineDelayMs + HERO_LINE_ANIM_MS + bufferMs;
    const id = window.setTimeout(() => setCtaVisible(true), delayMs);
    return () => window.clearTimeout(id);
  }, [heroRevealReady, heroLastLineDelayMs, reducedMotion]);

  return (
    <section
      className={cn(
        "bg-transparent px-6 py-8 backdrop-blur-[2px] sm:py-10",
        className,
      )}
      aria-label="Acciones principales"
    >
      <div
        className={cn(
          "ml-auto mr-0 mb-6 flex max-w-4xl flex-col items-end justify-end gap-3 transition-[opacity,transform] duration-[520ms] ease-out sm:mb-8 sm:flex-row sm:items-center sm:gap-4",
          reducedMotion && "!transition-none",
          ctaVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <Link
          href={primaryHref}
          className="inline-flex items-center justify-center rounded-lg bg-ns-green px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ns-green-light"
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className={cn(
            "inline-flex items-center justify-center rounded-lg border px-7 py-3.5 text-sm font-semibold transition-colors",
            secondaryBtn,
          )}
        >
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}
