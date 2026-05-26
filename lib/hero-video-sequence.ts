import {
  AVES_VIDEO_WEBM,
  MASCOTAS_VIDEO_WEBM,
} from "@/lib/productos-division-media";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export type HeroVideoClip = {
  webm: string;
  mp4?: string;
  /** How many full playthroughs before crossfading to the next clip. */
  playsBeforeAdvance: number;
  /** After the first playthrough, loop this clip indefinitely. */
  loopAfterFirstPlay?: boolean;
};

export const HERO_SALMON_CLIP_INDEX = 0;

export type HeroVideoClipChangeDetail = {
  clipIndex: number;
  isSalmon: boolean;
};

export function dispatchHeroVideoClipChange(clipIndex: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<HeroVideoClipChangeDetail>("hyperia:hero-video-clip", {
      detail: {
        clipIndex,
        isSalmon: clipIndex === HERO_SALMON_CLIP_INDEX,
      },
    }),
  );
}

export const HERO_LANDING_VIDEO_SEQUENCE: HeroVideoClip[] = [
  {
    webm: PUBLIC_ASSETS.hero.salmonWebm,
    mp4: PUBLIC_ASSETS.hero.salmonMp4,
    playsBeforeAdvance: 2,
  },
  {
    webm: MASCOTAS_VIDEO_WEBM,
    playsBeforeAdvance: 1,
  },
  {
    webm: AVES_VIDEO_WEBM,
    playsBeforeAdvance: 1,
  },
];
