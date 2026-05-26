import Image from "next/image";
import Link from "next/link";
import { ChevronRight, FlaskConical, Shield } from "lucide-react";

import IndustriasCtaBanner from "@/components/industrias-cta-banner";
import {
  INDUSTRIAS_LABS,
  INDUSTRIAS_PILLARS,
  INDUSTRIAS_VERTICALS,
  type IndustriaVertical,
} from "@/lib/industrias-page-data";
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
        className="font-mono text-[10px] font-bold uppercase tracking-[0.35em]"
        style={{ color: `${PAGE_CYAN}99` }}
      >
        {children}
      </p>
    </div>
  );
}

function IndustriasHero() {
  return (
    <section className="relative -mt-24 w-full min-h-[100dvh] overflow-hidden text-white">
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
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col justify-center px-6 py-28 sm:px-10 sm:py-32 lg:px-16 xl:px-32">
        <Eyebrow>Biotech Industrial Excellence</Eyebrow>
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
            Ver Protocolos
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

function IndustriasRdSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a192f] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-16 lg:py-24 xl:px-32">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-10" aria-hidden>
        <Image
          src={PUBLIC_ASSETS.industriasPage.molecularBg}
          alt=""
          fill
          className="object-cover object-right"
          sizes="50vw"
        />
      </div>

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-6">
          <Eyebrow>Infraestructura de I+D</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-[2rem] sm:leading-[1.35]">
            Especialización de
            <br />
            Clase Mundial.
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/60">
            Contamos con laboratorios especializados para cada vertical, donde
            simulamos condiciones productivas reales para validar cada fórmula
            antes de su implementación industrial.
          </p>

          <div className="mt-2 flex flex-col gap-6">
            {INDUSTRIAS_LABS.map((lab) => (
              <div
                key={lab.title}
                className="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-xl",
                    lab.accent === "cyan" ? "bg-cyan-500" : "bg-[#1e3a8a]",
                  )}
                >
                  {lab.icon === "flask" ? (
                    <FlaskConical className="size-6 text-[#0a192f]" aria-hidden />
                  ) : (
                    <Shield className="size-6 text-white" aria-hidden />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">{lab.title}</h3>
                  <p className="text-sm text-white/40">{lab.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {INDUSTRIAS_PILLARS.map((pillar) => (
            <div
              key={pillar.number}
              className={cn(
                "flex flex-col justify-between rounded-[32px] border p-8 backdrop-blur-sm",
                pillar.variant === "wide" && "sm:col-span-2",
                pillar.variant === "highlight"
                  ? "border-cyan-500/20 bg-[#1e3a8a]/20"
                  : "border-white/10 bg-white/5",
              )}
            >
              <p className="font-mono text-2xl text-cyan-500">{pillar.number}</p>
              <div className="mt-8 flex flex-col gap-2">
                <h3 className="text-lg font-bold leading-snug">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-white/40">
                  {pillar.detail.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function IndustriasPageContent() {
  return (
    <>
      <IndustriasHero />
      <IndustriasGrid />
      <IndustriasRdSection />
      <IndustriasCtaBanner />
    </>
  );
}
