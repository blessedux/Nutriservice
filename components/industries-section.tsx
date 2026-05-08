import Image from "next/image";
import Link from "next/link";
import { industryList } from "@/lib/industries";

type CardMeta = {
  image: string;
  /** Product line badges (Figma mono pills) */
  products: string[];
  /** Optional hero title override (e.g. “Aves” for avícola) */
  title?: string;
};

const CARD_META: Record<string, CardMeta> = {
  acuicola: {
    image: "/industries/acuicola.png",
    products: ["ACTIVEMOS", "MACROGARD", "SILIMARINA 80%", "NUCLEOFORCE"],
  },
  avicola: {
    image: "/industries/avicola.png",
    title: "Aves",
    products: ["HALOR TID", "MICROACID PLUS", "M-PROVE", "S-PROVE"],
  },
  porcina: {
    image: "/industries/porcina.jpg",
    products: ["MACROGARD", "HALOR TID", "M-PROVE", "NUCLEOFORCE"],
  },
  mascotas: {
    image: "/industries/mascotas.png",
    products: ["PALAUP CH", "MACROGARD", "TECMAX PRO"],
  },
};

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M1 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IndustriesSection() {
  return (
    <section
      id="industrias"
      className="scroll-mt-24 bg-white px-6 py-24 md:px-12"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-16">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 shrink-0 bg-blue-900" aria-hidden />
          <p className="text-[10px] font-bold uppercase leading-[15px] tracking-[0.35em] text-blue-900/50">
            Verticales de industria
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {industryList.filter((ind) => CARD_META[ind.slug]).map((ind) => {
            const meta = CARD_META[ind.slug]!;
            const title = meta.title ?? ind.name;

            return (
              <Link
                key={ind.slug}
                href={`/industrias/${ind.slug}`}
                className="group relative flex min-h-[520px] overflow-hidden rounded-[40px] md:min-h-[560px] xl:h-[600px] xl:min-h-0"
                aria-label={`${title}: ver industria y protocolos`}
              >
                <div className="pointer-events-none absolute inset-0">
                  <Image
                    src={meta.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    priority={ind.slug === "acuicola"}
                  />
                </div>

                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,25,47,0.9)] via-[rgba(10,25,47,0.4)] via-50% to-transparent"
                  aria-hidden
                />

                <div className="relative z-10 mt-auto flex w-full flex-col justify-end p-8">
                  <div className="flex flex-col gap-4 rounded-[32px] border border-white/20 bg-white/10 p-8 backdrop-blur-[6px]">
                    <p className="text-[10px] font-bold uppercase leading-[15px] text-cyan-500">
                      Sector estratégico
                    </p>

                    <h3 className="text-[30px] font-light leading-9 text-white">
                      {title}
                    </h3>

                    <div className="flex flex-wrap gap-x-2 gap-y-2">
                      {meta.products.map((label) => (
                        <span
                          key={label}
                          className="rounded bg-white/10 px-3 py-1 font-mono text-[10px] leading-[15px] tracking-wide text-white/80"
                        >
                          {label}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-500">
                        Ver protocolos
                      </span>
                      <ChevronRightIcon className="text-cyan-500" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
