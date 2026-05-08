import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/cta-banner";
import HeroSA from "@/components/Hero_SA";
import ScrollFramePlayer from "@/components/scroll-frame-player";
import MacroGardCover from "@/components/macrogard-cover";
import IndustriesSection from "@/components/industries-section";
import ProblemSection, {
  ProblemTrustStatsBar,
} from "@/components/problem-section";
import { ScrollLegend } from "@/components/scroll-legend";
import { HOMEPAGE_PELLET_FRAMES } from "@/lib/scroll-frame-preload";

export const metadata: Metadata = {
  title: "Nutriservice — Nutrición animal de alta precisión",
  description:
    "Sistema de nutrición animal que integra diagnóstico, formulación, implementación y optimización continua para mejorar productividad y reducir riesgo en producción animal.",
};

const PROBLEM_HEADLINE = "El costo de la variabilidad productiva";

const PROBLEM_INTRO_BULLETS = [
  {
    text: "Los impactos son lentos de observar y se acumulan lote a lote.",
  },
  {
    text: "Cuando el costo aparece en libros, ya lleva meses construyéndose.",
  },
];

const PROBLEMS = [
  {
    title: "Baja conversión alimenticia",
    metric: "~70%",
    metricCaption: "insumos / costo productivo",
    trend: "FCR vs. curva",
    trendTone: "amber" as const,
    sparkPattern: [0.35, 0.72, 0.48, 0.91, 0.62, 0.84, 0.55],
    detail:
      "Cada punto de FCR por encima del óptimo es costo acumulado que pocas operaciones cuantifican con precisión.",
  },
  {
    title: "Variabilidad en materias primas",
    metric: "σ alto",
    metricCaption: "lote ↔ lote",
    trend: "σ sin reformulación",
    trendTone: "rose" as const,
    sparkPattern: [0.55, 0.38, 0.82, 0.44, 0.76, 0.52, 0.68],
    detail:
      "Un cambio de proveedor sin ajuste de formulación es variabilidad directa en resultados productivos.",
  },
  {
    title: "Riesgo sanitario",
    metric: "+Δ",
    metricCaption: "morbilidad asociada",
    trend: "Morb. / nutrición",
    trendTone: "rose" as const,
    sparkPattern: [0.42, 0.58, 0.5, 0.66, 0.54, 0.78, 0.71],
    detail:
      "La mala nutrición no solo reduce producción: compromete inmunidad, aumenta mortalidad y eleva gasto veterinario.",
  },
  {
    title: "Presión por eficiencia",
    metric: "<5pp",
    metricCaption: "margen típico export",
    trend: "Sensib. variación",
    trendTone: "amber" as const,
    sparkPattern: [0.68, 0.72, 0.65, 0.74, 0.7, 0.69, 0.73],
    detail:
      "Los mercados de exportación no perdonan variabilidad ni sobrecosto. El margen es cada vez más ajustado.",
  },
];

const PROBLEM_REVEAL_PANEL = (
  <article className="rounded-2xl border border-white/18 bg-white/[0.07] p-7 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300/95">
      Del reconocimiento al margen
    </p>
    <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">
      Convertimos el diagnóstico en formulación operativa
    </h3>
    <p className="mt-4 text-sm leading-relaxed text-white/78 sm:text-[15px]">
      Nutriservice cierra el ciclo: materias primas caracterizadas, formulación
      por contexto y seguimiento en campo para que la variabilidad deje de ser un
      costo oculto y pase a ser algo que podés medir y corregir lote a lote.
    </p>
    <ul className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-left text-sm text-white/72">
      <li className="flex gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
        Laboratorio y NIR para decisiones con datos, no con supuestos.
      </li>
      <li className="flex gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
        Formulación ajustada a tu operación y a la disponibilidad real de insumos.
      </li>
      <li className="flex gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
        Optimización continua cuando cambian lotes, clima o mercados.
      </li>
    </ul>
  </article>
);

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

const HOME_SCROLL_LEGEND: { id: string; name: string }[] = [
  { id: "inicio", name: "Inicio" },
  { id: "problema", name: "El problema" },
  { id: "calculadora", name: "Ciencia en acción" },
  { id: "diferencia", name: "Enfoque" },
  { id: "sistema", name: "Sistema" },
  { id: "capacidades", name: "Capacidades" },
  { id: "industrias", name: "Industrias" },
  { id: "tecnologia", name: "Tecnología" },
  { id: "resultados", name: "Resultados" },
  { id: "contacto", name: "Contacto" },
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

export default function HomePage() {
  return (
    <>
      <ScrollLegend items={HOME_SCROLL_LEGEND} />

      {/* ─── 1. HERO ─────────────────────────────────────────────── */}
      <HeroSA />

      {/* ─── 2. PROBLEMA (pin + KPI → reveal) ───────────────────── */}
      <ProblemSection
        eyebrow="El problema"
        headline={PROBLEM_HEADLINE}
        introBullets={PROBLEM_INTRO_BULLETS}
        problems={PROBLEMS}
        pinnedViewportVh={1}
        pinnedTransitionScrollVh={0.42}
        revealPanel={PROBLEM_REVEAL_PANEL}
        bottomStats={<ProblemTrustStatsBar />}
      />

      {/* ─── 3. CIENCIA EN ACCIÓN (scroll frames) ───────────────── */}
      <section id="calculadora" className="scroll-mt-24 bg-white">
        <ScrollFramePlayer
          {...HOMEPAGE_PELLET_FRAMES}
          trackVh={5}
          debugGrid={false}
          debugGridCols={12}
          debugGridRows={8}
          annotations={[
            {
              start: 0.16,
              row: 3,
              col: 2,
              text: "7 aminoacidos esenciales",
              vectorSrc: "/frames_pellet-explosion_webp/vector1.svg",
              vectorOffset: { xPct: 200 },
              vectorAnchor: "center",
              vectorTransform: "fixed",
              vectorScale: 2,
              vectorRotateDeg: 10,
            },
            {
              start: 0.3,
              row: 5,
              col: 3,
              text: "omega-3 and essentiala fatty acids",
              vectorSrc: "/frames_pellet-explosion_webp/vector2.svg",
              vectorRotateDeg: 200,
              vectorOffset: { xPct: 190, yPct: -100 },
            },
            {
              start: 0.45,
              row: 2,
              col: 11,
              text: "antioxidants and prebiotics",
              vectorSrc: "/frames_pellet-explosion_webp/vector3.svg",
              vectorOffset: { xPct: -200, yPct: -100 },
              vectorAnchor: "center",
              vectorTransform: "fixed",
              vectorScale: 2,
              vectorRotateDeg: -20,
            },
            {
              start: 0.6,
              row: 6,
              col: 10,
              text: "Multivtaimins supplied in chelated form to improve bioavailability.",
              vectorSrc: "/frames_pellet-explosion_webp/vector3.svg",
              vectorOffset: { xPct: -120, yPct: 100 },
              vectorAnchor: "center",
              vectorTransform: "fixed",
              vectorScale: 1.2,
              vectorRotateDeg: 10,
            },
          ]}
          titles={[
            {
              start: 0.1,
              end: 0.25,
              text: "Mucho mas que un pellet.",
              placement: "top-left",
              style: {
                fontFamily: '"Test Söhne Schmal", ui-sans-serif, system-ui',
                fontSize: "60px",
                marginLeft: "60px",
                mixBlendMode: "difference",
              },
            },
            {
              start: 0.35,
              end: 0.5,
              text: "Todos los nutrientes necesarios para lechones sanos y una producccion optima.",
              placement: "bottom-right",
              style: {
                fontFamily: '"Test Söhne Schmal", ui-sans-serif, system-ui',
                fontSize: "60px",
                marginRight: "60px",
                marginBottom: "48px",
                mixBlendMode: "difference",
              },
            },
            {
              start: 0.6,
              text: "Formulaciones certificadas y probadas en nuestro laboratorio.",
              style: {
                fontFamily: '"Test Söhne Schmal", ui-sans-serif, system-ui',
                fontSize: "60px",
                mixBlendMode: "difference",
                marginBottom: "48px",
              },
            },
          ]}
          cover={<MacroGardCover />}
        />
      </section>

      {/* ─── 4. REFRAME ──────────────────────────────────────────── */}
      <section
        id="diferencia"
        className="scroll-mt-24 bg-ns-dark px-6 py-24 text-white"
      >
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
      <section id="sistema" className="scroll-mt-24 bg-white px-6 py-24">
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
      <section
        id="capacidades"
        className="scroll-mt-24 bg-ns-surface px-6 py-24"
      >
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

      {/* ─── 7. INDUSTRIAS (Figma: verticales) ───────────────────── */}
      <IndustriesSection />

      {/* ─── 8. TECNOLOGÍA ───────────────────────────────────────── */}
      <section
        id="tecnologia"
        className="scroll-mt-24 bg-ns-dark px-6 py-24 text-white"
      >
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
      <section id="resultados" className="scroll-mt-24 bg-white px-6 py-24">
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
