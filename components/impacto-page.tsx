import Link from "next/link";

import ImpactoHistorySection from "@/components/impacto-history-section";
import { IMPACTO_OUTCOMES } from "@/lib/impacto-page-data";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ns-emerald">
      {children}
    </p>
  );
}

export default function ImpactoPageContent() {
  return (
    <>
      <section className="bg-ns-dark px-6 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-4xl">
          <Eyebrow>Impacto</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight sm:text-5xl">
            Soluciones nutricionales que elevan el rendimiento de la industria
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
            Desarrollamos productos y programas nutricionales de alta precisión
            para que productores y plantas de alimento conviertan la ciencia en
            resultados productivos, económicos y sostenibles.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Para la industria</Eyebrow>
            <h2 className="mt-3 text-2xl font-bold text-ns-text">
              Tecnología nutricional que responde a desafíos reales de producción
            </h2>
            <p className="mt-4 leading-relaxed text-ns-muted">
              Premixes, núcleos y aditivos funcionales diseñados para cada
              vertical productiva. Integramos enzimas, prebióticos, nucleótidos
              y palatantes para mejorar digestibilidad, salud intestinal y
              consistencia operacional a escala industrial.
            </p>
            <Link
              href="/productos"
              className="mt-6 inline-flex text-sm font-semibold text-ns-green hover:underline"
            >
              Ver catálogo de productos →
            </Link>
          </div>
          <div>
            <Eyebrow>Para nuestros clientes</Eyebrow>
            <h2 className="mt-3 text-2xl font-bold text-ns-text">
              Más control, menos incertidumbre en cada ciclo productivo
            </h2>
            <p className="mt-4 leading-relaxed text-ns-muted">
              No vendemos insumos aislados: acompañamos con diagnóstico,
              formulación, implementación y optimización continua. Nuestros
              clientes obtienen respuestas técnicas claras, trazabilidad y un
              partner que está presente cuando el resultado se juega en campo.
            </p>
            <Link
              href="/soluciones"
              className="mt-6 inline-flex text-sm font-semibold text-ns-green hover:underline"
            >
              Conocer el sistema Nutriservice →
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
          {IMPACTO_OUTCOMES.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-ns-border bg-ns-surface p-6"
            >
              <div className="mb-4 h-0.5 w-6 bg-ns-green" />
              <h3 className="font-semibold text-ns-text">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ns-muted">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ImpactoHistorySection />
    </>
  );
}
