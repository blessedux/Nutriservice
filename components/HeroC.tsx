"use client";

import HeroCtaBar from "@/components/hero-cta-bar";
import { useHeroRevealReady } from "@/components/site-reveal-context";
import { FinTechHeroGrid } from "@/components/ui/fin-tech-landing-page";

/**
 * Latest Framer entrance on the hero column (~140ms delay + 450ms duration on CTA row).
 * CTA bar fades in after this + buffer via `heroIntroAnimMs={0}` on `HeroCtaBar`.
 */
const HERO_C_LAST_MOTION_DELAY_MS = 600;

export default function HeroC() {
  const heroRevealReady = useHeroRevealReady();

  return (
    <section
      id="inicio"
      className="relative isolate -mt-24 min-h-[100dvh] scroll-mt-24 overflow-hidden bg-ns-surface text-ns-text"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
      >
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-ns-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ns-border)_1px,transparent_1px)]"
          style={{ backgroundSize: "48px 48px" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1280px] flex-col px-6 pt-28 sm:px-10 sm:pt-32 lg:px-12">
        <div className="flex min-h-0 flex-1 items-center pb-10 sm:pb-12">
          <FinTechHeroGrid heroRevealReady={heroRevealReady} />
        </div>
        <HeroCtaBar
          className="shrink-0 -mx-6 sm:-mx-10 lg:-mx-12"
          tone="on-light"
          heroRevealReady={heroRevealReady}
          heroLastLineDelayMs={HERO_C_LAST_MOTION_DELAY_MS}
          heroIntroAnimMs={0}
          secondaryHref="/#sistema"
        />
      </div>
    </section>
  );
}
