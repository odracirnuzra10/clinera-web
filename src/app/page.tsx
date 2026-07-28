import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import HomeV3 from "@/components/home-v3/HomeV3";
import { HOME_FAQ } from "@/content/home-faq";

export const metadata: Metadata = {
  title: "Clinera Intelligence | Opera y estandariza tus clínicas con IA",
  description:
    "Clinera Intelligence conecta agenda, pacientes, ventas y agentes de IA para operar todas tus sedes: agenda, confirma, cobra y recupera pacientes 24/7.",
  alternates: { canonical: "https://www.clinera.io/" },
  openGraph: {
    url: "https://www.clinera.io/",
    title: "Clinera Intelligence — Toda tu clínica pensando y actuando como una",
    description:
      "La capa de inteligencia de Clinera conecta agenda, pacientes, ventas y agentes de IA para operar todas tus sedes con visibilidad y control central.",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Clinera.io",
  url: "https://www.clinera.io",
  logo: "https://www.clinera.io/images/brand/clinera-icon-512.png",
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
