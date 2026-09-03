import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description:
    "Esa URL no existe en Clinera. Vuelve al inicio, mira los planes o abre el centro de ayuda.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <NavV3 />
      <main
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          maxWidth: 640,
          margin: "0 auto",
          padding: "96px 24px 80px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#6B7280",
            margin: "0 0 16px",
          }}
        >
          Error 404
        </p>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            margin: "0 0 12px",
            color: "#111318",
          }}
        >
          Esta página no existe
        </h1>
        <p style={{ fontSize: 16, color: "#4B5563", lineHeight: 1.6, margin: "0 0 28px" }}>
          La URL que abriste no está en clinera.io. Prueba uno de estos hubs:
        </p>
        <nav
          aria-label="Páginas principales"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
          }}
        >
          {[
            ["Inicio", "/"],
            ["Planes", "/planes"],
            ["Plataforma", "/plataforma"],
            ["Blog", "/novedades"],
            ["Ayuda", "/ayuda"],
            ["Clínicas", "/clinicas"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #E5E7EB",
                color: "#111318",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </main>
      <FooterV3 />
    </>
  );
}
