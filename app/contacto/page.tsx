import type { Metadata } from "next";

import ContactPageLayout from "@/components/contact-page-layout";

export const metadata: Metadata = {
  title: "Contacto — Agenda una evaluación técnica",
  description:
    "Agenda una reunión técnica con los especialistas de Nutriservice. Sin compromiso, con datos. Respondemos dentro de 24 horas hábiles.",
};

export default function ContactoPage() {
  return <ContactPageLayout />;
}
