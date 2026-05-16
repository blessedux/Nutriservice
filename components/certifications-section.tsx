import Image from "next/image";

import { HomeBlueBand } from "@/components/home-blue-band";

const CERTIFICATIONS = [
  {
    src: "/certs/logo-actualizado-sgs-768x768.png",
    alt: "Certificación SGS",
  },
  {
    src: "/certs/Certificacion-REP--768x768.png",
    alt: "Certificación REP",
  },
] as const;

export default function CertificationsSection() {
  return (
    <HomeBlueBand
      id="certificaciones"
      height="half"
      aria-label="Certificaciones"
      className="justify-center px-6 py-10 sm:px-10 lg:px-12"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 sm:gap-10">
        <header className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/45">
            Calidad verificada
          </p>
          <h2 className="mt-3 text-balance text-xl font-light tracking-tight text-white sm:text-2xl">
            Certificaciones que respaldan cada lote
          </h2>
        </header>

        <ul className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 lg:gap-20">
          {CERTIFICATIONS.map((cert) => (
            <li key={cert.src}>
              <Image
                src={cert.src}
                alt={cert.alt}
                width={120}
                height={120}
                className="h-20 w-20 object-contain opacity-90 brightness-110 sm:h-24 sm:w-24"
              />
            </li>
          ))}
        </ul>
      </div>
    </HomeBlueBand>
  );
}
