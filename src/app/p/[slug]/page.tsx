import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PartnerLanding } from "@/components/partner/PartnerLanding";
import { getPartner, getPartnerPublicPath, listPartners } from "@/lib/partners";
import { partnerLandingMetadata } from "@/lib/partner-seo";
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
  return partnerLandingMetadata(partner);
}

export default async function PartnerSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) notFound();
  if (partner.vanity) redirect(getPartnerPublicPath(partner));

  return <PartnerLanding partner={partner} whatsappUrl={buildWhatsAppUrl(partner)} />;
}
