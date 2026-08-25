import type { Partner } from "@/lib/partners";
import { getPartnerKitCopy } from "@/lib/partners";
import { CopyButton } from "@/components/partner/CopyButton";
import { PartnerFooter } from "@/components/partner/PartnerFooter";
import { PartnerNav } from "@/components/partner/PartnerNav";

export function PartnerKit({
  partner,
  url,
  qrDataUrl,
}: {
  partner: Partner;
  url: string;
  qrDataUrl: string;
}) {
  const copy = getPartnerKitCopy(partner);
  const fileName = `clinera-${partner.slug}-qr.png`;
  const firstName = partner.name.split(" ")[0] ?? partner.name;

  return (
    <div style={{ display: "flex", minHeight: "100dvh", flexDirection: "column" }}>
      <PartnerNav />

      <main id="contenido" style={{ flex: 1 }}>
        <div className="partner-stack partner-kit-stack">
          <section className="partner-card">
            <div className="partner-eyebrow">Kit de partner</div>
            <h1
              style={{
                margin: "8px 0 0",
                fontSize: "1.6rem",
                fontWeight: 600,
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
              }}
            >
              Kit de {partner.name}
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.55 }}>
              Hola, {firstName}. Esta página es tuya. No la compartas con prospectos: ellos
              entran por tu link público. Tú solo pegas, subes el QR o dictas tu código.
            </p>
          </section>

          <div className="partner-kit-top">
            <section className="partner-card" style={{ textAlign: "center" }}>
              <h2 className="partner-section-title">Tu QR</h2>
              <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.5 }}>
                Negro sobre blanco. Se lee desde un delantal o una tarjeta.
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt={`QR del link de ${partner.name}`}
                width={160}
                height={160}
                className="partner-qr"
                style={{ margin: "0 auto" }}
              />
              <div style={{ marginTop: 14 }}>
                <a href={qrDataUrl} download={fileName} className="partner-btn partner-btn-ghost">
                  Descargar PNG 1024px
                </a>
              </div>
            </section>

            <div className="partner-kit-side">
              <section className="partner-card">
                <h2 className="partner-section-title">Tu link</h2>
                <div className="partner-kit-url">{url}</div>
                <div style={{ marginTop: 12 }}>
                  <CopyButton value={url} />
                </div>
              </section>

              <section className="partner-card">
                <h2 className="partner-section-title">Tu código</h2>
                <div className="partner-ref">{partner.ref}</div>
                <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.5 }}>
                  Úsalo cuando alguien te pregunte de boca. Ventas lo busca igual que el link.
                </p>
                <div style={{ marginTop: 12 }}>
                  <CopyButton value={partner.ref} />
                </div>
              </section>
            </div>
          </div>

          <section className="partner-card">
            <h2 className="partner-section-title">Textos listos para copiar</h2>
            <p style={{ margin: "0 0 18px", fontSize: 15, lineHeight: 1.55 }}>
              Tono de colega a colega. Pégalos tal cual.
            </p>

            <article style={{ paddingBottom: 18, borderBottom: "1px solid #EAEAEA" }}>
              <div className="partner-eyebrow">Historia de Instagram</div>
              <p className="partner-copy-block" style={{ marginTop: 10 }}>
                {copy.instagram}
              </p>
              <div style={{ marginTop: 12 }}>
                <CopyButton value={copy.instagram} />
              </div>
            </article>

            <article
              style={{ padding: "18px 0", borderBottom: "1px solid #EAEAEA" }}
            >
              <div className="partner-eyebrow">WhatsApp a una colega</div>
              <p className="partner-copy-block" style={{ marginTop: 10 }}>
                {copy.whatsapp}
              </p>
              <div style={{ marginTop: 12 }}>
                <CopyButton value={copy.whatsapp} />
              </div>
            </article>

            <article style={{ paddingTop: 18 }}>
              <div className="partner-eyebrow">Comentario o DM</div>
              <p className="partner-copy-block" style={{ marginTop: 10 }}>
                {copy.comentario}
              </p>
              <div style={{ marginTop: 12 }}>
                <CopyButton value={copy.comentario} />
              </div>
            </article>
          </section>
        </div>
      </main>

      <PartnerFooter />
    </div>
  );
}
