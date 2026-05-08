"use client";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface ScrollLegendItem {
  id: string;
  name: string;
}

interface ScrollLegendProps {
  items: ScrollLegendItem[];
  className?: string;
}

function sectionDocumentTop(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  return rect.top + window.scrollY;
}

export function ScrollLegend({ items, className }: ScrollLegendProps) {
  const [activeSection, setActiveSection] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const updateActive = useCallback(() => {
    /** Same intent as `scroll-mt-24` (~96px): activate once section crosses mid-nav zone */
    const scrollPosition = window.scrollY + 100;

    for (let i = items.length - 1; i >= 0; i--) {
      const section = document.getElementById(items[i].id);
      if (!section) continue;
      if (sectionDocumentTop(section) <= scrollPosition) {
        setActiveSection(items[i].id);
        return;
      }
    }

    if (items[0]) setActiveSection(items[0].id);
  }, [items]);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        updateActive();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateActive();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [updateActive]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className={cn(
        "pointer-events-none fixed left-4 top-1/2 z-50 hidden -translate-y-1/2 lg:block",
        className,
      )}
      aria-label="Navegación por secciones"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ul className="pointer-events-auto flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              aria-current={activeSection === item.id ? "location" : undefined}
              aria-label={`Ir a ${item.name}`}
              className="group relative flex cursor-pointer items-center border-0 bg-transparent p-0 text-left"
              onClick={() => scrollToSection(item.id)}
            >
              <span
                className={cn(
                  "h-0.5 shrink-0 transition-all duration-200",
                  activeSection === item.id
                    ? "w-6 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.45)]"
                    : "w-4 bg-neutral-400/80 group-hover:bg-neutral-500 dark:bg-neutral-500 dark:group-hover:bg-neutral-400",
                )}
                aria-hidden
              />
              <span
                className={cn(
                  "ml-4 whitespace-nowrap text-sm font-medium transition-all duration-200",
                  "text-neutral-600 dark:text-neutral-400",
                  activeSection === item.id &&
                    "font-semibold text-cyan-600 dark:text-cyan-400",
                  isHovered
                    ? "translate-x-0 opacity-100"
                    : "pointer-events-none -translate-x-2 opacity-0",
                )}
              >
                {item.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
