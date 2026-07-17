/**
 * Detects whether the current device should attempt background video playback.
 *
 * Skips video when any of:
 * - prefers-reduced-motion
 * - saveData enabled
 * - Slow connection (2g, slow-2g)
 * - Low device memory (≤ 4 GB)
 * - Low CPU (≤ 4 threads)
 *
 * Call this once after hydration — it reads browser-only APIs.
 */

export type VideoCapability = "full" | "skip";

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
}

export function shouldAttemptBackgroundVideo(): boolean {
  if (typeof window === "undefined") return true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  const nav = navigator as Navigator & {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  };

  const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;

  if (connection?.saveData === true) {
    return false;
  }

  if (
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g"
  ) {
    return false;
  }

  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === "number" && mem <= 4) return false;

  const cpus = navigator.hardwareConcurrency;
  if (typeof cpus === "number" && cpus <= 4) return false;

  return true;
}

export function getVideoCapability(): VideoCapability {
  return shouldAttemptBackgroundVideo() ? "full" : "skip";
}
