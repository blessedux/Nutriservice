import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contacto — Agenda una evaluación técnica",
  description:
    "Agenda una reunión técnica con los especialistas de Nutriservice. Sin compromiso, con datos. Respondemos dentro de 24 horas hábiles.",
};

export default function ContactoPage() {
  return (
    <>
      <section className="bg-ns-surface px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl h-[80vh] min-h-[28rem] overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2rem] text-white">
          <Image
            src="/nutriservice_workers2.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1152px"
            className="object-cover object-center"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ns-dark via-ns-dark/75 to-ns-dark/30"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ns-dark/80 via-ns-dark/45 to-transparent"
            aria-hidden
          />
          <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-4">
              Contacto
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5 max-w-3xl">
              Hablemos de tu operación
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
              No es una llamada de ventas. Es una conversación técnica para
              entender tu situación productiva y evaluar si hay un margen de
              mejora real.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white sm:py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-ns-text mb-2">
            Solicita una evaluación técnica
          </h2>
          <p className="text-sm text-ns-muted mb-8">
            Cuéntanos brevemente qué produces y qué estás buscando mejorar.
          </p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
