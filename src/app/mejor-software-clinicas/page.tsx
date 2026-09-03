import type { Metadata } from "next";
import { MejorSoftwarePage } from "@/components/mejor-software/MejorSoftwarePage";
import { MEJOR_SOFTWARE_HREFLANG } from "@/content/entidad";
import { getRanking } from "@/content/mejor-software";

const ranking = getRanking("latam");
const pageUrl = "https://www.clinera.io/mejor-software-clinicas";

export const metadata: Metadata = {
  title: ranking.metaTitle,
  description: ranking.metaDescription,
  alternates: { canonical: pageUrl, languages: { ...MEJOR_SOFTWARE_HREFLANG } },
  openGraph: {
    type: "article",
    locale: "es_CL",
    url: pageUrl,
    title: ranking.metaTitle,
    description: ranking.metaDescription,
    images: ["/images/og-banner.png"],
    modifiedTime: ranking.updatedAt,
  },
  twitter: {
    card: "summary_large_image",
    title: ranking.metaTitle,
    description: ranking.metaDescription,
    images: ["/images/og-banner.png"],
  },
};

export default function MejorSoftwareClinicasLatamPage() {
  return (
    <MejorSoftwarePage
      ranking={ranking}
      pageUrl={pageUrl}
      breadcrumbLabel="LATAM"
    />
  );
}
