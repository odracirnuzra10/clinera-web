import type { Metadata } from "next";
import AgendaHebeLanding from "@/components/ventas/AgendaHebeLanding";

export const metadata: Metadata = {
  title: "Agenda (estructura Hebe) — comparación local",
  description:
    "Misma conversación de Clinera, con la estructura de metodohebe.cl/evaluacion. Colores y fuentes de Clinera. No indexar.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/agenda" },
};

export default function AgendaHebePage() {
  return <AgendaHebeLanding />;
}
