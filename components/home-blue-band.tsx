import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Deep navy band below the hero — matches former `problema` spacer. */
export const HOME_BLUE_BG = "#030A1C";

/** Steel (#9EA3A8) ↔ light cyan — bottom of the industrias band. */
export const HOME_INDUSTRIES_BG = "#A8C8D6";

function mixHex(from: string, to: string, amount: number) {
  const parse = (hex: string) => {
    const n = Number.parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
  };
  const [fr, fg, fb] = parse(from);
  const [tr, tg, tb] = parse(to);
  const ch = (a: number, b: number) =>
    Math.round(a + (b - a) * amount)
      .toString(16)
      .padStart(2, "0");
  return `#${ch(fr, tr)}${ch(fg, tg)}${ch(fb, tb)}`;
}

/** Mid blend (~38% toward cyan) — shared seam between stats and industrias. */
export const HOME_INDUSTRIES_SEAM = mixHex(
  HOME_BLUE_BG,
  HOME_INDUSTRIES_BG,
  0.38,
);

/** Ocean-floor loop shared by stats (bottom) and industrias (top). */
export const OCEAN_FLOOR_VIDEO_SRC = "/ocean_floor.webm";

/** Zoom + anchor so the stats bottom edge matches industrias top ~25%. */
export const OCEAN_FLOOR_VIDEO_CLASSES =
  "origin-bottom scale-[1.12] object-cover object-bottom";

/** Extra zoom for industrias — stats keeps `OCEAN_FLOOR_VIDEO_CLASSES`. */
export const OCEAN_FLOOR_INDUSTRIES_VIDEO_CLASSES =
  "origin-bottom scale-[1.34] object-cover object-bottom";

type HomeBlueBandProps = {
  id: string;
  height?: "half" | "full";
  className?: string;
  children?: ReactNode;
  /** Vertical fade from navy into this color; fade starts late (see fadeAfterPercent). */
  fadeTo?: string;
  /** Section height % kept solid navy before the fade (default 78). */
  fadeAfterPercent?: number;
  "aria-label"?: string;
};

export function HomeBlueBand({
  id,
  height = "full",
  className,
  children,
  fadeTo,
  fadeAfterPercent = 78,
  "aria-label": ariaLabel,
}: HomeBlueBandProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "relative isolate flex shrink-0 scroll-mt-24 flex-col text-white",
        !fadeTo && "bg-[#030A1C]",
        height === "half" ? "min-h-[50dvh]" : "min-h-[100dvh]",
        className,
      )}
      style={
        fadeTo
          ? {
              background: `linear-gradient(to bottom, ${HOME_BLUE_BG} 0%, ${HOME_BLUE_BG} ${fadeAfterPercent}%, ${fadeTo} 100%)`,
            }
          : undefined
      }
    >
      {children}
    </section>
  );
}
