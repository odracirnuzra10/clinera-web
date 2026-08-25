import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PartnersLanding from "@/components/partners/PartnersLanding";
import { breadcrumbSchema, faqSchema } from "@/components/seo/schemas";
import {
  PARTNERS_CANONICAL,
  PARTNERS_FAQ,
  PARTNERS_META_DESCRIPTION,
  PARTNERS_META_TITLE,
  PARTNERS_OG_DESCRIPTION,
} from "@/content/partners-program";

export const metadata: Metadata = {
  title: PARTNERS_META_TITLE,
  description: PARTNERS_META_DESCRIPTION,
  alternates: { canonical: PARTNERS_CANONICAL },
  openGraph: {
    url: PARTNERS_CANONICAL,
    title: PARTNERS_META_TITLE,
    description: PARTNERS_OG_DESCRIPTION,
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera.io — Programa partner",
      },
    ],
  },
};

const breadcrumbJsonLd = breadcrumbSchema([
  { name: "Inicio", url: "https://www.clinera.io/" },
  { name: "Partners", url: PARTNERS_CANONICAL },
]);

const faqJsonLd = faqSchema(PARTNERS_FAQ);

export default function PartnersPage() {
  return (
    <>
      <NavV3 />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main>
        <PartnersLanding />
      </main>
      <FooterV3 />
    </>
  );
}
