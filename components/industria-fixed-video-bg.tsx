"use client";

import DivisionVideoBg from "@/components/division-video-bg";

const VIDEO_MP4 = "/Salmon_sequence_optimized.mp4";
const VIDEO_WEBM = "/Salmon_sequence_optimized.webm";

/**
 * Full-viewport salmon loop pinned behind scrolling industry content.
 */
export default function IndustriaFixedVideoBg() {
  return <DivisionVideoBg mp4={VIDEO_MP4} webm={VIDEO_WEBM} />;
}
