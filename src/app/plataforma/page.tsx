import type { Metadata } from "next";
import PlataformaLanding from "@/components/plataforma/PlataformaLanding";

export const metadata: Metadata = {
  title: "IA enterprise para todas tus sedes",
  description:
    "Todas tus sedes en una sola IA. Clinera centraliza la operación y AURA atiende por WhatsApp y llamadas de voz, con implementación gestionada.",
  alternates: { canonical: "https://www.clinera.io/plataforma" },
  openGraph: {
    url: "https://www.clinera.io/plataforma",
    title: "Todas tus sedes, en una sola IA — Clinera.io",
    description:
      "La solución enterprise de IA que usan las clínicas grandes, al alcance de la tuya. WhatsApp, llamadas de voz y control central.",
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
    "Plataforma enterprise con IA que unifica agenda, WhatsApp, llamadas de voz, ficha clínica, cobros y control central de todas las sedes.",
  url: "https://www.clinera.io/plataforma",
  // Coherente con los modos mensual y semestral visibles en esta landing.
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "379",
    highPrice: "9120",
    priceCurrency: "USD",
    offerCount: "6",
    description:
      "Facturación mensual con permanencia mínima de 6 meses o pago semestral anticipado con 20% de descuento.",
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

      <main>
        <PlataformaLanding />
      </main>
    </>
  );
}
