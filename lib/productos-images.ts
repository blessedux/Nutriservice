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

/** Catalogue product shots (override pellet / powder defaults). */
const PRODUCT_IMAGE_BY_SLUG: Partial<Record<string, string>> = {
  macrogard: PUBLIC_ASSETS.shared.macrogard,
};

export function getProductoStockImageVariant(
  slug: string,
): ProductoStockImageVariant {
  return PELLET_PRODUCT_SLUGS.has(slug) ? "pellet" : "powder";
}

export function getProductoStockImagePath(slug: string): string {
  return (
    PRODUCT_IMAGE_BY_SLUG[slug] ??
    PRODUCTO_STOCK_IMAGE[getProductoStockImageVariant(slug)]
  );
}
