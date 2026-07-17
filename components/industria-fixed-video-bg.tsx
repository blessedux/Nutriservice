"use client";

import DivisionVideoBg from "@/components/division-video-bg";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

const DEFAULT_VIDEO_MP4 = PUBLIC_ASSETS.hero.salmonMp4;
const DEFAULT_VIDEO_WEBM = PUBLIC_ASSETS.hero.salmonWebm;
const DEFAULT_VIDEO_POSTER = PUBLIC_ASSETS.hero.salmonPoster;

type IndustriaFixedVideoBgProps = {
  mp4?: string;
  webm?: string;
  poster?: string;
};

/**
 * Full-viewport loop pinned behind scrolling industry content.
 */
export default function IndustriaFixedVideoBg({
  mp4,
  webm = DEFAULT_VIDEO_WEBM,
  poster = DEFAULT_VIDEO_POSTER,
}: IndustriaFixedVideoBgProps = {}) {
  const resolvedMp4 =
    mp4 !== undefined
      ? mp4
      : webm === DEFAULT_VIDEO_WEBM
        ? DEFAULT_VIDEO_MP4
        : undefined;

  return <DivisionVideoBg mp4={resolvedMp4} webm={webm} poster={poster} />;
}
