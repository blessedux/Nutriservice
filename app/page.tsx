import type { Metadata } from "next";
import CertificationsSection from "@/components/certifications-section";
import HeroSA from "@/components/Hero_SA";
import HomeStatsSection from "@/components/home-stats-section";
import IndustriesSection from "@/components/industries-section";
import MaquilaSection from "@/components/maquila-section";
import IndustriasCtaBanner from "@/components/industrias-cta-banner";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

const HOME_TITLE =
  "Nutriservice — Soluciones funcionales para una alimentación y producción responsables";
const HOME_DESCRIPTION =
  "Proveedor oficial de premezclas y núcleos a medida para la industria de nutrición animal.";

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
        url: PUBLIC_ASSETS.brand.icon512,
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
    images: [PUBLIC_ASSETS.brand.icon512],
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
