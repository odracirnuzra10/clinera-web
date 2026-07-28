import {
  SETUP_FEE_AMOUNT,
  SETUP_FEE_COPY,
  SETUP_FEE_INCLUDES,
  SETUP_FEE_TITLE,
} from "@/content/pricing";

const GRAD = "linear-gradient(90deg, #009FE3 0%, #7C3AED 55%, #D946EF 100%)";

/**
 * Banda de costo de configuración inicial. Va arriba de cualquier grilla de planes:
 * es lo primero que tiene que saber quien compara precios.
 *
 * `className` permite sumar la clase `reveal` en las páginas que corren useReveal();
 * en las que no (por ejemplo /plataforma) se omite y la banda se ve directo.
 */
export default function SetupFeeBand({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={["setup-fee-band", className].filter(Boolean).join(" ")}
      style={{
        background: "linear-gradient(135deg, #0E1014 0%, #1F1B2E 100%)",
        borderRadius: 18,
        padding: "32px 36px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 24px 48px -16px rgba(124,58,237,.25)",
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr",
        gap: 32,
        alignItems: "center",
        ...style,
      }}
    >
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: GRAD }} />
      <div>
        <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", marginBottom: 12, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D946EF", display: "inline-block" }} />
          Antes de elegir plan · pago único
        </div>
        <h3 style={{ fontFamily: "Inter", fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 10px" }}>
          {SETUP_FEE_TITLE}
        </h3>
        <p style={{ fontFamily: "Inter", fontSize: 14.5, color: "rgba(255,255,255,.75)", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 560 }}>
          {SETUP_FEE_COPY}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SETUP_FEE_INCLUDES.map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 12.5, fontWeight: 500, color: "#E9D5FF", background: "rgba(124,58,237,.14)", border: "1px solid rgba(124,58,237,.35)", padding: "5px 10px", borderRadius: 999 }}>{t}</span>
          ))}
        </div>
      </div>
      <div className="setup-fee-band-right" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <span style={{ fontFamily: "Inter", fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>
            {SETUP_FEE_AMOUNT}
          </span>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,.55)" }}>USD</span>
        </div>
        <small style={{ color: "rgba(255,255,255,.62)", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, letterSpacing: ".04em", textAlign: "right" }}>
          Pago único · no recurrente · aplica a los 3 planes
        </small>
      </div>
      <style>{`
        @media (max-width: 980px) {
          .setup-fee-band { grid-template-columns: 1fr !important; gap: 20px !important; padding: 24px !important; }
          .setup-fee-band .setup-fee-band-right { align-items: flex-start !important; }
          .setup-fee-band .setup-fee-band-right small { text-align: left !important; }
        }
      `}</style>
    </div>
  );
}
