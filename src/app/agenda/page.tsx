import type { Metadata } from "next";
import type { CSSProperties } from "react";
import VentasLanding from "@/components/ventas/VentasLanding";

export const metadata: Metadata = {
  title: "Clinera O.S. — agenda tu reunión y conoce la plataforma",
  description:
    "Agenda, fichas, tratamientos y WhatsApp de cada sede bajo un mismo sistema operativo con IA. Conoce Clinera y reserva 45 min con el equipo comercial en la misma página.",
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
//
// `showcase` es lo que la vuelve landing única: en los pasos 1 a 3 la columna
// izquierda (desktop) muestra el producto en movimiento. En móvil, /agenda v2
// muestra foto+quote del doctor de ese paso (Flavio → Yasna → Katherine).
// El flujo v2 parte necesidades, clínica 1 (volumen), clínica 2 (datos de
// operación), persona y el widget de reserva de app.clinera.io.
export default function AgendaPage() {
  return (
    <>
      <h1 style={srOnly}>Agenda una reunión con el equipo de Clinera</h1>
      <VentasLanding
        enableMigrationQualification
        scheduler="clinera"
        sourcePath="/agenda"
        question1="features"
        investmentAfterContact
        meetingMinutes={45}
        showcase
        agendaV2
      />
    </>
  );
}
