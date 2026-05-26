import type { ProductoDivisionSlug } from "@/lib/productos-divisions";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export const MASCOTAS_VIDEO_WEBM = PUBLIC_ASSETS.divisionVideo.mascotas;
export const AVES_VIDEO_WEBM = PUBLIC_ASSETS.divisionVideo.aves;
export const PORCINA_VIDEO_WEBM = PUBLIC_ASSETS.divisionVideo.porcina;

export type DivisionMedia = {
  video?: { mp4?: string; webm: string };
  /** Static backdrop when no video is configured yet. */
  fallbackImage?: string;
  tone: "on-dark" | "on-light";
};

export const PRODUCTO_DIVISION_MEDIA: Record<
  ProductoDivisionSlug,
  DivisionMedia
> = {
  acuicola: {
    video: {
      mp4: PUBLIC_ASSETS.hero.salmonMp4,
      webm: PUBLIC_ASSETS.hero.salmonWebm,
    },
    tone: "on-dark",
  },
  aves: {
    video: {
      webm: AVES_VIDEO_WEBM,
    },
    tone: "on-dark",
  },
  cerdos: {
    fallbackImage: PUBLIC_ASSETS.industryPages.fallbackPorcina,
    tone: "on-light",
  },
  mascotas: {
    video: {
      webm: MASCOTAS_VIDEO_WEBM,
    },
    tone: "on-dark",
  },
};

export function getDivisionMedia(
  division: ProductoDivisionSlug,
): DivisionMedia {
  return PRODUCTO_DIVISION_MEDIA[division];
}

export function divisionHasVideo(division: ProductoDivisionSlug): boolean {
  return Boolean(PRODUCTO_DIVISION_MEDIA[division].video);
}
