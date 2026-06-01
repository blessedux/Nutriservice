/** Company history years shown in the Nosotros 3D gallery (every 2 image passes). */
export const NOSOTROS_TIMELINE_YEARS = [
  1993, 1996, 1999, 2003, 2006, 2009, 2012, 2015, 2018, 2021, 2024, 2026,
] as const;

export const IMAGES_PER_TIMELINE_YEAR = 2;

export const FINAL_TIMELINE_YEAR =
  NOSOTROS_TIMELINE_YEARS[NOSOTROS_TIMELINE_YEARS.length - 1];

export const FINAL_TIMELINE_YEAR_INDEX = NOSOTROS_TIMELINE_YEARS.length - 1;

export const MAX_TIMELINE_PASS_COUNT =
  NOSOTROS_TIMELINE_YEARS.length * IMAGES_PER_TIMELINE_YEAR;

export function yearIndexForPassCount(passCount: number): number | null {
  if (passCount < IMAGES_PER_TIMELINE_YEAR) return null;
  const index = Math.floor(passCount / IMAGES_PER_TIMELINE_YEAR) - 1;
  if (index < 0 || index >= NOSOTROS_TIMELINE_YEARS.length) return null;
  return index;
}

export function yearForPassCount(passCount: number): number | null {
  const index = yearIndexForPassCount(passCount);
  if (index === null) return null;
  return NOSOTROS_TIMELINE_YEARS[index];
}
