"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
} from "framer-motion";
import { RotateCcw } from "lucide-react";

import Image from "next/image";

import {
  getTitleIntroFadeScrollDistance,
  NOSOTROS_TIMELINE_IMAGES,
} from "@/lib/nosotros-timeline-images";
import { getTimelineMilestone } from "@/lib/nosotros-timeline-milestones";
import {
  TIMELINE_FINALE_YEAR,
} from "@/lib/nosotros-timeline-years";
import { getTimelineTier, type TimelineTier } from "@/lib/timeline-capabilities";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

import { cn } from "@/lib/utils";
import TimelineCssFallback from "@/components/timeline-css-fallback";

const TIMELINE_VISIBLE_COUNT = 8;
const titleIntroFadeScrollDistance = getTitleIntroFadeScrollDistance(
  TIMELINE_VISIBLE_COUNT,
);

const InfiniteGallery = dynamic(
  () => import("@/components/ui/3d-gallery-photography"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-ns-dark">
        <p className="text-sm uppercase tracking-[0.2em] text-white/50">
          Cargando galería…
        </p>
      </div>
    ),
  },
);

export default function ImpactoHistorySection({
  className,
}: {
  className?: string;
}) {
  const [isActive, setIsActive] = useState(false);
  const [timelineYear, setTimelineYear] = useState<number | null>(null);
  const [atTimelineStart, setAtTimelineStart] = useState(false);
  const [atTimelineEnd, setAtTimelineEnd] = useState(false);
  const [gallerySessionKey, setGallerySessionKey] = useState(0);
  // null = not yet detected (SSR / first paint); determined on mount.
  const [tier, setTier] = useState<TimelineTier | null>(null);
  // The WebGL Canvas only mounts after the CTA is clicked (or the section nears viewport).
  const [galleryMounted, setGalleryMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleOverlayOpacity = useMotionValue(1);
  const lastTitleOpacityRef = useRef(1);
  const scrollOffsetRef = useRef(0);

  // Detect device tier once after hydration.
  useEffect(() => {
    setTier(getTimelineTier());
  }, []);

  // Pre-warm: when the section scrolls near the viewport, kick off the dynamic
  // import so the JS chunk is in the browser cache before the user clicks CTA.
  useEffect(() => {
    if (tier !== "high") return;
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          import("@/components/ui/3d-gallery-photography").catch(() => {});
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [tier]);

  const setStartTitleOpacity = useCallback(
    (scrollOffset: number) => {
      const opacity = Math.max(
        0,
        1 - scrollOffset / titleIntroFadeScrollDistance,
      );
      if (Math.abs(opacity - lastTitleOpacityRef.current) < 0.012) return;
      lastTitleOpacityRef.current = opacity;
      titleOverlayOpacity.set(opacity);
    },
    [titleOverlayOpacity],
  );

  const handleDeactivate = useCallback(() => {
    setIsActive(false);
    setTimelineYear(null);
    setAtTimelineStart(false);
    setAtTimelineEnd(false);
    setGallerySessionKey(0);
    lastTitleOpacityRef.current = 1;
    titleOverlayOpacity.set(1);
  }, [titleOverlayOpacity]);

  const handleRestartTimeline = useCallback(() => {
    setGallerySessionKey((key) => key + 1);
    setTimelineYear(null);
    setAtTimelineStart(true);
    setAtTimelineEnd(false);
    scrollOffsetRef.current = 0;
    lastTitleOpacityRef.current = 0;
    titleOverlayOpacity.set(0);
  }, [titleOverlayOpacity]);

  const handleTimelineScroll = useCallback(
    (scrollOffset: number) => {
      scrollOffsetRef.current = scrollOffset;
      if (!atTimelineEnd) {
        setStartTitleOpacity(scrollOffset);
      }
    },
    [atTimelineEnd, setStartTitleOpacity],
  );

  const handleTimelineYear = useCallback(
    (year: number, yearIndex: number) => {
      if (yearIndex < 0) {
        setAtTimelineStart(true);
        setTimelineYear(null);
        setAtTimelineEnd(false);
        return;
      }

      setAtTimelineStart(false);
      setAtTimelineEnd(false);

      if (year === TIMELINE_FINALE_YEAR) {
        setTimelineYear(null);
        return;
      }

      setTimelineYear(year);
    },
    [],
  );

  const beginTimeline = useCallback(() => {
    setGalleryMounted(true);
    setIsActive(true);
    setTimelineYear(null);
    setAtTimelineStart(true);
    setAtTimelineEnd(false);
    scrollOffsetRef.current = 0;
    lastTitleOpacityRef.current = 0;
    titleOverlayOpacity.set(0);
  }, [titleOverlayOpacity]);

  const handleTimelineComplete = useCallback(() => {
    setAtTimelineEnd(true);
    setAtTimelineStart(false);
    setTimelineYear(null);
    lastTitleOpacityRef.current = 1;
    titleOverlayOpacity.set(1);
  }, [titleOverlayOpacity]);

  useEffect(() => {
    if (!isActive) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleDeactivate();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isActive, handleDeactivate]);

  const showTitleOverlay = !isActive || atTimelineEnd;
  const showYear = isActive && timelineYear !== null;
  const showScrollHint =
    isActive && (atTimelineStart || atTimelineEnd);
  const activeMilestone =
    timelineYear !== null ? getTimelineMilestone(timelineYear) : undefined;
  const finaleMilestone = getTimelineMilestone(TIMELINE_FINALE_YEAR);
  const showMilestone = showYear && activeMilestone !== undefined;
  const isEndingOverlay = atTimelineEnd && finaleMilestone !== undefined;

  // Low-tier or unknown: show the CSS fallback immediately (no WebGL).
  // "unknown" (tier === null) resolves on first paint and is handled by the CTA
  // being visible in both paths, so there is no layout shift.
  const useCssFallback = tier === "low";

  return (
    <section
      ref={sectionRef}
      className={cn(
        "px-4 py-4 sm:px-6 sm:py-6 lg:px-8",
        className,
      )}
      aria-labelledby="nosotros-historia-heading"
    >
      <div className="relative min-h-[calc(100dvh-8rem)] w-full overflow-hidden rounded-[2rem] border border-ns-border/40 bg-ns-dark sm:min-h-[calc(100dvh-9rem)] sm:rounded-[2.5rem]">

        {/* ── CSS fallback path ─────────────────────────────────────────────── */}
        {useCssFallback && (
          <TimelineCssFallback
            active={isActive}
            onBegin={beginTimeline}
            className="absolute inset-0 z-[1]"
          />
        )}

        {/* ── WebGL path ────────────────────────────────────────────────────── */}
        {!useCssFallback && (
          <>
            <Image
              src={PUBLIC_ASSETS.timeline.background}
              alt=""
              fill
              priority
              sizes="100vw"
              className="pointer-events-none object-cover object-center"
              aria-hidden
            />

            {/* Canvas only mounts after "Ver nuestra historia" is clicked */}
            {galleryMounted && (
              <InfiniteGallery
                images={NOSOTROS_TIMELINE_IMAGES}
                speed={1.2}
                visibleCount={TIMELINE_VISIBLE_COUNT}
                interactive={isActive}
                sessionKey={gallerySessionKey}
                forwardScrollLocked={atTimelineEnd}
                onTimelineScroll={handleTimelineScroll}
                onTimelineYear={handleTimelineYear}
                onTimelineComplete={handleTimelineComplete}
                className={`absolute inset-0 z-[1] h-full w-full ${isActive ? "" : "pointer-events-none"}`}
              />
            )}

            <AnimatePresence>
              {showTitleOverlay && (
                <motion.div
                  key="title-overlay"
                  initial={false}
                  style={{ opacity: titleOverlayOpacity }}
                  className="pointer-events-none absolute inset-0 z-10"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-ns-dark/70 via-transparent to-ns-dark/85"
                    aria-hidden
                  />

                  <div
                    className={cn(
                      "absolute inset-0 flex flex-col items-center px-6 text-center",
                      isEndingOverlay
                        ? "max-sm:justify-end max-sm:pb-[7.75rem] sm:justify-center"
                        : "max-sm:pb-[7.75rem] sm:justify-center",
                    )}
                  >
                    <div
                      className={cn(
                        "flex flex-col items-center",
                        !isEndingOverlay &&
                          "max-sm:flex-1 max-sm:justify-center",
                      )}
                    >
                      <p
                        className={cn(
                          "text-xs font-semibold uppercase tracking-[0.35em]",
                          isEndingOverlay ? "text-white" : "text-ns-emerald",
                        )}
                      >
                        Nuestra historia
                      </p>
                      <h2
                        id="nosotros-historia-heading"
                        className="mt-4 max-w-3xl text-balance text-3xl font-bold leading-tight text-white mix-blend-exclusion sm:text-5xl md:text-6xl"
                      >
                        {isEndingOverlay && finaleMilestone ? (
                          <>
                            Más de tres décadas
                            <br />
                            <span className="font-light italic">
                              impulsando resultados
                            </span>
                          </>
                        ) : (
                          <>
                            Más de 30 años
                            <br />
                            <span className="font-light italic">
                              de trayectoria
                            </span>
                          </>
                        )}
                      </h2>
                    </div>
                    {isEndingOverlay && finaleMilestone ? (
                      <p className="max-w-xl shrink-0 text-pretty text-base leading-relaxed text-white sm:mt-5 sm:text-lg sm:leading-7 md:text-xl md:leading-8">
                        {finaleMilestone.summary}
                      </p>
                    ) : (
                      <p className="max-w-xl shrink-0 text-pretty text-base leading-relaxed text-white/75 sm:mt-5 sm:text-lg">
                        Más de 30 años desarrollando soluciones nutricionales que
                        ayudan a productores a obtener animales más sanos,
                        eficientes y productivos.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isActive && atTimelineEnd && (
                <motion.button
                  key="timeline-restart"
                  type="button"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  onClick={handleRestartTimeline}
                  aria-label="Reiniciar desde el inicio"
                  title="Reiniciar desde el inicio"
                  className="absolute right-4 top-4 z-40 flex h-7 w-7 items-center justify-center rounded-full border border-white/35 bg-ns-dark/45 text-white/80 backdrop-blur-sm transition-colors hover:border-ns-emerald/45 hover:bg-ns-emerald/15 hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ns-emerald/50 sm:right-6 sm:top-6 sm:h-8 sm:w-8"
                >
                  <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2} />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {showYear && (
                <motion.p
                  key={timelineYear}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute inset-x-0 top-[18%] z-20 text-center text-6xl font-bold tabular-nums tracking-tight text-white mix-blend-exclusion sm:top-[20%] sm:text-8xl md:text-9xl"
                  aria-live="polite"
                >
                  {timelineYear}
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {showMilestone && activeMilestone && (
                <motion.div
                  key={timelineYear}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute inset-x-0 bottom-[16%] z-20 mx-auto max-w-md px-6 text-center sm:bottom-[28%] sm:max-w-xl md:max-w-2xl"
                  aria-live="polite"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-white sm:text-xs sm:font-semibold sm:tracking-[0.24em]">
                    {activeMilestone.title}
                  </p>
                  <p className="mt-4 text-pretty text-base leading-relaxed text-white sm:mt-3 sm:text-lg sm:leading-7 md:text-xl md:leading-8">
                    {activeMilestone.summary}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-3 px-4 pb-8 pt-6 text-center">
              <AnimatePresence mode="wait">
                {!isActive ? (
                  <motion.button
                    key="cta"
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.35 }}
                    onClick={beginTimeline}
                    className="relative inline-flex items-center justify-center rounded-full border border-white/55 bg-white/10 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-sm transition-colors hover:border-ns-emerald/50 hover:bg-ns-emerald/15 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ns-emerald/50"
                  >
                    Ver nuestra historia
                  </motion.button>
                ) : (
                  showScrollHint && (
                    <motion.p
                      key="hint"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.35 }}
                      className="relative text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80"
                    >
                      {atTimelineStart
                        ? "Desplázate para comenzar la línea de tiempo"
                        : "Desplázate para explorar historia"}
                    </motion.p>
                  )
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
