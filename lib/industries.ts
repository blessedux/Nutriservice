export type Industry = {
  slug: string;
  name: string;
  tagline: string;
  problem: string;
  problemCards: { title: string; detail: string }[];
  approach: string;
  steps: { title: string; detail: string }[];
  results: { metric: string; context: string }[];
  ctaText: string;
};

export const industries: Record<string, Industry> = {
  acuicola: {
    slug: "acuicola",
    name: "Acuícola",
    tagline:
      "Más kilos por ciclo, menor mortalidad, estabilidad en cada cosecha.",
    problem:
      "La acuicultura opera con márgenes ajustados donde la conversión alimenticia y la mortalidad determinan rentabilidad. Un error de formulación no se corrige en días: se paga en meses.",
    problemCards: [
      {
        title: "FCR elevado",
        detail:
          "Cada punto por encima del óptimo es costo directo por kilo producido, lote tras lote.",
      },
      {
        title: "Variabilidad en materias primas",
        detail:
          "Harinas y aceites de pescado con calidad variable generan inconsistencia si no se reformula con cada lote.",
      },
      {
        title: "Enfermedades de origen nutricional",
        detail:
          "Una dieta deficiente reduce inmunidad y eleva mortalidad, especialmente en alevinaje y transición.",
      },
      {
        title: "Exigencias de exportación",
        detail:
          "Mercados premium exigen trazabilidad, certificaciones y calidad constante. La variabilidad no es aceptable.",
      },
    ],
    approach:
      "Formulamos con precisión para cada especie, etapa y condición de cultivo. Analizamos cada lote de materias primas para eliminar la variabilidad antes de que llegue al estanque.",
    steps: [
      {
        title: "Diagnóstico de situación base",
        detail:
          "Análisis de FCR actual, tasa de mortalidad, calidad de materias primas en uso y performance histórico por ciclo.",
      },
      {
        title: "Formulación específica por especie y etapa",
        detail:
          "Fórmulas ajustadas a salmón, trucha, tilapia u otras especies, por fase productiva: alevinaje, engorda y terminación.",
      },
      {
        title: "Implementación con soporte técnico",
        detail:
          "Acompañamos el cambio con monitoreo en terreno. No entregamos un producto y nos vamos.",
      },
      {
        title: "Optimización ciclo a ciclo",
        detail:
          "Revisamos resultados con datos reales y ajustamos para el siguiente ciclo.",
      },
    ],
    results: [
      {
        metric: "Mejora en FCR",
        context: "Reducción de costo de alimentación por kilo producido.",
      },
      {
        metric: "Menor mortalidad",
        context:
          "Especialmente en etapas críticas como alevinaje y transición.",
      },
      {
        metric: "Estabilidad en cosecha",
        context: "Menor variabilidad en peso y calidad entre lotes.",
      },
      {
        metric: "Trazabilidad completa",
        context:
          "Documentación de cada lote para cumplimiento de requisitos de exportación.",
      },
    ],
    ctaText: "Evalúa tu FCR actual con nuestros especialistas",
  },

  avicola: {
    slug: "avicola",
    name: "Avícola",
    tagline:
      "Conversión eficiente, sanidad estable, costos predecibles por ave.",
    problem:
      "El alimento representa el 65–70% del costo de producción avícola. Cada punto de mejora en conversión impacta directamente la rentabilidad. La variabilidad de insumos hace ese punto difícil de sostener.",
    problemCards: [
      {
        title: "Variabilidad de materias primas",
        detail:
          "Maíz y soya con humedad y proteína variable afectan conversión sin que el productor lo vea venir.",
      },
      {
        title: "Enfermedades de origen nutricional",
        detail:
          "Una formulación deficiente reduce inmunidad y sube el gasto veterinario.",
      },
      {
        title: "Presión por reducción de antibióticos",
        detail:
          "Los mercados exigen producción más limpia. La nutrición es la primera línea de defensa.",
      },
      {
        title: "Exigencias de certificación",
        detail:
          "Exportar requiere documentación y consistencia que no se improvisa en la última semana.",
      },
    ],
    approach:
      "Optimizamos la formulación para cada etapa productiva con análisis de materias primas que elimina la incertidumbre del cambio de proveedor.",
    steps: [
      {
        title: "Diagnóstico productivo",
        detail:
          "Análisis de conversión actual, consumo, mortalidad y uniformidad del lote.",
      },
      {
        title: "Formulación precisa por fase",
        detail:
          "Fórmulas específicas para broilers, ponedoras o reproductoras según objetivo productivo.",
      },
      {
        title: "Soporte en implementación",
        detail:
          "Asistencia técnica en la transición y monitoreo de las primeras semanas.",
      },
      {
        title: "Ajuste ante cambios",
        detail:
          "Seguimiento y reformulación cuando cambian proveedores o calidad de insumos.",
      },
    ],
    results: [
      {
        metric: "Mejora en conversión alimenticia",
        context: "Reducción directa en costo de alimentación por ave.",
      },
      {
        metric: "Mayor uniformidad de lote",
        context: "Menos variabilidad en peso a faena.",
      },
      {
        metric: "Reducción de mortalidad",
        context: "Especialmente en primeras semanas de vida.",
      },
      {
        metric: "Menor gasto veterinario",
        context: "Mejor estado inmunológico base reduce intervenciones.",
      },
    ],
    ctaText: "Analiza tu conversión alimenticia con nosotros",
  },

  porcina: {
    slug: "porcina",
    name: "Porcina",
    tagline:
      "Ganancia de peso optimizada, menor variabilidad lote a lote.",
    problem:
      "La producción porcina enfrenta etapas de alta demanda nutricional donde un error de formulación tiene consecuencias productivas directas. La variabilidad de materias primas lo amplifica.",
    problemCards: [
      {
        title: "Variabilidad de cereales y soya",
        detail:
          "Insumos con calidad inconstante generan resultados inconsistentes aunque la fórmula no cambie.",
      },
      {
        title: "Etapas críticas con alta sensibilidad",
        detail:
          "Lechones, gestación y lactancia toleran poco margen de error nutricional.",
      },
      {
        title: "Presión por reducción de costos",
        detail:
          "Bajar costos de formulación sin perder ganancia diaria de peso requiere precisión técnica.",
      },
      {
        title: "Bienestar animal y exportación",
        detail:
          "Mercados europeos y asiáticos exigen estándares de bienestar que la nutrición afecta directamente.",
      },
    ],
    approach:
      "Diseñamos fórmulas específicas para cada etapa del ciclo productivo con análisis por lote de materias primas, asegurando consistencia independientemente del origen del insumo.",
    steps: [
      {
        title: "Diagnóstico del sistema productivo",
        detail:
          "Análisis de resultados actuales por etapa, identificación de puntos de pérdida y revisión de fórmulas en uso.",
      },
      {
        title: "Formulación por etapa productiva",
        detail:
          "Desde destete hasta terminación, fórmulas ajustadas a genética y objetivos de producción.",
      },
      {
        title: "Implementación y seguimiento",
        detail:
          "Soporte técnico durante la transición y monitoreo de parámetros clave.",
      },
      {
        title: "Optimización continua",
        detail:
          "Ajuste de fórmulas ante cambios de materias primas y revisión de resultados productivos.",
      },
    ],
    results: [
      {
        metric: "Mayor ganancia diaria de peso",
        context: "Especialmente visible en etapas de crecimiento y terminación.",
      },
      {
        metric: "Menor variabilidad lote a lote",
        context: "Resultados más predecibles y planificables.",
      },
      {
        metric: "Reducción de mortalidad en lechones",
        context: "Mejora en el manejo de la etapa crítica post-destete.",
      },
      {
        metric: "Mejor eficiencia alimenticia",
        context: "Más kilos producidos con el mismo consumo.",
      },
    ],
    ctaText: "Revisa tu eficiencia productiva por etapa",
  },

  mascotas: {
    slug: "mascotas",
    name: "Mascotas",
    tagline:
      "Formulaciones técnicas para fabricantes que compiten por diferenciación.",
    problem:
      "Los fabricantes de alimento para mascotas enfrentan regulaciones crecientes, consumidores más informados y necesidad de diferenciación técnica en un mercado competitivo.",
    problemCards: [
      {
        title: "Cumplimiento regulatorio",
        detail:
          "Estándares AAFCO, FEDIAF o normativa local requieren formulaciones documentadas y verificables.",
      },
      {
        title: "Diferenciación técnica",
        detail:
          "Los claims de salud deben respaldarse con formulación real, no solo marketing.",
      },
      {
        title: "Variabilidad de materias primas",
        detail:
          "Ingredientes funcionales con calidad variable afectan consistencia del producto final.",
      },
      {
        title: "Trazabilidad para auditorías",
        detail:
          "Distribuidores y retailers exigen documentación que muchos fabricantes no tienen lista.",
      },
    ],
    approach:
      "Desarrollamos formulaciones técnicas para alimentos secos, húmedos y snacks, con soporte en análisis de ingredientes y documentación para cumplimiento regulatorio.",
    steps: [
      {
        title: "Análisis de requerimientos",
        detail:
          "Revisamos objetivo del producto, target de especie y vida, y requerimientos del mercado destino.",
      },
      {
        title: "Formulación técnica",
        detail:
          "Desarrollo de fórmulas que cumplen estándares nutricionales con los ingredientes disponibles.",
      },
      {
        title: "Validación analítica",
        detail:
          "Análisis de materias primas y producto final para verificar cumplimiento nutricional.",
      },
      {
        title: "Soporte continuo",
        detail:
          "Ajuste ante cambios de materias primas y soporte para procesos de certificación.",
      },
    ],
    results: [
      {
        metric: "Cumplimiento regulatorio",
        context:
          "Formulaciones documentadas para mercados nacionales e internacionales.",
      },
      {
        metric: "Diferenciación técnica",
        context: "Claims respaldados por análisis y formulación precisa.",
      },
      {
        metric: "Consistencia de producto",
        context: "Control de variabilidad de materias primas en el producto final.",
      },
      {
        metric: "Trazabilidad completa",
        context: "Documentación lista para auditorías y certificaciones.",
      },
    ],
    ctaText: "Habla con nuestros formuladores especializados",
  },
};

export const industryList = Object.values(industries);

export function getIndustry(slug: string): Industry | undefined {
  return industries[slug];
}
