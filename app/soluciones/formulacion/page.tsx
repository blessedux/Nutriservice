import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Formulación — Paso 2 del sistema Nutriservice",
  description:
    "Formulación de precisión basada en los datos reales de tu operación, no en promedios del mercado. Cada fórmula es específica para tu especie, etapa y materias primas.",
};

const PRECISION_POINTS = [
  {
    title: "Basada en tu diagnóstico",
    detail:
      "No partimos de una fórmula genérica. Partimos de los datos reales de tu operación: insumos, condiciones y objetivos.",
  },
  {
    title: "Ajustada a cada lote de MP",
    detail:
      "Las materias primas varían. Analizamos cada lote para ajustar la fórmula y mantener la consistencia nutricional independiente del proveedor.",
  },
  {
    title: "Específica por especie y etapa",
    detail:
      "Los requerimientos nutricionales cambian por especie, fase productiva y objetivo. La fórmula refleja eso con precisión.",
  },
  {
    title: "Verificada analíticamente",
    detail:
      "Nuestro laboratorio propio con tecnología NIR verifica la composición real antes de recomendar.",
  },
];

export default function FormulacionPage() {
  return (
    <>
      <section className="bg-ns-dark text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-ns-emerald">
              Paso 02
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
            Formulación
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
            La fórmula precisa para tu contexto, no para el promedio del
            mercado. Diseñada con los datos reales de tu diagnóstico.
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
              Las fórmulas genéricas asumen condiciones que no existen en tu operación
            </h2>
            <p className="text-ns-muted leading-relaxed">
              Una fórmula de referencia fue diseñada para condiciones promedio
              con materias primas de referencia. Tu operación tiene variaciones
              reales que esa fórmula no considera. La brecha entre el potencial
              y el resultado está ahí.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              Nuestra respuesta
            </p>
            <h2 className="text-2xl font-bold text-ns-text mb-4">
              Precisión en cada variable que afecta el resultado
            </h2>
            <p className="text-ns-muted leading-relaxed">
              Formulamos con los datos del diagnóstico: los insumos reales
              disponibles, sus perfiles analíticos por lote, la fase productiva
              exacta y los objetivos de rendimiento específicos de tu operación.
            </p>
          </div>
        </div>
      </section>

      {/* Precision points */}
      <section className="py-20 px-6 bg-ns-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ns-text mb-10">
            Qué hace precisa a nuestra formulación
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PRECISION_POINTS.map((p) => (
              <div
                key={p.title}
                className="rounded-xl bg-white border border-ns-border p-6"
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

      {/* Result */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
            Resultado
          </p>
          <h2 className="text-3xl font-bold text-ns-text mb-4">
            Una fórmula verificada que rinde en tu producción
          </h2>
          <p className="text-lg text-ns-muted leading-relaxed">
            La formulación maximiza conversión y estabilidad usando los insumos
            que tienes disponibles. No requiere cambiar todo: requiere ajustar
            con datos.
          </p>
          <div className="mt-8 flex gap-4 justify-center flex-col sm:flex-row">
            <Link
              href="/soluciones/implementacion"
              className="inline-flex justify-center items-center rounded-lg bg-ns-green px-6 py-3 text-sm font-semibold text-white hover:bg-ns-green-dark transition-colors"
            >
              Siguiente paso: Implementación →
            </Link>
            <Link
              href="/tecnologia"
              className="inline-flex justify-center items-center rounded-lg border border-ns-border px-6 py-3 text-sm font-semibold text-ns-text hover:border-ns-green hover:text-ns-green transition-colors"
            >
              Ver infraestructura técnica
            </Link>
          </div>
        </div>
      </section>

      <CTABanner
        heading="¿Cuándo fue la última vez que validaste tu formulación?"
        subtext="Una formulación actualizada con datos reales puede cambiar los resultados del próximo ciclo."
      />
    </>
  );
}
