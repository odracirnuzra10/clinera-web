import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import HomeV3 from "@/components/home-v3/HomeV3";

export const metadata: Metadata = {
  title: "Clinera.io | Agenda pacientes con IA las 24 horas",
  description:
    "Clinera responde tus WhatsApps, consulta tu agenda y tu base de datos, y confirma citas 24/7. +500 médicos en Chile y LATAM.",
  alternates: { canonical: "https://clinera.io/" },
  openGraph: {
    url: "https://clinera.io/",
    title: "Clinera.io — Agenda pacientes con IA las 24 horas",
    description:
      "AURA atiende WhatsApp, agenda y cobra 24/7. Activa tu clínica en menos de 1 hora.",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Clinera.io",
  url: "https://clinera.io",
  logo: "https://clinera.io/images/brand/clinera-icon-512.png",
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
    "Software clínico con IA que atiende WhatsApp, agenda pacientes y mantiene tu calendario lleno 24/7.",
  url: "https://clinera.io",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "89",
    highPrice: "179",
    priceCurrency: "USD",
    offerCount: "3",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "500",
  },
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

      <NavV3 />
      <main>
        <HomeV3 />
      </main>
      <FooterV3 />
    </>
  );
}
