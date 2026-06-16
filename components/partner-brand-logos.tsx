import Image from "next/image";

import { PUBLIC_ASSETS } from "@/lib/public-assets";
import { cn } from "@/lib/utils";

export const PARTNER_BRAND_LOGOS = [
  {
    src: PUBLIC_ASSETS.maquilaSection.logos.biorigin,
    alt: "Biorigin",
    width: 132,
    height: 36,
    invert: true,
  },
  {
    src: PUBLIC_ASSETS.maquilaSection.logos.agrifirm,
    alt: "Agrifirm",
    width: 132,
    height: 36,
    invert: true,
  },
  {
    src: PUBLIC_ASSETS.maquilaSection.logos.nucienci,
    alt: "Nucienci",
    width: 132,
    height: 36,
    invert: true,
  },
  {
    src: PUBLIC_ASSETS.maquilaSection.logos.bioiberica,
    alt: "Bioibérica",
    width: 320,
    height: 125,
    invert: false,
  },
  {
    src: PUBLIC_ASSETS.maquilaSection.logos.tinveun,
    alt: "Tinveun",
    width: 228,
    height: 36,
    invert: true,
  },
] as const;

type PartnerBrandLogosProps = {
  className?: string;
  layout?: "end" | "center";
  /** `lg` doubles logo size — used on industry division pages. */
  size?: "default" | "lg";
};

export default function PartnerBrandLogos({
  className,
  layout = "end",
  size = "default",
}: PartnerBrandLogosProps) {
  const isLarge = size === "lg";

  return (
    <ul
      className={cn(
        "flex flex-wrap items-center",
        isLarge
          ? "gap-x-8 gap-y-6 sm:gap-x-10 sm:gap-y-7"
          : "gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-5",
        layout === "center" ? "justify-center" : "justify-end",
        className,
      )}
      aria-label="Marcas internacionales representadas por Nutriservice"
    >
      {PARTNER_BRAND_LOGOS.map((logo) => (
        <li key={logo.src} className="flex shrink-0 items-center justify-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={isLarge ? logo.width * 2 : logo.width}
            height={isLarge ? logo.height * 2 : logo.height}
            className={cn(
              "w-auto object-contain",
              logo.invert ? "opacity-80 brightness-0 invert" : "opacity-90",
              isLarge
                ? logo.alt === "Bioibérica"
                  ? "h-12 max-w-[14rem] sm:h-14 sm:max-w-[16rem]"
                  : logo.alt === "Tinveun"
                    ? "h-8 max-w-[14rem] sm:h-9 sm:max-w-[16rem]"
                    : "h-14 max-w-[11rem] sm:h-16 sm:max-w-[13rem]"
                : logo.alt === "Bioibérica"
                  ? "h-6 max-w-[7.5rem] sm:h-7 sm:max-w-[8.5rem]"
                  : logo.alt === "Tinveun"
                    ? "h-4 max-w-[7.5rem] sm:h-5 sm:max-w-[8.5rem]"
                    : "h-7 max-w-[5.5rem] sm:h-8 sm:max-w-[6.5rem]",
            )}
          />
        </li>
      ))}
    </ul>
  );
}
