"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ProductoImageProps = {
  src: string;
  alt: string;
  productName: string;
  tone?: "on-dark" | "on-light";
  className?: string;
};

export function ProductoImage({
  src,
  alt,
  productName,
  tone = "on-dark",
  className,
}: ProductoImageProps) {
  const [failed, setFailed] = useState(false);
  const onDark = tone === "on-dark";

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full min-h-[220px] w-full flex-col items-center justify-center p-6 text-center",
          onDark ? "bg-white/[0.06]" : "bg-ns-surface-alt",
          className,
        )}
      >
        <div
          className={cn(
            "rounded-full border border-dashed px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]",
            onDark
              ? "border-white/25 text-white/45"
              : "border-ns-border text-ns-muted",
          )}
        >
          Imagen del producto
        </div>
        <p
          className={cn(
            "mt-3 text-xs",
            onDark ? "text-white/35" : "text-ns-subtle",
          )}
        >
          {productName}
        </p>
        <p
          className={cn(
            "mt-1 text-[10px] uppercase tracking-wider",
            onDark ? "text-white/25" : "text-ns-subtle",
          )}
        >
          Próximamente
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full min-h-[220px] w-full", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 280px"
        className="object-contain p-6"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
