import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo de soluciones e ingredientes Nutriservice por categoría.",
};

const CATEGORIAS = [
  { slug: "inmunidad", label: "Inmunidad", detail: "Soporte inmunológico" },
  { slug: "mascotas", label: "Mascotas", detail: "Perros y gatos" },
] as const;

type Props = {
  searchParams: Promise<{ categoria?: string }>;
};

export default async function ProductosPage({ searchParams }: Props) {
  const { categoria: raw } = await searchParams;
  const categoria = raw?.toLowerCase().trim() ?? "";
  const active =
    CATEGORIAS.find((c) => c.slug === categoria)?.label ??
    (categoria ? "Categoría" : "Todos");

  return (
    <div className="bg-ns-surface min-h-[calc(100dvh-4rem)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ns-muted">
          Nutriservice
        </p>
        <h1 className="mt-2 text-3xl font-bold text-ns-text">Productos</h1>
        <p className="mt-3 max-w-2xl text-ns-muted">
          Filtra por categoría. El listado completo se irá ampliando.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
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
          {CATEGORIAS.map((c) => (
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

        <div className="mt-10 rounded-2xl border border-ns-border bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-ns-muted">
            Filtro activo
          </p>
          <p className="mt-2 text-lg font-semibold text-ns-text">
            {categoria ? active : "Sin filtro"}
          </p>
          {categoria && (
            <p className="mt-2 text-sm text-ns-muted">
              Mostrando resultados para la etiqueta{" "}
              <span className="font-mono text-ns-text">{categoria}</span>.
            </p>
          )}
          <div className="mt-8 rounded-xl border border-dashed border-ns-border bg-ns-surface p-10 text-center text-sm text-ns-muted">
            Próximamente: fichas de producto enlazadas desde esta vista.
          </div>
        </div>
      </div>
    </div>
  );
}
