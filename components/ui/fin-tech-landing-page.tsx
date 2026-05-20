"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useId } from "react";

import { cn } from "@/lib/utils";

const SOFT_BUTTON_CLASS = cn(
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2",
  "bg-ns-green-dark text-white hover:bg-ns-green focus:ring-ns-green focus:ring-offset-[var(--color-ns-surface)]",
);

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-3xl font-semibold tracking-tight text-ns-text">
        {value}
      </div>
      <div className="text-sm text-ns-muted">{label}</div>
    </div>
  );
}

function MiniBars() {
  const reduce = useReducedMotion();
  const heights = [18, 48, 72, 96] as const;
  return (
    <div className="mt-6 flex h-36 items-end gap-4 rounded-xl bg-gradient-to-b from-ns-surface-alt to-white p-4 ring-1 ring-ns-border">
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
  { href: "/impact", label: "Impact" },
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

export type FinTechHeroGridProps = {
  /** When true, headline motion waits for site preloader (`useHeroRevealReady`). */
  heroRevealReady?: boolean;
};

/**
 * Hero column + animated cards — Scientific Authority palette (`globals.css` `ns-*` tokens).
 */
export function FinTechHeroGrid({
  heroRevealReady = true,
}: FinTechHeroGridProps) {
  const reduce = useReducedMotion();
  const motionOn = heroRevealReady && !reduce;

  return (
    <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-6 pb-14 md:grid-cols-2">
      <div className="flex flex-col justify-center space-y-8 pr-2">
        <div>
          <p className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.35em] text-ns-muted">
            <span className="h-px w-8 bg-ns-green shrink-0" aria-hidden />
            Autoridad científica
          </p>
          <motion.h1
            className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-ns-text md:text-6xl"
            initial={motionOn ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            Nutrición animal
            <br />
            con precisión medible.
          </motion.h1>
          <motion.p
            className="mt-4 max-w-md text-ns-muted"
            initial={motionOn ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            Diagnóstico, formulación y soporte continuo con{" "}
            <span className="font-medium text-ns-text">Nutriservice</span> para
            operaciones que necesitan resultados estables, lote a lote.
          </motion.p>
        </div>

        <motion.div
          className="flex items-center gap-4"
          initial={motionOn ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
        >
          <Link href="/contacto" className={SOFT_BUTTON_CLASS}>
            Agendar evaluación técnica{" "}
            <ArrowUpRight className="ml-1 inline h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 pt-2 md:max-w-sm">
          <Stat label="Especies y líneas cubiertas" value="12+" />
          <Stat label="Años de evidencia aplicada" value="30+" />
        </div>

        <div className="mt-6 flex flex-col gap-4 opacity-90 sm:flex-row sm:items-center sm:gap-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ns-subtle">
            Respaldado por ciencia aplicada
          </span>
          <div className="flex flex-wrap items-center gap-4 text-ns-subtle sm:gap-6">
            <span className="text-xs font-semibold text-ns-muted">ISO</span>
            <span className="text-xs font-semibold text-ns-muted">I+D propio</span>
            <span className="text-xs font-semibold text-ns-muted">Gran escala</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.1 }}
          className="relative col-span-1 overflow-hidden rounded-xl bg-gradient-to-b from-ns-dark to-ns-green-dark p-6 text-white shadow-lg ring-1 ring-white/10"
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
          className="relative col-span-1 overflow-hidden rounded-xl bg-gradient-to-b from-ns-green to-ns-green-light p-6 text-white shadow-lg ring-1 ring-ns-border"
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
          className="col-span-1 rounded-xl bg-white p-6 text-ns-text shadow-lg ring-1 ring-ns-border"
        >
          <div className="text-sm text-ns-muted">Eficiencia proyectada</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">
            +2.4{" "}
            <span className="align-middle text-sm font-medium text-ns-subtle">
              pp FCR
            </span>
          </div>
          <div className="mt-1 text-xs text-sky-700">↑ vs. curva histórica</div>
          <MiniBars />
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
