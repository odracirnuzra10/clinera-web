import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Partner } from "@/lib/partners";
import { PartnerCnnVideo } from "@/components/partner/PartnerCnnVideo";
import { PartnerFaq } from "@/components/partner/PartnerFaq";
import { PartnerFooter } from "@/components/partner/PartnerFooter";
import { PartnerNav } from "@/components/partner/PartnerNav";
import { PartnerPhoto } from "@/components/partner/PartnerPhoto";
import { PartnerStickyCta } from "@/components/partner/PartnerStickyCta";
import { PartnerTracker } from "@/components/partner/PartnerTracker";
import { WhatsAppCta } from "@/components/partner/WhatsAppCta";

const FEATURES = [
  {
    n: "01",
    title: "AURA responde y agenda por WhatsApp, 24/7",
    body: "Contesta consultas, agenda, confirma y reagenda sin que nadie del equipo esté conectado.",
  },
  {
    n: "02",
    title: "Ficha, agenda y pacientes en un solo lugar",
    body: "Historial, tratamientos y consentimientos donde los necesitas, no en tres planillas distintas.",
  },
  {
    n: "03",
    title: "Cobros y recordatorios automáticos",
    body: "Menos no-shows, menos plata que se pierde en el seguimiento manual.",
  },
] as const;

const PROOF = [
  { label: "+52 clínicas activas", stat: true },
  { label: "+500 profesionales", stat: true },
  { label: "Meta Business Partner", stat: false },
  { label: "WhatsApp Business API", stat: false },
] as const;

function partnerPhotoSrc(partner: Partner): string | null {
  const rel = partner.photo.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", rel)) ? partner.photo : null;
}

export function PartnerLanding({
  partner,
  whatsappUrl,
}: {
  partner: Partner;
  whatsappUrl: string;
}) {
  const photoSrc = partnerPhotoSrc(partner);
  return (
    <div style={{ display: "flex", minHeight: "100dvh", flexDirection: "column" }}>
      <PartnerTracker partner={partner} />
      <PartnerNav />

      <main id="contenido" className="partner-main" style={{ flex: 1 }}>
        <div className="partner-stack">
          <section className="partner-card partner-hero">
            <div className="partner-eyebrow">
              <span className="partner-eyebrow-dot" aria-hidden="true" />
              Recomendación verificada
            </div>
            <div style={{ marginTop: 12 }}>
              <PartnerPhoto partner={partner} src={photoSrc} />
            </div>
            <h1
              style={{
                margin: "12px 0 0",
                fontSize: "1.6rem",
                fontWeight: 600,
                lineHeight: 1.15,
                letterSpacing: "-0.035em",
              }}
            >
              <span style={{ display: "block" }}>{partner.name}</span>
              <span style={{ display: "block" }}>te recomienda Clinera</span>
            </h1>
            {partner.role ? (
              <p style={{ margin: "8px 0 0", fontSize: 13 }}>{partner.role}</p>
            ) : null}
            <blockquote className="partner-quote" style={{ marginTop: 12 }}>
              “{partner.intro}”
            </blockquote>
            <WhatsAppCta partner={partner} href={whatsappUrl} className="partner-cta-full" />
          </section>

          <PartnerCnnVideo />

          <section className="partner-card">
            <div className="partner-eyebrow">Qué hace Clinera</div>
            <h2 className="partner-section-title" style={{ marginTop: 8 }}>
              Agenda, ficha y cobros en un solo sistema
            </h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {FEATURES.map((item) => (
                <li key={item.n} className="partner-feature">
                  <span className="partner-feature-n" aria-hidden="true">
                    {item.n}
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="partner-card">
            <div className="partner-pills">
              {PROOF.map((item) => (
                <span key={item.label} className="partner-pill" data-stat={item.stat}>
                  {item.label}
                </span>
              ))}
            </div>
          </section>

          <section className="partner-card">
            <h2 className="partner-section-title">Preguntas cortas</h2>
            <PartnerFaq partner={partner} />
          </section>

          <section className="partner-card partner-close">
            <h2 className="partner-section-title">
              {partner.name} te lo recomienda. Conversa con {partner.sales.name}.
            </h2>
            <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.55 }}>
              En quince minutos ves si Clinera calza con tu clínica. Sin compromiso de
              contratar.
            </p>
            <WhatsAppCta partner={partner} href={whatsappUrl} className="partner-cta-full" />
          </section>
        </div>
      </main>

      <PartnerFooter />
      <PartnerStickyCta partner={partner} href={whatsappUrl} />
    </div>
  );
}
