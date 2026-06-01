import type { Metadata } from "next";

import ImpactoHistorySection from "@/components/impacto-history-section";
import NosotrosContactParallaxSection from "@/components/nosotros-contact-parallax-section";
import NosotrosTeamSection from "@/components/nosotros-team-section";
import PageBackHeader from "@/components/page-back-header";

export const metadata: Metadata = {
  title: "Nosotros — Trayectoria y propósito",
  description:
    "Conoce la historia de Nutriservice: más de 30 años de nutrición animal de precisión, innovación y compromiso con la industria.",
};

export default function NosotrosPage() {
  return (
    <div className="min-h-screen -mt-24 bg-ns-navy">
      <section className="px-6 pb-12 pt-28 text-white sm:px-10 sm:pb-16 sm:pt-32 lg:px-12 lg:pt-36">
        <div className="mx-auto max-w-4xl">
          <PageBackHeader backHref="/" tone="on-dark" simple />
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ns-emerald">
            Nosotros
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight sm:text-5xl">
            Ciencia que alimenta confianza.
            <br />
            Personas que impulsan soluciones
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
            Nutriservice integra formulación, maquila y acompañamiento técnico
            para que productores y plantas de alimento conviertan la nutrición
            en ventaja competitiva medible.
          </p>
        </div>
      </section>

      <NosotrosTeamSection />

      <div className="relative bg-ns-navy">
        <ImpactoHistorySection className="relative z-0 pb-20 sm:pb-28" />
        <NosotrosContactParallaxSection />
      </div>
    </div>
  );
}
