"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/soluciones", label: "Soluciones" },
  { href: "/industrias", label: "Industrias" },
  { href: "/tecnologia", label: "Tecnología" },
  { href: "/nosotros", label: "Nosotros" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-sm border-b border-ns-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl text-ns-green tracking-tight flex-shrink-0"
          onClick={() => setOpen(false)}
        >
          Nutriservice
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                isActive(l.href)
                  ? "text-ns-green"
                  : "text-ns-text hover:text-ns-green"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/contacto"
            className={`text-sm font-medium transition-colors ${
              pathname === "/contacto"
                ? "text-ns-green"
                : "text-ns-text hover:text-ns-green"
            }`}
          >
            Contacto
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center rounded-lg bg-ns-green px-4 py-2 text-sm font-semibold text-white hover:bg-ns-green-dark transition-colors"
          >
            Agendar evaluación
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <span
            className={`block w-6 h-0.5 bg-ns-text transition-transform duration-200 ${
              open ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-ns-text transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-ns-text transition-transform duration-200 ${
              open ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-ns-border bg-white px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium ${
                isActive(l.href) ? "text-ns-green" : "text-ns-text"
              }`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            className="text-sm font-medium text-ns-text"
            onClick={() => setOpen(false)}
          >
            Contacto
          </Link>
          <Link
            href="/contacto"
            className="inline-flex justify-center rounded-lg bg-ns-green px-4 py-3 text-sm font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            Agendar evaluación técnica
          </Link>
        </div>
      )}
    </header>
  );
}
