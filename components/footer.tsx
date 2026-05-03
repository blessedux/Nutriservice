import Link from "next/link";

const SISTEMA_LINKS = [
  { href: "/soluciones/diagnostico", label: "Diagnóstico" },
  { href: "/soluciones/formulacion", label: "Formulación" },
  { href: "/soluciones/implementacion", label: "Implementación" },
  { href: "/soluciones/optimizacion", label: "Optimización continua" },
];

const INDUSTRIA_LINKS = [
  { href: "/industrias/acuicola", label: "Acuícola" },
  { href: "/industrias/avicola", label: "Avícola" },
  { href: "/industrias/porcina", label: "Porcina" },
  { href: "/industrias/mascotas", label: "Mascotas" },
];

const EMPRESA_LINKS = [
  { href: "/tecnologia", label: "Tecnología" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-ns-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="text-ns-emerald font-bold text-xl">
              Nutriservice
            </Link>
            <p className="mt-3 text-sm text-ns-subtle leading-relaxed">
              Nutrición animal de alta precisión. Diagnóstico, formulación y
              soporte continuo para productores que optimizan por resultados.
            </p>
            <p className="mt-4 text-xs text-ns-subtle">
              Fundada en 1993 · Chile
            </p>
          </div>

          {/* Sistema */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ns-emerald mb-4">
              Sistema
            </p>
            <ul className="space-y-2.5">
              {SISTEMA_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ns-subtle hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industrias */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ns-emerald mb-4">
              Industrias
            </p>
            <ul className="space-y-2.5">
              {INDUSTRIA_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ns-subtle hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ns-emerald mb-4">
              Empresa
            </p>
            <ul className="space-y-2.5">
              {EMPRESA_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ns-subtle hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ns-subtle">
            © {new Date().getFullYear()} Nutriservice. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-6">
            <Link
              href="/legal/privacidad"
              className="text-xs text-ns-subtle hover:text-white transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/legal/terminos"
              className="text-xs text-ns-subtle hover:text-white transition-colors"
            >
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
