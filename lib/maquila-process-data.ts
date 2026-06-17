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

/** Landing page maquila band — auto-slider highlights (images reused from process steps). */
export const MAQUILA_LANDING_HIGHLIGHTS: MaquilaProcessStep[] = [
  {
    id: "trazabilidad",
    number: "01",
    title: "Trazabilidad completa",
    description:
      "Control de materias primas, lotes y procesos, garantizando transparencia y seguimiento desde el origen de los insumos hasta el producto final.",
    detail:
      "Control de materias primas, lotes y procesos, garantizando transparencia y seguimiento desde el origen de los insumos hasta el producto final.",
    image: PUBLIC_ASSETS.maquilaSection.tabProductsBg,
    imageWidth: 1536,
    imageHeight: 1024,
  },
  {
    id: "calidad",
    number: "02",
    title: "Calidad certificada",
    description:
      "Procesos auditados bajo estándares GMP y REP, que respaldan la inocuidad, precisión y cumplimiento normativo requeridos por marcas que buscan excelencia.",
    detail:
      "Procesos auditados bajo estándares GMP y REP, que respaldan la inocuidad, precisión y cumplimiento normativo requeridos por marcas que buscan excelencia.",
    image: PUBLIC_ASSETS.shared.nutribagWorkers,
    imageWidth: 1536,
    imageHeight: 1024,
  },
  {
    id: "tecnologia",
    number: "03",
    title: "Tecnología y especialización",
    description:
      "Equipos modernos, formulación especializada y sistemas avanzados que permiten desarrollar productos eficientes, estables y competitivos para los distintos desafíos de la nutrición animal.",
    detail:
      "Equipos modernos, formulación especializada y sistemas avanzados que permiten desarrollar productos eficientes, estables y competitivos para los distintos desafíos de la nutrición animal.",
    image: PUBLIC_ASSETS.maquilaSection.tabFormulacionHero,
    imageWidth: 1298,
    imageHeight: 1212,
  },
];

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
    image: PUBLIC_ASSETS.shared.nutribagWorkers,
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
