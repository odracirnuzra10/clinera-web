import type { Metadata } from "next";
import { CasoEstudioPage } from "@/components/casos/CasoEstudioPage";
import { CASO_HEBE } from "@/content/casos";

export const metadata: Metadata = {
  title: CASO_HEBE.title,
  description: CASO_HEBE.description,
  alternates: { canonical: CASO_HEBE.url },
  openGraph: {
    type: "article",
    locale: "es_CL",
    url: CASO_HEBE.url,
    title: CASO_HEBE.title,
    description: CASO_HEBE.description,
    publishedTime: CASO_HEBE.datePublished,
    modifiedTime: CASO_HEBE.dateModified,
  },
};

export default function MetodoHebeCasoPage() {
  return <CasoEstudioPage caso={CASO_HEBE} />;
}
