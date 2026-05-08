"use client";

import * as React from "react";

import { preloadScrollFrames, scrollFrameUrl } from "@/lib/scroll-frame-preload";

type ScrollFramePlayerProps = {
  framesDir: string;
  /**
   * Scroll step range is 0..(frameCount-1).
   * Example: frameCount=121 => steps 0..120
   */
  frameCount: number;
  /**
   * The first file frame number (1 => frame_0001.webp)
   */
  firstFrameNumber: number;
  /**
   * Total scroll distance, in viewport heights.
   * Example: 4 => 400vh track.
   */
  trackVh?: number;
  /**
   * Debug overlay grid (8x8).
   */
  debugGrid?: boolean;
  debugGridCols?: number;
  debugGridRows?: number;
  titles?: Array<{
    text: string;
    /**
     * Progress start, 0..1
     */
    start: number;
    /**
     * Progress end, 0..1. If omitted, title persists once shown.
     */
    end?: number;
    /**
     * Where to place the title overlay.
     */
    placement?: "bottom-center" | "top-left" | "bottom-right";
    className?: string;
    style?: React.CSSProperties;
  }>;
  annotations?: Array<{
    text: string;
    /**
     * Fade-in progress, 0..1
     */
    start: number;
    /**
     * Optional fade-out progress, 0..1
     */
    end?: number;
    /**
     * 1-indexed grid position (top-down rows, left-right columns)
     */
    row: number;
    col: number;
    /**
     * Optional svg asset to render as connector.
     * Should be an absolute public path, e.g. "/frames.../vector1.svg"
     */
    vectorSrc?: string;
    /**
     * How to anchor the vector at the frame center.
     * - "start": vector's left edge starts at center (default)
     * - "center": vector's center is placed at center
     */
    vectorAnchor?: "start" | "center";
    /**
     * How to transform the vector.
     * - "auto": rotate + scale towards the label (default)
     * - "fixed": keep original SVG angle/shape (no rotate/scale)
     */
    vectorTransform?: "auto" | "fixed";
    /**
     * Debug outline around this annotation label block.
     */
    debugBorder?: boolean;
    /**
     * Debug outline around this vector.
     */
    vectorDebugBorder?: boolean;
    /**
     * Additional vector translation in percentages of its own size.
     * Example: xPct=200 moves it right by 2x its width.
     */
    vectorOffset?: { xPct?: number; yPct?: number };
    /**
     * Manual transform controls (applied even when vectorTransform is "fixed").
     */
    vectorScale?: number;
    vectorRotateDeg?: number;
  }>;
  /**
   * Optional "cover" section that slides up over the final sticky viewport
   * (used for the Notes transition).
   */
  cover?: React.ReactNode;
};

function clamp01(n: number) {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / Math.max(1e-6, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export default function ScrollFramePlayer({
  framesDir,
  frameCount,
  firstFrameNumber,
  trackVh = 4,
  debugGrid = false,
  debugGridCols = 8,
  debugGridRows = 8,
  titles = [],
  annotations = [],
  cover,
}: ScrollFramePlayerProps) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = React.useState(0);
  const [frameIndex, setFrameIndex] = React.useState(0);
  const [scrollY, setScrollY] = React.useState(0);
  const [debugScrubEnabled, setDebugScrubEnabled] = React.useState(false);
  const [debugScrubIndex, setDebugScrubIndex] = React.useState(0);

  const activeIndex = debugScrubEnabled ? debugScrubIndex : frameIndex;
  const activeFrameNumber = firstFrameNumber + activeIndex;
  const activeSrc = scrollFrameUrl(framesDir, activeFrameNumber);

  /** Radial edge blur: sharp center, blurred perimeter; ramps up with scroll progress. */
  const edgeBlurPx = lerp(0, 42, Math.pow(progress, 1.12));
  const edgeBlurInnerPct = lerp(58, 34, progress);
  const edgeBlurOuterPct = Math.min(
    100,
    edgeBlurInnerPct + lerp(26, 44, progress),
  );
  const edgeBlurMask = `radial-gradient(ellipse 92% 88% at 50% 47%, transparent ${edgeBlurInnerPct}%, black ${edgeBlurOuterPct}%)`;

  const titleOpacity = React.useCallback(
    (t: { start: number; end?: number }, p: number) => {
      const start = clamp01(t.start);
      const end = t.end == null ? null : clamp01(t.end);

      const fade = 0.02; // ~2% of progress for soft edges
      if (end == null) {
        // Fade in at start, then stay.
        return smoothstep(start, start + fade, p);
      }

      if (p < start - fade || p > end + fade) return 0;
      const fadeIn = smoothstep(start, start + fade, p);
      const fadeOut = 1 - smoothstep(end - fade, end, p);
      return clamp01(Math.min(fadeIn, fadeOut));
    },
    [],
  );

  const gridPos = React.useCallback(
    (row: number, col: number) => {
      const cols = Math.max(1, debugGridCols);
      const rows = Math.max(1, debugGridRows);
      const c = Math.min(Math.max(col, 1), cols);
      const r = Math.min(Math.max(row, 1), rows);
      const rawLeft = ((c - 0.5) / cols) * 100;
      const rawTop = ((r - 0.5) / rows) * 100;

      // Keep annotations away from edges so they don't fall outside the frame.
      const insetX = 10; // %
      const insetY = 10; // %
      return {
        leftPct: Math.min(100 - insetX, Math.max(insetX, rawLeft)),
        topPct: Math.min(100 - insetY, Math.max(insetY, rawTop)),
      };
    },
    [debugGridCols, debugGridRows],
  );

  React.useEffect(() => {
    setDebugScrubIndex((prev) => Math.min(Math.max(prev, 0), frameCount - 1));
  }, [frameCount]);

  React.useEffect(() => {
    let raf = 0;

    const update = () => {
      const el = trackRef.current;
      const y = window.scrollY || 0;
      setScrollY(y);

      if (!el) {
        setProgress(0);
        setFrameIndex(0);
        return;
      }

      const rect = el.getBoundingClientRect();
      const top = rect.top + y;
      const height = rect.height;
      const viewport = window.innerHeight || 1;
      const maxScroll = Math.max(1, height - viewport);
      const p = clamp01((y - top) / maxScroll);
      setProgress((prev) =>
        Math.abs(prev - p) < 0.0015 ? prev : p,
      );

      const idx = Math.round(p * (frameCount - 1));
      setFrameIndex((prev) => (prev === idx ? prev : idx));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [frameCount]);

  React.useEffect(() => {
    preloadScrollFrames({
      framesDir,
      frameCount,
      firstFrameNumber,
      concurrency: 12,
    }).catch(() => {});
  }, [framesDir, frameCount, firstFrameNumber]);

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        className="relative"
        style={{ height: `${Math.max(1, trackVh) * 100}vh` }}
      >
        <div className="sticky top-16 h-[calc(100dvh-4rem)] flex items-center justify-center bg-neutral-950 overflow-hidden">
          <div className="relative h-full w-full overflow-hidden">
            <img
              src={activeSrc}
              alt={`frame ${activeIndex}`}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            {/* Same frame, blurred; radial mask keeps center sharp so titles stay readable */}
            {edgeBlurPx > 0.35 ? (
              <img
                src={activeSrc}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
                draggable={false}
                style={{
                  filter: `blur(${edgeBlurPx}px)`,
                  transform: "scale(1.06)",
                  WebkitMaskImage: edgeBlurMask,
                  maskImage: edgeBlurMask,
                  WebkitMaskSize: "100% 100%",
                  maskSize: "100% 100%",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />
            ) : null}

            {/* Progress darkening overlay: ramps up for legibility */}
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                backgroundColor: "black",
                // Start subtle, end stronger (0.06 -> 0.32), eased.
                opacity: 0.06 + Math.pow(progress, 1.2) * 0.26,
              }}
            />

            {debugGrid && (
              <div
                className="pointer-events-none absolute inset-0 opacity-50"
                aria-hidden
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)",
                    backgroundSize: `calc(100% / ${Math.max(1, debugGridCols)}) calc(100% / ${Math.max(1, debugGridRows)})`,
                  }}
                />
                <div className="absolute inset-x-0 top-1/3 h-px bg-cyan-400/40" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-cyan-400/40" />
                <div className="absolute inset-y-0 left-1/3 w-px bg-cyan-400/40" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-cyan-400/40" />
              </div>
            )}

            {annotations.length > 0 && (
              <div className="pointer-events-none absolute inset-0">
                {annotations.map((a) => {
                  const opacity = titleOpacity(a, progress);
                  if (opacity <= 0) return null;
                  const { leftPct, topPct } = gridPos(a.row, a.col);
                  const dx = leftPct - 50;
                  const dy = topPct - 50;
                  const angle = Math.atan2(dy, dx);
                  const dist = Math.sqrt(dx * dx + dy * dy); // in "percent points"
                  const scaleX = Math.max(0.2, dist / 50); // 0..~1 from center to edge
                  const vectorTransform = a.vectorTransform ?? "auto";
                  const vectorOffsetX = a.vectorOffset?.xPct ?? 0;
                  const vectorOffsetY = a.vectorOffset?.yPct ?? 0;
                  const vectorScale = a.vectorScale ?? 1;
                  const vectorRotateDeg = a.vectorRotateDeg ?? 0;

                  return (
                    <div
                      key={`${a.start}-${a.end ?? "∞"}-${a.row}-${a.col}-${a.text}`}
                      className="absolute"
                      style={{
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                        opacity,
                        transform: `translate(-50%, -50%) translateY(${lerp(8, 0, opacity)}px)`,
                      }}
                    >
                      {a.vectorSrc ? (
                        <div
                          className="absolute left-1/2 top-1/2 -z-10"
                          style={{
                            transform: [
                              "translate(-50%, -50%)",
                              vectorTransform === "fixed"
                                ? `rotate(${vectorRotateDeg}deg)`
                                : `rotate(${angle}rad) rotate(${vectorRotateDeg}deg)`,
                            ].join(" "),
                            transformOrigin: "center",
                            opacity,
                          }}
                        >
                          <img
                            src={a.vectorSrc}
                            alt=""
                            aria-hidden
                            className="block origin-left"
                            style={{
                              width: "min(544px, 56vw)",
                              height: "auto",
                              transform:
                                vectorTransform === "fixed"
                                  ? a.vectorAnchor === "center"
                                    ? `translate(-50%, -50%) translate(${vectorOffsetX}%, ${vectorOffsetY}%) scale(${vectorScale})`
                                    : `translate(0, -50%) translate(${vectorOffsetX}%, ${vectorOffsetY}%) scale(${vectorScale})`
                                  : a.vectorAnchor === "center"
                                    ? `translate(-50%, -50%) translate(${vectorOffsetX}%, ${vectorOffsetY}%) scale(${vectorScale}) scaleX(${scaleX})`
                                    : `translate(0, -50%) translate(${vectorOffsetX}%, ${vectorOffsetY}%) scale(${vectorScale}) scaleX(${scaleX})`,
                              filter:
                                "drop-shadow(0 2px 12px rgba(0,0,0,0.45))",
                              outline: a.vectorDebugBorder
                                ? "2px solid rgba(34, 197, 94, 0.95)"
                                : undefined,
                              outlineOffset: a.vectorDebugBorder ? "4px" : undefined,
                            }}
                          />
                        </div>
                      ) : null}

                      <div className="flex items-center gap-3">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 28 28"
                          fill="none"
                          aria-hidden
                        >
                          {/* technical "molecule / network" icon */}
                          <path
                            d="M6.2 9.2 14 5l7.8 4.2v9.6L14 23l-7.8-4.2V9.2Z"
                            stroke="rgba(255,255,255,0.78)"
                            strokeWidth="1"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 5v18M6.2 9.2 21.8 18.8M21.8 9.2 6.2 18.8"
                            stroke="rgba(255,255,255,0.35)"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                          <circle cx="14" cy="5" r="1.6" fill="rgba(255,255,255,0.95)" />
                          <circle cx="21.8" cy="9.2" r="1.4" fill="rgba(255,255,255,0.75)" />
                          <circle cx="21.8" cy="18.8" r="1.4" fill="rgba(255,255,255,0.75)" />
                          <circle cx="14" cy="23" r="1.6" fill="rgba(255,255,255,0.95)" />
                          <circle cx="6.2" cy="18.8" r="1.4" fill="rgba(255,255,255,0.75)" />
                          <circle cx="6.2" cy="9.2" r="1.4" fill="rgba(255,255,255,0.75)" />
                        </svg>
                        <div
                          className={[
                            "max-w-[320px]",
                            a.debugBorder
                              ? "outline outline-2 outline-red-500 outline-offset-4"
                              : "",
                          ].join(" ")}
                        >
                          <p
                            className="text-[12px] uppercase tracking-[0.22em] text-white/70"
                            style={{
                              fontFamily:
                                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            }}
                          >
                            annotation
                          </p>
                          <p
                            className="mt-1 text-[16px] leading-snug text-white"
                            style={{
                              fontFamily:
                                'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
                              letterSpacing: "0.01em",
                            }}
                          >
                            {a.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {titles.length > 0 && (
              <div className="pointer-events-none absolute inset-0">
                {titles.map((t) => {
                  const opacity = titleOpacity(t, progress);
                  if (opacity <= 0) return null;

                  const placement = t.placement ?? "bottom-center";
                  const basePlacementClass =
                    placement === "top-left"
                      ? "absolute left-0 top-0 p-8 text-left"
                      : placement === "bottom-right"
                        ? "absolute right-0 bottom-0 p-8 text-right"
                        : "absolute inset-x-0 bottom-0 pb-10 flex justify-center text-center";

                  const innerWidthClass =
                    placement === "top-left" || placement === "bottom-right"
                      ? "max-w-3xl"
                      : "max-w-5xl";

                  return (
                    <div
                      key={`${t.start}-${t.end ?? "∞"}-${t.text}`}
                      className={basePlacementClass}
                      style={{
                        opacity,
                        transform: `translateY(${lerp(10, 0, opacity)}px)`,
                      }}
                    >
                      <div className={`px-6 w-full ${innerWidthClass}`}>
                        <p
                          className={[
                            "text-balance font-semibold text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]",
                            placement === "top-left"
                              ? "leading-[1.05]"
                              : "text-lg sm:text-2xl lg:text-3xl",
                            t.className ?? "",
                          ].join(" ")}
                          style={t.style}
                        >
                          {t.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {cover ? (
        <section className="relative z-20 -mt-[calc(100dvh-4rem)] min-h-[100dvh] bg-white/80 backdrop-blur-md px-6 py-16 border-t border-neutral-200">
          {cover}
        </section>
      ) : null}
    </div>
  );
}

