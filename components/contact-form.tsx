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

export default function ContactForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
          <label className="block text-sm font-medium text-ns-text mb-1.5">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Tu nombre"
            className="w-full rounded-lg border border-ns-border px-4 py-3 text-sm text-ns-text placeholder:text-ns-subtle focus:outline-none focus:ring-2 focus:ring-ns-green/40 focus:border-ns-green transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ns-text mb-1.5">
            Empresa
          </label>
          <input
            type="text"
            name="company"
            required
            placeholder="Nombre de la empresa"
            className="w-full rounded-lg border border-ns-border px-4 py-3 text-sm text-ns-text placeholder:text-ns-subtle focus:outline-none focus:ring-2 focus:ring-ns-green/40 focus:border-ns-green transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-ns-text mb-1.5">
            Correo
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="tu@empresa.cl"
            className="w-full rounded-lg border border-ns-border px-4 py-3 text-sm text-ns-text placeholder:text-ns-subtle focus:outline-none focus:ring-2 focus:ring-ns-green/40 focus:border-ns-green transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ns-text mb-1.5">
            Teléfono (opcional)
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+56 9 ..."
            className="w-full rounded-lg border border-ns-border px-4 py-3 text-sm text-ns-text placeholder:text-ns-subtle focus:outline-none focus:ring-2 focus:ring-ns-green/40 focus:border-ns-green transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ns-text mb-1.5">
          Rubro productivo
        </label>
        <select
          name="rubro"
          required
          defaultValue=""
          className="w-full rounded-lg border border-ns-border px-4 py-3 text-sm text-ns-text focus:outline-none focus:ring-2 focus:ring-ns-green/40 focus:border-ns-green transition-colors bg-white"
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
        <label className="block text-sm font-medium text-ns-text mb-1.5">
          ¿En qué podemos ayudarte?
        </label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Describe brevemente tu situación productiva o la consulta que tienes."
          className="w-full rounded-lg border border-ns-border px-4 py-3 text-sm text-ns-text placeholder:text-ns-subtle focus:outline-none focus:ring-2 focus:ring-ns-green/40 focus:border-ns-green transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-ns-green px-6 py-3.5 text-sm font-semibold text-white hover:bg-ns-green-dark disabled:opacity-60 transition-colors"
      >
        {loading ? "Enviando…" : "Enviar solicitud"}
      </button>

      <p className="text-xs text-ns-subtle text-center">
        Respondemos dentro de 24 horas hábiles para coordinar una reunión
        técnica.
      </p>
    </form>
  );
}
