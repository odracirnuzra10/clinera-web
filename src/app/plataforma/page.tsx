import type { Metadata } from "next";
import PlataformaLanding from "@/components/plataforma/PlataformaLanding";

export const metadata: Metadata = {
  title: "Clinera O.S. — El sistema operativo de tu clínica con IA",
  description:
    "Clinera O.S.: agenda, tratamientos, pacientes, fichas clínicas, consentimientos, automatizaciones, ventas, marketing y comunicación con IA por voz y texto — con implementación gestionada.",
  alternates: { canonical: "https://www.clinera.io/plataforma" },
  openGraph: {
    url: "https://www.clinera.io/plataforma",
    title: "Clinera O.S. — El sistema operativo de tu clínica con IA",
    description:
      "Mucho más que un chatbot: el sistema por el que opera tu clínica, con la potencia enterprise de las clínicas grandes al alcance de la tuya.",
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
  // Coherente con las tarjetas canónicas de planes (Vortex/Atlas/Summit en
  // mensual, semestral y anual; Summit anual: USD 4.598).
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "279",
    highPrice: "4598",
    priceCurrency: "USD",
    offerCount: "9",
    description:
      "Tres modalidades: anual anticipado con 20% de descuento e implementación gratis, semestral anticipado con 20% de descuento, o facturación mensual con permanencia mínima de 6 meses.",
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
