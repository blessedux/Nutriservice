"use client";

import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { PreloaderLab } from "@/components/preloader-lab";
import { PUBLIC_ASSETS } from "@/lib/public-assets";
import { cn } from "@/lib/utils";

export const PRELOADER_COUNTER_MS = 2400;

export const PRELOADER_BACKGROUND_IMAGE_SRC = PUBLIC_ASSETS.preloader.background;

const FOREGROUND_STYLE = {
  "--color-foreground": "#f1f5f9",
} as CSSProperties;

const PRELOADER_IMG_STYLE = {
  backgroundImage: `url(${PRELOADER_BACKGROUND_IMAGE_SRC})`,
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
} as CSSProperties;

const ISOTIPO_BG_STYLE = {
  backgroundImage: `url(${PUBLIC_ASSETS.brand.isotipo})`,
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
 * Shared fullscreen shell: underwater plate, marca isotipo suave y PreloaderLab.
 * Used by `SiteExperience` y `/preloader-test` para que la prueba coincida con producción.
 */
function requestAmbientSoundStart() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("hyperia:start-sound"));
}

export function PreloaderStage({
  counterDurationMs = PRELOADER_COUNTER_MS,
  className,
  ...rest
}: PreloaderStageProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-[#030A1C] transition-opacity duration-500 ease-out",
        className
      )}
      style={FOREGROUND_STYLE}
      {...rest}
      onPointerDownCapture={(e) => {
        requestAmbientSoundStart();
        rest.onPointerDownCapture?.(e);
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[#030A1C]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={PRELOADER_IMG_STYLE}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[#030A1C]/35" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.06]"
        style={ISOTIPO_BG_STYLE}
        aria-hidden
      />
      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <PreloaderLab counterDurationMs={counterDurationMs} />
      </div>
    </div>
  );
}
