"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import HeroCtaBar from "@/components/hero-cta-bar";
import { HeroSalmonAmbientAudio } from "@/components/hero-salmon-ambient-audio";
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

const AQUA_HERO_VIDEO_SRC = "/Salmon_sequence_optimized.webm";
const HERO_LAST_LINE_DELAY_MS = 440;

const AQUA_HERO_STATS_INTERVAL_MS = 5_000;

const AQUA_HERO_HOVER_LAYOUT_TRANSITION = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};
const AQUA_HERO_FOOTNOTE_DEFAULT =
  "* Rangos orientativos según literatura y ensayos de campo · ilustrativo";

type AquaHeroChartKind =
  | "efficiency-bars"
  | "risk-curve"
  | "sigma-bands"
  | "impact-stack";

type PillarChartKind = "fcr-bars" | "mortality-trend" | "sigma-converge";

type AquaHeroMetric = { label: string; value: string };

type AquaHeroCardDisplay = {
  theme: string;
  chartKind: AquaHeroChartKind;
  hoverParagraph: string;
  source: string;
  metrics: readonly AquaHeroMetric[];
};

type AquaHeroStatSlide = AquaHeroCardDisplay & {
  id: string;
};

type AquaHeroPillarId = "rendimiento" | "salud" | "consistencia";

type AquaHeroPillarDetail = AquaHeroCardDisplay & {
  id: AquaHeroPillarId;
  label: string;
  pillarChartKind: PillarChartKind;
};

const AQUA_HERO_HOVER_TYPEWRITER_MS = 4_500;

const AQUA_HERO_STAT_SLIDES: readonly AquaHeroStatSlide[] = [
  {
    id: "eficiencia",
    theme: "Eficiencia",
    chartKind: "efficiency-bars",
    hoverParagraph:
      "Los programas que integran enzimas, prebióticos, nucleótidos y palatantes funcionales permiten extraer más energía y proteína de cada kilo de alimento, sostener mejor el consumo en fases críticas y reducir la variabilidad entre animales. El resultado típico es una mejora medible en conversión alimenticia, costo de alimento por kilo producido y uniformidad de peso a cosecha, especialmente cuando la nutrición va alineada con un buen manejo y bioseguridad.",
    metrics: [
      {
        label: "FCR",
        value: "1,5–3,0 % mejora en conversión alimenticia*",
      },
      {
        label: "Costo alimento / kg",
        value: "2–4 % reducción costo alimento por kg producido*",
      },
      {
        label: "Uniformidad",
        value: "+3–5 pp uniformidad de peso a cosecha*",
      },
    ],
    source:
      "Datos de literatura técnica y ensayos de campo con mejoras de FCR asociadas a formulación optimizada y uso de enzimas/probióticos/nucleótidos en aves, cerdos y peces [1][2].",
  },
  {
    id: "salud",
    theme: "Salud",
    chartKind: "risk-curve",
    hoverParagraph:
      "Al reforzar la barrera intestinal, modular la microbiota y apoyar la respuesta inmunitaria, estos aditivos reducen la incidencia y severidad de cuadros entéricos y respiratorios, así como la mortalidad asociada a fases de alto estrés. Una salud más estable se traduce en menos interrupciones productivas, menor dependencia de terapias antibióticas y más lotes que completan su ciclo dentro de los parámetros sanitarios planificados.",
    metrics: [
      {
        label: "Mortalidad",
        value: "0,5–1,5 pp menos en fases críticas*",
      },
      {
        label: "Episodios severos",
        value: "10–20 % menos brotes con intervención masiva*",
      },
      {
        label: "Días tratamiento",
        value: "10–20 % menos días bajo antibióticos*",
      },
    ],
    source:
      "Metaanálisis y reportes de campo que vinculan mejor manejo, nutrición ajustada y uso de aditivos funcionales con menor mortalidad y mejor estado sanitario en monogástricos [2][3].",
  },
  {
    id: "consistencia",
    theme: "Consistencia",
    chartKind: "sigma-bands",
    hoverParagraph:
      "Cuando la formulación está respaldada por tecnologías nutricionales estables y bien caracterizadas, la respuesta productiva se vuelve más predecible lote a lote. Se reduce la deriva de FCR, mejora la proporción de animales dentro del rango objetivo de peso y disminuye la merma por canales fuera de especificación. Esta consistencia facilita planificar, cumplir contratos y escalar producción sin sorpresas.",
    metrics: [
      {
        label: "Deriva FCR (σ)",
        value: "10–15 % menos variación entre lotes*",
      },
      {
        label: "Merma / rechazo",
        value: "5–10 % menos merma fuera de especificación*",
      },
      {
        label: "Cumplimiento plan",
        value: ">90 % lotes en rango peso/edad*",
      },
    ],
    source:
      "Benchmarks de productores que combinan formulación por fases, monitoreo de FCR y uso de tecnologías nutricionales para reducir la dispersión productiva [1][2].",
  },
  {
    id: "sostenibilidad",
    theme: "Sostenibilidad",
    chartKind: "impact-stack",
    hoverParagraph:
      "Una mejor digestibilidad de proteína y fósforo, junto con una conversión alimenticia más eficiente, implica menos nutrientes excretados por kilo producido y menor uso total de materias primas. Esto se refleja en menores cargas de nitrógeno y fósforo al ambiente y en una huella de carbono más baja por unidad de carne, huevo o pescado, alineando la rentabilidad del sistema con los objetivos de sostenibilidad del productor y de la cadena.",
    metrics: [
      {
        label: "N excretado / kg",
        value: "5–10 % menos N excretado por kg*",
      },
      {
        label: "P excretado / kg",
        value: "10–20 % menos P excretado por kg*",
      },
      {
        label: "CO₂-eq / kg",
        value: "2–5 % menos huella por kg producido*",
      },
    ],
    source:
      "Estudios de sostenibilidad que relacionan mejoras en FCR y digestibilidad con menores requerimientos de alimento y menores huellas de N, P y CO₂-eq en producción animal y acuícola [4][5].",
  },
];

const AQUA_HERO_PILLAR_DETAILS: readonly AquaHeroPillarDetail[] = [
  {
    id: "rendimiento",
    label: "Rendimiento",
    theme: "Rendimiento",
    pillarChartKind: "fcr-bars",
    chartKind: "efficiency-bars",
    hoverParagraph:
      "Los programas que integran enzimas, prebióticos, nucleótidos y palatantes funcionales permiten extraer más energía y proteína de cada kilo de alimento, sostener mejor el consumo en fases críticas y reducir la variabilidad entre animales. El resultado típico es una mejora medible en conversión alimenticia, costo de alimento por kilo producido y uniformidad de peso a cosecha, especialmente cuando la nutrición va alineada con un buen manejo y bioseguridad.",
    metrics: AQUA_HERO_STAT_SLIDES[0].metrics,
    source: AQUA_HERO_STAT_SLIDES[0].source,
  },
  {
    id: "salud",
    label: "Salud",
    theme: "Salud",
    pillarChartKind: "mortality-trend",
    chartKind: "risk-curve",
    hoverParagraph: AQUA_HERO_STAT_SLIDES[1].hoverParagraph,
    metrics: AQUA_HERO_STAT_SLIDES[1].metrics,
    source: AQUA_HERO_STAT_SLIDES[1].source,
  },
  {
    id: "consistencia",
    label: "Control",
    theme: "Consistencia",
    pillarChartKind: "sigma-converge",
    chartKind: "sigma-bands",
    hoverParagraph: AQUA_HERO_STAT_SLIDES[2].hoverParagraph,
    metrics: AQUA_HERO_STAT_SLIDES[2].metrics,
    source: AQUA_HERO_STAT_SLIDES[2].source,
  },
];

const METRIC_SHORT_LABELS: Record<string, string> = {
  FCR: "FCR",
  "Costo alimento / kg": "CA",
  Uniformidad: "UN",
  Mortalidad: "M",
  "Episodios severos": "EE",
  "Días tratamiento": "DT",
  "Deriva FCR (σ)": "σF",
  "Merma / rechazo": "MR",
  "Cumplimiento plan": "CP",
  "N excretado / kg": "N",
  "P excretado / kg": "P",
  "CO₂-eq / kg": "CO₂",
};

function metricShortLabel(label: string): string {
  return METRIC_SHORT_LABELS[label] ?? label.slice(0, 3).toUpperCase();
}

function metricShortValue(value: string): string {
  const rangePct = value.match(/^([>]?\s*[\d,]+(?:\s*[–-]\s*[\d,]+)?)\s*(%|pp)/i);
  if (rangePct) {
    return `${rangePct[1].replace(/\s/g, "")}${rangePct[2]}`;
  }
  const gtPct = value.match(/^([>]?\s*[\d,]+)\s*%/i);
  if (gtPct) {
    return `${gtPct[1].replace(/\s/g, "")}%`;
  }
  return value.split(" ")[0] ?? value;
}

function AquaHeroMetricFlank({
  slide,
  side,
}: {
  slide: AquaHeroCardDisplay;
  side: "labels" | "values";
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col justify-center gap-2",
        side === "labels" ? "w-[2.25rem] items-end" : "w-[3.5rem] items-start",
      )}
    >
      {slide.metrics.map((row) => (
        <span
          key={row.label}
          className={cn(
            "text-[9px] font-semibold leading-none tabular-nums",
            side === "labels"
              ? "tracking-wide text-white/50"
              : "text-white/88",
          )}
        >
          {side === "labels" ? metricShortLabel(row.label) : metricShortValue(row.value)}
        </span>
      ))}
    </div>
  );
}

function AquaHeroMiniChart({ kind }: { kind: AquaHeroChartKind }) {
  const reduce = useReducedMotion();
  const stroke = "rgba(255,255,255,0.88)";
  const strokeSoft = "rgba(255,255,255,0.42)";
  const fill = "rgba(255,255,255,0.72)";

  if (kind === "efficiency-bars") {
    const bars = [
      { x: 4, h: 14 },
      { x: 26, h: 18 },
      { x: 48, h: 24 },
      { x: 70, h: 28 },
    ];
    const baseY = 36;
    return (
      <svg
        viewBox="0 0 92 42"
        className="mx-auto h-[42px] w-full max-w-[104px]"
        fill="none"
        aria-hidden
      >
        {bars.map((b, idx) => (
          <motion.rect
            key={b.x}
            x={b.x}
            rx={2}
            width={14}
            fill={fill}
            initial={{ height: reduce ? b.h : 0, y: reduce ? baseY - b.h : baseY }}
            animate={{ height: b.h, y: baseY - b.h }}
            transition={{
              duration: reduce ? 0 : 0.55,
              delay: reduce ? 0 : 0.08 + idx * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
        <motion.path
          d="M 2 38 H 89"
          stroke={strokeSoft}
          strokeWidth={1}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    );
  }

  if (kind === "risk-curve") {
    return (
      <svg
        viewBox="0 0 104 42"
        className="mx-auto h-[42px] w-full max-w-[104px]"
        fill="none"
        aria-hidden
      >
        <motion.path
          d="M 2 36 C 22 34, 34 24, 52 20 S 86 10, 102 6"
          stroke={stroke}
          strokeWidth={1.6}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0.25 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M 2 40 H 102"
          stroke={strokeSoft}
          strokeWidth={1}
          strokeLinecap="round"
          strokeDasharray="3 6"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx={100}
          cy={8}
          r={3}
          fill={stroke}
          initial={{ scale: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
          animate={{ scale: 1, opacity: 0.92 }}
          transition={{
            duration: reduce ? 0 : 0.35,
            delay: reduce ? 0 : 0.45,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      </svg>
    );
  }

  if (kind === "sigma-bands") {
    const lines = [
      { y: 32, w: 90, opacity: 0.35 },
      { y: 22, w: 68, opacity: 0.55 },
      { y: 12, w: 48, opacity: 0.9 },
    ];
    return (
      <svg
        viewBox="0 0 100 40"
        className="mx-auto h-10 w-full max-w-[104px]"
        fill="none"
        aria-hidden
      >
        {lines.map((ln, idx) => (
          <motion.path
            key={ln.y}
            d={`M 6 ${ln.y} L ${6 + ln.w} ${ln.y}`}
            stroke={stroke}
            strokeWidth={1.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? ln.opacity : 0 }}
            animate={{ pathLength: 1, opacity: ln.opacity }}
            transition={{
              duration: reduce ? 0 : 0.5,
              delay: reduce ? 0 : 0.06 + idx * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
        <motion.rect
          x={34}
          y={4}
          width={32}
          height={12}
          rx={2}
          stroke={strokeSoft}
          strokeWidth={1}
          fill="none"
          initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.35 }}
        />
      </svg>
    );
  }

  const steps = [
    { y: 31, w: 40 },
    { y: 20, w: 58 },
    { y: 9, w: 78 },
  ];
  return (
    <svg
      viewBox="0 0 96 40"
      className="mx-auto h-10 w-full max-w-[104px]"
      fill="none"
      aria-hidden
    >
      {steps.map((s, idx) => (
        <motion.path
          key={s.y}
          d={`M 6 ${s.y} H ${6 + s.w}`}
          stroke={stroke}
          strokeWidth={1.7}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: reduce ? 0 : 0.48,
            delay: reduce ? 0 : 0.1 + idx * 0.14,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
      <motion.path
        d="M 88 35 L 88 5"
        stroke={strokeSoft}
        strokeWidth={1}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.05 }}
      />
      {steps.map((s, idx) => (
        <motion.circle
          key={`d-${s.y}`}
          cx={6 + s.w}
          cy={s.y}
          r={2.2}
          fill={fill}
          initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: reduce ? 0 : 0.28,
            delay: reduce ? 0 : 0.35 + idx * 0.08,
            ease: [0.34, 1.4, 0.64, 1],
          }}
        />
      ))}
    </svg>
  );
}

function useTypewriter(
  text: string,
  active: boolean,
  durationMs: number,
  reduceMotion: boolean,
): string {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }
    if (reduceMotion) {
      setDisplayed(text);
      return;
    }
    setDisplayed("");
    const perChar = Math.max(8, durationMs / text.length);
    let idx = 0;
    const id = window.setInterval(() => {
      idx += 1;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) window.clearInterval(id);
    }, perChar);
    return () => window.clearInterval(id);
  }, [active, text, durationMs, reduceMotion]);
  return displayed;
}

const ADVANCE_RING_R = 11;
const ADVANCE_RING_C = 2 * Math.PI * ADVANCE_RING_R;

function AquaHeroAdvanceControl({
  progress,
  onAdvance,
  paused,
  reduceMotion,
}: {
  progress: number;
  onAdvance: () => void;
  paused: boolean;
  reduceMotion: boolean;
}) {
  const strokeOffset = ADVANCE_RING_C * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onAdvance();
      }}
      className="absolute -right-1 -top-1 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-white/80 backdrop-blur-sm transition-colors hover:bg-white/[0.12] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/60"
      aria-label="Siguiente indicador"
    >
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox="0 0 28 28"
        aria-hidden
      >
        <circle
          cx={14}
          cy={14}
          r={ADVANCE_RING_R}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={1.5}
        />
        <circle
          cx={14}
          cy={14}
          r={ADVANCE_RING_R}
          fill="none"
          stroke="rgba(125,211,252,0.9)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={ADVANCE_RING_C}
          strokeDashoffset={reduceMotion ? 0 : strokeOffset}
          style={{
            transition: paused || reduceMotion ? "none" : undefined,
          }}
        />
      </svg>
      <ChevronRight className="relative h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}

function PillarChart({ kind }: { kind: PillarChartKind }) {
  const reduce = useReducedMotion();
  const a = !reduce;
  const stroke = "rgba(255,255,255,0.88)";
  const strokeSoft = "rgba(255,255,255,0.36)";
  const fill = "rgba(255,255,255,0.72)";

  if (kind === "fcr-bars") {
    const bars = [
      { x: 5, h: 8 },
      { x: 20, h: 15 },
      { x: 35, h: 24 },
      { x: 50, h: 34 },
    ];
    const baseY = 38;
    return (
      <svg viewBox="0 0 72 44" className="h-[44px] w-full" fill="none" aria-hidden>
        {bars.map((b, idx) => (
          <motion.rect
            key={b.x}
            x={b.x}
            rx={1.5}
            width={11}
            fill={fill}
            initial={{ height: a ? 0 : b.h, y: a ? baseY : baseY - b.h }}
            animate={{ height: b.h, y: baseY - b.h }}
            transition={{
              duration: a ? 0.5 : 0,
              delay: a ? 0.05 + idx * 0.09 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
        <motion.path
          d="M 2 40 H 70"
          stroke={strokeSoft}
          strokeWidth={0.8}
          strokeLinecap="round"
          initial={{ pathLength: a ? 0 : 1 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: a ? 0.4 : 0, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    );
  }

  if (kind === "mortality-trend") {
    return (
      <svg viewBox="0 0 72 44" className="h-[44px] w-full" fill="none" aria-hidden>
        <motion.path
          d="M 4 38 C 16 35, 28 24, 42 18 S 60 10, 68 6"
          stroke={stroke}
          strokeWidth={1.6}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: a ? 0 : 1, opacity: a ? 0.2 : 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: a ? 0.68 : 0, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M 4 40 H 68"
          stroke={strokeSoft}
          strokeWidth={0.8}
          strokeLinecap="round"
          strokeDasharray="3 5"
          initial={{ pathLength: a ? 0 : 1 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: a ? 0.4 : 0, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx={66}
          cy={8}
          r={2.8}
          fill={stroke}
          initial={{ scale: a ? 0 : 1, opacity: a ? 0 : 0.92 }}
          animate={{ scale: 1, opacity: 0.92 }}
          transition={{
            duration: a ? 0.28 : 0,
            delay: a ? 0.54 : 0,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      </svg>
    );
  }

  const lines = [
    { y1: 36, y2: 24, opacity: 0.4 },
    { y1: 22, y2: 22, opacity: 0.7 },
    { y1: 8, y2: 20, opacity: 0.4 },
  ];
  return (
    <svg viewBox="0 0 72 44" className="h-[44px] w-full" fill="none" aria-hidden>
      {lines.map((ln, idx) => (
        <motion.path
          key={idx}
          d={`M 4 ${ln.y1} L 68 ${ln.y2}`}
          stroke={stroke}
          strokeWidth={idx === 1 ? 1.6 : 1}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: a ? 0 : 1, opacity: a ? 0 : ln.opacity }}
          animate={{ pathLength: 1, opacity: ln.opacity }}
          transition={{
            duration: a ? 0.52 : 0,
            delay: a ? 0.04 + idx * 0.1 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
      <motion.rect
        x={52}
        y={6}
        width={14}
        height={10}
        rx={2}
        stroke={strokeSoft}
        strokeWidth={0.8}
        fill="none"
        initial={{ opacity: a ? 0 : 1, scale: a ? 0.88 : 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: a ? 0.32 : 0, delay: a ? 0.44 : 0 }}
      />
    </svg>
  );
}

function AquaHeroSideCard({ heroRevealReady }: { heroRevealReady: boolean }) {
  const reduceMotion = useReducedMotion() ?? false;
  const [slideIdx, setSlideIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [activePillarId, setActivePillarId] = useState<AquaHeroPillarId | null>(null);
  const [showSource, setShowSource] = useState(false);
  const [rotationProgress, setRotationProgress] = useState(0);
  const rotationProgressRef = useRef(0);

  const isRotating = activePillarId === null;
  const idx = reduceMotion || !isRotating ? 0 : slideIdx;
  const slide = AQUA_HERO_STAT_SLIDES[idx];
  const activePillar = AQUA_HERO_PILLAR_DETAILS.find((p) => p.id === activePillarId);
  const display: AquaHeroCardDisplay = activePillar ?? slide;
  const contentKey = activePillar ? `pillar-${activePillar.id}` : `slide-${idx}`;

  const advanceSlide = useCallback(() => {
    rotationProgressRef.current = 0;
    setRotationProgress(0);
    setSlideIdx((p) => (p + 1) % AQUA_HERO_STAT_SLIDES.length);
  }, []);

  const togglePillar = useCallback((pillarId: AquaHeroPillarId) => {
    setActivePillarId((current) => (current === pillarId ? null : pillarId));
    setShowSource(false);
  }, []);

  useEffect(() => {
    if (!heroRevealReady) {
      setSlideIdx(0);
      setActivePillarId(null);
      setShowSource(false);
    }
  }, [heroRevealReady]);

  useEffect(() => {
    setShowSource(false);
  }, [contentKey]);

  useEffect(() => {
    if (!heroRevealReady || reduceMotion || !isRotating) {
      rotationProgressRef.current = 0;
      setRotationProgress(0);
      return;
    }

    if (hovered) {
      setRotationProgress(rotationProgressRef.current);
      return;
    }

    const start =
      performance.now() - rotationProgressRef.current * AQUA_HERO_STATS_INTERVAL_MS;
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / AQUA_HERO_STATS_INTERVAL_MS, 1);
      rotationProgressRef.current = progress;
      setRotationProgress(progress);
      if (progress >= 1) {
        rotationProgressRef.current = 0;
        setSlideIdx((p) => (p + 1) % AQUA_HERO_STAT_SLIDES.length);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [heroRevealReady, reduceMotion, hovered, isRotating, slideIdx]);

  const typedText = useTypewriter(
    display.hoverParagraph,
    hovered,
    AQUA_HERO_HOVER_TYPEWRITER_MS,
    reduceMotion,
  );

  return (
    <div
      className="w-full max-w-[336px] lg:ml-auto"
      aria-live={reduceMotion ? "off" : "polite"}
      aria-atomic="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setHovered(false);
        }
      }}
    >
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/[0.07] p-5 shadow-[0_12px_48px_-16px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-6">
        <motion.div className="relative border-l border-cyan-100/25 pl-5 sm:pl-6">
          <div className="relative pr-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/78">
              {activePillar ? activePillar.theme : "Indicadores en campo"}
            </p>
            {isRotating && heroRevealReady && (
              <AquaHeroAdvanceControl
                progress={rotationProgress}
                onAdvance={advanceSlide}
                paused={hovered || reduceMotion}
                reduceMotion={reduceMotion}
              />
            )}
          </div>

          {/* Top: stats (default) ↔ typewriter paragraph (hover) */}
          <motion.div
            className="relative mt-4 overflow-hidden"
            initial={false}
            animate={{ height: hovered ? "11.5rem" : "7.25rem" }}
            transition={
              reduceMotion ? { duration: 0 } : AQUA_HERO_HOVER_LAYOUT_TRANSITION
            }
            aria-live="polite"
            aria-atomic="true"
          >
            <motion.div
              className={cn(!hovered && "relative")}
              animate={
                reduceMotion
                  ? { opacity: hovered ? 0 : 1, height: hovered ? 0 : "auto" }
                  : {
                      opacity: hovered ? 0 : 1,
                      y: hovered ? -6 : 0,
                      height: hovered ? 0 : "auto",
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.45, ease: AQUA_HERO_HOVER_LAYOUT_TRANSITION.ease }
              }
              aria-hidden={hovered}
              style={{ overflow: hovered ? "hidden" : "visible" }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.dl
                  key={contentKey}
                  className="space-y-2.5 text-[11px] uppercase tracking-[0.1em]"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {display.metrics.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-start justify-between gap-2 border-b border-white/[0.06] pb-2.5 last:border-0 last:pb-0"
                    >
                      <dt className="max-w-[48%] shrink-0 font-medium normal-case leading-snug tracking-normal text-white/55">
                        {row.label}
                      </dt>
                      <dd className="max-w-[52%] text-right text-[10px] font-semibold leading-snug tracking-tight break-words whitespace-normal text-white/90 tabular-nums sm:text-[11px]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </motion.dl>
              </AnimatePresence>
            </motion.div>

            <motion.p
              key={`hover-${contentKey}`}
              className={cn(
                "text-[10px] leading-snug text-white/75 sm:text-[11px]",
                hovered ? "absolute inset-0" : "pointer-events-none absolute inset-0 opacity-0",
              )}
              animate={
                reduceMotion
                  ? { opacity: hovered ? 1 : 0 }
                  : { opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.45, ease: AQUA_HERO_HOVER_LAYOUT_TRANSITION.ease }
              }
              aria-hidden={!hovered}
            >
              {typedText}
            </motion.p>
          </motion.div>

          {/* Center: chart stays mounted; flanks fade in on hover */}
          <motion.div
            className="flex items-center justify-center overflow-hidden py-2"
            initial={false}
            animate={{ height: hovered ? 76 : 72 }}
            transition={
              reduceMotion ? { duration: 0 } : AQUA_HERO_HOVER_LAYOUT_TRANSITION
            }
          >
            <div className="flex w-full items-center justify-center gap-1.5 sm:gap-2">
              <motion.div
                className="shrink-0 overflow-hidden"
                initial={false}
                animate={{
                  width: hovered ? "2.25rem" : 0,
                  opacity: hovered ? 1 : 0,
                }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : AQUA_HERO_HOVER_LAYOUT_TRANSITION
                }
                aria-hidden={!hovered}
              >
                <AquaHeroMetricFlank slide={display} side="labels" />
              </motion.div>

              <div className="flex min-w-0 flex-1 items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={contentKey}
                    className="flex w-full items-center justify-center"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <AquaHeroMiniChart kind={display.chartKind} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.div
                className="shrink-0 overflow-hidden"
                initial={false}
                animate={{
                  width: hovered ? "3.5rem" : 0,
                  opacity: hovered ? 1 : 0,
                }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : AQUA_HERO_HOVER_LAYOUT_TRANSITION
                }
                aria-hidden={!hovered}
              >
                <AquaHeroMetricFlank slide={display} side="values" />
              </motion.div>
            </div>
          </motion.div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowSource((v) => !v);
            }}
            className="mt-2 w-full text-left text-[8px] font-medium normal-case leading-snug tracking-[0.12em] text-white/38 underline decoration-white/20 underline-offset-2 transition-colors hover:text-white/55 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/50"
            aria-expanded={showSource}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={showSource ? "source" : "footnote"}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {showSource ? display.source : AQUA_HERO_FOOTNOTE_DEFAULT}
              </motion.span>
            </AnimatePresence>
          </button>
        </motion.div>

        {/* Bottom: clickable pillar charts */}
        <div className="mt-5 border-t border-white/[0.1] pt-4">
          <div className="grid grid-cols-3 gap-3">
            {AQUA_HERO_PILLAR_DETAILS.map((p) => {
              const isActive = activePillarId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePillar(p.id);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg px-1 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/60",
                    isActive
                      ? "bg-white/[0.08] ring-1 ring-cyan-300/35"
                      : "hover:bg-white/[0.05]",
                  )}
                  aria-pressed={isActive}
                  aria-label={`Ver pilar ${p.label}`}
                >
                  <PillarChart kind={p.pillarChartKind} />
                  <p
                    className={cn(
                      "text-[8px] font-medium uppercase tracking-[0.12em]",
                      isActive ? "text-white/65" : "text-white/40",
                    )}
                  >
                    {p.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const fgParallaxY = useTransform(scrollYProgress, (p) =>
    reduceMotion ? 0 : p * -36,
  );

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative isolate -mt-24 min-h-[100dvh] scroll-mt-24 overflow-hidden bg-slate-950 text-white"
    >
      <HeroSalmonAmbientAudio heroRootRef={sectionRef} />
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 scale-[1.14] will-change-transform"
        style={{ y: bgParallaxY }}
        aria-hidden
      >
        <HeroBackground />
      </motion.div>

      <motion.div
        className="relative z-10 flex min-h-[100dvh] w-full flex-col px-6 pb-12 pt-[calc(5.125rem+10px)] sm:px-10 sm:pt-[calc(6rem+10px)] lg:px-12"
        style={{ y: fgParallaxY }}
      >
        <motion.div
          className="flex min-h-0 flex-1 flex-col lg:justify-start"
          data-hero-animate={heroRevealReady ? "true" : "false"}
        >
          <HeroPrimaryContent heroRevealReady={heroRevealReady} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0 bg-slate-950" aria-hidden />
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover motion-reduce:opacity-0"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      >
        <source src={AQUA_HERO_VIDEO_SRC} type="video/webm" />
      </video>
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

function HeroPrimaryContent({ heroRevealReady }: { heroRevealReady: boolean }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-x-11 gap-y-11 pt-1 sm:gap-x-12 sm:gap-y-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,352px)] lg:gap-x-14 xl:gap-x-16">
      <div className="max-w-xl lg:max-w-lg xl:max-w-xl">
        <div className="hero-tag-lr mb-5 flex items-center gap-4 sm:mb-6">
          <span className="h-px w-10 shrink-0 bg-blue-600" aria-hidden />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/55">
            Excelencia industrial desde 1993
          </p>
        </div>

        <h1 className="max-w-xl text-balance text-4xl font-light leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
          <HeroHeadLine delayMs={140}>Inteligencia Nutricional</HeroHeadLine>
          <HeroHeadLine delayMs={240}>Industrial.</HeroHeadLine>
        </h1>

        <motion.div className="mt-6 max-w-lg text-base leading-relaxed text-white/82 sm:mt-7 sm:text-lg sm:leading-8 lg:leading-9">
          <HeroHeadLine delayMs={340}>
            Transformamos ciencia compleja en rendimiento confiable
          </HeroHeadLine>
          <HeroHeadLine delayMs={440}>
            para operaciones productivas de gran escala.
          </HeroHeadLine>
        </motion.div>

        <HeroCtaBar
          variant="inline"
          tone="on-dark"
          heroRevealReady={heroRevealReady}
          heroLastLineDelayMs={HERO_LAST_LINE_DELAY_MS}
          secondaryHref="/#sistema"
        />
      </div>

      <motion.div className="flex w-full justify-start lg:justify-end lg:pt-[calc(1.5rem+0.625rem)]">
        <AquaHeroSideCard heroRevealReady={heroRevealReady} />
      </motion.div>
    </div>
  );
}
