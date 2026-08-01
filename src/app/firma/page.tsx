import type { Metadata } from "next";
import FirmaTool from "./FirmaTool";

export const metadata: Metadata = {
  title: "Firma de documentos",
  description:
    "Herramienta interna del equipo comercial: envía cotizaciones a firma electrónica simple.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FirmaPage() {
  return <FirmaTool />;
}
