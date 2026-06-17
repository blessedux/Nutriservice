import { PRODUCTO_MANUFACTURERS } from "@/lib/productos-manufacturers";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

/** Default catalogue stock shot — white dust bag (no pellet imagery). */
export const PRODUCTO_STOCK_IMAGE = PUBLIC_ASSETS.shared.whiteDustBag;

export type ProductoStockImageVariant = "powder";

/** Catalogue product shots (override manufacturer / stock defaults). */
const PRODUCT_IMAGE_BY_SLUG: Partial<Record<string, string>> = {
  silimarina: PUBLIC_ASSETS.shared.whiteDustBag,
  "nucleoforce-salmonids": PUBLIC_ASSETS.productos.nucleoforceSalmonids,
};

/** Default stock shot per manufacturer when no slug-specific override exists. */
const MANUFACTURER_STOCK_IMAGE: Partial<Record<string, string>> = {
  Biorigin: PUBLIC_ASSETS.shared.bioOriginPowder,
  Bioiberica: PUBLIC_ASSETS.shared.bioibericaPowder,
  Nuscience: PUBLIC_ASSETS.shared.whiteDustBag,
  Tinveun: PUBLIC_ASSETS.shared.bioOriginPowder,
};

const MANUFACTURER_IMAGE_OBJECT_POSITION = "center 80%";

/** Vertical framing tweak for manufacturer stock shots inside the product card. */
export function getProductoImageObjectPosition(
  manufacturer: string | undefined,
  slug?: string,
): string {
  if (slug && PRODUCT_IMAGE_BY_SLUG[slug]) {
    return "center center";
  }
  if (manufacturer && MANUFACTURER_STOCK_IMAGE[manufacturer]) {
    return MANUFACTURER_IMAGE_OBJECT_POSITION;
  }
  return "center center";
}

export function getProductoStockImageVariant(
  _slug: string,
): ProductoStockImageVariant {
  return "powder";
}

export function getProductoStockImagePath(slug: string): string {
  const slugOverride = PRODUCT_IMAGE_BY_SLUG[slug];
  if (slugOverride) return slugOverride;

  const manufacturer = PRODUCTO_MANUFACTURERS[slug as keyof typeof PRODUCTO_MANUFACTURERS];
  if (manufacturer) {
    const manufacturerImage = MANUFACTURER_STOCK_IMAGE[manufacturer];
    if (manufacturerImage) return manufacturerImage;
  }

  return PRODUCTO_STOCK_IMAGE;
}
