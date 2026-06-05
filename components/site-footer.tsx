"use client";

import { useLayoutEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import Footer from "@/components/footer";
import { useCtaFooterParallax } from "@/components/cta-footer-parallax-provider";

const FOOTER_SELECTOR = "footer[data-site-footer]";
const DEFAULT_FOOTER_HEIGHT = 560;

function SiteFooterParallax() {
  const parallax = useCtaFooterParallax();
  const shellRef = parallax!.shellRef;
  const [footerHeight, setFooterHeight] = useState(DEFAULT_FOOTER_HEIGHT);

  const { scrollYProgress } = useScroll({
    target: shellRef,
    offset: ["start end", "end end"],
  });

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

  const footerY = useTransform(scrollYProgress, (progress) => {
    const eased = 1 - (1 - progress) ** 1.35;
    return (1 - eased) * footerHeight * 0.42;
  });

  return (
    <motion.div
      style={{ y: footerY }}
      className="relative z-20 bg-[#0a192f] shadow-[0_-32px_64px_rgba(3,10,28,0.55)]"
    >
      <Footer />
    </motion.div>
  );
}

export default function SiteFooter() {
  const reducedMotion = useReducedMotion();
  const parallax = useCtaFooterParallax();

  if (!parallax?.active || reducedMotion) {
    return (
      <div className="relative z-10">
        <Footer />
      </div>
    );
  }

  return <SiteFooterParallax />;
}
