import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

const SOLUCIONES_LINKS = [
  { href: "/industrias/acuicola", label: "Acuícola" },
  { href: "/industrias/avicola", label: "Avícola" },
  { href: "/industrias/porcina", label: "Porcina" },
  { href: "/industrias/mascotas", label: "Mascotas" },
];

const COMPANIA_LINKS = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/industrias", label: "Industrias" },
  { href: "/contacto", label: "Contacto" },
];

const LEGAL_LINKS = [
  { href: "/legal/terminos", label: "Protocolos" },
  { href: "/legal/privacidad", label: "Privacidad" },
];

function SocialIconLinkedIn({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.849 3.37-1.849 3.602 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SocialIconInstagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.766 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function SocialIconEmail({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 7h16v10H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function FooterColumnTitle({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white">
      {children}
    </p>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-site-footer
      className="relative overflow-x-hidden bg-[#0a192f] text-white lg:min-h-150"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-no-repeat max-lg:bg-[length:auto_200%] max-lg:bg-[position:78%_66%] max-[440px]:bg-[position:8%_30%] lg:bg-cover lg:bg-[position:right_bottom]"
        style={{ backgroundImage: `url(${PUBLIC_ASSETS.footer.background})` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 85% 55% at 50% 45%, rgba(30, 58, 138, 0.22), transparent 62%)",
        }}
      />

      <div className="relative mx-auto flex min-h-full max-w-[1280px] flex-col px-6 pt-16 pb-10 md:px-12 md:pt-24 md:pb-12 lg:min-h-150 lg:pt-32 lg:pb-14">
        <div className="grid flex-1 grid-cols-1 gap-8 border-b border-white/[0.05] pb-12 lg:grid-cols-12 lg:items-start lg:gap-x-10 lg:gap-y-16 lg:pb-24">
          {/* Brand */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Link href="/" className="inline-block w-[305px] max-w-full">
              <Image
                src={PUBLIC_ASSETS.brand.logoWhite}
                alt="Nutriservice"
                width={609}
                height={189}
                className="h-auto w-full object-contain object-left"
              />
            </Link>
            <p className="max-w-[320px] text-sm leading-[1.62] text-white">
              Más de 30 años al servicio de la nutrición animal. Calidad e
              innovación en cada solución funcional.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/nutriservice-spa/?originalSubdomain=cl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-white/25 hover:opacity-80"
                aria-label="LinkedIn"
              >
                <SocialIconLinkedIn className="size-[14px]" />
              </a>
              <a
                href="https://www.instagram.com/nutriservicecl/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-white/25 hover:opacity-80"
                aria-label="Instagram"
              >
                <SocialIconInstagram className="size-4" />
              </a>
              <a
                href="mailto:sac@nutriservice.cl"
                className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-white/25 hover:opacity-80"
                aria-label="Correo electrónico"
              >
                <SocialIconEmail className="size-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-0 sm:gap-x-12 lg:contents">
            {/* Soluciones */}
            <nav
              className="mt-0 flex flex-col items-start gap-6 text-left lg:col-span-3 lg:col-start-5 lg:self-start"
              aria-label="Soluciones"
            >
              <FooterColumnTitle>Soluciones</FooterColumnTitle>
              <ul className="flex flex-col gap-4">
                {SOLUCIONES_LINKS.map((item) => (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      className="text-xs leading-4 text-white transition-colors hover:opacity-80 sm:text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Compañía */}
            <nav
              className="mt-0 flex flex-col items-start gap-6 text-left lg:col-span-4 lg:self-start"
              aria-label="Compañía"
            >
              <FooterColumnTitle>Compañía</FooterColumnTitle>
              <ul className="flex flex-col gap-4">
                {COMPANIA_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-xs leading-4 text-white transition-colors hover:opacity-80 sm:text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 pt-8 lg:pt-12">
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 sm:gap-x-10 md:gap-x-12"
            aria-label="Legal"
          >
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="text-[9px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:opacity-80 sm:tracking-[0.28em]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-end gap-1.5">
            <p className="shrink-0 text-[9px] font-bold uppercase tracking-[0.2em] text-white sm:tracking-[0.28em]">
              © {year} Nutriservice SPA • V 1.1
            </p>
            <a
              href="https://mentemaestra.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white/75 sm:tracking-[0.28em]"
            >
              MenteMaestra Studio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
