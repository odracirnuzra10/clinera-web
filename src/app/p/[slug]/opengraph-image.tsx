import { renderPartnerOpengraphImage } from "@/lib/partner-og";

export const runtime = "nodejs";
export const alt = "Recomendación Clinera";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PartnerOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return renderPartnerOpengraphImage(slug);
}
