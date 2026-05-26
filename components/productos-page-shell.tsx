"use client";

import type { ReactNode } from "react";

import DivisionVideoBg from "@/components/division-video-bg";
import type { ProductoDivisionSlug } from "@/lib/productos-divisions";
import { getDivisionMedia } from "@/lib/productos-division-media";
import { cn } from "@/lib/utils";

type ProductosPageShellProps = {
  activeDivisionSlug?: ProductoDivisionSlug;
  children: ReactNode;
};

export default function ProductosPageShell({
  activeDivisionSlug,
  children,
}: ProductosPageShellProps) {
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
      {media?.video ? (
        <DivisionVideoBg mp4={media.video.mp4} webm={media.video.webm} />
      ) : null}
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
