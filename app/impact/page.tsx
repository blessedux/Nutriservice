import type { Metadata } from "next";

import { SitePlaceholderPage } from "@/components/site-placeholder-page";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "Impacto medible en rendimiento productivo — resultados y evidencia.",
};

export default function ImpactPage() {
  return (
    <SitePlaceholderPage
      title="Impact"
      description="Impacto y resultados en producción. Contenido en construcción."
    />
  );
}
