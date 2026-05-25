"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import "@/21st-publish/gooey-search/gooey-search.css";

import { GooeySearch } from "@/21st-publish/gooey-search/code";
import {
  getProductosSearchOptions,
  productosFilterHref,
} from "@/lib/productos-inventory";

const PRODUCTOS_SEARCH_OPTIONS = getProductosSearchOptions();

function ProductosGooeySearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const applySearch = useCallback(
    (query: string) => {
      const categoria = searchParams.get("categoria") ?? undefined;
      const division = searchParams.get("division") ?? undefined;
      router.push(
        productosFilterHref({
          categoria,
          division,
          q: query.trim() || undefined,
        }),
      );
    },
    [router, searchParams],
  );

  return (
    <div className="flex shrink-0 items-center justify-end [&_.gooey-search-layout]:justify-end [&_.gooey-search-root]:w-auto">
      <GooeySearch
        data={PRODUCTOS_SEARCH_OPTIONS}
        className="gooey-search-root--navy w-auto"
        buttonLabel="Buscar"
        placeholder="nombre del producto"
        inputAriaLabel="Nombre del producto"
        expandedWidth={220}
        debounceMs={200}
        onSelectResult={applySearch}
        onSubmit={applySearch}
      />
    </div>
  );
}

export function ProductosGooeySearch() {
  return (
    <Suspense
      fallback={
        <div className="h-10 w-[100px] shrink-0 rounded-full border border-ns-border bg-white" />
      }
    >
      <ProductosGooeySearchInner />
    </Suspense>
  );
}
