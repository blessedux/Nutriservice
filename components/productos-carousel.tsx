"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductoCard } from "@/components/producto-card";
import type { Producto } from "@/lib/productos-inventory";
import { cn } from "@/lib/utils";

type ProductosCarouselProps = {
  productos: readonly Producto[];
  className?: string;
  /** Accessible label for the carousel region. */
  ariaLabel?: string;
};

export function ProductosCarousel({
  productos,
  className,
  ariaLabel = "Productos destacados",
}: ProductosCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(productos.length > 1);

  const syncScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const slides = el.querySelectorAll<HTMLElement>("[data-producto-slide]");
    if (slides.length === 0) return;

    const scrollLeft = el.scrollLeft;
    let closest = 0;
    let minDist = Infinity;

    slides.forEach((slide, index) => {
      const dist = Math.abs(slide.offsetLeft - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = index;
      }
    });

    setActiveIndex(closest);
    setCanScrollPrev(scrollLeft > 4);
    setCanScrollNext(scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);

    return () => {
      el.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [productos.length, syncScrollState]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const slides = el.querySelectorAll<HTMLElement>("[data-producto-slide]");
    const clamped = Math.min(Math.max(index, 0), slides.length - 1);
    const target = slides[clamped];
    if (!target) return;

    el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }, []);

  const handlePrev = () => scrollToIndex(activeIndex - 1);
  const handleNext = () => scrollToIndex(activeIndex + 1);

  if (productos.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <div
          ref={scrollRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
          className={cn(
            "flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden scroll-smooth pb-1",
            "overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x]",
            "[&::-webkit-scrollbar]:hidden",
            "px-6 sm:px-0",
          )}
        >
          {productos.map((producto) => (
            <div
              key={producto.slug}
              data-producto-slide
              className="w-[min(88vw,340px)] shrink-0 snap-start sm:w-[min(42vw,360px)] lg:w-[min(31%,380px)]"
            >
              <ProductoCard producto={producto} />
            </div>
          ))}
        </div>

        {productos.length > 1 ? (
          <>
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canScrollPrev}
              aria-label="Producto anterior"
              className={cn(
                "absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-ns-border bg-white p-2.5 text-ns-text shadow-md transition",
                "hover:border-ns-green hover:text-ns-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ns-green",
                "disabled:pointer-events-none disabled:opacity-35 sm:inline-flex",
              )}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canScrollNext}
              aria-label="Producto siguiente"
              className={cn(
                "absolute right-0 top-1/2 z-10 hidden translate-x-1/2 -translate-y-1/2 rounded-full border border-ns-border bg-white p-2.5 text-ns-text shadow-md transition",
                "hover:border-ns-green hover:text-ns-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ns-green",
                "disabled:pointer-events-none disabled:opacity-35 sm:inline-flex",
              )}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {productos.length > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-4 px-6 sm:px-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canScrollPrev}
            aria-label="Producto anterior"
            className={cn(
              "inline-flex rounded-full border border-ns-border bg-white p-2 text-ns-text transition sm:hidden",
              "hover:border-ns-green hover:text-ns-green disabled:pointer-events-none disabled:opacity-35",
            )}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {productos.map((producto, index) => (
              <button
                key={producto.slug}
                type="button"
                aria-label={`Ir al producto ${index + 1}: ${producto.name}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === activeIndex
                    ? "w-5 bg-ns-green"
                    : "w-1.5 bg-ns-border hover:bg-ns-muted",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canScrollNext}
            aria-label="Producto siguiente"
            className={cn(
              "inline-flex rounded-full border border-ns-border bg-white p-2 text-ns-text transition sm:hidden",
              "hover:border-ns-green hover:text-ns-green disabled:pointer-events-none disabled:opacity-35",
            )}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
