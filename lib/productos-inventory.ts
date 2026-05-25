import type { ProductoDivisionSlug } from "@/lib/productos-divisions";
import { divisionHasVideo } from "@/lib/productos-division-media";

export type Producto = {
  slug: string;
  name: string;
  altName: string;
  summary: string;
  description: string;
  tags: readonly string[];
  /** Functional benefit filters (`PRODUCTOS_CATEGORIAS`). */
  filterSlugs: readonly string[];
  /** Animal / industry divisions where this product is offered. */
  divisionSlugs: readonly ProductoDivisionSlug[];
  /** Optional copy when a division needs a distinct one-liner on cards. */
  divisionSummaries?: Partial<Record<ProductoDivisionSlug, string>>;
  /** Pack shot override — defaults to `/productos/{slug}.webp`. */
  imageSrc?: string;
};

export const PRODUCTOS_INVENTORY: readonly Producto[] = [
  {
    slug: "activemos",
    name: "Activemos",
    altName: "ACTIVEMOS",
    summary: "Prebiótico, modulador de la flora gastrointestinal.",
    description:
      "Prebiótico funcional formulado para modular la flora gastrointestinal y apoyar la integridad del tracto digestivo en operaciones a escala productiva.",
    tags: ["Prebiótico", "Salud intestinal"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["acuicola", "aves", "cerdos", "mascotas"],
    divisionSummaries: {
      mascotas:
        "Extracto de levadura rico en mananoligosacáridos que actúa como prebiótico, modulador de la flora gastrointestinal.",
    },
  },
  {
    slug: "macrogard",
    name: "Macrogard",
    altName: "MACROGARD",
    summary:
      "Inmunomodulador que ayuda a combatir enfermedades en etapas de estrés.",
    description:
      "Inmunomodulador que refuerza la respuesta natural del animal en etapas de estrés, apoyando la resistencia a enfermedades en programas productivos exigentes.",
    tags: ["Inmunidad", "Estrés"],
    filterSlugs: ["inmunidad"],
    divisionSlugs: ["acuicola", "cerdos", "mascotas"],
    divisionSummaries: {
      mascotas:
        "Extracto de levaduras rico en betaglucanos. Inmunomodulador que ayuda a combatir enfermedades en etapas de estrés.",
    },
  },
  {
    slug: "silimarina",
    name: "Silimarina",
    altName: "SILIMARINA 80%",
    summary:
      "Protege la función hepática al eliminar radicales libres y modular enzimas asociadas al daño celular, contribuyendo a mantener la salud del hígado.",
    description:
      "Protector hepático que ayuda a eliminar radicales libres y modular enzimas asociadas al daño celular, contribuyendo a mantener la salud del hígado.",
    tags: ["Antioxidante", "Salud hepática"],
    filterSlugs: ["antioxidante"],
    divisionSlugs: ["acuicola", "mascotas"],
    divisionSummaries: {
      mascotas: "Protector hepático.",
    },
  },
  {
    slug: "nucleoforce-salmonids",
    name: "Nucleoforce Salmonids",
    altName: "NUCLEOFORCE SALMONIDS",
    summary:
      "Potencia el desarrollo inmunitario y digestivo, aumentando resistencia a enfermedades, reduciendo mortalidad y variabilidad, y optimizando la respuesta vacunal.",
    description:
      "Solución nucleótida orientada a salmónidos que potencia el desarrollo inmunitario y digestivo, mejorando resistencia a enfermedades y la respuesta vacunal.",
    tags: ["Inmunidad", "Digestión"],
    filterSlugs: ["inmunidad", "salud-intestinal"],
    divisionSlugs: ["acuicola"],
  },
  {
    slug: "premezcla-suplemento-funcional",
    name: "Premezcla suplemento funcional",
    altName: "PREMEZCLA SUPLEMENTO FUNCIONAL",
    summary:
      "Ofrecen suplementación precisa que mejora el rendimiento, la salud y el bienestar general del animal según el programa nutricional.",
    description:
      "Premezclas de suplementación funcional diseñadas según el programa nutricional del cliente para mejorar rendimiento, salud y bienestar general.",
    tags: ["Premezcla", "Rendimiento"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["acuicola"],
  },
  {
    slug: "premix-especiales",
    name: "Premix especiales",
    altName: "PREMIX ESPECIALES",
    summary: "Según requerimiento del cliente.",
    description:
      "Premixes especiales formulados a medida según los requerimientos técnicos y productivos de cada operación.",
    tags: ["Premix", "A medida"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["acuicola"],
  },
  {
    slug: "halor-tid",
    name: "Halor Tid",
    altName: "HALOR TID",
    summary: "Control de las enterobacterias Gram-.",
    description:
      "Aditivo orientado al control de enterobacterias Gram- en programas de salud intestinal y bioseguridad alimentaria.",
    tags: ["Salud intestinal", "Gram-"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["aves", "cerdos"],
  },
  {
    slug: "meatfree",
    name: "Meatfree",
    altName: "MEATFREE",
    summary:
      "Reducción del costo de las dietas mejorando el metabolismo digestivo y reemplazando el fósforo inorgánico.",
    description:
      "Solución nutricional que mejora el metabolismo digestivo y permite reemplazar fósforo inorgánico, reduciendo costo de dietas.",
    tags: ["Digestión", "Fósforo"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["aves"],
  },
  {
    slug: "microacid-plus",
    name: "Microacid Plus",
    altName: "MICROACID PLUS",
    summary:
      "Efecto antimicrobiano y reductor del efecto tampón de los alimentos.",
    description:
      "Aditivo con efecto antimicrobiano y reductor del efecto tampón de los alimentos, apoyando la estabilidad digestiva.",
    tags: ["Antimicrobiano", "Digestión"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["aves", "cerdos"],
  },
  {
    slug: "microacid-eoils",
    name: "Microacid Eoils",
    altName: "MICROACID EOILS",
    summary:
      "Efecto antimicrobiano potenciado y reductor del efecto tampón de los alimentos.",
    description:
      "Versión potenciada con aceites esenciales que refuerza el efecto antimicrobiano y reduce el efecto tampón de las dietas.",
    tags: ["Antimicrobiano", "Aceites esenciales"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["aves", "cerdos"],
  },
  {
    slug: "m-prove",
    name: "M-Prove",
    altName: "M-PROVE",
    summary:
      "Mejorar el rendimiento productivo de pollos broilers (CA, GD, ECA), y gallinas de postura.",
    description:
      "Programa nutricional funcional orientado a mejorar conversión alimenticia, ganancia diaria y eficiencia alimenticia en broilers y gallinas de postura.",
    tags: ["Rendimiento", "Avicultura"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["aves"],
  },
  {
    slug: "plusbreathe-plus",
    name: "Plusbreathe+",
    altName: "PLUSBREATHE+",
    summary:
      "Control enfermedades respiratorias. Efecto antiséptico, antioxidante, expectorante y mucolítico.",
    description:
      "Apoyo respiratorio con efecto antiséptico, antioxidante, expectorante y mucolítico para el control de enfermedades respiratorias.",
    tags: ["Respiratorio", "Inmunidad"],
    filterSlugs: ["inmunidad"],
    divisionSlugs: ["aves", "cerdos"],
  },
  {
    slug: "s-prove",
    name: "S-Prove",
    altName: "S-PROVE",
    summary: "Reduce el riesgo de contaminación con Salmonella.",
    description:
      "Solución orientada a reducir el riesgo de contaminación con Salmonella en programas avícolas.",
    tags: ["Salmonella", "Bioseguridad"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["aves"],
  },
  {
    slug: "tecmax-pro",
    name: "Tecmax Pro",
    altName: "TECMAX PRO",
    summary:
      "Mejora la digestibilidad de la proteína, con lo cual baja el costo de las dietas.",
    description:
      "Aditivo enzimático que mejora la digestibilidad de la proteína y contribuye a reducir el costo de las dietas.",
    tags: ["Enzimas", "Proteína"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["aves", "cerdos"],
  },
  {
    slug: "turbozyme-ft-exp",
    name: "Turbozyme FT Exp",
    altName: "TURBOZYME FT EXP",
    summary:
      "Mejora la digestibilidad de la proteína y del fósforo de los granos, con lo cual baja el costo de las dietas.",
    description:
      "Complejo enzimático que mejora la digestibilidad de proteína y fósforo de granos, optimizando costos de formulación.",
    tags: ["Enzimas", "Granos"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["aves", "cerdos"],
  },
  {
    slug: "turbozyme-ft-sd-exp",
    name: "Turbozyme FT SD Exp",
    altName: "TURBOZYME FT SD EXP",
    summary:
      "Mejora la digestibilidad de la proteína y del fósforo de los granos, con lo cual baja el costo de las dietas.",
    description:
      "Variante del complejo Turbozyme orientada a mejorar digestibilidad de proteína y fósforo en granos con enfoque en estabilidad y desempeño en campo.",
    tags: ["Enzimas", "Granos"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["aves", "cerdos"],
  },
  {
    slug: "vitanox",
    name: "Vitanox",
    altName: "VITANOX",
    summary:
      "Reduce el estrés oxidativo. Reduce el drip loss en las carcasas y preservación prolongada del color de la carne.",
    description:
      "Antioxidante funcional que reduce el estrés oxidativo, el drip loss en carcasas y ayuda a preservar el color de la carne.",
    tags: ["Antioxidante", "Calidad de carne"],
    filterSlugs: ["antioxidante"],
    divisionSlugs: ["aves", "cerdos"],
  },
  {
    slug: "vitaprotein-50-plus",
    name: "Vitaprotein 50 Plus",
    altName: "VITAPROTEIN 50 PLUS",
    summary:
      "Reemplazo de harina de pescado en la alimentación de lechones.",
    description:
      "Solución proteica funcional para reemplazar harina de pescado en la alimentación de lechones sin comprometer desempeño productivo.",
    tags: ["Proteína", "Lechones"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["aves", "cerdos"],
  },
  {
    slug: "ambitine-cl",
    name: "Ambitine CL",
    altName: "AMBITINE CL",
    summary:
      "Ayuda a mitigar los efectos negativos del estrés en la fase final de la engorda.",
    description:
      "Aditivo funcional que ayuda a mitigar los efectos negativos del estrés en la fase final de engorda porcina.",
    tags: ["Estrés", "Engorda"],
    filterSlugs: ["inmunidad"],
    divisionSlugs: ["cerdos"],
  },
  {
    slug: "aromabiotic",
    name: "Aromabiotic",
    altName: "AROMABIOTIC",
    summary:
      "Controlador de la flora intestinal patógena Gram+ y Gram- sin ser antibiótico.",
    description:
      "Controlador de flora intestinal patógena Gram+ y Gram- basado en principios activos naturales, sin uso de antibióticos.",
    tags: ["Flora intestinal", "Natural"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["cerdos"],
  },
  {
    slug: "citroflake-b",
    name: "Citroflake B.",
    altName: "CITROFLAKE B.",
    summary:
      "Fuente de fibra soluble e insoluble junto con ácido benzoico.",
    description:
      "Fuente combinada de fibra soluble e insoluble con ácido benzoico para apoyar la salud digestiva en cerdos.",
    tags: ["Fibra", "Digestión"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["cerdos"],
  },
  {
    slug: "c-vita",
    name: "C-Vita",
    altName: "C-VITA",
    summary:
      "Específico para el control de flora intestinal Gram+, como Streptococcus y Clostridium.",
    description:
      "Aditivo específico para el control de flora intestinal Gram+, incluyendo Streptococcus y Clostridium.",
    tags: ["Gram+", "Flora intestinal"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["cerdos"],
  },
  {
    slug: "eubisol",
    name: "Eubisol",
    altName: "EUBISOL",
    summary: "Control de la flora intestinal vía el agua de bebida.",
    description:
      "Solución para el control de flora intestinal administrada vía agua de bebida en programas porcinos.",
    tags: ["Agua de bebida", "Flora intestinal"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["cerdos"],
  },
  {
    slug: "feedlock",
    name: "Feedlock",
    altName: "FEEDLOCK",
    summary: "Control de la contaminación viral del alimento.",
    description:
      "Aditivo orientado al control de contaminación viral del alimento en operaciones porcinas.",
    tags: ["Bioseguridad", "Alimento"],
    filterSlugs: ["inmunidad"],
    divisionSlugs: ["cerdos"],
  },
  {
    slug: "milkey",
    name: "Milkey",
    altName: "MILKEY",
    summary:
      "Mejora el consumo de alimento en lactancia, los índices reproductivos, mayor producción de leche.",
    description:
      "Solución funcional que mejora consumo en lactancia, índices reproductivos y producción de leche en cerdas.",
    tags: ["Lactancia", "Reproducción"],
    filterSlugs: ["salud-intestinal"],
    divisionSlugs: ["cerdos"],
  },
  {
    slug: "nucleoforce",
    name: "Nucleoforce",
    altName: "NUCLEOFORCE",
    summary:
      "Mejora el rendimiento productivo, ayudando al desarrollo del sistema inmunitario y digestivo.",
    description:
      "Programa nucleótido que mejora el rendimiento productivo apoyando el desarrollo de los sistemas inmunitario y digestivo.",
    tags: ["Inmunidad", "Rendimiento"],
    filterSlugs: ["inmunidad", "salud-intestinal"],
    divisionSlugs: ["cerdos"],
  },
] as const;

export type ProductosFilterParams = {
  categoria?: string;
  division?: string;
  q?: string;
};

export function productosFilterHref(params: ProductosFilterParams): string {
  const sp = new URLSearchParams();
  if (params.division) sp.set("division", params.division);
  if (params.categoria) sp.set("categoria", params.categoria);
  if (params.q?.trim()) sp.set("q", params.q.trim());
  const query = sp.toString();
  return query ? `/productos?${query}` : "/productos";
}

export function getProductoBySlug(slug: string): Producto | undefined {
  return PRODUCTOS_INVENTORY.find((p) => p.slug === slug);
}

export function getProductoImagePath(producto: Producto): string {
  return producto.imageSrc ?? `/productos/${producto.slug}.webp`;
}

export function productoDetailHref(
  slug: string,
  division?: ProductoDivisionSlug,
): string {
  if (!division) return `/productos/${slug}`;
  return `/productos/${slug}?division=${division}`;
}

export function resolveProductoDivision(
  producto: Producto,
  requested?: string,
): ProductoDivisionSlug {
  if (
    requested &&
    producto.divisionSlugs.includes(requested as ProductoDivisionSlug)
  ) {
    return requested as ProductoDivisionSlug;
  }

  const videoDivision = producto.divisionSlugs.find((slug) =>
    divisionHasVideo(slug),
  );
  return videoDivision ?? producto.divisionSlugs[0] ?? "acuicola";
}

export function getProductoSummary(
  producto: Producto,
  division?: ProductoDivisionSlug,
): string {
  if (division && producto.divisionSummaries?.[division]) {
    return producto.divisionSummaries[division]!;
  }
  return producto.summary;
}

function productMatchesQuery(producto: Producto, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    producto.name,
    producto.altName,
    producto.slug,
    producto.summary,
    ...producto.tags,
  ].map((value) => value.toLowerCase());

  return haystack.some((value) => value.includes(normalized));
}

export function getProductosSearchOptions(): string[] {
  const seen = new Set<string>();
  const options: string[] = [];

  for (const producto of PRODUCTOS_INVENTORY) {
    for (const label of [producto.name, producto.altName]) {
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      options.push(label);
    }
  }

  return options.sort((a, b) => a.localeCompare(b, "es"));
}

export function getProductosFiltered({
  categoria = "",
  division = "",
  q = "",
}: ProductosFilterParams = {}): Producto[] {
  return PRODUCTOS_INVENTORY.filter((producto) => {
    const matchesCategoria =
      !categoria || producto.filterSlugs.includes(categoria);
    const matchesDivision =
      !division ||
      producto.divisionSlugs.includes(division as ProductoDivisionSlug);
    const matchesQuery = productMatchesQuery(producto, q);
    return matchesCategoria && matchesDivision && matchesQuery;
  });
}

/** @deprecated Use `getProductosFiltered`. */
export function getProductosByCategoria(categoriaSlug: string): Producto[] {
  return getProductosFiltered({ categoria: categoriaSlug });
}

export const PRODUCTOS_SEARCH_ITEMS = [
  ...PRODUCTOS_INVENTORY.flatMap((p) => [p.name, p.altName, p.summary]),
] as const;
