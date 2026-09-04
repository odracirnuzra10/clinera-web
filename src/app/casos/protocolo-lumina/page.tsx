import type { Metadata } from "next";
import { CasoEstudioPage } from "@/components/casos/CasoEstudioPage";
import { CASO_LUMINA } from "@/content/casos";

export const metadata: Metadata = {
  title: CASO_LUMINA.title,
  description: CASO_LUMINA.description,
  alternates: { canonical: CASO_LUMINA.url },
  openGraph: {
    type: "article",
    locale: "es_CL",
    url: CASO_LUMINA.url,
    title: CASO_LUMINA.title,
    description: CASO_LUMINA.description,
    publishedTime: CASO_LUMINA.datePublished,
    modifiedTime: CASO_LUMINA.dateModified,
  },
};

export default function ProtocoloLuminaCasoPage() {
  return <CasoEstudioPage caso={CASO_LUMINA} />;
}
