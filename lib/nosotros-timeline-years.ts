import {
  MAX_TIMELINE_IMAGE_INDEX,
  NOSOTROS_TIMELINE_YEARS,
  TIMELINE_INTRO_IMAGE_COUNT,
  yearForImageIndex,
  yearIndexForImageIndex,
} from "@/lib/nosotros-timeline-images";

export {
  IMAGES_PER_TIMELINE_YEAR,
  NOSOTROS_TIMELINE_YEARS,
  TIMELINE_FINALE_YEAR,
  TIMELINE_FRAMES_PER_YEAR,
  TIMELINE_INTRO_IMAGE_COUNT,
  TIMELINE_LAST_LABELED_YEAR,
  shouldShowYearLabelForYear,
} from "@/lib/nosotros-timeline-images";

/** Focal index at timeline end (last frame in sequence). */
export const MAX_TIMELINE_PASS_COUNT = MAX_TIMELINE_IMAGE_INDEX;

export const FINAL_TIMELINE_YEAR =
  NOSOTROS_TIMELINE_YEARS[NOSOTROS_TIMELINE_YEARS.length - 1];

export const FINAL_TIMELINE_YEAR_INDEX = NOSOTROS_TIMELINE_YEARS.length - 1;

/** @deprecated Use TIMELINE_INTRO_IMAGE_COUNT — intro is image indices 0..1. */
export const TIMELINE_INTRO_PASS_COUNT = TIMELINE_INTRO_IMAGE_COUNT;

/** passCount is the focal image index in NOSOTROS_TIMELINE_IMAGES. */
export function yearIndexForPassCount(passCount: number): number | null {
  return yearIndexForImageIndex(passCount);
}

export function yearForPassCount(passCount: number): number | null {
  return yearForImageIndex(passCount);
}
