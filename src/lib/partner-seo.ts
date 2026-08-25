import type { Metadata } from "next";
import type { Partner } from "@/lib/partners";
import { getPartnerPublicUrl } from "@/lib/partners";

const DESCRIPTION =
  "El software con IA que agenda, cobra y hace seguimiento a tus pacientes por WhatsApp.";

export function partnerLandingMetadata(partner: Partner): Metadata {
  const title = `${partner.name} te recomienda Clinera`;
  const url = getPartnerPublicUrl(partner.slug);

  return {
    title: { absolute: title },
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_CL",
      url,
      title,
      description: DESCRIPTION,
      siteName: "Clinera.io",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: DESCRIPTION,
    },
  };
}

export function partnerKitMetadata(partner: Partner | undefined): Metadata {
  return {
    title: { absolute: partner ? `Kit de ${partner.name}` : "Kit de partner" },
    robots: { index: false, follow: false },
  };
}
