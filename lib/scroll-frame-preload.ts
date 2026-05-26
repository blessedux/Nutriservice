/**
 * Shared scroll-frame image preload (deduped per sequence).
 * Uses bounded concurrency so we warm the HTTP cache + image decoder without stalling the main thread.
 */

function pad4(n: number) {
  return String(n).padStart(4, "0");
}

export function scrollFrameUrl(framesDir: string, frameNumber: number) {
  return `${framesDir}/frame_${pad4(frameNumber)}.webp`;
}

export type ScrollFramePreloadSpec = {
  framesDir: string;
  frameCount: number;
  firstFrameNumber: number;
  /** Parallel loads (default 12). */
  concurrency?: number;
};

export { HOMEPAGE_PELLET_FRAMES } from "@/lib/public-assets";

const preloadPromises = new Map<string, Promise<void>>();

function cacheKey(spec: ScrollFramePreloadSpec) {
  return `${spec.framesDir}\0${spec.frameCount}\0${spec.firstFrameNumber}`;
}

/**
 * Preloads every frame in the sequence. Safe to call from multiple components;
 * returns the same promise for identical specs.
 */
export function preloadScrollFrames(spec: ScrollFramePreloadSpec): Promise<void> {
  const key = cacheKey(spec);
  const existing = preloadPromises.get(key);
  if (existing) return existing;

  const {
    framesDir,
    frameCount,
    firstFrameNumber,
    concurrency: concurrencyIn,
  } = spec;
  const concurrency = Math.max(1, Math.min(concurrencyIn ?? 12, frameCount));

  const urls: string[] = [];
  for (let i = 0; i < frameCount; i++) {
    urls.push(scrollFrameUrl(framesDir, firstFrameNumber + i));
  }

  const promise = new Promise<void>((resolve) => {
    if (urls.length === 0) {
      resolve();
      return;
    }

    let cursor = 0;
    let inflight = 0;
    let finished = 0;

    const pump = () => {
      while (inflight < concurrency && cursor < urls.length) {
        const url = urls[cursor++];
        inflight++;
        const img = new Image();
        img.onload = img.onerror = () => {
          inflight--;
          finished++;
          if (finished >= urls.length) resolve();
          else pump();
        };
        img.src = url;
      }
    };

    pump();
  });

  preloadPromises.set(key, promise);
  return promise;
}
