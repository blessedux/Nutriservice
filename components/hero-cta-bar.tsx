"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type HeroCtaTone = "on-dark" | "on-light";

/** Default: matches `hero-head-line-up` duration in `globals.css` (Hero SA). */
const DEFAULT_HERO_INTRO_ANIM_MS = 780;

type HeroCtaBarProps = {
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
  /** Right-aligned strip under hero vs compact stack under headline. */
  variant?: "strip" | "inline";
  /** Matches hero background so borders and secondary CTA stay readable. */
  tone?: HeroCtaTone;
  /** When false, CTAs stay hidden (hero intro not finished). */
  heroRevealReady?: boolean;
  /**
   * Longest `animationDelay` on hero headline/sublines (ms), before line motion runs.
   * Fade starts after that delay + `heroIntroAnimMs` + buffer.
   */
  heroLastLineDelayMs?: number;
  /**
   * Duration (ms) of the hero headline intro after `heroLastLineDelayMs`.
   * Hero SA uses CSS line masks (~780ms). Framer-based heroes can pass `0`.
   */
  heroIntroAnimMs?: number;
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
  secondaryHref = "#calculadora",
  secondaryLabel = "Ver el sistema ↓",
  className,
  variant = "strip",
  tone = "on-dark",
  heroRevealReady = true,
  heroLastLineDelayMs = 440,
  heroIntroAnimMs = DEFAULT_HERO_INTRO_ANIM_MS,
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
    const delayMs = heroLastLineDelayMs + heroIntroAnimMs + bufferMs;
    const id = window.setTimeout(() => setCtaVisible(true), delayMs);
    return () => window.clearTimeout(id);
  }, [heroRevealReady, heroLastLineDelayMs, heroIntroAnimMs, reducedMotion]);

  return (
    <section
      className={cn(
        "bg-transparent backdrop-blur-[2px]",
        variant === "strip"
          ? "px-6 py-8 sm:py-10"
          : "px-0 py-0",
        className,
      )}
      aria-label="Acciones principales"
    >
      <div
        className={cn(
          "flex flex-col gap-3 transition-[opacity,transform] duration-[520ms] ease-out sm:flex-row sm:items-center sm:gap-4",
          variant === "strip"
            ? "ml-auto mr-0 mb-6 max-w-4xl items-end justify-end sm:mb-8"
            : "ml-0 mr-auto mt-6 max-w-xl items-stretch justify-start sm:mt-9",
          reducedMotion && "!transition-none",
          ctaVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <Link
          href={primaryHref}
          className={cn(
            "inline-flex items-center justify-center rounded-lg bg-ns-green px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ns-green-light",
            variant === "inline" && "w-full sm:w-auto",
          )}
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className={cn(
            "inline-flex items-center justify-center rounded-lg border px-7 py-3.5 text-sm font-semibold transition-colors",
            secondaryBtn,
            variant === "inline" && "w-full sm:w-auto",
          )}
        >
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}
