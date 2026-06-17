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
      <CtaFooterParallax>
        <IndustriasCtaBanner id="contacto">
          <div className="w-full max-w-sm rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Contacto Directo
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-base font-black text-white">Sebastián Meneses</p>
                <p className="text-xs text-white/50">Gerente de Operaciones</p>
              </div>
              <div className="space-y-2.5 pt-3 border-t border-white/10 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 min-w-[50px]">Fijo:</span>
                  <a
                    href="tel:+56227860554"
                    className="text-white/80 transition-colors hover:text-cyan-300"
                  >
                    +56 2 2786 0554
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 min-w-[50px]">Móvil:</span>
                  <a
                    href="https://wa.me/56995397839"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 transition-colors hover:text-cyan-300"
                  >
                    +56 9 9539 7839
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 min-w-[50px]">Email:</span>
                  <a
                    href="mailto:smeneses@nutriservice.cl"
                    className="text-white/80 transition-colors hover:text-cyan-300"
                  >
                    smeneses@nutriservice.cl
                  </a>
                </div>
              </div>
            </div>
          </div>
        </IndustriasCtaBanner>
      </CtaFooterParallax>
    </div>
  );
}
