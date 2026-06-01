"use client";

import Image from "next/image";

import {
  NOSOTROS_STORY_IMAGES,
  type StoryGalleryImage,
} from "@/lib/nosotros-story-images";
import { cn } from "@/lib/utils";

const SLIDE_MIN_H =
  "min-h-[calc(100dvh-8rem)] sm:min-h-[calc(100dvh-9rem)]";

const MOSAIC_IMAGES = NOSOTROS_STORY_IMAGES.slice(0, 6);

function GalleryImage({
  image,
  priority = false,
  sizes,
}: {
  image: StoryGalleryImage;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      priority={priority}
      sizes={sizes}
      className="object-cover"
    />
  );
}

type NosotrosStoryGalleryProps = {
  active: boolean;
  className?: string;
};

/** Lightweight CSS gallery — no WebGL. Mosaic when idle, scroll-snap when active. */
export default function NosotrosStoryGallery({
  active,
  className,
}: NosotrosStoryGalleryProps) {
  if (!active) {
    return (
      <div
        className={cn(
          "absolute inset-0 grid grid-cols-2 grid-rows-3 gap-1 sm:grid-cols-3 sm:grid-rows-2",
          className,
        )}
        aria-hidden
      >
        {MOSAIC_IMAGES.map((image, index) => (
          <div key={image.src} className="relative overflow-hidden">
            <GalleryImage
              image={image}
              priority={index < 3}
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute inset-0 snap-y snap-mandatory overflow-y-auto scroll-smooth overscroll-contain",
        className,
      )}
    >
      {NOSOTROS_STORY_IMAGES.map((image, index) => (
        <figure
          key={image.src}
          className={cn(
            "relative w-full shrink-0 snap-start snap-always",
            SLIDE_MIN_H,
          )}
        >
          <GalleryImage
            image={image}
            priority={index < 2}
            sizes="100vw"
          />
          <figcaption className="sr-only">{image.alt}</figcaption>
        </figure>
      ))}
    </div>
  );
}
