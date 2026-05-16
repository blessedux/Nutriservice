import type { Metadata } from "next";

import HeroC from "@/components/HeroC";

export const metadata: Metadata = {
  title: "Hero C — demo",
  description:
    "Variante de hero Nutriservice (autoridad científica + tarjetas animadas).",
};

export default function HeroCDemoPage() {
  return <HeroC />;
}
