export type Producto = {
  slug: string;
  name: string;
  altName: string;
  summary: string;
  description: string;
  tags: readonly string[];
  /** Category filter slugs (`PRODUCTOS_CATEGORIAS`) that list this product. */
  filterSlugs: readonly string[];
};

export const PRODUCTOS_INVENTORY: readonly Producto[] = [
  {
    slug: "activemos",
    name: "Activemos",
    altName: "ActiveMOS",
    summary: "Prebiótico funcional para microbiota intestinal.",
    description:
      "Activemos (ActiveMOS) es un prebiótico funcional formulado para modular la microbiota intestinal y apoyar la integridad del tracto digestivo en operaciones a escala productiva. Combina acción sobre la flora beneficiosa con soporte antioxidante e inmunológico, alineado con programas de salud intestinal en acuicultura, avicultura y otras especies.",
    tags: ["Antioxidante", "Salud intestinal", "Inmunológico"],
    filterSlugs: ["salud-intestinal", "inmunidad", "antioxidante"],
  },
] as const;

export function getProductoBySlug(slug: string): Producto | undefined {
  return PRODUCTOS_INVENTORY.find((p) => p.slug === slug);
}

export function getProductosByCategoria(categoriaSlug: string): Producto[] {
  if (!categoriaSlug) return [...PRODUCTOS_INVENTORY];
  return PRODUCTOS_INVENTORY.filter((p) =>
    p.filterSlugs.includes(categoriaSlug),
  );
}

export const PRODUCTOS_SEARCH_ITEMS = [
  ...PRODUCTOS_INVENTORY.flatMap((p) => [p.name, p.altName, p.summary]),
] as const;
