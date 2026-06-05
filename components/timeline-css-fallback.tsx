"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";

import { TIMELINE_YEAR_SLIDES } from "@/lib/nosotros-timeline-images";
import { getTimelineMilestone } from "@/lib/nosotros-timeline-milestones";
import { TIMELINE_FINALE_YEAR } from "@/lib/nosotros-timeline-years";
import { PUBLIC_ASSETS } from "@/lib/public-assets";
import { cn } from "@/lib/utils";

type TimelineCssFallbackProps = {
  /** Whether the user has clicked "Ver nuestra historia" */
  active: boolean;
  onBegin: () => void;
  className?: string;
};

/**
 * CSS-only timeline for low-end devices / reduced-motion preference.
 * Mirrors the narrative arc of the WebGL gallery using scroll-snap vertical slides.
 */
export default function TimelineCssFallback({
  active,
  onBegin,
  className,
}: TimelineCssFallbackProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / el.clientHeight);
    setCurrentSlideIndex(Math.min(index, TIMELINE_YEAR_SLIDES.length - 1));
  }, []);

  const currentSlide = TIMELINE_YEAR_SLIDES[currentSlideIndex];
  const isFinale =
    currentSlide !== undefined && currentSlide.year === TIMELINE_FINALE_YEAR;
  const activeMilestone =
    currentSlide !== undefined
      ? getTimelineMilestone(currentSlide.year)
      : undefined;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* Static background */}
      <Image
        src={PUBLIC_ASSETS.timeline.background}
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-center"
        aria-hidden
      />

      {/* Scroll container — only active after CTA click */}
      {active ? (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 snap-y snap-mandatory overflow-y-scroll overscroll-contain scroll-smooth"
          aria-label="Línea de tiempo Nutriservice"
        >
          {TIMELINE_YEAR_SLIDES.map((slide, i) => {
            const milestone = getTimelineMilestone(slide.year);
            const isFinaleSlide = slide.year === TIMELINE_FINALE_YEAR;

            return (
              <figure
                key={slide.year}
                className="relative flex h-full w-full shrink-0 snap-start snap-always items-end"
              >
                {/* Slide image */}
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i < 2}
                  sizes="100vw"
                  className="object-cover object-center"
                />

                {/* Dark overlay for legibility */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-ns-dark/60 via-transparent to-ns-dark/80"
                  aria-hidden
                />

                {/* Year numeral */}
                {!isFinaleSlide && (
                  <p className="absolute inset-x-0 top-[18%] text-center text-6xl font-bold tabular-nums tracking-tight text-white mix-blend-exclusion sm:top-[20%] sm:text-8xl md:text-9xl">
                    {slide.year}
                  </p>
                )}

                {/* Milestone text */}
                {milestone && (
                  <figcaption className="relative z-10 mx-auto mb-28 max-w-md px-6 text-center sm:mb-20 sm:max-w-xl md:max-w-2xl">
                    {isFinaleSlide ? (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white">
                          Nuestra historia
                        </p>
                        <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                          Más de tres décadas
                          <br />
                          <span className="font-light italic">
                            impulsando resultados
                          </span>
                        </h2>
                        <p className="mt-4 text-pretty text-base leading-relaxed text-white sm:mt-5 sm:text-lg sm:leading-7">
                          {milestone.summary}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-white sm:text-xs sm:font-semibold sm:tracking-[0.24em]">
                          {milestone.title}
                        </p>
                        <p className="mt-4 text-pretty text-base leading-relaxed text-white sm:mt-3 sm:text-lg sm:leading-7 md:text-xl md:leading-8">
                          {milestone.summary}
                        </p>
                      </>
                    )}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      ) : (
        // Static intro state — mirrors the WebGL intro overlay
        <div className="absolute inset-0 bg-gradient-to-b from-ns-dark/70 via-transparent to-ns-dark/85" />
      )}

      {/* Year indicator pill while scrolling */}
      {active && !isFinale && currentSlide && (
        <div
          className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-full border border-white/20 bg-ns-dark/50 px-4 py-1.5 text-xs font-semibold tabular-nums tracking-widest text-white/80 backdrop-blur-sm"
          aria-live="polite"
        >
          {currentSlideIndex + 1} / {TIMELINE_YEAR_SLIDES.length}
        </div>
      )}

      {/* CTA / hint */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-3 px-4 pb-8 pt-6 text-center">
        {!active ? (
          <button
            type="button"
            onClick={onBegin}
            className="relative inline-flex items-center justify-center rounded-full border border-white/55 bg-white/10 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-sm transition-colors hover:border-ns-emerald/50 hover:bg-ns-emerald/15 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ns-emerald/50"
          >
            Ver nuestra historia
          </button>
        ) : (
          currentSlideIndex === 0 && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
              Desplázate para comenzar la línea de tiempo
            </p>
          )
        )}
      </div>

      {/* Intro overlay text (visible before CTA) */}
      {!active && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center max-sm:pb-[7.75rem] sm:justify-center">
          <div className="flex flex-col items-center max-sm:flex-1 max-sm:justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ns-emerald">
              Nuestra historia
            </p>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-bold leading-tight text-white mix-blend-exclusion sm:text-5xl md:text-6xl">
              Más de 30 años
              <br />
              <span className="font-light italic">de trayectoria</span>
            </h2>
          </div>
          <p className="max-w-xl shrink-0 text-pretty text-base leading-relaxed text-white/75 sm:mt-5 sm:text-lg">
            Más de 30 años desarrollando soluciones nutricionales que ayudan a
            productores a obtener animales más sanos, eficientes y productivos.
          </p>
        </div>
      )}
    </div>
  );
}
