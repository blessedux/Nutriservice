"use client";

import Link from "next/link";
import * as React from "react";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  CircleCheck,
  DollarSign,
  Fish,
  Headphones,
  Shield,
  TrendingUp,
} from "lucide-react";

import { HOME_BLUE_BG } from "@/components/home-blue-band";
import { cn } from "@/lib/utils";

type Industry = "acuicola" | "avicola" | "porcina" | "mascotas";
type Objective =
  | "conversion"
  | "inmunidad"
  | "digestibilidad"
  | "costos";
type Product =
  | "nucleoforce-salmonids"
  | "macrogard"
  | "m-prove"
  | "activemos";

type Stage = {
  id: string;
  label: string;
  volumeLabel: string;
  impact: string;
  costPerTon: string;
  savingsPct?: number;
  bagScale: number;
  x: number;
  y: number;
};

const STAGES: Stage[] = [
  {
    id: "inicial",
    label: "DOSIS INICIAL",
    volumeLabel: "15 ton",
    impact: "BAJO",
    costPerTon: "USD 1,25",
    bagScale: 0.62,
    x: 11,
    y: 72,
  },
  {
    id: "rendimiento",
    label: "MEJOR RENDIMIENTO",
    volumeLabel: "30 ton",
    impact: "MEDIO",
    costPerTon: "USD 1,10",
    savingsPct: 12,
    bagScale: 0.78,
    x: 34,
    y: 54,
  },
  {
    id: "operacional",
    label: "EFICIENCIA OPERACIONAL",
    volumeLabel: "60 ton",
    impact: "ALTO",
    costPerTon: "USD 0,95",
    savingsPct: 24,
    bagScale: 0.94,
    x: 62,
    y: 36,
  },
  {
    id: "maxima",
    label: "MÁXIMA EFICIENCIA",
    volumeLabel: "100+ ton",
    impact: "MÁXIMO",
    costPerTon: "USD 0,80",
    savingsPct: 36,
    bagScale: 1,
    x: 88,
    y: 18,
  },
];

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: "acuicola", label: "Acuícola" },
  { value: "avicola", label: "Avícola" },
  { value: "porcina", label: "Porcina" },
  { value: "mascotas", label: "Mascotas" },
];

const OBJECTIVES: { value: Objective; label: string }[] = [
  { value: "conversion", label: "Mejorar conversión alimenticia" },
  { value: "inmunidad", label: "Fortalecer respuesta inmune" },
  { value: "digestibilidad", label: "Optimizar digestibilidad" },
  { value: "costos", label: "Reducir costo por tonelada" },
];

const PRODUCTS: { value: Product; label: string }[] = [
  { value: "nucleoforce-salmonids", label: "NUCLEOFORCE SALMONIDS" },
  { value: "macrogard", label: "MACROGARD" },
  { value: "m-prove", label: "M-PROVE" },
  { value: "activemos", label: "ACTIVEMOS" },
];

function fmtCurrency(value: number) {
  return value
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function fmtDecimal(value: number, decimals = 1) {
  return value.toFixed(decimals).replace(".", ",");
}

function buildCurvePath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";

  const [first, ...rest] = points;
  let path = `M ${first.x} ${first.y}`;

  for (let i = 0; i < rest.length; i += 1) {
    const prev = i === 0 ? first : rest[i - 1];
    const current = rest[i];
    const cx1 = prev.x + (current.x - prev.x) * 0.45;
    const cy1 = prev.y;
    const cx2 = current.x - (current.x - prev.x) * 0.45;
    const cy2 = current.y;
    path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${current.x} ${current.y}`;
  }

  return path;
}

function ProductBag({ scale }: { scale: number }) {
  const width = Math.round(54 * scale);
  const height = Math.round(72 * scale);

  return (
    <div
      className="relative mx-auto flex items-end justify-center"
      style={{ width: width + 8, height: height + 10 }}
    >
      <div
        className="relative overflow-hidden rounded-[6px] border border-white/10 bg-gradient-to-b from-slate-700/90 via-slate-800 to-slate-950 shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
        style={{ width, height }}
      >
        <div className="absolute inset-x-0 top-[18%] h-px bg-white/15" />
        <div className="absolute inset-x-0 top-[34%] h-px bg-white/10" />
        <div className="absolute left-1/2 top-[8%] h-[10%] w-[34%] -translate-x-1/2 rounded-sm bg-slate-600/80" />
        <div className="absolute inset-x-[14%] bottom-[18%] top-[42%] rounded-[3px] border border-cyan-400/25 bg-gradient-to-br from-cyan-500/20 to-blue-700/30">
          <div className="flex h-full flex-col items-center justify-center px-1 text-center">
            <span className="text-[7px] font-bold leading-none tracking-[0.12em] text-cyan-200/90">
              N
            </span>
            <span className="mt-0.5 text-[5px] font-semibold uppercase leading-tight tracking-wide text-white/75">
              Nucleoforce
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/75">
      {index}. {children}
    </span>
  );
}

function SelectShell({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon ? (
        <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-cyan-300/80">
          {icon}
        </span>
      ) : null}
      {children}
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
    </div>
  );
}

function ImpactChart({
  activeStageIndex,
  calculated,
}: {
  activeStageIndex: number;
  calculated: boolean;
}) {
  const svgPoints = STAGES.map((stage) => ({
    x: stage.x,
    y: stage.y,
  }));

  const path = buildCurvePath(svgPoints);

  return (
    <div className="relative min-h-[320px] w-full sm:min-h-[360px] lg:min-h-[390px]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-[4%] top-[18%] h-[42%] w-[92%] overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id="calc-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#1E6BFF" />
          </linearGradient>
          <filter id="calc-glow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={path}
          fill="none"
          stroke="url(#calc-line-gradient)"
          strokeWidth="0.55"
          strokeLinecap="round"
          filter="url(#calc-glow)"
          className={cn(
            "transition-opacity duration-500",
            calculated ? "opacity-100" : "opacity-35",
          )}
        />
        {STAGES.map((stage, index) => (
          <g key={stage.id}>
            <circle
              cx={stage.x}
              cy={stage.y}
              r={index === activeStageIndex ? 1.35 : 1.05}
              fill="#00D2FF"
              filter="url(#calc-glow)"
              className={cn(
                "transition-all duration-500",
                calculated ? "opacity-100" : "opacity-40",
              )}
            />
          </g>
        ))}
      </svg>

      <div className="absolute inset-0">
        {STAGES.map((stage, index) => (
          <div
            key={stage.id}
            className="absolute -translate-x-1/2"
            style={{ left: `${stage.x}%`, top: `${stage.y - 16}%` }}
          >
            <div
              className={cn(
                "min-w-[92px] rounded-md border px-2 py-1.5 text-center shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-500 sm:min-w-[108px]",
                index === activeStageIndex && calculated
                  ? "border-cyan-400/45 bg-slate-900/90"
                  : "border-white/10 bg-slate-950/75",
              )}
            >
              <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">
                {stage.label}
              </p>
              <p className="mt-0.5 text-[11px] font-bold text-white sm:text-xs">
                {stage.volumeLabel}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-[2%] bottom-[8%] grid grid-cols-4 gap-1 sm:gap-2">
        {STAGES.map((stage, index) => (
          <div key={stage.id} className="flex flex-col items-center">
            <ProductBag scale={stage.bagScale} />
            <div className="mt-3 w-full text-center">
              <p className="text-[8px] uppercase tracking-[0.12em] text-slate-500 sm:text-[9px]">
                Impacto estimado
              </p>
              <p
                className={cn(
                  "mt-0.5 text-[10px] font-bold uppercase sm:text-[11px]",
                  index === activeStageIndex && calculated
                    ? "text-cyan-300"
                    : "text-white",
                )}
              >
                {stage.impact}
              </p>
              <p className="mt-2 text-[8px] uppercase tracking-[0.12em] text-slate-500 sm:text-[9px]">
                Costo por ton
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-white sm:text-[11px]">
                {stage.costPerTon}
              </p>
              {stage.savingsPct ? (
                <p className="mt-0.5 text-[10px] font-semibold text-emerald-400">
                  ↓ {stage.savingsPct}%
                </p>
              ) : (
                <p className="mt-0.5 text-[10px] text-transparent">—</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryMetric({
  icon,
  label,
  value,
  subtext,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  subtext?: string;
  detail?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-3 px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-500/10 text-cyan-300">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>
        {value ? (
          <p className="mt-1 truncate text-xl font-bold text-white sm:text-2xl">{value}</p>
        ) : null}
        {subtext ? (
          <p className="mt-0.5 text-xs text-slate-400">{subtext}</p>
        ) : null}
        {detail}
      </div>
    </div>
  );
}

export default function SmartFeedCalculator() {
  const [industry, setIndustry] = React.useState<Industry>("acuicola");
  const [volume, setVolume] = React.useState("60");
  const [objective, setObjective] = React.useState<Objective>("conversion");
  const [product, setProduct] = React.useState<Product>("nucleoforce-salmonids");
  const [calculated, setCalculated] = React.useState(true);

  const parsedVolume = Math.max(0, parseFloat(volume.replace(",", ".")) || 0);

  const activeStageIndex = React.useMemo(() => {
    if (parsedVolume < 22) return 0;
    if (parsedVolume < 45) return 1;
    if (parsedVolume < 80) return 2;
    return 3;
  }, [parsedVolume]);

  const projectedSavings = Math.round(248500 * (parsedVolume / 60 || 0));
  const projectedImpact = fmtDecimal(
    Math.min(15, 4.5 + parsedVolume * 0.067),
    1,
  );

  const contactHref = `/contacto?origen=calculadora-smart-feed&industria=${encodeURIComponent(industry)}&volumen=${encodeURIComponent(String(parsedVolume))}&objetivo=${encodeURIComponent(objective)}&producto=${encodeURIComponent(product)}`;

  const fieldClass =
    "w-full appearance-none rounded-lg border border-white/10 bg-white/[0.04] py-3 text-sm text-white outline-none transition-colors focus:border-cyan-400/40 focus:bg-white/[0.06]";

  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#050A18] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      style={{ backgroundColor: HOME_BLUE_BG }}
    >
      <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] xl:grid-cols-[minmax(0,380px)_1fr]">
        {/* Sidebar */}
        <aside className="border-b border-white/10 px-6 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:py-10">
          <div className="flex items-center gap-2">
            <span className="h-px w-5 bg-cyan-400/80" aria-hidden />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
              Calculadora Smart Feed
            </p>
          </div>

          <h2 className="mt-5 text-2xl font-bold leading-tight text-white sm:text-[1.65rem]">
            Proyección de Eficiencia Productiva
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Estima el impacto económico y operacional de implementar una solución
            Nutriservice según tu volumen productivo.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              setCalculated(true);
            }}
          >
            <div>
              <FieldLabel index="01">Industria</FieldLabel>
              <SelectShell icon={<Fish className="size-4" strokeWidth={1.75} />}>
                <select
                  value={industry}
                  onChange={(event) => {
                    setCalculated(false);
                    setIndustry(event.target.value as Industry);
                  }}
                  className={cn(fieldClass, "pl-10 pr-10")}
                >
                  {INDUSTRIES.map((item) => (
                    <option key={item.value} value={item.value} className="bg-slate-900">
                      {item.label}
                    </option>
                  ))}
                </select>
              </SelectShell>
            </div>

            <div>
              <FieldLabel index="02">Volumen mensual</FieldLabel>
              <div className="grid grid-cols-[1fr_auto] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] focus-within:border-cyan-400/40">
                <input
                  type="text"
                  inputMode="decimal"
                  value={volume}
                  onChange={(event) => {
                    setCalculated(false);
                    setVolume(event.target.value);
                  }}
                  className="min-w-0 border-0 bg-transparent px-3.5 py-3 text-sm text-white outline-none"
                />
                <div className="relative border-l border-white/10">
                  <select
                    defaultValue="toneladas"
                    className="h-full appearance-none bg-transparent py-3 pl-3 pr-9 text-sm text-slate-300 outline-none"
                  >
                    <option value="toneladas" className="bg-slate-900">
                      toneladas
                    </option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <div>
              <FieldLabel index="03">Objetivo productivo</FieldLabel>
              <SelectShell icon={<Shield className="size-4" strokeWidth={1.75} />}>
                <select
                  value={objective}
                  onChange={(event) => {
                    setCalculated(false);
                    setObjective(event.target.value as Objective);
                  }}
                  className={cn(fieldClass, "pl-10 pr-10")}
                >
                  {OBJECTIVES.map((item) => (
                    <option key={item.value} value={item.value} className="bg-slate-900">
                      {item.label}
                    </option>
                  ))}
                </select>
              </SelectShell>
            </div>

            <div>
              <FieldLabel index="04">Producto sugerido</FieldLabel>
              <SelectShell
                icon={
                  <span className="flex size-4 items-center justify-center rounded-[3px] bg-gradient-to-br from-cyan-400 to-blue-600 text-[9px] font-bold text-white">
                    N
                  </span>
                }
              >
                <select
                  value={product}
                  onChange={(event) => {
                    setCalculated(false);
                    setProduct(event.target.value as Product);
                  }}
                  className={cn(fieldClass, "pl-10 pr-10 text-[13px] font-medium uppercase tracking-wide")}
                >
                  {PRODUCTS.map((item) => (
                    <option key={item.value} value={item.value} className="bg-slate-900">
                      {item.label}
                    </option>
                  ))}
                </select>
              </SelectShell>
            </div>

            <div className="space-y-3 pt-1">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#00D2FF] to-[#1E6BFF] px-4 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_rgba(30,107,255,0.35)] transition-transform hover:brightness-110 active:scale-[0.99]"
              >
                Calcular proyección
                <ArrowRight className="size-4" strokeWidth={2.25} />
              </button>

              <Link
                href={contactHref}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#1E6BFF]/55 bg-transparent px-4 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-cyan-200 transition-colors hover:border-cyan-300/70 hover:bg-white/[0.04]"
              >
                <Headphones className="size-4" strokeWidth={1.75} />
                Hablar con especialista
              </Link>
            </div>
          </form>

          <p className="mt-6 flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
            <CircleCheck className="mt-0.5 size-3.5 shrink-0 text-cyan-400/80" />
            Cálculo referencial basado en datos promedio de la industria.
          </p>
        </aside>

        {/* Main visualization */}
        <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 items-center justify-center rounded-md border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
              <BarChart3 className="size-4" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-300">
                Proyección de impacto
              </h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-400">
                Visualización referencial del potencial de optimización según escala
                operacional y producto seleccionado.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.02] px-2 py-4 sm:px-4 sm:py-5">
            <ImpactChart
              activeStageIndex={activeStageIndex}
              calculated={calculated}
            />
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
            <div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
              <SummaryMetric
                icon={<DollarSign className="size-4" strokeWidth={1.75} />}
                label="Ahorro proyectado"
                value={`$${fmtCurrency(projectedSavings)}`}
                subtext="USD / año"
              />
              <SummaryMetric
                icon={<TrendingUp className="size-4" strokeWidth={1.75} />}
                label="Impacto estimado"
                value={`-${projectedImpact}%`}
                subtext="costo por unidad producida"
              />
              <SummaryMetric
                icon={<Shield className="size-4" strokeWidth={1.75} />}
                label="Programa recomendado"
                detail={
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-white">
                      Premix funcional + núcleo específico
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Solución integral Nutriservice
                    </p>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
