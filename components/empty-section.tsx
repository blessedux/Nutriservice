import { HomeBlueBand } from "@/components/home-blue-band";

/** Reserved band below maquila — content TBD. */
export default function EmptySection() {
  return (
    <HomeBlueBand
      id="reserva"
      height="half"
      aria-label="Sección reservada"
      className="relative z-0 min-h-[50dvh] bg-[#030A1C]"
    />
  );
}
