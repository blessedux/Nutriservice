import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const SOLUCIONES_LINKS = [
  { href: "/industrias/acuicola", label: "Acuícola" },
  { href: "/industrias/avicola", label: "Avícola" },
  { href: "/industrias/porcina", label: "Porcina" },
  { href: "/industrias/mascotas", label: "Mascotas" },
];

const COMPANIA_LINKS = [
  { href: "/tecnologia", label: "I+D Lab" },
  { href: "/productos", label: "Calidad" },
  { href: "/impacto", label: "Impacto" },
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

function SocialIconWhatsApp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
        className="pointer-events-none absolute inset-0 bg-[length:auto_100%] bg-[position:calc(100%+2rem)_center] bg-no-repeat sm:bg-cover sm:bg-[position:right_center]"
        style={{ backgroundImage: "url(/Footer_bg_img.webp)" }}
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
            <p className="max-w-[320px] text-sm leading-[1.62] text-white">
              Creemos en una nutrición inteligente, responsable y adaptada a cada
              necesidad, porque cada especie y cada productor merece una solución
              pensada a su medida.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/"
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
                href="https://wa.me/56900000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-white/25 hover:opacity-80"
                aria-label="WhatsApp"
              >
                <SocialIconWhatsApp className="size-4" />
              </a>
            </div>
          </div>

          {/* Soluciones */}
          <nav
            className="flex flex-col items-end gap-6 text-right lg:col-span-3 lg:col-start-5 lg:mt-auto lg:items-start lg:text-left"
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
            className="flex flex-col items-end gap-6 text-right lg:col-span-4 lg:mt-auto lg:items-start lg:text-left"
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

        <div className="flex flex-col items-center gap-8 pt-12 text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white">
            © {year} Nutriservice SPA • V 1.1
          </p>
          <nav
            className="flex flex-wrap justify-center gap-x-10 gap-y-3 md:gap-x-12"
            aria-label="Legal"
          >
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="text-[9px] font-bold uppercase tracking-[0.28em] text-white transition-colors hover:opacity-80"
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
