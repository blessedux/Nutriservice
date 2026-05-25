import Link from "next/link";

import { PRODUCTOS_CATEGORIAS } from "@/lib/productos-categories";
import {
  getDivisionLabel,
  type ProductoDivisionSlug,
} from "@/lib/productos-divisions";
import {
  getProductoSummary,
  productoDetailHref,
  type Producto,
} from "@/lib/productos-inventory";
import { cn } from "@/lib/utils";

type ProductoCardProps = {
  producto: Producto;
  activeDivision?: ProductoDivisionSlug;
  variant?: "default" | "on-dark";
};

export function ProductoCard({
  producto,
  activeDivision,
  variant = "default",
}: ProductoCardProps) {
  const summary = getProductoSummary(producto, activeDivision);
  const divisionsToShow = activeDivision
    ? [activeDivision]
    : producto.divisionSlugs;
  const onDark = variant === "on-dark";

  return (
    <Link
      href={productoDetailHref(producto.slug, activeDivision)}
      className={cn(
        "group flex h-full flex-col rounded-2xl p-6 transition-colors",
        onDark
          ? cn(
              "border border-white/20 bg-white/[0.07] backdrop-blur-xl",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_12px_40px_-16px_rgba(0,0,0,0.45)]",
              "hover:border-cyan-400/50 hover:bg-white/[0.1]",
            )
          : "border border-ns-border bg-white hover:border-ns-green",
      )}
    >
      <div className="flex flex-wrap gap-2">
        {divisionsToShow.map((division) => (
          <span
            key={division}
            className={cn(
              "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
              onDark
                ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                : "border border-[rgba(30,58,138,0.12)] bg-[rgba(30,58,138,0.06)] text-[#1e3a8a]",
            )}
          >
            {getDivisionLabel(division)}
          </span>
        ))}
        {producto.filterSlugs.map((slug) => {
          const categoria = PRODUCTOS_CATEGORIAS.find((c) => c.slug === slug);
          if (!categoria) return null;
          return (
            <span
              key={slug}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                onDark
                  ? "border border-white/15 bg-white/[0.06] text-white/65"
                  : "border border-ns-border bg-ns-surface text-ns-muted",
              )}
            >
              {categoria.label}
            </span>
          );
        })}
      </div>
      <h2
        className={cn(
          "mt-4 text-xl font-bold",
          onDark
            ? "text-white group-hover:text-cyan-300"
            : "text-ns-text group-hover:text-ns-green",
        )}
      >
        {producto.name}
        <span
          className={cn("font-normal", onDark ? "text-white/55" : "text-ns-muted")}
        >
          {" "}
          ({producto.altName})
        </span>
      </h2>
      <p
        className={cn(
          "mt-2 flex-1 text-sm leading-relaxed",
          onDark ? "text-white/70" : "text-ns-muted",
        )}
      >
        {summary}
      </p>
      <p
        className={cn(
          "mt-4 text-xs font-semibold uppercase tracking-wider",
          onDark ? "text-cyan-400" : "text-ns-green",
        )}
      >
        Ver ficha →
      </p>
    </Link>
  );
}
