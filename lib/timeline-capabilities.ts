/**
 * Detects whether the current device is "low-tier" for the WebGL timeline.
 *
 * Low-tier means any of:
 * - prefers-reduced-motion
 * - Reported device memory ≤ 4 GB
 * - CPU thread count ≤ 4
 * - WebGL software renderer (SwiftShader, LLVMpipe, Microsoft Basic Render, etc.)
 *
 * Call this once after hydration — it reads browser-only APIs.
 */

export type TimelineTier = "high" | "low";

const SOFTWARE_RENDERER_RE =
  /swiftshader|software|llvmpipe|microsoft basic render|google swiftshader/i;

export function getTimelineTier(): TimelineTier {
  if (typeof window === "undefined") return "high";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "low";
  }

  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === "number" && mem <= 4) return "low";

  const cpus = navigator.hardwareConcurrency;
  if (typeof cpus === "number" && cpus <= 4) return "low";

  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return "low";

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const renderer = gl.getParameter(
        ext.UNMASKED_RENDERER_WEBGL,
      ) as string;
      if (SOFTWARE_RENDERER_RE.test(renderer)) return "low";
    }
  } catch {
    // Ignore — conservative path still runs WebGL
  }

  return "high";
}
