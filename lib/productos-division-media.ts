import type { ProductoDivisionSlug } from "@/lib/productos-divisions";

export const MASCOTAS_VIDEO_WEBM = "/nutriservice_cat_sequence_optimized.webm";
export const AVES_VIDEO_WEBM = "/nutriservice_chickens_light.webm";
export const PORCINA_VIDEO_WEBM = "/nutriservice_pigs_light.webm";

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
      mp4: "/Salmon_sequence_optimized.mp4",
      webm: "/Salmon_sequence_optimized.webm",
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
    fallbackImage: "/industries/porcina.webp",
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
