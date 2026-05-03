import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de uso — Nutriservice",
  description:
    "Términos y condiciones de uso del sitio web de Nutriservice.",
};

export default function TerminosPage() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-ns-muted mb-2">
          Legal
        </p>
        <h1 className="text-3xl font-bold text-ns-text mb-8">
          Términos de uso
        </h1>
        <p className="text-sm text-ns-muted mb-6">
          Última actualización: {new Date().toLocaleDateString("es-CL")}
        </p>

        <div className="space-y-8 text-ns-muted leading-relaxed text-sm">
          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              1. Aceptación de términos
            </h2>
            <p>
              El acceso y uso de este sitio web implica la aceptación de los
              presentes términos y condiciones. Si no estás de acuerdo, te
              pedimos que no utilices el sitio.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              2. Uso del sitio
            </h2>
            <p>
              Este sitio web es de carácter informativo y comercial. Está
              orientado a empresas y profesionales del sector de producción
              animal. No está destinado a consumidores finales ni a la venta
              directa.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              3. Propiedad intelectual
            </h2>
            <p>
              Todos los contenidos del sitio — textos, imágenes, gráficos,
              marcas y logotipos — son propiedad de Nutriservice o están bajo
              licencia de uso. Queda prohibida su reproducción sin
              autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              4. Exactitud de la información
            </h2>
            <p>
              Nutriservice procura mantener la información publicada actualizada
              y exacta, pero no garantiza que esté libre de errores. Las
              recomendaciones técnicas deben considerarse como orientativas y
              complementarse con evaluación profesional en cada caso.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              5. Limitación de responsabilidad
            </h2>
            <p>
              Nutriservice no se responsabiliza por daños derivados del uso de
              la información publicada en el sitio sin evaluación técnica
              personalizada previa.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              6. Modificaciones
            </h2>
            <p>
              Nutriservice se reserva el derecho de modificar estos términos en
              cualquier momento. El uso continuado del sitio tras las
              modificaciones implica aceptación de los términos actualizados.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              7. Legislación aplicable
            </h2>
            <p>
              Estos términos se rigen por la legislación chilena vigente.
              Cualquier disputa será sometida a los tribunales competentes de
              Chile.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
