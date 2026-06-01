"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { SoundWaveToggle } from "@/components/sound-wave-toggle";
import { useMobileExperience } from "@/hooks/use-mobile-experience";
import { AMBIENT_MUSIC_MAX_GAIN } from "@/lib/audio-gain";
import { PUBLIC_ASSETS } from "@/lib/public-assets";
import { getDivisionMedia } from "@/lib/productos-division-media";
import {
  getProductoBySlug,
  resolveProductoDivision,
} from "@/lib/productos-inventory";
import { PRODUCTOS_DIVISIONES } from "@/lib/productos-divisions";
import type { ProductoDivisionSlug } from "@/lib/productos-divisions";

/** Matches Figma Nav — https://www.figma.com/design/mnXw2naZBw8QwX0JDuqOhp/Nutriservice?node-id=316-7993 */
/** Industry shortcuts inside Soluciones dropdown. */
const SOLUCIONES_DROPDOWN_LINKS = [
  { href: "/industrias/acuicola", label: "Acuícola" },
  { href: "/industrias/porcina", label: "Cerdos" },
  { href: "/industrias/avicola", label: "Aves" },
  { href: "/industrias/mascotas", label: "Mascotas" },
] as const;

const MAQUILA_NAV_LINK = {
  href: "/soluciones/maquila",
  label: "Maquila",
} as const;

const NAV_LINKS = [{ href: "/nosotros", label: "Nosotros" }] as const;

const linkBase =
  "font-bold text-[10px] uppercase leading-[15px] tracking-[3px] transition-colors";

function cx(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

function SolucionesNavDropdown({
  isLinkActive,
  linkMuted,
  linkActive,
  onWhiteNavText,
}: {
  isLinkActive: (href: string) => boolean;
  linkMuted: string;
  linkActive: string;
  onWhiteNavText: boolean;
}) {
  const [open, setOpen] = useState(false);
  const solucionesActive =
    isLinkActive("/soluciones") ||
    SOLUCIONES_DROPDOWN_LINKS.some((item) => isLinkActive(item.href));

  const panelSurface = onWhiteNavText
    ? "border-white/15 bg-slate-950/92 text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    : "border-[rgba(10,25,47,0.08)] bg-white/96 text-[#0a192f] shadow-[0_20px_50px_rgba(10,25,47,0.12)] backdrop-blur-xl";

  const itemMuted = onWhiteNavText
    ? "text-white/55 hover:bg-white/8 hover:text-white"
    : "text-[rgba(30,58,138,0.62)] hover:bg-[rgba(30,58,138,0.06)] hover:text-[#1e3a8a]";

  const itemActive = onWhiteNavText
    ? "bg-white/10 text-white"
    : "bg-[rgba(30,58,138,0.08)] text-[#1e3a8a]";

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/soluciones"
        aria-expanded={open}
        aria-haspopup="true"
        className={cx(
          linkBase,
          "inline-flex items-center gap-1.5",
          solucionesActive ? linkActive : linkMuted,
        )}
      >
        Soluciones
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className={cx(
            "h-2.5 w-2.5 shrink-0 transition-transform duration-300 ease-out",
            open ? "rotate-180" : "rotate-0",
          )}
        >
          <path
            d="M2.5 4.25 6 7.75l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <div
        className={cx(
          "absolute left-1/2 top-full z-50 w-[13.5rem] -translate-x-1/2 pt-3",
          "transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 pointer-events-none",
        )}
      >
        <div
          className={cx(
            "overflow-hidden rounded-2xl border py-1.5",
            panelSurface,
          )}
          role="menu"
          aria-label="Soluciones"
        >
          {SOLUCIONES_DROPDOWN_LINKS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className={cx(
                "block px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.28em] transition-colors duration-200",
                isLinkActive(item.href) ? itemActive : itemMuted,
              )}
              style={{
                transitionDelay: open ? `${index * 35}ms` : "0ms",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function useHash() {
  const [hash, setHash] = useState("");
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return hash;
}

function useProductDetailDarkNav(pathname: string): boolean {
  const searchParams = useSearchParams();
  if (!pathname.startsWith("/productos/")) return false;

  const slug = pathname.split("/").filter(Boolean).at(-1);
  if (!slug) return false;

  const product = getProductoBySlug(slug);
  if (!product) return false;

  const division = resolveProductoDivision(
    product,
    searchParams.get("division") ?? undefined,
  );
  return getDivisionMedia(division).tone === "on-dark";
}

function useProductosCatalogDarkNav(pathname: string): boolean {
  const searchParams = useSearchParams();
  if (pathname !== "/productos") return false;

  const division = searchParams.get("division")?.toLowerCase().trim();
  if (!division) return false;

  const isKnownDivision = PRODUCTOS_DIVISIONES.some((d) => d.slug === division);
  if (!isKnownDivision) return false;

  return getDivisionMedia(division as ProductoDivisionSlug).tone === "on-dark";
}

function NavInner() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hash = useHash();
  const isMobile = useMobileExperience();
  const onHome = pathname === "/";
  const onAcuicola = pathname === "/industrias/acuicola";
  const onAvicola = pathname === "/industrias/avicola";
  const onPorcina = pathname === "/industrias/porcina";
  const onMascotas = pathname === "/industrias/mascotas";
  const onVideoIndustryNav =
    onAcuicola || onAvicola || onPorcina || onMascotas;
  const onProductDetailDarkNav = useProductDetailDarkNav(pathname);
  const onProductosCatalogDarkNav = useProductosCatalogDarkNav(pathname);
  const onProductDarkNav = onProductDetailDarkNav || onProductosCatalogDarkNav;
  const onContacto =
    pathname === "/contacto" || pathname.startsWith("/contacto/");
  const onNosotros =
    pathname === "/nosotros" || pathname.startsWith("/nosotros/");
  const onDarkNav =
    onHome || onVideoIndustryNav || onProductDarkNav || onNosotros;
  const onLightBlueNav = onContacto;
  const onWhiteNavText = onDarkNav || onLightBlueNav;
  const onTransparentDarkNav = onVideoIndustryNav || onProductDarkNav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkMuted = onWhiteNavText
    ? "text-white/60 hover:text-white"
    : "text-[rgba(30,58,138,0.5)] hover:text-[rgba(30,58,138,0.75)]";
  const linkActive = onWhiteNavText ? "text-white" : "text-[#1e3a8a]";
  const barDivider =
    onWhiteNavText ? "bg-white/28" : "bg-[rgba(30,58,138,0.2)]";
  const ctaClasses = onWhiteNavText
    ? "inline-flex shrink-0 items-center justify-center rounded-full border border-white/55 bg-white/10 px-8 py-3 text-center text-[11px] font-bold uppercase leading-[16.5px] tracking-[1.5px] text-white shadow-none backdrop-blur-sm transition-colors hover:bg-white/18 active:scale-[0.98]"
    : "inline-flex shrink-0 items-center justify-center rounded-full bg-[#0a192f] px-8 py-3 text-center text-[11px] font-bold uppercase leading-[16.5px] tracking-[1.5px] text-white shadow-sm transition-colors hover:bg-[#0d2140] active:scale-[0.98]";
  const logoSrc = onWhiteNavText
    ? PUBLIC_ASSETS.brand.logoWhite
    : PUBLIC_ASSETS.brand.logoBlue;
  const burgerBar = onWhiteNavText ? "bg-white" : "bg-[#111827]";

  useEffect(() => {
    if (!open || isMobile !== true) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobile]);

  const isLinkActive = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && hash === href.slice(1);
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const headerSurface =
    open && isMobile === true
      ? onWhiteNavText
        ? onLightBlueNav
          ? "border-b border-white/15 bg-[#A8C8D6]"
          : "border-b border-white/10 bg-slate-950"
        : "border-b border-[rgba(10,25,47,0.08)] bg-white"
      : onTransparentDarkNav
        ? "border-b border-white/10 bg-transparent"
        : onLightBlueNav
          ? "border-b border-[rgba(10,25,47,0.08)] bg-transparent"
        : scrolled
          ? onHome || onNosotros
            ? "border-b border-white/10 bg-slate-950/72 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-[rgba(10,25,47,0.08)] bg-white/82 backdrop-blur-xl backdrop-saturate-150"
          : onHome || onNosotros
            ? "border-b border-white/10 bg-transparent"
            : "border-b border-[rgba(10,25,47,0.08)] bg-transparent";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${headerSurface}`}>
      <div className="relative z-50 mx-auto flex h-auto min-h-16 max-w-[1280px] items-center justify-between px-6 py-5 sm:px-10 lg:px-12">
        <Link
          href="/"
          className="relative flex h-9 w-[152px] shrink-0 items-center md:h-10 md:w-[168px]"
          onClick={() => setOpen(false)}
        >
          <Image
            src={logoSrc}
            alt="Nutriservice"
            width={168}
            height={40}
            className="h-9 w-auto object-contain object-left md:h-10"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Principal">
          <SolucionesNavDropdown
            isLinkActive={isLinkActive}
            linkMuted={linkMuted}
            linkActive={linkActive}
            onWhiteNavText={onWhiteNavText}
          />
          <Link
            href={MAQUILA_NAV_LINK.href}
            className={`${linkBase} ${isLinkActive(MAQUILA_NAV_LINK.href) ? linkActive : linkMuted}`}
          >
            {MAQUILA_NAV_LINK.label}
          </Link>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${linkBase} ${isLinkActive(l.href) ? linkActive : linkMuted}`}
            >
              {l.label}
            </Link>
          ))}
          <span className={`h-4 w-px shrink-0 ${barDivider}`} aria-hidden />
          <Link
            href="/contacto"
            className={`${ctaClasses} ${isLinkActive("/contacto") ? (onWhiteNavText ? "ring-2 ring-white/35 ring-offset-2 ring-offset-transparent" : "ring-2 ring-[#1e3a8a]/25 ring-offset-2 ring-offset-transparent") : ""}`}
          >
            Contacto
          </Link>
        </nav>

        <button
          type="button"
          className="flex flex-col justify-center gap-1.5 p-2 -mr-2 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <span
            className={`block h-0.5 w-6 ${burgerBar} transition-transform duration-200 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 ${burgerBar} transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 ${burgerBar} transition-transform duration-200 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {isMobile === true ? (
        <div
          className={`fixed inset-0 z-40 flex flex-col overflow-hidden md:hidden transition-[visibility,opacity] duration-300 ease-out ${
            open
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0"
          }           ${
            onWhiteNavText
              ? onLightBlueNav
                ? "bg-[#A8C8D6] text-white"
                : "bg-slate-950 text-white"
              : "bg-white text-[#0a192f]"
          }`}
          aria-hidden={!open}
          inert={open ? undefined : true}
        >
          <div className="flex min-h-0 flex-1 flex-col justify-start overflow-hidden px-6 pb-10 pt-24 sm:px-10">
            <div className="mx-auto flex w-full max-w-md flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Link
                  href="/soluciones"
                  className={cx(
                    linkBase,
                    "text-sm tracking-[0.35em]",
                    isLinkActive("/soluciones") ||
                      SOLUCIONES_DROPDOWN_LINKS.some((item) =>
                        isLinkActive(item.href),
                      )
                      ? linkActive
                      : linkMuted,
                  )}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? undefined : -1}
                >
                  Soluciones
                </Link>
                <div className="flex flex-col gap-2.5 pl-4">
                  {SOLUCIONES_DROPDOWN_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cx(
                        linkBase,
                        "text-xs tracking-[0.32em]",
                        isLinkActive(item.href) ? linkActive : linkMuted,
                      )}
                      onClick={() => setOpen(false)}
                      tabIndex={open ? undefined : -1}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href={MAQUILA_NAV_LINK.href}
                className={cx(
                  linkBase,
                  "text-sm tracking-[0.35em]",
                  isLinkActive(MAQUILA_NAV_LINK.href) ? linkActive : linkMuted,
                )}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
              >
                {MAQUILA_NAV_LINK.label}
              </Link>
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`${linkBase} text-sm tracking-[0.35em] ${
                    isLinkActive(l.href) ? linkActive : linkMuted
                  }`}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? undefined : -1}
                >
                  {l.label}
                </Link>
              ))}
              <span
                className={`h-px w-full ${onWhiteNavText ? "bg-white/18" : "bg-[rgba(30,58,138,0.15)]"}`}
                aria-hidden
              />
              <Link
                href="/contacto"
                className={`${ctaClasses} w-full`}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
              >
                Contacto
              </Link>
              <span
                className={`h-px w-full ${onWhiteNavText ? "bg-white/18" : "bg-[rgba(30,58,138,0.15)]"}`}
                aria-hidden
              />
              <SoundWaveToggle
                audioSrc={PUBLIC_ASSETS.audio.ambient}
                maxLinearGain={AMBIENT_MUSIC_MAX_GAIN}
                autoBootstrap={false}
                showLabel
                label="Sonido"
                tone={onWhiteNavText ? "on-dark" : "on-light"}
                labelClassName={
                  onWhiteNavText
                    ? "text-[10px] font-bold uppercase tracking-[3px] text-white/60"
                    : "text-[10px] font-bold uppercase tracking-[3px] text-[rgba(30,58,138,0.5)]"
                }
                buttonClassName="w-full justify-between py-1"
              />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default function Nav() {
  return (
    <Suspense
      fallback={
        <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(10,25,47,0.08)] bg-transparent">
          <div className="mx-auto flex h-16 max-w-[1280px] items-center px-6 sm:px-10 lg:px-12" />
        </header>
      }
    >
      <NavInner />
    </Suspense>
  );
}
