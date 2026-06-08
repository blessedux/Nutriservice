"use client";

import { useState } from "react";
import { PreloaderStage } from "@/components/preloader-stage";

/** Test wrapper — simulates the Enter gate in isolation at /preloader-test */
export function PreloaderStageTest() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#030A1C]">
        <p className="font-mono text-sm text-white/60">
          Preloader dismissed — refresh to repeat.
        </p>
      </div>
    );
  }

  return (
    <PreloaderStage
      enterReady
      onEnter={() => setDone(true)}
      aria-busy="true"
      aria-label="Vista de prueba del preloader"
    />
  );
}
