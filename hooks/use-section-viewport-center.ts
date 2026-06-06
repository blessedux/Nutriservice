"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

const DEFAULT_TOLERANCE_RATIO = 0.12;

export function measureSectionCentered(
  el: HTMLElement,
  toleranceRatio = DEFAULT_TOLERANCE_RATIO,
) {
  const rect = el.getBoundingClientRect();
  const elementCenterY = rect.top + rect.height / 2;
  const viewportCenterY = window.innerHeight / 2;
  const tolerance = window.innerHeight * toleranceRatio;
  return Math.abs(elementCenterY - viewportCenterY) <= tolerance;
}

export function waitForSectionCentered(
  el: HTMLElement,
  toleranceRatio = DEFAULT_TOLERANCE_RATIO,
  timeoutMs = 1600,
) {
  return new Promise<void>((resolve) => {
    const start = performance.now();

    const tick = () => {
      if (measureSectionCentered(el, toleranceRatio)) {
        resolve();
        return;
      }
      if (performance.now() - start >= timeoutMs) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };

    tick();
  });
}

export function useSectionViewportCenter(
  ref: RefObject<HTMLElement | null>,
  toleranceRatio = DEFAULT_TOLERANCE_RATIO,
) {
  const [isCentered, setIsCentered] = useState(false);
  const toleranceRatioRef = useRef(toleranceRatio);
  toleranceRatioRef.current = toleranceRatio;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      setIsCentered(
        measureSectionCentered(el, toleranceRatioRef.current),
      );
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [ref]);

  const snapToCenter = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      ref.current?.scrollIntoView({ behavior, block: "center" });
    },
    [ref],
  );

  return { isCentered, snapToCenter };
}

export function useNosotrosTimelineScrollSnap(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const html = document.documentElement;
    const previousSnapType = html.style.scrollSnapType;
    const previousScrollPaddingTop = html.style.scrollPaddingTop;

    html.style.scrollSnapType = "y proximity";
    html.style.scrollPaddingTop = "6rem";

    return () => {
      html.style.scrollSnapType = previousSnapType;
      html.style.scrollPaddingTop = previousScrollPaddingTop;
    };
  }, [enabled]);
}
