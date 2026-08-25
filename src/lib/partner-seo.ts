import type { Metadata } from "next";
import type { Partner } from "@/lib/partners";
import { getPartnerPublicUrl } from "@/lib/partners";
import {
  PARTNERS_CLIENT_DISCOUNT_LABEL,
  PARTNERS_CLIENT_DISCOUNT_MONTHS,
} from "@/content/partners-program";

export function partnerLandingMetadata(partner: Partner): Metadata {
  const title = `${PARTNERS_CLIENT_DISCOUNT_LABEL} por ${PARTNERS_CLIENT_DISCOUNT_MONTHS} meses — te recomienda ${partner.name}`;
  const description = `${partner.name} te recomienda Clinera. Por venir de su parte tienes ${PARTNERS_CLIENT_DISCOUNT_LABEL} de descuento durante ${PARTNERS_CLIENT_DISCOUNT_MONTHS} meses. Lo aplica el closer al cierre.`;
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
