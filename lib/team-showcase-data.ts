import { PUBLIC_ASSETS } from "@/lib/public-assets";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image?: string;
  /** Zoom factor inside the photo card (container clips overflow). */
  imageScale?: number;
  /** Vertical offset inside the photo card (e.g. "10%"). */
  imageMarginTop?: string;
  /** Empty slot — no photo. */
  placeholder?: boolean;
  /** Named member without a photo yet — shows name/role normally, dashed photo card. */
  noPhoto?: boolean;
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
    image: PUBLIC_ASSETS.nosotros.fernandoPfp,
    imageScale: 1.5,
    imageMarginTop: "10%",
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
    id: "rodrigo-martinez",
    name: "Rodrigo Martinez",
    role: "Gerente División",
    noPhoto: true,
  },
  {
    id: "sebastian-meneses",
    name: "Sebastian Meneses",
    role: "Gerente de operaciones",
    image: PUBLIC_ASSETS.nosotros.sebastianMeneses,
  }
];
