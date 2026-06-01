import Image from "next/image";

import { PUBLIC_ASSETS } from "@/lib/public-assets";
import { cn } from "@/lib/utils";

export const PARTNER_BRAND_LOGOS = [
  {
    src: PUBLIC_ASSETS.maquilaSection.logos.biorigin,
    alt: "Biorigin",
    width: 132,
    height: 36,
  },
  {
    src: PUBLIC_ASSETS.maquilaSection.logos.agrifirm,
    alt: "Agrifirm",
    width: 132,
    height: 36,
  },
  {
    src: PUBLIC_ASSETS.maquilaSection.logos.nucienci,
    alt: "Nucienci",
    width: 132,
    height: 36,
  },
  {
    src: PUBLIC_ASSETS.maquilaSection.logos.bioiberica,
    alt: "Bioibérica",
    width: 230,
    height: 129,
  },
] as const;

type PartnerBrandLogosProps = {
  className?: string;
  layout?: "end" | "center";
};

export default function PartnerBrandLogos({
  className,
  layout = "end",
}: PartnerBrandLogosProps) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-5",
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
            width={logo.width}
            height={logo.height}
            className={cn(
              "h-7 w-auto object-contain opacity-80 brightness-0 invert sm:h-8",
              logo.alt === "Bioibérica"
                ? "max-w-[6.5rem] sm:max-w-[7.5rem]"
                : "max-w-[5.5rem] sm:max-w-[6.5rem]",
            )}
          />
        </li>
      ))}
    </ul>
  );
}
