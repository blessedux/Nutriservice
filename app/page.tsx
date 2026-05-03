import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/cta-banner";
import { industryList } from "@/lib/industries";

export const metadata: Metadata = {
  title: "Nutriservice — Nutrición animal de alta precisión",
  description:
    "Sistema de nutrición animal que integra diagnóstico, formulación, implementación y optimización continua para mejorar productividad y reducir riesgo en producción animal.",
};

const TRUST_STATS = [
  { value: "+30", label: "años de experiencia" },
  { value: "4", label: "industrias atendidas" },
  { value: "GMP", label: "planta certificada" },
  { value: "NIR", label: "análisis propio" },
];

const PROBLEMS = [
  {
    title: "Baja conversión alimenticia",
    detail:
      "Cada punto de FCR por encima del óptimo es costo acumulado que pocas operaciones cuantifican con precisión.",
  },
  {
    title: "Variabilidad en materias primas",
    detail:
      "Un cambio de proveedor sin ajuste de formulación es variabilidad directa en resultados productivos.",
  },
  {
    title: "Riesgo sanitario",
    detail:
      "La mala nutrición no solo reduce producción: compromete inmunidad, aumenta mortalidad y eleva gasto veterinario.",
  },
  {
    title: "Presión por eficiencia",
    detail:
      "Los mercados de exportación no perdonan variabilidad ni sobrecosto. El margen es cada vez más ajustado.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Diagnóstico",
    detail:
      "Analizamos materias primas, condiciones productivas y objetivos de rendimiento para identificar dónde está el margen de mejora.",
  },
  {
    n: "02",
    title: "Formulación",
    detail:
      "Desarrollamos la fórmula precisa para tu contexto específico, no para el promedio del mercado.",
  },
  {
    n: "03",
    title: "Implementación",
    detail:
      "Acompañamos la aplicación con soporte técnico en terreno. No entregamos un producto y nos vamos.",
  },
  {
    n: "04",
    title: "Optimización continua",
    detail:
      "Medimos, ajustamos y mejoramos con datos reales. La nutrición se adapta cuando la producción cambia.",
  },
];

const SERVICES = [
  {
    function: "Análisis de materias primas",
    impact:
      "Elimina supuestos. Cada lote se verifica antes de usarse, reduciendo el riesgo de variabilidad silenciosa.",
  },
  {
    function: "Formulación de precisión",
    impact:
      "Cada fórmula está diseñada para tu operación. Mejor conversión, costo controlado, resultados predecibles.",
  },
  {
    function: "Soporte técnico continuo",
    impact:
      "No entregamos un producto. Acompañamos tu resultado con presencia técnica cuando la necesitas.",
  },
  {
    function: "Monitoreo y ajuste",
    impact:
      "La producción cambia. La nutrición se ajusta con ella, lote a lote, sin tener que empezar desde cero.",
  },
];

const RESULTS = [
  {
    metric: "Mejora en conversión",
    detail: "Reducción de costo de alimentación por kilo producido.",
  },
  {
    metric: "Menor mortalidad",
    detail:
      "Nutrición que refuerza inmunidad reduce intervenciones y pérdidas.",
  },
  {
    metric: "Estabilidad lote a lote",
    detail: "Resultados consistentes aunque cambien las materias primas.",
  },
  {
    metric: "Menor gasto veterinario",
    detail: "Menos enfermedades de origen nutricional, menos intervenciones.",
  },
];

const TECH_ITEMS = [
  {
    label: "Laboratorio propio",
    description: "Análisis en tiempo real sin depender de terceros.",
  },
  {
    label: "Tecnología NIR",
    description: "Caracterización instantánea de ingredientes por lote.",
  },
  {
    label: "I+D aplicada",
    description: "Investigación orientada a resultados, no a publicaciones.",
  },
  {
    label: "Planta GMP",
    description: "Infraestructura certificada para producción trazable.",
  },
];

const INDUSTRY_ICONS: Record<string, string> = {
  acuicola: "🐟",
  avicola: "🐓",
  porcina: "🐷",
  mascotas: "🐾",
};

const HERO_VIDEO_SRC =
  "https://ik.imagekit.io/3bfeucft4/DNA_Helix_Animation_On_Light_Blue_Background_3d_Render_preview_3613613.mp4";

export default function HomePage() {
  return (
    <>
      {/* ─── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-ns-dark text-white min-h-[calc(100dvh-4rem)] flex flex-col justify-center px-6 py-12 sm:py-16">
        <div className="absolute inset-0 z-0 bg-ns-dark" aria-hidden />
        <video
          className="absolute inset-0 z-[1] h-full w-full object-cover motion-reduce:opacity-0"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-ns-dark/93 via-ns-dark/80 to-ns-dark/90"
          aria-hidden
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-6">
            Nutrición animal · Chile · desde 1993
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.08] mb-7 text-balance">
            Rendimiento medible en{" "}
            <span className="text-ns-emerald">nutrición animal</span>.
          </h1>
          <p className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl mx-auto mb-10">
            Diagnóstico, formulación y soporte continuo para operaciones que
            necesitan resultados estables, lote a lote.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex justify-center items-center rounded-lg bg-ns-green px-7 py-3.5 text-sm font-semibold text-white hover:bg-ns-green-light transition-colors"
            >
              Agendar evaluación técnica
            </Link>
            <Link
              href="#sistema"
              className="inline-flex justify-center items-center rounded-lg border border-white/25 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Ver el sistema ↓
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 2. PRUEBA SOCIAL ─────────────────────────────────────── */}
      <section className="bg-ns-surface border-b border-ns-border py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {TRUST_STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-ns-green">{s.value}</p>
                <p className="text-sm text-ns-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. PROBLEMA ─────────────────────────────────────────── */}
      <section id="problema" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              El problema
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ns-text leading-tight">
              El costo de la variabilidad productiva
            </h2>
            <p className="mt-4 text-lg text-ns-muted leading-relaxed">
              Los problemas productivos en nutrición animal rara vez son
              visibles de inmediato. Se acumulan lote a lote hasta que el costo
              ya no puede ignorarse.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-ns-border bg-ns-surface p-6"
              >
                <div className="w-8 h-1 bg-ns-green rounded mb-4" />
                <h3 className="font-semibold text-ns-text mb-2">{p.title}</h3>
                <p className="text-sm text-ns-muted leading-relaxed">
                  {p.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. REFRAME ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-ns-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-5">
            Una diferencia que importa
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
            Nutriservice no es un proveedor.
            <br />
            Es un sistema de optimización productiva.
          </h2>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mx-auto">
            La mayoría de las empresas de nutrición animal entrega un producto y
            se va. Nutriservice integra diagnóstico, formulación, implementación
            y soporte continuo en un modelo de trabajo que convierte la
            alimentación en una ventaja competitiva medible.
          </p>
          <div className="mt-10 inline-block rounded-xl border border-white/15 px-8 py-5">
            <p className="text-sm text-white/50 mb-1">Nuestro enfoque</p>
            <p className="text-white font-semibold">
              Producto + Servicio + Análisis + Optimización continua
            </p>
          </div>
        </div>
      </section>

      {/* ─── 5. SISTEMA ──────────────────────────────────────────── */}
      <section id="sistema" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              Cómo trabajamos
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ns-text leading-tight">
              Un sistema de 4 pasos diseñado para resultados medibles
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col">
                <p className="text-5xl font-bold text-ns-emerald/30 mb-4 leading-none">
                  {s.n}
                </p>
                <h3 className="text-lg font-bold text-ns-text mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-ns-muted leading-relaxed flex-1">
                  {s.detail}
                </p>
                <Link
                  href={`/soluciones/${s.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}`}
                  className="mt-4 text-xs font-semibold text-ns-green hover:underline"
                >
                  Ver detalle →
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/soluciones"
              className="inline-flex items-center text-sm font-semibold text-ns-green hover:underline"
            >
              Ver el sistema completo →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 6. SERVICIOS TRADUCIDOS ─────────────────────────────── */}
      <section className="py-24 px-6 bg-ns-surface">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              Capacidades
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ns-text leading-tight">
              Lo que hacemos, traducido a impacto productivo
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((sv) => (
              <div
                key={sv.function}
                className="rounded-xl bg-white border border-ns-border p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-ns-muted mb-2">
                  {sv.function}
                </p>
                <p className="text-ns-text font-medium leading-relaxed">
                  {sv.impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. INDUSTRIAS ───────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              Industrias
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ns-text leading-tight">
              Soluciones específicas para cada industria
            </h2>
            <p className="mt-4 text-lg text-ns-muted">
              Cada industria tiene sus propios desafíos. Adaptamos el sistema a
              las variables de tu producción.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {industryList.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industrias/${ind.slug}`}
                className="group rounded-xl border border-ns-border bg-ns-surface hover:border-ns-green hover:bg-white transition-colors p-6 flex flex-col"
              >
                <p className="text-3xl mb-3">{INDUSTRY_ICONS[ind.slug]}</p>
                <h3 className="font-bold text-ns-text group-hover:text-ns-green transition-colors mb-2">
                  {ind.name}
                </h3>
                <p className="text-sm text-ns-muted leading-relaxed flex-1">
                  {ind.tagline}
                </p>
                <p className="mt-4 text-xs font-semibold text-ns-green">
                  Ver industria →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. TECNOLOGÍA ───────────────────────────────────────── */}
      <section className="py-24 px-6 bg-ns-dark text-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              Infraestructura técnica
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              La ciencia que respalda cada fórmula
            </h2>
            <p className="mt-4 text-lg text-white/60 leading-relaxed">
              No formulamos desde una oficina. Tenemos la infraestructura para
              analizar, desarrollar y validar antes de que llegue a tu
              producción.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TECH_ITEMS.map((t) => (
              <div
                key={t.label}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <div className="w-8 h-0.5 bg-ns-emerald mb-4" />
                <h3 className="font-semibold text-white mb-2">{t.label}</h3>
                <p className="text-sm text-white/55 leading-relaxed">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/tecnologia"
              className="inline-flex items-center text-sm font-semibold text-ns-emerald hover:underline"
            >
              Conoce la infraestructura técnica →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 9. RESULTADOS ───────────────────────────────────────── */}
      <section id="resultados" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-3">
              Resultados
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ns-text leading-tight">
              Lo que cambia cuando la nutrición funciona bien
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RESULTS.map((r) => (
              <div key={r.metric} className="border-t-2 border-ns-green pt-5">
                <h3 className="font-bold text-ns-text mb-2">{r.metric}</h3>
                <p className="text-sm text-ns-muted leading-relaxed">
                  {r.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. CTA FINAL ───────────────────────────────────────── */}
      <CTABanner />
    </>
  );
}
