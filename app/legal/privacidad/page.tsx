import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad — Nutriservice",
  description:
    "Política de privacidad de Nutriservice. Información sobre el tratamiento de datos personales.",
};

export default function PrivacidadPage() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto prose prose-sm prose-neutral">
        <p className="text-xs font-semibold uppercase tracking-widest text-ns-muted mb-2">
          Legal
        </p>
        <h1 className="text-3xl font-bold text-ns-text mb-8">
          Política de privacidad
        </h1>
        <p className="text-sm text-ns-muted mb-6">
          Última actualización: {new Date().toLocaleDateString("es-CL")}
        </p>

        <div className="space-y-8 text-ns-muted leading-relaxed text-sm">
          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              1. Responsable del tratamiento
            </h2>
            <p>
              Nutriservice es responsable del tratamiento de los datos
              personales recopilados a través de este sitio web, de conformidad
              con la legislación chilena vigente (Ley 19.628 sobre protección
              de la vida privada).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              2. Datos que recopilamos
            </h2>
            <p>
              A través de nuestro formulario de contacto recopilamos: nombre,
              empresa, correo electrónico, teléfono (opcional), rubro productivo
              y el mensaje enviado voluntariamente.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              3. Finalidad del tratamiento
            </h2>
            <p>
              Los datos recopilados se utilizan exclusivamente para responder a
              solicitudes de contacto, coordinar reuniones técnicas y gestionar
              la relación comercial con potenciales y actuales clientes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              4. Derechos del titular
            </h2>
            <p>
              Tienes derecho a acceder, rectificar, cancelar u oponerte al
              tratamiento de tus datos personales. Para ejercer estos derechos,
              contáctanos a través del formulario de contacto del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              5. Conservación de datos
            </h2>
            <p>
              Los datos se conservan durante el tiempo necesario para gestionar
              la relación solicitada y en cumplimiento de las obligaciones
              legales aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-ns-text mb-2">
              6. Seguridad
            </h2>
            <p>
              Aplicamos medidas técnicas y organizativas razonables para
              proteger la información personal contra acceso no autorizado,
              pérdida o destrucción.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
