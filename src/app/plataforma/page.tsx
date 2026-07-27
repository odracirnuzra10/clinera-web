import type { Metadata } from "next";
import FooterV3 from "@/components/brand-v3/Footer";
import NavV3 from "@/components/brand-v3/Nav";
import PlataformaLanding from "@/components/plataforma/PlataformaLanding";

export const metadata: Metadata = {
  title: "Centraliza tu clínica y escala con control",
  description:
    "Clinera centraliza agenda, WhatsApp, fichas, cobros y seguimiento con IA. Migración, configuración y capacitación para clínicas con alto volumen o varias sedes.",
  alternates: { canonical: "https://www.clinera.io/plataforma" },
  openGraph: {
    url: "https://www.clinera.io/plataforma",
    title: "Centraliza tu clínica. Escala sin perder el control — Clinera.io",
    description:
      "Una plataforma con IA para operar todas tus sedes, con migración gestionada, configuración y capacitación.",
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.clinera.io/" },
    { "@type": "ListItem", position: 2, name: "Plataforma", item: "https://www.clinera.io/plataforma" },
  ],
};

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Clinera",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "Plataforma con IA que unifica agenda, WhatsApp, ficha clínica, cobros, recuperación de pacientes y control central de todas las sedes de una clínica o grupo clínico.",
  url: "https://www.clinera.io/plataforma",
  // Coherente con los planes mid-market visibles en esta landing. El plan de
  // entrada de USD 279 se mantiene en /planes y no se presenta aquí.
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "379",
    highPrice: "1900",
    priceCurrency: "USD",
    offerCount: "3",
  },
};

export default function PlataformaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />

      <NavV3 ctaHref="/ventas" ctaLabel="Ver Clinera con mi operación" />
      <main>
        <PlataformaLanding />
      </main>
      <FooterV3 />
    </>
  );
}
