import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Nosotros — Nutriservice desde 1993",
  description:
    "Fundada en 1993, Nutriservice ha evolucionado de empresa de nutrición a sistema de optimización productiva. 30 años construyendo resultados en producción animal.",
};

const MILESTONES = [
  {
    year: "1993",
    title: "Fundación",
    detail:
      "Nutriservice nace en Chile con el objetivo de mejorar la nutrición animal en la industria productiva nacional.",
  },
  {
    year: "2000s",
    title: "Expansión técnica",
    detail:
      "Incorporación de laboratorio propio y desarrollo de capacidades analíticas internas. El servicio deja de ser solo producto.",
  },
  {
    year: "2010s",
    title: "Precisión como diferenciador",
    detail:
      "Incorporación de tecnología NIR y desarrollo de sistema de formulación de precisión adaptada a condiciones locales.",
  },
  {
    year: "Hoy",
    title: "Sistema de optimización",
    detail:
      "Nutriservice opera como un sistema integrado de diagnóstico, formulación, implementación y mejora continua para productores que buscan resultados medibles.",
  },
];

const VALUES = [
  {
    title: "Rigor técnico",
    detail:
      "Las recomendaciones se basan en datos, no en intuición. Analizamos antes de formular, medimos antes de afirmar.",
  },
  {
    title: "Eficiencia como resultado",
    detail:
      "No buscamos que el cliente compre más. Buscamos que produzca mejor. El resultado productivo es la métrica que importa.",
  },
  {
    title: "Cercanía técnica",
    detail:
      "Estamos presentes cuando el resultado se juega. El soporte no es remoto: es presencia en terreno cuando se necesita.",
  },
  {
    title: "Relaciones de largo plazo",
    detail:
      "Trabajamos con productores en un modelo de mejora continua, no de transacción puntual. El conocimiento acumulado es parte del valor.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <section className="bg-ns-dark text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-4">
            Nosotros
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Tres décadas construyendo resultados en producción animal
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
            Fundada en 1993, Nutriservice ha evolucionado desde empresa de
            nutrición a sistema de optimización productiva. El foco siempre fue
            el mismo: resultados reales en la producción de nuestros clientes.
          </p>
        </div>
      </section>

      {/* Origin */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              El por qué
            </p>
            <h2 className="text-2xl font-bold text-ns-text mb-4">
              La producción no debería depender de la incertidumbre
            </h2>
            <p className="text-ns-muted leading-relaxed">
              Desde el origen, la convicción de Nutriservice fue que la
              variabilidad productiva en nutrición animal tiene solución
              técnica. No basta con un buen producto: se requiere diagnóstico
              preciso, formulación adaptada y soporte continuo para que el
              resultado sea predecible.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              La evolución
            </p>
            <h2 className="text-2xl font-bold text-ns-text mb-4">
              De empresa de nutrición a sistema de optimización
            </h2>
            <p className="text-ns-muted leading-relaxed">
              Con el tiempo, desarrollamos la infraestructura técnica, los
              procesos analíticos y el modelo de soporte que nos permiten operar
              como un partner estratégico, no como un proveedor. La distinción
              no es semántica: define cómo trabajamos.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-ns-surface">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
            Historia
          </p>
          <h2 className="text-2xl font-bold text-ns-text mb-10">
            Evolución técnica continua
          </h2>
          <div className="space-y-1">
            {MILESTONES.map((m, i) => (
              <div
                key={m.year}
                className="flex gap-5 rounded-xl bg-white border border-ns-border p-6"
              >
                <div className="flex-shrink-0 w-16">
                  <p className="text-sm font-bold text-ns-green">{m.year}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-ns-text mb-1">
                    {m.title}
                  </h3>
                  <p className="text-sm text-ns-muted leading-relaxed">
                    {m.detail}
                  </p>
                </div>
                {i < MILESTONES.length - 1 && (
                  <div className="absolute left-0 w-px" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
            Valores
          </p>
          <h2 className="text-2xl font-bold text-ns-text mb-10">
            Lo que guía cómo trabajamos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-ns-border bg-ns-surface p-6"
              >
                <div className="w-6 h-0.5 bg-ns-green mb-4" />
                <h3 className="font-semibold text-ns-text mb-2">{v.title}</h3>
                <p className="text-sm text-ns-muted leading-relaxed">
                  {v.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries operated in */}
      <section className="py-16 px-6 bg-ns-surface border-y border-ns-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-ns-muted text-sm">
            Operamos en las principales industrias de producción animal en
            Chile:
          </p>
          <div className="flex flex-wrap gap-3">
            {["Acuícola", "Avícola", "Porcina", "Mascotas"].map((ind) => (
              <span
                key={ind}
                className="rounded-full border border-ns-border bg-white px-4 py-1.5 text-sm font-medium text-ns-text"
              >
                {ind}
              </span>
            ))}
          </div>
          <Link
            href="/industrias"
            className="text-sm font-semibold text-ns-green hover:underline flex-shrink-0"
          >
            Ver industrias →
          </Link>
        </div>
      </section>

      <CTABanner
        heading="30 años construyendo resultados productivos reales"
        subtext="Conoce cómo Nutriservice puede ser un partner estratégico para tu operación."
        primaryLabel="Hablemos"
      />
    </>
  );
}
