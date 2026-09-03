import Link from "next/link";
import { POST_PROXIMAS_FUNCIONES_PATH } from "@/content/proximas-funciones";

const GRAD = "linear-gradient(90deg, #009FE3 0%, #7C3AED 55%, #D946EF 100%)";

/**
 * Anuncio de producto en home. Apunta al hub del blog; no duplica el detalle
 * ni nombra inventario/liquidaciones (siguen inéditos).
 */
export default function ActualizacionSeptiembreBanner() {
  return (
    <section
      aria-labelledby="sept-update-title"
      style={{
        padding: "8px 80px 28px",
        background: "#fff",
      }}
    >
      <div
        className="sept-update-card"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "linear-gradient(135deg, #0E1014 0%, #1F1B2E 100%)",
          borderRadius: 20,
          padding: "28px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 28px 64px -20px rgba(124,58,237,.3)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: GRAD,
          }}
        />
        <div style={{ flex: "1 1 420px", minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 10px",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#E9D5FF",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#D946EF",
                display: "inline-block",
              }}
            />
            Nuevo
          </p>
          <h2
            id="sept-update-title"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "clamp(22px, 2.4vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.12,
              color: "#fff",
              margin: "0 0 10px",
            }}
          >
            Nueva actualización de septiembre
          </h2>
          <p
            style={{
              margin: 0,
              maxWidth: 640,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(255,255,255,.78)",
            }}
          >
            Cinco funciones nuevas sobre la misma ficha: DTE con Open Factura
            en Chile, odontograma y presupuestador, Instagram Direct y
            Messenger, email marketing y trigger de cumpleaños.
          </p>
        </div>
        <Link
          href={POST_PROXIMAS_FUNCIONES_PATH}
          style={{
            background: "#fff",
            color: "#0E1014",
            padding: "13px 22px",
            borderRadius: 999,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 14.5,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Leer en el blog →
        </Link>
      </div>
      <style>{`
        @media (max-width: 720px) {
          .sept-update-card {
            padding: 24px 22px !important;
          }
        }
      `}</style>
    </section>
  );
}
