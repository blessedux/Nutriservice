import { PUBLIC_ASSETS } from "@/lib/public-assets";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image?: string;
  /** Empty slot — no photo; keeps the original 6-card mosaic layout. */
  placeholder?: boolean;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
};

export const TEAM_SHOWCASE_MEMBERS: TeamMember[] = [
  {
    id: "fernando-girones",
    name: "Fernando Gironés",
    role: "Gerente General",
    image: PUBLIC_ASSETS.nosotros.fernandoGirones,
    social: {
      linkedin:
        "https://www.linkedin.com/in/fernando-giron%C3%A9s-barrondo-78308899/",
    },
  },
  {
    id: "gonzalo-marambio",
    name: "Gonzalo Marambio",
    role: "Gerente División",
    image: PUBLIC_ASSETS.nosotros.gonzaloMarambio,
    social: {
      linkedin:
        "https://www.linkedin.com/in/gonzalo-marambio-5716a442/?skipRedirect=true",
    },
  },
  {
    id: "ruben-cerda",
    name: "Rubén Cerda",
    role: "Jefe de Planta",
    image: PUBLIC_ASSETS.nosotros.rubenCerda,
    social: {
      linkedin:
        "https://www.linkedin.com/in/ruben-cerda-b25ab356/?skipRedirect=true",
    },
  },
  {
    id: "manuel-abalo",
    name: "Manuel Abalo",
    role: "Gerente Comercial",
    image: PUBLIC_ASSETS.nosotros.manuelAbalo,
    social: {
      linkedin: "https://www.linkedin.com/in/manuel-abalo-9b06bab8/",
    },
  },
  {
    id: "placeholder-5",
    name: "Por confirmar",
    role: "Próximamente",
    placeholder: true,
  },
  {
    id: "placeholder-6",
    name: "Por confirmar",
    role: "Próximamente",
    placeholder: true,
  },
];
