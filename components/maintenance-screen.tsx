"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

const FOREGROUND_STYLE = {
  "--color-foreground": "#f1f5f9",
} as CSSProperties;

const PRELOADER_BACKGROUND_IMAGE_SRC = PUBLIC_ASSETS.preloader.background;

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

export function MaintenanceScreen() {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#030A1C] px-6 py-16"
      style={FOREGROUND_STYLE}
    >
      {/* Dark backgrounds and overlays similar to PreloaderStage */}
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

      {/* Main Content Area: Centered Nutriservice Logo */}
      <div className="relative z-10 flex flex-1 w-full items-center justify-center">
        <div className="relative flex max-w-full items-center justify-center px-4">
          <Image
            src={PUBLIC_ASSETS.brand.logoWhite}
            alt="Nutriservice Logo"
            width={404}
            height={96}
            className="h-14 w-auto object-contain sm:h-20 md:h-24 animate-[fadeIn_1s_ease-out]"
            priority
          />
        </div>
      </div>

      {/* Bottom Centered Title */}
      <div className="relative z-10 w-full text-center pb-8 animate-[fadeIn_1.2s_ease-out]">
        <h1 className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/75 sm:text-[11px] md:text-xs">
          en mantenimiento, volvemos pronto
        </h1>
      </div>
    </div>
  );
}
