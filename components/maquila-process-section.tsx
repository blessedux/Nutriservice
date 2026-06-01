import { MAQUILA_PROCESS_STEPS } from "@/lib/maquila-process-data";

export default function MaquilaProcessSection() {
  return (
    <section
      id="proceso"
      className="scroll-mt-24 border-b border-ns-border bg-ns-surface px-6 py-16 sm:px-10 sm:py-20 lg:px-12"
      aria-labelledby="maquila-process-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald">
          Cómo funciona
        </p>
        <h2
          id="maquila-process-heading"
          className="mt-4 max-w-2xl text-3xl font-bold text-ns-text sm:text-4xl"
        >
          Un proceso integral de maquila en tres etapas
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ns-muted sm:text-lg">
          Desde la formulación técnica hasta la optimización productiva,
          acompañamos cada fase con trazabilidad, control de calidad y
          confidencialidad de sus fórmulas.
        </p>

        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {MAQUILA_PROCESS_STEPS.map((step) => (
            <li
              key={step.id}
              className="flex h-full flex-col rounded-2xl border border-ns-border bg-white p-6 sm:p-8"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-ns-emerald">
                Paso {step.number}
              </span>
              <h3 className="mt-4 text-xl font-bold text-ns-text">
                {step.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ns-muted">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
