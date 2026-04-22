import type { Metadata } from "next";
import VentasLanding from "@/components/ventas/VentasLanding";

export const metadata: Metadata = {
  title: "Agenda una reunión comercial — Clinera.io",
  description:
    "30 min con el equipo comercial de Clinera. IA que responde, agenda y cobra 24/7 en tu clínica.",
  alternates: { canonical: "https://clinera.io/ventas" },
  openGraph: { url: "https://clinera.io/ventas" },
};

export default function VentasPage() {
  return <VentasLanding />;
}
