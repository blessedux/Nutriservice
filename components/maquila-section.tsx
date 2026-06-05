"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { HOME_BLUE_BG } from "@/components/home-blue-band";
import PartnerBrandLogos from "@/components/partner-brand-logos";
import { MAQUILA_LANDING_HIGHLIGHTS } from "@/lib/maquila-process-data";
import { PUBLIC_ASSETS } from "@/lib/public-assets";
import { cn } from "@/lib/utils";

type MaquilaStep = (typeof MAQUILA_LANDING_HIGHLIGHTS)[number];

const MAQUILA_SLIDES = MAQUILA_LANDING_HIGHLIGHTS;
const AUTO_ADVANCE_MS = 3000;

const IMAGE_CROSSFADE = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

const MAQUILA_STICKY_TOP = "lg:top-24";
/** Subtle parallax cap — keeps motion minimal while scroll progresses */
const IMAGE_TRAVEL_MAX_PX = 36;
const IMAGE_TRAVEL_FALLBACK_PX = 28;

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
const STEP_STAGGER_S = 0.14;
const REVEAL_DURATION_S = 0.48;

function MaquilaReveal({
  children,
  delay = 0,
  className,
  inView,
  reduceMotion,
  revealGeneration,
  itemId,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  inView: boolean;
  reduceMotion: boolean | null;
  revealGeneration: number;
  itemId: string;
}) {
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      key={`${itemId}-${revealGeneration}`}
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{
        duration: REVEAL_DURATION_S,
        delay: inView ? delay : 0,
        ease: REVEAL_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

function MaquilaPartnerLogos({ className }: { className?: string }) {
  return <PartnerBrandLogos className={className} layout="end" />;
}

function MaquilaPartnerFooter({
  inView,
  reduceMotion,
  revealGeneration,
  stepCount,
}: {
  inView: boolean;
  reduceMotion: boolean | null;
  revealGeneration: number;
  stepCount: number;
}) {
  const delay = stepCount * STEP_STAGGER_S + 0.22;

  return (
    <MaquilaReveal
      itemId="partner-footer"
      delay={delay}
      inView={inView}
      reduceMotion={reduceMotion}
      revealGeneration={revealGeneration}
    >
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <p className="max-w-[11.5rem] shrink-0 self-start text-left text-[14px] font-medium leading-snug tracking-wide text-white/60 sm:max-w-[12.5rem] lg:max-w-[13rem]">
          Proveedores  <br/> oficiales
        </p>
        <MaquilaPartnerLogos className="shrink-0 self-end sm:self-auto" />
      </div>
    </MaquilaReveal>
  );
}

function MaquilaStepBadge({
  number,
  selected,
}: {
  number: string;
  selected: boolean;
}) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-[2px] text-[10px] font-black leading-[15px] transition-colors duration-300",
        selected
          ? "bg-cyan-500 text-[#0a192f]"
          : "bg-white/12 text-white/85 tracking-[0.02em]",
      )}
      aria-hidden
    >
      {number}
    </span>
  );
}

function MaquilaImageGallery({
  steps,
  activeIndex,
  galleryRef,
}: {
  steps: MaquilaStep[];
  activeIndex: number;
  galleryRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div ref={galleryRef} className="relative w-full">
      {/* Subtle cyan glow behind the frame */}
      <div
        className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-cyan-500/[0.12] blur-2xl sm:-inset-4 sm:rounded-[2.5rem] sm:blur-3xl"
        aria-hidden
      />

      <div
        data-maquila-frame
        className="relative aspect-[544/600] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a192f] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] sm:rounded-[2.5rem] lg:max-h-[600px] lg:min-h-[min(600px,70dvh)]"
      >
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          return (
            <motion.div
              key={step.id}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : IMAGE_CROSSFADE
              }
              aria-hidden={!isActive}
            >
              <Image
                src={step.image}
                width={step.imageWidth}
                height={step.imageHeight}
                alt=""
                className="absolute inset-0 h-full w-[110%] max-w-none -translate-x-[2.5%] object-cover object-center opacity-60"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** Maquila — premixes y núcleos personalizados (Figma 725:1172, navy band). */
export default function MaquilaSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepsHovered, setStepsHovered] = useState(false);
  const [revealGeneration, setRevealGeneration] = useState(0);
  const [imageStartOffset, setImageStartOffset] = useState(0);
  const [imageTravelPx, setImageTravelPx] = useState(IMAGE_TRAVEL_FALLBACK_PX);
  const [imageBottomPx, setImageBottomPx] = useState<number | undefined>(
    undefined,
  );
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stepOneRef = useRef<HTMLLIElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const ctaBlockRef = useRef<HTMLDivElement>(null);
  const partnerFooterRef = useRef<HTMLDivElement>(null);
  const wasInViewRef = useRef(false);
  const autoAdvanceRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(sectionRef, {
    once: false,
    amount: 0.22,
    margin: "0px 0px -12% 0px",
  });

  useEffect(() => {
    if (inView && !wasInViewRef.current) {
      setRevealGeneration((g) => g + 1);
    }
    wasInViewRef.current = inView;
  }, [inView]);

  const advanceSlide = useCallback(() => {
    setActiveIndex((index) => (index + 1) % MAQUILA_SLIDES.length);
  }, []);

  const restartAutoAdvance = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearInterval(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    if (reduceMotion || !inView || stepsHovered) return;

    autoAdvanceRef.current = setInterval(advanceSlide, AUTO_ADVANCE_MS);
  }, [advanceSlide, inView, reduceMotion, stepsHovered]);

  useEffect(() => {
    restartAutoAdvance();
    return () => {
      if (autoAdvanceRef.current) {
        clearInterval(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
    };
  }, [restartAutoAdvance]);

  useLayoutEffect(() => {
    const measure = () => {
      if (
        !leftColRef.current ||
        !titleRef.current ||
        !stepOneRef.current ||
        !galleryRef.current ||
        typeof window === "undefined"
      ) {
        return;
      }

      const isLg = window.matchMedia("(min-width: 1024px)").matches;
      const colTop = leftColRef.current.getBoundingClientRect().top;
      const titleTop = titleRef.current.getBoundingClientRect().top;
      const stepTop = stepOneRef.current.getBoundingClientRect().top;

      setImageStartOffset(
        isLg ? Math.max(0, titleTop - colTop) : 0,
      );
      const measuredTravel = stepTop - titleTop;
      const travelPx = isLg
        ? Math.min(
            IMAGE_TRAVEL_MAX_PX,
            Math.max(12, measuredTravel * 0.12),
          )
        : 0;
      setImageTravelPx(travelPx);

      if (isLg) {
        const frame = galleryRef.current.querySelector<HTMLElement>(
          "[data-maquila-frame]",
        );
        if (frame) {
          const imageBottom =
            frame.getBoundingClientRect().bottom - colTop + travelPx;
          setImageBottomPx(Math.round(imageBottom));
        }
      } else {
        setImageBottomPx(undefined);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    const observed = [
      leftColRef.current,
      galleryRef.current,
      sectionRef.current,
    ].filter(Boolean) as Element[];
    for (const el of observed) ro.observe(el);

    const galleryImages = galleryRef.current?.querySelectorAll("img");
    galleryImages?.forEach((img) => {
      if (!img.complete) img.addEventListener("load", measure);
    });

    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      galleryImages?.forEach((img) => {
        img.removeEventListener("load", measure);
      });
    };
  }, [revealGeneration]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /** Start: aligned with left H2 · End: subtle downward drift (capped) */
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, imageTravelPx],
  );

  return (
    <section
      ref={sectionRef}
      id="maquila"
      aria-label="Maquila"
      className="relative z-10 -mt-px scroll-mt-24 overflow-visible text-white"
      style={{ backgroundColor: HOME_BLUE_BG }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12 sm:px-10 sm:pb-24 sm:pt-14 md:pb-28 md:pt-16 lg:px-12 lg:pb-32 lg:pt-20 xl:px-20">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-10 xl:gap-14">
          <div
            ref={leftColRef}
            className="flex flex-col gap-10 sm:gap-12"
            style={
              imageBottomPx != null ? { minHeight: imageBottomPx } : undefined
            }
          >
            <div className="flex items-center gap-4">
              <span
                className="h-px w-10 shrink-0 bg-cyan-500/70"
                aria-hidden
              />
              <p className="text-[10px] font-bold uppercase leading-[15px] tracking-[4px] text-white/45">
                Sistemas Nutricionales Personalizados
              </p>
            </div>

            <div ref={titleRef} className="flex flex-col gap-6">
              <h2 className="text-balance text-3xl font-light leading-tight tracking-tight text-white sm:text-4xl sm:leading-[1.2] lg:text-[48px] lg:leading-[60px]">
                Premixes y Núcleos Diseñados para su Operación
              </h2>
              <p className="hidden max-w-xl text-pretty text-base leading-relaxed text-white/65 sm:text-lg sm:leading-[29.25px] lg:block">
                Fabricamos tus productos a medida, garantizando la confidencialidad
                de tus fórmulas y con los más altos estándares de calidad.
              </p>
            </div>

            <div className="lg:hidden">
              <MaquilaImageGallery
                galleryRef={galleryRef}
                steps={MAQUILA_SLIDES}
                activeIndex={activeIndex}
              />
            </div>

            <p className="max-w-xl text-pretty text-base leading-relaxed text-white/65 sm:text-lg sm:leading-[29.25px] lg:hidden">
              Fabricamos tus productos a medida, garantizando la confidencialidad
              de tus fórmulas y con los más altos estándares de calidad.
            </p>

            <ul
              className="flex flex-col gap-2"
              role="list"
              aria-label="Pilares de maquila"
              onMouseEnter={() => setStepsHovered(true)}
              onMouseLeave={() => setStepsHovered(false)}
            >
              {MAQUILA_SLIDES.map((step, index) => {
                const selected = index === activeIndex;
                return (
                  <li
                    key={step.id}
                    ref={index === 0 ? stepOneRef : undefined}
                  >
                    <MaquilaReveal
                      itemId={step.id}
                      delay={index * STEP_STAGGER_S}
                      inView={inView}
                      reduceMotion={reduceMotion}
                      revealGeneration={revealGeneration}
                    >
                    <button
                      type="button"
                      onClick={() => {
                        setActiveIndex(index);
                        restartAutoAdvance();
                      }}
                      aria-current={selected ? "step" : undefined}
                      className={cn(
                        "flex w-full gap-6 rounded-lg px-2 py-4 text-left transition-colors duration-300",
                        "hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500/70",
                        selected && "bg-white/[0.06]",
                      )}
                    >
                      <div className="pt-1">
                        <MaquilaStepBadge
                          number={step.number}
                          selected={selected}
                        />
                      </div>
                      <div className="flex min-w-0 flex-col gap-1">
                        <h3
                          className={cn(
                            "text-base font-bold leading-6 transition-colors duration-300",
                            selected ? "text-white" : "text-white/90",
                          )}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={cn(
                            "text-sm leading-relaxed transition-colors duration-300",
                            selected
                              ? "text-white/65"
                              : "line-clamp-2 text-white/50",
                          )}
                          aria-live={selected ? "polite" : "off"}
                        >
                          {step.description}
                        </p>
                      </div>
                    </button>
                    </MaquilaReveal>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-6 lg:min-h-0 lg:flex-1">
              <div ref={ctaBlockRef} className="pt-2 sm:mt-6">
                <MaquilaReveal
                  itemId="cta"
                  delay={MAQUILA_SLIDES.length * STEP_STAGGER_S + 0.08}
                  inView={inView}
                  reduceMotion={reduceMotion}
                  revealGeneration={revealGeneration}
                >
                  <Link
                    href="/soluciones/maquila"
                    className="inline-flex w-fit items-center justify-center self-start rounded-full border border-white/55 bg-white/10 px-12 py-5 text-center text-xs font-bold uppercase leading-[18px] tracking-[0.2em] text-white shadow-sm backdrop-blur-sm transition-colors duration-300 hover:border-cyan-400/45 hover:bg-cyan-500/20 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500/70"
                  >
                    Ver más
                  </Link>
                </MaquilaReveal>
              </div>

              <div
                className="hidden min-h-0 flex-1 lg:block"
                aria-hidden
              />

              <div ref={partnerFooterRef}>
                <MaquilaPartnerFooter
                  inView={inView}
                  reduceMotion={reduceMotion}
                  revealGeneration={revealGeneration}
                  stepCount={MAQUILA_SLIDES.length}
                />
              </div>
            </div>
          </div>

          <div className="relative hidden flex-col lg:flex lg:min-h-full lg:self-stretch">
            <div
              className={cn(
                "w-full shrink-0",
                MAQUILA_STICKY_TOP,
                "lg:sticky lg:z-10",
              )}
              style={
                imageStartOffset > 0
                  ? { paddingTop: imageStartOffset }
                  : undefined
              }
            >
              <motion.div style={{ y: imageY }} className="w-full">
                <MaquilaImageGallery
                  galleryRef={galleryRef}
                  steps={MAQUILA_SLIDES}
                  activeIndex={activeIndex}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
