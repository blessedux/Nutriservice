import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";

import ContactForm from "@/components/contact-form";
import { HOME_INDUSTRIES_BG } from "@/components/home-blue-band";
import PageBackHeader from "@/components/page-back-header";
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
      className="min-h-screen -mt-24 px-4 pb-4 pt-28 sm:px-6 sm:pb-6 sm:pt-32 lg:px-8 lg:pb-8 lg:pt-36"
      style={{ backgroundColor: HOME_INDUSTRIES_BG }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative min-h-[min(92dvh,58rem)] overflow-hidden rounded-[2rem] border border-ns-border text-white sm:min-h-[min(94dvh,62rem)] sm:rounded-[2.5rem]">
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

          <div className="relative z-10 flex min-h-[min(92dvh,58rem)] flex-col gap-8 p-6 pt-10 sm:min-h-[min(94dvh,62rem)] sm:gap-10 sm:p-10 sm:pt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10 lg:gap-y-8 lg:p-12 lg:pt-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
            <PageBackHeader
              backHref="/"
              tone="on-dark"
              simple
              className="absolute left-6 top-10 z-20 mb-0 sm:left-10 sm:top-12 lg:left-12"
            />
            <div className="max-w-2xl pt-10 sm:pt-12 lg:col-start-1 lg:row-start-1">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ns-emerald">
                Contacto
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Hablemos de tu operación
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                Escribeparanos para
                entender tus desafíos productivos y evaluar soluciones
                específicas.
              </p>
            </div>

            <div
              className={`${GLASS_CARD} p-6 sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-2 lg:self-start xl:mt-4`}
            >
            <h2 className="mb-2 text-xl font-bold text-white">
            Contactanos
            </h2>
            <p className="mb-8 text-sm text-white/65">
              Indica tu rubro y tu consulta.
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
    </div>
  );
}
