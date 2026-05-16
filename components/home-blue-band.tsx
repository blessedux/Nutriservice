import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Deep navy band below the hero — matches former `problema` spacer. */
export const HOME_BLUE_BG = "#030A1C";

type HomeBlueBandProps = {
  id: string;
  height?: "half" | "full";
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
};

export function HomeBlueBand({
  id,
  height = "full",
  className,
  children,
  "aria-label": ariaLabel,
}: HomeBlueBandProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "relative isolate flex shrink-0 scroll-mt-24 flex-col bg-[#030A1C] text-white",
        height === "half" ? "min-h-[50dvh]" : "min-h-[100dvh]",
        className,
      )}
    >
      {children}
    </section>
  );
}
