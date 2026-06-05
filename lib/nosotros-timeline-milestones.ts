export type TimelineMilestone = {
  title: string;
  summary: string;
};

export const NOSOTROS_TIMELINE_MILESTONES: Record<
  number,
  TimelineMilestone
> = {
  1993: {
    title: "Los primeros pasos",
    summary:
      "Nutriservice inicia sus operaciones elaborando mezclas nutricionales en pequeñas cantidades, construyendo desde el primer día una cultura basada en cercanía, servicio y conocimiento técnico.",
  },
  1995: {
    title: "Los primeros clientes",
    summary:
      "La confianza de productores y empresas impulsa el crecimiento del equipo y consolida las primeras relaciones comerciales de largo plazo.",
  },
  1999: {
    title: "Escalando la producción",
    summary:
      "La incorporación de nuevos equipos y una mayor capacidad operativa marcan el inicio de una etapa de expansión industrial sostenida.",
  },
  2003: {
    title: "Conocimiento que genera valor",
    summary:
      "Nutriservice fortalece sus capacidades técnicas y comienza a posicionarse como un aliado estratégico para mejorar el desempeño productivo de sus clientes.",
  },
  2005: {
    title: "Conectando con la innovación global",
    summary:
      "La compañía establece alianzas con proveedores internacionales, incorporando nuevas tecnologías y soluciones nutricionales de clase mundial.",
  },
  2009: {
    title: "Calidad como estándar",
    summary:
      "Se fortalecen los procesos de control y gestión operacional, consolidando una cultura enfocada en la consistencia, trazabilidad y mejora continua.",
  },
  2015: {
    title: "Soluciones a medida",
    summary:
      "La experiencia acumulada permite desarrollar programas nutricionales personalizados y mezclas diseñadas según los desafíos específicos de cada operación.",
  },
  2019: {
    title: "Liderazgo técnico e industrial",
    summary:
      "Con una operación madura y una amplia red de socios estratégicos, Nutriservice se consolida como un referente nacional en nutrición animal.",
  },
  2024: {
    title: "Impulso hacia el futuro",
    summary:
      "Nutriservice fortalece su capacidad productiva y comercial, integrando nuevas soluciones para acompañar el crecimiento de sus clientes en un mercado cada vez más exigente.",
  },
  2026: {
    title: "Más de tres décadas impulsando resultados",
    summary:
      "Hoy combinamos experiencia, infraestructura, tecnología y formulación especializada para entregar soluciones nutricionales que mejoran el desempeño productivo de nuestros clientes.",
  },
};

export function getTimelineMilestone(
  year: number,
): TimelineMilestone | undefined {
  return NOSOTROS_TIMELINE_MILESTONES[year];
}
