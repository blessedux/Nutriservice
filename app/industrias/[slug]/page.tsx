import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getIndustry, industryList } from "@/lib/industries";
import CTABanner from "@/components/cta-banner";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return industryList.map((ind) => ({ slug: ind.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return {
    title: `${ind.name} — Nutrición de precisión`,
    description: ind.problem,
  };
}

const ICONS: Record<string, string> = {
  acuicola: "🐟",
  avicola: "🐓",
  porcina: "🐷",
  mascotas: "🐾",
};

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-ns-dark text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-ns-emerald">
              {ICONS[ind.slug]} {ind.name}
            </span>
            <span className="text-white/25">·</span>
            <Link
              href="/industrias"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Ver todas las industrias
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            {ind.tagline}
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
            {ind.problem}
          </p>
        </div>
      </section>

      {/* Problem cards */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
            Los desafíos específicos
          </p>
          <h2 className="text-2xl font-bold text-ns-text mb-8">
            Qué enfrenta la producción {ind.name.toLowerCase()}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ind.problemCards.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-ns-border bg-ns-surface p-6"
              >
                <div className="w-6 h-0.5 bg-ns-green mb-4" />
                <h3 className="font-semibold text-ns-text mb-2">{p.title}</h3>
                <p className="text-sm text-ns-muted leading-relaxed">
                  {p.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-20 px-6 bg-ns-surface">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
            Nuestro enfoque
          </p>
          <h2 className="text-2xl font-bold text-ns-text mb-5">
            Cómo trabaja Nutriservice en {ind.name.toLowerCase()}
          </h2>
          <p className="text-lg text-ns-muted leading-relaxed max-w-2xl">
            {ind.approach}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
            El proceso
          </p>
          <h2 className="text-2xl font-bold text-ns-text mb-8">
            Cómo aplicamos el sistema en tu operación
          </h2>
          <div className="space-y-4">
            {ind.steps.map((s, i) => (
              <div
                key={s.title}
                className="flex gap-5 rounded-xl border border-ns-border bg-ns-surface p-6"
              >
                <p className="text-3xl font-bold text-ns-surface-alt leading-none flex-shrink-0 w-8">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-semibold text-ns-text mb-1">{s.title}</h3>
                  <p className="text-sm text-ns-muted leading-relaxed">
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 px-6 bg-ns-surface">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
            Resultados esperados
          </p>
          <h2 className="text-2xl font-bold text-ns-text mb-8">
            Lo que cambia en tu producción
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ind.results.map((r) => (
              <div key={r.metric} className="border-t-2 border-ns-green pt-4">
                <h3 className="font-semibold text-ns-text mb-2">{r.metric}</h3>
                <p className="text-sm text-ns-muted leading-relaxed">
                  {r.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        heading={ind.ctaText}
        subtext="Agenda una evaluación técnica y revisamos juntos el potencial de mejora en tu operación."
        primaryLabel="Agendar evaluación técnica"
      />
    </>
  );
}
