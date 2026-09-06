import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import ConvenioDoctoresLanding from "@/components/convenio-doctores/ConvenioDoctoresLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/components/seo/schemas";
import {
  CONVENIO_DOCTORES_CANONICAL,
  CONVENIO_DOCTORES_PATH,
} from "@/content/partners-program";
import {
  CONVENIO_DOCTORES_BREADCRUMB,
  CONVENIO_DOCTORES_META_DESCRIPTION,
  CONVENIO_DOCTORES_META_TITLE,
  CONVENIO_DOCTORES_OG_DESCRIPTION,
} from "@/content/convenio-doctores-page";

export const metadata: Metadata = {
  title: CONVENIO_DOCTORES_META_TITLE,
  description: CONVENIO_DOCTORES_META_DESCRIPTION,
  alternates: { canonical: CONVENIO_DOCTORES_CANONICAL },
  openGraph: {
    url: CONVENIO_DOCTORES_CANONICAL,
    title: CONVENIO_DOCTORES_META_TITLE,
    description: CONVENIO_DOCTORES_OG_DESCRIPTION,
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera.io — Convenio doctores",
      },
    ],
  },
};

export default function ConvenioDoctoresPage() {
  return (
    <>
      <NavV3 />
      <JsonLd
        data={[
          webPageSchema({
            path: CONVENIO_DOCTORES_PATH,
            name: CONVENIO_DOCTORES_META_TITLE,
            description: CONVENIO_DOCTORES_META_DESCRIPTION,
          }),
          breadcrumbSchema([...CONVENIO_DOCTORES_BREADCRUMB]),
        ]}
      />
      <main>
        <ConvenioDoctoresLanding />
      </main>
      <FooterV3 />
    </>
  );
}
