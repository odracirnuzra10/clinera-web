"use client";

import Image from "next/image";
import Link from "next/link";
import { CtaPrimary, CtaSecondary, Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { ClineraOsDiagram } from "@/components/clinera-os/ClineraOsDiagram";
import { CONVENIO_DOCTORES_POSTULA_ID } from "@/content/partners-program";
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

export default function ConvenioDoctoresLanding() {
  return (
    <>
      <Hero />
      <Beneficios />
      <Requisitos />
      <Os />
      <style jsx global>{`
        @media (max-width: 720px) {
          .convenio-section { padding-left: 28px !important; padding-right: 28px !important; }
        }
        @media (max-width: 960px) {
          .convenio-requisitos { grid-template-columns: 1fr !important; }
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
            marginBottom: 16,
          }}
        >
          {hero.lead}
        </p>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 15,
            color: "#6B7280",
            lineHeight: 1.55,
            maxWidth: 640,
            margin: "0 0 32px",
          }}
        >
          {hero.vsPartner}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <CtaPrimary as="a" href={hero.ctaHref}>
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

function Beneficios() {
  const { beneficios } = CONVENIO_DOCTORES_PAGE;
  return (
    <section className="convenio-section" style={{ ...sectionPad, background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow style={{ color: VIOLET }}>{beneficios.eyebrow}</Eyebrow>
        <h2 style={{ ...h2Style, maxWidth: 780 }}>
          {beneficios.h2Before} <GradText>{beneficios.h2Accent}</GradText>
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {beneficios.items.map((item) => (
            <article
              key={item.title}
              style={{
                background: "#FAFAFA",
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

function Requisitos() {
  const { requisitos, partnersNote } = CONVENIO_DOCTORES_PAGE;
  return (
    <section
      id={requisitos.id}
      className="convenio-section"
      style={{ ...sectionPad, background: "#0A0A0A", color: "#fff" }}
    >
      <span id={CONVENIO_DOCTORES_POSTULA_ID} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow style={{ color: "#C4B5FD" }}>{requisitos.eyebrow}</Eyebrow>
        <h2 style={{ ...h2Style, color: "#fff", maxWidth: 780 }}>
          {requisitos.h2Before} <GradText>{requisitos.h2Accent}</GradText>
        </h2>
        <p style={{ ...leadStyle, color: "rgba(255,255,255,.72)", maxWidth: 640 }}>
          {requisitos.lead}
        </p>
        <div
          className="convenio-requisitos"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)",
            gap: 32,
            alignItems: "start",
          }}
        >
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 16 }}>
            {requisitos.items.map((item, i) => (
              <li
                key={item.title}
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 16,
                  padding: "22px 20px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#C4B5FD",
                    marginBottom: 8,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3
                  style={{
                    fontFamily: "Inter",
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    margin: "0 0 6px",
                    color: "#fff",
                  }}
                >
                  {item.title}
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
                  {item.desc}
                </p>
              </li>
            ))}
          </ol>
          <figure style={{ margin: 0 }}>
            <Image
              src={requisitos.bioExample.src}
              alt={requisitos.bioExample.alt}
              width={requisitos.bioExample.width}
              height={requisitos.bioExample.height}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,.12)",
              }}
            />
            <figcaption
              style={{
                fontFamily: "Inter",
                fontSize: 13,
                color: "rgba(255,255,255,.55)",
                marginTop: 12,
                lineHeight: 1.5,
              }}
            >
              {requisitos.bioExample.caption}
            </figcaption>
          </figure>
        </div>
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

function Os() {
  return (
    <section
      className="convenio-section"
      style={{
        ...sectionPad,
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <ClineraOsDiagram heading={true} />
      </div>
    </section>
  );
}
