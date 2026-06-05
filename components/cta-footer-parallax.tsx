"use client";

import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

import { useCtaFooterParallax } from "@/components/cta-footer-parallax-provider";
import { cn } from "@/lib/utils";

const FOOTER_SELECTOR = "footer[data-site-footer]";
const DEFAULT_FOOTER_HEIGHT = 560;

type CtaFooterParallaxProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Scroll shell for the maquila CTA band. Reserves room below the CTA so only the
 * site footer can slide up over the page — the CTA itself scrolls normally.
 */
export default function CtaFooterParallax({
  children,
  className,
}: CtaFooterParallaxProps) {
  const reducedMotion = useReducedMotion();
  const parallax = useCtaFooterParallax();
  const shellRef = parallax?.shellRef;
  const [footerHeight, setFooterHeight] = useState(DEFAULT_FOOTER_HEIGHT);

  useEffect(() => {
    parallax?.setActive(!reducedMotion);
    return () => parallax?.setActive(false);
  }, [parallax, reducedMotion]);

  useLayoutEffect(() => {
    const footer = document.querySelector<HTMLElement>(FOOTER_SELECTOR);
    if (!footer) return;

    const measure = () => {
      setFooterHeight(footer.getBoundingClientRect().height);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(footer);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  if (reducedMotion || !shellRef) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={shellRef}
      data-cta-footer-parallax=""
      className={cn("relative z-0", className)}
    >
      <div className="relative z-0">{children}</div>

      <div
        data-cta-footer-spacer=""
        aria-hidden
        className="pointer-events-none"
        style={{ height: footerHeight }}
      />
    </div>
  );
}
