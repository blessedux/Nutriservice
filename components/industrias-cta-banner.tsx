import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const PAGE_NAVY = "#0a192f";
const PAGE_CYAN = "#06b6d4";

type IndustriasCtaBannerProps = {
  id?: string;
  className?: string;
};

export default function IndustriasCtaBanner({
  id,
  className,
}: IndustriasCtaBannerProps = {}) {
  return (
    <section
      id={id}
      className={cn(
        "bg-white px-6 py-12 sm:px-10 sm:py-16 lg:px-16 xl:px-32",
        id && "scroll-mt-24",
        className,
      )}
    >
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[48px] bg-[#0a192f] px-6 py-16 text-center text-white sm:px-12 sm:py-20 lg:px-24">
        <Image
          src="/industrias/cta-texture.png"
          alt=""
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto flex max-w-[800px] flex-col items-center gap-6">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-[2rem] sm:leading-[1.35]">
            Hable con un especialista
            <br />
            de su sector productivo.
          </h2>
          <p className="text-pretty text-base leading-relaxed text-white/60 sm:text-lg">
            Agende una sesión técnica para analizar sus brechas de rendimiento y
            proyectar el impacto de nuestras soluciones en su operación.
          </p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-full px-10 py-4 text-xs font-black uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
              style={{ backgroundColor: PAGE_CYAN, color: PAGE_NAVY }}
            >
              Agendar Sesión Técnica
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-10 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Descargar Brochures
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
