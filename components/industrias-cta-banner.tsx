import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { PUBLIC_ASSETS } from "@/lib/public-assets";
import {
  SITE_FOOTER_CTA_HEADING,
  SITE_FOOTER_CTA_PRIMARY_LABEL,
  SITE_FOOTER_CTA_SUBTEXT,
} from "@/lib/site-cta-copy";

const PAGE_NAVY = "#0a192f";
const PAGE_CYAN = "#06b6d4";

type IndustriasCtaBannerProps = {
  id?: string;
  className?: string;
  heading?: ReactNode;
  subtext?: ReactNode;
  primaryLabel?: string;
  showSecondary?: boolean;
  secondaryLabel?: string;
  children?: ReactNode;
};

export default function IndustriasCtaBanner({
  id,
  className,
  heading = SITE_FOOTER_CTA_HEADING,
  subtext = SITE_FOOTER_CTA_SUBTEXT,
  primaryLabel = SITE_FOOTER_CTA_PRIMARY_LABEL,
  showSecondary = false,
  secondaryLabel = "Descargar Brochures",
  children,
}: IndustriasCtaBannerProps = {}) {
  return (
    <section
      id={id}
      className={cn(
        "bg-[#0a192f] px-6 py-12 sm:px-10 sm:py-16 lg:px-16 xl:px-32",
        id && "scroll-mt-24",
        className,
      )}
    >
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[48px] bg-[#0a192f] px-6 py-16 text-center text-white sm:px-12 sm:py-20 lg:px-24">
        <Image
          src={PUBLIC_ASSETS.ctaBanner.background}
          alt=""
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto flex max-w-[800px] flex-col items-center gap-6">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-[2rem] sm:leading-[1.35]">
            {heading}
          </h2>
          <p className="text-pretty text-base leading-relaxed text-white/60 sm:text-lg">
            {subtext}
          </p>
          {children}
          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-full px-10 py-4 text-xs font-black uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
              style={{ backgroundColor: PAGE_CYAN, color: PAGE_NAVY }}
            >
              {primaryLabel}
            </Link>
            {showSecondary ? (
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-10 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
