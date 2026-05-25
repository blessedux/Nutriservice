import type { ProductoDivisionSlug } from "@/lib/productos-divisions";

export type DivisionMedia = {
  video?: { mp4: string; webm: string };
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
    fallbackImage: "/industries/avicola.webp",
    tone: "on-light",
  },
  cerdos: {
    fallbackImage: "/industries/porcina.webp",
    tone: "on-light",
  },
  mascotas: {
    fallbackImage: "/industries/mascotas.webp",
    tone: "on-light",
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
