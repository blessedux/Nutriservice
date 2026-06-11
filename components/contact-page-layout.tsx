"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";

import ContactForm from "@/components/contact-form";
import { HOME_INDUSTRIES_BG } from "@/components/home-blue-band";
import PageBackHeader from "@/components/page-back-header";
import { PUBLIC_ASSETS } from "@/lib/public-assets";
import { cn } from "@/lib/utils";

const GLASS_CARD =
  "rounded-[1.75rem] border border-white/20 bg-white/10 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md sm:rounded-[2rem]";

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
const REVEAL_DURATION_S = 0.68;

const STAGGER = {
  title: 0.1,
  infoCard: 0.38,
  formCard: 0.62,
} as const;

function ContactInfoBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-bold uppercase tracking-wide text-white/90">
        {title}
      </h3>
      <div className="space-y-1 text-sm leading-relaxed text-white/65">
        {children}
      </div>
    </div>
  );
}

function ContactReveal({
  show,
  delay,
  reducedMotion,
  className,
  children,
}: {
  show: boolean;
  delay: number;
  reducedMotion: boolean | null;
  className?: string;
  children: ReactNode;
}) {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: REVEAL_DURATION_S,
        delay: show ? delay : 0,
        ease: REVEAL_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function ContactPageLayout() {
  const reducedMotion = useReducedMotion();
  const snapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [snapReady, setSnapReady] = useState(false);

  const cardCentered = useInView(cardRef, {
    amount: 0.52,
    once: true,
    margin: "-8% 0px -8% 0px",
  });

  useEffect(() => {
    if (reducedMotion) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlSnap = html.style.scrollSnapType;
    const prevBodySnap = body.style.scrollSnapType;
    const hadSmooth = html.classList.contains("scroll-smooth");

    html.style.scrollSnapType = "y mandatory";
    body.style.scrollSnapType = "y mandatory";
    html.classList.add("scroll-smooth");

    return () => {
      html.style.scrollSnapType = prevHtmlSnap;
      body.style.scrollSnapType = prevBodySnap;
      if (!hadSmooth) html.classList.remove("scroll-smooth");
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion) {
      setSnapReady(true);
      return;
    }

    const snapTarget = snapRef.current;
    if (!snapTarget) return;

    snapTarget.scrollIntoView({ block: "start", behavior: "instant" });

    const frame = requestAnimationFrame(() => {
      setSnapReady(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  const showContent = reducedMotion === true || snapReady || cardCentered;

  return (
    <div
      className="site-hero-pull px-4 pb-6 sm:px-6 lg:px-8 lg:pb-8"
      style={{ backgroundColor: HOME_INDUSTRIES_BG }}
    >
      <div
        ref={snapRef}
        className="site-content-below-nav site-scroll-mt mx-auto flex w-full max-w-7xl snap-center snap-always items-center py-4 sm:py-6"
      >
        <div
          ref={cardRef}
          className="relative min-h-[min(92dvh,58rem)] w-full overflow-hidden rounded-[2rem] border border-ns-border text-white sm:min-h-[min(94dvh,62rem)] sm:rounded-[2.5rem]"
        >
          <Image
            src={PUBLIC_ASSETS.shared.workersHero}
            alt=""
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ns-dark via-ns-dark/80 to-ns-dark/35"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ns-dark/85 via-ns-dark/55 to-ns-dark/20"
            aria-hidden
          />

          <div className="relative z-10 flex min-h-[min(92dvh,58rem)] flex-col gap-8 p-6 pt-10 sm:min-h-[min(94dvh,62rem)] sm:gap-10 sm:p-10 sm:pt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10 lg:gap-y-8 lg:p-12 lg:pt-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
            <PageBackHeader
              backHref="/"
              tone="on-dark"
              simple
              className="absolute left-6 top-10 z-20 mb-0 sm:left-10 sm:top-12 lg:left-12"
            />

            <ContactReveal
              show={showContent}
              delay={STAGGER.title}
              reducedMotion={reducedMotion}
              className="max-w-2xl pt-10 sm:pt-12 lg:col-start-1 lg:row-start-1"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ns-emerald">
                Contacto
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Hablemos de tu operación
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                Escríbenos para conocer tus desafíos productivos y evaluar
                soluciones específicas.
              </p>
            </ContactReveal>

            <ContactReveal
              show={showContent}
              delay={STAGGER.formCard}
              reducedMotion={reducedMotion}
              className={cn(
                GLASS_CARD,
                "p-6 sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-2 lg:self-start xl:mt-4",
              )}
            >
              <h2 className="mb-2 text-xl font-bold text-white">Contactanos</h2>
              <p className="mb-8 text-sm text-white/65">
                Indica tu rubro y tu consulta.
              </p>
              <ContactForm variant="on-dark" />
            </ContactReveal>

            <ContactReveal
              show={showContent}
              delay={STAGGER.infoCard}
              reducedMotion={reducedMotion}
              className={cn(
                GLASS_CARD,
                "max-w-xl p-5 sm:p-6 lg:col-start-1 lg:row-start-2 lg:self-end",
              )}
            >
              <section aria-labelledby="contacto-direcciones">
                <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                  <div>
                    <h2
                      id="contacto-direcciones"
                      className="text-[10px] font-semibold uppercase tracking-widest text-ns-emerald"
                    >
                      Direcciones
                    </h2>
                    <div className="mt-4 space-y-5">
                      <ContactInfoBlock title="Oficina y bodega central">
                        <p>José Joaquín Pérez 4457 Quinta Normal, Santiago</p>
                        <p>
                          <span className="text-white/45">Tel.</span>{" "}
                          <a
                            href="tel:+56227860554"
                            className="text-white/85 transition-colors hover:text-cyan-300"
                          >
                            +56 227860554
                          </a>
                        </p>
                      </ContactInfoBlock>
                      <ContactInfoBlock title="Oficina sucursal">
                        <p>Región de los Lagos Estación 196, Puerto Varas</p>
                        <p>
                          <a
                            href="tel:+56652232500"
                            className="text-white/85 transition-colors hover:text-cyan-300"
                          >
                            +56 652232500
                          </a>
                        </p>
                      </ContactInfoBlock>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-[10px] font-semibold uppercase tracking-widest text-ns-emerald">
                      Horario
                    </h2>
                    <div className="mt-4 space-y-5">
                      <ContactInfoBlock title="Lunes a jueves">
                        <p>8:30 – 13:00 / 14:00 – 18:30 hrs</p>
                      </ContactInfoBlock>
                      <ContactInfoBlock title="Viernes">
                        <p>8:30 – 15:30 hrs</p>
                      </ContactInfoBlock>
                      <ContactInfoBlock title="Atención al cliente">
                        <p>
                          <a
                            href="mailto:sac@nutriservice.cl"
                            className="text-white/85 transition-colors hover:text-cyan-300"
                          >
                            sac@nutriservice.cl
                          </a>
                        </p>
                      </ContactInfoBlock>
                    </div>
                  </div>
                </div>
              </section>
            </ContactReveal>
          </div>
        </div>
      </div>

      <div className="h-[22dvh] shrink-0" aria-hidden />
    </div>
  );
}
