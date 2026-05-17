"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { HOME_BLUE_BG } from "@/components/home-blue-band";
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
  "min-h-[54dvh] sm:min-h-[58dvh] md:min-h-[60dvh] lg:min-h-[62dvh]";
const INDUSTRIES_BG_MEDIA_SCALE = "scale-[1.22]";

const CARD_META: Record<string, CardMeta> = {
  acuicola: {
    image: "/industries/acuicola.png",
    products: ["ACTIVEMOS", "MACROGARD", "SILIMARINA 80%", "NUCLEOFORCE"],
  },
  avicola: {
    image: "/industries/avicola.png",
    title: "Aves",
    products: ["HALOR TID", "MICROACID PLUS", "M-PROVE", "S-PROVE"],
  },
  porcina: {
    image: "/industries/porcina.jpg",
    products: ["MACROGARD", "HALOR TID", "M-PROVE", "NUCLEOFORCE"],
  },
  mascotas: {
    image: "/industries/mascotas.png",
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

/** Hold in spotlight with slow wheel drift, then fast handoff to next card */
const HOLD_MS = 6000;
const SWAP_MS = 420;
const CYCLE_MS = HOLD_MS + SWAP_MS;
/** How far the wheel drifts during hold — keep low for a very slow spin */
const HOLD_DRIFT = 0.06;
/** Card is considered “on front” while |offset| is below this — full opacity, sharp, on top */
const FRONT_ZONE = 0.5;
const HOLD_FRACTION = HOLD_MS / CYCLE_MS;
/** Room for left peek card — keep low to avoid clipping the front card */
const WHEEL_LEFT_INSET_PX = 24;
/** Hide cards more than one step away from front */
const WHEEL_SIDE_VISIBLE = 1.02;
const WHEEL_SIDE_OPACITY = 0.48;
const WHEEL_SIDE_BLUR_PX = 5;
const WHEEL_SIDE_SCALE = 0.88;
const WHEEL_TRACK_MAX_W_PX = 468;
const WHEEL_TRACK_MAX_W_SM_PX = 488;
const WHEEL_NAV_ZONE_W_PX = 52;
const WHEEL_DRAG_SENSITIVITY = 0.012;
const WHEEL_DRAG_THRESHOLD_PX = 10;
/** Default auto-spin only — drag is always bidirectional */
const WHEEL_AUTO_SPIN_DIRECTION = -1;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(t: number) {
  return Math.max(0, Math.min(1, t));
}

/** Ease-in for the quick swap segment */
function easeInQuad(t: number) {
  return t * t;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/** Map linear timeline progress → wheel position with slow hold + fast swap */
function getDisplayProgress(linearProgress: number) {
  const base = Math.floor(linearProgress);
  const phase = linearProgress - base;

  let slotOffset: number;
  if (phase < HOLD_FRACTION) {
    const t = phase / HOLD_FRACTION;
    slotOffset = t * HOLD_DRIFT;
  } else {
    const t = (phase - HOLD_FRACTION) / (1 - HOLD_FRACTION);
    slotOffset = HOLD_DRIFT + easeInQuad(t) * (1 - HOLD_DRIFT);
  }

  return base + slotOffset;
}

function normalizeWheelOffset(raw: number) {
  let offset = ((raw % WHEEL_TOTAL) + WHEEL_TOTAL) % WHEEL_TOTAL;
  if (offset > WHEEL_TOTAL / 2) offset -= WHEEL_TOTAL;
  return offset;
}

function isCardOnFront(o: number) {
  return Math.abs(o) < FRONT_ZONE;
}

function getWheelOffset(cardIndex: number, progress: number) {
  /** Negative o = next card (right); positive o = previous (left) */
  return normalizeWheelOffset(progress - cardIndex);
}

function getCardWheelStyle(
  cardIndex: number,
  progress: number,
): { style: React.CSSProperties; isFront: boolean } {
  const o = getWheelOffset(cardIndex, progress);
  const absO = Math.abs(o);
  const onFront = isCardOnFront(o);

  if (absO >= WHEEL_SIDE_VISIBLE) {
    return {
      style: {
        transform: "translateX(0) scale(0.75)",
        zIndex: 1,
        opacity: 0,
        filter: "blur(8px)",
        visibility: "hidden",
      },
      isFront: false,
    };
  }

  if (onFront) {
    const x = lerp(0, o > 0 ? -20 : 0, absO / FRONT_ZONE);
    return {
      style: {
        transform: `translateX(${x}px) scale(1)`,
        zIndex: 20,
        opacity: 1,
        filter: "blur(0px)",
        visibility: "visible",
      },
      isFront: true,
    };
  }

  const x =
    o < 0
      ? lerp(96, 0, clamp01(o + 1))
      : lerp(-16, -56, clamp01((o - FRONT_ZONE) / (1 - FRONT_ZONE)));

  return {
    style: {
      transform: `translateX(${x}px) scale(${WHEEL_SIDE_SCALE})`,
      zIndex: 5,
      opacity: WHEEL_SIDE_OPACITY,
      filter: `blur(${WHEEL_SIDE_BLUR_PX}px)`,
      visibility: "visible",
    },
    isFront: false,
  };
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M1 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IndustryCard({
  ind,
  className,
  style,
  priority,
  isFront,
  onDragIntent,
}: {
  ind: Industry;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  isFront?: boolean;
  onDragIntent?: () => void;
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
      style={style}
      aria-label={`${title}: ver industria y protocolos`}
      draggable={false}
      onClick={(e) => {
        if (onDragIntent?.()) e.preventDefault();
      }}
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

      <motion.div
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
              "text-[10px] font-bold uppercase leading-[15px] text-cyan-500",
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
            <ChevronRightIcon
              className={cn("text-cyan-500", isFront ? "opacity-100" : "opacity-80")}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function IndustriesCarousel() {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const progressRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const isSnappingRef = useRef(false);
  const snapRafRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragStartProgressRef = useRef(0);
  const didDragRef = useRef(false);
  const lastFrameTimeRef = useRef<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const syncProgress = useCallback((value: number) => {
    progressRef.current = value;
    setProgress(value);
  }, []);

  const checkDragIntent = useCallback(() => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return true;
    }
    return false;
  }, []);

  const animateSnapTo = useCallback(
    (target: number) => {
      cancelAnimationFrame(snapRafRef.current);
      if (reduceMotion) {
        syncProgress(target);
        return;
      }

      isSnappingRef.current = true;
      setIsSnapping(true);
      const start = progressRef.current;
      const startTime = performance.now();

      const frame = (time: number) => {
        const t = Math.min(1, (time - startTime) / SWAP_MS);
        syncProgress(start + (target - start) * easeOutCubic(t));
        if (t < 1) {
          snapRafRef.current = requestAnimationFrame(frame);
          return;
        }
        syncProgress(target);
        isSnappingRef.current = false;
        setIsSnapping(false);
      };

      snapRafRef.current = requestAnimationFrame(frame);
    },
    [reduceMotion, syncProgress],
  );

  useEffect(() => {
    return () => cancelAnimationFrame(snapRafRef.current);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    let raf = 0;
    const tick = (time: number) => {
      if (
        lastFrameTimeRef.current !== null &&
        !isDragging &&
        !isSnapping &&
        !isSnappingRef.current
      ) {
        const dt = time - lastFrameTimeRef.current;
        syncProgress(
          progressRef.current + (dt / CYCLE_MS) * WHEEL_AUTO_SPIN_DIRECTION,
        );
      }
      lastFrameTimeRef.current = time;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, syncProgress, isDragging, isSnapping]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      isPointerDownRef.current = true;
      isDraggingRef.current = false;
      setIsDragging(false);
      didDragRef.current = false;
      dragStartXRef.current = e.clientX;
      dragStartProgressRef.current = progressRef.current;
    },
    [reduceMotion],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isPointerDownRef.current) return;

      const dx = e.clientX - dragStartXRef.current;

      if (!isDraggingRef.current) {
        if (Math.abs(dx) <= WHEEL_DRAG_THRESHOLD_PX) return;
        isDraggingRef.current = true;
        setIsDragging(true);
        didDragRef.current = true;
        wheelRef.current?.setPointerCapture(e.pointerId);
      }

      // Drag L→R (dx>0) → cards flow R→L; drag R→L → opposite
      syncProgress(dragStartProgressRef.current + dx * WHEEL_DRAG_SENSITIVITY);
    },
    [syncProgress],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;

      if (wheelRef.current?.hasPointerCapture(e.pointerId)) {
        wheelRef.current.releasePointerCapture(e.pointerId);
      }

      if (isDraggingRef.current) {
        const dx = e.clientX - dragStartXRef.current;
        const current = progressRef.current;
        const target =
          Math.abs(dx) > 40
            ? dx < 0
              ? Math.ceil(current)
              : Math.floor(current)
            : Math.round(current);

        animateSnapTo(target);
      }

      isDraggingRef.current = false;
      setIsDragging(false);
    },
    [animateSnapTo],
  );

  const stepCardToRight = useCallback(() => {
    if (isDraggingRef.current || isSnappingRef.current) return;
    animateSnapTo(Math.round(progressRef.current) - 1);
  }, [animateSnapTo]);

  return (
    <motion.div
      className="relative mr-auto ml-8 mt-2 w-full max-w-[min(68vw,540px)] sm:ml-12 sm:max-w-[min(64vw,560px)] md:ml-16 lg:mt-0"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Industrias — arrastra para explorar"
        className="relative flex h-[440px] w-full items-stretch justify-start gap-0 overflow-visible sm:h-[500px] md:h-[540px]"
      >
        <div
          ref={wheelRef}
          className={cn(
            "relative h-full min-w-0 flex-1 select-none overflow-visible [perspective:1200px]",
            `max-w-[min(100%,${WHEEL_TRACK_MAX_W_PX}px)] sm:max-w-[min(100%,${WHEEL_TRACK_MAX_W_SM_PX}px)]`,
            reduceMotion
              ? "cursor-default"
              : isDragging
                ? "cursor-grabbing touch-none"
                : "cursor-grab touch-pan-y",
          )}
          style={{ paddingLeft: WHEEL_LEFT_INSET_PX }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
        >
          {WHEEL_ITEMS.map((entry, index) => {
            const displayProgress = reduceMotion
              ? Math.round(progress)
              : isDragging
                ? progress
                : getDisplayProgress(progress);
            const { style, isFront } = getCardWheelStyle(index, displayProgress);

            return (
              <div
                key={entry.id}
                className="absolute inset-y-0 left-0 flex w-full items-start justify-start will-change-transform"
                style={style}
              >
                <IndustryCard
                  ind={entry.industry}
                  priority={entry.id === "acuicola"}
                  isFront={isFront}
                  onDragIntent={checkDragIntent}
                  className={cn(!isFront && "pointer-events-none")}
                />
              </div>
            );
          })}

          <button
            type="button"
            className="absolute inset-y-0 right-0 z-30 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500/80"
            style={{ width: WHEEL_NAV_ZONE_W_PX }}
            aria-label="Ver industria anterior"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={stepCardToRight}
          />
        </div>
      </div>
    </motion.div>
  );
}

function IndustriesSectionBackground() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

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

  const useVideo = shouldLoadVideo && !videoFailed && !reduceMotion;
  const showVideo = useVideo && videoReady;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-[2.5rem] sm:rounded-t-[3rem]"
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
          onCanPlay={() => {
            const video = videoRef.current;
            if (!video) return;
            void video.play().then(() => setVideoReady(true)).catch(() => setVideoFailed(true));
          }}
          onError={() => setVideoFailed(true)}
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
    offset: ["start end", "end center"],
  });

  /** Whole band slides up over stats — inner content does not parallax */
  const y = useTransform(scrollYProgress, [0, 0.35, 1], [48, -40, -220]);

  return (
    <motion.div
      ref={wrapperRef}
      style={{ y: reduceMotion ? 0 : y }}
      className="relative z-20 -mt-[24dvh] mb-[-13rem] overflow-hidden bg-[#030A1C] md:-mt-[28dvh] md:mb-[-15rem] lg:-mt-[30dvh]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <section
        id="industrias"
        className={cn(
          "relative isolate w-full scroll-mt-24 overflow-hidden rounded-t-[2.5rem] shadow-[0_-24px_48px_rgba(3,10,28,0.45)] sm:rounded-t-[3rem]",
          INDUSTRIES_SECTION_MIN_H,
        )}
        style={{ backgroundColor: HOME_BLUE_BG }}
      >
        <IndustriesSectionBackground />

        <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[1440px] flex-col justify-center px-6 py-8 md:px-12 md:py-10 lg:py-12">
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

            <header className="mt-2 w-full max-w-md shrink-0 text-left lg:ml-auto lg:max-w-lg lg:mt-0 lg:text-right xl:max-w-xl">
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
            </header>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
