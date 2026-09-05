import type { Metadata } from "next";
import type { Partner } from "@/lib/partners";
import { getPartnerPublicUrl } from "@/lib/partners";

export function partnerLandingMetadata(partner: Partner): Metadata {
  const title = `${partner.name} te recomienda Clinera`;
  const description = `${partner.name} te recomienda Clinera. Coordiná una reunión con el equipo comercial para ver cómo queda en tu clínica.`;
  const url = getPartnerPublicUrl(partner.slug);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_CL",
      url,
      title,
      description,
      siteName: "Clinera.io",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function partnerKitMetadata(partner: Partner | undefined): Metadata {
  return {
    title: { absolute: partner ? `Kit de ${partner.name}` : "Kit de partner" },
    robots: { index: false, follow: false },
  };
}
