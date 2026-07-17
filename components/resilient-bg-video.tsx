"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  useResilientBgVideo,
  type UseResilientBgVideoOptions,
} from "@/hooks/use-resilient-bg-video";

export interface ResilientBgVideoProps extends UseResilientBgVideoOptions {
  videoSrc: string;
  videoType?: string;
  posterSrc: string;
  posterAlt?: string;
  className?: string;
  videoClassName?: string;
  posterClassName?: string;
  posterSizes?: string;
  posterPriority?: boolean;
  mediaScale?: string;
}

export function ResilientBgVideo({
  videoSrc,
  videoType = "video/webm",
  posterSrc,
  posterAlt = "",
  className,
  videoClassName,
  posterClassName,
  posterSizes = "100vw",
  posterPriority = false,
  mediaScale = "",
  ...hookOptions
}: ResilientBgVideoProps) {
  const { containerRef, videoRef, useVideo, showVideo } =
    useResilientBgVideo(hookOptions);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      <Image
        src={posterSrc}
        alt={posterAlt}
        fill
        className={cn(
          `${mediaScale} object-cover object-center transition-opacity duration-700 ease-out`,
          showVideo ? "opacity-0" : "opacity-100",
          posterClassName,
        )}
        sizes={posterSizes}
        priority={posterPriority}
      />

      {useVideo ? (
        <video
          ref={videoRef}
          className={cn(
            `absolute inset-0 size-full ${mediaScale} object-cover object-center transition-opacity duration-700 ease-out motion-reduce:hidden`,
            showVideo ? "opacity-100" : "opacity-0",
            videoClassName,
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={posterSrc}
        >
          <source src={videoSrc} type={videoType} />
        </video>
      ) : null}
    </div>
  );
}
