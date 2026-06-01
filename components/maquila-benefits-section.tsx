import { MAQUILA_BENEFITS } from "@/lib/maquila-page-data";

export default function MaquilaBenefitsSection() {
  return (
    <section
      className="border-b border-ns-border bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-12"
      aria-labelledby="maquila-benefits-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald">
          Beneficios
        </p>
        <h2
          id="maquila-benefits-heading"
          className="mt-4 max-w-2xl text-3xl font-bold text-ns-text sm:text-4xl"
        >
          Servicio integral de maquila con respaldo técnico
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {MAQUILA_BENEFITS.map((benefit) => (
            <article
              key={benefit.id}
              className="flex h-full flex-col rounded-2xl border border-ns-border bg-ns-surface p-6 sm:p-8"
            >
              <div className="mb-4 h-0.5 w-8 bg-ns-green" aria-hidden />
              <h3 className="text-xl font-bold text-ns-text">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ns-muted">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
