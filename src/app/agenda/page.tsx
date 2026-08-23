import type { Metadata } from "next";
import AgendaHebeLanding from "@/components/ventas/AgendaHebeLanding";

export const metadata: Metadata = {
  title: "Clinera O.S. — agenda tu reunión y conoce la plataforma",
  description:
    "Agenda, fichas, tratamientos y WhatsApp de cada sede bajo un mismo sistema operativo con IA. Conoce Clinera y reserva 45 min con el equipo comercial en la misma página.",
  alternates: { canonical: "https://www.clinera.io/agenda" },
  openGraph: { url: "https://www.clinera.io/agenda" },
};

export default function AgendaPage() {
  return <AgendaHebeLanding />;
}
