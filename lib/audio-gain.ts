/** Linear gain from decibels relative to full scale (Web Audio / `HTMLMediaElement.volume`). */
export function gainFromDb(db: number): number {
  return Math.pow(10, db / 20);
}

/** Máx. para música ambiental principal (p. ej. `First_Blossom.mp3`). */
export const AMBIENT_MUSIC_MAX_DB = -10;

export const AMBIENT_MUSIC_MAX_GAIN = gainFromDb(AMBIENT_MUSIC_MAX_DB);

/** Pista mar / salmón bajo el hero — mismo techo lineal que la música ambiental. */
export const HERO_SEA_AMBIENT_GAIN = AMBIENT_MUSIC_MAX_GAIN;

export const HERO_SEA_AUDIO_SRC = "/Sea_Underwater_mp3_2549177.mp3";
