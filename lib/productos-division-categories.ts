import type { ProductoCategoriaSlug } from "@/lib/productos-categories";
import type { ProductoDivisionSlug } from "@/lib/productos-divisions";

/** Spreadsheet-backed category per product slug, by division (Cerdos / Aves / Mascotas). */
export const DIVISION_PRODUCT_CATEGORIES: Record<
  Extract<ProductoDivisionSlug, "aves" | "cerdos" | "mascotas">,
  Partial<Record<string, ProductoCategoriaSlug>>
> = {
  cerdos: {
    activemos: "salud-animal",
    aromabiotic: "salud-animal",
    "c-vita": "salud-animal",
    eubisol: "salud-animal",
    feedlock: "salud-animal",
    "halor-tid": "salud-animal",
    "microacid-plus": "salud-animal",
    "microacid-eoils": "salud-animal",
    "plusbreathe-plus": "salud-animal",
    "ambitine-cl": "nutricion",
    "citroflake-b": "nutricion",
    milkey: "nutricion",
    "tecmax-pro": "nutricion",
    "turbozyme-ft-exp": "nutricion",
    "turbozyme-ft-sd-exp": "nutricion",
    "vitaprotein-50-plus": "nutricion",
    macrogard: "inmunidad",
    nucleoforce: "inmunidad",
    vitanox: "antioxidante",
  },
  aves: {
    activemos: "salud-animal",
    "halor-tid": "salud-animal",
    "microacid-plus": "salud-animal",
    "microacid-eoils": "salud-animal",
    "m-prove": "salud-animal",
    "plusbreathe-plus": "salud-animal",
    "s-prove": "salud-animal",
    meatfree: "nutricion",
    "tecmax-pro": "nutricion",
    "turbozyme-ft-exp": "nutricion",
    "turbozyme-ft-sd-exp": "nutricion",
    "vitaprotein-50-plus": "nutricion",
    vitanox: "antioxidante",
  },
  mascotas: {
    activemos: "salud-animal",
    silimarina: "salud-animal",
    "palaup-ch": "nutricion",
    "tecmax-pro": "nutricion",
    "turbozyme-ft-exp": "nutricion",
    "turbozyme-ft-sd-exp": "nutricion",
    macrogard: "inmunidad",
    nucleoforce: "inmunidad",
  },
};

export function getDivisionProductCategory(
  division: ProductoDivisionSlug,
  productSlug: string,
): ProductoCategoriaSlug | undefined {
  if (division === "acuicola") return undefined;
  return DIVISION_PRODUCT_CATEGORIES[division]?.[productSlug];
}
