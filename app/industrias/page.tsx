import type { Metadata } from "next";

import IndustriasPageContent from "@/components/industrias-page";

export const metadata: Metadata = {
  title: "Industrias — Excelencia nutricional por segmento",
  description:
    "Soluciones biotecnológicas para acuícola, avícola, porcina y mascotas. Protocolos específicos por vertical con infraestructura de I+D y trazabilidad total.",
};

export default function IndustriasPage() {
  return <IndustriasPageContent />;
}
