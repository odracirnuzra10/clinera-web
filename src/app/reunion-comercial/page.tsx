import type { Metadata } from "next";
import AgendaHebeLanding from "@/components/ventas/AgendaHebeLanding";
import { timezoneIpDelRequest } from "@/lib/timezone-ip";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reunión comercial",
  description:
    "Agenda una reunión comercial con el equipo de Clinera.io. El mismo wizard de /agenda: te mostramos cómo Clinera opera la clínica y reservas el horario en la misma página.",
  alternates: { canonical: "https://www.clinera.io/reunion-comercial" },
  openGraph: {
    title: "Reunión comercial",
    description:
      "Elige día y hora con el mismo agendador de clinera.io/agenda.",
    url: "https://www.clinera.io/reunion-comercial",
    type: "website",
  },
};

export default async function ReunionComercialPage() {
  const tzIp = await timezoneIpDelRequest();
  return <AgendaHebeLanding sourcePath="/reunion-comercial" tzIp={tzIp} />;
}
