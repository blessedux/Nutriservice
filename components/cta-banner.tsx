import Link from "next/link";

interface CTABannerProps {
  heading?: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTABanner({
  heading = "¿Tu operación está rindiendo a su potencial?",
  subtext =
    "Agenda una evaluación técnica con nuestros especialistas y descubre dónde está el margen de mejora.",
  primaryLabel = "Agendar evaluación técnica",
  primaryHref = "/contacto",
  secondaryLabel = "Hablar con un especialista",
  secondaryHref = "/contacto",
}: CTABannerProps) {
  return (
    <section className="bg-ns-green py-20 px-6">
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
          <Link
            href={secondaryHref}
            className="inline-flex justify-center items-center rounded-lg border-2 border-white/60 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
