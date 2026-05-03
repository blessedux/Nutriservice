import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contacto — Agenda una evaluación técnica",
  description:
    "Agenda una reunión técnica con los especialistas de Nutriservice. Sin compromiso, con datos. Respondemos dentro de 24 horas hábiles.",
};

const WHAT_HAPPENS = [
  {
    step: "01",
    title: "Recibimos tu solicitud",
    detail:
      "Revisamos la información que nos envías para entender tu contexto productivo.",
  },
  {
    step: "02",
    title: "Te contactamos en 24 h",
    detail:
      "Un especialista te contacta para coordinar una reunión técnica breve.",
  },
  {
    step: "03",
    title: "Evaluación técnica",
    detail:
      "En la reunión revisamos tu situación productiva y definimos si hay una oportunidad de mejora concreta.",
  },
  {
    step: "04",
    title: "Propuesta específica",
    detail:
      "Si hay fit, preparamos una propuesta técnica adaptada a tu operación. Sin generic pitches.",
  },
];

export default function ContactoPage() {
  return (
    <>
      <section className="bg-ns-dark text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald mb-4">
            Contacto
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Hablemos de tu operación
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
            No es una llamada de ventas. Es una conversación técnica para
            entender tu situación productiva y evaluar si hay un margen de
            mejora real.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-14">
          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-ns-text mb-2">
              Solicita una evaluación técnica
            </h2>
            <p className="text-sm text-ns-muted mb-8">
              Cuéntanos brevemente qué produces y qué estás buscando mejorar.
            </p>
            <ContactForm />
          </div>

          {/* What happens */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-bold text-ns-text mb-6 uppercase tracking-wider">
              Qué pasa después
            </h2>
            <div className="space-y-5">
              {WHAT_HAPPENS.map((w) => (
                <div key={w.step} className="flex gap-4">
                  <p className="text-xl font-bold text-ns-surface-alt flex-shrink-0 w-7 leading-none mt-0.5">
                    {w.step}
                  </p>
                  <div>
                    <h3 className="font-semibold text-ns-text text-sm mb-0.5">
                      {w.title}
                    </h3>
                    <p className="text-sm text-ns-muted leading-relaxed">
                      {w.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl bg-ns-surface border border-ns-border p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ns-muted mb-2">
                ¿Prefires WhatsApp?
              </p>
              <p className="text-sm text-ns-muted leading-relaxed">
                Escríbenos directamente y coordinamos la reunión técnica por
                esa vía.
              </p>
              <a
                href="https://wa.me/56900000000"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center text-sm font-semibold text-ns-green hover:underline"
              >
                Abrir WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
