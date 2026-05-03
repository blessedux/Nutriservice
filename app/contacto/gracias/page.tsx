import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solicitud recibida — Nutriservice",
  description: "Tu solicitud fue recibida. Te contactamos dentro de 24 horas hábiles.",
};

export default function GraciasPage() {
  return (
    <section className="py-32 px-6 bg-white flex-1">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ns-surface border border-ns-border mb-6">
          <svg
            className="w-6 h-6 text-ns-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-ns-text mb-3">
          Solicitud recibida
        </h1>
        <p className="text-lg text-ns-muted leading-relaxed mb-8">
          Un especialista de Nutriservice te contactará dentro de{" "}
          <strong className="text-ns-text">24 horas hábiles</strong> para
          coordinar la evaluación técnica.
        </p>

        <div className="rounded-xl bg-ns-surface border border-ns-border p-6 text-left mb-10">
          <p className="text-sm font-semibold text-ns-text mb-3">
            Mientras tanto:
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                href="/soluciones"
                className="text-sm text-ns-green hover:underline"
              >
                Conoce el sistema de 4 pasos →
              </Link>
            </li>
            <li>
              <Link
                href="/industrias"
                className="text-sm text-ns-green hover:underline"
              >
                Revisa cómo trabajamos en tu industria →
              </Link>
            </li>
            <li>
              <Link
                href="/tecnologia"
                className="text-sm text-ns-green hover:underline"
              >
                Explora la infraestructura técnica →
              </Link>
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-ns-muted hover:text-ns-text transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>
    </section>
  );
}
