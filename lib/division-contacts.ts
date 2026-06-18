import type { ProductoDivisionSlug } from "@/lib/productos-divisions";

export type DivisionContact = {
  name: string;
  email: string;
  phone?: string;
};

/**
 * Division-specific contact data for industry page contact cards.
 */
export const DIVISION_CONTACTS: Record<
  ProductoDivisionSlug,
  DivisionContact
> = {
  acuicola: {
    name: "Gonzalo Marambio – Gerente División",
    email: "gmarambio@nutriservice.cl",
    phone: "+56 9 89005220",
  },
  aves: {
    name: "Rodrigo Martinez – Gerente División",
    email: "rmartinez@nutriservice.cl",
    phone: "+56 954031992",
  },
  cerdos: {
    name: "Rodrigo Martinez – Gerente División",
    email: "rmartinez@nutriservice.cl",
    phone: "+56 954031992",
  },
  mascotas: {
    name: "Rodrigo Martinez – Gerente División",
    email: "rmartinez@nutriservice.cl",
    phone: "+56 954031992",
  },
};

export function getDivisionContact(
  slug: ProductoDivisionSlug,
): DivisionContact {
  return DIVISION_CONTACTS[slug];
}
