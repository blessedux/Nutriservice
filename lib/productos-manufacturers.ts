import type { Producto } from "@/lib/productos-inventory";

/**
 * Fabricante / marca de origen por producto Nutriservice.
 * @see documentación comercial (Biorigin, Bioiberica, Agrimprove, Tectron, etc.).
 */
export const PRODUCTO_MANUFACTURERS: Partial<
  Record<Producto["slug"], string>
> = {
  activemos: "Biorigin",
  macrogard: "Biorigin",
  "palaup-ch": "Biorigin",
  silimarina: "Tinveun",
  "nucleoforce-salmonids": "Bioiberica",
  nucleoforce: "Bioiberica",
  aromabiotic: "Agrimprove",
  meatfree: "Agrimprove",
  "s-prove": "Agrimprove",
  "m-prove": "Agrimprove",
  "ambitine-cl": "Agrimprove",
  "citroflake-b": "Agrimprove",
  "c-vita": "Agrimprove",
  eubisol: "Agrimprove",
  feedlock: "Agrimprove",
  vitanox: "Agrimprove",
  "tecmax-pro": "Tectron",
  "turbozyme-ft-exp": "Tectron",
  "turbozyme-ft-sd-exp": "Tectron",
  "microacid-plus": "Tectron",
  "microacid-eoils": "Tectron",
  "vitaprotein-50-plus": "Nuscience",
  "halor-tid": "Enhalor",
  "plusbreathe-plus": "PlusVet",
  milkey: "Tectron",
};

export function getProductoManufacturer(
  producto: Pick<Producto, "slug">,
): string | undefined {
  return PRODUCTO_MANUFACTURERS[producto.slug];
}
