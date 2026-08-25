import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PartnerLanding } from "@/components/partner/PartnerLanding";
import { getPartner, listPartners } from "@/lib/partners";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const dynamicParams = false;

export function generateStaticParams() {
  return listPartners().map((partner) => ({ slug: partner.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) return {};

  const title = `${partner.name} te recomienda Clinera`;
  const description =
    "El software con IA que agenda, cobra y hace seguimiento a tus pacientes por WhatsApp.";
  const url = `https://www.clinera.io/p/${partner.slug}`;

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

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) notFound();

  return <PartnerLanding partner={partner} whatsappUrl={buildWhatsAppUrl(partner)} />;
}
