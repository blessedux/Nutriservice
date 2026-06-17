"use client";

import type { ReactNode } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { HOME_INDUSTRIES_BG } from "@/components/home-blue-band";
import PageBackHeader from "@/components/page-back-header";
import { Button } from "@/components/ui/button";
import { MAQUILA_WHY_CHOOSE } from "@/lib/maquila-page-data";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

const HERO_IMAGE = PUBLIC_ASSETS.maquilaSection.tabFormulacionHero;
const FEATURE_IMAGE = PUBLIC_ASSETS.maquilaSection.tabProductsBg;

const HERO_CARD_HEIGHT_BOOST = 1.48;
const HERO_CARD_MIN_H =
  "min-h-[192dvh] sm:min-h-[202dvh] lg:min-h-[212dvh]";

/** Full-strength reference blur; scroll caps at 30% of this (~7.2px). */
const HERO_BLUR_REFERENCE_PX = 24;
const HERO_BLUR_MAX_RATIO = 0.3;
const HERO_BLUR_MAX_PX = HERO_BLUR_REFERENCE_PX * HERO_BLUR_MAX_RATIO;

/** Slower parallax curve — still reaches full pan at scroll end. */
const PARALLAX_EASE_EXPONENT = 1.45;

/** Intro column keeps drifting downward through the hero scroll. */
const INTRO_SCROLL_DRIFT_PX = 112;

/** Hero image begins lifted toward the title, then settles on scroll. */
const HERO_IMAGE_START_LIFT_MIN_PX = 28;
const HERO_IMAGE_START_LIFT_MAX_PX = 72;
const HERO_IMAGE_START_LIFT_RATIO = 0.18;

const HIGHLIGHT_CARDS = [
  {
    id: MAQUILA_WHY_CHOOSE[1].id,
    title: MAQUILA_WHY_CHOOSE[1].title,
    description: MAQUILA_WHY_CHOOSE[1].description,
    image: PUBLIC_ASSETS.maquilaSection.tabFormulacionHero,
    variant: "dark" as const,
  },
  {
    id: MAQUILA_WHY_CHOOSE[2].id,
    title: MAQUILA_WHY_CHOOSE[2].title,
    description: MAQUILA_WHY_CHOOSE[2].description,
    image: PUBLIC_ASSETS.shared.nutribagWorkers,
    variant: "overlay" as const,
  },
];

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

function usePersistentScrollReveal(
  progress: MotionValue<number>,
  reducedMotion: boolean | null,
  enterStart: number,
  enterEnd: number,
  yIn = 24,
) {
  const opacity = useTransform(progress, (p) => {
    if (reducedMotion) return 1;
    if (p >= enterEnd) return 1;
    if (p <= enterStart) return 0;
    return (p - enterStart) / (enterEnd - enterStart);
  });
  const y = useTransform(opacity, (o) => (1 - o) * yIn);

  return { opacity, y };
}

function computeCoverPanTravel(
  containerWidth: number,
  containerHeight: number,
  naturalWidth: number,
  naturalHeight: number,
  scaleReferenceHeight = containerHeight,
) {
  if (!naturalWidth || !naturalHeight) {
    return { travelPx: 0, layerHeightPx: containerHeight };
  }

  const referenceScale = Math.max(
    containerWidth / naturalWidth,
    scaleReferenceHeight / naturalHeight,
  );
  const coverScale = Math.max(
    containerWidth / naturalWidth,
    containerHeight / naturalHeight,
  );
  /** Preserve the original top crop, but never leave uncovered gaps at the bottom. */
  const scale = Math.max(referenceScale, coverScale);
  const renderedHeight = naturalHeight * scale;
  const travelPx = Math.max(0, renderedHeight - containerHeight);

  return { travelPx, layerHeightPx: renderedHeight };
}

function MaquilaHeroEmphasis({ children }: { children: ReactNode }) {
  return <strong className="font-bold text-white">{children}</strong>;
}

function ScrollFadeInBlock({
  reducedMotion,
  className,
  children,
}: {
  reducedMotion: boolean | null;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px 8% 0px" }}
      transition={{
        duration: reducedMotion ? 0 : 0.7,
        ease: REVEAL_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function MaquilaPageLayout() {
  const heroRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [imagePanTravel, setImagePanTravel] = useState(0);
  const [imageLayerHeight, setImageLayerHeight] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  const measureHeroImage = useCallback(() => {
    const card = heroRef.current;
    if (!card) return;

    const img = card.querySelector<HTMLImageElement>("img[data-hero-parallax]");
    if (!img?.naturalWidth) return;

    const { width, height } = card.getBoundingClientRect();
    const scaleReferenceHeight = height / HERO_CARD_HEIGHT_BOOST;
    const { travelPx, layerHeightPx } = computeCoverPanTravel(
      width,
      height,
      img.naturalWidth,
      img.naturalHeight,
      scaleReferenceHeight,
    );

    setImagePanTravel(travelPx);
    setImageLayerHeight(Math.max(layerHeightPx, height));
  }, []);

  useLayoutEffect(() => {
    measureHeroImage();

    const card = heroRef.current;
    if (!card) return;

    const img = card.querySelector<HTMLImageElement>("img[data-hero-parallax]");
    if (img && !img.complete) {
      img.addEventListener("load", measureHeroImage);
    }

    const ro = new ResizeObserver(measureHeroImage);
    ro.observe(card);
    window.addEventListener("resize", measureHeroImage);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureHeroImage);
      img?.removeEventListener("load", measureHeroImage);
    };
  }, [measureHeroImage]);

  const imageY = useTransform(scrollYProgress, (progress) => {
    if (reducedMotion) return 0;
    const easedProgress = progress ** PARALLAX_EASE_EXPONENT;
    const startLift = Math.min(
      HERO_IMAGE_START_LIFT_MAX_PX,
      Math.max(
        HERO_IMAGE_START_LIFT_MIN_PX,
        imagePanTravel * HERO_IMAGE_START_LIFT_RATIO + HERO_IMAGE_START_LIFT_MIN_PX,
      ),
    );
    const panY = -easedProgress * imagePanTravel;
    const introLift = -startLift * (1 - easedProgress);
    return panY + introLift;
  });

  const imageBlur = useTransform(scrollYProgress, (progress) => {
    if (reducedMotion) return 0;
    const eased = progress ** 2.6;
    return eased * HERO_BLUR_MAX_PX;
  });
  const imageBlurFilter = useTransform(
    imageBlur,
    (value) => `blur(${value.toFixed(2)}px)`,
  );

  const introReveal = usePersistentScrollReveal(
    scrollYProgress,
    reducedMotion,
    0.06,
    0.18,
    28,
  );
  const introY = useTransform(scrollYProgress, (p) => {
    if (reducedMotion) return 0;
    const revealOffset =
      p >= 0.18 ? 0 : p <= 0.06 ? 28 : (1 - (p - 0.06) / 0.12) * 28;
    return revealOffset + p * INTRO_SCROLL_DRIFT_PX;
  });
  const bottomTitleReveal = usePersistentScrollReveal(
    scrollYProgress,
    reducedMotion,
    0.26,
    0.38,
    32,
  );
  const bottomCopyReveal = usePersistentScrollReveal(
    scrollYProgress,
    reducedMotion,
    0.32,
    0.44,
    32,
  );
  const closingCopyReveal = usePersistentScrollReveal(
    scrollYProgress,
    reducedMotion,
    0.72,
    0.86,
    28,
  );
  const featureCardReveal = usePersistentScrollReveal(
    scrollYProgress,
    reducedMotion,
    0.62,
    0.76,
    36,
  );

  return (
    <div
      className="site-hero-pull site-content-below-nav min-h-screen px-4 pb-10 text-white sm:px-6 sm:pb-12 lg:px-8 lg:pb-14"
      style={{ backgroundColor: HOME_INDUSTRIES_BG }}
    >
      <div
        ref={heroRef}
        className={`relative mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] border border-ns-border bg-ns-dark sm:rounded-[2.5rem] ${HERO_CARD_MIN_H}`}
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <motion.div
            className="absolute left-0 top-0 w-full min-h-full will-change-[transform,filter]"
            style={{
              height: imageLayerHeight ?? "100%",
              y: imageY,
              filter: reducedMotion ? undefined : imageBlurFilter,
            }}
          >
            <Image
              data-hero-parallax
              src={HERO_IMAGE}
              alt=""
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-top"
            />
          </motion.div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ns-dark/35 via-transparent to-ns-dark/55"
          aria-hidden
        />

        <div
          className={`relative z-10 flex flex-col p-6 sm:p-10 lg:p-12 ${HERO_CARD_MIN_H}`}
        >
          <PageBackHeader
            backHref="/industrias"
            tone="on-dark"
            simple
            className="absolute left-6 top-10 z-20 mb-0 sm:left-10 sm:top-12 lg:left-12"
          />

          <div className="mt-16 max-w-6xl sm:mt-20 md:mt-24 lg:mt-28">
            <div className="flex flex-col items-start gap-8 text-left md:gap-10">
              <div className="max-w-[50%] [text-shadow:0_2px_28px_rgba(10,25,47,0.9)] max-md:max-w-full">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ns-emerald">
                  Maquila
                </p>
                <h1 className="text-3xl font-bold leading-snug sm:text-4xl lg:text-[2.65rem]">
                  Producción a terceros{" "}
                  <span className="text-ns-emerald">
                  con  respaldo técnico, confidencialidad y calidad.
                  </span>{" "}
                  
                </h1>
              </div>

              <motion.div
                style={{
                  opacity: introReveal.opacity,
                  y: introY,
                }}
                className="flex w-1/2 max-w-none flex-col items-start space-y-6 text-left text-white/75 [text-shadow:0_2px_28px_rgba(10,25,47,0.9)] max-md:w-full"
              >
                <p className="text-base leading-relaxed sm:text-lg">
                  En NutriService ofrecemos servicios de{" "}
                  <MaquilaHeroEmphasis>producción a terceros</MaquilaHeroEmphasis>{" "}
                  para la elaboración de premezclas, suplementos y soluciones
                  nutricionales para la industria animal, garantizando{" "}
                  <MaquilaHeroEmphasis>confidencialidad</MaquilaHeroEmphasis>,{" "}
                  <MaquilaHeroEmphasis>calidad</MaquilaHeroEmphasis> y{" "}
                  <MaquilaHeroEmphasis>trazabilidad</MaquilaHeroEmphasis> en cada
                  etapa del proceso.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="gap-1 self-start border border-white/35 bg-white/28 pr-1.5 text-white shadow-sm hover:border-white/45 hover:bg-white/38"
                >
                  <Link href="/contacto">
                    <span>Agendar evaluación técnica</span>
                    <ChevronRight className="size-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="min-h-16 flex-1 sm:min-h-20 lg:min-h-28" aria-hidden />

          <div className="mx-auto w-full max-w-6xl [text-shadow:0_2px_28px_rgba(10,25,47,0.9)]">
            <div className="grid gap-6 text-center md:grid-cols-2 md:gap-12 md:text-left">
              <motion.h2
                style={{
                  opacity: bottomTitleReveal.opacity,
                  y: bottomTitleReveal.y,
                }}
                className="text-3xl font-bold sm:text-4xl lg:text-5xl"
              >
                División de Maquila
              </motion.h2>
              <motion.p
                style={{
                  opacity: bottomCopyReveal.opacity,
                  y: bottomCopyReveal.y,
                }}
                className="text-base leading-relaxed text-white/90 sm:text-lg md:mt-[4.8rem] lg:mt-[7.2rem]"
              >
                Entendemos que la maquila es mucho más que fabricar un producto.
                Es una{" "}
                <MaquilaHeroEmphasis>herramienta estratégica</MaquilaHeroEmphasis>{" "}
                que permite a nuestros clientes desarrollar sus marcas y responder
                a las exigencias de un mercado cada vez más orientado a la{" "}
                <MaquilaHeroEmphasis>eficiencia</MaquilaHeroEmphasis>, la{" "}
                <MaquilaHeroEmphasis>calidad</MaquilaHeroEmphasis> y la{" "}
                <MaquilaHeroEmphasis>seguridad</MaquilaHeroEmphasis>.
              </motion.p>
            </div>
          </div>

          <div className="mt-auto w-full max-w-6xl space-y-6 pb-8 sm:pb-10 lg:pb-12">
            <motion.div
              style={{
                opacity: featureCardReveal.opacity,
                y: featureCardReveal.y,
              }}
              className="relative min-h-[240px] overflow-hidden rounded-2xl border border-white/15 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.65)] sm:min-h-[280px] md:min-h-[360px] md:max-w-[min(100%,520px)]"
            >
              <Image
                src={FEATURE_IMAGE}
                alt="Premezclas y soluciones nutricionales Nutriservice"
                fill
                sizes="(max-width: 768px) 100vw, 520px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ns-dark/35 via-transparent to-transparent" />
            </motion.div>

            <motion.p
              style={{
                opacity: closingCopyReveal.opacity,
                y: closingCopyReveal.y,
              }}
              className="max-w-[520px] text-left text-base leading-relaxed text-white/90 [text-shadow:0_2px_28px_rgba(10,25,47,0.9)] sm:text-lg"
            >
              <MaquilaHeroEmphasis>Nuestra División de Maquila</MaquilaHeroEmphasis>{" "}
              entrega un servicio integral respaldado por{" "}
              <MaquilaHeroEmphasis>experiencia técnica</MaquilaHeroEmphasis>,{" "}
              tecnología especializada y{" "}
              <MaquilaHeroEmphasis>procesos certificados</MaquilaHeroEmphasis>,
              asegurando soluciones confiables y adaptadas a las necesidades de
              cada proyecto.
            </motion.p>
          </div>
        </div>
      </div>

      <ScrollFadeInBlock
        reducedMotion={reducedMotion}
        className="mx-auto mt-8 w-full max-w-6xl text-ns-text sm:mt-10 lg:mt-12"
      >
        <div className="grid gap-6 md:grid-cols-2">
            {HIGHLIGHT_CARDS.map((card) =>
              card.variant === "dark" ? (
                <motion.article
                  key={card.id}
                  whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="relative overflow-hidden rounded-2xl border border-ns-border bg-ns-dark text-white shadow-lg"
                >
                  <div className="relative h-48 w-full overflow-hidden sm:h-52 md:h-44">
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ns-dark via-ns-dark/70 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      {card.description}
                    </p>
                  </div>
                </motion.article>
              ) : (
                <motion.article
                  key={card.id}
                  whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="relative min-h-[220px] overflow-hidden rounded-2xl border border-ns-border shadow-lg md:min-h-[200px]"
                >
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ns-dark/95 via-ns-dark/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3 className="text-xl font-bold">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {card.description}
                    </p>
                  </div>
                </motion.article>
              ),
            )}
        </div>
      </ScrollFadeInBlock>
    </div>
  );
}
