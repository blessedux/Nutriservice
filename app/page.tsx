import type { Metadata } from "next";
import CertificationsSection from "@/components/certifications-section";
import HeroSA from "@/components/Hero_SA";
import HomeStatsSection from "@/components/home-stats-section";
import IndustriesSection from "@/components/industries-section";
import CalculatorSection from "@/components/calculator-section";
import MaquilaSection from "@/components/maquila-section";
import ProcessSection from "@/components/process-section";
import IndustriasCtaBanner from "@/components/industrias-cta-banner";
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
  { id: "proceso", name: "Proceso" },
  { id: "calculadora", name: "Calculadora" },
  { id: "contacto", name: "Contacto" },
];

export default function HomePage() {
  return (
    <>
      <ScrollLegend items={HOME_SCROLL_LEGEND} />

      <HeroSA />
      <CertificationsSection />
      <HomeStatsSection />
      <IndustriesSection />
      <MaquilaSection />
      <ProcessSection />
      <CalculatorSection />
      <IndustriasCtaBanner id="contacto" />
    </>
  );
}
