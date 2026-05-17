import type { Metadata } from "next";
import CTABanner from "@/components/cta-banner";
import CalculatorSection from "@/components/calculator-section";
import CertificationsSection from "@/components/certifications-section";
import HeroSA from "@/components/Hero_SA";
import HomeStatsSection from "@/components/home-stats-section";
import ImpactSection from "@/components/impact-section";
import MaquilaSection from "@/components/maquila-section";
import IndustriesSection from "@/components/industries-section";
import { ScrollLegend } from "@/components/scroll-legend";

export const metadata: Metadata = {
  title: "Nutriservice — Nutrición animal de alta precisión",
  description:
    "Sistema de nutrición animal que integra diagnóstico, formulación, implementación y optimización continua para mejorar productividad y reducir riesgo en producción animal.",
};

const HOME_SCROLL_LEGEND: { id: string; name: string }[] = [
  { id: "inicio", name: "Inicio" },
  { id: "certificaciones", name: "Certificaciones" },
  { id: "estadisticas", name: "Trayectoria" },
  { id: "industrias", name: "Industrias" },
  { id: "maquila", name: "Maquila" },
  { id: "impact", name: "Impact" },
  { id: "diferencia", name: "Enfoque" },
  { id: "calculadora", name: "Calculadora" },
  { id: "contacto", name: "Contacto" },
];

export default function HomePage() {
  return (
    <>
      <ScrollLegend items={HOME_SCROLL_LEGEND} />

      {/* ─── 1. HERO ─────────────────────────────────────────────── */}
      <HeroSA />

      {/* ─── 2. CERTIFICACIONES + STATS (blue band) ──────────────── */}
      <CertificationsSection />
      <HomeStatsSection />

      {/* ─── 3. INDUSTRIAS + MAQUILA ─────────────────────────────── */}
      <IndustriesSection />
      <MaquilaSection />

      {/* ─── 4. IMPACT (scroll frames / pellet) ────────────────────── */}
      <ImpactSection />

      {/* ─── 5. ENFOQUE ──────────────────────────────────────────── */}
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

      <CalculatorSection />

      {/* ─── 6. CTA FINAL ───────────────────────────────────────── */}
      <CTABanner />
    </>
  );
}
