import TeamShowcase from "@/components/ui/team-showcase";

export default function NosotrosTeamSection() {
  return (
    <section
      className="relative bg-ns-navy px-6 pb-16 pt-4 text-white sm:px-10 sm:pb-20 sm:pt-6 lg:px-12"
      aria-labelledby="nosotros-equipo-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-ns-emerald">
            Equipo
          </p>
          <h2
            id="nosotros-equipo-heading"
            className="mt-3 text-balance text-3xl font-bold text-white sm:text-4xl"
          >
            Personas que impulsan soluciones
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
            Especialistas en nutrición animal, formulación y acompañamiento
            técnico con décadas de experiencia en la industria.
          </p>
        </div>

        <TeamShowcase tone="on-dark" />
      </div>
    </section>
  );
}
