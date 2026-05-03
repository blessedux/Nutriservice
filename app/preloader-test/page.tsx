import type { Metadata } from "next";
import { PreloaderStage } from "@/components/preloader-stage";

export const metadata: Metadata = {
  title: "DNA preloader (test)",
  description: "Vista de prueba del preloader a pantalla completa (misma capa que en producción).",
  robots: { index: false, follow: false },
};

/** Misma UI que `SitePreloader`: fixed inset-0, isotipo, z-index, PreloaderLab. */
export default function PreloaderTestPage() {
  return (
    <PreloaderStage
      aria-busy="true"
      aria-label="Vista de prueba del preloader"
    />
  );
}
