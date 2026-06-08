import type { Industry } from "@/lib/industries";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

const INDUSTRY_BROCHURE_BY_SLUG: Record<Industry["slug"], string> = {
  acuicola: PUBLIC_ASSETS.ctaBanner.brochures.acuicola,
  avicola: PUBLIC_ASSETS.ctaBanner.brochures.aves,
  porcina: PUBLIC_ASSETS.ctaBanner.brochures.cerdos,
  mascotas: PUBLIC_ASSETS.ctaBanner.brochures.mascotas,
};

export function getIndustryBrochureHref(slug: Industry["slug"]): string {
  return INDUSTRY_BROCHURE_BY_SLUG[slug];
}
