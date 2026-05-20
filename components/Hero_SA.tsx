"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ReactNode, TouchEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import HeroCtaBar from "@/components/hero-cta-bar";
import { HeroSalmonAmbientAudio } from "@/components/hero-salmon-ambient-audio";
import { useHeroRevealReady } from "@/components/site-reveal-context";
import { useMobileExperience } from "@/hooks/use-mobile-experience";
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

const AQUA_HERO_VIDEO_WEBM_SRC = "/Salmon_sequence_optimized.webm";
const AQUA_HERO_VIDEO_MP4_SRC = "/Salmon_sequence_optimized.mp4";
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
  mobileHoverParagraph: string;
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
    mobileHoverParagraph:
      "Más energía y proteína por kilo de alimento, con menos variabilidad entre animales. Mejora medible en FCR, costo por kg producido y uniformidad a cosecha.",
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
    mobileHoverParagraph:
      "Barrera intestinal y microbiota más estables reducen cuadros entéricos y respiratorios en fases críticas. Menos mortalidad, menos antibióticos y lotes que completan el ciclo en parámetros sanitarios.",
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
    mobileHoverParagraph:
      "Formulaciones estables vuelven la respuesta más predecible lote a lote. Menos deriva de FCR, más animales en rango de peso y menos merma fuera de especificación.",
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
    mobileHoverParagraph:
      "Mejor digestibilidad y conversión implican menos nutrientes excretados y menos alimento por kilo producido. Menor carga de N y P, y huella de carbono más baja por unidad producida.",
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

const AQUA_HERO_MOBILE_LOOP_SLIDES: readonly AquaHeroStatSlide[] = [
  AQUA_HERO_STAT_SLIDES[AQUA_HERO_STAT_SLIDES.length - 1],
  ...AQUA_HERO_STAT_SLIDES,
  AQUA_HERO_STAT_SLIDES[0],
];

const AQUA_HERO_MOBILE_LOOP_OFFSET = 1;
const AQUA_HERO_MOBILE_CARD_GAP_PX = 10;
const AQUA_HERO_MOBILE_CARD_SHELL_MIN_PX = 148;
const AQUA_HERO_MOBILE_TAP_SLOP_PX = 14;
const HERO_VIDEO_PLAY_RETRY_MS = 400;
const HERO_VIDEO_PLAY_MAX_ATTEMPTS = 14;

/** Horizontal-only mask — softens side shadows without fading the card bottom. */
const AQUA_HERO_STATS_SHADOW_SIDE_MASK =
  "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)";

const AQUA_HERO_STATS_SHADOW_BOTTOM_PAD_PX = 14;
const AQUA_HERO_STATS_CARD_ROUNDED = "rounded-[20px]";

function AquaHeroStatsCardShadowShell({
  children,
  className,
  shadowClass,
}: {
  children: ReactNode;
  className?: string;
  shadowClass: string;
}) {
  return (
    <div className={cn("relative overflow-visible", className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-0",
          AQUA_HERO_STATS_CARD_ROUNDED,
          shadowClass,
          "blur-[5px] opacity-90",
        )}
        style={{
          WebkitMaskImage: AQUA_HERO_STATS_SHADOW_SIDE_MASK,
          maskImage: AQUA_HERO_STATS_SHADOW_SIDE_MASK,
        }}
      />
      <div
        className={cn(
          "relative z-10 h-full w-full overflow-hidden",
          AQUA_HERO_STATS_CARD_ROUNDED,
        )}
      >
        {children}
      </div>
    </div>
  );
}

function getMobileCarouselSlides(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>("[data-mobile-slide]")];
}

function getActiveMobileLoopIdx(container: HTMLElement): number {
  const slides = getMobileCarouselSlides(container);
  if (slides.length === 0) return AQUA_HERO_MOBILE_LOOP_OFFSET;

  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < slides.length; i += 1) {
    const dist = Math.abs(container.scrollLeft - slides[i].offsetLeft);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }
  return bestIdx;
}

const AQUA_HERO_PILLAR_DETAILS: readonly AquaHeroPillarDetail[] = [
  {
    id: "rendimiento",
    label: "Rendimiento",
    theme: "Rendimiento",
    pillarChartKind: "fcr-bars",
    chartKind: "efficiency-bars",
    hoverParagraph:
      "Los programas que integran enzimas, prebióticos, nucleótidos y palatantes funcionales permiten extraer más energía y proteína de cada kilo de alimento, sostener mejor el consumo en fases críticas y reducir la variabilidad entre animales. El resultado típico es una mejora medible en conversión alimenticia, costo de alimento por kilo producido y uniformidad de peso a cosecha, especialmente cuando la nutrición va alineada con un buen manejo y bioseguridad.",
    mobileHoverParagraph: AQUA_HERO_STAT_SLIDES[0].mobileHoverParagraph,
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
    mobileHoverParagraph: AQUA_HERO_STAT_SLIDES[1].mobileHoverParagraph,
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
    mobileHoverParagraph: AQUA_HERO_STAT_SLIDES[2].mobileHoverParagraph,
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

function AquaHeroMobileCardPanel({
  display,
  contentKey,
  reduceMotion,
  expanded,
  onTap,
  enableTap = true,
}: {
  display: AquaHeroCardDisplay;
  contentKey: string;
  reduceMotion: boolean;
  expanded: boolean;
  onTap: () => void;
  /** When false, tap is handled by a parent overlay (carousel slides). */
  enableTap?: boolean;
}) {
  const [showSource, setShowSource] = useState(false);
  const typedParagraph = useTypewriter(
    display.mobileHoverParagraph,
    expanded,
    AQUA_HERO_HOVER_TYPEWRITER_MS,
    reduceMotion,
  );

  useEffect(() => {
    if (!expanded) setShowSource(false);
  }, [expanded, contentKey]);

  return (
    <AquaHeroStatsCardShadowShell
      className="h-full min-h-0 w-full"
      shadowClass="shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]"
    >
      <motion.div
        role={enableTap ? "button" : undefined}
        tabIndex={enableTap ? 0 : undefined}
        onClick={
          enableTap
            ? (e) => {
                e.stopPropagation();
                onTap();
              }
            : undefined
        }
        onKeyDown={
          enableTap
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onTap();
                }
              }
            : undefined
        }
        className={cn(
          "flex h-full min-h-0 w-full flex-col overflow-hidden border border-white/20 bg-white/[0.07] px-4 py-3.5 text-left backdrop-blur-xl",
          enableTap &&
            "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/60",
          AQUA_HERO_STATS_CARD_ROUNDED,
        )}
        aria-expanded={expanded}
        transition={
          reduceMotion ? { duration: 0 } : AQUA_HERO_HOVER_LAYOUT_TRANSITION
        }
      >
      <div className="flex h-full min-h-0 flex-col border-l border-cyan-100/25 pl-3.5">
        {expanded ? (
          <>
            <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/72">
              {display.theme}
            </p>
            <div className="mt-2.5 min-h-0 flex-1">
              <motion.p
                className="pr-0.5 text-[15px] leading-[1.45] text-white/75"
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.45, ease: AQUA_HERO_HOVER_LAYOUT_TRANSITION.ease }
                }
              >
                {typedParagraph}
              </motion.p>
            </div>

            <div className="shrink-0 pt-2">
              <div className="flex items-center justify-center overflow-hidden py-1">
                <div className="flex w-full items-center justify-center gap-1">
                  <div className="w-[1.65rem] shrink-0">
                    <AquaHeroMetricFlank slide={display} side="labels" />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-center">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={contentKey}
                        className="flex w-full items-center justify-center"
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <AquaHeroMiniChart kind={display.chartKind} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="w-[2.35rem] shrink-0">
                    <AquaHeroMetricFlank slide={display} side="values" />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSource((v) => !v);
                }}
                className="mt-1.5 w-full shrink-0 cursor-pointer text-left text-[8px] font-medium normal-case leading-snug tracking-[0.12em] text-white/38 underline decoration-white/20 underline-offset-2 transition-colors hover:text-white/55 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/50"
                aria-expanded={showSource}
              >
                {showSource ? display.source : AQUA_HERO_FOOTNOTE_DEFAULT}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/72">
              {display.theme}
            </p>

            <div className="relative mt-2.5 min-h-[3rem] flex-1 overflow-hidden">
              <AquaHeroMobileStatsRow display={display} contentKey={contentKey} />
            </div>

            <div className="flex min-h-[3.25rem] shrink-0 items-center justify-center overflow-hidden py-2">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={contentKey}
                  className="flex w-full items-center justify-center"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AquaHeroMiniChart kind={display.chartKind} />
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
      </motion.div>
    </AquaHeroStatsCardShadowShell>
  );
}

function AquaHeroMobileStatsRow({
  display,
  contentKey,
}: {
  display: AquaHeroCardDisplay;
  contentKey: string;
}) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={contentKey}
        className="grid grid-cols-3 gap-1.5"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        {display.metrics.map((row) => (
          <div key={row.label} className="min-w-0 cursor-default text-center">
            <p className="truncate text-[8px] font-semibold uppercase tracking-[0.14em] text-white/48">
              {metricShortLabel(row.label)}
            </p>
            <p className="mt-0.5 truncate text-[10px] font-semibold tabular-nums text-white/88">
              {metricShortValue(row.value)}
            </p>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

function AquaHeroPillarDots({
  activePillarId,
  onToggle,
  className,
}: {
  activePillarId: AquaHeroPillarId | null;
  onToggle: (pillarId: AquaHeroPillarId) => void;
  className?: string;
}) {
  return (
    <div
      className={cn("mt-1.5 flex items-center justify-center gap-2.5", className)}
      role="tablist"
      aria-label="Pilares de indicadores"
    >
      {AQUA_HERO_PILLAR_DETAILS.map((p) => {
        const isActive = activePillarId === p.id;
        return (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Ver pilar ${p.label}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(p.id);
            }}
            className={cn(
              "rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
              isActive ? "h-2 w-2 bg-white" : "h-1.5 w-1.5 bg-white/32 hover:bg-white/55",
            )}
          />
        );
      })}
    </div>
  );
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
      className="absolute -right-1 -top-1 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/[0.06] text-white/80 backdrop-blur-sm transition-colors hover:bg-white/[0.12] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/60"
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

function AquaHeroSideCard({
  heroRevealReady,
  mobileExpanded = false,
  onMobileExpandedChange,
  headlineCollapsePx = 0,
}: {
  heroRevealReady: boolean;
  mobileExpanded?: boolean;
  onMobileExpandedChange?: (expanded: boolean) => void;
  headlineCollapsePx?: number;
}) {
  const isMobile = useMobileExperience();
  const reduceMotion = useReducedMotion() ?? false;
  const [slideIdx, setSlideIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [activePillarId, setActivePillarId] = useState<AquaHeroPillarId | null>(null);
  const [showSource, setShowSource] = useState(false);
  const [rotationProgress, setRotationProgress] = useState(0);
  const rotationProgressRef = useRef(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollSyncRef = useRef(false);
  const mobileScrollEndTimerRef = useRef<number | null>(null);
  const mobileTouchMovedRef = useRef(false);
  const mobileTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const mobileLoopReadyRef = useRef(false);
  const prevSlideIdxRef = useRef(0);
  const mobileCardZoneRef = useRef<HTMLDivElement>(null);
  const [mobileCardZoneHeight, setMobileCardZoneHeight] = useState(0);
  const [mobileCollapsedCardHeight, setMobileCollapsedCardHeight] = useState(0);

  const isRotating = activePillarId === null && !mobileExpanded;
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
    setActivePillarId((current) => {
      const next = current === pillarId ? null : pillarId;
      if (next) {
        const pillarIdx = AQUA_HERO_PILLAR_DETAILS.findIndex((p) => p.id === pillarId);
        if (pillarIdx >= 0) {
          rotationProgressRef.current = 0;
          setRotationProgress(0);
          setSlideIdx(pillarIdx);
        }
      }
      return next;
    });
    setShowSource(false);
  }, []);

  useEffect(() => {
    if (!heroRevealReady) {
      setSlideIdx(0);
      setActivePillarId(null);
      setShowSource(false);
      onMobileExpandedChange?.(false);
    }
  }, [heroRevealReady, onMobileExpandedChange]);

  const scrollMobileToLoopIdx = useCallback(
    (loopIdx: number, behavior: ScrollBehavior) => {
      const container = mobileScrollRef.current;
      if (!container) return;

      const slides = getMobileCarouselSlides(container);
      const target = slides[loopIdx];
      if (!target) return;

      mobileScrollSyncRef.current = true;
      container.scrollTo({
        left: target.offsetLeft,
        behavior,
      });

      const unlockMs = behavior === "auto" || reduceMotion ? 0 : 420;
      window.setTimeout(() => {
        mobileScrollSyncRef.current = false;
      }, unlockMs);
    },
    [reduceMotion],
  );

  const scrollMobileToRealIdx = useCallback(
    (realIdx: number, behavior: ScrollBehavior) => {
      scrollMobileToLoopIdx(realIdx + AQUA_HERO_MOBILE_LOOP_OFFSET, behavior);
    },
    [scrollMobileToLoopIdx],
  );

  const snapFromTrailingClone = useCallback(() => {
    rotationProgressRef.current = 0;
    setRotationProgress(0);
    setSlideIdx(0);
    scrollMobileToLoopIdx(AQUA_HERO_MOBILE_LOOP_OFFSET, "auto");
  }, [scrollMobileToLoopIdx]);

  const snapFromLeadingClone = useCallback(() => {
    const lastRealIdx = AQUA_HERO_STAT_SLIDES.length - 1;
    rotationProgressRef.current = 0;
    setRotationProgress(0);
    setSlideIdx(lastRealIdx);
    scrollMobileToLoopIdx(AQUA_HERO_STAT_SLIDES.length, "auto");
  }, [scrollMobileToLoopIdx]);

  const snapMobileCarousel = useCallback(() => {
    const container = mobileScrollRef.current;
    if (!container || mobileScrollSyncRef.current) return;

    const loopIdx = getActiveMobileLoopIdx(container);
    const slides = getMobileCarouselSlides(container);
    const target = slides[loopIdx];
    if (!target) return;

    if (Math.abs(container.scrollLeft - target.offsetLeft) <= 2) {
      return;
    }

    scrollMobileToLoopIdx(loopIdx, reduceMotion ? "auto" : "smooth");
  }, [reduceMotion, scrollMobileToLoopIdx]);

  useEffect(() => {
    if (!isMobile || mobileExpanded) return;
    const zone = mobileCardZoneRef.current;
    if (!zone) return;

    const measure = () => {
      const zoneHeight = zone.getBoundingClientRect().height;
      const scrollHeight =
        mobileScrollRef.current?.getBoundingClientRect().height ?? 0;

      if (zoneHeight > 0) {
        setMobileCardZoneHeight(zoneHeight);
      }
      if (scrollHeight > 0) {
        setMobileCollapsedCardHeight(scrollHeight);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(zone);
    if (mobileScrollRef.current) {
      observer.observe(mobileScrollRef.current);
    }
    return () => observer.disconnect();
  }, [isMobile, mobileExpanded, slideIdx]);

  useEffect(() => {
    if (!isMobile || !heroRevealReady) return;
    const container = mobileScrollRef.current;
    if (!container || mobileLoopReadyRef.current) return;

    mobileLoopReadyRef.current = true;
    prevSlideIdxRef.current = 0;
    scrollMobileToRealIdx(0, "auto");
  }, [heroRevealReady, isMobile, scrollMobileToRealIdx]);

  useEffect(() => {
    if (!isMobile || !heroRevealReady || mobileExpanded) return;
    const container = mobileScrollRef.current;
    if (!container || mobileScrollSyncRef.current) return;

    const prevIdx = prevSlideIdxRef.current;
    prevSlideIdxRef.current = slideIdx;

    const lastLoopIdx = AQUA_HERO_MOBILE_LOOP_SLIDES.length - 1;
    const currentLoopIdx = getActiveMobileLoopIdx(container);
    const targetLoopIdx = slideIdx + AQUA_HERO_MOBILE_LOOP_OFFSET;

    if (currentLoopIdx >= lastLoopIdx && slideIdx === 0) {
      scrollMobileToLoopIdx(AQUA_HERO_MOBILE_LOOP_OFFSET, "auto");
      return;
    }
    if (currentLoopIdx <= 0 && slideIdx === AQUA_HERO_STAT_SLIDES.length - 1) {
      scrollMobileToLoopIdx(AQUA_HERO_STAT_SLIDES.length, "auto");
      return;
    }

    const slides = getMobileCarouselSlides(container);
    const target = slides[targetLoopIdx];
    if (!target) return;
    if (Math.abs(container.scrollLeft - target.offsetLeft) < 4) return;

    if (
      prevIdx === AQUA_HERO_STAT_SLIDES.length - 1 &&
      slideIdx === 0 &&
      currentLoopIdx >= lastLoopIdx - 1
    ) {
      return;
    }

    scrollMobileToRealIdx(slideIdx, reduceMotion ? "auto" : "smooth");
  }, [
    slideIdx,
    isMobile,
    heroRevealReady,
    mobileExpanded,
    reduceMotion,
    scrollMobileToRealIdx,
    scrollMobileToLoopIdx,
  ]);

  useEffect(() => {
    if (!isMobile) return;
    const container = mobileScrollRef.current;
    if (!container) return;

    const onScrollEnd = () => snapMobileCarousel();
    container.addEventListener("scrollend", onScrollEnd);
    return () => container.removeEventListener("scrollend", onScrollEnd);
  }, [isMobile, snapMobileCarousel]);

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
        if (
          isMobile &&
          slideIdx === AQUA_HERO_STAT_SLIDES.length - 1 &&
          mobileScrollRef.current
        ) {
          scrollMobileToLoopIdx(
            AQUA_HERO_MOBILE_LOOP_SLIDES.length - 1,
            reduceMotion ? "auto" : "smooth",
          );
          if (!reduceMotion) {
            window.setTimeout(() => {
              const container = mobileScrollRef.current;
              if (!container || mobileScrollSyncRef.current) return;
              if (
                getActiveMobileLoopIdx(container) >=
                AQUA_HERO_MOBILE_LOOP_SLIDES.length - 1
              ) {
                snapFromTrailingClone();
              }
            }, 480);
          } else {
            snapFromTrailingClone();
          }
        } else if (isMobile) {
          setSlideIdx((p) =>
            Math.min(p + 1, AQUA_HERO_STAT_SLIDES.length - 1),
          );
        } else {
          setSlideIdx((p) => (p + 1) % AQUA_HERO_STAT_SLIDES.length);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [
    heroRevealReady,
    reduceMotion,
    hovered,
    isRotating,
    slideIdx,
    mobileExpanded,
    isMobile,
    scrollMobileToLoopIdx,
    snapFromTrailingClone,
  ]);

  const handleMobileScroll = useCallback(() => {
    const container = mobileScrollRef.current;
    if (!container) return;

    if (!mobileScrollSyncRef.current) {
      if (mobileScrollEndTimerRef.current !== null) {
        window.clearTimeout(mobileScrollEndTimerRef.current);
      }
      mobileScrollEndTimerRef.current = window.setTimeout(() => {
        snapMobileCarousel();
        mobileScrollEndTimerRef.current = null;
      }, 64);
    }

    if (mobileScrollSyncRef.current) return;

    const loopIdx = getActiveMobileLoopIdx(container);
    const lastLoopIdx = AQUA_HERO_MOBILE_LOOP_SLIDES.length - 1;

    if (loopIdx <= 0) {
      snapFromLeadingClone();
      return;
    }

    if (loopIdx >= lastLoopIdx) {
      snapFromTrailingClone();
      return;
    }

    const nextIdx = loopIdx - AQUA_HERO_MOBILE_LOOP_OFFSET;
    if (
      nextIdx === slideIdx ||
      nextIdx < 0 ||
      nextIdx >= AQUA_HERO_STAT_SLIDES.length
    ) {
      return;
    }

    rotationProgressRef.current = 0;
    setRotationProgress(0);
    setSlideIdx(nextIdx);
    setActivePillarId((current) => {
      const pillar = AQUA_HERO_PILLAR_DETAILS[nextIdx];
      return pillar && current === pillar.id ? current : null;
    });
  }, [
    scrollMobileToRealIdx,
    slideIdx,
    snapMobileCarousel,
    snapFromLeadingClone,
    snapFromTrailingClone,
  ]);

  const handleMobileCardTap = useCallback(() => {
    if (mobileScrollSyncRef.current || mobileTouchMovedRef.current) return;
    onMobileExpandedChange?.(!mobileExpanded);
  }, [mobileExpanded, onMobileExpandedChange]);

  const handleMobileTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0];
      if (touch) {
        mobileTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }
      mobileTouchMovedRef.current = false;
    },
    [],
  );

  const handleMobileTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const start = mobileTouchStartRef.current;
      const touch = event.touches[0];
      if (!start || !touch) return;
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.hypot(dx, dy) > AQUA_HERO_MOBILE_TAP_SLOP_PX) {
        mobileTouchMovedRef.current = true;
      }
    },
    [],
  );

  const handleMobileTouchEnd = useCallback(() => {
    window.requestAnimationFrame(() => {
      snapMobileCarousel();
    });
  }, [snapMobileCarousel]);

  const typedText = useTypewriter(
    display.hoverParagraph,
    hovered && !isMobile,
    AQUA_HERO_HOVER_TYPEWRITER_MS,
    reduceMotion,
  );

  if (isMobile) {
    const hasLockedHeights =
      mobileCardZoneHeight > 0 && mobileCollapsedCardHeight > 0;
    const slideShellHeight = hasLockedHeights
      ? mobileCollapsedCardHeight
      : AQUA_HERO_MOBILE_CARD_SHELL_MIN_PX;
    const expandedPanelHeight =
      hasLockedHeights && headlineCollapsePx > 0
        ? mobileCollapsedCardHeight + headlineCollapsePx
        : slideShellHeight + Math.max(headlineCollapsePx, 160);
    const activeSlide = AQUA_HERO_STAT_SLIDES[slideIdx];
    const collapsedShellHeight =
      slideShellHeight + AQUA_HERO_STATS_SHADOW_BOTTOM_PAD_PX;
    const cardStageHeight = mobileExpanded
      ? expandedPanelHeight
      : slideShellHeight;

    return (
      <div
        ref={mobileCardZoneRef}
        className="relative w-full max-w-[300px] overflow-visible lg:ml-auto"
        style={
          hasLockedHeights && !mobileExpanded
            ? { height: mobileCardZoneHeight, minHeight: mobileCardZoneHeight }
            : { minHeight: collapsedShellHeight + 28 }
        }
        aria-live={reduceMotion ? "off" : "polite"}
        aria-atomic="true"
      >
        <div
          className="relative overflow-visible"
          style={{
            height: collapsedShellHeight,
            minHeight: collapsedShellHeight,
          }}
        >
          <div
            className="absolute inset-x-0 bottom-0 overflow-visible"
            style={{ height: cardStageHeight }}
          >
            <div
              ref={mobileScrollRef}
              className={cn(
                "absolute inset-x-0 bottom-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-y-none scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden",
                mobileExpanded && "pointer-events-none invisible",
              )}
              style={{ height: slideShellHeight }}
              onScroll={handleMobileScroll}
              onTouchStart={handleMobileTouchStart}
              onTouchMove={handleMobileTouchMove}
              onTouchEnd={handleMobileTouchEnd}
              aria-label="Indicadores en campo"
              aria-hidden={mobileExpanded}
            >
            {AQUA_HERO_MOBILE_LOOP_SLIDES.map((statSlide, loopIdx) => {
              const realIdx =
                loopIdx === 0
                  ? AQUA_HERO_STAT_SLIDES.length - 1
                  : loopIdx === AQUA_HERO_MOBILE_LOOP_SLIDES.length - 1
                    ? 0
                    : loopIdx - AQUA_HERO_MOBILE_LOOP_OFFSET;
              const isActive = realIdx === slideIdx;

              return (
                <div
                  key={`${statSlide.id}-${loopIdx}`}
                  data-mobile-slide
                  data-slide-idx={realIdx}
                  className="relative box-border shrink-0 snap-center snap-always"
                  style={{
                    width: `calc(100% - ${AQUA_HERO_MOBILE_CARD_GAP_PX}px)`,
                    height: slideShellHeight,
                    marginRight: AQUA_HERO_MOBILE_CARD_GAP_PX,
                  }}
                  aria-hidden={!isActive || mobileExpanded}
                >
                  <div className="relative h-full min-h-[148px]">
                    {isActive && (
                      <button
                        type="button"
                        className={cn(
                          "absolute inset-0 z-20 cursor-pointer rounded-[20px] bg-transparent",
                          AQUA_HERO_STATS_CARD_ROUNDED,
                        )}
                        aria-label={`Ver detalles: ${statSlide.theme}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleMobileCardTap();
                        }}
                      />
                    )}
                    <AquaHeroMobileCardPanel
                      display={statSlide}
                      contentKey={`slide-${realIdx}-${loopIdx}`}
                      reduceMotion={reduceMotion}
                      expanded={false}
                      enableTap={false}
                      onTap={handleMobileCardTap}
                    />
                  </div>
                </div>
              );
            })}
            </div>

            <AnimatePresence initial={false}>
              {mobileExpanded && (
                <motion.div
                  key={`expanded-${slideIdx}`}
                  className={cn(
                    "pointer-events-auto absolute inset-x-0 bottom-0 z-30 overflow-hidden",
                    AQUA_HERO_STATS_CARD_ROUNDED,
                  )}
                  style={{ transformOrigin: "bottom center" }}
                  initial={
                    reduceMotion
                      ? false
                      : { height: slideShellHeight, opacity: 1 }
                  }
                  animate={{ height: expandedPanelHeight, opacity: 1 }}
                  exit={
                    reduceMotion
                      ? undefined
                      : { height: slideShellHeight, opacity: 1 }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : AQUA_HERO_HOVER_LAYOUT_TRANSITION
                  }
                >
                  <AquaHeroMobileCardPanel
                    display={activeSlide}
                    contentKey={`expanded-slide-${slideIdx}`}
                    reduceMotion={reduceMotion}
                    expanded
                    onTap={handleMobileCardTap}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AquaHeroPillarDots
          activePillarId={activePillarId}
          onToggle={togglePillar}
          className="relative z-10"
        />
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-[336px] cursor-default lg:ml-auto"
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
      <AquaHeroStatsCardShadowShell shadowClass="shadow-[0_12px_48px_-16px_rgba(0,0,0,0.55)]">
        <div
          className={cn(
            "cursor-default overflow-hidden border border-white/20 bg-white/[0.07] p-5 backdrop-blur-xl sm:p-6",
            AQUA_HERO_STATS_CARD_ROUNDED,
          )}
        >
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
                  className="cursor-default space-y-2.5 text-[11px] uppercase tracking-[0.1em]"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {display.metrics.map((row) => (
                    <div
                      key={row.label}
                      className="flex cursor-default items-start justify-between gap-2 border-b border-white/[0.06] pb-2.5 last:border-0 last:pb-0"
                    >
                      <dt className="max-w-[48%] shrink-0 cursor-default font-medium normal-case leading-snug tracking-normal text-white/55">
                        {row.label}
                      </dt>
                      <dd className="max-w-[52%] cursor-default text-right text-[10px] font-semibold leading-snug tracking-tight break-words whitespace-normal text-white/90 tabular-nums sm:text-[11px]">
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
            className="mt-2 w-full cursor-default text-left text-[8px] font-medium normal-case leading-snug tracking-[0.12em] text-white/38 underline decoration-white/20 underline-offset-2 transition-colors hover:text-white/55 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/50"
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
                    "flex cursor-pointer flex-col items-center gap-1.5 rounded-lg px-1 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/60",
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
      </AquaHeroStatsCardShadowShell>
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

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative isolate -mt-24 min-h-[100dvh] scroll-mt-24 overflow-hidden bg-slate-950 text-white max-lg:overflow-visible lg:min-h-screen"
    >
      <HeroSalmonAmbientAudio heroRootRef={sectionRef} />
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 scale-[1.14] will-change-transform"
        style={{ y: bgParallaxY }}
        aria-hidden
      >
        <HeroBackground playbackReady={heroRevealReady} />
      </motion.div>

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col overflow-visible px-6 pb-10 pt-[calc(5.125rem+10px)] sm:px-10 sm:pb-20 sm:pt-[calc(6rem+10px)] lg:overflow-visible lg:px-12 lg:pb-24">
        <div
          className="flex min-h-0 flex-1 flex-col justify-start overflow-visible"
          data-hero-animate={heroRevealReady ? "true" : "false"}
        >
          <HeroPrimaryContent heroRevealReady={heroRevealReady} />
        </div>
      </div>
    </section>
  );
}

function HeroBackground({
  playbackReady,
}: {
  /** After preloader — content visible; iOS needs this before reliable autoplay. */
  playbackReady: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const playAttemptsRef = useRef(0);

  useEffect(() => {
    if (reduceMotion) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let retryTimer: number | undefined;
    let mayPlay = playbackReady;

    const attemptPlay = () => {
      if (cancelled || !mayPlay) return;

      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
        video.load();
      }

      void video.play().catch(() => {});
    };

    const scheduleRetry = () => {
      if (cancelled || playAttemptsRef.current >= HERO_VIDEO_PLAY_MAX_ATTEMPTS) {
        return;
      }
      playAttemptsRef.current += 1;
      retryTimer = window.setTimeout(attemptPlay, HERO_VIDEO_PLAY_RETRY_MS);
    };

    const onReady = () => {
      attemptPlay();
      scheduleRetry();
    };

    const onPlaying = () => {
      playAttemptsRef.current = HERO_VIDEO_PLAY_MAX_ATTEMPTS;
    };

    const onVisibilityChange = () => {
      if (!document.hidden) attemptPlay();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) attemptPlay();
    };

    const unlockOnGesture = () => {
      mayPlay = true;
      attemptPlay();
    };

    const onContentVisible = () => {
      mayPlay = true;
      playAttemptsRef.current = 0;
      attemptPlay();
    };

    if (playbackReady) {
      mayPlay = true;
      playAttemptsRef.current = 0;
      attemptPlay();
    }

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("canplaythrough", onReady);
    video.addEventListener("playing", onPlaying);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("hyperia:hero-content-visible", onContentVisible);
    document.addEventListener("touchstart", unlockOnGesture, {
      capture: true,
      once: true,
    });
    document.addEventListener("click", unlockOnGesture, {
      capture: true,
      once: true,
    });

    return () => {
      cancelled = true;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("canplaythrough", onReady);
      video.removeEventListener("playing", onPlaying);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("hyperia:hero-content-visible", onContentVisible);
      document.removeEventListener("touchstart", unlockOnGesture, true);
      document.removeEventListener("click", unlockOnGesture, true);
    };
  }, [reduceMotion, playbackReady]);

  return (
    <>
      <div className="absolute inset-0 z-0 bg-slate-950" aria-hidden />
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover motion-reduce:opacity-0"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden
      >
        <source src={AQUA_HERO_VIDEO_MP4_SRC} type="video/mp4" />
        <source src={AQUA_HERO_VIDEO_WEBM_SRC} type="video/webm" />
      </video>
      <div
        className="absolute inset-y-0 left-0 z-[1] w-1/2 backdrop-blur-[2px]"
        aria-hidden
      />
    </>
  );
}

function HeroPrimaryContent({ heroRevealReady }: { heroRevealReady: boolean }) {
  const isMobile = useMobileExperience();
  const reduceMotion = useReducedMotion() ?? false;
  const [mobileCardExpanded, setMobileCardExpanded] = useState(false);
  const headlineCollapseRef = useRef<HTMLDivElement>(null);
  const [headlineCollapsePx, setHeadlineCollapsePx] = useState(0);

  useEffect(() => {
    const node = headlineCollapseRef.current;
    if (!node) return;

    const measure = () => {
      if (node.offsetHeight > 0) {
        setHeadlineCollapsePx(node.offsetHeight);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileCardExpanded(false);
  }, [isMobile]);

  return (
    <div className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col gap-2 overflow-visible pt-1 sm:gap-6 lg:grid lg:flex-none lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,352px)] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-14 lg:gap-y-12 xl:gap-x-16">
      <div className="order-1 max-w-xl shrink-0 overflow-visible lg:col-start-1 lg:row-start-1 lg:max-w-lg xl:max-w-xl">
        <div className="hero-tag-lr relative z-30 mb-3.5 flex items-center gap-4 sm:mb-6">
          <span className="h-px w-10 shrink-0 bg-blue-600" aria-hidden />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/55">
            Excelencia industrial desde 1993
          </p>
        </div>

        <motion.div
          ref={headlineCollapseRef}
          className={cn(
            "relative z-0 overflow-visible",
            isMobile && mobileCardExpanded && "pointer-events-none",
          )}
          initial={false}
          animate={
            isMobile && mobileCardExpanded
              ? {
                  filter: reduceMotion ? "blur(0px)" : "blur(11px)",
                  opacity: 0.68,
                }
              : {
                  filter: "blur(0px)",
                  opacity: 1,
                }
          }
          transition={
            reduceMotion ? { duration: 0 } : AQUA_HERO_HOVER_LAYOUT_TRANSITION
          }
        >
          <h1 className="max-w-xl text-balance text-[2rem] font-light leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl sm:leading-[0.96] lg:text-6xl xl:text-7xl">
            <HeroHeadLine delayMs={140}>Inteligencia Nutricional</HeroHeadLine>
            <HeroHeadLine delayMs={240}>Industrial</HeroHeadLine>
          </h1>

          <div className="mt-4 max-w-lg text-sm leading-relaxed text-white/82 sm:mt-7 sm:text-lg sm:leading-8 lg:leading-9">
            <span className="lg:hidden">
              <HeroHeadLine delayMs={340}>
                Transformamos ciencia compleja en rendimiento
              </HeroHeadLine>
              <HeroHeadLine delayMs={440}>
                confiable para operaciones productivas de gran escala.
              </HeroHeadLine>
            </span>
            <span className="hidden lg:inline">
              <HeroHeadLine delayMs={340}>
                Transformamos ciencia compleja en rendimiento confiable
              </HeroHeadLine>
              <HeroHeadLine delayMs={440}>
                para operaciones productivas de gran escala.
              </HeroHeadLine>
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div className="relative z-20 order-2 flex w-full shrink-0 justify-start overflow-visible lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-end lg:pt-[calc(1.5rem+0.625rem)]">
        <AquaHeroSideCard
          heroRevealReady={heroRevealReady}
          mobileExpanded={mobileCardExpanded}
          onMobileExpandedChange={setMobileCardExpanded}
          headlineCollapsePx={headlineCollapsePx}
        />
      </motion.div>

      <div className="relative z-40 order-3 max-w-xl shrink-0 lg:col-start-1 lg:row-start-2 lg:max-w-lg xl:max-w-xl">
        <HeroCtaBar
          variant="inline"
          tone="on-dark"
          heroRevealReady={heroRevealReady}
          heroLastLineDelayMs={HERO_LAST_LINE_DELAY_MS}
          secondaryHref="/#calculadora"
          className="relative z-40 !mt-0 max-lg:[&>div]:!mt-1 max-lg:[&>div]:pointer-events-auto"
        />
      </div>
    </div>
  );
}
