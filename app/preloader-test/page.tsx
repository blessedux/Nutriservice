import type { Metadata } from "next";
import { PreloaderStage } from "@/components/preloader-stage";

export const metadata: Metadata = {
  title: "DNA preloader (test)",
  description: "Vista de prueba del preloader a pantalla completa (misma capa que en producción).",
  robots: { index: false, follow: false },
};

/** Misma UI que el overlay inicial en `SiteExperience`: fixed inset-0, isotipo, PreloaderLab. */
export default function PreloaderTestPage() {
  return (
    <PreloaderStage
      aria-busy="true"
      aria-label="Vista de prueba del preloader"
    />
  );
}
