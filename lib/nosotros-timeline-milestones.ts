export type TimelineMilestone = {
  year: number;
  title: string;
  summary: string;
};

export const NOSOTROS_TIMELINE_ENTRIES: TimelineMilestone[] = [
  {
    year: 1993,
    title: "Fundación Empresa",
    summary:
      "Nutriservice inicia sus operaciones con el objetivo de ofrecer soluciones nutricionales confiables y de alta calidad para la industria pecuaria.",
  },
  {
    year: 2000,
    title: "Apertura sucursal Puerto Varas",
    summary:
      "La empresa expande su presencia al sur de Chile, fortaleciendo la cobertura comercial y logística para sus clientes.",
  },
  {
    year: 2006,
    title: "Construcción de planta propia. Autorizada y certificada por SAG",
    summary:
      "Se inaugura la planta de producción, equipada con tecnología moderna y autorizada por SAG, garantizando procesos seguros y trazables.",
  },
  {
    year: 2007,
    title: "Obtención de certificación GMP",
    summary:
      "Nutriservice obtiene la certificación GMP, asegurando estándares internacionales en buenas prácticas de manufactura. Planta de elaboración y envasado de premezclas para aves, cerdos y salmones.",
  },
  {
    year: 2009,
    title:
      "Ingreso de Nutriservice a REP, convirtiéndose en la 5ª empresa en obtenerla",
    summary:
      "Nutriservice se convierte en la 5.ª empresa en obtener el Registro de Empresas Pecuarias (REP), validando su compromiso con la calidad.",
  },
  {
    year: 2010,
    title: "Creación de línea food autorizada por SEREMI",
    summary:
      "Se incorpora una nueva línea de productos food, autorizada por SEREMI, ampliando la oferta hacia alimentos de alto estándar.",
  },
  {
    year: 2010,
    title: "Implementación de servicio de maquila con alto estándar de calidad",
    summary: "",
  },
];

/** @deprecated Use `NOSOTROS_TIMELINE_ENTRIES`. */
export function getTimelineMilestone(
  year: number,
): { title: string; summary: string } | undefined {
  const entry = NOSOTROS_TIMELINE_ENTRIES.find((item) => item.year === year);
  if (!entry) return undefined;
  return { title: entry.title, summary: entry.summary };
}
