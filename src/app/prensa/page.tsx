import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PrensaV3 from "@/components/interior-v3/PrensaV3";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import {
  breadcrumbSchema,
  orgSchema,
  videoObjectSchema,
  webPageSchema,
} from "@/components/seo/schemas";

const TITLE = "Prensa y medios";
const DESCRIPTION =
  "Clinera en la prensa. Ricardo Oyarzún, fundador de Clinera, entrevistado por CNN sobre cómo la IA está transformando la atención de las clínicas en LATAM.";
const CNN_URL = "https://www.youtube.com/watch?v=Gskr4kELyx4";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.clinera.io/prensa" },
  openGraph: {
    url: "https://www.clinera.io/prensa",
    title: "Clinera en la prensa — Entrevista en CNN",
    description: DESCRIPTION,
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera — Prensa",
      },
    ],
  },
};

const cnnNewsArticle = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "@id": `${CNN_URL}#cnn-clinera`,
  headline: "Un gran paso para Clinera",
  description: DESCRIPTION,
  datePublished: "2026-06-26",
  url: CNN_URL,
  citation: CNN_URL,
  author: { "@id": "https://www.metodohebe.cl/fundador/#person" },
  publisher: {
    "@type": "Organization",
    name: "CNN",
    url: "https://www.cnn.com",
  },
  about: { "@id": "https://clinera.io/#organization" },
};

const orgWithSubject = {
  ...orgSchema,
  subjectOf: [{ "@id": `${CNN_URL}#cnn-clinera` }],
};

export default function PrensaPage() {
  return (
    <>
      <NavV3 />
      <JsonLd
        data={[
          orgWithSubject,
          webPageSchema({
            path: "/prensa",
            name: TITLE,
            description: DESCRIPTION,
          }),
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io/" },
            { name: "Prensa", url: "https://www.clinera.io/prensa" },
          ]),
          videoObjectSchema({
            name: "CNN entrevista a Clinera — Un gran paso para Clinera",
            description: DESCRIPTION,
            thumbnailUrl: "https://www.clinera.io/images/og-banner.png",
            uploadDate: "2026-06-26",
            embedUrl: "https://player.vimeo.com/video/1205127087",
            contentUrl: CNN_URL,
          }),
          cnnNewsArticle,
        ]}
      />
      <main>
        <PrensaV3 />
        <PageUpdated path="/prensa" />
      </main>
      <FooterV3 />
    </>
  );
}
