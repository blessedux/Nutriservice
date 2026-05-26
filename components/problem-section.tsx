"use client";

import * as React from "react";
import ProblemMorphGlbViewer from "@/components/problem-morph-glb-viewer";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export type ProblemCard = {
  title: string;
  detail: string;
  metric: string;
  metricCaption: string;
  trend: string;
  trendTone?: "amber" | "rose" | "cyan";
  sparkPattern: number[];
};

export type IntroBullet = {
  text: string;
};

const TREND_STYLES: Record<
  NonNullable<ProblemCard["trendTone"]>,
  string
> = {
  amber:
    "border-amber-400/25 bg-amber-400/10 text-amber-100/95",
  rose: "border-rose-400/25 bg-rose-400/10 text-rose-100/95",
  cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-100/95",
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

function useSectionInView<T extends HTMLElement>(threshold = 0.14) {
  const ref = React.useRef<T>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true);
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function clamp01(n: number) {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / Math.max(1e-6, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function AnimatedSparkBars({
  values,
  active,
  cardIndex,
  reducedMotion,
}: {
  values: number[];
  active: boolean;
  cardIndex: number;
  reducedMotion: boolean;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!active) {
      setMounted(false);
      return;
    }
    if (reducedMotion) {
      setMounted(true);
      return;
    }
    const base = 320 + cardIndex * 100;
    const t = window.setTimeout(() => {
      requestAnimationFrame(() => setMounted(true));
    }, base);
    return () => clearTimeout(t);
  }, [active, cardIndex, reducedMotion]);

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <div
      className="flex h-[76px] items-stretch gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2 py-2"
      aria-hidden
    >
      {values.map((v, i) => {
        const targetPct = Math.max(14, Math.round(v * 100));
        const startPct = 8;
        return (
          <div
            key={i}
            className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden rounded-md bg-white/[0.06]"
          >
            <div
              className="w-full shrink-0 rounded-md bg-gradient-to-t from-cyan-600/55 to-cyan-300/95 shadow-[0_0_14px_rgba(34,211,238,0.22)]"
              style={{
                height: mounted ? `${targetPct}%` : `${startPct}%`,
                maxHeight: "100%",
                transition: reducedMotion
                  ? undefined
                  : `height 700ms ${ease}`,
                transitionDelay:
                  reducedMotion || !mounted ? "0ms" : `${i * 72}ms`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function ProblemStatCard({
  problem: p,
  cardIndex,
  tone,
  visible,
  reducedMotion,
  onMorphCardEnter,
  onMorphCardLeave,
  onMorphCardActivate,
}: {
  problem: ProblemCard;
  cardIndex: number;
  tone: NonNullable<ProblemCard["trendTone"]>;
  visible: boolean;
  reducedMotion: boolean;
  onMorphCardEnter?: (cardIndex: number) => void;
  onMorphCardLeave?: (cardIndex: number) => void;
  /** Primary tap / click — persists chicken morph until another KPI card is chosen */
  onMorphCardActivate?: (cardIndex: number) => void;
}) {
  const cardRef = React.useRef<HTMLElement>(null);
  const floatRef = React.useRef<HTMLDivElement>(null);
  const [hover, setHover] = React.useState(false);
  /** Viewport coordinates — tooltip uses position:fixed so it can overflow the card */
  const [cursor, setCursor] = React.useState({ cx: 0, cy: 0 });
  const [floaterDims, setFloaterDims] = React.useState({ w: 120, h: 28 });

  React.useLayoutEffect(() => {
    if (!hover) return;
    const el = floatRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setFloaterDims({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hover, p.trend]);

  const syncCursor = (e: React.PointerEvent<HTMLElement>) => {
    setCursor({ cx: e.clientX, cy: e.clientY });
  };

  const vm = 8;
  const gap = 10;
  const vw =
    typeof window !== "undefined" ? window.innerWidth : 400;
  const vh =
    typeof window !== "undefined" ? window.innerHeight : 800;
  const fw = Math.max(floaterDims.w, 48);
  const fh = Math.max(floaterDims.h, 24);

  let tipLeft = cursor.cx + gap;
  let tipTop = cursor.cy + gap;
  if (tipLeft + fw > vw - vm) {
    tipLeft = cursor.cx - fw - gap;
  }
  tipLeft = Math.max(vm, Math.min(tipLeft, vw - fw - vm));
  if (tipTop + fh > vh - vm) {
    tipTop = cursor.cy - fh - gap;
  }
  tipTop = Math.max(vm, Math.min(tipTop, vh - fh - vm));

  return (
    <article
      ref={cardRef}
      onPointerEnter={(e) => {
        setHover(true);
        syncCursor(e);
        onMorphCardEnter?.(cardIndex);
      }}
      onPointerMove={syncCursor}
      onPointerLeave={() => {
        setHover(false);
        onMorphCardLeave?.(cardIndex);
      }}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        onMorphCardActivate?.(cardIndex);
        onMorphCardEnter?.(cardIndex);
      }}
      className={[
        "group/card relative flex flex-col overflow-visible rounded-2xl border border-white/14",
        "bg-gradient-to-br from-white/[0.09] to-white/[0.02]",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-sm",
        "transition-[transform,box-shadow,border-color] duration-300",
        "hover:-translate-y-0.5 hover:border-white/26 hover:shadow-[0_14px_44px_-18px_rgba(0,0,0,0.55)]",
        reducedMotion ? "" : "transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
      style={
        reducedMotion
          ? undefined
          : { transitionDelay: `${80 + cardIndex * 90}ms` }
      }
    >
      {hover ? (
        <div
          ref={floatRef}
          className={[
            "pointer-events-none fixed z-[200] rounded-md border px-2.5 py-2 text-left font-mono text-[8px] uppercase leading-snug tracking-wide shadow-xl backdrop-blur-md",
            TREND_STYLES[tone],
            reducedMotion ? "" : "transition-all duration-75 ease-out",
          ].join(" ")}
          style={{
            left: tipLeft,
            top: tipTop,
            width: "max-content",
            maxWidth: "min(320px,calc(100vw - 20px))",
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
          role="status"
          aria-live="polite"
        >
          {p.trend}
        </div>
      ) : null}

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="font-mono text-[8px] font-medium uppercase tracking-[0.28em] text-white/40">
            KPI
          </span>
          <span
            className={[
              "max-w-[62%] truncate rounded-md border px-2 py-0.5 text-right font-mono text-[8px] uppercase tracking-wide transition-opacity duration-150",
              TREND_STYLES[tone],
              hover ? "pointer-events-none opacity-0" : "opacity-100",
            ].join(" ")}
            title={p.trend}
            aria-hidden={hover}
          >
            {p.trend}
          </span>
        </div>

        <p className="mt-3 font-mono text-[26px] font-semibold leading-none tracking-tight text-white tabular-nums sm:text-[28px]">
          {p.metric}
        </p>
        <p className="mt-2 text-[11px] leading-snug text-white/52">
          {p.metricCaption}
        </p>

        <div className="mt-4 flex-1">
          <AnimatedSparkBars
            values={p.sparkPattern}
            active={visible || reducedMotion}
            cardIndex={cardIndex}
            reducedMotion={reducedMotion}
          />
        </div>

        <h3 className="mt-4 border-t border-white/10 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65">
          {p.title}
        </h3>
      </div>
    </article>
  );
}

type ProblemSectionProps = {
  eyebrow: string;
  headline: string;
  introBullets: IntroBullet[];
  problems: ProblemCard[];
  /**
   * Scroll-track length before transition slack (viewport multiples). Backdrop covers the full track.
   * Typically `1` (=100vh of scroll until slack begins).
   */
  pinnedViewportVh?: number;
  /**
   * Extra scroll length (viewport units) after `pinnedViewportVh` for sticky pin +
   * KPI → reveal crossfade. Omit or reduced motion → normal flow (no pin).
   */
  pinnedTransitionScrollVh?: number;
  /** Shown on the left as KPI grid fades out; only used when pin scroll is enabled */
  revealPanel?: React.ReactNode;
  /** Anchored to the bottom of the pinned viewport (or below the main row when not pinned). */
  bottomStats?: React.ReactNode;
  /** KPI card index (0-based) whose hover/press morphs the 3D model toward the chicken asset. */
  morphChickenCardIndex?: number;
  sheepModelSrc?: string;
  chickenModelSrc?: string;
};

function ProblemBackgroundLayers() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${PUBLIC_ASSETS.problemSection.backgroundTeal})` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/45 via-[55%] to-transparent"
        aria-hidden
      />
    </>
  );
}

function fmtThousands(n: number) {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function useStatsBarInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e?.isIntersecting ?? false);
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function useCountUp(
  target: number,
  active: boolean,
  durationMs: number,
  startDelayMs: number,
  reducedMotion: boolean,
) {
  const [value, setValue] = React.useState(
    reducedMotion && active ? target : 0,
  );

  React.useEffect(() => {
    if (reducedMotion) {
      setValue(active ? target : 0);
      return;
    }
    if (!active) {
      setValue(0);
      return;
    }

    let raf = 0;
    let startAt = 0;
    setValue(0);
    const delayId = window.setTimeout(() => {
      startAt = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - startAt) / durationMs);
        setValue(Math.round(target * easeOutCubic(t)));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, startDelayMs);

    return () => {
      window.clearTimeout(delayId);
      cancelAnimationFrame(raf);
    };
  }, [target, active, durationMs, startDelayMs, reducedMotion]);

  return value;
}

type TrustStatVariant =
  | "years"
  | "tonsPerYear"
  | "productivity"
  | "costPerKg";

function ProblemTrustStatColumn({
  animateInView,
  reducedMotion,
  target,
  durationMs,
  startDelayMs,
  tag,
  variant,
  borderLeft,
}: {
  animateInView: boolean;
  reducedMotion: boolean;
  target: number;
  durationMs: number;
  startDelayMs: number;
  tag: readonly [string, string];
  variant: TrustStatVariant;
  borderLeft: boolean;
}) {
  const active = animateInView || reducedMotion;

  const n = useCountUp(
    target,
    active,
    durationMs,
    startDelayMs,
    reducedMotion,
  );

  const numberClass =
    "min-h-[2.5rem] font-mono text-[36px] font-semibold leading-none tracking-tight text-white tabular-nums sm:min-h-[2.75rem] sm:text-[42px] lg:min-h-[3rem] lg:text-[2.75rem]";

  const tagClass =
    "mt-3 max-w-[15rem] text-balance text-[11px] font-medium uppercase leading-snug tracking-[0.1em] text-white/55 sm:max-w-[17rem] sm:text-xs sm:leading-snug";

  let valueNode: React.ReactNode;
  if (variant === "years") {
    valueNode = <span>+{n}</span>;
  } else if (variant === "tonsPerYear") {
    valueNode = <span>+{fmtThousands(n)}</span>;
  } else if (variant === "productivity") {
    valueNode = <span>{n}%</span>;
  } else {
    valueNode = <span>{n}%</span>;
  }

  return (
    <div
      className={[
        "flex min-w-0 flex-1 flex-col items-center text-center sm:px-3 lg:px-6",
        borderLeft ? "lg:border-l lg:border-white/12" : "",
      ].join(" ")}
    >
      <p className={numberClass}>{valueNode}</p>
      <p className={tagClass}>
        <span className="block">{tag[0]}</span>
        <span className="mt-1 block">{tag[1]}</span>
      </p>
    </div>
  );
}

export function ProblemTrustStatsBar() {
  const reducedMotion = usePrefersReducedMotion();
  const { ref, inView } = useStatsBarInView<HTMLDivElement>(0.18);

  const columns = [
    {
      key: "years",
      target: 30,
      durationMs: 1250,
      startDelayMs: 80,
      variant: "years" as const,
      tag: ["años de experiencia", "en la industria"],
    },
    {
      key: "tons",
      target: 5000,
      durationMs: 1600,
      startDelayMs: 200,
      variant: "tonsPerYear" as const,
      tag: ["toneladas de premezclas", "formuladas al año"],
    },
    {
      key: "productivity",
      target: 6,
      durationMs: 1300,
      startDelayMs: 320,
      variant: "productivity" as const,
      tag: [
        "kilos adicionales producidos",
        "por tonelada de alimento",
      ],
    },
    {
      key: "cost",
      target: 8,
      durationMs: 1300,
      startDelayMs: 440,
      variant: "costPerKg" as const,
      tag: ["reducción en el costo", "por kilo producido"],
    },
  ] as const;

  return (
    <div
      ref={ref}
      className="mx-auto grid w-full grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4 lg:gap-0 lg:max-w-none"
      role="group"
      aria-label="Trayectoria Nutriservice"
    >
      {columns.map((col, i) => (
        <ProblemTrustStatColumn
          key={col.key}
          animateInView={inView}
          reducedMotion={reducedMotion}
          target={col.target}
          durationMs={col.durationMs}
          startDelayMs={col.startDelayMs}
          tag={col.tag}
          variant={col.variant}
          borderLeft={i > 0}
        />
      ))}
    </div>
  );
}

export default function ProblemSection({
  eyebrow,
  headline,
  introBullets,
  problems,
  pinnedViewportVh = 1,
  pinnedTransitionScrollVh,
  revealPanel,
  bottomStats,
  morphChickenCardIndex = 1,
  sheepModelSrc = PUBLIC_ASSETS.problemSection.sheepModel,
  chickenModelSrc = PUBLIC_ASSETS.problemSection.chickenModel,
}: ProblemSectionProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { ref: sectionRef, visible } = useSectionInView<HTMLElement>();
  const introActive = visible || reducedMotion;

  const [hoveredMorphCard, setHoveredMorphCard] = React.useState<number | null>(
    null,
  );
  /** Card 2 (variabilidad / índice `morphChickenCardIndex`): tap locks chicken until another KPI card is tapped */
  const [chickenMorphLocked, setChickenMorphLocked] = React.useState(false);

  const morphTarget =
    chickenMorphLocked || hoveredMorphCard === morphChickenCardIndex ? 1 : 0;

  const handleMorphCardEnter = React.useCallback((i: number) => {
    setHoveredMorphCard(i);
  }, []);

  const handleMorphCardLeave = React.useCallback((i: number) => {
    setHoveredMorphCard((prev) => (prev === i ? null : prev));
  }, []);

  const handleMorphCardActivate = React.useCallback(
    (i: number) => {
      if (i === morphChickenCardIndex) setChickenMorphLocked(true);
      else setChickenMorphLocked(false);
    },
    [morphChickenCardIndex],
  );

  const pinActive =
    typeof pinnedTransitionScrollVh === "number" &&
    pinnedTransitionScrollVh > 0 &&
    !!revealPanel &&
    !reducedMotion;

  const viewportVh = pinnedViewportVh > 0 ? pinnedViewportVh : 1;
  const totalPinScrollVh =
    pinActive ? viewportVh + pinnedTransitionScrollVh! : 0;

  const [pinProgress, setPinProgress] = React.useState(0);

  React.useEffect(() => {
    if (!pinActive) {
      setPinProgress(0);
      return;
    }

    let raf = 0;
    const tick = () => {
      const el = sectionRef.current;
      if (!el) return;
      const topDoc = el.getBoundingClientRect().top + window.scrollY;
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = clamp01((window.scrollY - topDoc) / span);
      setPinProgress((prev) => (Math.abs(prev - p) < 0.002 ? prev : p));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pinActive]);

  /** Crossfade KPI column → reveal finishes in the first ~60% of the pin track */
  const swapPhase = pinActive ? smoothstep(0.12, 0.58, pinProgress) : 0;

  React.useEffect(() => {
    if (pinActive && swapPhase > 0.9) {
      setHoveredMorphCard(null);
      setChickenMorphLocked(false);
    }
  }, [pinActive, swapPhase]);

  const cardsFadeStyle: React.CSSProperties = pinActive
    ? {
        opacity: 1 - swapPhase,
        pointerEvents: swapPhase > 0.92 ? "none" : "auto",
      }
    : {};

  /** After section is visible: bullet 0 → cyan @ 2s, bullet 1 → cyan @ 4s */
  const [bulletLitStage, setBulletLitStage] = React.useState(0);

  React.useEffect(() => {
    if (reducedMotion && visible) {
      setBulletLitStage(2);
      return;
    }
    if (!visible) return;

    setBulletLitStage(0);
    const t1 = window.setTimeout(() => setBulletLitStage(1), 2000);
    const t2 = window.setTimeout(() => setBulletLitStage(2), 4000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [visible, reducedMotion]);

  const headerBlock = (
    <header className={pinActive ? "mb-6 lg:mb-8" : "mb-10 lg:mb-12"}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/90">
        {eyebrow}
      </p>
      <h2
        className={[
          "max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl",
          reducedMotion ? "" : "transition-all duration-700 ease-out",
          introActive
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0",
        ].join(" ")}
        style={reducedMotion ? undefined : { transitionDelay: "70ms" }}
      >
        {headline}
      </h2>
    </header>
  );

  const gridAndBullets = (
    <>
      <div
        className={[
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
          pinActive ? "gap-4" : "gap-5",
        ].join(" ")}
      >
        {problems.map((p, cardIndex) => (
          <ProblemStatCard
            key={p.title}
            problem={p}
            cardIndex={cardIndex}
            tone={p.trendTone ?? "cyan"}
            visible={visible || reducedMotion}
            reducedMotion={reducedMotion}
            onMorphCardEnter={handleMorphCardEnter}
            onMorphCardLeave={handleMorphCardLeave}
            onMorphCardActivate={handleMorphCardActivate}
          />
        ))}
      </div>

      <ul
        className={[
          "flex max-w-xl flex-col border-t border-white/10 text-left",
          pinActive
            ? "mt-6 gap-4 pt-6 lg:mt-8 lg:pt-8"
            : "mt-10 gap-5 pt-10 lg:mt-12 lg:pt-10",
        ].join(" ")}
      >
        {introBullets.map((item, i) => {
          const lit =
            reducedMotion ||
            (i === 0 ? bulletLitStage >= 1 : bulletLitStage >= 2);
          return (
            <li
              key={`${item.text}-${i}`}
              className={[
                "flex gap-3",
                reducedMotion ? "" : "transition-opacity duration-500 ease-out",
                introActive
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0",
              ].join(" ")}
              style={
                reducedMotion
                  ? undefined
                  : { transitionDelay: introActive ? `${80 + i * 60}ms` : "0ms" }
              }
            >
              <span
                className={[
                  "mt-2 h-2 w-2 shrink-0 rounded-full transition-all duration-[1100ms] ease-out",
                  lit
                    ? "bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.75)]"
                    : "bg-neutral-500 shadow-none",
                ].join(" ")}
                aria-hidden
              />
              <span
                className={[
                  "text-sm leading-relaxed transition-colors duration-[1100ms] ease-out sm:text-[15px]",
                  lit ? "text-cyan-200" : "text-neutral-500",
                ].join(" ")}
              >
                {item.text}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );

  const sheepColumn = (
    <div className="relative z-10 flex w-full min-w-0 shrink-0 flex-col items-stretch justify-center overflow-visible lg:w-[min(460px,38vw)] lg:min-w-[280px] xl:w-[min(500px,36vw)]">
      <ProblemMorphGlbViewer
        className="w-full min-w-0"
        compact={pinActive}
        morphTarget={morphTarget}
        reducedMotion={reducedMotion}
        sheepSrc={sheepModelSrc}
        chickenSrc={chickenModelSrc}
      />
    </div>
  );

  const leftColumn = pinActive && revealPanel ? (
    <div className="relative z-10 grid min-h-0 min-w-0 flex-1 grid-cols-1 overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:min-w-0">
      <div
        className="flex max-w-xl flex-col lg:max-w-[min(42rem,100%)]"
        style={{
          ...cardsFadeStyle,
          zIndex: swapPhase < 0.5 ? 2 : 1,
        }}
        aria-hidden={swapPhase > 0.94}
      >
        {gridAndBullets}
      </div>
      <div
        className="flex max-w-xl flex-col lg:max-w-[min(42rem,100%)]"
        style={{
          opacity: swapPhase,
          pointerEvents: swapPhase < 0.08 ? "none" : "auto",
          zIndex: swapPhase >= 0.5 ? 2 : 1,
        }}
        aria-hidden={swapPhase < 0.08}
      >
        {revealPanel}
      </div>
    </div>
  ) : (
    <div className="relative z-10 flex min-w-0 flex-1 flex-col">
      <div style={cardsFadeStyle}>{gridAndBullets}</div>
    </div>
  );

  const mainRow = (
    <div
      className={[
        "flex flex-col lg:flex-row",
        pinActive
          ? "gap-8 lg:items-center lg:gap-8 xl:gap-10"
          : "gap-10 lg:items-start lg:gap-10 xl:gap-14",
      ].join(" ")}
    >
      {leftColumn}
      {sheepColumn}
    </div>
  );

  const statsBlock =
    bottomStats != null ? (
      <div className="relative z-10 mt-10 w-full shrink-0 border-t border-white/14 pt-8 lg:mt-12 lg:pt-10">
        {bottomStats}
      </div>
    ) : null;

  if (!pinActive) {
    return (
      <section
        ref={sectionRef}
        id="problema"
        className="relative scroll-mt-24 overflow-x-hidden overflow-y-visible px-6 pb-32 pt-24"
      >
        <ProblemBackgroundLayers />
        <div className="relative z-10 mx-auto max-w-6xl text-left">
          {headerBlock}
          {mainRow}
          {statsBlock}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="problema"
      className="relative isolate scroll-mt-24 overflow-hidden"
      style={{ height: `${totalPinScrollVh * 100}vh` }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <ProblemBackgroundLayers />
      </div>

      {/*
        Main column group vertically centered in remaining space; stats sit on the bottom edge.
        KPI ↔ reveal stays clipped on the left column only.
      */}
      <div className="sticky top-24 z-10 flex min-h-[calc(100dvh-6rem)] flex-col px-6 py-4 sm:py-6">
        <div className="relative z-10 mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col text-left">
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            {headerBlock}
            {mainRow}
          </div>
          {statsBlock}
        </div>
      </div>
    </section>
  );
}
