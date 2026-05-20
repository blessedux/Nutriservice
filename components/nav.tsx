"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SoundFxToggle } from "@/components/sound-fx-toggle";
import { SoundWaveToggle } from "@/components/sound-wave-toggle";
import { useMobileExperience } from "@/hooks/use-mobile-experience";
import { AMBIENT_MUSIC_MAX_GAIN } from "@/lib/audio-gain";

/** Matches Figma Nav — https://www.figma.com/design/mnXw2naZBw8QwX0JDuqOhp/Nutriservice?node-id=316-7993 */
const NAV_LINKS = [
  { href: "/soluciones", label: "Soluciones" },
  { href: "/tecnologia", label: "I+D" },
  { href: "/impact", label: "Impact" },
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

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hash = useHash();
  const isMobile = useMobileExperience();
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkMuted = onHome
    ? "text-white/60 hover:text-white"
    : "text-[rgba(30,58,138,0.5)] hover:text-[rgba(30,58,138,0.75)]";
  const linkActive = onHome ? "text-white" : "text-[#1e3a8a]";
  const barDivider =
    onHome ? "bg-white/28" : "bg-[rgba(30,58,138,0.2)]";
  const ctaClasses = onHome
    ? "inline-flex shrink-0 items-center justify-center rounded-full border border-white/55 bg-white/10 px-8 py-3 text-center text-[11px] font-bold uppercase leading-[16.5px] tracking-[1.5px] text-white shadow-none backdrop-blur-sm transition-colors hover:bg-white/18 active:scale-[0.98]"
    : "inline-flex shrink-0 items-center justify-center rounded-full bg-[#0a192f] px-8 py-3 text-center text-[11px] font-bold uppercase leading-[16.5px] tracking-[1.5px] text-white shadow-sm transition-colors hover:bg-[#0d2140] active:scale-[0.98]";
  const logoSrc = onHome ? "/nutriservice_logo_white.png" : "/nutriservice_logo_blue.png";
  const burgerBar = onHome ? "bg-white" : "bg-[#111827]";

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
      ? onHome
        ? "border-b border-white/10 bg-slate-950"
        : "border-b border-[rgba(10,25,47,0.08)] bg-white"
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
            className={`${ctaClasses} ${isLinkActive("/contacto") ? (onHome ? "ring-2 ring-white/35 ring-offset-2 ring-offset-transparent" : "ring-2 ring-[#1e3a8a]/25 ring-offset-2 ring-offset-transparent") : ""}`}
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
          } ${
            onHome
              ? "bg-slate-950 text-white"
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
                className={`h-px w-full ${onHome ? "bg-white/18" : "bg-[rgba(30,58,138,0.15)]"}`}
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
                className={`h-px w-full ${onHome ? "bg-white/18" : "bg-[rgba(30,58,138,0.15)]"}`}
                aria-hidden
              />
              <SoundWaveToggle
                audioSrc="/First_Blossom.mp3"
                maxLinearGain={AMBIENT_MUSIC_MAX_GAIN}
                autoBootstrap={false}
                showLabel
                label="Sonido"
                tone={onHome ? "on-dark" : "on-light"}
                labelClassName={
                  onHome
                    ? "text-[10px] font-bold uppercase tracking-[3px] text-white/60"
                    : "text-[10px] font-bold uppercase tracking-[3px] text-[rgba(30,58,138,0.5)]"
                }
                buttonClassName="w-full justify-between py-1"
              />
              <SoundFxToggle
                autoEnable={false}
                tone={onHome ? "on-dark" : "on-light"}
                labelClassName={
                  onHome
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
