import type { Metadata } from "next";
import Link from "next/link";

import { ProductoCard } from "@/components/producto-card";
import ProductosPageShell from "@/components/productos-page-shell";
import { ProductosGooeySearch } from "@/components/productos-gooey-search";
import { PRODUCTOS_CATEGORIAS } from "@/lib/productos-categories";
import {
  PRODUCTOS_DIVISIONES,
  type ProductoDivisionSlug,
} from "@/lib/productos-divisions";
import { getDivisionMedia } from "@/lib/productos-division-media";
import { productosFilterChipClass } from "@/lib/productos-page-utils";
import {
  getProductosFiltered,
  productosFilterHref,
} from "@/lib/productos-inventory";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo de soluciones e ingredientes Nutriservice por división y categoría funcional.",
};

type Props = {
  searchParams: Promise<{ categoria?: string; division?: string; q?: string }>;
};

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
  const onDark = activeDivisionSlug
    ? getDivisionMedia(activeDivisionSlug).tone === "on-dark"
    : false;

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
    <ProductosPageShell activeDivisionSlug={activeDivisionSlug}>
      <div className="mx-auto max-w-5xl">
        <div>
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-widest",
              onDark ? "text-cyan-400" : "text-ns-muted",
            )}
          >
            Nutriservice
          </p>
          <h1 className="mt-2 text-3xl font-bold">Productos</h1>
          <p className={cn("mt-3 max-w-2xl", onDark ? "text-white/70" : "text-ns-muted")}>
            Filtra por división animal, categoría funcional o busca por nombre
            de producto.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <p
              className={cn(
                "mb-3 text-[10px] font-bold uppercase tracking-[0.18em]",
                onDark ? "text-white/55" : "text-ns-muted",
              )}
            >
              División
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={productosFilterHref({ ...filterBase, division: undefined })}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  productosFilterChipClass(!division, onDark),
                )}
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
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    productosFilterChipClass(division === d.slug, onDark),
                  )}
                >
                  {d.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "mb-3 text-[10px] font-bold uppercase tracking-[0.18em]",
                  onDark ? "text-white/55" : "text-ns-muted",
                )}
              >
                Categoría funcional
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={productosFilterHref({
                    ...filterBase,
                    categoria: undefined,
                  })}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    productosFilterChipClass(!categoria, onDark),
                  )}
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
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      productosFilterChipClass(categoria === c.slug, onDark),
                    )}
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
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              onDark ? "text-white/55" : "text-ns-muted",
            )}
          >
            {hasFilters ? "Filtros activos" : "Catálogo"}
          </p>
          <p className="mt-2 text-lg font-semibold">{heading}</p>
          {hasFilters && (
            <div
              className={cn(
                "mt-2 flex flex-wrap items-center gap-3 text-sm",
                onDark ? "text-white/65" : "text-ns-muted",
              )}
            >
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
                  className={cn(
                    "font-medium hover:underline",
                    onDark ? "text-cyan-400" : "text-ns-green",
                  )}
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
                    variant={onDark ? "on-dark" : "default"}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div
              className={cn(
                "mt-8 rounded-xl border border-dashed p-10 text-center text-sm",
                onDark
                  ? "border-white/20 bg-white/[0.06] text-white/65"
                  : "border-ns-border bg-white text-ns-muted",
              )}
            >
              No hay productos para esta combinación de filtros.
            </div>
          )}
        </div>
      </div>
    </ProductosPageShell>
  );
}
