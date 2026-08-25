import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import { PartnerKit } from "@/components/partner/PartnerKit";
import {
  getPartner,
  getPartnerKitPath,
  getPartnerPublicUrl,
  listPartners,
} from "@/lib/partners";
import { partnerKitMetadata } from "@/lib/partner-seo";

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
  return partnerKitMetadata(getPartner(slug));
}

export default async function PartnerSlugKitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) notFound();
  if (partner.vanity) redirect(getPartnerKitPath(partner));

  const url = getPartnerPublicUrl(partner.slug);
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 1024,
    margin: 4,
    color: { dark: "#111111", light: "#FFFFFF" },
    errorCorrectionLevel: "M",
  });

  return <PartnerKit partner={partner} url={url} qrDataUrl={qrDataUrl} />;
}
