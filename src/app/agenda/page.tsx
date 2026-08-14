import type { Metadata } from "next";
import type { CSSProperties } from "react";
import VentasLanding from "@/components/ventas/VentasLanding";

export const metadata: Metadata = {
  title: "Agenda una reunión comercial — Clinera.io",
  description:
    "45 min con el equipo comercial de Clinera. Reserva en la agenda real del producto: elige profesional y horario disponible.",
  alternates: { canonical: "https://www.clinera.io/agenda" },
  openGraph: { url: "https://www.clinera.io/agenda" },
};

const srOnly: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

// Misma landing que /ventas, con el paso final sobre el widget de reserva del
// propio producto (app.clinera.io/embed) en lugar de Cal.com: los datos de
// contacto del paso 3 viajan en la URL del iframe y el cliente solo elige
// profesional y fecha disponible.
export default function AgendaPage() {
  return (
    <>
      <h1 style={srOnly}>Agenda una reunión con el equipo de Clinera</h1>
      <VentasLanding
        enableMigrationQualification
        scheduler="clinera"
        sourcePath="/agenda"
        question1="need"
        investmentAfterContact
        meetingMinutes={45}
      />
    </>
  );
}
