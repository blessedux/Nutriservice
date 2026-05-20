import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  PRODUCTOS_INVENTORY,
  getProductoBySlug,
} from "@/lib/productos-inventory";
import { PRODUCTOS_CATEGORIAS } from "@/lib/productos-categories";

type Props = {
  params: Promise<{ slug: string }>;
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

export default async function ProductoDetailPage({ params }: Props) {
  const { slug } = await params;
  const producto = getProductoBySlug(slug);
  if (!producto) notFound();

  const primaryFilter = producto.filterSlugs[0];
  const categoriaLabel = PRODUCTOS_CATEGORIAS.find(
    (c) => c.slug === primaryFilter,
  )?.label;

  return (
    <div className="bg-ns-surface min-h-[calc(100dvh-4rem)] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href={
            primaryFilter
              ? `/productos?categoria=${primaryFilter}`
              : "/productos"
          }
          className="text-xs font-semibold uppercase tracking-wider text-ns-green hover:underline"
        >
          ← {categoriaLabel ?? "Productos"}
        </Link>

        <div className="mt-6 flex flex-wrap gap-2">
          {producto.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-ns-border bg-white px-3 py-1 text-xs font-medium text-ns-text"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-4 text-3xl font-bold text-ns-text">
          {producto.name}
          <span className="block text-lg font-semibold text-ns-muted">
            {producto.altName}
          </span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ns-text">
          {producto.summary}
        </p>
        <p className="mt-6 text-base leading-relaxed text-ns-muted">
          {producto.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/productos"
            className="rounded-full border border-ns-border bg-white px-5 py-2.5 text-sm font-medium text-ns-text transition-colors hover:border-ns-green"
          >
            Ver catálogo
          </Link>
          <Link
            href="/contacto"
            className="rounded-full bg-ns-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ns-green-dark"
          >
            Solicitar información
          </Link>
        </div>
      </div>
    </div>
  );
}
