"use client";

import Link from "next/link";
import * as React from "react";

const mono =
  "font-mono text-[9px] sm:text-[10px] leading-tight tracking-wide";

function fmtComma(n: number, decimals: number) {
  return n
    .toFixed(decimals)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

export default function DosageCalculator() {
  const [tonsStr, setTonsStr] = React.useState("1");
  const [dose, setDose] = React.useState<0.5 | 1 | 2>(1);

  const tons = parseFloat(tonsStr.replace(",", ".")) || 0;
  const kgMacro = tons * dose;
  const kgRounded = Math.round(kgMacro * 100) / 100;
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
