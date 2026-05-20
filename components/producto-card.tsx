import Link from "next/link";

import type { Producto } from "@/lib/productos-inventory";

type ProductoCardProps = {
  producto: Producto;
};

export function ProductoCard({ producto }: ProductoCardProps) {
  return (
    <Link
      href={`/productos/${producto.slug}`}
      className="group block rounded-2xl border border-ns-border bg-white p-6 transition-colors hover:border-ns-green"
    >
      <div className="flex flex-wrap gap-2">
        {producto.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-ns-border bg-ns-surface px-3 py-1 text-xs font-medium text-ns-muted"
          >
            {tag}
          </span>
        ))}
      </div>
      <h2 className="mt-4 text-xl font-bold text-ns-text group-hover:text-ns-green">
        {producto.name}
        <span className="font-normal text-ns-muted"> ({producto.altName})</span>
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ns-muted">
        {producto.summary}
      </p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ns-green">
        Ver ficha →
      </p>
    </Link>
  );
}
