"use client";

import Image from "next/image";
import { PUBLIC_ASSETS } from "@/lib/public-assets";
import {
  HOME_BLUE_BG,
  HomeBlueBand,
  OCEAN_FLOOR_STATS_VIDEO_CLASSES,
  OCEAN_FLOOR_VIDEO_SRC,
} from "@/components/home-blue-band";
import { cn } from "@/lib/utils";
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

      {/* Fallback Background Image (opacity-30) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-30 select-none"
      >
        <Image
          src={PUBLIC_ASSETS.industriesSection.backgroundImage}
          alt=""
          fill
          priority
          className="object-cover object-bottom"
          sizes="100vw"
        />
      </div>

      {/* motion-reduce fallback color */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] hidden bg-[#030A1C] motion-reduce:block"
      />

      {/* Background Video with Poster Fallback */}
      <video
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[125%] w-full motion-reduce:hidden",
          OCEAN_FLOOR_STATS_VIDEO_CLASSES,
        )}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={PUBLIC_ASSETS.industriesSection.backgroundImage}
        aria-hidden
      >
        <source src={OCEAN_FLOOR_VIDEO_SRC} type="video/webm" />
      </video>

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
