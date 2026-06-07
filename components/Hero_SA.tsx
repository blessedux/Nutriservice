"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useRef } from "react";

import HeroCtaBar from "@/components/hero-cta-bar";
import PartnerBrandLogos from "@/components/partner-brand-logos";
import { HeroVideoSequenceBg } from "@/components/hero-video-sequence-bg";
import { useHeroRevealReady } from "@/components/site-reveal-context";
import { cn } from "@/lib/utils";

function HeroHeadLine({
  children,
  delayMs,
  className,
}: {
  children: ReactNode;
  delayMs: number;
  className?: string;
}) {
  return (
    <span className={cn("hero-line-mask block", className)}>
      <span
        className="hero-line-inner"
        style={{ animationDelay: `${delayMs}ms` }}
      >
        {children}
      </span>
    </span>
  );
}

const HERO_LAST_LINE_DELAY_MS = 440;

export default function HeroSA() {
  const heroRevealReady = useHeroRevealReady();
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgParallaxY = useTransform(scrollYProgress, (p) =>
    reduceMotion ? 0 : p * 110,
  );

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative isolate -mt-24 min-h-[100dvh] scroll-mt-24 overflow-hidden bg-slate-950 text-white max-lg:overflow-visible lg:min-h-screen"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 scale-[1.14] will-change-transform"
        style={{ y: bgParallaxY }}
        aria-hidden
      >
        <HeroVideoSequenceBg playbackReady={heroRevealReady} />
      </motion.div>

      <div className="relative z-20 flex min-h-[100dvh] w-full flex-col overflow-visible px-6 pb-6 pt-[calc(5.125rem+10px)] max-lg:pb-8 sm:px-10 sm:pb-20 sm:pt-[calc(6rem+10px)] lg:z-10 lg:overflow-visible lg:px-12 lg:pb-24">
        <div
          className="flex min-h-0 flex-1 flex-col justify-start overflow-visible"
          data-hero-animate={heroRevealReady ? "true" : "false"}
        >
          <HeroPrimaryContent />
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-[calc(18.6dvh+1.5rem)] z-30 mb-2 flex flex-col gap-4 sm:inset-x-10 lg:inset-x-auto lg:bottom-[18dvh] lg:left-[calc(3rem+max(0px,(100%-86rem)/2))] lg:w-full lg:max-w-[33.6rem] xl:max-w-[38.4rem]">
        <HeroCtaBar
          variant="inline"
          tone="on-dark"
          heroRevealReady={heroRevealReady}
          heroLastLineDelayMs={HERO_LAST_LINE_DELAY_MS}
          primaryHref="/productos"
          primaryLabel="Ver catálogo"
          showSecondary={false}
          className="w-full max-w-xl translate-x-0"
        />
        <PartnerBrandLogos layout="center" className="w-full lg:hidden" />
      </div>

      <a
        href="#certificaciones"
        aria-label="Desplazarse hacia abajo"
        className="absolute bottom-5 left-1/2 z-30 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/80 backdrop-blur-md transition-colors hover:bg-white/15 hover:text-white lg:hidden"
      >
        <motion.span
          aria-hidden
          animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
          }
          className="flex items-center justify-center"
        >
          <ChevronDown className="size-5" strokeWidth={2} />
        </motion.span>
      </a>
    </section>
  );
}

function HeroPrimaryContent() {
  return (
    <div className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col justify-start overflow-visible pb-2 pt-1 max-lg:mt-[10dvh] sm:pb-8 lg:mt-0 lg:justify-center">
      <div className="max-w-xl shrink-0 overflow-visible lg:max-w-2xl xl:max-w-3xl">
        <div className="hero-tag-lr relative z-30 mb-3.5 flex items-center gap-4 sm:mb-6">
          <span className="h-px w-10 shrink-0 bg-blue-600" aria-hidden />
          <p className="max-w-xl text-[10px] font-bold uppercase leading-snug tracking-[0.22em] text-white sm:max-w-2xl sm:tracking-[0.28em]">
            30+ años al servicio de la nutrición funcional animal en Chile
          </p>
        </div>

        <h1 className="max-w-xl text-balance text-[2rem] font-light leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl sm:leading-[0.96] lg:text-6xl xl:text-7xl">
          <HeroHeadLine delayMs={140}>Inteligencia Nutricional</HeroHeadLine>
          <HeroHeadLine delayMs={240}>Industrial</HeroHeadLine>
        </h1>

        <div className="mt-4 max-w-lg text-sm leading-relaxed text-white/82 sm:mt-7 sm:text-lg sm:leading-8 lg:leading-9">
          <span className="lg:hidden">
            <HeroHeadLine delayMs={340}>
              Soluciones funcionales para una
            </HeroHeadLine>
            <HeroHeadLine delayMs={440}>
              alimentación y producción responsables
            </HeroHeadLine>
          </span>
          <span className="hidden lg:inline">
            <HeroHeadLine delayMs={340}>
              Soluciones funcionales para una alimentación y
            </HeroHeadLine>
            <HeroHeadLine delayMs={440}>
              producción responsables
            </HeroHeadLine>
          </span>
        </div>
      </div>
    </div>
  );
}
