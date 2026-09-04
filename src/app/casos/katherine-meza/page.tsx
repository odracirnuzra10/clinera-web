import type { Metadata } from "next";
import { CasoEstudioPage } from "@/components/casos/CasoEstudioPage";
import { CASO_KM } from "@/content/casos";

export const metadata: Metadata = {
  title: CASO_KM.title,
  description: CASO_KM.description,
  alternates: { canonical: CASO_KM.url },
  openGraph: {
    type: "article",
    locale: "es_CL",
    url: CASO_KM.url,
    title: CASO_KM.title,
    description: CASO_KM.description,
    publishedTime: CASO_KM.datePublished,
    modifiedTime: CASO_KM.dateModified,
  },
};

export default function KatherineMezaCasoPage() {
  return <CasoEstudioPage caso={CASO_KM} />;
}
