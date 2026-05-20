import type { Metadata } from "next";
import Link from "next/link";

import { ProductoCard } from "@/components/producto-card";
import { ProductosGooeySearch } from "@/components/productos-gooey-search";
import { PRODUCTOS_CATEGORIAS } from "@/lib/productos-categories";
import { getProductosByCategoria } from "@/lib/productos-inventory";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo de soluciones e ingredientes Nutriservice por categoría.",
};

type Props = {
  searchParams: Promise<{ categoria?: string }>;
};

export default async function ProductosPage({ searchParams }: Props) {
  const { categoria: raw } = await searchParams;
  const categoria = raw?.toLowerCase().trim() ?? "";
  const active =
    PRODUCTOS_CATEGORIAS.find((c) => c.slug === categoria)?.label ??
    (categoria ? "Categoría" : "Todos");
  const productos = getProductosByCategoria(categoria);

  return (
    <div className="bg-ns-surface min-h-[calc(100dvh-4rem)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-muted">
            Nutriservice
          </p>
          <h1 className="mt-2 text-3xl font-bold text-ns-text">Productos</h1>
          <p className="mt-3 max-w-2xl text-ns-muted">
            Filtra por categoría. El listado completo se irá ampliando.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <Link
              href="/productos"
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                !categoria
                  ? "border-ns-green bg-white text-ns-text"
                  : "border-ns-border bg-white text-ns-muted hover:border-ns-green"
              }`}
            >
              Todos
            </Link>
            {PRODUCTOS_CATEGORIAS.map((c) => (
              <Link
                key={c.slug}
                href={`/productos?categoria=${c.slug}`}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  categoria === c.slug
                    ? "border-ns-green bg-white text-ns-text"
                    : "border-ns-border bg-white text-ns-muted hover:border-ns-green"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
          <ProductosGooeySearch />
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-ns-muted">
            {categoria ? "Filtro activo" : "Catálogo"}
          </p>
          <p className="mt-2 text-lg font-semibold text-ns-text">
            {categoria ? active : "Todos los productos"}
          </p>
          {categoria && (
            <p className="mt-2 text-sm text-ns-muted">
              {productos.length}{" "}
              {productos.length === 1 ? "resultado" : "resultados"} para{" "}
              <span className="font-mono text-ns-text">{categoria}</span>.
            </p>
          )}

          {productos.length > 0 ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {productos.map((producto) => (
                <li key={producto.slug}>
                  <ProductoCard producto={producto} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-ns-border bg-white p-10 text-center text-sm text-ns-muted">
              No hay productos en esta categoría todavía.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
