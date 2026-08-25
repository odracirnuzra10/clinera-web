import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { PartnerKit } from "@/components/partner/PartnerKit";
import { getPartnerByVanity, getPartnerPublicUrl, listPartners } from "@/lib/partners";
import { partnerKitMetadata } from "@/lib/partner-seo";

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
  return partnerKitMetadata(getPartnerByVanity(code));
}

export default async function PartnerVanityKitPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const partner = getPartnerByVanity(code);
  if (!partner) notFound();

  const url = getPartnerPublicUrl(partner.slug);
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 1024,
    margin: 4,
    color: { dark: "#111111", light: "#FFFFFF" },
    errorCorrectionLevel: "M",
  });

  return <PartnerKit partner={partner} url={url} qrDataUrl={qrDataUrl} />;
}
