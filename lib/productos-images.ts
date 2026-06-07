import { PRODUCTO_MANUFACTURERS } from "@/lib/productos-manufacturers";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export const PRODUCTO_STOCK_IMAGE = {
  pellet: PUBLIC_ASSETS.shared.pellet2,
  powder: PUBLIC_ASSETS.shared.powder3,
} as const;

export type ProductoStockImageVariant = keyof typeof PRODUCTO_STOCK_IMAGE;

/** Slugs that use the pellet stock shot; all others use powder. */
const PELLET_PRODUCT_SLUGS = new Set([
  "premezcla-suplemento-funcional",
  "premix-especiales",
  "citroflake-b",
]);

/** Catalogue product shots (override manufacturer / pellet / powder defaults). */
const PRODUCT_IMAGE_BY_SLUG: Partial<Record<string, string>> = {};

/** Default stock shot per manufacturer when no slug-specific override exists. */
const MANUFACTURER_STOCK_IMAGE: Partial<Record<string, string>> = {
  Biorigin: PUBLIC_ASSETS.shared.bioOriginPowder,
  Bioiberica: PUBLIC_ASSETS.shared.bioibericaPowder,
  Nuscience: PUBLIC_ASSETS.shared.nusciencePellet,
};

const MANUFACTURER_IMAGE_OBJECT_POSITION = "center 80%";

/** Vertical framing tweak for manufacturer stock shots inside the product card. */
export function getProductoImageObjectPosition(
  manufacturer: string | undefined,
): string {
  if (manufacturer && MANUFACTURER_STOCK_IMAGE[manufacturer]) {
    return MANUFACTURER_IMAGE_OBJECT_POSITION;
  }
  return "center center";
}

export function getProductoStockImageVariant(
  slug: string,
): ProductoStockImageVariant {
  return PELLET_PRODUCT_SLUGS.has(slug) ? "pellet" : "powder";
}

export function getProductoStockImagePath(slug: string): string {
  const slugOverride = PRODUCT_IMAGE_BY_SLUG[slug];
  if (slugOverride) return slugOverride;

  const manufacturer = PRODUCTO_MANUFACTURERS[slug as keyof typeof PRODUCTO_MANUFACTURERS];
  if (manufacturer) {
    const manufacturerImage = MANUFACTURER_STOCK_IMAGE[manufacturer];
    if (manufacturerImage) return manufacturerImage;
  }

  return PRODUCTO_STOCK_IMAGE[getProductoStockImageVariant(slug)];
}
