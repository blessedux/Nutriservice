"use client";

import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { PreloaderLab } from "@/components/preloader-lab";
import { cn } from "@/lib/utils";

export const PRELOADER_COUNTER_MS = 2400;

const FOREGROUND_STYLE = {
  "--color-foreground": "#000000",
} as CSSProperties;

const ISOTIPO_BG_STYLE = {
  backgroundImage: "url(/nutriservice_isotipo.svg)",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "min(88vw, 440px)",
} as CSSProperties;

type PreloaderStageProps = {
  counterDurationMs?: number;
  /** Defaults to production fullscreen overlay shell */
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "children" | "className">;

/**
 * Shared fullscreen shell: white backdrop, centered isotipo watermark, PreloaderLab.
 * Used by `SitePreloader` and `/preloader-test` so the test view matches production.
 */
export function PreloaderStage({
  counterDurationMs = PRELOADER_COUNTER_MS,
  className,
  ...rest
}: PreloaderStageProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ease-out",
        className
      )}
      style={FOREGROUND_STYLE}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.22]"
        style={ISOTIPO_BG_STYLE}
        aria-hidden
      />
      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <PreloaderLab counterDurationMs={counterDurationMs} />
      </div>
    </div>
  );
}
