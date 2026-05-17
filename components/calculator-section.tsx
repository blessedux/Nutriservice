import DosageCalculator from "@/components/dosage-calculator";

export default function CalculatorSection() {
  return (
    <section
      id="calculadora"
      className="scroll-mt-24 bg-ns-surface px-6 py-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ns-emerald">
            Calculadora de dosis
          </p>
          <h2 className="text-3xl font-bold leading-tight text-ns-text sm:text-4xl">
            Estima cuánto MacroGard necesitas para tu operación
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ns-muted">
            Ingresa las toneladas de alimento y la dosis recomendada para obtener
            los kilogramos a cotizar. El enlace de contacto incluye todos los
            parámetros de tu cálculo.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <DosageCalculator />
        </div>
      </div>
    </section>
  );
}
