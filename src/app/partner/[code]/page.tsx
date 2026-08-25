import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PartnerLanding } from "@/components/partner/PartnerLanding";
import { getPartnerByVanity, listPartners } from "@/lib/partners";
import { partnerLandingMetadata } from "@/lib/partner-seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const dynamicParams = false;

export function generateStaticParams() {
  return listPartners()
    .filter((partner) => partner.vanity)
    .map((partner) => ({ code: partner.vanity as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const partner = getPartnerByVanity(code);
  if (!partner) return {};
  return partnerLandingMetadata(partner);
}

export default async function PartnerVanityPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const partner = getPartnerByVanity(code);
  if (!partner) notFound();

  return <PartnerLanding partner={partner} whatsappUrl={buildWhatsAppUrl(partner)} />;
}
