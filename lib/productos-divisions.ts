/** Animal / industry division filters for the product catalog. */
export const PRODUCTOS_DIVISIONES = [
  { slug: "acuicola", label: "Acuícola" },
  { slug: "aves", label: "Aves" },
  { slug: "cerdos", label: "Cerdos" },
  { slug: "mascotas", label: "Mascotas" },
] as const;

export type ProductoDivisionSlug = (typeof PRODUCTOS_DIVISIONES)[number]["slug"];

export function getDivisionLabel(slug: ProductoDivisionSlug): string {
  return PRODUCTOS_DIVISIONES.find((d) => d.slug === slug)?.label ?? slug;
}
