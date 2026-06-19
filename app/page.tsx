import type { Metadata } from "next";
import CertificationsSection from "@/components/certifications-section";
import HeroSA from "@/components/Hero_SA";
import HomeStatsSection from "@/components/home-stats-section";
import IndustriesSection from "@/components/industries-section";
import MaquilaSection from "@/components/maquila-section";
import IndustriasCtaBanner from "@/components/industrias-cta-banner";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

const HOME_TITLE = "Nutriservice — Inteligencia Nutricional Industrial";
const HOME_DESCRIPTION =
  "30+ años al servicio de la nutrición funcional animal en Chile. Soluciones funcionales para una alimentación y producción responsables.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    type: "website",
    locale: "es_CL",
    siteName: "Nutriservice",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Nutriservice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/icon.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSA />
      <CertificationsSection />
      <HomeStatsSection />
      <IndustriesSection />
      <MaquilaSection />
      <IndustriasCtaBanner id="contacto" />
    </>
  );
}
