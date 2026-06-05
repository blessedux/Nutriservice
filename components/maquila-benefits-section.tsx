import { MAQUILA_WHY_CHOOSE } from "@/lib/maquila-page-data";

export default function MaquilaWhyChooseSection() {
  return (
    <section
      className="border-b border-ns-border bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-12"
      aria-labelledby="maquila-why-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="maquila-why-heading"
          className="max-w-3xl text-3xl font-bold text-ns-text sm:text-4xl"
        >
          ¿Por qué elegir NutriService?
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {MAQUILA_WHY_CHOOSE.map((item) => (
            <article
              key={item.id}
              className="flex h-full flex-col rounded-2xl border border-ns-border bg-ns-surface p-6 sm:p-8"
            >
              <div className="mb-4 h-0.5 w-8 bg-ns-green" aria-hidden />
              <h3 className="text-xl font-bold text-ns-text">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ns-muted">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
