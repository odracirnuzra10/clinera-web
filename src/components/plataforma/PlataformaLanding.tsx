"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  CnnLogo,
  CtaPrimary,
  CtaSecondary,
  GRAD,
  Mono,
  Wordmark,
} from "@/components/brand-v3/Brand";
import EcosistemaDiagram from "@/components/plataforma/EcosistemaDiagram";

/* ============================================================
   /plataforma — Landing de lectura previa al wizard (/ventas).
   Rediseño v5 "enterprise": restraint cromático (blanco + near-
   black, violeta quirúrgico), marcador de segmento repetido
   (clínicas medianas y grandes · 2+ sedes o alto volumen),
   franjas institucionales (partners, tamaños de operación,
   seguridad Ley 20.584) y ritmo vertical de 150-160px.
   Sistema del repo: brand-v3, Inter + JetBrains Mono.
   ============================================================ */

const ACCENT = "#7C3AED";
const DARK = "#0A0A0F"; // negro del patrón enterprise de la home (DarkBreak)
const HAIR = "#F1EFEC"; // hairline claro entre secciones

const MONO_STACK = "'JetBrains Mono', ui-monospace, monospace";

// Retícula estructural light (eco del patrón DarkBreak) — textura sin color.
function gridLight(maskAt: "top" | "bottom"): CSSProperties {
  const mask =
    maskAt === "top"
      ? "radial-gradient(ellipse 75% 60% at 50% 0%, #000 30%, transparent 78%)"
      : "radial-gradient(ellipse 75% 60% at 50% 100%, #000 30%, transparent 78%)";
  return {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(10,10,10,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.03) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    maskImage: mask,
    WebkitMaskImage: mask,
    pointerEvents: "none",
    zIndex: 0,
  };
}

const STATS: { n: string; l: string }[] = [
  { n: "+52", l: "clínicas activas" },
  { n: "+500", l: "profesionales coordinados" },
  { n: "10", l: "países en LATAM" },
  { n: "24/7", l: "operación con IA" },
];

// Intro de sección centrada y numerada — unidad de jerarquía de la página.
function SectionIntro({
  num,
  eyebrow,
  title,
  sub,
  dark = false,
}: {
  num: string;
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  dark?: boolean;
}) {
  const numColor = dark ? "#A78BFA" : ACCENT;
  const eyeColor = dark ? "rgba(255,255,255,0.5)" : "#9AA0AE";
  const line = dark ? "rgba(255,255,255,0.2)" : "#D8DBE2";
  const titleColor = dark ? "#fff" : "#0A0A0A";
  const subColor = dark ? "rgba(255,255,255,0.6)" : "#4B5563";
  return (
    <div className="reveal" style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 26,
          fontFamily: MONO_STACK,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: numColor, fontWeight: 600 }}>{num}</span>
        <span style={{ width: 24, height: 1, background: line }} />
        <span style={{ color: eyeColor }}>{eyebrow}</span>
      </div>
      <h2
        className="plt-h2"
        style={{
          fontFamily: "Inter",
          fontSize: 46,
          fontWeight: 700,
          letterSpacing: "-0.033em",
          lineHeight: 1.08,
          color: titleColor,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p style={{ fontFamily: "Inter", fontSize: 19, lineHeight: 1.55, color: subColor, margin: "22px auto 0", maxWidth: 600 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function PlataformaLanding() {
  // Nota de atribución: gclid/fbclid se capturan y persisten globalmente en el
  // primer pageview (GclidCapture, montado en layout) → cookie .clinera.io + storage.
  // El wizard /ventas lee esa atribución desde storage; basta con links planos.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const t = window.setTimeout(
      () => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in")),
      1200,
    );
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.in {
          opacity: 1;
          transform: none;
        }
        @keyframes pltPulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
          70% { box-shadow: 0 0 0 9px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .plt-dot { animation: pltPulse 2.2s infinite; }
        @keyframes pltMsgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        .plt-msg { animation: pltMsgIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes pltBlink {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
        .plt-typing i {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: rgba(196, 181, 253, 0.9);
          margin: 0 2px;
          animation: pltBlink 1.2s infinite;
        }
        .plt-typing i:nth-child(2) { animation-delay: 0.18s; }
        .plt-typing i:nth-child(3) { animation-delay: 0.36s; }
        @keyframes pltCur {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .plt-cur {
          display: inline-block;
          width: 2px;
          height: 17px;
          background: #0A0A0A;
          margin-left: 1px;
          vertical-align: -3px;
          animation: pltCur 1s steps(1) infinite;
        }
        .plt-cia-ans b { color: #fff; font-weight: 600; }
        @keyframes pltWave {
          0%, 100% { height: 5px; }
          50% { height: 17px; }
        }
        .plt-wave { display: inline-flex; align-items: center; gap: 3px; height: 20px; }
        .plt-wave i {
          display: inline-block;
          width: 3px;
          height: 6px;
          border-radius: 2px;
          background: #A78BFA;
          animation: pltWave 0.9s ease-in-out infinite;
        }
        .plt-wave i:nth-child(2) { animation-delay: 0.12s; }
        .plt-wave i:nth-child(3) { animation-delay: 0.24s; }
        .plt-wave i:nth-child(4) { animation-delay: 0.36s; }
        .plt-wave i:nth-child(5) { animation-delay: 0.48s; }
        .plt-wave i:nth-child(6) { animation-delay: 0.60s; }
        .plt-wave i:nth-child(7) { animation-delay: 0.72s; }
        /* Variante clara de la onda de voz (consola del hero, fondo blanco) */
        .plt-wave-light i { background: #7C3AED; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1 !important; transform: none !important; }
          .plt-dot, .plt-msg, .plt-typing i, .plt-wave i, .plt-cur { animation: none; }
          .plt-msg { opacity: 1; transform: none; }
        }
        @media (max-width: 900px) {
          .plt-cnn-grid { grid-template-columns: 1fr !important; padding: 28px 24px !important; }
          .plt-clientes-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .plt-canales-grid { grid-template-columns: 1fr !important; }
          .plt-seg-grid { grid-template-columns: 1fr !important; }
          .plt-sec-band { grid-template-columns: 1fr !important; }
          .plt-sec-chips { justify-content: flex-start !important; max-width: none !important; }
          .plt-cred { flex-direction: column !important; gap: 26px !important; text-align: center; }
          .plt-cred-sep { display: none !important; }
          /* Consola del hero: el consolidado y el agente se apilan */
          .plt-consola-grid { grid-template-columns: 1fr !important; }
          .plt-consola-red { border-right: none !important; border-bottom: 1px solid #F1EFEC; }
          /* Franja de respaldo: la etiqueta pasa arriba de cada fila */
          .plt-strip-row { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
        @media (max-width: 760px) {
          .plt-section { padding-left: 24px !important; padding-right: 24px !important; }
          .plt-header-inner { padding-left: 24px !important; padding-right: 24px !important; }
          .plt-seg-chip { display: none !important; }
          .plt-stats { grid-template-columns: 1fr 1fr !important; gap: 36px 12px !important; padding: 36px 24px !important; }
          .plt-stats > div { border-left: none !important; }
          .plt-h1 { font-size: 40px !important; }
          .plt-h2 { font-size: 30px !important; }
          .plt-section-pad { padding-top: 96px !important; padding-bottom: 96px !important; }
          .plt-consola-kpis { grid-template-columns: 1fr 1fr !important; }
          /* El hero cierra más pegado a la franja de respaldo en pantallas chicas */
          .plt-hero { padding-bottom: 64px !important; }
        }
        @media (max-width: 560px) {
          /* El input del chat no cabe con el selector de modelo: se oculta y
             el texto se alinea a la derecha mientras escribe para que la cola
             (y el cursor) queden siempre visibles. */
          .plt-cia-model { display: none !important; }
          .plt-cia-text { font-size: 14px !important; }
          .plt-cia-text.typing { text-align: right !important; }
        }
        @media (max-width: 460px) {
          .plt-cta-row { flex-direction: column; align-items: stretch; }
          .plt-cta-row > a { width: 100%; justify-content: center; }
          .plt-clientes-grid { grid-template-columns: repeat(2, 1fr) !important; }
          /* La URL simulada no cabe junto al badge de IA activa */
          .plt-consola-url { display: none !important; }
        }
        /* ---- Franja de respaldo: las dos filas tienen que terminar en el mismo
           borde. En flex los 4 badges cortan antes que los logos y la franja se
           ve descuadrada, así que abajo de 760px pasan a grilla: 2 columnas en
           teléfono (igual que los logos) y 4 en el tramo tablet. ---- */
        @media (max-width: 760px) {
          .plt-strip-badges { display: grid !important; gap: 10px !important; }
          .plt-strip-badges > img { width: 100% !important; height: auto !important; }
        }
        @media (max-width: 560px) {
          .plt-strip-badges { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .plt-clientes-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 561px) and (max-width: 760px) {
          .plt-strip-badges { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
        }
      `}</style>

      {/* ============== HEADER MÍNIMO — logo + segmento + CTA ============== */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <div
          className="plt-header-inner"
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "15px 80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Link href="/" aria-label="Clinera.io" style={{ textDecoration: "none" }}>
            <Wordmark size={20} />
          </Link>
          <span
            className="plt-seg-chip"
            style={{
              fontFamily: MONO_STACK,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6B7280",
              background: "#FAFAFA",
              border: "1px solid #E5E7EB",
              borderRadius: 999,
              padding: "6px 14px",
              whiteSpace: "nowrap",
            }}
          >
            Para clínicas medianas y grandes
          </span>
          <CtaPrimary as={Link} href="/ventas" style={{ padding: "10px 18px", fontSize: 14 }}>
            Ver si califico <span>→</span>
          </CtaPrimary>
        </div>
      </header>

      {/* ============== HERO (centrado, dominante) ============== */}
      <section className="plt-section plt-hero" style={{ position: "relative", padding: "88px 80px 110px", overflow: "hidden", background: "#fff" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 62% 44% at 50% -12%, #F4F2FA 0%, #FFFFFF 58%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div aria-hidden style={gridLight("top")} />
        <div style={{ maxWidth: 920, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <span
            className="reveal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontFamily: MONO_STACK,
              fontSize: 11.5,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#374151",
              background: "#fff",
              border: "1px solid #E5E7EB",
              padding: "8px 16px",
              borderRadius: 999,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              lineHeight: 1.6,
            }}
          >
            Para clínicas medianas y grandes · 2+ sedes o alto volumen
          </span>

          <h1
            className="plt-h1 reveal"
            style={{
              fontFamily: "Inter",
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              margin: "30px auto 0",
              color: "#0A0A0A",
              maxWidth: 880,
            }}
          >
            Una clínica que crece no se opera en cinco sistemas.{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              Se opera en uno solo, con IA.
            </span>
          </h1>

          <p
            className="reveal"
            style={{
              fontFamily: "Inter",
              fontSize: 20,
              lineHeight: 1.58,
              color: "#4B5563",
              margin: "28px auto 0",
              maxWidth: 640,
            }}
          >
            Clinera unifica agenda, WhatsApp, fichas, cobros y recuperación de pacientes de{" "}
            <b style={{ color: "#0A0A0A" }}>todas tus sedes</b> en una sola plataforma. Agentes de IA
            operan el día a día 24/7 y tú ves y controlas todo desde un solo lugar.
          </p>

          <div className="plt-cta-row reveal" style={{ display: "flex", gap: 12, marginTop: 38, justifyContent: "center", flexWrap: "wrap" }}>
            <CtaPrimary as={Link} href="/ventas" style={{ padding: "16px 30px", fontSize: 16 }}>
              Ver si tu clínica califica <span>→</span>
            </CtaPrimary>
            <CtaSecondary as={Link} href="#la-ia" style={{ padding: "16px 26px", fontSize: 16 }}>
              Ver la IA en acción
            </CtaSecondary>
          </div>

          <div className="reveal" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
            <div style={{ display: "flex" }}>
              {["CM", "TE", "SP", "JS"].map((ini, i) => (
                <div
                  key={ini}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    background: "#F3F4F6",
                    border: "2px solid #fff",
                    outline: "1px solid #E5E7EB",
                    marginLeft: i === 0 ? 0 : -9,
                    fontFamily: "Inter",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {ini}
                </div>
              ))}
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 14, color: "#4B5563" }}>
              <b style={{ color: "#0A0A0A" }}>+500 profesionales</b> coordinados en 10 países
            </div>
          </div>

          {/* Puente multi-sede */}
          <div className="reveal" style={{ marginTop: 72 }}>
            <Mono color="#9AA0AE" size={11}>Multi-sede por diseño</Mono>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#0A0A0A",
                marginTop: 10,
              }}
            >
              Opera 2, 5 o 20 sedes con la misma precisión que una.
            </div>
          </div>
        </div>

        {/* Consola de red — 3 sedes en vivo + el agente IA respondiendo por texto y voz */}
        <div style={{ maxWidth: 1120, margin: "40px auto 0", position: "relative", zIndex: 1 }}>
          <ConsolaRed />
        </div>
      </section>

      {/* ============== FRANJA DE RESPALDO — PARTNERS + CLIENTES ============== */}
      <RespaldoStrip />

      {/* ============== 01 · ECOSISTEMA ============== */}
      <section className="plt-section plt-section-pad" style={{ padding: "150px 80px", background: "#FBFBFA" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <SectionIntro
            num="01"
            eyebrow="Estandariza toda tu red"
            title="Unifica todas tus operaciones con IA."
            sub="Una sola fuente de verdad para tu equipo y todas tus sedes. Sin planillas paralelas, sin datos que no cuadran, sin herramientas que no se hablan entre sí."
          />

          <div className="reveal" style={{ marginTop: 76 }}>
            <EcosistemaDiagram />
            <div style={{ textAlign: "center", marginTop: 30 }}>
              <Mono color="#9AA0AE" size={11}>El mismo estándar de atención en cada sucursal</Mono>
            </div>
          </div>

          {/* Stat band */}
          <div
            className="plt-stats reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              marginTop: 76,
              padding: "48px 40px",
              background: "#fff",
              border: "1px solid #ECEAE6",
              borderRadius: 16,
            }}
          >
            {STATS.map((s, i) => (
              <div key={s.l} style={{ textAlign: "center", borderLeft: i > 0 ? "1px solid #EDEBE7" : "none" }}>
                <div
                  style={{
                    fontFamily: MONO_STACK,
                    fontSize: 44,
                    fontWeight: 600,
                    color: "#0A0A0A",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280", marginTop: 12 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ textAlign: "center", marginTop: 20 }}>
            <Mono color="#9AA0AE" size={11}>94% de confirmaciones automáticas · resultados sobre clínicas reales en producción</Mono>
          </div>
        </div>
      </section>

      {/* ============== SLIDE NEGRO — 02 chat + 03 canales ============== */}
      <section
        id="la-ia"
        className="plt-section plt-section-pad"
        style={{ position: "relative", background: DARK, padding: "160px 80px", overflow: "hidden", scrollMarginTop: 70 }}
      >
        {/* hairline superior con gradiente de marca */}
        <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: GRAD, opacity: 0.7 }} />
        {/* retícula estructural */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, #000 40%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, #000 40%, transparent 85%)",
            pointerEvents: "none",
          }}
        />
        {/* glows sobrios */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -200,
            right: -160,
            width: 560,
            height: 560,
            background: "radial-gradient(circle, rgba(217,70,239,0.16) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -220,
            left: -180,
            width: 560,
            height: 560,
            background: "radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* 02 — Inteligencia interna */}
          <SectionIntro
            num="02"
            eyebrow="Una sola IA · toda tu operación"
            title="Y le puedes preguntar lo que sea."
            sub="Como Clinera unifica todo, su IA conoce cada venta, cada hora y cada paciente de tus sedes. Pregúntale en español, como a un miembro más del equipo."
            dark
          />
          <ChatIA />
          <div className="reveal" style={{ textAlign: "center", marginTop: 22 }}>
            <Mono color="rgba(255,255,255,0.4)" size={10.5}>Datos consolidados de todas tus sedes, en tiempo real</Mono>
          </div>

          {/* 03 — Dos canales */}
          <div style={{ marginTop: 144 }}>
            <SectionIntro
              num="03"
              eyebrow="Una IA · dos canales"
              title="Una IA, 2 canales para atender a tus pacientes."
              sub="Tus pacientes eligen: por teléfono o por WhatsApp. La misma IA llama, confirma, reagenda y responde en ambos — sin que se te escape ninguno."
              dark
            />

            <div
              className="plt-canales-grid reveal"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 60, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}
            >
              {/* Canal 1 — Llamada de voz */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, padding: "26px 26px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.32)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 17z"/></svg>
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Inter", fontSize: 14.5, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>Llamada de voz</div>
                    <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>La IA llama y confirma</div>
                  </div>
                  <span style={{ fontFamily: MONO_STACK, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C4B5FD", background: "rgba(124,58,237,0.16)", border: "1px solid rgba(124,58,237,0.3)", padding: "3px 8px", borderRadius: 999 }}>AURA</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, marginBottom: 14 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 999, background: "rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>MR</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 600, color: "#fff" }}>Sra. Rojas</div>
                    <div style={{ fontFamily: MONO_STACK, fontSize: 11, color: "#34D399" }}>en llamada · 00:14</div>
                  </div>
                  <span className="plt-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontFamily: "Inter", fontSize: 13.5, lineHeight: 1.45, color: "rgba(255,255,255,0.9)" }}>
                    <span style={{ color: "#C4B5FD", fontWeight: 600 }}>IA:</span> «Hola, le confirmo su hora del martes 15:00 con la Dra. Vera.»
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: 13.5, lineHeight: 1.45, color: "rgba(255,255,255,0.6)" }}>
                    <span style={{ fontWeight: 600 }}>Paciente:</span> «Sí, ahí estaré.»
                  </div>
                </div>

                <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "#34D399" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  Cita confirmada por teléfono
                </div>
              </div>

              {/* Canal 2 — WhatsApp */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, padding: "26px 26px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(37,211,102,0.14)", border: "1px solid rgba(37,211,102,0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/></svg>
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Inter", fontSize: 14.5, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>WhatsApp</div>
                    <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>La IA responde y confirma</div>
                  </div>
                  <span style={{ fontFamily: MONO_STACK, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C4B5FD", background: "rgba(124,58,237,0.16)", border: "1px solid rgba(124,58,237,0.3)", padding: "3px 8px", borderRadius: 999 }}>AURA</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "6px 2px 2px" }}>
                  <div style={{ alignSelf: "flex-start", maxWidth: "88%", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.92)", fontFamily: "Inter", fontSize: 13, lineHeight: 1.4, padding: "9px 12px", borderRadius: 12, borderBottomLeftRadius: 3 }}>¿Le confirmo su hora de mañana a las 11:00?</div>
                  <div style={{ alignSelf: "flex-end", maxWidth: "80%", background: "rgba(37,211,102,0.16)", border: "1px solid rgba(37,211,102,0.28)", color: "#fff", fontFamily: "Inter", fontSize: 13, lineHeight: 1.4, padding: "9px 12px", borderRadius: 12, borderBottomRightRadius: 3 }}>Sí, gracias</div>
                  <div style={{ alignSelf: "flex-start", maxWidth: "88%", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.92)", fontFamily: "Inter", fontSize: 13, lineHeight: 1.4, padding: "9px 12px", borderRadius: 12, borderBottomLeftRadius: 3 }}>¡Listo! Quedó confirmada.</div>
                </div>

                <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "#34D399" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  Confirmada por WhatsApp
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== 04 · TAMAÑO DE OPERACIÓN ============== */}
      <SegmentoOperacion />

      {/* ============== SEGURIDAD / COMPLIANCE ============== */}
      <SeguridadBand />

      {/* ============== CONFIANZA — PRENSA CNN + CLIENTES ============== */}
      <PrensaConfianza />

      {/* ============== CTA FINAL ============== */}
      <section
        className="plt-section plt-section-pad"
        style={{ position: "relative", padding: "150px 80px 170px", overflow: "hidden", borderTop: `1px solid ${HAIR}`, background: "#fff" }}
      >
        <div aria-hidden style={gridLight("bottom")} />
        <div className="reveal" style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2
            className="plt-h2"
            style={{
              fontFamily: "Inter",
              fontSize: 54,
              fontWeight: 700,
              letterSpacing: "-0.038em",
              lineHeight: 1.05,
              color: "#0A0A0A",
              margin: 0,
            }}
          >
            Hablemos de{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              tu operación.
            </span>
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 19, lineHeight: 1.58, color: "#4B5563", margin: "24px auto 0", maxWidth: 580 }}>
            Si operas una clínica con equipo — o una red con varias sedes — en 30 minutos te mostramos
            cómo se vería unificada: con tus números y tus sedes, no una demo genérica.
          </p>

          <div className="plt-cta-row" style={{ display: "flex", gap: 12, marginTop: 38, justifyContent: "center", flexWrap: "wrap" }}>
            <CtaPrimary as={Link} href="/ventas" style={{ padding: "17px 36px", fontSize: 16 }}>
              Ver si califico <span>→</span>
            </CtaPrimary>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 30,
              fontFamily: MONO_STACK,
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#6B7280",
            }}
          >
            {["Desde USD 379/mes", "Sin permanencia", "Migración incluida", "WhatsApp Business API"].map((t, i) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                {i > 0 && <span style={{ color: "#D1D5DB" }}>·</span>}
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ============ Consola de red (hero) — 3 sedes en vivo + agente IA por texto y voz ============
   Una sola pieza responde a las dos preguntas del hero: "¿cómo veo todas mis
   sedes?" (consolidado central, izquierda) y "¿quién atiende?" (AURA por
   WhatsApp y por teléfono, derecha). Estética light de /plataforma: hairlines,
   mono para etiquetas y violeta como único acento.
   ============================================================================ */
const CONSOLA_KPIS: { l: string; v: string; d: string }[] = [
  { l: "Citas", v: "2.347", d: "+11,4%" },
  { l: "Ocupación", v: "83%", d: "+6 pts" },
  { l: "No-show", v: "6,1%", d: "−8,3 pts" },
  { l: "Recuperados", v: "184", d: "por IA" },
];

const CONSOLA_SEDES: { n: string; pct: number; c: string }[] = [
  { n: "Providencia", pct: 88, c: "#7C3AED" },
  { n: "Las Condes", pct: 81, c: "#3B82F6" },
  { n: "Viña del Mar", pct: 74, c: "#D946EF" },
];

function ConsolaRed() {
  return (
    <div
      className="reveal plt-consola"
      style={{
        background: "#fff",
        border: "1px solid #EAE8E4",
        borderRadius: 20,
        overflow: "hidden",
        textAlign: "left",
        boxShadow: "0 44px 96px -34px rgba(15,10,30,0.24), 0 8px 22px -12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Barra de navegador */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 16px",
          borderBottom: "1px solid #F1EFEC",
          background: "#FBFBFA",
        }}
      >
        <span style={{ display: "inline-flex", gap: 6, flexShrink: 0 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} aria-hidden style={{ width: 10, height: 10, borderRadius: 999, background: c }} />
          ))}
        </span>
        <span
          className="plt-consola-url"
          style={{
            flex: 1,
            fontFamily: MONO_STACK,
            fontSize: 12,
            color: "#6B7280",
            letterSpacing: "0.01em",
            background: "#fff",
            border: "1px solid #EFEDEA",
            borderRadius: 8,
            padding: "5px 12px",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          app.clinera.io / consolidado-red
        </span>
        <span
          className="plt-consola-live"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontFamily: MONO_STACK,
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#5B21B6",
            background: "#F5F3FF",
            border: "1px solid #DDD6FE",
            borderRadius: 999,
            padding: "4px 10px",
            flexShrink: 0,
          }}
        >
          <span className="plt-dot" aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: "#7C3AED", display: "inline-block" }} />
          IA activa
        </span>
      </div>

      <div
        className="plt-consola-grid"
        style={{ display: "grid", gridTemplateColumns: "1.22fr 0.98fr", alignItems: "stretch" }}
      >
        {/* ---------- Izquierda: consolidado de las 3 sedes ---------- */}
        <div className="plt-consola-red" style={{ padding: "24px 26px 22px", borderRight: "1px solid #F1EFEC" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontFamily: "Inter", fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: "#0A0A0A" }}>
              Consolidado de red
            </div>
            <Mono color="#9AA0AE" size={10.5}>3 sedes · este mes</Mono>
          </div>

          {/* KPIs de toda la red */}
          <div className="plt-consola-kpis" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#F1EFEC", border: "1px solid #F1EFEC", borderRadius: 12, overflow: "hidden", marginTop: 18 }}>
            {CONSOLA_KPIS.map((k) => (
              <div key={k.l} style={{ background: "#fff", padding: "13px 14px" }}>
                <Mono color="#9AA0AE" size={9.5}>{k.l}</Mono>
                <div style={{ fontFamily: "Inter", fontSize: 23, fontWeight: 700, letterSpacing: "-0.03em", color: "#0A0A0A", marginTop: 7, lineHeight: 1 }}>
                  {k.v}
                </div>
                <div style={{ fontFamily: MONO_STACK, fontSize: 10.5, color: ACCENT, marginTop: 6 }}>{k.d}</div>
              </div>
            ))}
          </div>

          {/* Ocupación por sucursal */}
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            {CONSOLA_SEDES.map((s) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span aria-hidden style={{ width: 8, height: 8, borderRadius: 3, background: s.c, flexShrink: 0 }} />
                <span style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#0A0A0A", flex: "0 0 116px", letterSpacing: "-0.01em" }}>
                  {s.n}
                </span>
                <span style={{ flex: 1, height: 6, borderRadius: 999, background: "#F1EFEC", overflow: "hidden", minWidth: 60 }}>
                  <span style={{ display: "block", width: `${s.pct}%`, height: "100%", borderRadius: 999, background: s.c }} />
                </span>
                <span style={{ fontFamily: MONO_STACK, fontSize: 12.5, color: "#374151", flexShrink: 0, minWidth: 34, textAlign: "right" }}>
                  {s.pct}%
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20, paddingTop: 14, borderTop: "1px solid #F1EFEC" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9AA0AE" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <Mono color="#9AA0AE" size={10}>Sincronizado hace 40 s · 3 sedes · 41 profesionales</Mono>
          </div>
        </div>

        {/* ---------- Derecha: el agente IA responde por texto y por voz ---------- */}
        <div style={{ padding: "24px 26px 22px", background: "#FCFCFB", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span
              aria-hidden
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: GRAD,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 16,
                flexShrink: 0,
                boxShadow: "0 8px 18px -8px rgba(124,58,237,.6)",
              }}
            >
              ✦
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontFamily: "Inter", fontSize: 15, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.015em", lineHeight: 1.2 }}>
                AURA
              </span>
              <span style={{ display: "block", fontFamily: "Inter", fontSize: 12.5, color: "#6B7280", marginTop: 1 }}>
                Atiende las 3 sedes · 24/7
              </span>
            </span>
          </div>

          {/* Canal 1 — texto (WhatsApp) */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z" />
              </svg>
              <Mono color="#6B7280" size={10}>Responde por texto</Mono>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ alignSelf: "flex-start", maxWidth: "92%", background: "#fff", border: "1px solid #EFEDEA", color: "#0A0A0A", fontFamily: "Inter", fontSize: 12.5, lineHeight: 1.45, padding: "8px 11px", borderRadius: 11, borderBottomLeftRadius: 3 }}>
                Hola, ¿tienen hora mañana en Las Condes?
              </div>
              <div style={{ alignSelf: "flex-end", maxWidth: "92%", background: "#E8FBF0", border: "1px solid #C6F0DA", color: "#0A0A0A", fontFamily: "Inter", fontSize: 12.5, lineHeight: 1.45, padding: "8px 11px", borderRadius: 11, borderBottomRightRadius: 3 }}>
                Sí: mañana 10:00 con la Dra. Meza. ¿Se la agendo?
              </div>
            </div>
          </div>

          {/* Canal 2 — voz (llamada) */}
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid #F1EFEC" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 17z" />
              </svg>
              <Mono color="#6B7280" size={10}>Y también por voz</Mono>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", background: "#fff", border: "1px solid #EFEDEA", borderRadius: 12 }}>
              <span style={{ width: 30, height: 30, borderRadius: 999, background: "#F5F3FF", border: "1px solid #EDE9FE", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", fontSize: 11, fontWeight: 700, color: "#5B21B6", flexShrink: 0 }}>
                MR
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "#0A0A0A", lineHeight: 1.2 }}>Sra. Rojas</span>
                <span style={{ display: "block", fontFamily: MONO_STACK, fontSize: 10.5, color: "#059669", marginTop: 2 }}>en llamada · 00:14</span>
              </span>
              <span className="plt-wave plt-wave-light" aria-hidden><i /><i /><i /><i /><i /><i /><i /></span>
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 12.5, lineHeight: 1.45, color: "#4B5563", marginTop: 10 }}>
              <span style={{ color: ACCENT, fontWeight: 600 }}>AURA:</span> «Le confirmo su hora del martes 15:00 en Providencia.»
            </div>
          </div>

          <div style={{ marginTop: "auto", paddingTop: 18, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 600, color: "#059669" }}>
              14 citas agendadas hoy, en las 3 sedes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ Franja única de respaldo — partners + clínicas + evidencia ============ */
const CLIENT_LOGOS: { src: string; alt: string; tile?: boolean }[] = [
  { src: "/presentacion/clientes/andes.png", alt: "Andes Salud" },
  { src: "/presentacion/clientes/everest.png", alt: "Everest Clínicas Dentales", tile: true },
  { src: "/presentacion/clientes/sanatorio.png", alt: "Sanatorio Alemán" },
  { src: "/presentacion/clientes/sonrie.png", alt: "Sonríe" },
  { src: "/presentacion/clientes/lumina.png", alt: "Lumina · Clínica Facial" },
  { src: "/presentacion/clientes/hebe.png", alt: "Método Hebe" },
];

const PARTNER_BADGES: { src: string; alt: string }[] = [
  { src: "/images/badges/meta-business-partner.svg", alt: "Meta Business Partner" },
  { src: "/images/badges/whatsapp-business.svg", alt: "WhatsApp Business API oficial" },
  { src: "/images/badges/stripe.svg", alt: "Stripe — pagos certificados" },
  { src: "/images/badges/google-calendar.svg", alt: "Google Calendar — integración oficial" },
];

function StripLabel({ children }: { children: ReactNode }) {
  return (
    <span className="plt-strip-label" style={{ display: "inline-flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
      <span aria-hidden style={{ width: 24, height: 1, background: "#D8DBE2" }} />
      <Mono color="#9AA0AE" size={11}>{children}</Mono>
    </span>
  );
}

function RespaldoStrip() {
  return (
    <section
      className="plt-section"
      aria-label="Respaldo: partners oficiales, clínicas activas y evidencia auditada"
      style={{ background: "#fff", borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}`, padding: "40px 80px" }}
    >
      <div className="reveal" style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Fila 1 — partners oficiales */}
        <div className="plt-strip-row" style={{ display: "grid", gridTemplateColumns: "232px minmax(0, 1fr)", gap: 28, alignItems: "center" }}>
          <StripLabel>Respaldo y partners</StripLabel>
          <div className="plt-strip-badges" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            {PARTNER_BADGES.map((b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={b.src} src={b.src} alt={b.alt} width={147} height={44} loading="lazy" decoding="async" style={{ display: "block" }} />
            ))}
          </div>
        </div>

        <div aria-hidden style={{ height: 1, background: "#F4F2EF", margin: "26px 0" }} />

        {/* Fila 2 — clínicas que ya operan con Clinera */}
        <div className="plt-strip-row" style={{ display: "grid", gridTemplateColumns: "232px minmax(0, 1fr)", gap: 28, alignItems: "center" }}>
          <StripLabel>Clínicas que ya operan</StripLabel>
          <div className="plt-clientes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
            {CLIENT_LOGOS.map((l) => (
              <div
                key={l.src}
                style={{
                  background: l.tile ? "#014C8F" : "#fff",
                  border: l.tile ? "1px solid transparent" : "1px solid #EAEAEA",
                  borderRadius: 11,
                  height: 62,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: l.tile ? 0 : "10px 12px",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={l.src}
                  alt={l.alt}
                  loading="lazy"
                  decoding="async"
                  style={l.tile ? { width: "100%", height: "100%", objectFit: "cover" } : { maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Evidencia auditada — cierre de la franja */}
        <div style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid #F4F2EF", textAlign: "center" }}>
          <Mono color="#6B7280" size={11}>100% de agendamientos en ≤3 intentos · estudio auditado · 42 casos</Mono>
        </div>
      </div>
    </section>
  );
}

/* ============ 04 · Tamaño de operación — escalera de segmentos (auto-calificación) ============ */
function SegmentoOperacion() {
  return (
    <section className="plt-section plt-section-pad" style={{ background: "#fff", borderTop: `1px solid ${HAIR}`, padding: "150px 80px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <SectionIntro
          num="04"
          eyebrow="Para operaciones con volumen"
          title="¿De qué tamaño es tu operación?"
          sub="Clinera está diseñada para clínicas con equipo — desde una sede con alto volumen hasta cadenas con decenas de sucursales. Elige tu plan por el tamaño de tu operación."
        />

        <div
          className="plt-seg-grid reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            marginTop: 64,
            maxWidth: 1080,
            marginLeft: "auto",
            marginRight: "auto",
            alignItems: "stretch",
          }}
        >
          {/* A — Una sede con equipo */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 18,
              padding: "30px 28px",
            }}
          >
            <Mono color={ACCENT} size={10.5}>01 · Una sede con equipo</Mono>
            <div style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.015em", margin: "14px 0 0" }}>
              Clínica con equipo y volumen
            </div>
            <p style={{ fontFamily: "Inter", fontSize: 14.5, lineHeight: 1.55, color: "#4B5563", margin: "10px 0 22px" }}>
              Varios profesionales, recepción y cientos de citas al mes que ordenar.
            </p>
            <div style={{ marginTop: "auto" }}>
              <div style={{ paddingTop: 18, borderTop: "1px solid #F1EFEC", display: "flex", alignItems: "baseline", gap: 8 }}>
                <Mono color="#6B7280" size={10.5}>Desde</Mono>
                <span style={{ fontFamily: "Inter", fontSize: 32, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.02em", lineHeight: 1 }}>$379</span>
                <Mono color="#6B7280" size={10.5}>USD/mes</Mono>
              </div>
              <div style={{ marginTop: 8 }}>
                <Mono color="#9AA0AE" size={10.5}>Plan Atlas · texto + voz</Mono>
              </div>
              <Link
                href="/ventas"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#0A0A0A", textDecoration: "none", marginTop: 16 }}
              >
                Ver si califico <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* B — Multi-sede (destacada) */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              background: "#fff",
              border: "1px solid #0A0A0A",
              borderRadius: 18,
              padding: "30px 28px",
              overflow: "hidden",
            }}
          >
            <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: GRAD }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <Mono color={ACCENT} size={10.5}>02 · Dos o más sedes</Mono>
              <span
                style={{
                  fontFamily: MONO_STACK,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0A0A0A",
                  background: "#F5F3FF",
                  border: "1px solid #DDD6FE",
                  borderRadius: 999,
                  padding: "3px 9px",
                  whiteSpace: "nowrap",
                }}
              >
                El más elegido
              </span>
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.015em", margin: "14px 0 0" }}>
              Clínicas multi-sede
            </div>
            <p style={{ fontFamily: "Inter", fontSize: 14.5, lineHeight: 1.55, color: "#4B5563", margin: "10px 0 22px" }}>
              Estandariza la atención y consolida el control central de todas tus sucursales.
            </p>
            <div style={{ marginTop: "auto" }}>
              <div style={{ paddingTop: 18, borderTop: "1px solid #F1EFEC", display: "flex", alignItems: "baseline", gap: 8 }}>
                <Mono color="#6B7280" size={10.5}>Desde</Mono>
                <span style={{ fontFamily: "Inter", fontSize: 32, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.02em", lineHeight: 1 }}>$479</span>
                <Mono color="#6B7280" size={10.5}>USD/mes</Mono>
              </div>
              <div style={{ marginTop: 8 }}>
                <Mono color="#9AA0AE" size={10.5}>Plan Summit · sucursales ilimitadas</Mono>
              </div>
              <Link
                href="/ventas"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#0A0A0A", textDecoration: "none", marginTop: 16 }}
              >
                Ver si califico <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* C — Cadenas y redes (ancla enterprise, dark) */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              background: DARK,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 18,
              padding: "30px 28px",
              overflow: "hidden",
            }}
          >
            <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: GRAD }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: "#D946EF", display: "inline-block" }} />
              <Mono color="rgba(255,255,255,0.65)" size={10.5}>03 · Cadenas y redes</Mono>
            </span>
            <div style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.015em", margin: "14px 0 0" }}>
              Cadenas, redes y hospitales
            </div>
            <p style={{ fontFamily: "Inter", fontSize: 14.5, lineHeight: 1.55, color: "rgba(255,255,255,0.72)", margin: "10px 0 22px" }}>
              White-glove, SLA, integraciones a medida y consolidado central de toda la red.
            </p>
            <div style={{ marginTop: "auto" }}>
              <div style={{ paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "baseline", gap: 8 }}>
                <Mono color="rgba(255,255,255,0.5)" size={10.5}>Desde</Mono>
                <span style={{ fontFamily: "Inter", fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>$1.900</span>
                <Mono color="rgba(255,255,255,0.5)" size={10.5}>USD/mes</Mono>
              </div>
              <div style={{ marginTop: 8 }}>
                <Mono color="rgba(255,255,255,0.4)" size={10.5}>Plan Corporativo a medida</Mono>
              </div>
              <Link
                href="/ventas"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none", marginTop: 16 }}
              >
                Ver si califico <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="reveal" style={{ textAlign: "center", marginTop: 28 }}>
          <Mono color="#9AA0AE" size={11}>
            El wizard te ubica en el plan correcto según tus sucursales y pacientes al mes — toma 2 minutos
          </Mono>
        </div>
      </div>
    </section>
  );
}

/* ============ Banda de seguridad / compliance — Ley 20.584 ============ */
function SeguridadBand() {
  const chips = ["AES-256-GCM", "1 llave por clínica · Cloud KMS", "Access log Ley 20.584", "Backups + PITR"];
  return (
    <section className="plt-section" style={{ background: "#FBFBFA", borderTop: `1px solid ${HAIR}`, padding: "64px 80px" }}>
      <div
        className="plt-sec-band reveal"
        style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}
      >
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <Mono color="#9AA0AE" size={11}>Seguridad y cumplimiento</Mono>
          </span>
          <div style={{ fontFamily: "Inter", fontSize: 22, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.02em", margin: "12px 0 0" }}>
            Seguridad de nivel enterprise.
          </div>
          <p style={{ fontFamily: "Inter", fontSize: 15, lineHeight: 1.55, color: "#4B5563", margin: "8px 0 0", maxWidth: 520 }}>
            Cifrado, aislamiento por clínica y trazabilidad de acceso a cada ficha — bajo la Ley 20.584
            de derechos del paciente.
          </p>
        </div>
        <div
          className="plt-sec-chips"
          style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 520, justifyContent: "flex-end" }}
        >
          {chips.map((c) => (
            <span
              key={c}
              style={{
                fontFamily: MONO_STACK,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#4B5563",
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "8px 12px",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Chat IA interno — pregúntale a tu clínica (port del deck /presentacion) ============ */
type CiaItem = {
  q: string;
  lead: string;
  items: { main: ReactNode; meta?: string }[];
  total?: string;
};

const CIA_QA: CiaItem[] = [
  {
    q: "¿cuánto vendí el mes pasado?",
    lead: "Cerraste $4.820.000 el mes pasado.",
    items: [
      { main: <><b>Tratamientos</b> — $3.100.000</> },
      { main: <><b>Productos</b> — $920.000</> },
      { main: <><b>Membresías</b> — $800.000</> },
    ],
    total: "+12% vs. el mes anterior",
  },
  {
    q: "¿cuál es mi próximo paciente?",
    lead: "Tu próximo paciente:",
    items: [{ main: <><b>Camila P.</b> — 14:00 · Limpieza facial</>, meta: "box 2 · Dra. Meza" }],
  },
  {
    q: "¿cuáles pacientes están morosos?",
    lead: "3 pacientes morosos:",
    items: [
      { main: <><b>Juan R.</b> — $85.000</>, meta: "30 días" },
      { main: <><b>Ana M.</b> — $12.300</>, meta: "18 días" },
      { main: <><b>Luis A.</b> — $45.000</>, meta: "22 días" },
    ],
    total: "Total · $142.300",
  },
  {
    q: "ayúdame a construir un agente de voz para calificar leads",
    lead: "Listo, te armo el agente de voz:",
    items: [
      { main: <>Saluda y pregunta el <b>motivo de consulta</b></> },
      { main: <>Califica <b>presupuesto y urgencia</b></> },
      { main: <>Agenda o <b>deriva a un humano</b></> },
    ],
    total: "¿Lo activo?",
  },
];

function ChatIA() {
  // Máquina de estados del ciclo original de /presentacion: boot 900ms →
  // typewriter (40-70ms/char) → 650ms → burbuja usuario + typing 1500ms →
  // respuesta 5000ms → siguiente pregunta. setState solo en callbacks de timers.
  const [qi, setQi] = useState(0);
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<"boot" | "type" | "dots" | "ans">("boot");
  const item = CIA_QA[qi % CIA_QA.length];
  const qLen = item.q.length;

  useEffect(() => {
    let t: number;
    if (phase === "boot") {
      t = window.setTimeout(() => setPhase("type"), 900);
    } else if (phase === "type") {
      if (chars < qLen) {
        t = window.setTimeout(() => setChars((c) => c + 1), 40 + Math.random() * 30);
      } else {
        t = window.setTimeout(() => setPhase("dots"), 650);
      }
    } else if (phase === "dots") {
      t = window.setTimeout(() => setPhase("ans"), 1500);
    } else {
      t = window.setTimeout(() => {
        setChars(0);
        setQi((i) => i + 1);
        setPhase("type");
      }, 5000);
    }
    return () => window.clearTimeout(t);
  }, [phase, chars, qLen]);

  const typingInput = phase === "type" && chars > 0;
  const showChat = phase === "dots" || phase === "ans";

  return (
    <div className="reveal" style={{ maxWidth: 640, margin: "56px auto 0" }}>
      {/* input estilo agente */}
      <div
        style={{
          background: "#fff",
          border: typingInput ? "1px solid rgba(124,58,237,0.45)" : "1px solid #E5E7EB",
          borderRadius: 30,
          padding: "7px 7px 7px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          minHeight: 54,
          boxShadow: typingInput
            ? "0 12px 44px -10px rgba(124,58,237,0.4)"
            : "0 18px 50px -18px rgba(0,0,0,0.55)",
          transition: "border-color .3s, box-shadow .3s",
        }}
      >
        <span style={{ width: 30, height: 30, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 21, fontWeight: 300, flexShrink: 0 }}>
          +
        </span>
        <div
          className={"plt-cia-text" + (typingInput ? " typing" : "")}
          style={{ flex: 1, fontFamily: "Inter", fontSize: 15, color: "#0A0A0A", whiteSpace: "nowrap", overflow: "hidden", textAlign: "left" }}
        >
          {typingInput ? (
            <>
              {item.q.slice(0, chars)}
              <span className="plt-cur" aria-hidden />
            </>
          ) : (
            <span style={{ color: "#9CA3AF" }}>Pregunta lo que quieras</span>
          )}
        </div>
        <span className="plt-cia-model" style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280", fontWeight: 500, flexShrink: 0 }}>Thinking ▾</span>
        <span style={{ width: 34, height: 34, borderRadius: 999, background: "#0A0A0A", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="9" width="2" height="6" rx="1"/><rect x="8" y="6" width="2" height="12" rx="1"/><rect x="12" y="3" width="2" height="18" rx="1"/><rect x="16" y="7" width="2" height="10" rx="1"/><rect x="20" y="10" width="2" height="4" rx="1"/></svg>
        </span>
      </div>

      {/* conversación (altura reservada para no saltar entre ciclos) */}
      <div style={{ minHeight: 218, marginTop: 18 }}>
        {showChat && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
            <div
              className="plt-msg"
              style={{ alignSelf: "flex-end", maxWidth: "84%", background: "rgba(255,255,255,0.1)", color: "#fff", fontFamily: "Inter", fontSize: 14, fontWeight: 500, lineHeight: 1.4, padding: "11px 16px", borderRadius: 18 }}
            >
              {item.q}
            </div>
            <div style={{ alignSelf: "flex-start", width: "100%", maxWidth: "94%" }}>
              {phase === "dots" ? (
                <div className="plt-msg" style={{ display: "inline-flex", padding: "12px 15px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16 }}>
                  <span className="plt-typing" style={{ display: "inline-flex", alignItems: "center" }}>
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              ) : (
                <div className="plt-msg plt-cia-ans" style={{ fontFamily: "Inter", fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", padding: 2 }}>
                  <span style={{ display: "block", color: "#fff", fontWeight: 600, fontSize: 14.5, marginBottom: 9, letterSpacing: "-0.005em" }}>
                    {item.lead}
                  </span>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    {item.items.map((li, i) => (
                      <li key={i} style={{ position: "relative", paddingLeft: 14, fontSize: 13.5, lineHeight: 1.5 }}>
                        <span aria-hidden style={{ position: "absolute", left: 0, color: "#C4B5FD", fontWeight: 700 }}>•</span>
                        {li.main}
                        {li.meta && (
                          <span style={{ fontFamily: MONO_STACK, fontSize: 11, color: "rgba(255,255,255,0.45)", marginLeft: 6 }}>{li.meta}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {item.total && (
                    <div style={{ fontFamily: MONO_STACK, fontSize: 11.5, color: "#C4B5FD", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                      {item.total}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ Confianza — prensa CNN (los clientes viven en RespaldoStrip) ============ */
function PrensaConfianza() {
  return (
    <section className="plt-section" style={{ background: "#fff", borderTop: `1px solid ${HAIR}`, padding: "110px 80px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {/* Card CNN (patrón dark-enterprise) */}
        <div className="reveal" style={{ position: "relative", background: DARK, borderRadius: 28, overflow: "hidden", color: "#fff" }}>
          <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: GRAD }} />
          <div aria-hidden style={{ position: "absolute", top: -160, right: -120, width: 460, height: 460, background: "radial-gradient(circle, rgba(217,70,239,0.16) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", bottom: -180, left: -140, width: 460, height: 460, background: "radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div
            className="plt-cnn-grid"
            style={{ position: "relative", display: "grid", gridTemplateColumns: "0.92fr 1.08fr", gap: 44, alignItems: "center", padding: "44px 48px" }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span aria-hidden style={{ width: 24, height: 1, background: "linear-gradient(90deg,#3B82F6,#D946EF)" }} />
                <Mono color="rgba(255,255,255,0.55)" size={11}>Clinera en la prensa</Mono>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 20 }}>
                <Mono color="rgba(255,255,255,0.45)" size={11}>Visto en</Mono>
                <CnnLogo height={22} color="#F23A30" />
              </div>
              <h3 style={{ fontFamily: "Inter", fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff", margin: "0 0 16px" }}>
                Un gran paso para{" "}
                <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Clinera</span>.
              </h3>
              <p style={{ fontFamily: "Inter", fontSize: 15.5, lineHeight: 1.6, color: "rgba(255,255,255,0.72)", margin: "0 0 22px", maxWidth: 440 }}>
                Ricardo Oyarzún, fundador de Clinera, fue entrevistado por <b style={{ color: "#fff" }}>CNN</b> sobre
                cómo la IA está transformando la atención de las clínicas en LATAM.
              </p>
              <a
                href="https://www.youtube.com/watch?v=Gskr4kELyx4"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: MONO_STACK, fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
              >
                Ver emisión original en YouTube ↗
              </a>
            </div>
            <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 40px 90px -20px rgba(0,0,0,0.6)", background: "#000" }}>
              <iframe
                src="https://player.vimeo.com/video/1205127087?badge=0&autopause=0&player_id=0&app_id=58479"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                title="CNN entrevista a Clinera"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
