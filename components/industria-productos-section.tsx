import Link from "next/link";

import { ProductoCard } from "@/components/producto-card";
import {
  getIndustriaProductosSectionCopy,
  getIndustryProductDivision,
} from "@/lib/industria-productos-section";
import {
  getProductosFiltered,
  productosFilterHref,
} from "@/lib/productos-inventory";
import { cn } from "@/lib/utils";

type IndustriaProductosSectionProps = {
  industrySlug: string;
  industryName: string;
  variant?: "default" | "on-dark";
  className?: string;
};

export default function IndustriaProductosSection({
  industrySlug,
  industryName,
  variant = "default",
  className,
}: IndustriaProductosSectionProps) {
  const division = getIndustryProductDivision(industrySlug);
  if (!division) return null;

  const productos = getProductosFiltered({ division });
  if (productos.length === 0) return null;

  const { title, description } = getIndustriaProductosSectionCopy(
    industrySlug,
    industryName,
  );
  const onDark = variant === "on-dark";

  return (
    <section className={cn("px-6 py-20 sm:px-10 lg:px-12", className)}>
      <div className="mx-auto max-w-5xl">
        {onDark ? (
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
            <span className="h-px w-8 shrink-0 bg-cyan-400/80" aria-hidden />
            Productos
          </p>
        ) : (
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald">
            Productos
          </p>
        )}

        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2
              className={cn(
                "text-2xl font-bold sm:text-3xl",
                onDark ? "text-white" : "text-ns-text",
              )}
            >
              {title}
            </h2>
            <p
              className={cn(
                "mt-3 text-base leading-relaxed",
                onDark ? "text-white/70" : "text-ns-muted",
              )}
            >
              {description}
            </p>
          </div>
          <Link
            href={productosFilterHref({ division })}
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-90",
              onDark
                ? "border border-cyan-400/50 bg-cyan-500 text-slate-950"
                : "bg-ns-green text-white hover:bg-ns-green-dark",
            )}
          >
            Ver catálogo completo
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => (
            <li key={producto.slug}>
              <ProductoCard
                producto={producto}
                activeDivision={division}
                variant={onDark ? "on-dark" : "default"}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
