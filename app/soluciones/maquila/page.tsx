import type { Metadata } from "next";

import CtaFooterParallax from "@/components/cta-footer-parallax";
import { HOME_INDUSTRIES_BG } from "@/components/home-blue-band";
import IndustriasCtaBanner from "@/components/industrias-cta-banner";
import MaquilaPageLayout from "@/components/maquila-page-layout";

export const metadata: Metadata = {
  title: "Maquila — Premixes y núcleos a medida",
  description:
    "Producción a terceros con confidencialidad, calidad y respaldo técnico. Premezclas y soluciones nutricionales con trazabilidad, procesos GMP y REP.",
};

export default function MaquilaPage() {
  return (
    <div style={{ backgroundColor: HOME_INDUSTRIES_BG }}>
      <MaquilaPageLayout />
      <CtaFooterParallax>
        <IndustriasCtaBanner id="contacto" />
      </CtaFooterParallax>
    </div>
  );
}
