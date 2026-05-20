import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTABanner from "@/components/cta-banner";
import ImpactSection from "@/components/impact-section";

export const metadata: Metadata = {
  title: "Soluciones — Sistema de optimización productiva",
  description:
    "Diagnóstico, formulación, implementación y optimización continua. El sistema de 4 pasos que convierte la nutrición animal en una ventaja competitiva medible.",
};

const STEPS = [
  {
    n: "01",
    title: "Diagnóstico",
    slug: "diagnostico",
    tagline: "Identificamos dónde está el margen de mejora.",
    problem:
      "Sin diagnóstico, la formulación parte de supuestos. Los supuestos generan variabilidad.",
    solution:
      "Analizamos materias primas disponibles, condiciones productivas reales y resultados históricos para establecer la línea base exacta.",
    result:
      "Una foto precisa del sistema actual y los puntos específicos donde se está perdiendo eficiencia.",
  },
  {
    n: "02",
    title: "Formulación",
    slug: "formulacion",
    tagline: "La fórmula precisa para tu contexto, no para el promedio.",
    problem:
      "Las fórmulas genéricas no consideran las variaciones locales de materias primas ni las condiciones específicas de tu operación.",
    solution:
      "Desarrollamos la formulación con los datos del diagnóstico: tipo de insumos disponibles, fase productiva, especie y objetivo de rendimiento.",
    result:
      "Una fórmula verificada que maximiza conversión y estabilidad usando lo que tienes disponible.",
  },
  {
    n: "03",
    title: "Implementación",
    slug: "implementacion",
    tagline: "Acompañamiento técnico, no entrega de bulto.",
    problem:
      "El mejor producto mal implementado no da los resultados esperados. La transición es un punto de riesgo.",
    solution:
      "Presencia técnica en terreno durante la implementación. Resolvemos las variables en tiempo real, no desde la oficina.",
    result:
      "Una transición controlada, con los ajustes necesarios antes de que el error se acumule.",
  },
  {
    n: "04",
    title: "Optimización continua",
    slug: "optimizacion",
    tagline: "La producción cambia. La nutrición se adapta.",
    problem:
      "Un programa nutricional fijo pierde efectividad cuando cambian las materias primas, la estación o las condiciones sanitarias.",
    solution:
      "Revisamos resultados con datos reales de cada ciclo y ajustamos la formulación antes de que la variabilidad impacte la producción.",
    result:
      "Mejora acumulada lote a lote. Reducción de riesgo ante cambios de proveedores o condiciones.",
  },
];

const INTEGRATION_POINTS = [
  {
    label: "Producto",
    detail: "Formulación precisa para cada especie, etapa y contexto productivo.",
  },
  {
    label: "Servicio",
    detail: "Soporte técnico en terreno durante implementación y seguimiento.",
  },
  {
    label: "Análisis",
    detail: "Laboratorio propio con NIR para verificación de cada lote de MP.",
  },
  {
    label: "Datos",
    detail:
      "Resultados documentados por ciclo para tomar decisiones con evidencia.",
  },
];

export default function SolucionesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative -mt-24 min-h-[100dvh] scroll-mt-24 overflow-hidden text-white">
        <Image
          src="/nutriservice_workers2.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ns-dark via-ns-dark/80 to-ns-dark/35"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ns-dark/85 via-ns-dark/50 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-4xl flex-col justify-end px-6 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-36 lg:px-12 lg:pb-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-4">
            Soluciones
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5 max-w-3xl">
            Un sistema diseñado para resultados productivos reales
          </h1>
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
            No vendemos suplementos. Integramos diagnóstico, formulación
            precisa, implementación acompañada y optimización continua en un
            modelo que convierte la nutrición en una ventaja competitiva.
          </p>
        </div>
      </section>

      {/* Integration model */}
      <section className="bg-ns-surface py-16 px-6 border-b border-ns-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold text-ns-muted mb-6 text-center">
            La integración que hace la diferencia
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INTEGRATION_POINTS.map((ip) => (
              <div
                key={ip.label}
                className="rounded-xl bg-white border border-ns-border p-5 text-center"
              >
                <p className="text-sm font-bold text-ns-text mb-2">
                  {ip.label}
                </p>
                <p className="text-xs text-ns-muted leading-relaxed">
                  {ip.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ImpactSection withCover={false} />

      {/* 4-step system detail */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              El sistema
            </p>
            <h2 className="text-3xl font-bold text-ns-text">
              4 pasos. Un resultado continuo.
            </h2>
          </div>
          <div className="space-y-6">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-ns-border bg-ns-surface p-8 grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_1fr_160px] gap-6 items-start"
              >
                <p className="text-4xl font-bold text-ns-surface-alt leading-none">
                  {s.n}
                </p>
                <div>
                  <h3 className="font-bold text-ns-text text-lg mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-ns-muted">{s.tagline}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ns-muted mb-1.5">
                    Problema
                  </p>
                  <p className="text-sm text-ns-muted leading-relaxed">
                    {s.problem}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ns-muted mb-1.5">
                    Resultado
                  </p>
                  <p className="text-sm text-ns-muted leading-relaxed">
                    {s.result}
                  </p>
                </div>
                <div className="flex items-start">
                  <Link
                    href={`/soluciones/${s.slug}`}
                    className="inline-flex items-center rounded-lg bg-ns-green px-4 py-2 text-sm font-semibold text-white hover:bg-ns-green-dark transition-colors"
                  >
                    Ver en detalle →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        heading="Listo para conocer tu margen de mejora productivo"
        subtext="Agenda una evaluación técnica y revisamos juntos en qué etapa está el mayor potencial de optimización."
      />
    </>
  );
}
