import type { Metadata } from "next";
import FirmaCliente from "./FirmaCliente";

export const metadata: Metadata = {
  title: "Firma de documento",
  description: "Revisa y firma electrónicamente tu cotización de Clinera.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function FirmaSobrePage({ params }: PageProps<"/firma/[id]">) {
  const { id } = await params;
  return <FirmaCliente id={id} />;
}
