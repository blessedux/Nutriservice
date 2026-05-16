"use client";

import Link from "next/link";
import * as React from "react";

const tagChip =
  "inline-flex shrink-0 cursor-default rounded border px-2 py-0.5 uppercase transition-all duration-200 outline-none hover:-translate-y-px active:scale-[0.97] focus-visible:ring-2";

type CountUpSpec =
  | {
      mode: "single";
      end: number;
      decimals?: number;
      prefix?: string;
      suffix?: string;
    }
  | {
      mode: "pair";
      low: number;
      high: number;
      suffix?: string;
    };

type Highlight = {
  label: string;
  value: string;
  detail?: string;
  countUp?: CountUpSpec;
};

type Product = {
  key: string;
  slideLabel: string;
  name: string;
  tagline: string;
  imageSrc?: string;
  highlights: Highlight[];
  benefits: string[];
  scientificBasis: string[];
  formatAndSize: string[];
};

const MACROGARD_BASE = {
  name: "MacroGard",
  tagline: "β‑glucanos purificados (β‑1,3/1,6) para soporte inmunológico",
  imageSrc: "/macrocard_nutriservice.webp",
  highlights: [
    {
      label: "Activo",
      value: "β‑1,3/1,6‑glucanos",
      detail: "Purificados desde Saccharomyces cerevisiae",
    },
    {
      label: "Contenido",
      value: "≥ 60%",
      detail: "Estructura nativa preservada",
      countUp: {
        mode: "single" as const,
        end: 60,
        decimals: 0,
        prefix: "≥ ",
        suffix: "%",
      },
    },
    {
      label: "Dosis base",
      value: "0,5–1,0 kg/ton",
      detail: "Programas de inmunidad basal",
      countUp: {
        mode: "pair" as const,
        low: 0.5,
        high: 1.0,
        suffix: " kg/ton",
      },
    },
    {
      label: "Alto desafío",
      value: "~2,0 kg/ton",
      detail: "Según especie y formulación",
      countUp: {
        mode: "single" as const,
        end: 2,
        decimals: 1,
        prefix: "~",
        suffix: " kg/ton",
      },
    },
  ],
  benefits: [
    "Refuerza defensas naturales bajo vacunación, presión de enfermedad o estrés ambiental.",
    "Mascotas (perros y gatos): apoyo a respuesta vacunal; soporte articular y metabólico.",
    "Producción animal: reducción de morbilidad y mejor desempeño bajo desafío.",
  ],
  scientificBasis: [
    "β‑glucanos se unen a receptores PRR (p. ej., dectin‑1, CR3) en macrófagos y neutrófilos.",
    "Potencian fagocitosis y señalización de citoquinas.",
    "Mejoran la “preparación” de la inmunidad innata (respuesta más eficiente ante desafío).",
  ],
  formatAndSize: [
    "Polvo color crema, de flujo libre (apto para alimento seco, suplementos y premezclas).",
    "Saco/tamaño definido por Nutriservice (estándar de ingredientes).",
    "Uso orientativo: ajustar por especie, fase y matriz (alimento/premix).",
  ],
};

const PRODUCTS: Product[] = [
  { key: "macrogard-1", slideLabel: "01 / 03", ...MACROGARD_BASE },
  { key: "macrogard-2", slideLabel: "02 / 03", ...MACROGARD_BASE },
  { key: "macrogard-3", slideLabel: "03 / 03", ...MACROGARD_BASE },
];

const mono =
  "font-mono text-[9px] sm:text-[10px] leading-tight tracking-wide";

function fmtComma(n: number, decimals: number) {
  return n
    .toFixed(decimals)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function useCountUpSingle(
  target: number,
  decimals: number,
  animSeq: number,
  run: boolean,
) {
  const [v, setV] = React.useState(run ? 0 : target);
  React.useEffect(() => {
    if (!run) {
      setV(target);
      return;
    }
    let raf = 0;
    let cancelled = false;
    const start = performance.now();
    const dur = 950;
    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - (1 - t) ** 3;
      setV(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setV(target);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [target, decimals, animSeq, run]);
  return decimals === 0 ? Math.round(v) : Number(v.toFixed(decimals));
}

function useCountUpPair(
  lowT: number,
  highT: number,
  animSeq: number,
  run: boolean,
) {
  const [low, setLow] = React.useState(run ? 0 : lowT);
  const [high, setHigh] = React.useState(run ? 0 : highT);
  React.useEffect(() => {
    if (!run) {
      setLow(lowT);
      setHigh(highT);
      return;
    }
    let raf = 0;
    let cancelled = false;
    const start = performance.now();
    const dur = 950;
    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - (1 - t) ** 3;
      setLow(lowT * eased);
      setHigh(highT * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setLow(lowT);
        setHigh(highT);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [lowT, highT, animSeq, run]);
  return {
    lowStr: fmtComma(low, 1),
    highStr: fmtComma(high, 1),
  };
}

function HighlightStatic({ h, animSeq }: { h: Highlight; animSeq: number }) {
  return (
    <p
      key={`${animSeq}-txt`}
      className="mt-1.5 break-words text-[13px] font-semibold leading-tight text-white animate-[mgKV_0.65s_ease-out_both] sm:text-sm"
    >
      {h.value}
    </p>
  );
}

function HighlightCountSingle({
  cu,
  animSeq,
  run,
}: {
  cu: Extract<CountUpSpec, { mode: "single" }>;
  animSeq: number;
  run: boolean;
}) {
  const dec = cu.decimals ?? 0;
  const n = useCountUpSingle(cu.end, dec, animSeq, run);
  const shown = dec === 0 ? String(Math.round(n)) : fmtComma(n, dec);
  return (
    <p className="mt-1.5 text-[13px] font-semibold leading-tight text-white tabular-nums sm:text-sm">
      {cu.prefix ?? ""}
      {shown}
      {cu.suffix ?? ""}
    </p>
  );
}

function HighlightCountPair({
  cu,
  animSeq,
  run,
}: {
  cu: Extract<CountUpSpec, { mode: "pair" }>;
  animSeq: number;
  run: boolean;
}) {
  const { lowStr, highStr } = useCountUpPair(cu.low, cu.high, animSeq, run);
  return (
    <p className="mt-1.5 text-[13px] font-semibold leading-tight text-white tabular-nums sm:text-sm">
      {lowStr}–{highStr}
      {cu.suffix ?? ""}
    </p>
  );
}

function HighlightValue({
  h,
  animSeq,
  run,
}: {
  h: Highlight;
  animSeq: number;
  run: boolean;
}) {
  const cu = h.countUp;
  if (!cu) return <HighlightStatic h={h} animSeq={animSeq} />;
  if (cu.mode === "single")
    return <HighlightCountSingle cu={cu} animSeq={animSeq} run={run} />;
  return <HighlightCountPair cu={cu} animSeq={animSeq} run={run} />;
}

function IconClipboard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.75"
      aria-hidden
      {...props}
    >
      <path
        d="M9 5h6a1 1 0 0 1 1 1v1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2V6a1 1 0 0 1 1-1Z"
        strokeLinejoin="round"
      />
      <path d="M9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9V5Z" />
    </svg>
  );
}

function IconArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...props}>
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...props}>
      <path
        d="M12.5 4.5 7 10l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlassCard({
  children,
  className = "",
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={[
        "min-h-0 min-w-0 overflow-hidden rounded-2xl border border-white/40 bg-slate-900/[0.22] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_40px_rgba(0,0,0,0.18)]",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

function CopyableGlassCard({
  getCopyText,
  className = "",
  stopParentCopy = false,
  children,
}: {
  getCopyText: () => string;
  className?: string;
  /** Use inside another CopyableGlassCard so only the inner card copies. */
  stopParentCopy?: boolean;
  children: React.ReactNode;
}) {
  const [flash, setFlash] = React.useState(false);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  React.useEffect(() => {
    return () => clearTimeout(hideTimer.current);
  }, []);

  const activate = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (stopParentCopy) e.stopPropagation();
    void (async () => {
      try {
        await navigator.clipboard.writeText(getCopyText());
        setFlash(true);
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setFlash(false), 1600);
      } catch {
        /* ignore */
      }
    })();
  };

  return (
    <GlassCard
      role="button"
      tabIndex={0}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate(e);
        }
      }}
      className={[
        "relative cursor-default select-none outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute right-2 top-2 z-10 flex items-center gap-2 rounded-md bg-slate-950/90 px-2 py-1.5 shadow-lg backdrop-blur-sm transition-all duration-300",
          flash ? "opacity-100 scale-100" : "opacity-0 scale-95",
        ].join(" ")}
        aria-hidden
      >
        <span
          className={`${mono} font-semibold uppercase tracking-wide text-white`}
        >
          ¡Copiado!
        </span>
        <IconClipboard className="h-4 w-4 shrink-0" />
      </div>
      {children}
    </GlassCard>
  );
}

function DosageCalculator() {
  const [tonsStr, setTonsStr] = React.useState("1");
  const [dose, setDose] = React.useState<0.5 | 1 | 2>(1);

  const tons = parseFloat(tonsStr.replace(",", ".")) || 0;
  const kgMacro = tons * dose;
  const kgRounded =
    Math.round(kgMacro * 100) / 100;
  const cotizarHref = `/contacto?producto=MacroGard&toneladas=${encodeURIComponent(String(tons))}&dosisKgPorTonelada=${encodeURIComponent(String(dose))}&totalKgMacroGard=${encodeURIComponent(String(kgRounded))}`;

  return (
    <GlassCard className="w-full max-w-full shrink-0 cursor-default select-none border-cyan-500/25 p-2.5 sm:p-3">
      <div className="rounded-md border border-cyan-500/15 bg-cyan-950/20 px-2 py-1.5">
        <p className="text-[11px] font-semibold leading-snug text-white sm:text-xs">
          Impact · MacroGard
        </p>
        <p className="mt-0.5 text-[10px] leading-snug text-slate-400 sm:text-[11px]">
          Toneladas de alimento × dosis (kg MacroGard por ton) = kg a comprar.
        </p>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="flex min-w-0 flex-col gap-1">
          <span className="text-[10px] font-medium leading-tight text-white">
            Toneladas (t)
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={tonsStr}
            onChange={(e) => setTonsStr(e.target.value)}
            placeholder="10"
            className={`${mono} min-h-0 w-full rounded-md border border-white/20 bg-slate-950/50 px-2 py-1.5 text-[11px] text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50`}
          />
        </label>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[10px] font-medium leading-tight text-white">
            Dosis kg/t
          </span>
          <div className="flex gap-1">
            {([0.5, 1, 2] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDose(d)}
                className={[
                  `${mono} min-h-[30px] flex-1 rounded-md border px-1 py-1 text-[10px] font-semibold transition-colors`,
                  dose === d
                    ? "border-cyan-400 bg-cyan-500/25 text-white shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                    : "border-white/18 bg-slate-950/40 text-slate-400 hover:border-white/35 hover:text-slate-200",
                ].join(" ")}
              >
                {d === 0.5 ? "0,5" : d === 1 ? "1" : "2"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 rounded-lg border border-cyan-400/30 bg-gradient-to-br from-slate-950/75 to-slate-900/55 px-2.5 py-2">
        <p className={`${mono} text-[9px] uppercase tracking-wide text-cyan-200/85`}>
          Resultado
        </p>
        <p className="mt-1 truncate text-lg font-bold tabular-nums leading-none text-white">
          {fmtComma(kgMacro, kgMacro >= 100 ? 1 : 2)}{" "}
          <span className="text-xs font-semibold text-cyan-200">
            kg MacroGard
          </span>
        </p>
        <p className={`${mono} mt-1 truncate text-[9px] text-slate-500`}>
          {fmtComma(tons, tons % 1 === 0 ? 0 : 1)} t ×{" "}
          {dose === 0.5 ? "0,5" : dose === 1 ? "1" : "2"} kg/t
        </p>
      </div>

      <Link
        href={cotizarHref}
        className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-lg border border-white/18 bg-gradient-to-r from-cyan-600/85 to-blue-600/80 px-2 py-2 text-center text-[11px] font-semibold text-white shadow-md transition-[transform,box-shadow] hover:shadow-[0_6px_20px_rgba(34,211,238,0.28)] active:scale-[0.99] sm:text-xs"
      >
        Cotizar este resultado
      </Link>
      <p className="mt-1 text-center text-[9px] leading-snug text-slate-500 sm:text-[10px]">
        El enlace incluye producto, toneladas, dosis y kg estimados.
      </p>
    </GlassCard>
  );
}

export default function MacroGardCover() {
  const [active, setActive] = React.useState(0);
  const product = PRODUCTS[active];
  const shellRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);
  const [animSeq, setAnimSeq] = React.useState(0);

  React.useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && e.intersectionRatio >= 0.12) setInView(true);
      },
      { threshold: [0, 0.12, 0.25] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!inView) return;
    setAnimSeq((s) => s + 1);
  }, [active, inView]);

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes mgKV{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`,
        }}
      />
      <div ref={shellRef} className="mx-auto w-full max-w-6xl px-1">
        <div className="h-[90vh] min-h-[640px] max-h-[900px]">
          <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/35 bg-gradient-to-br from-slate-900/55 via-slate-800/45 to-slate-950/60 shadow-[0_8px_32px_rgba(6,182,212,0.08),0_40px_100px_rgba(0,0,0,0.35)] backdrop-blur-[28px] backdrop-saturate-150">
            <div
              className="pointer-events-none absolute inset-0 rounded-[28px]"
              aria-hidden
              style={{
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
              }}
            />
            <div
              className="pointer-events-none absolute -inset-px rounded-[29px] opacity-80"
              aria-hidden
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 45%, rgba(6,182,212,0.08) 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-[28px]"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse 120% 80% at 15% 0%, rgba(6,182,212,0.14), transparent 52%), radial-gradient(ellipse 90% 70% at 100% 100%, rgba(59,130,246,0.12), transparent 55%)",
              }}
            />

            <div className="relative grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-12 lg:gap-0 lg:items-start">
              <div className="flex min-h-0 flex-col gap-3 p-5 sm:p-6 lg:col-span-7 lg:p-7">
                <CopyableGlassCard
                  getCopyText={() =>
                    [
                      product.name,
                      product.tagline,
                      product.slideLabel,
                      "prod_immunity → /productos?categoria=inmunidad",
                      "mascotas → /productos?categoria=mascotas",
                    ].join("\n")
                  }
                  className="shrink-0 p-4 sm:p-5"
                >
                  <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <Link
                          href="/productos?categoria=inmunidad"
                          className={`${mono} ${tagChip} cursor-default border-cyan-500/35 bg-cyan-950/40 text-cyan-300 hover:border-cyan-400/80 hover:bg-cyan-500/20 hover:text-cyan-100 hover:shadow-[0_0_24px_rgba(34,211,238,0.45)] focus-visible:ring-cyan-400/55`}
                          onClick={stop}
                        >
                          prod_immunity
                        </Link>
                        <Link
                          href="/productos?categoria=mascotas"
                          className={`${mono} ${tagChip} cursor-default border-blue-500/35 bg-blue-950/40 text-blue-300 hover:border-blue-400/80 hover:bg-blue-500/20 hover:text-blue-100 hover:shadow-[0_0_24px_rgba(96,165,250,0.45)] focus-visible:ring-blue-400/55`}
                          onClick={stop}
                        >
                          mascotas
                        </Link>
                        <span className={`${mono} text-slate-400`}>
                          {product.slideLabel}
                        </span>
                      </div>
                      <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        {product.name}
                      </h3>
                      <p className="mt-2 max-w-xl text-pretty text-sm leading-snug text-slate-300 sm:text-[15px]">
                        {product.tagline}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2" onClick={stop}>
                      <button
                        type="button"
                        onClick={() =>
                          setActive(
                            (v) =>
                              (v - 1 + PRODUCTS.length) % PRODUCTS.length,
                          )
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-sm transition-colors hover:bg-white/20"
                        aria-label="Producto anterior"
                      >
                        <IconArrowLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActive((v) => (v + 1) % PRODUCTS.length)
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cyan-500/35 bg-cyan-950/30 px-3.5 text-sm font-semibold text-cyan-100 shadow-sm transition-colors hover:bg-cyan-950/50"
                      >
                        Siguiente
                        <IconArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </CopyableGlassCard>

                <div className="grid min-h-0 shrink-0 grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
                  {product.highlights.map((h) => (
                    <CopyableGlassCard
                      key={h.label}
                      getCopyText={() =>
                        [h.label, h.value, h.detail].filter(Boolean).join("\n")
                      }
                      className="flex flex-col p-3 sm:p-3.5"
                    >
                      <p className={`${mono} truncate uppercase text-white`}>
                        {h.label}
                      </p>
                      <HighlightValue
                        h={h}
                        animSeq={animSeq}
                        run={inView}
                      />
                      {h.detail ? (
                        <p
                          className={`${mono} mt-1 line-clamp-3 text-slate-400`}
                        >
                          {h.detail}
                        </p>
                      ) : null}
                    </CopyableGlassCard>
                  ))}
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 lg:grid-cols-2 lg:gap-3">
                  <CopyableGlassCard
                    getCopyText={() =>
                      ["// beneficios", ...product.benefits].join("\n")
                    }
                    className="flex min-h-0 flex-col p-4 sm:p-5"
                  >
                    <p className={`${mono} shrink-0 uppercase text-white`}>
                      // beneficios
                    </p>
                    <ul className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto">
                      {product.benefits.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-sm bg-cyan-400" />
                          <span
                            className={`${mono} min-w-0 flex-1 text-slate-300`}
                          >
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CopyableGlassCard>
                  <CopyableGlassCard
                    getCopyText={() =>
                      ["// base_científica", ...product.scientificBasis].join(
                        "\n",
                      )
                    }
                    className="flex min-h-0 flex-col p-4 sm:p-5"
                  >
                    <p className={`${mono} shrink-0 uppercase text-white`}>
                      // base_científica
                    </p>
                    <ul className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto">
                      {product.scientificBasis.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-sm bg-blue-400" />
                          <span
                            className={`${mono} min-w-0 flex-1 text-slate-300`}
                          >
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CopyableGlassCard>
                </div>

                <CopyableGlassCard
                  getCopyText={() =>
                    ["// formato_uso", ...product.formatAndSize].join("\n")
                  }
                  className="shrink-0 p-4 sm:p-5"
                >
                  <p className={`${mono} uppercase text-white`}>
                    // formato_uso
                  </p>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-2.5">
                    {product.formatAndSize.map((t) => (
                      <CopyableGlassCard
                        key={t}
                        stopParentCopy
                        getCopyText={() => t}
                        className="min-h-0 min-w-0 rounded-xl border border-white/20 bg-slate-950/35 p-3 backdrop-blur-md"
                      >
                        <p className={`${mono} text-slate-300`}>{t}</p>
                      </CopyableGlassCard>
                    ))}
                  </div>
                </CopyableGlassCard>
              </div>

              <div className="flex min-h-0 flex-col items-center gap-2 border-t border-white/20 lg:col-span-5 lg:border-l lg:border-t-0 lg:items-stretch lg:gap-2.5 lg:py-5 lg:pr-6">
                <div className="flex w-full min-w-0 flex-col items-center gap-2 p-3 sm:p-4 lg:items-stretch lg:p-0">
                  <GlassCard className="w-full max-w-md shrink-0 cursor-default select-none lg:max-w-none">
                    <div className="rounded-[inherit] bg-gradient-to-br from-slate-950/75 via-slate-900/70 to-slate-950/85 p-2 sm:p-3">
                      <div className="flex justify-center">
                        {product.imageSrc ? (
                          <img
                            src={product.imageSrc}
                            alt={product.name}
                            className="h-auto max-h-[min(42vh,340px)] w-auto max-w-full object-contain lg:max-h-[min(34vh,300px)]"
                            sizes="(min-width: 1024px) 380px, 100vw"
                          />
                        ) : (
                          <div className="h-40 w-full rounded-lg bg-slate-800/80" />
                        )}
                      </div>
                    </div>
                  </GlassCard>
                  <DosageCalculator />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
