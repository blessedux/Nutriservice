export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
};

/** Placeholder team — replace with real Nutriservice profiles when available. */
export const TEAM_SHOWCASE_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "María González",
    role: "Dirección general",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=480&fit=crop&crop=faces",
    social: { linkedin: "#" },
  },
  {
    id: "2",
    name: "Carlos Mendoza",
    role: "Dirección técnica",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=480&fit=crop&crop=faces",
    social: { linkedin: "#" },
  },
  {
    id: "3",
    name: "Valentina Rojas",
    role: "Formulación y I+D",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=480&fit=crop&crop=faces",
    social: { linkedin: "#" },
  },
  {
    id: "4",
    name: "Andrés Silva",
    role: "Operaciones de maquila",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=480&fit=crop&crop=faces",
    social: { linkedin: "#" },
  },
  {
    id: "5",
    name: "Camila Torres",
    role: "Relación con clientes",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=480&fit=crop&crop=faces",
    social: { linkedin: "#", instagram: "#" },
  },
  {
    id: "6",
    name: "Felipe Herrera",
    role: "Calidad y certificaciones",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=480&fit=crop&crop=faces",
    social: { linkedin: "#" },
  },
];
