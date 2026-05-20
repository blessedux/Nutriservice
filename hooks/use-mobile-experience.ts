"use client";

import { useEffect, useState } from "react";

const MOBILE_MEDIA =
  "(max-width: 767px), (hover: none) and (pointer: coarse)";

export function useMobileExperience(): boolean | null {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return mobile;
}
