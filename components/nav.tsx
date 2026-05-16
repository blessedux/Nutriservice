"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Matches Figma Nav — https://www.figma.com/design/mnXw2naZBw8QwX0JDuqOhp/Nutriservice?node-id=316-7993 */
const NAV_LINKS = [
  { href: "/soluciones", label: "Soluciones" },
  { href: "/tecnologia", label: "I+D" },
  { href: "/#impact", label: "Impact" },
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
  const hash = useHash();
  const onHome = pathname === "/";

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

  const isLinkActive = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && hash === href.slice(1);
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-transparent ${
        onHome ? "border-b border-white/10" : "border-b border-[rgba(10,25,47,0.08)]"
      }`}
    >
      <div className="mx-auto flex h-auto min-h-16 max-w-[1280px] items-center justify-between px-6 py-5 sm:px-10 lg:px-12">
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

      {open ? (
        <div
          className={`border-t px-6 py-5 md:hidden ${
            onHome
              ? "border-white/12 bg-slate-950/88 backdrop-blur-md"
              : "border-[rgba(10,25,47,0.08)] bg-transparent"
          }`}
        >
          <div className="flex flex-col gap-5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${linkBase} ${isLinkActive(l.href) ? linkActive : linkMuted}`}
                onClick={() => setOpen(false)}
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
            >
              Contacto
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
