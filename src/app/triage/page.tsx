import type { Metadata } from "next";
import { allClinics } from "@/content/clinics";
import TriageForm from "./TriageForm";

// Página interna del equipo OACG: no debe indexarse ni aparecer en el sitemap.
export const metadata: Metadata = {
  title: "Reportar una incidencia",
  description: "Formulario interno de reportes del equipo OACG.",
  robots: { index: false, follow: false, nocache: true },
};

export default function TriagePage() {
  // Sugerencias para el campo "clínica". Se derivan acá (server component)
  // para no arrastrar todo el dataset de clínicas al bundle del cliente:
  // al formulario sólo le viajan los nombres.
  const clinicas = [...new Set(allClinics.map((c) => c.nombre))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );

  return <TriageForm clinicas={clinicas} />;
}
