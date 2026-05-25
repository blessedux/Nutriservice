import type { ProductoDivisionSlug } from "@/lib/productos-divisions";

export const INDUSTRY_PRODUCT_DIVISION: Record<string, ProductoDivisionSlug> = {
  acuicola: "acuicola",
  avicola: "aves",
  porcina: "cerdos",
  mascotas: "mascotas",
};

export function getIndustryProductDivision(
  industrySlug: string,
): ProductoDivisionSlug | undefined {
  return INDUSTRY_PRODUCT_DIVISION[industrySlug];
}

export function getIndustriaProductosSectionCopy(
  industrySlug: string,
  industryName: string,
): { title: string; description: string } {
  const copyBySlug: Record<string, { title: string; description: string }> = {
    acuicola: {
      title: "Soluciones nutricionales para acuicultura",
      description:
        "Productos formulados para las etapas y desafíos de la producción acuícola.",
    },
    avicola: {
      title: "Soluciones nutricionales para avicultura",
      description:
        "Productos formulados para las etapas y desafíos de la producción avícola.",
    },
    porcina: {
      title: "Soluciones nutricionales para porcicultura",
      description:
        "Productos formulados para las etapas y desafíos de la producción porcina.",
    },
    mascotas: {
      title: "Soluciones nutricionales para mascotas",
      description:
        "Productos formulados para las etapas y desafíos de la formulación de alimentos para mascotas.",
    },
  };

  return (
    copyBySlug[industrySlug] ?? {
      title: `Soluciones nutricionales para ${industryName.toLowerCase()}`,
      description: `Productos formulados para las etapas y desafíos de la producción ${industryName.toLowerCase()}.`,
    }
  );
}
