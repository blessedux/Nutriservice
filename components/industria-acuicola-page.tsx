"use client";

import PartnerBrandLogos from "@/components/partner-brand-logos";
import IndustriaFixedVideoBg from "@/components/industria-fixed-video-bg";
import IndustriaProductosSection from "@/components/industria-productos-section";
import PageBackHeader from "@/components/page-back-header";
import { useHeroRevealReady } from "@/components/site-reveal-context";
import { FinTechHeroGrid } from "@/components/ui/fin-tech-landing-page";
import type { Industry } from "@/lib/industries";
import {
  SITE_FOOTER_CTA_BROCHURE_LABEL,
  SITE_FOOTER_CTA_HEADING,
  SITE_FOOTER_CTA_PRIMARY_LABEL,
  SITE_FOOTER_CTA_SUBTEXT,
} from "@/lib/site-cta-copy";
import { getIndustryBrochureHref } from "@/lib/industry-brochures";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

const GLASS_CARD = cn(
  "rounded-xl border border-white/20 bg-white/[0.07] p-6 backdrop-blur-xl",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_12px_40px_-16px_rgba(0,0,0,0.45)]",
);

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
      <span className="h-px w-8 shrink-0 bg-cyan-400/80" aria-hidden />
      {children}
    </p>
  );
}

function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn(GLASS_CARD, className)}>{children}</div>;
}

type IndustriaAcuicolaPageProps = {
  industry: Industry;
};

export default function IndustriaAcuicolaPage({
  industry,
}: IndustriaAcuicolaPageProps) {
  const heroRevealReady = useHeroRevealReady();

  return (
    <div className="relative text-white">
      <IndustriaFixedVideoBg />

      <div className="relative z-10">
        <section className="relative -mt-24 min-h-[100dvh] scroll-mt-24 overflow-hidden">
          <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1280px] flex-col justify-center px-6 pb-14 pt-28 sm:px-10 sm:pt-32 lg:px-12">
            <PageBackHeader
              backHref="/industrias"
              crumbs={[
                { label: "Industrias", href: "/industrias" },
                { label: industry.name },
              ]}
              tone="on-dark"
            />
            <FinTechHeroGrid
              heroRevealReady={heroRevealReady}
              tone="on-video"
              hideSideCards
              hideEyebrow
              hideStats
              content={{
                title: industry.tagline,
                description: industry.problem,
                ctaHref: "/contacto",
                ctaLabel: "Agendar evaluación técnica",
              }}
            />
          </div>
        </section>

        <IndustriaProductosSection
          industrySlug={industry.slug}
          industryName={industry.name}
          variant="on-dark"
        />

        

        <section className="px-6 py-20 sm:px-10 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <GlassCard>
              <SectionEyebrow>Nuestro enfoque</SectionEyebrow>
              <h2 className="mt-4 text-2xl font-bold text-white">
                Experiencia, escala y respaldo internacional
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/72">
                {industry.approach}
              </p>
            </GlassCard>

            <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-5 text-center sm:mt-12">
              <p className="text-[10px] font-medium uppercase leading-relaxed tracking-[0.22em] text-white/55">
                Representantes oficiales de marcas internacionales de referencia
              </p>
              <PartnerBrandLogos layout="center" />
            </div>
          </div>
        </section>

        <section
          id="contacto"
          className="scroll-mt-24 px-6 py-20 sm:px-10 lg:px-12"
        >
          <GlassCard className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold text-white">
              {SITE_FOOTER_CTA_HEADING}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">
              {SITE_FOOTER_CTA_SUBTEXT}
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-8 py-3.5 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90"
              >
                {SITE_FOOTER_CTA_PRIMARY_LABEL}
              </Link>
              <a
                href={getIndustryBrochureHref(industry.slug)}
                download
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10"
              >
                {SITE_FOOTER_CTA_BROCHURE_LABEL}
              </a>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
