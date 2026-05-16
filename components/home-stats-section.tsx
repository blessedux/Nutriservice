"use client";

import { HomeBlueBand } from "@/components/home-blue-band";
import { ProblemTrustStatsBar } from "@/components/problem-section";

export default function HomeStatsSection() {
  return (
    <HomeBlueBand
      id="estadisticas"
      height="half"
      aria-label="Trayectoria Nutriservice"
      className="justify-center px-6 py-10 sm:px-10 lg:px-12"
    >
      <div className="mx-auto w-full max-w-6xl">
        <ProblemTrustStatsBar />
      </div>
    </HomeBlueBand>
  );
}
