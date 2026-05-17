import Image from "next/image";

import { HomeBlueBand } from "@/components/home-blue-band";

const MAQUILA_IMAGE_SRC = "/maquila_blue.webp";
const MAQUILA_IMAGE_WIDTH = 1298;
const MAQUILA_IMAGE_HEIGHT = 1212;

/** Maquila / manufacturing band — content TBD. */
export default function MaquilaSection() {
  return (
    <HomeBlueBand
      id="maquila"
      height="full"
      aria-label="Maquila"
      className="justify-center overflow-hidden px-6 py-10 sm:px-10 lg:px-12"
    >
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center justify-end">
        <div
          className="relative ml-auto w-full max-w-[min(88vw,420px)] sm:max-w-md lg:max-w-[min(46vw,560px)]"
          aria-hidden
        >
          <Image
            src={MAQUILA_IMAGE_SRC}
            width={MAQUILA_IMAGE_WIDTH}
            height={MAQUILA_IMAGE_HEIGHT}
            alt=""
            className="h-auto w-full object-contain object-right"
            sizes="(max-width: 1024px) 88vw, 46vw"
            priority={false}
          />
        </div>
      </div>
    </HomeBlueBand>
  );
}
