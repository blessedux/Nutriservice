"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const SOFT_BUTTON_CLASS = cn(
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2",
  "bg-ns-green-dark text-white hover:bg-ns-green focus:ring-ns-green focus:ring-offset-[var(--color-ns-surface)]",
);

function Stat({
  label,
  value,
  onVideo,
}: {
  label: string;
  value: string;
  onVideo?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div
        className={cn(
          "text-3xl font-semibold tracking-tight",
          onVideo ? "text-white" : "text-ns-text",
        )}
      >
        {value}
      </div>
      <div className={cn("text-sm", onVideo ? "text-white/65" : "text-ns-muted")}>
        {label}
      </div>
    </div>
  );
}

function MiniBars({ onVideo = false }: { onVideo?: boolean }) {
  const reduce = useReducedMotion();
  const heights = [18, 48, 72, 96] as const;
  return (
    <div
      className={cn(
        "mt-6 flex h-36 items-end gap-4 rounded-xl p-4 ring-1 backdrop-blur-md",
        onVideo
          ? "border border-white/15 bg-white/[0.06] ring-white/15"
          : "bg-gradient-to-b from-ns-surface-alt to-white ring-ns-border",
      )}
    >
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={reduce ? { height: h, opacity: 1 } : { height: 0, opacity: 0.6 }}
          animate={{ height: h, opacity: 1 }}
          transition={
            reduce
              ? { duration: 0 }
              : { delay: 0.5 + i * 0.15, type: "spring" }
          }
          className="w-10 rounded-xl bg-gradient-to-t from-ns-green-light to-ns-emerald shadow-inner"
        />
      ))}
    </div>
  );
}

function Planet() {
  const reduce = useReducedMotion();
  const gid = useId().replace(/:/g, "");
  const gradId = `planet-grad-${gid}`;

  return (
    <motion.svg
      initial={reduce ? false : { rotate: -8 }}
      animate={{ rotate: 0 }}
      transition={{ duration: 2, type: "spring" }}
      width="220"
      height="220"
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-ns-green-light)" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="110" r="56" fill={`url(#${gradId})`} opacity={0.95} />
      <circle cx="94" cy="98" r="10" fill="white" opacity={0.45} />
      <circle cx="132" cy="126" r="8" fill="white" opacity={0.35} />
      <motion.ellipse
        cx="110"
        cy="110"
        rx="100"
        ry="34"
        stroke="white"
        strokeOpacity={0.6}
        fill="none"
        animate={
          reduce ? undefined : { strokeDashoffset: [200, 0] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
        strokeDasharray="200 200"
      />
      <motion.circle
        cx="210"
        cy="110"
        r="4"
        fill="white"
        animate={reduce ? undefined : { opacity: [0.2, 1, 0.2] }}
        transition={
          reduce ? undefined : { duration: 2.2, repeat: Infinity }
        }
      />
    </motion.svg>
  );
}

const DEMO_NAV = [
  { href: "/soluciones", label: "Soluciones" },
  { href: "/tecnologia", label: "I+D" },
  { href: "/impacto", label: "Impacto" },
] as const;

function DemoChromeNav() {
  return (
    <nav className="mx-auto flex w-full max-w-[1180px] items-center justify-between py-6">
      <Link href="/" className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-ns-green-dark text-white shadow ring-1 ring-ns-border">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M4 12c5 0 4-8 10-8 0 3 6 3 6 8s-6 5-6 8c-6 0-5-8-10-8Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-xl font-semibold tracking-tight text-ns-text">
          Nutriservice
        </span>
      </Link>
      <div className="hidden items-center gap-8 md:flex">
        {DEMO_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[10px] font-bold uppercase tracking-[0.22em] text-ns-muted hover:text-ns-text"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="hidden gap-2 md:flex">
        <Link
          href="/contacto"
          className="rounded-full px-4 py-2 text-sm text-ns-text hover:bg-white"
        >
          Contacto
        </Link>
        <Link href="/contacto" className={SOFT_BUTTON_CLASS}>
          Agendar evaluación
        </Link>
      </div>
    </nav>
  );
}

export type FinTechHeroContent = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  stats?: readonly { label: string; value: string }[];
  trustLine?: string;
  trustTags?: readonly string[];
};

export type FinTechHeroGridProps = {
  /** When true, headline motion waits for site preloader (`useHeroRevealReady`). */
  heroRevealReady?: boolean;
  /** `on-video` — white copy and glass metric card over a fixed hero video. */
  tone?: "light" | "on-video";
  content?: FinTechHeroContent;
};

const DEFAULT_HERO_CONTENT: FinTechHeroContent = {
  eyebrow: "Autoridad científica",
  title: (
    <>
      Nutrición animal
      <br />
      con precisión medible.
    </>
  ),
  description: (
    <>
      Diagnóstico, formulación y soporte continuo con{" "}
      <span className="font-medium">Nutriservice</span> para operaciones que
      necesitan resultados estables, lote a lote.
    </>
  ),
  ctaHref: "/contacto",
  ctaLabel: "Agendar evaluación técnica",
  stats: [
    { label: "Especies y líneas cubiertas", value: "12+" },
    { label: "Años de evidencia aplicada", value: "30+" },
  ],
  trustLine: "Respaldado por ciencia aplicada",
  trustTags: ["ISO", "I+D propio", "Gran escala"],
};

/**
 * Hero column + animated cards — Scientific Authority palette (`globals.css` `ns-*` tokens).
 */
export function FinTechHeroGrid({
  heroRevealReady = true,
  tone = "light",
  content: contentProp,
}: FinTechHeroGridProps) {
  const reduce = useReducedMotion();
  const motionOn = heroRevealReady && !reduce;
  const onVideo = tone === "on-video";
  const content = contentProp ?? DEFAULT_HERO_CONTENT;
  const stats = content.stats ?? DEFAULT_HERO_CONTENT.stats!;
  const trustTags = content.trustTags ?? DEFAULT_HERO_CONTENT.trustTags!;

  return (
    <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-6 pb-14 md:grid-cols-2">
      <div className="flex flex-col justify-center space-y-8 pr-2">
        <div>
          <p
            className={cn(
              "mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.35em]",
              onVideo ? "text-white/55" : "text-ns-muted",
            )}
          >
            <span
              className={cn(
                "h-px w-8 shrink-0",
                onVideo ? "bg-cyan-400" : "bg-ns-green",
              )}
              aria-hidden
            />
            {content.eyebrow}
          </p>
          <motion.h1
            className={cn(
              "text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl",
              onVideo ? "text-white" : "text-ns-text",
            )}
            initial={motionOn ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.title}
          </motion.h1>
          <motion.p
            className={cn(
              "mt-4 max-w-md",
              onVideo ? "text-white/72" : "text-ns-muted",
              !onVideo && "[&_span]:font-medium [&_span]:text-ns-text",
              onVideo && "[&_span]:font-medium [&_span]:text-white",
            )}
            initial={motionOn ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.description}
          </motion.p>
        </div>

        <motion.div
          className="flex items-center gap-4"
          initial={motionOn ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
        >
          <Link
            href={content.ctaHref ?? "/contacto"}
            className={cn(
              SOFT_BUTTON_CLASS,
              onVideo && "focus:ring-offset-slate-950",
            )}
          >
            {content.ctaLabel ?? "Agendar evaluación técnica"}{" "}
            <ArrowUpRight className="ml-1 inline h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 pt-2 md:max-w-sm">
          {stats.map((stat) => (
            <Stat
              key={stat.label}
              label={stat.label}
              value={stat.value}
              onVideo={onVideo}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 opacity-90 sm:flex-row sm:items-center sm:gap-8">
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.2em]",
              onVideo ? "text-white/45" : "text-ns-subtle",
            )}
          >
            {content.trustLine ?? DEFAULT_HERO_CONTENT.trustLine}
          </span>
          <div
            className={cn(
              "flex flex-wrap items-center gap-4 sm:gap-6",
              onVideo ? "text-white/50" : "text-ns-subtle",
            )}
          >
            {trustTags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "text-xs font-semibold",
                  onVideo ? "text-white/65" : "text-ns-muted",
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.1 }}
          className={cn(
            "relative col-span-1 overflow-hidden rounded-xl p-6 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-xl",
            onVideo
              ? "border border-white/20 bg-white/[0.08]"
              : "bg-gradient-to-b from-ns-dark to-ns-green-dark",
          )}
        >
          <SecureCardRings />

          <div className="relative flex h-full min-h-[200px] flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/10 p-2 ring-1 ring-white/15">
                <ShieldCheck className="h-5 w-5 text-sky-200" aria-hidden />
              </div>
              <span className="text-xs uppercase tracking-wider text-white/75">
                Control de riesgo
              </span>
            </div>
            <div className="mt-6 text-xl leading-snug text-white/95">
              Formulación y trazabilidad
              <br />
              que reducen variabilidad productiva
            </div>
            <motion.div
              className="absolute right-6 top-6 h-12 w-12 rounded-full bg-sky-500/25"
              animate={
                reduce
                  ? undefined
                  : {
                      boxShadow: [
                        "0 0 0 0 rgba(56,189,248,0.35)",
                        "0 0 0 16px rgba(56,189,248,0)",
                      ],
                    }
              }
              transition={{ duration: 2.5, repeat: reduce ? 0 : Infinity }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.2 }}
          className={cn(
            "relative col-span-1 overflow-hidden rounded-xl p-6 text-white shadow-lg backdrop-blur-xl",
            onVideo
              ? "border border-white/20 bg-white/[0.08] ring-1 ring-white/15"
              : "bg-gradient-to-b from-ns-green to-ns-green-light ring-1 ring-ns-border",
          )}
        >
          <div className="pointer-events-none absolute -right-8 -top-10 opacity-80">
            <Planet />
          </div>
          <div className="relative mt-24 text-sm text-white/90">Cobertura</div>
          <div className="relative text-xl font-medium leading-snug">
            Un mismo estándar
            <br />
            para múltiples especies
          </div>
          <div className="relative mt-4 overflow-hidden rounded-lg ring-1 ring-white/20">
            <Image
              src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=600&q=80"
              alt=""
              width={600}
              height={320}
              className="h-32 w-full object-cover opacity-95"
            />
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.3 }}
          className={cn(
            "col-span-1 rounded-xl p-6 shadow-lg backdrop-blur-xl",
            onVideo
              ? "border border-white/20 bg-white/[0.08] text-white ring-1 ring-white/15"
              : "bg-white text-ns-text ring-1 ring-ns-border",
          )}
        >
          <div className={cn("text-sm", onVideo ? "text-white/65" : "text-ns-muted")}>
            Eficiencia proyectada
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">
            +2.4{" "}
            <span
              className={cn(
                "align-middle text-sm font-medium",
                onVideo ? "text-white/55" : "text-ns-subtle",
              )}
            >
              pp FCR
            </span>
          </div>
          <div className={cn("mt-1 text-xs", onVideo ? "text-cyan-300" : "text-sky-700")}>
            ↑ vs. curva histórica
          </div>
          <MiniBars onVideo={onVideo} />
        </motion.div>

        <div className="hidden md:block" aria-hidden />
      </div>
    </div>
  );
}

/** Concentric rings for secure card — separate to fix duplicate useId in SVG rect fill */
function SecureCardRings() {
  const rid = useId().replace(/:/g, "");
  const radialId = `secure-rg-${rid}`;
  return (
    <div className="absolute inset-0" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={radialId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill={`url(#${radialId})`} />
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={i}
            cx="200"
            cy="200"
            r={20 + i * 14}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.12}
          />
        ))}
      </svg>
    </div>
  );
}

export type FinTechLandingPageProps = {
  /** Renders demo nav + footer; omit on pages that already use site `Nav`. */
  showChrome?: boolean;
  heroRevealReady?: boolean;
};

/**
 * Fintech-style landing block themed for Nutriservice Scientific Authority (`ns-*`).
 * Use `showChrome` only on isolated demos; the main site already provides `Nav`.
 */
export default function FinTechLandingPage({
  showChrome = true,
  heroRevealReady = true,
}: FinTechLandingPageProps) {
  return (
    <div className="min-h-screen w-full bg-ns-surface px-6 sm:px-10 lg:px-12">
      {showChrome ? <DemoChromeNav /> : null}

      <FinTechHeroGrid heroRevealReady={heroRevealReady} />

      <footer className="mx-auto w-full max-w-[1180px] pb-10 pt-4 text-center text-xs text-ns-subtle">
        © {new Date().getFullYear()} Nutriservice. Todos los derechos reservados.
      </footer>
    </div>
  );
}
