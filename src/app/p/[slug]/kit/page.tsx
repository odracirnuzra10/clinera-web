import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { PartnerKit } from "@/components/partner/PartnerKit";
import { getPartner, getPartnerPublicUrl, listPartners } from "@/lib/partners";

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
  return {
    title: { absolute: partner ? `Kit de ${partner.name}` : "Kit de partner" },
    robots: { index: false, follow: false },
  };
}

export default async function PartnerKitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartner(slug);
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
