import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductoDetailPageView from "@/components/producto-detail-page";
import { PRODUCTOS_CATEGORIAS } from "@/lib/productos-categories";
import {
  PRODUCTOS_INVENTORY,
  getProductoBySlug,
  resolveProductoDivision,
} from "@/lib/productos-inventory";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ division?: string }>;
};

export function generateStaticParams() {
  return PRODUCTOS_INVENTORY.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = getProductoBySlug(slug);
  if (!producto) return { title: "Producto" };

  return {
    title: `${producto.name} (${producto.altName})`,
    description: producto.summary,
  };
}

export default async function ProductoDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { division: rawDivision } = await searchParams;
  const producto = getProductoBySlug(slug);
  if (!producto) notFound();

  const division = resolveProductoDivision(
    producto,
    rawDivision?.toLowerCase().trim(),
  );

  const categoriaLabels = producto.filterSlugs
    .map((filterSlug) =>
      PRODUCTOS_CATEGORIAS.find((c) => c.slug === filterSlug)?.label,
    )
    .filter(Boolean) as string[];

  return (
    <ProductoDetailPageView
      producto={producto}
      division={division}
      categoriaLabels={categoriaLabels}
    />
  );
}
