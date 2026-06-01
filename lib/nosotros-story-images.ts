import { PUBLIC_ASSETS } from "@/lib/public-assets";

export type StoryGalleryImage = {
  src: string;
  alt: string;
};

/** Images for the Nosotros story gallery — all from `public/assets/`. */
export const NOSOTROS_STORY_IMAGES: StoryGalleryImage[] = [
  {
    src: PUBLIC_ASSETS.shared.workersHero,
    alt: "Equipo Nutriservice en planta de producción",
  },
  {
    src: PUBLIC_ASSETS.industriasPage.heroLab,
    alt: "Laboratorio de formulación nutricional",
  },
  {
    src: PUBLIC_ASSETS.industriesSection.cardAcuicola,
    alt: "Nutrición acuícola de precisión",
  },
  {
    src: PUBLIC_ASSETS.industriesSection.cardAvicola,
    alt: "Soluciones para avicultura",
  },
  {
    src: PUBLIC_ASSETS.industriesSection.cardPorcina,
    alt: "Nutrición porcina especializada",
  },
  {
    src: PUBLIC_ASSETS.industriesSection.cardMascotas,
    alt: "Alimentación para mascotas",
  },
  {
    src: PUBLIC_ASSETS.maquilaSection.tabFormulacionHero,
    alt: "Formulación y maquila a medida",
  },
  {
    src: PUBLIC_ASSETS.maquilaSection.tabProductsBg,
    alt: "Portafolio de productos nutricionales",
  },
  {
    src: PUBLIC_ASSETS.industriesSection.backgroundImage,
    alt: "Industrias que acompañamos",
  },
  {
    src: PUBLIC_ASSETS.impactSection.macrocard,
    alt: "Impacto en producción animal",
  },
  {
    src: PUBLIC_ASSETS.problemSection.backgroundTeal,
    alt: "Ciencia aplicada en campo",
  },
  {
    src: PUBLIC_ASSETS.industryPages.fallbackPorcina,
    alt: "Producción porcina de alto desempeño",
  },
  {
    src: PUBLIC_ASSETS.industriasPage.molecularBg,
    alt: "Investigación y desarrollo nutricional",
  },
  {
    src: `${PUBLIC_ASSETS.impactSection.pelletFramesDir}/frame_0060.webp`,
    alt: "Proceso de elaboración de pellet",
  },
  {
    src: `${PUBLIC_ASSETS.impactSection.pelletFramesDir}/frame_0090.webp`,
    alt: "Calidad en cada etapa de producción",
  },
  {
    src: PUBLIC_ASSETS.ctaBanner.background,
    alt: "Compromiso con la industria",
  },
];
