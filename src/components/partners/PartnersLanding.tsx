"use client";

import Link from "next/link";
import { CtaPrimary, CtaSecondary, Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import {
  PARTNERS_COMPENSATION,
  PARTNERS_CTA_HREF,
  PARTNERS_FAQ,
  PARTNERS_FINAL_CTA,
  PARTNERS_FUNCTIONS,
  PARTNERS_HERO,
  PARTNERS_PRESENTATION_HREF,
  PARTNERS_PRODUCT,
  PARTNERS_STATS,
  PARTNERS_SUPPORT,
} from "@/content/partners-program";

const VIOLET = "#7C3AED";

export default function PartnersLanding() {
  return (
    <>
      <Hero />
      <Functions />
      <Compensation />
      <Support />
      <Product />
      <FaqPartners />
      <FinalCTA />
      <style jsx global>{`
        @media (max-width: 720px) {
          .partners-section { padding-left: 28px !important; padding-right: 28px !important; }
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
            margin: "0 0 32px",
            maxWidth: 720,
          }}
        >
          {PARTNERS_HERO.lead}
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

function Functions() {
  return (
    <section
      className="partners-section"
      style={{
        padding: "96px 80px",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>Qué hace un partner</Eyebrow>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(28px, 3.6vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "14px 0 12px",
            color: "#0A0A0A",
            maxWidth: 760,
          }}
        >
          Cuatro formas de mover Clinera. Ninguna exige que vendas tú.
        </h2>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 16,
            color: "#4B5563",
            lineHeight: 1.6,
            margin: "0 0 40px",
            maxWidth: 640,
          }}
        >
          Abres la conversación. El equipo de ventas de Clinera toma el cierre.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
          }}
        >
          {PARTNERS_FUNCTIONS.map((it) => (
            <div
              key={it.num}
              style={{
                background: "#FAFAFA",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: "22px 22px 24px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  color: VIOLET,
                  marginBottom: 14,
                }}
              >
                · {it.num}
              </div>
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  color: "#0A0A0A",
                  margin: "0 0 10px",
                  lineHeight: 1.25,
                }}
              >
                {it.title}
              </h3>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 13.5,
                  color: "#6B7280",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Compensation() {
  return (
    <section
      className="partners-section"
      style={{
        padding: "96px 80px",
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow style={{ color: VIOLET }}>{PARTNERS_COMPENSATION.eyebrow}</Eyebrow>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(28px, 3.6vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "14px 0 12px",
            color: "#0A0A0A",
            maxWidth: 780,
          }}
        >
          {PARTNERS_COMPENSATION.h2}
        </h2>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 16,
            color: "#4B5563",
            lineHeight: 1.6,
            margin: "0 0 40px",
            maxWidth: 660,
          }}
        >
          {PARTNERS_COMPENSATION.lead}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {PARTNERS_COMPENSATION.items.map((it) => (
            <BenefitCard
              key={it.num}
              num={it.num}
              title={it.title}
              unit={it.unit}
              desc={it.desc}
              featured={it.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  num,
  title,
  unit,
  desc,
  featured,
}: {
  num: string;
  title: string;
  unit: string;
  desc: string;
  featured?: boolean;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: featured ? "1px solid rgba(124,58,237,.4)" : "1px solid #E5E7EB",
        borderRadius: 16,
        padding: "26px 24px 22px",
        boxShadow: featured
          ? "0 22px 60px -22px rgba(124,58,237,.22)"
          : "0 4px 24px rgba(0,0,0,.03)",
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.14em",
          color: featured ? VIOLET : "#9CA3AF",
          marginBottom: 18,
        }}
      >
        · {num} · Condición
      </div>
      <h3
        style={{
          fontFamily: "Inter",
          fontSize: "clamp(28px, 3.2vw, 40px)",
          fontWeight: 800,
          letterSpacing: "-0.035em",
          lineHeight: 1,
          margin: "0 0 14px",
          background: GRAD,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {title}
        {unit && (
          <span
            style={{
              fontSize: "0.55em",
              fontWeight: 700,
              color: "#0A0A0A",
              WebkitTextFillColor: "#0A0A0A",
              background: "none",
            }}
          >
            {unit}
          </span>
        )}
      </h3>
      <p
        style={{
          fontFamily: "Inter",
          fontSize: 13.5,
          color: "#6B7280",
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function Support() {
  return (
    <section
      className="partners-section"
      style={{
        padding: "96px 80px",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow style={{ color: VIOLET }}>{PARTNERS_SUPPORT.eyebrow}</Eyebrow>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(28px, 3.6vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "14px 0 12px",
            color: "#0A0A0A",
            maxWidth: 800,
          }}
        >
          {PARTNERS_SUPPORT.h2}
        </h2>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 16,
            color: "#4B5563",
            lineHeight: 1.6,
            margin: "0 0 40px",
            maxWidth: 680,
          }}
        >
          {PARTNERS_SUPPORT.lead}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {PARTNERS_SUPPORT.points.map((p) => (
            <div
              key={p.title}
              style={{
                background: "#FAFAFA",
                border: "1px solid #E5E7EB",
                borderRadius: 16,
                padding: "26px 24px",
              }}
            >
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                  margin: "0 0 10px",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 14.5,
                  color: "#4B5563",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Product() {
  return (
    <section
      className="partners-section"
      style={{
        padding: "96px 80px",
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>{PARTNERS_PRODUCT.eyebrow}</Eyebrow>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(28px, 3.6vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "14px 0 12px",
            color: "#0A0A0A",
            maxWidth: 760,
          }}
        >
          {PARTNERS_PRODUCT.h2}
        </h2>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 16,
            color: "#4B5563",
            lineHeight: 1.6,
            margin: "0 0 40px",
            maxWidth: 680,
          }}
        >
          {PARTNERS_PRODUCT.lead}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
          }}
        >
          {PARTNERS_PRODUCT.items.map((it) => (
            <div
              key={it.num}
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: "22px 22px 24px",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  color: VIOLET,
                  marginBottom: 14,
                }}
              >
                · {it.num}
              </div>
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  color: "#0A0A0A",
                  margin: "0 0 10px",
                  lineHeight: 1.25,
                }}
              >
                {it.title}
              </h3>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 13.5,
                  color: "#6B7280",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqPartners() {
  return (
    <section
      className="partners-section"
      style={{
        padding: "96px 80px",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Eyebrow>Preguntas frecuentes</Eyebrow>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(28px, 3.6vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "14px 0 40px",
            color: "#0A0A0A",
          }}
        >
          Lo que preguntan antes de entrar.
        </h2>
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
              maxWidth: 600,
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
