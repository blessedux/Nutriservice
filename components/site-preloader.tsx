"use client";

import { useEffect, useState } from "react";
import { PreloaderStage, PRELOADER_COUNTER_MS } from "@/components/preloader-stage";

/** Debe cubrir al menos la subida del contador para que llegue a 100 % */
const MIN_VISIBLE_MS = 2800;

export function SitePreloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const started = performance.now();
    let timeoutId: number | undefined;

    const scheduleHide = () => {
      const elapsed = performance.now() - started;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      timeoutId = window.setTimeout(() => setVisible(false), wait);
    };

    if (document.readyState === "complete") {
      scheduleHide();
    } else {
      window.addEventListener("load", scheduleHide, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleHide);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!visible) return null;

  return (
    <PreloaderStage
      counterDurationMs={PRELOADER_COUNTER_MS}
      aria-busy="true"
      aria-label="Cargando"
    />
  );
}
