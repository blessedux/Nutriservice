import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Tecnología — La infraestructura que respalda cada fórmula",
  description:
    "Laboratorio propio, análisis NIR, I+D aplicada y planta GMP certificada. La infraestructura técnica que hace posible la nutrición de precisión.",
};

const CAPABILITIES = [
  {
    label: "Laboratorio propio",
    id: "laboratorio",
    description:
      "Contamos con laboratorio de análisis interno que permite verificar materias primas, productos en proceso y fórmulas terminadas sin depender de terceros ni de tiempos de respuesta externos.",
    detail: [
      "Análisis bromatológico de materias primas por lote",
      "Verificación de producto terminado",
      "Trazabilidad de cada análisis realizado",
      "Respuesta rápida para toma de decisiones productivas",
    ],
    impact:
      "Cada recomendación está respaldada por datos analíticos propios, no por valores declarados o promedios de referencia.",
  },
  {
    label: "Tecnología NIR",
    id: "nir",
    description:
      "La espectroscopía de infrarrojo cercano (NIR) permite la caracterización instantánea y no destructiva de ingredientes: humedad, proteína, grasa, fibra y otros parámetros en minutos.",
    detail: [
      "Análisis instantáneo sin destrucción de muestra",
      "Caracterización nutricional completa por lote",
      "Detección de variabilidad entre proveedores",
      "Base de datos histórica de materias primas",
    ],
    impact:
      "La variabilidad de las materias primas se detecta antes de formular, no después de ver los resultados productivos.",
  },
  {
    label: "I+D aplicada",
    id: "id",
    description:
      "Nuestro equipo de investigación y desarrollo trabaja en problemas productivos reales, no en investigación básica. El foco es aplicar conocimiento técnico actualizado a las condiciones de producción de nuestros clientes.",
    detail: [
      "Evaluaciones de nuevos ingredientes funcionales",
      "Optimización de fórmulas ante restricciones de insumos",
      "Seguimiento de evidencia científica aplicable",
      "Desarrollo de soluciones para problemas productivos específicos",
    ],
    impact:
      "Las fórmulas que recomendamos incorporan avances técnicos relevantes, no solo el estado del arte de hace 10 años.",
  },
  {
    label: "Planta GMP",
    id: "gmp",
    description:
      "Nuestra planta de producción opera bajo estándares GMP (Good Manufacturing Practices), garantizando que cada producto fabricado cumple con los criterios de calidad, inocuidad y trazabilidad establecidos.",
    detail: [
      "Producción bajo estándares internacionales de calidad",
      "Trazabilidad completa de cada lote producido",
      "Control de calidad en proceso y producto terminado",
      "Documentación disponible para auditorías de clientes y certificaciones",
    ],
    impact:
      "La calidad del producto no es declarativa: está respaldada por un sistema de gestión auditado.",
  },
];

export default function TecnologiaPage() {
  return (
    <>
      <section className="bg-ns-dark text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-4">
            Tecnología
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            La infraestructura que respalda cada fórmula
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
            No formulamos desde una oficina. Tenemos la infraestructura para
            analizar, desarrollar y validar cada recomendación antes de que
            llegue a tu producción.
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <section className="bg-ns-surface border-b border-ns-border py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4">
          {CAPABILITIES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="text-sm font-medium text-ns-muted hover:text-ns-text transition-colors border border-ns-border rounded-lg px-4 py-2 bg-white hover:border-ns-green"
            >
              {c.label}
            </a>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      {CAPABILITIES.map((c, i) => (
        <section
          key={c.id}
          id={c.id}
          className={`py-20 px-6 ${i % 2 === 0 ? "bg-white" : "bg-ns-surface"}`}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
                {c.label}
              </p>
              <h2 className="text-2xl font-bold text-ns-text mb-4">{c.label}</h2>
              <p className="text-ns-muted leading-relaxed mb-6">
                {c.description}
              </p>
              <ul className="space-y-2">
                {c.detail.map((d) => (
                  <li key={d} className="flex gap-2 text-sm text-ns-muted">
                    <span className="text-ns-green flex-shrink-0 mt-0.5">—</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-start">
              <div className="w-full rounded-xl bg-ns-dark text-white p-7 border border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wider text-ns-emerald mb-3">
                  Impacto productivo
                </p>
                <p className="text-white/80 leading-relaxed">{c.impact}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Link to soluciones */}
      <section className="py-16 px-6 bg-ns-surface border-t border-ns-border">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-ns-muted mb-4">
            La tecnología es la base. El sistema es cómo la aplicamos a tu
            operación.
          </p>
          <Link
            href="/soluciones"
            className="inline-flex items-center text-sm font-semibold text-ns-green hover:underline"
          >
            Conoce el sistema completo →
          </Link>
        </div>
      </section>

      <CTABanner
        heading="La tecnología está. El siguiente paso es aplicarla a tu producción."
        subtext="Agenda una evaluación técnica y te mostramos cómo nuestra infraestructura reduce el riesgo en tu operación."
      />
    </>
  );
}
