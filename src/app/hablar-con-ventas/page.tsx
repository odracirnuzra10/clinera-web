import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import VentasLanding from "@/components/ventas/VentasLanding";

export const metadata: Metadata = {
  title: "Hablar con ventas — Clinera.io",
  description:
    "30 min con el equipo comercial de Clinera. IA que responde, agenda y cobra 24/7 en tu clínica.",
  alternates: { canonical: "https://clinera.io/hablar-con-ventas" },
  openGraph: { url: "https://clinera.io/hablar-con-ventas" },
};

export default function HablarConVentasPage() {
  return (
    <>
      <NavV3 />
      <main>
        <VentasLanding />
      </main>
      <FooterV3 />
    </>
  );
}
