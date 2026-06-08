import Link from "next/link";

import {
  SITE_FOOTER_CTA_HEADING,
  SITE_FOOTER_CTA_PRIMARY_LABEL,
  SITE_FOOTER_CTA_SUBTEXT,
} from "@/lib/site-cta-copy";

interface CTABannerProps {
  heading?: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  showSecondary?: boolean;
}

export default function CTABanner({
  heading = SITE_FOOTER_CTA_HEADING,
  subtext = SITE_FOOTER_CTA_SUBTEXT,
  primaryLabel = SITE_FOOTER_CTA_PRIMARY_LABEL,
  primaryHref = "/contacto",
  secondaryLabel = "Hablar con un especialista",
  secondaryHref = "/contacto",
  showSecondary = false,
}: CTABannerProps) {
  return (
    <section id="contacto" className="scroll-mt-24 bg-ns-green px-6 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{heading}</h2>
        <p className="text-lg text-white/75 mb-10 leading-relaxed">{subtext}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryHref}
            className="inline-flex justify-center items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-ns-green hover:bg-ns-surface transition-colors"
          >
            {primaryLabel}
          </Link>
          {showSecondary ? (
            <Link
              href={secondaryHref}
              className="inline-flex justify-center items-center rounded-lg border-2 border-white/60 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
