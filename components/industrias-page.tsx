import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import IndustriasCtaBanner from "@/components/industrias-cta-banner";
import PageBackHeader from "@/components/page-back-header";
import { ProductosCarousel } from "@/components/productos-carousel";
import {
  INDUSTRIAS_VERTICALS,
  type IndustriaVertical,
} from "@/lib/industrias-page-data";
import {
  PRODUCTOS_INVENTORY,
  productosFilterHref,
} from "@/lib/productos-inventory";
import { PUBLIC_ASSETS } from "@/lib/public-assets";
import { cn } from "@/lib/utils";

const PAGE_NAVY = "#0a192f";
const PAGE_CYAN = "#06b6d4";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span
        className="h-px w-10 shrink-0"
        style={{ backgroundColor: PAGE_CYAN }}
        aria-hidden
      />
      <p
        className="max-w-xl text-pretty font-mono text-[10px] font-bold uppercase leading-snug tracking-[0.22em] sm:tracking-[0.28em]"
        style={{ color: `${PAGE_CYAN}99` }}
      >
        {children}
      </p>
    </div>
  );
}

function IndustriasHero() {
  return (
    <section className="relative site-hero-pull w-full min-h-[100dvh] overflow-hidden text-white">
      <div className="absolute inset-0 size-full overflow-hidden" aria-hidden>
        <Image
          src={PUBLIC_ASSETS.industriasPage.heroLab}
          alt=""
          fill
          priority
          sizes="100vw"
          className="size-full min-h-full min-w-full scale-[1.08] object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0a192f]/60" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#0a192f] via-[#0a192f]/60 to-transparent"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col justify-center px-6 py-[calc(var(--site-nav-height)+1.5rem)] sm:px-10 lg:px-16 xl:px-32">
        <PageBackHeader
          backHref="/"
          crumbs={[{ label: "Industrias" }]}
          tone="on-dark"
        />
        <Eyebrow>30+ años al servicio de la nutrición funcional animal en Chile</Eyebrow>
        <h1 className="mt-6 max-w-[800px] text-balance text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3rem] lg:leading-[1.2]">
          Excelencia Nutricional
          <br />
          por Segmento
        </h1>
        <p className="mt-5 max-w-[580px] text-pretty text-base leading-relaxed text-white/70 sm:text-lg sm:leading-8">
          Diseñamos soluciones biotecnológicas específicas para los desafíos
          críticos de cada vertical productiva, garantizando rendimientos
          predecibles.
        </p>
        <div className="mt-8">
          <Link
            href="/productos"
            className="inline-flex items-center justify-center rounded-full px-10 py-4 text-center text-xs font-black uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
            style={{ backgroundColor: PAGE_CYAN, color: PAGE_NAVY }}
          >
            Catálogo Completo
          </Link>
        </div>
      </div>
    </section>
  );
}

function ChallengeSolutionCards({ vertical }: { vertical: IndustriaVertical }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2 rounded-3xl border border-[#1e3a8a]/5 bg-[#e0f2fe]/30 p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e3a8a]/40">
          Desafío Crítico
        </p>
        <p className="text-base font-bold leading-snug text-[#0a192f]">
          {vertical.challengeLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
      <div className="flex flex-col gap-2 rounded-3xl bg-[#0a192f] p-6">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: PAGE_CYAN }}
        >
          Solución Nutriservice
        </p>
        <p className="text-[15px] font-light leading-snug text-white">
          {vertical.solutionLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

function IndustriaVerticalCard({ vertical }: { vertical: IndustriaVertical }) {
  const isMascotas = vertical.slug === "mascotas";

  return (
    <article className="flex flex-col gap-8">
      <Link
        href={`/industrias/${vertical.slug}`}
        className="group relative block h-[280px] overflow-hidden rounded-[40px] sm:h-[360px] lg:h-[400px]"
      >
        <div className="absolute inset-0 size-full">
          <Image
            src={vertical.image}
            alt=""
            fill
            className={cn(
              "size-full min-h-full min-w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
              !isMascotas ? "object-[center_25%]" : "object-center",
            )}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent"
          aria-hidden
        />
        <div className="absolute bottom-8 left-8 flex flex-col gap-2">
          <span className="inline-flex rounded bg-[#0a192f]/80 px-4 py-0.5 font-mono text-xs font-bold text-cyan-500">
            {vertical.vertical}
          </span>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            {vertical.displayName}
          </h2>
        </div>
      </Link>

      <div className="flex flex-col gap-6">
        <ChallengeSolutionCards vertical={vertical} />
        <div className="flex flex-col gap-4 border-t border-[#1e3a8a]/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#0a192f]/60">
            Productos Destacados: {vertical.featuredProducts}
          </p>
          <Link
            href={`/industrias/${vertical.slug}`}
            className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-wide text-cyan-500 transition-opacity hover:opacity-80"
          >
            Ver Soluciones
            <ChevronRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

function IndustriasGrid() {
  return (
    <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24 xl:px-32">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-24 xl:gap-x-12">
        {INDUSTRIAS_VERTICALS.map((vertical) => (
          <IndustriaVerticalCard key={vertical.slug} vertical={vertical} />
        ))}
      </div>
    </section>
  );
}

function IndustriasProductosPreview() {
  return (
    <section className="border-t border-[#1e3a8a]/10 bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 xl:px-32">
      <div className="mx-auto max-w-[1440px]">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: `${PAGE_CYAN}99` }}
        >
          Productos
        </p>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold text-[#0a192f]">
              Soluciones funcionales por especie y objetivo
            </h2>
            <p className="mt-3 text-[#0a192f]/60">
              Explore el catálogo de productos e ingredientes funcionales que
              respaldan cada etapa del sistema Nutriservice.
            </p>
          </div>
          <Link
            href={productosFilterHref({})}
            className="inline-flex shrink-0 items-center justify-center rounded-full px-10 py-4 text-center text-xs font-black uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
            style={{ backgroundColor: PAGE_CYAN, color: PAGE_NAVY }}
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
  );
}

export default function IndustriasPageContent() {
  return (
    <>
      <IndustriasHero />
      <IndustriasGrid />
      <IndustriasProductosPreview />
      <IndustriasCtaBanner />
    </>
  );
}
