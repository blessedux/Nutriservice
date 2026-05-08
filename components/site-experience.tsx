"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PreloaderStage, PRELOADER_COUNTER_MS } from "@/components/preloader-stage";
import { HeroRevealProvider } from "@/components/site-reveal-context";
import {
  HOMEPAGE_PELLET_FRAMES,
  preloadScrollFrames,
} from "@/lib/scroll-frame-preload";
import { cn } from "@/lib/utils";

/** Al menos la subida del contador — igual que el antiguo SitePreloader */
const MIN_VISIBLE_MS = 2800;

const FADE_MS = 500;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/**
 * Crossfade inicial preloader → contenido y, cuando el navegador lo permite,
 * transiciones suaves entre rutas (View Transition API).
 */
export function SiteExperience({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();

  /** Evita `opacity-0` en SSR / antes de hidratar (SEO y no-JS). */
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  type Overlay = "on" | "fade" | "off";
  const [overlay, setOverlay] = useState<Overlay>("on");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setOverlay("off");
      setShowContent(true);
      return;
    }

    /** Warm homepage scroll-frame WebPs during the white preloader (~3s). */
    preloadScrollFrames({ ...HOMEPAGE_PELLET_FRAMES, concurrency: 14 }).catch(
      () => {},
    );

    const started = performance.now();
    let timeoutId: number | undefined;

    const reveal = () => {
      const elapsed = performance.now() - started;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      timeoutId = window.setTimeout(() => {
        setOverlay("fade");
        setShowContent(true);
      }, wait);
    };

    if (document.readyState === "complete") {
      reveal();
    } else {
      window.addEventListener("load", reveal, { once: true });
    }

    return () => {
      window.removeEventListener("load", reveal);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (overlay !== "fade") return;
    const id = window.setTimeout(() => {
      setOverlay((current) => (current === "fade" ? "off" : current));
    }, FADE_MS + 120);
    return () => window.clearTimeout(id);
  }, [overlay]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };
    if (!doc.startViewTransition || reducedMotion) return;

    const onClickCapture = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const el = (e.target as HTMLElement | null)?.closest?.("a[href]");
      if (!el) return;

      const anchor = el as HTMLAnchorElement;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const nextRoute = `${url.pathname}${url.search}`;
      const curRoute = `${window.location.pathname}${window.location.search}`;
      if (nextRoute === curRoute) return;

      e.preventDefault();
      doc.startViewTransition!(() => {
        router.push(`${url.pathname}${url.search}${url.hash}`);
      });
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [router, reducedMotion]);

  const contentRevealed = !hydrated || reducedMotion || showContent;

  /** Hero motion starts once overlay unmounts (`off`) — preloader layer fully removed after fade. */
  const heroRevealReady = overlay === "off";

  return (
    <>
      {overlay !== "off" ? (
        <PreloaderStage
          counterDurationMs={PRELOADER_COUNTER_MS}
          aria-busy={overlay !== "fade"}
          aria-label="Cargando"
          className={cn(overlay === "fade" && "pointer-events-none opacity-0")}
          onTransitionEnd={(e) => {
            if (e.propertyName !== "opacity") return;
            setOverlay((current) => (current === "fade" ? "off" : current));
          }}
        />
      ) : null}

      <HeroRevealProvider value={heroRevealReady}>
        <div
          className={cn(
            "flex min-h-full w-full flex-col transition-opacity duration-500 ease-out",
            contentRevealed ? "opacity-100" : "pointer-events-none opacity-0",
            reducedMotion && "!transition-none",
            className
          )}
        >
          {children}
        </div>
      </HeroRevealProvider>
    </>
  );
}
