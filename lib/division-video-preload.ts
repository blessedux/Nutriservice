import { PRODUCTO_DIVISION_MEDIA } from "@/lib/productos-division-media";
import type { ProductoDivisionSlug } from "@/lib/productos-divisions";

export type DivisionVideoSource = {
  slug: ProductoDivisionSlug;
  mp4?: string;
  webm: string;
};

const PRELOAD_TIMEOUT_MS = 18_000;

function sourceKey(src: { mp4?: string; webm: string }) {
  return `${src.mp4 ?? ""}\0${src.webm}`;
}

/** One entry per division that has a configured backdrop video. */
export function getDivisionVideoSources(): DivisionVideoSource[] {
  const entries: DivisionVideoSource[] = [];
  for (const slug of Object.keys(
    PRODUCTO_DIVISION_MEDIA,
  ) as ProductoDivisionSlug[]) {
    const video = PRODUCTO_DIVISION_MEDIA[slug].video;
    if (!video) continue;
    entries.push({ slug, mp4: video.mp4, webm: video.webm });
  }
  return entries;
}

/** Unique MP4/WebM URLs across divisions (acuícola MP4 is separate from its WebM). */
export function getUniqueDivisionVideoUrls(): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const entry of getDivisionVideoSources()) {
    if (entry.mp4 && !seen.has(entry.mp4)) {
      seen.add(entry.mp4);
      urls.push(entry.mp4);
    }
    if (!seen.has(entry.webm)) {
      seen.add(entry.webm);
      urls.push(entry.webm);
    }
  }
  return urls;
}

function preloadVideoElement(src: {
  mp4?: string;
  webm: string;
}): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();

  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      video.removeAttribute("src");
      while (video.firstChild) video.removeChild(video.firstChild);
      video.load();
      resolve();
    };

    const onReady = () => finish();
    video.addEventListener("canplaythrough", onReady, { once: true });
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", onReady, { once: true });

    window.setTimeout(finish, PRELOAD_TIMEOUT_MS);

    if (src.mp4) {
      const mp4 = document.createElement("source");
      mp4.src = src.mp4;
      mp4.type = "video/mp4";
      video.appendChild(mp4);
    }
    const webm = document.createElement("source");
    webm.src = src.webm;
    webm.type = "video/webm";
    video.appendChild(webm);
    video.load();
  });
}

function injectLinkPreloads() {
  if (typeof document === "undefined") return;
  for (const href of getUniqueDivisionVideoUrls()) {
    const existing = document.querySelector(
      `link[data-division-video-preload="${href}"]`,
    );
    if (existing) continue;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = href;
    link.type = href.endsWith(".mp4") ? "video/mp4" : "video/webm";
    link.setAttribute("data-division-video-preload", href);
    document.head.appendChild(link);
  }
}

let preloadPromise: Promise<void> | null = null;

/**
 * Warms the browser cache for all product-division backdrop videos.
 * Safe to call multiple times (deduped).
 */
export function preloadDivisionVideos(): Promise<void> {
  if (preloadPromise) return preloadPromise;

  injectLinkPreloads();

  const unique = new Map<string, { mp4?: string; webm: string }>();
  for (const entry of getDivisionVideoSources()) {
    const key = sourceKey(entry);
    if (!unique.has(key)) unique.set(key, entry);
  }

  preloadPromise = Promise.all(
    [...unique.values()].map((src) => preloadVideoElement(src)),
  ).then(() => undefined);

  return preloadPromise;
}
