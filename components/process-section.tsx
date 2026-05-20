"use client";

import { BentoGridShowcase } from "@/components/ui/bento-product-features";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PROCESS_CARD_CLASS = cn(
  "h-full min-h-[180px] rounded-2xl border border-[rgba(30,58,138,0.08)] bg-white shadow-none",
);

function ProcessCard({ className }: { className?: string }) {
  return <Card className={cn(PROCESS_CARD_CLASS, className)} aria-hidden />;
}

/** Process / ventaja técnica — Figma 725:979, dark band below maquila. */
export default function ProcessSection() {
  return (
    <section
      id="proceso"
      aria-label="Proceso"
      className="relative scroll-mt-24 bg-[#0a192f]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 pt-12 pb-16 sm:px-10 sm:pt-14 sm:pb-20 md:pt-16 md:pb-24 lg:px-12 lg:pt-20 lg:pb-28 xl:px-20">
        <header className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:gap-8">
          <div className="flex items-center gap-4">
            <span
              className="h-px w-10 shrink-0 bg-cyan-500/70"
              aria-hidden
            />
            <p className="text-[10px] font-bold uppercase leading-[15px] tracking-[4px] text-cyan-500/60">
              Ventaja Técnica Nutriservice
            </p>
            <span
              className="h-px w-10 shrink-0 bg-cyan-500/70"
              aria-hidden
            />
          </div>
          <h2 className="text-balance text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-[48px] lg:leading-[48px]">
            Ciencia Aplicada al Rendimiento
          </h2>
        </header>

        <div className="mt-12 sm:mt-16 lg:mt-24">
          <BentoGridShowcase
            integration={<ProcessCard />}
            trackers={<ProcessCard />}
            statistic={<ProcessCard />}
            focus={<ProcessCard />}
            productivity={<ProcessCard />}
            shortcuts={<ProcessCard />}
          />
        </div>
      </div>
    </section>
  );
}
