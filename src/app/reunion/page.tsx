import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import DemoWizard from "@/components/DemoWizard";

export const metadata: Metadata = {
  title: "Agenda tu demostración — Clinera.io",
  description:
    "Elige tu plan, agenda tu hora y un especialista te guía paso a paso. Demostración personalizada de 30 minutos, sin tarjeta de crédito.",
  alternates: { canonical: "https://clinera.io/reunion" },
  openGraph: {
    title: "Agenda tu demostración — Clinera.io",
    description:
      "30 min con un especialista. Elige tu plan y horario. Sin tarjeta de crédito.",
    url: "https://clinera.io/reunion",
    type: "website",
  },
};

export default function ReunionPage() {
  return (
    <>
      <NavV3 />
      <main>
        <DemoWizard />
      </main>
      <FooterV3 />
    </>
  );
}
