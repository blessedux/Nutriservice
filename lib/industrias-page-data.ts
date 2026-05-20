export type IndustriaVertical = {
  slug: string;
  vertical: string;
  displayName: string;
  image: string;
  challengeLines: string[];
  solutionLines: string[];
  featuredProducts: string;
};

export const INDUSTRIAS_VERTICALS: IndustriaVertical[] = [
  {
    slug: "acuicola",
    vertical: "VERTICAL 01",
    displayName: "Salmones",
    image: "/industries/acuicola.webp",
    challengeLines: ["Mortalidad por Estrés", "Térmico y Sanitario"],
    solutionLines: [
      "Protocolos inmunomoduladores",
      "con Nucleforce & Macrogard.",
    ],
    featuredProducts: "Activemos, Silimarina 80%",
  },
  {
    slug: "avicola",
    vertical: "VERTICAL 02",
    displayName: "Aves",
    image: "/industries/avicola.webp",
    challengeLines: ["Optimización del FCR y", "Salud Intestinal"],
    solutionLines: [
      "Ecosistema de acidificantes",
      "Microacid Plus para control",
      "patógeno.",
    ],
    featuredProducts: "Halor TID, M-Prove, S-Prove",
  },
  {
    slug: "porcina",
    vertical: "VERTICAL 03",
    displayName: "Cerdos",
    image: "/industries/porcina.webp",
    challengeLines: ["Rendimiento en Etapas de", "Destete"],
    solutionLines: [
      "Dietas de precisión para",
      "maximizar absorción de",
      "nutrientes temprana.",
    ],
    featuredProducts: "Macrogard, M-Prove, Nucleoforce",
  },
  {
    slug: "mascotas",
    vertical: "VERTICAL 04",
    displayName: "Mascotas",
    image: "/industries/mascotas.webp",
    challengeLines: ["Palatabilidad y Estabilidad", "Oxidativa"],
    solutionLines: [
      "Potenciadores de sabor PalaUp",
      "y antioxidantes de grado",
      "superior.",
    ],
    featuredProducts: "PalaUp CH, TecMax Pro",
  },
];

export const INDUSTRIAS_LABS = [
  {
    title: "Wet Lab (Acuicultura)",
    detail: "Bio-ensayos in vivo y control de patógenos.",
    icon: "flask" as const,
    accent: "cyan" as const,
  },
  {
    title: "Metabolic Lab (Aves/Cerdos)",
    detail: "Cinética de absorción y mapeo de metabolitos.",
    icon: "shield" as const,
    accent: "navy" as const,
  },
];

export const INDUSTRIAS_PILLARS = [
  {
    number: "01",
    title: "Trazabilidad Total",
    detail: [
      "Cada lote cuenta con huella molecular",
      "registrada para garantizar consistencia.",
    ],
    variant: "glass" as const,
  },
  {
    number: "02",
    title: "Validación ISO-6",
    detail: [
      "Producción en ambientes controlados",
      "para máxima pureza técnica.",
    ],
    variant: "highlight" as const,
  },
  {
    number: "03",
    title: "Network Global de Expertos",
    detail: [
      "Conectamos su operación con los centros de nutrición animal",
      "más avanzados de Europa y América.",
    ],
    variant: "wide" as const,
  },
];
