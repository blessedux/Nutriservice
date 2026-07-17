"use client";

import { PUBLIC_ASSETS } from "@/lib/public-assets";
import {
  HOME_BLUE_BG,
  HomeBlueBand,
  OCEAN_FLOOR_VIDEO_SRC,
} from "@/components/home-blue-band";
import { ResilientBgVideo } from "@/components/resilient-bg-video";
import { ProblemTrustStatsBar } from "@/components/problem-section";

export default function HomeStatsSection() {
  return (
    <HomeBlueBand
      id="estadisticas"
      height="half"
      aria-label="Trayectoria Nutriservice"
      className="min-h-[58dvh] justify-start overflow-hidden bg-transparent px-6 pt-8 pb-0 sm:min-h-[62dvh] sm:px-10 sm:pt-10 lg:px-12"
    >
      {/* Base Navy Background Color fallback */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[#030A1C]"
      />

      {/* Background Video with Lazy Loading */}
      <ResilientBgVideo
        videoSrc={OCEAN_FLOOR_VIDEO_SRC}
        posterSrc={PUBLIC_ASSETS.industriesSection.backgroundImage}
        className="z-[2]"
        videoClassName="!inset-x-0 !bottom-0 !h-[125%]"
        posterClassName="object-bottom opacity-30"
        posterPriority
      />

      {/* Top Gradient Seam */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background: `linear-gradient(to bottom, ${HOME_BLUE_BG} 0%, transparent 20%)`,
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl -translate-y-2 px-0 pb-10 sm:-translate-y-3 sm:pb-12">
        <ProblemTrustStatsBar />
      </div>
    </HomeBlueBand>
  );
}
