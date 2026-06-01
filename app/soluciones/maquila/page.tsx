import type { Metadata } from "next";
import Image from "next/image";

import IndustriasCtaBanner from "@/components/industrias-cta-banner";
import MaquilaBenefitsSection from "@/components/maquila-benefits-section";
import MaquilaProcessSection from "@/components/maquila-process-section";
import PageBackHeader from "@/components/page-back-header";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export const metadata: Metadata = {
  title: "Maquila — Premixes y núcleos a medida",
  description:
    "Servicio integral de producción a terceros con confidencialidad, trazabilidad y calidad certificada en formulación, producción y optimización.",
};

export default function MaquilaPage() {
  return (
    <>
      <section className="relative -mt-24 scroll-mt-24 bg-ns-surface px-6 pt-28 pb-10 sm:px-10 sm:pt-32 sm:pb-12 lg:px-12 lg:pt-36">
        <div className="relative mx-auto min-h-[min(100dvh,52rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] text-white shadow-sm sm:rounded-[2.5rem]">
          <Image
            src={PUBLIC_ASSETS.maquilaSection.tabFormulacionHero}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1152px"
            className="object-cover object-center"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ns-dark via-ns-dark/80 to-ns-dark/35"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ns-dark/85 via-ns-dark/50 to-transparent"
            aria-hidden
          />
          <div className="relative z-10 flex min-h-[min(100dvh,52rem)] w-full flex-col justify-end px-6 pb-12 pt-24 sm:px-10 sm:pb-16 sm:pt-28 lg:px-12 lg:pb-20">
            <PageBackHeader
              backHref="/soluciones"
              tone="on-dark"
              simple
              className="absolute left-6 top-24 mb-0 sm:left-10 lg:left-12"
            />
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ns-emerald">
              Maquila
            </p>
            <h1 className="mb-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Producción a terceros con confidencialidad y calidad certificada
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              Damos solución de producción a terceros en la elaboración de sus
              propios productos garantizando confidencialidad. En Nutriservice,
              entendemos que la maquila es una herramienta estratégica para
              impulsar la competitividad en la industria de nutrición animal.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
              Nuestra División de Maquila está orientada a ofrecer un servicio
              integral de producción a terceros, garantizando calidad,
              seguridad y eficiencia en cada etapa del proceso.
            </p>
          </div>
        </div>
      </section>

      <MaquilaBenefitsSection />
      <MaquilaProcessSection />

      <IndustriasCtaBanner id="contacto" />
    </>
  );
}
