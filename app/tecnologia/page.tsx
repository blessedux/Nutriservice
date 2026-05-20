import type { Metadata } from "next";

import { SitePlaceholderPage } from "@/components/site-placeholder-page";

export const metadata: Metadata = {
  title: "I+D",
  description:
    "Investigación y desarrollo aplicado — laboratorio de nutrición industrial.",
};

export default function TecnologiaPage() {
  return (
    <SitePlaceholderPage
      title="I+D"
      description="Investigación y desarrollo aplicado. Contenido en construcción."
    />
  );
}
