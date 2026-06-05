/** Linear gain from decibels relative to full scale (Web Audio / `HTMLMediaElement.volume`). */
export function gainFromDb(db: number): number {
  return Math.pow(10, db / 20);
}

/** Máx. para música ambiental principal (p. ej. `First_Blossom.mp3`). */
export const AMBIENT_MUSIC_MAX_DB = -10;

const AMBIENT_MUSIC_PEAK_GAIN = gainFromDb(AMBIENT_MUSIC_MAX_DB);

/** Default unmuted level for navbar ambient music — 60% of peak. */
export const AMBIENT_MUSIC_DEFAULT_VOLUME_RATIO = 0.6;

export const AMBIENT_MUSIC_MAX_GAIN =
  AMBIENT_MUSIC_PEAK_GAIN * AMBIENT_MUSIC_DEFAULT_VOLUME_RATIO;

/** Pista mar / salmón bajo el hero — techo lineal sin reducción de default. */
export const HERO_SEA_AMBIENT_GAIN = AMBIENT_MUSIC_PEAK_GAIN;

import { PUBLIC_ASSETS } from "@/lib/public-assets";

export const HERO_SEA_AUDIO_SRC = PUBLIC_ASSETS.audio.heroSeaUnderwater;
