"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { NOSOTROS_STORY_IMAGES } from "@/lib/nosotros-story-images";
import { FINAL_TIMELINE_YEAR_INDEX } from "@/lib/nosotros-timeline-years";

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

export default function ImpactoHistorySection() {
  const [isActive, setIsActive] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [timelineYear, setTimelineYear] = useState<number | null>(null);
  const [atTimelineEnd, setAtTimelineEnd] = useState(false);

  const handleDeactivate = useCallback(() => {
    setIsActive(false);
    setOverlayVisible(true);
    setTimelineYear(null);
    setAtTimelineEnd(false);
  }, []);

  const handleUserScroll = useCallback(() => {
    if (!atTimelineEnd) {
      setOverlayVisible(false);
    }
  }, [atTimelineEnd]);

  const handleTimelineYear = useCallback(
    (year: number, yearIndex: number) => {
      if (yearIndex < 0) {
        setTimelineYear(null);
        setAtTimelineEnd(false);
        setOverlayVisible(false);
        return;
      }
      setTimelineYear(year);
      if (yearIndex < FINAL_TIMELINE_YEAR_INDEX) {
        setAtTimelineEnd(false);
        setOverlayVisible(false);
      }
    },
    [],
  );

  const handleTimelineComplete = useCallback(() => {
    setAtTimelineEnd(true);
    setOverlayVisible(true);
  }, []);

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

  const showTitleOverlay = !isActive || overlayVisible;
  const showYear = isActive && timelineYear !== null && !atTimelineEnd;

  return (
    <section
      className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
      aria-labelledby="nosotros-historia-heading"
    >
      <div className="relative min-h-[calc(100dvh-8rem)] w-full overflow-hidden rounded-[2rem] border border-ns-border/40 bg-ns-dark sm:min-h-[calc(100dvh-9rem)] sm:rounded-[2.5rem]">
        <InfiniteGallery
          images={NOSOTROS_STORY_IMAGES}
          speed={1.2}
          visibleCount={8}
          interactive={isActive}
          forwardScrollLocked={atTimelineEnd}
          onUserScroll={handleUserScroll}
          onTimelineYear={handleTimelineYear}
          onTimelineComplete={handleTimelineComplete}
          className={`absolute inset-0 h-full w-full ${isActive ? "z-0" : "pointer-events-none z-0"}`}
        />

        <AnimatePresence>
          {showTitleOverlay && (
            <motion.div
              key="title-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute inset-0 z-10"
            >
              <div
                className="absolute inset-0 bg-gradient-to-b from-ns-dark/70 via-transparent to-ns-dark/85"
                aria-hidden
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ns-emerald">
                  Nuestra historia
                </p>
                <h2
                  id="nosotros-historia-heading"
                  className="mt-4 max-w-3xl text-balance text-3xl font-bold leading-tight text-white mix-blend-exclusion sm:text-5xl md:text-6xl"
                >
                  Más de 30 años
                  <br />
                  <span className="font-light italic">de trayectoria</span>
                </h2>
                <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
                  Desde formulación en laboratorio hasta maquila y soporte
                  técnico en campo — ciencia aplicada que transforma la
                  nutrición animal.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showYear && (
            <motion.p
              key={timelineYear}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute inset-x-0 top-[18%] z-20 text-center text-6xl font-bold tabular-nums tracking-tight text-white mix-blend-exclusion sm:top-[20%] sm:text-8xl md:text-9xl"
              aria-live="polite"
            >
              {timelineYear}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-3 px-4 pb-8 pt-16 text-center">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ns-dark via-ns-dark/80 to-transparent"
            aria-hidden
          />

          <AnimatePresence mode="wait">
            {!isActive ? (
              <motion.button
                key="cta"
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35 }}
                onClick={() => {
                  setIsActive(true);
                  setOverlayVisible(true);
                  setTimelineYear(null);
                  setAtTimelineEnd(false);
                }}
                className="relative inline-flex items-center justify-center rounded-full border border-white/55 bg-white/10 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-sm transition-colors hover:border-ns-emerald/50 hover:bg-ns-emerald/15 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ns-emerald/50"
              >
                Ver nuestra historia
              </motion.button>
            ) : (
              overlayVisible &&
              !atTimelineEnd && (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35 }}
                  className="relative text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80"
                >
                  Desplázate para explorar historia
                </motion.p>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
