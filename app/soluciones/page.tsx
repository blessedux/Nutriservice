import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ImpactSection from "@/components/impact-section";
import IndustriasCtaBanner from "@/components/industrias-cta-banner";
import { ProductosCarousel } from "@/components/productos-carousel";
import {
  PRODUCTOS_INVENTORY,
  productosFilterHref,
} from "@/lib/productos-inventory";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export const metadata: Metadata = {
  title: "Soluciones — Sistema de optimización productiva",
  description:
    "Diagnóstico, formulación, implementación y optimización continua. El sistema de 4 pasos que convierte la nutrición animal en una ventaja competitiva medible.",
};

export default function SolucionesPage() {
  return (
    <>
      <section className="relative -mt-24 scroll-mt-24 bg-ns-surface px-6 pt-28 pb-10 sm:px-10 sm:pt-32 sm:pb-12 lg:px-12 lg:pt-36">
        <div className="relative mx-auto min-h-[min(100dvh,52rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] text-white shadow-sm sm:rounded-[2.5rem]">
          <Image
            src={PUBLIC_ASSETS.shared.workersHero}
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
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ns-emerald">
              Soluciones
            </p>
            <h1 className="mb-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Un sistema diseñado para resultados productivos reales
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              No vendemos suplementos. Integramos diagnóstico, formulación
              precisa, implementación acompañada y optimización continua en un
              modelo que convierte la nutrición en una ventaja competitiva.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-ns-border bg-ns-surface px-6 py-16 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald">
            Productos
          </p>

          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-ns-text">
                Soluciones nutricionales por especie y objetivo
              </h2>
              <p className="mt-3 text-ns-muted">
                Explore el catálogo de productos e ingredientes funcionales que
                respaldan cada etapa del sistema Nutriservice.
              </p>
            </div>
            <Link
              href={productosFilterHref({})}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-ns-green px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-ns-green-dark"
            >
              Ver catálogo completo
            </Link>
          </div>

          <ProductosCarousel
            productos={PRODUCTOS_INVENTORY}
            className="mt-10 -mx-6 sm:mx-0"
            ariaLabel="Galería de productos Nutriservice"
          />
        </div>
      </section>

      <ImpactSection withCover={false} />

      <IndustriasCtaBanner id="contacto" />
    </>
  );
}
