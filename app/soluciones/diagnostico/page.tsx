import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Diagnóstico — Paso 1 del sistema Nutriservice",
  description:
    "Analizamos materias primas, condiciones productivas y resultados históricos para identificar con precisión dónde está el margen de mejora.",
};

const WHAT_WE_ANALYZE = [
  {
    title: "Materias primas",
    detail:
      "Caracterización analítica de cada insumo: perfil nutricional, variabilidad por lote, calidad real vs. declarada.",
  },
  {
    title: "Condiciones productivas",
    detail:
      "Especie, etapa productiva, densidad, temperatura, manejo sanitario, resultados históricos de FCR y mortalidad.",
  },
  {
    title: "Formulaciones en uso",
    detail:
      "Revisión técnica de las fórmulas actuales: adecuación a requerimientos, coherencia con insumos disponibles.",
  },
  {
    title: "Resultados por ciclo",
    detail:
      "Análisis de tendencias productivas para identificar si el problema es sistemático o puntual.",
  },
];

export default function DiagnosticoPage() {
  return (
    <>
      <section className="bg-ns-dark text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-ns-emerald">
              Paso 01
            </span>
            <span className="text-white/25">·</span>
            <Link
              href="/soluciones"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Volver al sistema
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Diagnóstico
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
            Sin diagnóstico, la formulación parte de supuestos. Los supuestos
            generan variabilidad. El diagnóstico técnico es la base de cada
            decisión que tomamos.
          </p>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              El problema
            </p>
            <h2 className="text-2xl font-bold text-ns-text mb-4">
              Formular sin datos es asumir un riesgo innecesario
            </h2>
            <p className="text-ns-muted leading-relaxed">
              La mayoría de los productores trabajan con fórmulas heredadas o
              recomendaciones genéricas que no consideran la calidad real de sus
              materias primas ni las condiciones específicas de su operación. El
              resultado es variabilidad silenciosa que se acumula lote a lote.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              Nuestra respuesta
            </p>
            <h2 className="text-2xl font-bold text-ns-text mb-4">
              Datos reales antes de cualquier recomendación
            </h2>
            <p className="text-ns-muted leading-relaxed">
              Analizamos tu situación actual con rigor técnico: materias primas,
              condiciones de producción, historial de resultados. El diagnóstico
              define el punto de partida y el mapa de mejora.
            </p>
          </div>
        </div>
      </section>

      {/* What we analyze */}
      <section className="py-20 px-6 bg-ns-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ns-text mb-10">
            Qué analizamos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHAT_WE_ANALYZE.map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-white border border-ns-border p-6"
              >
                <div className="w-6 h-0.5 bg-ns-green mb-4" />
                <h3 className="font-semibold text-ns-text mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-ns-muted leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Result */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
            Resultado del diagnóstico
          </p>
          <h2 className="text-3xl font-bold text-ns-text mb-4">
            Una foto precisa del sistema actual
          </h2>
          <p className="text-lg text-ns-muted leading-relaxed">
            Al finalizar el diagnóstico, tenemos identificados los puntos donde
            se pierde eficiencia, la calidad real de las materias primas en uso
            y el potencial de mejora concreto. Eso es lo que guía la
            formulación.
          </p>
          <div className="mt-8 flex gap-4 justify-center flex-col sm:flex-row">
            <Link
              href="/soluciones/formulacion"
              className="inline-flex justify-center items-center rounded-lg bg-ns-green px-6 py-3 text-sm font-semibold text-white hover:bg-ns-green-dark transition-colors"
            >
              Siguiente paso: Formulación →
            </Link>
            <Link
              href="/contacto"
              className="inline-flex justify-center items-center rounded-lg border border-ns-border px-6 py-3 text-sm font-semibold text-ns-text hover:border-ns-green hover:text-ns-green transition-colors"
            >
              Agendar diagnóstico
            </Link>
          </div>
        </div>
      </section>

      <CTABanner
        heading="El diagnóstico es el primer paso"
        subtext="Hablemos de tu situación productiva actual. Sin compromiso, con datos."
        primaryLabel="Agendar evaluación técnica"
      />
    </>
  );
}
