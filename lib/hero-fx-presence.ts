import { clampGain } from "@/lib/audio-fade";

/** Smooth 0→1 edge for scroll-driven FX gain. */
export function smoothPresence(t: number): number {
  const x = clampGain(t, 0, 1);
  return x * x * (3 - 2 * x);
}

/**
 * Stays near full level early, then eases to zero.
 */
function longFadeOut(fadeProgress: number): number {
  const x = clampGain(fadeProgress, 0, 1);
  const u = 1 - x;
  return u * u * u;
}

const FX_ZONE_SECTION_IDS = ["inicio", "certificaciones", "estadisticas"] as const;
const FX_FADE_OUT_SECTION_ID = "industrias";

/** Hold full SFX briefly before attenuation begins on scroll. */
const FADE_BEGIN_SCROLL_PX = 120;

/**
 * Industrias top at or above this viewport line → SFX off (section reached, not passed).
 * Lower ratio = fade completes later (closer to industrias taking the screen).
 */
const INDUSTRIES_ARRIVAL_TOP_RATIO = 0.34;

/** Extra headroom before position-based fade ramps up. */
const INDUSTRIES_FADE_POSITION_HEADROOM_VH = 1.9;

function getZoneElements(): HTMLElement[] {
  if (typeof document === "undefined") return [];
  return FX_ZONE_SECTION_IDS.map((id) => document.getElementById(id)).filter(
    (el): el is HTMLElement => el != null,
  );
}

function zoneBounds(nodes: HTMLElement[]) {
  let top = Infinity;
  let bottom = -Infinity;
  for (const el of nodes) {
    const r = el.getBoundingClientRect();
    top = Math.min(top, r.top);
    bottom = Math.max(bottom, r.bottom);
  }
  return { top, bottom };
}

function scrollYWhenIndustriesArrives(
  industries: HTMLElement,
  arrivalTopPx: number,
): number {
  return window.scrollY + industries.getBoundingClientRect().top - arrivalTopPx;
}

/**
 * Fade begins as soon as the user scrolls down; silent once industrias is reached.
 */
function measureScrollToIndustriesFade(): number {
  const industries = document.getElementById(FX_FADE_OUT_SECTION_ID);
  if (!industries) return 1;

  const vh = window.innerHeight;
  const ir = industries.getBoundingClientRect();
  const arrivalTop = vh * INDUSTRIES_ARRIVAL_TOP_RATIO;

  if (ir.top <= arrivalTop) return 0;

  const scrollY = window.scrollY;
  if (scrollY <= FADE_BEGIN_SCROLL_PX) return 1;

  const arrivalScroll = scrollYWhenIndustriesArrives(industries, arrivalTop);
  const span = Math.max(arrivalScroll - FADE_BEGIN_SCROLL_PX, vh * 0.55);

  const scrollProgress = clampGain(
    (scrollY - FADE_BEGIN_SCROLL_PX) / span,
    0,
    1,
  );

  const fadeStartTop = arrivalTop + vh * INDUSTRIES_FADE_POSITION_HEADROOM_VH;
  const positionProgress = clampGain(
    (fadeStartTop - ir.top) / (fadeStartTop - arrivalTop),
    0,
    1,
  );

  const fadeProgress = Math.max(scrollProgress, positionProgress);
  return longFadeOut(fadeProgress);
}

/**
 * 0–1 SFX presence: full at page top, fades from first scroll, silent on reaching industrias.
 */
export function measureHomeFxPresence(): number {
  const zone = getZoneElements();
  if (zone.length === 0) return 0;

  const { top, bottom } = zoneBounds(zone);
  const vh = window.innerHeight;

  if (top >= vh) return 0;
  if (bottom <= 0) return 0;

  return clampGain(measureScrollToIndustriesFade(), 0, 1);
}

/** @deprecated Use {@link measureHomeFxPresence}. */
export function measureHeroFxPresence(
  _root?: HTMLElement | null,
  _fadeDistancePx?: number,
): number {
  return measureHomeFxPresence();
}
