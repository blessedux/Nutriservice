import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Implementación — Paso 3 del sistema Nutriservice",
  description:
    "Acompañamiento técnico en terreno durante la implementación. No entregamos un producto y nos vamos: estamos presentes donde el resultado se define.",
};

const SUPPORT_ELEMENTS = [
  {
    title: "Presencia técnica en terreno",
    detail:
      "Nuestros especialistas acompañan la transición en el lugar donde ocurre, no desde la oficina.",
  },
  {
    title: "Monitoreo en las primeras semanas",
    detail:
      "El período crítico post-cambio es el más importante. Monitoreamos parámetros clave para detectar desvíos a tiempo.",
  },
  {
    title: "Ajuste en tiempo real",
    detail:
      "Si algo no está funcionando como se proyectó, lo corregimos antes de que impacte el ciclo completo.",
  },
  {
    title: "Documentación del proceso",
    detail:
      "Registramos el proceso de implementación para que el seguimiento futuro tenga datos de referencia claros.",
  },
];

export default function ImplementacionPage() {
  return (
    <>
      <section className="bg-ns-dark text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-ns-emerald">
              Paso 03
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
            Implementación
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
            No entregamos un producto y nos vamos. Estamos presentes donde el
            resultado se define: en terreno, durante la transición.
          </p>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              El riesgo
            </p>
            <h2 className="text-2xl font-bold text-ns-text mb-4">
              La transición es el punto de mayor riesgo del cambio
            </h2>
            <p className="text-ns-muted leading-relaxed">
              Incluso una formulación correcta puede fallar en la implementación
              si los tiempos de transición, las dosis o las condiciones de
              aplicación no son los adecuados. El error en esta etapa no se
              ve de inmediato: se paga al final del ciclo.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              Nuestro rol
            </p>
            <h2 className="text-2xl font-bold text-ns-text mb-4">
              Presencia técnica donde el resultado se juega
            </h2>
            <p className="text-ns-muted leading-relaxed">
              Nuestros especialistas acompañan la implementación en terreno,
              monitoreando el proceso y ajustando en tiempo real. La diferencia
              entre teoría y producción se resuelve con presencia técnica.
            </p>
          </div>
        </div>
      </section>

      {/* Support elements */}
      <section className="py-20 px-6 bg-ns-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ns-text mb-10">
            Cómo acompañamos la implementación
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SUPPORT_ELEMENTS.map((s) => (
              <div
                key={s.title}
                className="rounded-xl bg-white border border-ns-border p-6"
              >
                <div className="w-6 h-0.5 bg-ns-green mb-4" />
                <h3 className="font-semibold text-ns-text mb-2">{s.title}</h3>
                <p className="text-sm text-ns-muted leading-relaxed">
                  {s.detail}
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
            Una transición controlada que no compromete el ciclo
          </h2>
          <p className="text-lg text-ns-muted leading-relaxed">
            Los ajustes se hacen antes de que los errores se acumulen. La
            implementación deja documentación de referencia para los ciclos
            siguientes.
          </p>
          <div className="mt-8 flex gap-4 justify-center flex-col sm:flex-row">
            <Link
              href="/soluciones/optimizacion"
              className="inline-flex justify-center items-center rounded-lg bg-ns-green px-6 py-3 text-sm font-semibold text-white hover:bg-ns-green-dark transition-colors"
            >
              Siguiente paso: Optimización continua →
            </Link>
          </div>
        </div>
      </section>

      <CTABanner
        heading="La implementación define el resultado"
        subtext="Agenda una conversación técnica y evaluamos cómo estructurar el acompañamiento para tu operación."
      />
    </>
  );
}
