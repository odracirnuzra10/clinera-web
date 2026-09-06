"use client";

import Link from "next/link";
import { CtaPrimary, CtaSecondary, Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { ConvenioDoctoresWizard } from "@/components/partners/ConvenioDoctoresWizard";
import {
  CONVENIO_DOCTORES_POSTULA_ID,
  PARTNERS_DOCTORS_CONVENIO,
} from "@/content/partners-program";
import { CONVENIO_DOCTORES_PAGE } from "@/content/convenio-doctores-page";

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

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
} as const;

export default function ConvenioDoctoresLanding() {
  return (
    <>
      <Hero />
      <QueEs />
      <TresCol pageKey="paraQuien" bg="#FAFAFA" />
      <TresCol pageKey="incluye" bg="#fff" />
      <Pasos />
      <TresCol pageKey="noEs" bg="#FAFAFA" />
      <Faq />
      <Postula />
      <style jsx global>{`
        @media (max-width: 720px) {
          .convenio-section { padding-left: 28px !important; padding-right: 28px !important; }
          .convenio-paso { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function GradText({ children }: { children: string }) {
  return (
    <span
      style={{
        background: GRAD,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}

function Hero() {
  const { hero } = CONVENIO_DOCTORES_PAGE;
  return (
    <section
      className="convenio-section"
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
        <Eyebrow style={{ color: VIOLET }}>{hero.eyebrow}</Eyebrow>
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
          {hero.h1Before} <GradText>{hero.h1Accent}</GradText>
        </h1>
        <p
          style={{
            ...leadStyle,
            fontSize: 18,
            maxWidth: 640,
            marginBottom: 32,
          }}
        >
          {hero.lead}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <CtaPrimary as="a" href={`#${CONVENIO_DOCTORES_POSTULA_ID}`}>
            {hero.cta} <span style={{ marginLeft: 2 }}>→</span>
          </CtaPrimary>
          <CtaSecondary as={Link} href={hero.ctaSecondaryHref}>
            {hero.ctaSecondary}
          </CtaSecondary>
        </div>
      </div>
    </section>
  );
}

function QueEs() {
  const { queEs } = CONVENIO_DOCTORES_PAGE;
  return (
    <section className="convenio-section" style={{ ...sectionPad, background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow style={{ color: VIOLET }}>{queEs.eyebrow}</Eyebrow>
        <h2 style={{ ...h2Style, maxWidth: 780 }}>
          {queEs.h2Before} <GradText>{queEs.h2Accent}</GradText>
        </h2>
        <p style={{ ...leadStyle, maxWidth: 680, marginBottom: 0 }}>{queEs.lead}</p>
      </div>
    </section>
  );
}

function TresCol({
  pageKey,
  bg,
}: {
  pageKey: "paraQuien" | "incluye" | "noEs";
  bg: string;
}) {
  const block = CONVENIO_DOCTORES_PAGE[pageKey];
  return (
    <section
      className="convenio-section"
      style={{
        ...sectionPad,
        background: bg,
        borderTop: bg === "#FAFAFA" ? "1px solid #F0F0F0" : undefined,
        borderBottom: bg === "#FAFAFA" ? "1px solid #F0F0F0" : undefined,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow style={{ color: VIOLET }}>{block.eyebrow}</Eyebrow>
        <h2 style={{ ...h2Style, maxWidth: 780 }}>
          {block.h2Before} <GradText>{block.h2Accent}</GradText>
        </h2>
        <div style={cardGrid}>
          {block.items.map((item) => (
            <article
              key={item.title}
              style={{
                background: bg === "#FAFAFA" ? "#fff" : "#FAFAFA",
                border: "1px solid #F0F0F0",
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
                  color: "#0A0A0A",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 14.5,
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

function Pasos() {
  const { pasos } = CONVENIO_DOCTORES_PAGE;
  return (
    <section className="convenio-section" style={{ ...sectionPad, background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow style={{ color: VIOLET }}>{pasos.eyebrow}</Eyebrow>
        <h2 style={{ ...h2Style, maxWidth: 780 }}>
          {pasos.h2Before} <GradText>{pasos.h2Accent}</GradText>
        </h2>
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: 16,
          }}
        >
          {pasos.items.map((item) => (
            <li
              key={item.n}
              className="convenio-paso"
              style={{
                display: "grid",
                gridTemplateColumns: "88px 1fr",
                gap: 16,
                alignItems: "start",
                border: "1px solid #F0F0F0",
                borderRadius: 16,
                padding: "24px 22px",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: VIOLET,
                }}
              >
                {item.n}
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: "Inter",
                    fontSize: 20,
                    fontWeight: 700,
                    margin: "0 0 6px",
                    color: "#0A0A0A",
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
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq() {
  const { faq } = CONVENIO_DOCTORES_PAGE;
  return (
    <section className="convenio-section" style={{ ...sectionPad, background: "#fff" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Eyebrow style={{ color: VIOLET }}>Preguntas</Eyebrow>
        <h2 style={h2Style}>Antes de postular.</h2>
        <dl style={{ margin: 0 }}>
          {faq.map((item) => (
            <div
              key={item.q}
              style={{
                borderTop: "1px solid #F0F0F0",
                padding: "22px 0",
              }}
            >
              <dt
                style={{
                  fontFamily: "Inter",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0A0A0A",
                  margin: "0 0 8px",
                }}
              >
                {item.q}
              </dt>
              <dd
                style={{
                  fontFamily: "Inter",
                  fontSize: 15,
                  color: "#4B5563",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Postula() {
  const { postula, partnersNote } = CONVENIO_DOCTORES_PAGE;
  return (
    <section
      id={CONVENIO_DOCTORES_POSTULA_ID}
      className="convenio-section"
      style={{
        ...sectionPad,
        background: "#0A0A0A",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow style={{ color: "#C4B5FD" }}>{postula.eyebrow}</Eyebrow>
        <h2 style={{ ...h2Style, color: "#fff", maxWidth: 780 }}>
          {postula.h2Before} <GradText>{postula.h2Accent}</GradText>
        </h2>
        <p style={{ ...leadStyle, color: "rgba(255,255,255,.72)", maxWidth: 640 }}>
          {postula.lead}
        </p>
        <ConvenioDoctoresWizard
          hashes={[CONVENIO_DOCTORES_POSTULA_ID, PARTNERS_DOCTORS_CONVENIO.id]}
        />
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 14,
            color: "rgba(255,255,255,.55)",
            margin: "28px 0 0",
          }}
        >
          {partnersNote.before}{" "}
          <Link
            href={partnersNote.href}
            style={{ color: "#C4B5FD", textDecoration: "underline" }}
          >
            {partnersNote.link}
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
