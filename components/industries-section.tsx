"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { HOME_BLUE_BG } from "@/components/home-blue-band";
import { useMobileExperience } from "@/hooks/use-mobile-experience";
import { industryList, type Industry } from "@/lib/industries";
import { cn } from "@/lib/utils";

type CardMeta = {
  image: string;
  products: string[];
  title?: string;
};

type WheelEntry = {
  id: string;
  industry: Industry;
};

const INDUSTRIES_BG_VIDEO_SRC = "/industries_background.webm";
const INDUSTRIES_BG_IMAGE_SRC = "/background_nutriserviceA_highres.webp";

/** Shorter band than media aspect — background scales up to keep visual size */
const INDUSTRIES_SECTION_MIN_H =
  "min-h-[76dvh] sm:min-h-[80dvh] md:min-h-[84dvh] lg:min-h-[88dvh]";
const INDUSTRIES_BG_MEDIA_SCALE = "scale-[1.22]";

const CARD_META: Record<string, CardMeta> = {
  acuicola: {
    image: "/industries/acuicola.webp",
    products: ["ACTIVEMOS", "MACROGARD", "SILIMARINA 80%", "NUCLEOFORCE"],
  },
  avicola: {
    image: "/industries/avicola.webp",
    title: "Aves",
    products: ["HALOR TID", "MICROACID PLUS", "M-PROVE", "S-PROVE"],
  },
  porcina: {
    image: "/industries/porcina.webp",
    products: ["MACROGARD", "HALOR TID", "M-PROVE", "NUCLEOFORCE"],
  },
  mascotas: {
    image: "/industries/mascotas.webp",
    products: ["PALAUP CH", "MACROGARD", "TECMAX PRO"],
  },
};

const UNIQUE_INDUSTRIES = industryList.filter((ind) => CARD_META[ind.slug]);

/** One slot per industry — no repeats, always cycles the four options */
const WHEEL_ITEMS: WheelEntry[] = UNIQUE_INDUSTRIES.map((industry) => ({
  id: industry.slug,
  industry,
}));

const WHEEL_TOTAL = WHEEL_ITEMS.length;

/** Auto-advance: how long each card stays in the spotlight */
const HOLD_MS = 6000;
/** Indices around the active card to render (-1 = prev, 0 = center, 1 = next) */
const VISIBLE_OFFSETS = [-1, 0, 1] as const;
/** Debounce window for wheel/trackpad events (ms) */
const WHEEL_DEBOUNCE_MS = 400;
/** Minimum delta to register a wheel event as intentional */
const WHEEL_DELTA_THRESHOLD = 20;
/** Swipe power required to commit to next/prev card */
const SWIPE_CONFIDENCE_THRESHOLD = 10_000;

/**
 * Base spring for positional movement (x / z / rotateY).
 * Matches FocusRail's BASE_SPRING config.
 */
const BASE_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/**
 * Bouncier spring for scale — gives a subtle "tap" rebound on the center
 * card whenever it becomes active. Matches FocusRail's TAP_SPRING config.
 */
const TAP_SPRING = {
  type: "spring" as const,
  stiffness: 450,
  damping: 18,
  mass: 1,
};

/** Wraps v into [min, max) — enables infinite looping without array cloning */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/** Composite "swipe power" used for flick detection on drag end */
function swipePower(offset: number, velocity: number) {
  return Math.abs(offset) * velocity;
}

function IndustryCard({
  ind,
  className,
  priority,
  isFront,
}: {
  ind: Industry;
  className?: string;
  priority?: boolean;
  isFront?: boolean;
}) {
  const meta = CARD_META[ind.slug]!;
  const title = meta.title ?? ind.name;
  const isDog = ind.slug === "mascotas";

  return (
    <Link
      href={`/industrias/${ind.slug}`}
      className={cn(
        "relative flex min-h-[440px] w-[min(58vw,275px)] overflow-hidden rounded-[40px] border border-white/15 shadow-2xl sm:min-h-[500px] sm:w-[285px] md:min-h-[540px] md:w-[295px]",
        className,
      )}
      aria-label={`${title}: ver industria y protocolos`}
      draggable={false}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[40px]" aria-hidden>
        <Image
          src={meta.image}
          alt=""
          fill
          className={cn("object-cover", !isDog && "object-[center_25%]")}
          sizes="(max-width: 768px) 58vw, 295px"
          priority={priority}
        />
      </div>

      {/* Plain div — no Framer motion wrapper needed on a static overlay */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-[rgba(10,25,47,0.9)] via-[rgba(10,25,47,0.4)] via-50% to-transparent"
        aria-hidden
      />

      <div
        className={cn(
          "relative mt-auto flex w-full flex-col justify-end p-6 md:p-8",
          isFront ? "z-[3]" : "z-10",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-4 rounded-[32px] border border-white/20 bg-white/10 p-6 backdrop-blur-[6px] md:p-8",
            isFront ? "opacity-100" : "opacity-90",
          )}
        >
          <p
            className={cn(
              "text-[10px] font-bold uppercase leading-[15px] text-white",
              isFront ? "opacity-100" : "opacity-80",
            )}
          >
            Sector estratégico
          </p>

          <h3
            className={cn(
              "text-[26px] font-light leading-8 text-white md:text-[30px] md:leading-9",
              isFront ? "opacity-100" : "opacity-85",
            )}
          >
            {title}
          </h3>

          <div className="flex flex-wrap gap-x-2 gap-y-2">
            {meta.products.map((label) => (
              <span
                key={label}
                className={cn(
                  "rounded bg-white/10 px-3 py-1 font-mono text-[10px] leading-[15px] tracking-wide",
                  isFront ? "text-white/90 opacity-100" : "text-white/80 opacity-80",
                )}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 md:pt-4">
            <span
              className={cn(
                "text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-500",
                isFront ? "opacity-100" : "opacity-80",
              )}
            >
              Ver protocolos
            </span>
            <ChevronRight
              className={cn("h-3 w-3 text-cyan-500", isFront ? "opacity-100" : "opacity-80")}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function IndustriesCarousel() {
  const reduceMotion = useReducedMotion();

  /**
   * FocusRail-pattern state: a single integer `active` that can go negative
   * or beyond count. `wrap()` converts it to a valid array index for rendering.
   * Framer's declarative `animate` prop handles all spring transitions —
   * no custom RAF loop, no MotionValues, no imperative DOM writes.
   */
  const [active, setActive] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTimeRef = useRef(0);

  const count = WHEEL_TOTAL;
  const activeIndex = wrap(0, count, active);
  const activeItem = WHEEL_ITEMS[activeIndex]!;
  const activeMeta = CARD_META[activeItem.industry.slug]!;

  const handlePrev = useCallback(() => setActive((p) => p - 1), []);
  const handleNext = useCallback(() => setActive((p) => p + 1), []);

  /** Auto-advance: pauses on hover, stops under prefers-reduced-motion */
  useEffect(() => {
    if (reduceMotion || isHovering) return;
    const id = setInterval(handleNext, HOLD_MS);
    return () => clearInterval(id);
  }, [reduceMotion, isHovering, handleNext]);

  /** Keyboard navigation */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    },
    [handlePrev, handleNext],
  );

  /**
   * Non-passive wheel listener so we can call preventDefault() for horizontal
   * scroll events, preventing the page from scrolling while navigating the rail.
   * Uses a 400 ms debounce (same as FocusRail) to ignore trackpad inertia.
   */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduceMotion) return;

    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTimeRef.current < WHEEL_DEBOUNCE_MS) return;

      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (Math.abs(delta) < WHEEL_DELTA_THRESHOLD) return;

      e.preventDefault();
      if (delta > 0) handleNext();
      else handlePrev();
      lastWheelTimeRef.current = now;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [reduceMotion, handleNext, handlePrev]);

  /**
   * Drag end — uses FocusRail's swipePower formula for flick detection.
   * The draggable motion.div has dragConstraints={left:0,right:0} so it
   * snaps back elastically; this handler commits the index change.
   */
  const onDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
      const power = swipePower(offset.x, velocity.x);
      if (power < -SWIPE_CONFIDENCE_THRESHOLD) handleNext();
      else if (power > SWIPE_CONFIDENCE_THRESHOLD) handlePrev();
    },
    [handleNext, handlePrev],
  );

  return (
    <motion.div
      ref={containerRef}
      className="relative mt-2 w-full max-w-[min(94vw,580px)] select-none outline-none sm:max-w-[min(82vw,600px)] md:max-w-[min(72vw,600px)] mx-auto lg:mx-0 lg:mr-auto lg:mt-0"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Ambient glow — blurred active card image behind the rail */}
      <div
        className="pointer-events-none absolute -inset-8 overflow-hidden rounded-[3rem]"
        aria-hidden
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`ambience-${activeIndex}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.28 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <Image
              src={activeMeta.image}
              alt=""
              fill
              className="object-cover blur-[48px] saturate-150"
              sizes="640px"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3D card rail */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Industrias — arrastra o desliza para explorar"
        className="relative flex h-[440px] w-full items-center justify-center overflow-visible [perspective:1200px] sm:h-[500px] md:h-[540px]"
      >
        {/*
         * Draggable container — dragConstraints keep it visually anchored;
         * dragElastic gives the elastic overstretch feel during a drag.
         * onDragEnd commits the index change via swipePower.
         */}
        <motion.div
          className="relative flex h-full w-full items-center justify-center"
          drag={reduceMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={onDragEnd}
          style={{
            cursor: reduceMotion ? "default" : "grab",
            transformStyle: "preserve-3d",
            touchAction: "pan-y",
          }}
          whileDrag={{ cursor: "grabbing" }}
        >
          {VISIBLE_OFFSETS.map((offset) => {
            const absIndex = active + offset;
            const index = wrap(0, count, absIndex);
            const item = WHEEL_ITEMS[index]!;
            const isCenter = offset === 0;
            const dist = Math.abs(offset);

            return (
              <motion.div
                key={absIndex}
                className={cn("absolute", isCenter ? "z-20" : "z-10")}
                initial={false}
                animate={{
                  x: offset * 200,
                  z: -dist * 80,
                  scale: isCenter ? 1 : 0.86,
                  rotateY: offset * -12,
                  opacity: isCenter ? 1 : 0.6,
                }}
                transition={{
                  x: BASE_SPRING,
                  z: BASE_SPRING,
                  scale: isCenter ? TAP_SPRING : BASE_SPRING,
                  rotateY: BASE_SPRING,
                  opacity: { duration: 0.28, ease: "easeOut" },
                }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => {
                  if (offset !== 0) setActive((p) => p + offset);
                }}
              >
                <IndustryCard
                  ind={item.industry}
                  priority={isCenter}
                  isFront={isCenter}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Info strip + navigation */}
      <div className="relative z-10 mt-5 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Industria anterior"
          className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-500/70"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center gap-2.5">
          {/* Active industry name — animates on change */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
              className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/75"
            >
              {activeMeta.title ?? activeItem.industry.name}
            </motion.p>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Industrias">
            {WHEEL_ITEMS.map((entry, i) => (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Ver ${CARD_META[entry.industry.slug]?.title ?? entry.industry.name}`}
                onClick={() => setActive(active + (i - activeIndex))}
                className={cn(
                  "rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60",
                  i === activeIndex
                    ? "h-2 w-2 bg-white"
                    : "h-1.5 w-1.5 bg-white/30 hover:bg-white/55",
                )}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Siguiente industria"
          className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-500/70"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

function IndustriesSectionBackground() {
  const reduceMotion = useReducedMotion();
  const isMobile = useMobileExperience();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoReadyRef = useRef(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const markVideoReady = useCallback(() => {
    videoReadyRef.current = true;
    setVideoReady(true);
  }, []);

  const failVideo = useCallback(() => {
    setVideoFailed(true);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (!shouldLoadVideo || reduceMotion || videoFailed) return;
    videoRef.current?.load();
  }, [shouldLoadVideo, reduceMotion, videoFailed]);

  useEffect(() => {
    if (!shouldLoadVideo || reduceMotion || videoFailed) return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const attemptPlay = () => {
      if (cancelled || videoFailed || videoReadyRef.current) return;

      video.muted = true;
      video.defaultMuted = true;

      void video
        .play()
        .then(() => {
          if (cancelled) return;
          if (video.paused) {
            failVideo();
            return;
          }
          markVideoReady();
        })
        .catch(() => {
          if (!cancelled) failVideo();
        });
    };

    const onPlaying = () => {
      if (!cancelled) markVideoReady();
    };

    const onError = () => {
      if (!cancelled) failVideo();
    };

    const onVisibilityChange = () => {
      if (!document.hidden && !videoReadyRef.current && !videoFailed) {
        attemptPlay();
      }
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("canplay", attemptPlay);
    video.addEventListener("loadeddata", attemptPlay);
    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibilityChange);

    attemptPlay();

    const timeoutMs = isMobile === true ? 3000 : 5000;
    const timeout = window.setTimeout(() => {
      if (cancelled || videoReadyRef.current) return;
      if (video.paused || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        failVideo();
      }
    }, timeoutMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", attemptPlay);
      video.removeEventListener("loadeddata", attemptPlay);
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [shouldLoadVideo, reduceMotion, videoFailed, isMobile, failVideo, markVideoReady]);

  const useVideo = shouldLoadVideo && !videoFailed && !reduceMotion;
  const showVideo = useVideo && videoReady;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-[2.5rem] rounded-b-[2.5rem] sm:rounded-t-[3rem] sm:rounded-b-[3rem]"
      aria-hidden
    >
      <Image
        src={INDUSTRIES_BG_IMAGE_SRC}
        alt=""
        fill
        className={cn(
          `${INDUSTRIES_BG_MEDIA_SCALE} object-cover object-center transition-opacity duration-700 ease-out`,
          showVideo ? "opacity-0" : "opacity-100",
        )}
        sizes="100vw"
        priority
      />

      {useVideo ? (
        <video
          ref={videoRef}
          className={cn(
            `absolute inset-0 size-full ${INDUSTRIES_BG_MEDIA_SCALE} object-cover object-center transition-opacity duration-700 ease-out motion-reduce:hidden`,
            showVideo ? "opacity-100" : "opacity-0",
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={INDUSTRIES_BG_IMAGE_SRC}
        >
          <source src={INDUSTRIES_BG_VIDEO_SRC} type="video/webm" />
        </video>
      ) : null}
    </div>
  );
}

export default function IndustriesSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end 0.22"],
  });

  /** Flush with stats video at rest; slides further up over stats on scroll */
  const y = useTransform(scrollYProgress, [0, 0.32, 1], [0, -96, -380]);

  return (
    <div
      ref={wrapperRef}
      className="relative z-20 -mt-px bg-[#030A1C] pb-[12rem] md:pb-[14rem] lg:pb-[16rem]"
    >
      <motion.div
        style={{ y: reduceMotion ? 0 : y }}
        className="relative -mb-[14rem] overflow-hidden md:-mb-[16rem] lg:-mb-[18rem]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
      <section
        id="industrias"
        className={cn(
          "relative isolate w-full scroll-mt-24 overflow-hidden rounded-t-[2.5rem] rounded-b-[2.5rem] border border-white/10 shadow-[0_-24px_48px_rgba(3,10,28,0.45)] sm:rounded-t-[3rem] sm:rounded-b-[3rem]",
          INDUSTRIES_SECTION_MIN_H,
        )}
        style={{ backgroundColor: HOME_BLUE_BG }}
      >
        <IndustriesSectionBackground />

        <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[1440px] flex-col justify-center px-6 pt-10 pb-28 md:px-12 md:pt-12 md:pb-36 lg:pt-14 lg:pb-44">
          <div className="mb-6 flex items-center gap-4 md:mb-8">
            <span
              className="h-px w-10 shrink-0"
              style={{ backgroundColor: HOME_BLUE_BG }}
              aria-hidden
            />
            <p
              className="text-[10px] font-bold uppercase leading-[15px] tracking-[0.35em]"
              style={{ color: HOME_BLUE_BG }}
            >
              Verticales de industria
            </p>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-8 xl:gap-12">
            <IndustriesCarousel />

            <header className="mt-2 flex w-full max-w-md shrink-0 flex-col text-left lg:ml-auto lg:max-w-lg lg:mt-0 lg:text-right xl:max-w-xl">
              <h2
                className="text-balance text-2xl font-light leading-tight tracking-tight sm:text-3xl md:text-4xl"
                style={{ color: HOME_BLUE_BG }}
              >
                Inteligencia Nutricional para Cada Industria
              </h2>
              <p
                className="mt-4 text-pretty text-sm leading-relaxed sm:mt-5 sm:text-base sm:leading-7"
                style={{ color: HOME_BLUE_BG, opacity: 0.78 }}
              >
                Desarrollamos soluciones funcionales adaptadas a las necesidades
                específicas de cada sistema productivo, optimizando rendimiento,
                estabilidad y eficiencia operacional.
              </p>
              <Link
                href="/productos"
                className="mt-6 inline-flex w-1/2 min-w-[9.5rem] items-center justify-center self-end rounded-full border px-5 py-2.5 text-center text-[11px] font-bold uppercase leading-[16.5px] tracking-[0.12em] shadow-sm transition-colors active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a192f]/40 sm:mt-7"
                style={{
                  borderColor: HOME_BLUE_BG,
                  backgroundColor: HOME_BLUE_BG,
                  color: "#F5F5F5",
                }}
              >
                Ver productos
              </Link>
            </header>
          </div>
        </div>
      </section>
      </motion.div>
    </div>
  );
}
