import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instala IA en tu Clinica desde $59/mes | Clinera.io",
  description:
    "Inteligencia artificial para clinicas desde $59 USD/mes. Agente IA, agenda, fichas clinicas, consentimientos. Sin costo de implementacion. Disenado para clinicas de LATAM.",
  alternates: {
    canonical: "https://clinera.io/start",
  },
};

export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
