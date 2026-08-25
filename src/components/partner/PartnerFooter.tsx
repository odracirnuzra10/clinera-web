import Link from "next/link";
import { PartnerWordmark } from "@/components/partner/PartnerWordmark";

export function PartnerFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="partner-footer">
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <PartnerWordmark />
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6B6B6B" }}>
            © Clinera {year}
          </p>
        </div>
        <nav style={{ display: "flex", gap: 16, fontSize: 13 }}>
          <Link href="/terminos">Términos</Link>
          <Link href="/privacidad">Privacidad</Link>
        </nav>
      </div>
    </footer>
  );
}
