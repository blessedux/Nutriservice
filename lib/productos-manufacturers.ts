import type { Producto } from "@/lib/productos-inventory";

/**
 * Fabricante / marca de origen por producto Nutriservice.
 * @see documentación comercial (Biorigin, Bioiberica, Agrimprove, Tectron).
 */
export const PRODUCTO_MANUFACTURERS: Partial<
  Record<Producto["slug"], string>
> = {
  activemos: "Biorigin",
  macrogard: "Biorigin",
  silimarina: "Bioiberica",
  "nucleoforce-salmonids": "Bioiberica",
  aromabiotic: "Agrimprove",
  meatfree: "Agrimprove",
  "s-prove": "Agrimprove",
  "tecmax-pro": "Tectron",
  "turbozyme-ft-exp": "Tectron",
  "turbozyme-ft-sd-exp": "Tectron",
};

export function getProductoManufacturer(
  producto: Pick<Producto, "slug">,
): string | undefined {
  return PRODUCTO_MANUFACTURERS[producto.slug];
}
