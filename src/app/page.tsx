import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import HomeV3 from "@/components/home-v3/HomeV3";
import { HOME_FAQ } from "@/content/home-faq";

export const metadata: Metadata = {
  title: "Clinera O.S. | El sistema operativo de tu clínica con IA",
  description:
    "Clinera O.S. es el sistema con IA por el que opera tu clínica: agenda, pacientes, fichas, tratamientos, ventas y marketing, con agentes que agendan, confirman, cobran y recuperan pacientes 24/7.",
  alternates: { canonical: "https://www.clinera.io/" },
  openGraph: {
    url: "https://www.clinera.io/",
    title: "Clinera O.S. — El sistema operativo de tu clínica con IA",
    description:
      "Mucho más que un chatbot: agenda, pacientes, fichas, tratamientos, ventas y marketing en un solo sistema con IA, y Clinera Intelligence, el agente interno que te asiste.",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Clinera.io",
  url: "https://www.clinera.io",
  logo: "https://www.clinera.io/images/brand/clinera-icon-512.png",
  // Señal de tema para AI Overviews / LLMs — categorías ya vendidas en el sitio, no claims nuevas.
  knowsAbout: [
    "Inteligencia Artificial para Clínicas",
    "Agendamiento Automático por WhatsApp",
    "Fichas Clínicas Electrónicas",
    "Automatización de Recepción Médica",
    "Gestión de Pacientes con IA",
    "CRM para Clínicas Médicas y Estéticas",
    "Recuperación de Pacientes con Agentes de IA",
  ],
  sameAs: [
    "https://cl.linkedin.com/company/clinera-io",
    "https://www.instagram.com/clinera.io",
    "https://www.youtube.com/channel/UCl4Bh9sNp22PjJuSLgz9ZsQ",
  ],
};

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Clinera",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "Clinera Intelligence conecta agenda, pacientes, ventas y agentes de IA para grupos clínicos: agenda, confirma, cobra y recupera pacientes por WhatsApp 24/7 con control central.",
  url: "https://www.clinera.io",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "129",
    highPrice: "1500",
    priceCurrency: "USD",
    offerCount: "4",
  },
  // Fuente única de rating: coherente con "+52 clínicas activas" visible en el sitio
  // (mismo valor que softwareSchema en src/components/seo/schemas.ts).
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "52",
    bestRating: "5",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <NavV3 />
      <main>
        <HomeV3 />
      </main>
      <FooterV3 />
    </>
  );
}
