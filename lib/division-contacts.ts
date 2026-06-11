import type { ProductoDivisionSlug } from "@/lib/productos-divisions";

export type DivisionContact = {
  name: string;
  email: string;
  phone?: string;
};

/**
 * Division-specific contact data.
 * Placeholder values use general SAC until client provides real names/emails.
 */
export const DIVISION_CONTACTS: Record<
  ProductoDivisionSlug,
  DivisionContact
> = {
  acuicola: {
    name: "Contacto comercial",
    email: "sac@nutriservice.cl",
    phone: "+56 652232500",
  },
  aves: {
    name: "Contacto comercial",
    email: "sac@nutriservice.cl",
    phone: "+56 652232500",
  },
  cerdos: {
    name: "Contacto comercial",
    email: "sac@nutriservice.cl",
    phone: "+56 652232500",
  },
  mascotas: {
    name: "Contacto comercial",
    email: "sac@nutriservice.cl",
    phone: "+56 652232500",
  },
};

export function getDivisionContact(
  slug: ProductoDivisionSlug,
): DivisionContact {
  return DIVISION_CONTACTS[slug];
}
