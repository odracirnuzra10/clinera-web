"use client";

import Link from "next/link";
import { CtaPrimary, CtaSecondary, Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { ConvenioDoctoresWizard } from "@/components/partners/ConvenioDoctoresWizard";
import { PartnerApplySection } from "@/components/partners/PartnerApplyForm";
import { ClineraOsDiagram } from "@/components/clinera-os/ClineraOsDiagram";
import {
  PARTNERS_BENEFITS,
  PARTNERS_CTA_HREF,
  PARTNERS_DOCTORS_CONVENIO,
  PARTNERS_FAQ,
  PARTNERS_FINAL_CTA,
  PARTNERS_HERO,
  PARTNERS_PRESENTATION_HREF,
  PARTNERS_REQUIREMENTS,
  PARTNERS_STATS,
  PARTNERS_SUPPORT,
  PARTNERS_VS_DOCTORES,
} from "@/content/partners-program";

const VIOLET = "#7C3AED";

const sectionPad = {
  padding: "96px 80px",
} as const;

const h2Style = {
  fontFamily: "Inter",
  fontSize: "clamp(28px, 3.6vw, 44px)",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  lineHeight: 1.08,
  margin: "14px 0 12px",
  color: "#0A0A0A",
} as const;

const leadStyle = {
  fontFamily: "Inter",
  fontSize: 16,
  color: "#4B5563",
  lineHeight: 1.6,
  margin: "0 0 40px",
} as const;

export default function PartnersLanding() {
  return (
    <>
      <Hero />
      <Deal />
      <Support />
      <PartnerApplySection />
      <ConvenioDoctores />
      <OsDiagram />
      <FaqPartners />
      <FinalCTA />
      <style jsx global>{`
        @media (max-width: 720px) {
          .partners-section { padding-left: 28px !important; padding-right: 28px !important; }
        }
        @media (max-width: 960px) {
          .partners-deal { grid-template-columns: 1fr !important; }
          .partners-bonuses { grid-template-columns: 1fr !important; }
          .partners-support { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function Hero() {
  return (
    <section
      className="partners-section"
      style={{
        padding: "120px 80px 80px",
        background: "#FAFAFA",
        borderBottom: "1px solid #F0F0F0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 60% at 80% 20%, rgba(217,70,239,.08), transparent 60%), radial-gradient(ellipse 50% 50% at 10% 80%, rgba(59,130,246,.06), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <Eyebrow style={{ color: VIOLET }}>{PARTNERS_HERO.eyebrow}</Eyebrow>
        <h1
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.04,
            margin: "16px 0 18px",
            color: "#0A0A0A",
            maxWidth: 920,
          }}
        >
          {PARTNERS_HERO.h1Before}{" "}
          <span
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {PARTNERS_HERO.h1Accent}
          </span>
        </h1>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(15px, 1.2vw, 18px)",
            color: "#4B5563",
            lineHeight: 1.6,
            margin: "0 0 16px",
            maxWidth: 640,
          }}
        >
          {PARTNERS_HERO.lead}
        </p>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 15,
            color: "#6B7280",
            lineHeight: 1.55,
            margin: "0 0 32px",
            maxWidth: 640,
          }}
        >
          {PARTNERS_VS_DOCTORES.before}{" "}
          <Link href={PARTNERS_VS_DOCTORES.href} style={{ color: VIOLET, fontWeight: 600 }}>
            {PARTNERS_VS_DOCTORES.link}
          </Link>
          .
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <CtaPrimary
            as={Link}
            href={PARTNERS_CTA_HREF}
            style={{ padding: "14px 22px", fontSize: 15 }}
          >
            {PARTNERS_HERO.cta} <span style={{ marginLeft: 2 }}>→</span>
          </CtaPrimary>
          <CtaSecondary
            as={Link}
            href={PARTNERS_PRESENTATION_HREF}
            style={{ padding: "14px 22px", fontSize: 15 }}
          >
            {PARTNERS_HERO.ctaSecondary}
          </CtaSecondary>
        </div>

        <div
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 24,
            paddingTop: 36,
            borderTop: "1px solid #E5E7EB",
          }}
        >
          {PARTNERS_STATS.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#9CA3AF",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Inter",
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          color: "#0A0A0A",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Deal() {
  return (
    <section
      className="partners-section"
      style={{
        ...sectionPad,
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>El acuerdo</Eyebrow>
        <h2 style={{ ...h2Style, maxWidth: 760 }}>
          Lo que cobras. Lo que pedimos. Sin descuento al referido.
        </h2>
        <p style={{ ...leadStyle, maxWidth: 640 }}>
          Bono único al cierre según el plan que contrate la clínica. Sin pago
          mensual al partner y sin descuento adicional para el referido.
        </p>

        <div
          className="partners-bonuses"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
            marginBottom: 18,
          }}
        >
          {PARTNERS_BENEFITS.map((item) => (
            <article
              key={item.kicker}
              style={{
                background: "#fff",
                border: item.featured
                  ? "1px solid rgba(124,58,237,.4)"
                  : "1px solid #E5E7EB",
                borderRadius: 16,
                padding: "28px 26px",
                boxShadow: item.featured
                  ? "0 22px 60px -22px rgba(124,58,237,.22)"
                  : "none",
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: VIOLET,
                  margin: "0 0 10px",
                }}
              >
                {item.kicker}
              </p>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: "clamp(36px, 4.5vw, 52px)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  margin: "0 0 12px",
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {item.title}
              </p>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0A0A0A",
                  margin: "0 0 12px",
                }}
              >
                {item.subtitle}
              </p>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 14,
                  color: "#6B7280",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </article>
          ))}
        </div>

        <article
          className="partners-deal"
          style={{
            background: "#FAFAFA",
            border: "1px solid #E5E7EB",
            borderRadius: 16,
            padding: "28px 26px",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 10.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: VIOLET,
              margin: "0 0 10px",
            }}
          >
            Requisitos
          </p>
          <h3
            style={{
              fontFamily: "Inter",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#0A0A0A",
              margin: "0 0 22px",
            }}
          >
            Para entrar al programa
          </h3>
          <ol
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 18,
            }}
            className="partners-deal"
          >
            {PARTNERS_REQUIREMENTS.map((item) => (
              <li key={item.num} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    color: VIOLET,
                    paddingTop: 3,
                    flexShrink: 0,
                  }}
                >
                  {item.num}
                </span>
                <div>
                  <h4
                    style={{
                      fontFamily: "Inter",
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: "-0.015em",
                      color: "#0A0A0A",
                      margin: "0 0 4px",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: "Inter",
                      fontSize: 14,
                      color: "#6B7280",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}

function Support() {
  return (
    <section
      className="partners-section"
      style={{
        ...sectionPad,
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>Apoyo</Eyebrow>
        <h2 style={{ ...h2Style, maxWidth: 720 }}>
          No cieras solo. Clinera te acompaña.
        </h2>
        <p style={{ ...leadStyle, maxWidth: 560 }}>
          El equipo comercial te ayuda a cerrar y tenés el CRM para seguir cada
          referido.
        </p>
        <div
          className="partners-support"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
          }}
        >
          {PARTNERS_SUPPORT.map((item) => (
            <article
              key={item.num}
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 16,
                padding: "28px 26px",
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: VIOLET,
                  margin: "0 0 10px",
                }}
              >
                {item.num}
              </p>
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                  margin: "0 0 10px",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 15,
                  color: "#6B7280",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConvenioDoctores() {
  const offer = PARTNERS_DOCTORS_CONVENIO;
  return (
    <section
      id={offer.id}
      className="partners-section"
      style={{
        ...sectionPad,
        background: "#0A0A0A",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow style={{ color: "#C4B5FD" }}>{offer.eyebrow}</Eyebrow>
        <h2 style={{ ...h2Style, color: "#fff", maxWidth: 780 }}>
          {offer.h2Before}{" "}
          <span
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {offer.h2Accent}
          </span>
        </h2>
        <p style={{ ...leadStyle, color: "rgba(255,255,255,.72)", maxWidth: 640, marginBottom: 12 }}>
          {offer.lead}
        </p>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 15,
            color: "rgba(255,255,255,.55)",
            lineHeight: 1.55,
            maxWidth: 640,
            margin: "0 0 32px",
          }}
        >
          {offer.vsPartner}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {offer.points.map((point) => (
            <article
              key={point.title}
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 16,
                padding: "24px 22px",
              }}
            >
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  margin: "0 0 8px",
                  color: "#fff",
                }}
              >
                {point.title}
              </h3>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 14.5,
                  color: "rgba(255,255,255,.68)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {point.desc}
              </p>
            </article>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <ConvenioDoctoresWizard />
          <CtaSecondary
            as={Link}
            href={offer.detalleHref}
            style={{
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,.22)",
            }}
          >
            {offer.detalleCta} →
          </CtaSecondary>
        </div>
      </div>
    </section>
  );
}

function OsDiagram() {
  return (
    <section
      className="partners-section"
      style={{
        ...sectionPad,
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <ClineraOsDiagram />
      </div>
    </section>
  );
}

function FaqPartners() {
  return (
    <section
      className="partners-section"
      style={{
        ...sectionPad,
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Eyebrow>Preguntas</Eyebrow>
        <h2 style={{ ...h2Style, marginBottom: 32 }}>En corto</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PARTNERS_FAQ.map((f) => (
            <details
              key={f.q}
              style={{
                background: "#FAFAFA",
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                padding: "16px 20px",
              }}
            >
              <summary
                style={{
                  fontFamily: "Inter",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0A0A0A",
                  cursor: "pointer",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.4,
                }}
              >
                {f.q}
              </summary>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 14.5,
                  color: "#4B5563",
                  lineHeight: 1.6,
                  margin: "12px 0 0",
                }}
              >
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      className="partners-section"
      style={{
        padding: "96px 80px 120px",
        background: "#0A0A0A",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-80px -80px auto -80px",
            height: 240,
            background:
              "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(124,58,237,.35), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#A5A5B0",
              marginBottom: 18,
            }}
          >
            · {PARTNERS_FINAL_CTA.kicker}
          </div>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.04,
              margin: "0 0 18px",
              color: "#fff",
              maxWidth: 820,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {PARTNERS_FINAL_CTA.h2Before}{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, #60A5FA, #C084FC 55%, #F0ABFC)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {PARTNERS_FINAL_CTA.h2Accent}
            </span>
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: "clamp(15px, 1.2vw, 17px)",
              color: "#9CA3AF",
              lineHeight: 1.6,
              margin: "0 auto 32px",
              maxWidth: 520,
            }}
          >
            {PARTNERS_FINAL_CTA.lead}
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <CtaPrimary
              as={Link}
              href={PARTNERS_CTA_HREF}
              style={{ padding: "14px 22px", fontSize: 15 }}
            >
              {PARTNERS_FINAL_CTA.cta} <span style={{ marginLeft: 2 }}>→</span>
            </CtaPrimary>
            <CtaSecondary
              as={Link}
              href={PARTNERS_PRESENTATION_HREF}
              style={{
                padding: "14px 22px",
                fontSize: 15,
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.15)",
              }}
            >
              {PARTNERS_FINAL_CTA.ctaSecondary}
            </CtaSecondary>
          </div>
        </div>
      </div>
    </section>
  );
}
