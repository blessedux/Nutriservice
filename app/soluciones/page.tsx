import type { Metadata } from "next";
import Image from "next/image";

import ImpactSection from "@/components/impact-section";
import IndustriasCtaBanner from "@/components/industrias-cta-banner";
import { ProductoCard } from "@/components/producto-card";
import { PRODUCTOS_INVENTORY } from "@/lib/productos-inventory";

export const metadata: Metadata = {
  title: "Soluciones — Sistema de optimización productiva",
  description:
    "Diagnóstico, formulación, implementación y optimización continua. El sistema de 4 pasos que convierte la nutrición animal en una ventaja competitiva medible.",
};

export default function SolucionesPage() {
  return (
    <>
      <section className="relative -mt-24 min-h-[100dvh] scroll-mt-24 overflow-hidden text-white">
        <Image
          src="/nutriservice_workers2.webp"
          alt=""
          fill
          priority
          sizes="100vw"
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
        <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-4xl flex-col justify-end px-6 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-36 lg:px-12 lg:pb-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-4">
            Soluciones
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5 max-w-3xl">
            Un sistema diseñado para resultados productivos reales
          </h1>
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
            No vendemos suplementos. Integramos diagnóstico, formulación
            precisa, implementación acompañada y optimización continua en un
            modelo que convierte la nutrición en una ventaja competitiva.
          </p>
        </div>
      </section>

      <section className="border-b border-ns-border bg-ns-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald">
            Productos
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ns-text">
            Soluciones nutricionales por especie y objetivo
          </h2>
          <p className="mt-3 max-w-2xl text-ns-muted">
            Explore el catálogo de productos e ingredientes funcionales que
            respaldan cada etapa del sistema Nutriservice.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTOS_INVENTORY.map((producto) => (
              <li key={producto.slug}>
                <ProductoCard producto={producto} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ImpactSection withCover={false} />

      <IndustriasCtaBanner id="contacto" />
    </>
  );
}
