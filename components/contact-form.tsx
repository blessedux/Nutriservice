"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RUBROS = [
  "Acuícola",
  "Avícola",
  "Porcina",
  "Alimento para mascotas",
  "Otro",
];

type ContactFormProps = {
  variant?: "default" | "on-dark";
  defaultMessage?: string;
  defaultRubro?: string;
};

export default function ContactForm({
  variant = "default",
  defaultMessage = "",
  defaultRubro = "",
}: ContactFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const onDark = variant === "on-dark";

  const labelClass = onDark
    ? "block text-sm font-medium text-white/90 mb-1.5"
    : "block text-sm font-medium text-ns-text mb-1.5";

  const fieldClass = onDark
    ? "w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-colors"
    : "w-full rounded-xl border border-ns-border px-4 py-3 text-sm text-ns-text placeholder:text-ns-subtle focus:border-ns-green focus:outline-none focus:ring-2 focus:ring-ns-green/40 transition-colors";

  const selectClass = onDark
    ? `${fieldClass} bg-white/10`
    : `${fieldClass} bg-white`;

  const buttonClass = onDark
    ? "w-full rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-[#0a192f] transition-colors hover:bg-cyan-400 disabled:opacity-60"
    : "w-full rounded-xl bg-ns-green px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ns-green-dark disabled:opacity-60";

  const footnoteClass = onDark
    ? "text-xs text-white/45 text-center"
    : "text-xs text-ns-subtle text-center";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: integrate with backend / CRM / email service
    await new Promise((r) => setTimeout(r, 600));
    router.push("/contacto/gracias");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>
            Nombre
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Tu nombre"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            Empresa
          </label>
          <input
            type="text"
            name="company"
            required
            placeholder="Nombre de la empresa"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>
            Correo
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="tu@empresa.cl"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            Teléfono (opcional)
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+56 9 ..."
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Rubro productivo
        </label>
        <select
          name="rubro"
          required
          defaultValue={defaultRubro}
          className={selectClass}
        >
          <option value="" disabled>
            Selecciona tu rubro
          </option>
          {RUBROS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>
          ¿En qué podemos ayudarte?
        </label>
        <textarea
          name="message"
          required
          rows={4}
          defaultValue={defaultMessage}
          placeholder="Describe brevemente tu situación productiva o la consulta que tienes."
          className={`${fieldClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={buttonClass}
      >
        {loading ? "Enviando…" : "Enviar solicitud"}
      </button>

      <p className={footnoteClass}>
        Respondemos dentro de 24 horas hábiles para coordinar una reunión
        técnica.
      </p>
    </form>
  );
}
