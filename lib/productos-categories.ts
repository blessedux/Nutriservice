import { PRODUCTOS_SEARCH_ITEMS as INVENTORY_SEARCH_ITEMS } from "@/lib/productos-inventory";
import { PRODUCTOS_DIVISIONES } from "@/lib/productos-divisions";

/** Functional benefit filters — not species / industry. */
export const PRODUCTOS_CATEGORIAS = [
  { slug: "inmunidad", label: "Inmunidad", detail: "Soporte inmunológico" },
  {
    slug: "salud-animal",
    label: "Salud animal",
    detail: "Salud digestiva, respiratoria y bienestar general",
  },
  {
    slug: "nutricion",
    label: "Nutrición",
    detail: "Rendimiento, digestibilidad y eficiencia alimenticia",
  },
  {
    slug: "antioxidante",
    label: "Antioxidante",
    detail: "Protección celular y estrés oxidativo",
  },
] as const;

export type ProductoCategoriaSlug =
  (typeof PRODUCTOS_CATEGORIAS)[number]["slug"];

export const PRODUCTOS_SEARCH_ITEMS = [
  ...PRODUCTOS_DIVISIONES.flatMap((d) => [d.label]),
  ...PRODUCTOS_CATEGORIAS.flatMap((c) => [c.label, c.detail]),
  ...INVENTORY_SEARCH_ITEMS,
];
