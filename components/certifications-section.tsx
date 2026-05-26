"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { HomeBlueBand } from "@/components/home-blue-band";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

const CERTIFICATIONS = [
  {
    src: PUBLIC_ASSETS.certifications.sgs,
    alt: "Certificación SGS",
  },
  {
    src: PUBLIC_ASSETS.certifications.rep,
    alt: "Certificación REP",
  },
] as const;

export default function CertificationsSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });

  // Cert band lifts slower than the scroll — hero video lingers beneath
  const y = useTransform(scrollYProgress, [0, 1], [48, -48]);

  return (
    <div ref={wrapperRef} className="-mt-[25dvh] pointer-events-none">
      <HomeBlueBand
        id="certificaciones"
        height="half"
        aria-label="Certificaciones"
        className="justify-end bg-transparent pb-12 pt-0"
      >
        {/* Gradient: transparent at top (hero shows through), solid navy from 40% */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(3,10,28,0)_0%,#030A1C_40%)]"
        />

        {/* Parallax content — moves slower than scroll */}
        <motion.div
          style={{ y: reduceMotion ? 0 : y }}
          className="pointer-events-auto relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 sm:gap-10 sm:px-10 lg:px-12"
        >
          <header className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/45">
              Calidad verificada
            </p>
            <h2 className="mt-3 text-balance text-xl font-light tracking-tight text-white sm:text-2xl">
              Certificaciones que respaldan cada lote
            </h2>
          </header>

          <ul className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 lg:gap-20">
            {CERTIFICATIONS.map((cert) => (
              <li key={cert.src}>
                <Image
                  src={cert.src}
                  alt={cert.alt}
                  width={120}
                  height={120}
                  className="h-20 w-20 object-contain opacity-90 brightness-110 sm:h-24 sm:w-24"
                />
              </li>
            ))}
          </ul>
        </motion.div>
      </HomeBlueBand>
    </div>
  );
}
