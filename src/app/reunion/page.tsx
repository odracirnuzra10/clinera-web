import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import CalEmbed from "./CalEmbed";

export const metadata: Metadata = {
  title: "Agenda tu reunión — Clinera.io",
  description:
    "30 minutos con el equipo comercial de Clinera. Elige el horario que te acomode y te confirmamos por email. Sin tarjeta de crédito.",
  alternates: { canonical: "https://clinera.io/reunion" },
  openGraph: {
    title: "Agenda tu reunión — Clinera.io",
    description:
      "30 min con el equipo comercial. Elige horario y te confirmamos por email.",
    url: "https://clinera.io/reunion",
    type: "website",
  },
};

export default function ReunionPage() {
  return (
    <>
      <NavV3 />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#7C3AED",
              marginBottom: 10,
            }}
          >
            Reunión comercial · 30 min
          </div>
          <h1
            style={{
              fontFamily: "Inter",
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-.03em",
              margin: "0 0 10px",
              color: "#0A0A0A",
            }}
          >
            Elige el horario que te acomode
          </h1>
          <p style={{ fontFamily: "Inter", fontSize: 16, color: "#4B5563", margin: 0, lineHeight: 1.5 }}>
            30 minutos por videollamada · te confirmamos por email · sin tarjeta de crédito.
          </p>
        </div>
        <CalEmbed />
      </main>
      <FooterV3 />
    </>
  );
}
