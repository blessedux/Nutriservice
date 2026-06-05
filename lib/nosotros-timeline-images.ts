import { PUBLIC_ASSETS } from "@/lib/public-assets";

export type TimelineGalleryImage = {
  src: string;
  alt: string;
  /** Year parsed from filename; null for intro frames. */
  year: number | null;
};

const T = PUBLIC_ASSETS.timeline;

type TimelineYearEntry = {
  year: number;
  /** One or two frames; slot 0 = left (A), slot 1 = right (B). */
  frames: [string] | [string, string];
  /** When false, the large year numeral is hidden (e.g. 2026 finale). */
  showYearLabel?: boolean;
  /** Force horizontal slot when a year has a single frame (e.g. 2026 on the right). */
  slot?: 0 | 1;
};

const TIMELINE_YEAR_ENTRIES: TimelineYearEntry[] = [
  { year: 1993, frames: [T.y1993A, T.y1993B] },
  { year: 1995, frames: [T.y1995A, T.y1995B] },
  { year: 1999, frames: [T.y1999A, T.y1999B] },
  { year: 2003, frames: [T.y2003A, T.y2003B] },
  { year: 2005, frames: [T.y2005A, T.y2005B] },
  { year: 2009, frames: [T.y2009A, T.y2009B] },
  { year: 2015, frames: [T.y2015A, T.y2015B] },
  { year: 2019, frames: [T.y2019A, T.y2019B] },
  { year: 2024, frames: [T.y2024A] },
  { year: 2026, frames: [T.y2026B], showYearLabel: false, slot: 1 },
];

/** Teaser pair before 1993 — not tied to year labels. */
const TIMELINE_INTRO_FRAMES: TimelineGalleryImage[] = [
  { src: T.y2009B, alt: "Nutriservice, nuestra historia", year: null },
  { src: T.y2026B, alt: "Nutriservice, nuestra historia", year: null },
];

function buildHistoryFrames(): TimelineGalleryImage[] {
  return TIMELINE_YEAR_ENTRIES.flatMap(({ year, frames }) =>
    frames.map((src) => ({
      src,
      alt: `Nutriservice, ${year}`,
      year,
    })),
  );
}

const TIMELINE_HISTORY_FRAMES = buildHistoryFrames();

/** Frame count per chronological year (after intro). */
export const TIMELINE_FRAMES_PER_YEAR = TIMELINE_YEAR_ENTRIES.map(
  (entry) => entry.frames.length,
);

/** Strict scroll order: intro (2) → chronological years. */
export const NOSOTROS_TIMELINE_IMAGES: TimelineGalleryImage[] = [
  ...TIMELINE_INTRO_FRAMES,
  ...TIMELINE_HISTORY_FRAMES,
];

export const TIMELINE_INTRO_IMAGE_COUNT = TIMELINE_INTRO_FRAMES.length;

/** Matches DEFAULT_DEPTH_RANGE in the timeline 3D gallery. */
export const TIMELINE_DEPTH_RANGE = 120;

/** Title fades over half the intro image scroll span (was full 2-image intro). */
export const TITLE_INTRO_FADE_FRACTION = 0.5;

export function getTitleIntroFadeScrollDistance(
  visibleCount = 8,
  depthRange = TIMELINE_DEPTH_RANGE,
): number {
  const spacing = getTimelinePlaneSpacing(visibleCount, depthRange);
  return (
    TIMELINE_INTRO_IMAGE_COUNT * spacing * TITLE_INTRO_FADE_FRACTION
  );
}

/** Equal depth gap between consecutive frames in the timeline hallway. */
export function getTimelinePlaneSpacing(
  visibleCount = 8,
  depthRange = TIMELINE_DEPTH_RANGE,
): number {
  return depthRange / Math.max(visibleCount, 1);
}

/** Extra scroll on the finale frame before the closing title appears. */
export const TIMELINE_FINALE_TITLE_SCROLL_DELAY = 0.48;

export function getFinaleTitleScrollThreshold(
  visibleCount = 8,
  depthRange = TIMELINE_DEPTH_RANGE,
): number {
  const spacing = getTimelinePlaneSpacing(visibleCount, depthRange);
  return (
    MAX_TIMELINE_IMAGE_INDEX * spacing +
    TIMELINE_FINALE_TITLE_SCROLL_DELAY * spacing
  );
}

/** Timeline completes when the finale title should appear. */
export function getMaxTimelineScrollDistance(
  visibleCount = 8,
  depthRange = TIMELINE_DEPTH_RANGE,
): number {
  return getFinaleTitleScrollThreshold(visibleCount, depthRange);
}

export const TIMELINE_IMAGE_COUNT = NOSOTROS_TIMELINE_IMAGES.length;

/** One representative slide per chronological year — used by the CSS fallback timeline. */
export type TimelineYearSlide = {
  year: number;
  src: string;
  alt: string;
};

export const TIMELINE_YEAR_SLIDES: TimelineYearSlide[] =
  TIMELINE_YEAR_ENTRIES.map(({ year, frames }) => ({
    year,
    src: frames[0],
    alt: `Nutriservice, ${year}`,
  }));

/** @deprecated Most years use 2 frames; 2026 uses 1. Prefer TIMELINE_FRAMES_PER_YEAR. */
export const IMAGES_PER_TIMELINE_YEAR = 2;

/** Chronological years after the intro pair. */
export const NOSOTROS_TIMELINE_YEARS = TIMELINE_YEAR_ENTRIES.map(
  (entry) => entry.year,
);

/** Finale frame — milestone copy only, no year numeral. */
export const TIMELINE_FINALE_YEAR = 2026;

export const TIMELINE_LAST_LABELED_YEAR = 2024;

export function shouldShowYearLabelForYear(year: number): boolean {
  const entry = TIMELINE_YEAR_ENTRIES.find((item) => item.year === year);
  return entry?.showYearLabel !== false;
}

export function isFinaleImageIndex(imageIndex: number): boolean {
  return yearForImageIndex(imageIndex) === TIMELINE_FINALE_YEAR;
}

/** Last focal image index (inclusive). */
export const MAX_TIMELINE_IMAGE_INDEX = TIMELINE_IMAGE_COUNT - 1;

export function isIntroImageIndex(imageIndex: number): boolean {
  return imageIndex >= 0 && imageIndex < TIMELINE_INTRO_IMAGE_COUNT;
}

function getHistorySlot(imageIndex: number): number | null {
  if (isIntroImageIndex(imageIndex)) return null;
  return imageIndex - TIMELINE_INTRO_IMAGE_COUNT;
}

export function yearIndexForImageIndex(imageIndex: number): number | null {
  const historySlot = getHistorySlot(imageIndex);
  if (historySlot === null || historySlot < 0) return null;

  let offset = 0;
  for (let yearIndex = 0; yearIndex < TIMELINE_FRAMES_PER_YEAR.length; yearIndex++) {
    const frameCount = TIMELINE_FRAMES_PER_YEAR[yearIndex];
    if (historySlot < offset + frameCount) return yearIndex;
    offset += frameCount;
  }
  return null;
}

export function yearForImageIndex(imageIndex: number): number | null {
  const yearIndex = yearIndexForImageIndex(imageIndex);
  if (yearIndex === null) return null;
  return NOSOTROS_TIMELINE_YEARS[yearIndex];
}

/** Which slot (0 = left/A, 1 = right/B) within the year for this image index. */
export function slotInYearForImageIndex(imageIndex: number): 0 | 1 | null {
  const historySlot = getHistorySlot(imageIndex);
  if (historySlot === null || historySlot < 0) return null;

  let offset = 0;
  for (let yearIndex = 0; yearIndex < TIMELINE_FRAMES_PER_YEAR.length; yearIndex++) {
    const frameCount = TIMELINE_FRAMES_PER_YEAR[yearIndex];
    if (historySlot < offset + frameCount) {
      const slotInYear = (historySlot - offset) as 0 | 1;
      const forcedSlot = TIMELINE_YEAR_ENTRIES[yearIndex]?.slot;
      return forcedSlot ?? slotInYear;
    }
    offset += frameCount;
  }
  return null;
}

/** Horizontal side in the 3D hallway: slot 0 = left, slot 1 = right. */
export function getTimelineSideForImageIndex(imageIndex: number): -1 | 1 {
  if (isIntroImageIndex(imageIndex)) {
    return imageIndex % 2 === 0 ? -1 : 1;
  }
  const slot = slotInYearForImageIndex(imageIndex);
  return slot === 1 ? 1 : -1;
}

export function getTimelineXForImageIndex(
  imageIndex: number,
  xOffset: number,
): number {
  return getTimelineSideForImageIndex(imageIndex) * xOffset;
}
