import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-32 px-6 bg-white flex-1">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-8xl font-bold text-ns-surface-alt mb-6 leading-none">
          404
        </p>
        <h1 className="text-2xl font-bold text-ns-text mb-3">
          Esta página no existe
        </h1>
        <p className="text-ns-muted mb-10 leading-relaxed">
          La URL que buscas no fue encontrada. Puede que haya cambiado o que
          nunca haya existido.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex justify-center items-center rounded-lg bg-ns-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-ns-green-dark transition-colors"
          >
            Ir al inicio
          </Link>
          <Link
            href="/contacto"
            className="inline-flex justify-center items-center rounded-lg border border-ns-border px-5 py-2.5 text-sm font-semibold text-ns-text hover:border-ns-green hover:text-ns-green transition-colors"
          >
            Contacto
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { href: "/soluciones", label: "Soluciones" },
            { href: "/industrias", label: "Industrias" },
            { href: "/tecnologia", label: "Tecnología" },
            { href: "/impacto", label: "Impacto" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ns-muted hover:text-ns-green transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
