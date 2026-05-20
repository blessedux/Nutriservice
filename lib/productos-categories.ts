import { PRODUCTOS_SEARCH_ITEMS as INVENTORY_SEARCH_ITEMS } from "@/lib/productos-inventory";

/** Functional benefit filters — not species / industry. */
export const PRODUCTOS_CATEGORIAS = [
  { slug: "inmunidad", label: "Inmunidad", detail: "Soporte inmunológico" },
  {
    slug: "salud-intestinal",
    label: "Salud intestinal",
    detail: "Microbiota y tracto digestivo",
  },
  {
    slug: "antioxidante",
    label: "Antioxidante",
    detail: "Protección celular y estrés oxidativo",
  },
] as const;

export const PRODUCTOS_SEARCH_ITEMS = [
  ...PRODUCTOS_CATEGORIAS.flatMap((c) => [c.label, c.detail]),
  ...INVENTORY_SEARCH_ITEMS,
];
