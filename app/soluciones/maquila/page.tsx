import type { Metadata } from "next";

import CtaFooterParallax from "@/components/cta-footer-parallax";
import { HOME_INDUSTRIES_BG } from "@/components/home-blue-band";
import IndustriasCtaBanner from "@/components/industrias-cta-banner";
import MaquilaPageLayout from "@/components/maquila-page-layout";

export const metadata: Metadata = {
  title: "Maquila — Premixes y núcleos a medida",
  description:
    "Producción a terceros con confidencialidad, calidad y respaldo técnico. Premezclas y soluciones nutricionales con trazabilidad, procesos GMP y REP.",
};

export default function MaquilaPage() {
  return (
    <div style={{ backgroundColor: HOME_INDUSTRIES_BG }}>
      <MaquilaPageLayout />

      <div className="mx-auto w-full max-w-6xl px-6 pb-12 sm:px-10 lg:px-12 xl:px-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a192f] p-8 backdrop-blur-md">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                Contacto Directo División Maquila
              </span>
              <h3 className="text-2xl font-black text-white">Sebastián Meneses</h3>
              <p className="text-sm text-white/50">Gerente de Operaciones</p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 md:gap-8 text-sm">
              <div className="space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40">Móvil:</span>
                <a
                  href="https://wa.me/56995397839"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-white/80 transition-colors hover:text-cyan-300"
                >
                  +56 9 9539 7839
                </a>
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40">Email:</span>
                <a
                  href="mailto:smeneses@nutriservice.cl"
                  className="text-base text-white/80 transition-colors hover:text-cyan-300"
                >
                  smeneses@nutriservice.cl
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CtaFooterParallax>
        <IndustriasCtaBanner id="contacto" />
      </CtaFooterParallax>
    </div>
  );
}
