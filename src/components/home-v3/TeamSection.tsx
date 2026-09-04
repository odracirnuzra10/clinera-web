"use client";

import Image from "next/image";
import Link from "next/link";
import { TEAM_MEMBERS } from "@/content/team";

const ACCENT = "#7C3AED";
const TEXT = "#111111";
const MUTED = "#6B6B6B";
const BORDER = "#EAEAEA";
const HOVER_BORDER = "#D4D4D4";
const BG = "#FBFBFA";

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Bloque "Implementación asistida" del home.
 * Datos en `src/content/team.ts`; estilos propios (no Inter / no Lucide).
 */
export function TeamSection() {
  return (
    <section
      id="equipo-implementacion"
      aria-labelledby="team-heading"
      style={{
        background: BG,
        borderTop: `1px solid ${BORDER}`,
        padding: "96px 80px",
      }}
    >
      <style jsx>{`
        .team-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.4fr) minmax(0, 0.6fr);
          gap: 56px;
          align-items: start;
          max-width: 72rem;
          margin: 0 auto;
        }
        .team-portraits {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        .team-card {
          border: 1px solid ${BORDER};
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          transition: border-color 200ms ease, transform 200ms ease;
        }
        .team-card:hover {
          border-color: ${HOVER_BORDER};
          transform: scale(1.02);
        }
        .team-card:active {
          transform: scale(0.99);
        }
        .team-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: ${TEXT};
          color: #fff;
          border: 0;
          border-radius: 8px;
          padding: 13px 22px;
          font-family: Outfit, sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          line-height: 1;
          transition: transform 120ms ease;
        }
        .team-primary:active {
          transform: scale(0.98);
        }
        .team-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          color: ${TEXT};
          border: 1px solid ${BORDER};
          border-radius: 8px;
          padding: 13px 18px;
          font-family: Outfit, sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          line-height: 1;
          transition: color 160ms ease, border-color 160ms ease;
        }
        .team-secondary:hover {
          color: ${ACCENT};
          border-color: ${ACCENT};
        }
        @media (max-width: 900px) {
          .team-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        @media (max-width: 720px) {
          section {
            padding-left: 32px !important;
            padding-right: 32px !important;
            padding-top: 72px !important;
            padding-bottom: 72px !important;
          }
          .team-portraits {
            gap: 12px;
          }
        }
      `}</style>

      <div className="team-grid">
        <div className="reveal" style={{ maxWidth: 420 }}>
          <p
            style={{
              margin: 0,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: ACCENT,
            }}
          >
            Implementación asistida
          </p>
          <h2
            id="team-heading"
            style={{
              margin: "16px 0 0",
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(28px, 3.2vw, 40px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
              color: TEXT,
            }}
          >
            Un equipo de especialistas implementa Clinera en tu clínica por ti.
          </h2>
          <p
            style={{
              margin: "16px 0 0",
              fontFamily: "Outfit, sans-serif",
              fontSize: 17,
              fontWeight: 400,
              lineHeight: 1.55,
              color: MUTED,
            }}
          >
            Configuramos tus agentes, conectamos tu WhatsApp y migramos tu
            agenda. Tú sigues atendiendo pacientes; nosotros dejamos todo
            funcionando.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 28,
            }}
          >
            <Link href="/agenda" className="team-primary">
              Agenda una demo
            </Link>
            <Link href="/estructura" className="team-secondary">
              Conoce cómo trabajamos
              <ArrowIcon />
            </Link>
          </div>
        </div>

        <ul
          className="team-portraits"
          style={{ listStyle: "none", margin: 0, padding: 0 }}
        >
          {TEAM_MEMBERS.map((member, i) => (
            <li
              key={member.slug}
              className="reveal team-card"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  background: "#fff",
                }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 900px) 33vw, 180px"
                  loading="lazy"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "12px 12px 14px" }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "Outfit, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: TEXT,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                  }}
                >
                  {member.name}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontFamily: "Outfit, sans-serif",
                    fontSize: 12,
                    fontWeight: 400,
                    color: MUTED,
                    lineHeight: 1.35,
                  }}
                >
                  {member.role}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
