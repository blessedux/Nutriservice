"use client";

import "@/21st-publish/gooey-search/gooey-search.css";

import { GooeySearch } from "@/21st-publish/gooey-search/code";
import { PRODUCTOS_SEARCH_ITEMS } from "@/lib/productos-categories";

export function ProductosGooeySearch() {
  return (
    <div className="flex shrink-0 items-center justify-end [&_.gooey-search-layout]:justify-end [&_.gooey-search-root]:w-auto">
      <GooeySearch
        data={PRODUCTOS_SEARCH_ITEMS}
        className="gooey-search-root--navy w-auto"
        buttonLabel="Buscar"
        placeholder="nombre del producto"
        inputAriaLabel="Nombre del producto"
        expandedWidth={220}
      />
    </div>
  );
}
