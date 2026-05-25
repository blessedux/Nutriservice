import type { Metadata } from "next";
import Link from "next/link";

import { ProductoCard } from "@/components/producto-card";
import { ProductosGooeySearch } from "@/components/productos-gooey-search";
import { PRODUCTOS_CATEGORIAS } from "@/lib/productos-categories";
import {
  PRODUCTOS_DIVISIONES,
  type ProductoDivisionSlug,
} from "@/lib/productos-divisions";
import {
  getProductosFiltered,
  productosFilterHref,
} from "@/lib/productos-inventory";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo de soluciones e ingredientes Nutriservice por división y categoría funcional.",
};

type Props = {
  searchParams: Promise<{ categoria?: string; division?: string; q?: string }>;
};

function filterChipClass(active: boolean) {
  return active
    ? "border-ns-green bg-white text-ns-text"
    : "border-ns-border bg-white text-ns-muted hover:border-ns-green";
}

export default async function ProductosPage({ searchParams }: Props) {
  const {
    categoria: rawCategoria,
    division: rawDivision,
    q: rawQ,
  } = await searchParams;
  const categoria = rawCategoria?.toLowerCase().trim() ?? "";
  const division = rawDivision?.toLowerCase().trim() ?? "";
  const q = rawQ?.trim() ?? "";
  const activeDivision = PRODUCTOS_DIVISIONES.find((d) => d.slug === division);
  const activeCategoria = PRODUCTOS_CATEGORIAS.find(
    (c) => c.slug === categoria,
  );
  const productos = getProductosFiltered({ categoria, division, q });
  const activeDivisionSlug = activeDivision?.slug as
    | ProductoDivisionSlug
    | undefined;

  const filterBase = {
    categoria: categoria || undefined,
    division: division || undefined,
    q: q || undefined,
  };

  const headingParts: string[] = [];
  if (q) headingParts.push(`“${q}”`);
  if (activeDivision) headingParts.push(activeDivision.label);
  if (activeCategoria) headingParts.push(activeCategoria.label);

  const heading =
    headingParts.length > 0 ? headingParts.join(" · ") : "Todos los productos";

  const hasFilters = Boolean(division || categoria || q);

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-ns-surface px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-muted">
            Nutriservice
          </p>
          <h1 className="mt-2 text-3xl font-bold text-ns-text">Productos</h1>
          <p className="mt-3 max-w-2xl text-ns-muted">
            Filtra por división animal, categoría funcional o busca por nombre
            de producto.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ns-muted">
              División
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={productosFilterHref({ ...filterBase, division: undefined })}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${filterChipClass(!division)}`}
              >
                Todas
              </Link>
              {PRODUCTOS_DIVISIONES.map((d) => (
                <Link
                  key={d.slug}
                  href={productosFilterHref({
                    ...filterBase,
                    division: d.slug,
                  })}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${filterChipClass(division === d.slug)}`}
                >
                  {d.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
            <div className="min-w-0 flex-1">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ns-muted">
                Categoría funcional
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={productosFilterHref({
                    ...filterBase,
                    categoria: undefined,
                  })}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${filterChipClass(!categoria)}`}
                >
                  Todas
                </Link>
                {PRODUCTOS_CATEGORIAS.map((c) => (
                  <Link
                    key={c.slug}
                    href={productosFilterHref({
                      ...filterBase,
                      categoria: c.slug,
                    })}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${filterChipClass(categoria === c.slug)}`}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
            <ProductosGooeySearch />
          </div>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-ns-muted">
            {hasFilters ? "Filtros activos" : "Catálogo"}
          </p>
          <p className="mt-2 text-lg font-semibold text-ns-text">{heading}</p>
          {hasFilters && (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ns-muted">
              <span>
                {productos.length}{" "}
                {productos.length === 1 ? "resultado" : "resultados"}.
              </span>
              {q && (
                <Link
                  href={productosFilterHref({
                    categoria: filterBase.categoria,
                    division: filterBase.division,
                  })}
                  className="font-medium text-ns-green hover:underline"
                >
                  Limpiar búsqueda
                </Link>
              )}
            </div>
          )}

          {productos.length > 0 ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {productos.map((producto) => (
                <li key={producto.slug}>
                  <ProductoCard
                    producto={producto}
                    activeDivision={activeDivisionSlug}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-ns-border bg-white p-10 text-center text-sm text-ns-muted">
              No hay productos para esta combinación de filtros.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
