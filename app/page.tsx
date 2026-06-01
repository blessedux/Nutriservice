import type { Metadata } from "next";
import CertificationsSection from "@/components/certifications-section";
import HeroSA from "@/components/Hero_SA";
import HomeStatsSection from "@/components/home-stats-section";
import IndustriesSection from "@/components/industries-section";
import MaquilaSection from "@/components/maquila-section";
import ProcessSection from "@/components/process-section";
import IndustriasCtaBanner from "@/components/industrias-cta-banner";

export const metadata: Metadata = {
  title: "Nutriservice — Nutrición animal de alta precisión",
  description:
    "Sistema de nutrición animal que integra diagnóstico, formulación, implementación y optimización continua para mejorar productividad y reducir riesgo en producción animal.",
};

export default function HomePage() {
  return (
    <>
      <HeroSA />
      <CertificationsSection />
      <HomeStatsSection />
      <IndustriesSection />
      <MaquilaSection />
      <ProcessSection />
      <IndustriasCtaBanner id="contacto" />
    </>
  );
}
