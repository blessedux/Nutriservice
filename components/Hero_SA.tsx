"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";

import HeroCtaBar from "@/components/hero-cta-bar";
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

type HeroVariant = "base" | "aqua";

const HERO_VIDEO_SRC =
  "https://ik.imagekit.io/3bfeucft4/3D_Rotating_DNA_Helix_preview_2103773.mp4";

/** Largest `animationDelay` on `HeroHeadLine` in each variant (must match JSX). */
const HERO_LAST_LINE_DELAY_MS = { aqua: 440, base: 360 } as const;

export default function HeroSA() {
  const [variant, setVariant] = useState<HeroVariant>("aqua");
  const isAqua = variant === "aqua";
  const heroRevealReady = useHeroRevealReady();

  return (
    <section
      id="inicio"
      className={`relative isolate -mt-24 min-h-[100dvh] scroll-mt-24 overflow-hidden ${
        isAqua ? "bg-slate-950 text-white" : "bg-sky-100 text-blue-950"
      }`}
    >
      <button
        type="button"
        onClick={() => setVariant(isAqua ? "base" : "aqua")}
        aria-label={`Cambiar a hero ${isAqua ? "base" : "acuicola"}`}
        aria-pressed={isAqua}
        className="absolute left-4 top-20 z-30 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-lg backdrop-blur-md transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/70 sm:left-6 sm:top-24"
      >
        {isAqua ? "Hero A" : "Hero B"}
      </button>

      {isAqua ? <AquaHeroBackground /> : <BaseHeroBackground />}

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col px-6 pt-28 sm:pt-32">
        <div
          className="flex min-h-0 flex-1 items-center pb-10 sm:pb-12"
          data-hero-animate={heroRevealReady ? "true" : "false"}
        >
          {isAqua ? <AquaHeroContent /> : <BaseHeroContent />}
        </div>
        <HeroCtaBar
          className="-mx-6 shrink-0"
          tone={isAqua ? "on-dark" : "on-light"}
          heroRevealReady={heroRevealReady}
          heroLastLineDelayMs={
            isAqua ? HERO_LAST_LINE_DELAY_MS.aqua : HERO_LAST_LINE_DELAY_MS.base
          }
        />
      </div>
    </section>
  );
}

function BaseHeroBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0 bg-sky-100" aria-hidden />
      <video
        className="absolute inset-0 z-[1] h-full w-full object-cover motion-reduce:opacity-0"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
    </>
  );
}

function BaseHeroContent() {
  return (
    <div className="ml-auto mr-0 w-full max-w-4xl text-right">
      <h1 className="mb-7 text-balance text-3xl font-bold leading-[1.08] tracking-tight text-blue-950 sm:text-5xl lg:text-6xl xl:text-7xl">
        <HeroHeadLine delayMs={90}>Rendimiento medible en</HeroHeadLine>
        <HeroHeadLine delayMs={180}>
          <span className="text-sky-700">nutrición animal</span>.
        </HeroHeadLine>
      </h1>
      <div className="ml-auto max-w-xl text-base leading-relaxed text-sky-950/55 sm:text-lg">
        <HeroHeadLine delayMs={270}>
          Diagnóstico, formulación y soporte continuo para operaciones que
        </HeroHeadLine>
        <HeroHeadLine delayMs={360}>
          necesitan resultados estables, lote a lote.
        </HeroHeadLine>
      </div>
    </div>
  );
}

function AquaHeroBackground() {
  return (
    <>
      <Image
        src="/hero-sa-aqua-lab.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/90 via-cyan-950/45 to-slate-950/25"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_45%_25%,rgba(125,211,252,0.24),transparent_32%),linear-gradient(to_bottom,rgba(2,6,23,0.2),rgba(2,6,23,0.55))]"
        aria-hidden
      />
      <div
        className="absolute inset-y-0 left-0 z-[3] w-1/2 backdrop-blur-[2px]"
        aria-hidden
      />
    </>
  );
}

function AquaHeroContent() {
  return (
    <div className="mx-auto grid w-full max-w-7xl items-end gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(320px,0.42fr)]">
      <div className="max-w-3xl">
        <div className="hero-tag-lr mb-7 flex items-center gap-4">
          <span className="h-px w-10 shrink-0 bg-blue-600" aria-hidden />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/55">
            Excelencia industrial desde 1993
          </p>
        </div>

        <h1 className="max-w-4xl text-balance text-5xl font-light leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
          <HeroHeadLine delayMs={140}>Inteligencia Nutricional</HeroHeadLine>
          <HeroHeadLine delayMs={240}>Industrial.</HeroHeadLine>
        </h1>

        <div className="mt-8 max-w-2xl text-base leading-8 text-white/85 sm:text-xl">
          <HeroHeadLine delayMs={340}>
            Transformamos ciencia compleja en rendimiento confiable
          </HeroHeadLine>
          <HeroHeadLine delayMs={440}>
            para operaciones productivas de gran escala.
          </HeroHeadLine>
        </div>
      </div>

      <div className="hidden flex-col gap-8 lg:flex">
        <div className="ml-auto max-w-[210px] border-l border-cyan-100/20 pl-6 text-white/65">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
            Operational intelligence
          </p>
          <dl className="mt-5 space-y-2 text-[11px] uppercase tracking-[0.12em]">
            <div className="flex justify-between gap-6">
              <dt>Temp.</dt>
              <dd>10.2 °C</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt>Oxygen</dt>
              <dd>8.1 mg/L</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt>Salinity</dt>
              <dd>31.5 ppt</dd>
            </div>
          </dl>
        </div>

        <div className="ml-auto max-w-[220px] text-white/65">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/75">
            Nutrition in action. Health by design.
          </p>
          <p className="mt-5 text-sm leading-6">
            Science-led nutrition strengthens natural defenses, improves
            efficiency and supports resilient growth.
          </p>
        </div>
      </div>
    </div>
  );
}
