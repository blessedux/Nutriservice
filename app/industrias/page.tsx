import type { Metadata } from "next";
import Link from "next/link";
import { industryList } from "@/lib/industries";
import CTABanner from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Industrias — Soluciones por sector productivo",
  description:
    "Acuícola, avícola, porcina y mascotas. Cada industria tiene sus propios desafíos productivos. Adaptamos el sistema de nutrición a las variables de tu operación.",
};

const ICONS: Record<string, string> = {
  acuicola: "🐟",
  avicola: "🐓",
  porcina: "🐷",
  mascotas: "🐾",
};

export default function IndustriasPage() {
  return (
    <>
      <section className="bg-ns-dark text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-4">
            Industrias
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Cada industria tiene sus propios desafíos
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
            Los problemas productivos en acuicultura son distintos a los de
            avicultura. La nutrición de precisión requiere adaptarse a las
            variables específicas de cada sistema productivo.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industryList.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industrias/${ind.slug}`}
                className="group rounded-xl border border-ns-border bg-ns-surface hover:border-ns-green hover:bg-white transition-all p-8 flex flex-col"
              >
                <div className="flex items-start justify-between mb-5">
                  <span className="text-4xl">{ICONS[ind.slug]}</span>
                  <span className="text-xs font-semibold text-ns-muted group-hover:text-ns-green transition-colors">
                    Ver industria →
                  </span>
                </div>
                <h2 className="text-xl font-bold text-ns-text group-hover:text-ns-green transition-colors mb-3">
                  {ind.name}
                </h2>
                <p className="text-sm text-ns-muted leading-relaxed mb-5 flex-1">
                  {ind.tagline}
                </p>
                <p className="text-sm text-ns-muted border-t border-ns-border pt-4 leading-relaxed">
                  {ind.problem.slice(0, 120)}…
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Common thread */}
      <section className="py-20 px-6 bg-ns-surface">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
            Lo que tienen en común
          </p>
          <h2 className="text-2xl font-bold text-ns-text mb-4">
            El sistema es el mismo. La aplicación, específica.
          </h2>
          <p className="text-lg text-ns-muted leading-relaxed max-w-2xl mx-auto">
            En todas las industrias aplicamos el mismo ciclo: diagnóstico,
            formulación precisa, implementación acompañada y optimización
            continua. Lo que cambia son las variables productivas, los
            requerimientos nutricionales y el contexto de cada operación.
          </p>
          <div className="mt-8">
            <Link
              href="/soluciones"
              className="inline-flex items-center text-sm font-semibold text-ns-green hover:underline"
            >
              Conoce el sistema completo →
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
