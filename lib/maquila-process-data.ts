import { PUBLIC_ASSETS } from "@/lib/public-assets";

export type MaquilaProcessStep = {
  id: string;
  number: string;
  title: string;
  description: string;
  detail: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
};

export const MAQUILA_PROCESS_STEPS: MaquilaProcessStep[] = [
  {
    id: "formulacion",
    number: "01",
    title: "Formulación Técnica",
    description:
      "Diseño de premixes y núcleos según especie, etapa productiva y objetivos nutricionales.",
    detail:
      "Partimos de sus requerimientos operativos para diseñar premixes y núcleos específicos. Cada fórmula se desarrolla con confidencialidad total y validación analítica antes de pasar a producción.",
    image: PUBLIC_ASSETS.maquilaSection.tabFormulacionHero,
    imageWidth: 1298,
    imageHeight: 1212,
  },
  {
    id: "produccion",
    number: "02",
    title: "Producción Industrial",
    description:
      "Procesos estandarizados de mezclado, control de calidad y trazabilidad operacional.",
    detail:
      "Ejecutamos mezclas con procesos estandarizados, control de calidad en planta y trazabilidad completa de materias primas y lotes. Garantizamos consistencia en cada entrega.",
    image: PUBLIC_ASSETS.shared.workersHero,
    imageWidth: 1536,
    imageHeight: 1024,
  },
  {
    id: "optimizacion",
    number: "03",
    title: "Optimización Productiva",
    description:
      "Soluciones enfocadas en digestibilidad, conversión alimenticia y estabilidad sanitaria.",
    detail:
      "Acompañamos la puesta en marcha y el seguimiento productivo para ajustar formulaciones según resultados de campo, mejorando conversión, digestibilidad y estabilidad sanitaria.",
    image: PUBLIC_ASSETS.maquilaSection.tabProductsBg,
    imageWidth: 1536,
    imageHeight: 1024,
  },
];
