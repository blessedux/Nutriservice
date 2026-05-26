import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";

import ContactForm from "@/components/contact-form";
import { HOME_INDUSTRIES_BG } from "@/components/home-blue-band";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export const metadata: Metadata = {
  title: "Contacto — Agenda una evaluación técnica",
  description:
    "Agenda una reunión técnica con los especialistas de Nutriservice. Sin compromiso, con datos. Respondemos dentro de 24 horas hábiles.",
};

function ContactInfoBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-bold uppercase tracking-wide text-white/90">
        {title}
      </h3>
      <div className="space-y-1 text-sm leading-relaxed text-white/65">
        {children}
      </div>
    </div>
  );
}

const GLASS_CARD =
  "rounded-[1.75rem] border border-white/20 bg-white/10 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md sm:rounded-[2rem]";

export default function ContactoPage() {
  return (
    <div
      className="min-h-screen -mt-24 pt-24 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
      style={{ backgroundColor: HOME_INDUSTRIES_BG }}
    >
      <div className="relative mx-auto min-h-[min(92dvh,58rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-ns-border text-white sm:min-h-[min(94dvh,62rem)] sm:rounded-[2.5rem]">
        <Image
          src={PUBLIC_ASSETS.shared.workersHero}
          alt=""
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ns-dark via-ns-dark/80 to-ns-dark/35"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ns-dark/85 via-ns-dark/55 to-ns-dark/20"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[min(92dvh,58rem)] flex-col gap-8 p-6 sm:min-h-[min(94dvh,62rem)] sm:gap-10 sm:p-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10 lg:gap-y-8 lg:p-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
          <div className="max-w-2xl lg:col-start-1 lg:row-start-1">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ns-emerald">
              Contacto
            </p>
            <h1 className="mb-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Hablemos de tu operación
            </h1>
            <p className="text-lg leading-relaxed text-white/70">
              No es una llamada de ventas. Es una conversación técnica para
              entender tu situación productiva y evaluar si hay un margen de
              mejora real.
            </p>
          </div>

          <div
            className={`${GLASS_CARD} p-6 sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start`}
          >
            <h2 className="mb-2 text-xl font-bold text-white">
              Solicita una evaluación técnica
            </h2>
            <p className="mb-8 text-sm text-white/65">
              Cuéntanos brevemente qué produces y qué estás buscando mejorar.
            </p>
            <ContactForm variant="on-dark" />
          </div>

          <section
            aria-labelledby="contacto-direcciones"
            className={`${GLASS_CARD} max-w-xl p-5 sm:p-6 lg:col-start-1 lg:row-start-2 lg:self-end`}
          >
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
              <div>
                <h2
                  id="contacto-direcciones"
                  className="text-[10px] font-semibold uppercase tracking-widest text-ns-emerald"
                >
                  Direcciones
                </h2>
                <div className="mt-4 space-y-5">
                  <ContactInfoBlock title="Oficina y bodega central">
                    <p>José Joaquín Pérez 4457 Quinta Normal, Santiago</p>
                    <p>
                      <span className="text-white/45">Tel.</span>{" "}
                      <a
                        href="tel:+56227860554"
                        className="text-white/85 transition-colors hover:text-cyan-300"
                      >
                        +56 227860554
                      </a>
                    </p>
                  </ContactInfoBlock>
                  <ContactInfoBlock title="Oficina sucursal">
                    <p>Región de los Lagos Estación 196, Puerto Varas</p>
                    <p>
                      <a
                        href="tel:+56652232500"
                        className="text-white/85 transition-colors hover:text-cyan-300"
                      >
                        +56 652232500
                      </a>
                    </p>
                  </ContactInfoBlock>
                </div>
              </div>

              <div>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest text-ns-emerald">
                  Horario
                </h2>
                <div className="mt-4 space-y-5">
                  <ContactInfoBlock title="Lunes a jueves">
                    <p>8:30 – 13:00 / 14:00 – 18:30 hrs</p>
                  </ContactInfoBlock>
                  <ContactInfoBlock title="Viernes">
                    <p>8:30 – 13:00 / 14:00 – 17:00 hrs</p>
                  </ContactInfoBlock>
                  <ContactInfoBlock title="Atención al cliente">
                    <p>
                      <a
                        href="mailto:sac@nutriservice.cl"
                        className="text-white/85 transition-colors hover:text-cyan-300"
                      >
                        sac@nutriservice.cl
                      </a>
                    </p>
                  </ContactInfoBlock>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
