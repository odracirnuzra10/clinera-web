import { getPartnerByVanity } from "@/lib/partners";
import { renderPartnerOpengraphImage } from "@/lib/partner-og";

export const runtime = "nodejs";
export const alt = "Recomendación Clinera";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PartnerVanityOpengraphImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const partner = getPartnerByVanity(code);
  return renderPartnerOpengraphImage(partner?.slug);
}
