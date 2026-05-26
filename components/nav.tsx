"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { SoundFxToggle } from "@/components/sound-fx-toggle";
import { SoundWaveToggle } from "@/components/sound-wave-toggle";
import { useMobileExperience } from "@/hooks/use-mobile-experience";
import { AMBIENT_MUSIC_MAX_GAIN } from "@/lib/audio-gain";
import { getDivisionMedia } from "@/lib/productos-division-media";
import {
  getProductoBySlug,
  resolveProductoDivision,
} from "@/lib/productos-inventory";
import { PRODUCTOS_DIVISIONES } from "@/lib/productos-divisions";
import type { ProductoDivisionSlug } from "@/lib/productos-divisions";

/** Matches Figma Nav — https://www.figma.com/design/mnXw2naZBw8QwX0JDuqOhp/Nutriservice?node-id=316-7993 */
const NAV_LINKS = [
  { href: "/soluciones", label: "Soluciones" },
  { href: "/tecnologia", label: "I+D" },
  { href: "/impacto", label: "Impacto" },
] as const;

const linkBase =
  "font-bold text-[10px] uppercase leading-[15px] tracking-[3px] transition-colors";

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
  const onMascotas = pathname === "/industrias/mascotas";
  const onVideoIndustryNav = onAcuicola || onAvicola || onMascotas;
  const onProductDetailDarkNav = useProductDetailDarkNav(pathname);
  const onProductosCatalogDarkNav = useProductosCatalogDarkNav(pathname);
  const onProductDarkNav = onProductDetailDarkNav || onProductosCatalogDarkNav;
  const onContacto =
    pathname === "/contacto" || pathname.startsWith("/contacto/");
  const onDarkNav = onHome || onVideoIndustryNav || onProductDarkNav;
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
  const logoSrc = onWhiteNavText ? "/nutriservice_logo_white.png" : "/nutriservice_logo_blue.png";
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
          ? onHome
            ? "border-b border-white/10 bg-slate-950/72 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-[rgba(10,25,47,0.08)] bg-white/82 backdrop-blur-xl backdrop-saturate-150"
          : onHome
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
          className={`fixed inset-0 z-40 flex flex-col md:hidden transition-[visibility,opacity] duration-300 ease-out ${
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
          <div className="flex min-h-0 flex-1 flex-col justify-center px-6 pb-12 pt-28 sm:px-10">
            <div className="mx-auto flex w-full max-w-md flex-col gap-8">
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
                audioSrc="/First_Blossom.mp3"
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
              <SoundFxToggle
                autoEnable={false}
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
