import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import FooterNewsletter from "@/components/footer-newsletter";

const SOLUCIONES_LINKS = [
  { href: "/industrias/acuicola", label: "Acuícola" },
  { href: "/industrias/avicola", label: "Aves" },
  { href: "/industrias/mascotas", label: "Mascotas" },
  { href: "/industrias/porcina", label: "Ganadería" },
];

const COMPANIA_LINKS = [
  { href: "/tecnologia", label: "I+D Lab" },
  { href: "/productos", label: "Calidad" },
  { href: "/nosotros", label: "Carreras" },
  { href: "/contacto", label: "Contacto" },
];

const LEGAL_LINKS = [
  { href: "/legal/terminos", label: "Protocolos" },
  { href: "/legal/privacidad", label: "Privacidad" },
  { href: "/productos", label: "Certificaciones" },
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

function SocialIconGlobe({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
    </svg>
  );
}

function SocialIconVimeo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.405 0-2.599-1.299-3.532-3.898-.641-2.385-1.284-4.77-1.927-7.155-.713-2.597-1.479-3.896-2.304-3.896-.178 0-.806.378-1.879 1.132L0 7.108c1.188-1.048 2.359-2.096 3.518-3.139 1.579-1.376 2.779-2.099 3.612-2.174 1.898-.179 3.065 1.118 3.507 3.893.472 2.994.797 4.852.973 5.578.539 2.45 1.131 3.674 1.774 3.674.502 0 1.256-.794 2.265-2.385 1.004-1.591 1.54-2.806 1.611-3.647.143-1.371-.393-2.061-1.611-2.061-.573 0-1.164.132-1.774.397 1.179-3.868 3.434-5.756 6.761-5.653 2.472.066 3.627 1.664 3.465 4.785z" />
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
    <footer className="relative overflow-hidden bg-[#0a192f] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 85% 55% at 50% 45%, rgba(30, 58, 138, 0.22), transparent 62%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 py-16 md:px-12 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-12 border-b border-white/[0.05] pb-16 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-16 lg:pb-24">
          {/* Brand */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Link href="/" className="inline-block w-[203px] max-w-full">
              <Image
                src="/nutriservice_logo_white.png"
                alt="Nutriservice"
                width={406}
                height={126}
                className="h-auto w-full object-contain object-left"
              />
            </Link>
            <p className="max-w-[320px] text-sm leading-[1.62] text-white/40">
              Líderes en biotecnología aplicada a la nutrición animal industrial.
              Ciencia para el rendimiento global.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/25 hover:text-white"
                aria-label="LinkedIn"
              >
                <SocialIconLinkedIn className="size-[14px]" />
              </a>
              <a
                href="https://nutriservice.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/25 hover:text-white"
                aria-label="Sitio web"
              >
                <SocialIconGlobe className="size-4" />
              </a>
              <a
                href="https://vimeo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/25 hover:text-white"
                aria-label="Vimeo"
              >
                <SocialIconVimeo className="size-4" />
              </a>
            </div>
          </div>

          {/* Soluciones */}
          <nav
            className="flex flex-col gap-6 lg:col-span-3 lg:col-start-5"
            aria-label="Soluciones"
          >
            <FooterColumnTitle>Soluciones</FooterColumnTitle>
            <ul className="flex flex-col gap-4">
              {SOLUCIONES_LINKS.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-xs leading-4 text-white/30 transition-colors hover:text-white sm:text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Compañía */}
          <nav
            className="flex flex-col gap-6 lg:col-span-2"
            aria-label="Compañía"
          >
            <FooterColumnTitle>Compañía</FooterColumnTitle>
            <ul className="flex flex-col gap-4">
              {COMPANIA_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs leading-4 text-white/30 transition-colors hover:text-white sm:text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            <FooterColumnTitle>Newsletter técnico</FooterColumnTitle>
            <p className="max-w-sm text-[10px] leading-[15px] text-white/30">
              Reciba reportes trimestrales de avance en biotecnología.
            </p>
            <FooterNewsletter />
          </div>
        </div>

        <div className="flex flex-col gap-8 pt-12 md:flex-row md:items-center md:justify-between md:gap-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/20">
            © {year} Nutriservice SPA • V 1.1
          </p>
          <nav
            className="flex flex-wrap gap-x-10 gap-y-3 md:gap-x-12"
            aria-label="Legal"
          >
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/20 transition-colors hover:text-white/45"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
