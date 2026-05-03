import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Optimización continua — Paso 4 del sistema Nutriservice",
  description:
    "La producción cambia. La nutrición se adapta. Revisamos resultados por ciclo y ajustamos la formulación para que la mejora sea acumulada, no puntual.",
};

const CYCLE_ELEMENTS = [
  {
    title: "Revisión de resultados por ciclo",
    detail:
      "Analizamos los datos productivos de cada ciclo — FCR, mortalidad, uniformidad — para identificar desviaciones respecto a la línea base.",
  },
  {
    title: "Ajuste ante cambios de MP",
    detail:
      "Cada vez que cambia un proveedor o lote de materia prima, revalidamos la composición y ajustamos si es necesario.",
  },
  {
    title: "Identificación de nuevas oportunidades",
    detail:
      "La revisión continua revela patrones que no son visibles en un solo ciclo. Los usamos para mejorar de forma acumulada.",
  },
  {
    title: "Soporte ante eventos productivos",
    detail:
      "Enfermedades, cambios climáticos o problemas sanitarios alteran los requerimientos. Respondemos con ajuste nutricional técnico.",
  },
];

export default function OptimizacionPage() {
  return (
    <>
      <section className="bg-ns-dark text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-ns-emerald">
              Paso 04
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
            Optimización continua
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
            La producción cambia. La nutrición se adapta. La mejora que buscamos
            no es puntual: es acumulada ciclo a ciclo con datos reales.
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
              Un programa nutricional fijo se desactualiza
            </h2>
            <p className="text-ns-muted leading-relaxed">
              Las condiciones cambian: proveedores de materias primas, clima,
              genética, sanitario. Una fórmula que funcionó hace seis meses
              puede no ser la óptima hoy. Sin revisión continua, la eficiencia
              se erosiona silenciosamente.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              Nuestro enfoque
            </p>
            <h2 className="text-2xl font-bold text-ns-text mb-4">
              Mejora acumulada con cada ciclo revisado
            </h2>
            <p className="text-ns-muted leading-relaxed">
              Revisamos resultados productivos con datos reales por ciclo y
              ajustamos la formulación cuando las condiciones lo justifican. El
              objetivo no es cambiar por cambiar: es mantener la eficiencia
              óptima mientras la producción evoluciona.
            </p>
          </div>
        </div>
      </section>

      {/* Cycle elements */}
      <section className="py-20 px-6 bg-ns-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ns-text mb-10">
            Qué incluye el ciclo de optimización
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CYCLE_ELEMENTS.map((c) => (
              <div
                key={c.title}
                className="rounded-xl bg-white border border-ns-border p-6"
              >
                <div className="w-6 h-0.5 bg-ns-green mb-4" />
                <h3 className="font-semibold text-ns-text mb-2">{c.title}</h3>
                <p className="text-sm text-ns-muted leading-relaxed">
                  {c.detail}
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
            Un sistema productivo que mejora con el tiempo
          </h2>
          <p className="text-lg text-ns-muted leading-relaxed">
            La optimización continua convierte la nutrición en un activo
            productivo que se adapta y mejora. No es un gasto fijo: es un ciclo
            de mejora con retorno medible.
          </p>
          <div className="mt-8">
            <Link
              href="/contacto"
              className="inline-flex justify-center items-center rounded-lg bg-ns-green px-6 py-3 text-sm font-semibold text-white hover:bg-ns-green-dark transition-colors"
            >
              Inicia el sistema completo →
            </Link>
          </div>
        </div>
      </section>

      <CTABanner
        heading="La optimización es donde está el mayor retorno"
        subtext="Hablemos de cómo estructurar un programa de mejora continua para tu operación."
      />
    </>
  );
}
