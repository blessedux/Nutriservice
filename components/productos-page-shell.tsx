"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import DivisionVideosBg from "@/components/division-videos-bg";
import {
  PRODUCTOS_DIVISIONES,
  type ProductoDivisionSlug,
} from "@/lib/productos-divisions";
import { getDivisionMedia } from "@/lib/productos-division-media";
import { cn } from "@/lib/utils";

type ProductosPageShellProps = {
  children: ReactNode;
};

export default function ProductosPageShell({ children }: ProductosPageShellProps) {
  const searchParams = useSearchParams();
  const divisionParam = searchParams.get("division")?.toLowerCase().trim() ?? "";
  const activeDivisionSlug = PRODUCTOS_DIVISIONES.find(
    (d) => d.slug === divisionParam,
  )?.slug as ProductoDivisionSlug | undefined;

  const media = activeDivisionSlug
    ? getDivisionMedia(activeDivisionSlug)
    : null;
  const onDark = media?.tone === "on-dark";

  return (
    <div
      className={cn(
        "relative min-h-[calc(100dvh-4rem)]",
        onDark ? "text-white" : "text-ns-text",
      )}
    >
      <DivisionVideosBg activeSlug={activeDivisionSlug} />
      <div
        className={cn(
          "relative z-10 px-6 py-12",
          !onDark && "bg-ns-surface",
        )}
      >
        {children}
      </div>
    </div>
  );
}
