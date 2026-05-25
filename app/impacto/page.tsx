import type { Metadata } from "next";

import ImpactoPageContent from "@/components/impacto-page";

export const metadata: Metadata = {
  title: "Impacto — Soluciones nutricionales y trayectoria",
  description:
    "Productos y soluciones nutricionales de alta precisión para la industria animal. Conoce el impacto en productores y la evolución de Nutriservice desde 1993.",
};

export default function ImpactoPage() {
  return <ImpactoPageContent />;
}
