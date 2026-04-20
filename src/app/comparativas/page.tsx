import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Comparativas — Clinera vs alternativas",
  description:
    "Comparamos Clinera con Reservo, AgendaPro, Medilink y hacerlo manual. Features, precio, soporte y casos de uso para ayudarte a decidir.",
  alternates: { canonical: "https://clinera.io/comparativas" },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://clinera.io/" },
    { "@type": "ListItem", position: 2, name: "Comparativas", item: "https://clinera.io/comparativas" },
  ],
};

const items = [
  {
    slug: "reservo",
    competitor: "Reservo",
    headline: "¿Reservo o Clinera?",
    bullets: [
      "Reservo: fuerte en ficha clínica y agendamiento manual clásico, 500+ clínicas en Chile.",
      "Clinera: IA conversacional (AURA) que responde WhatsApp 24/7 con memoria contextual.",
      "Precios públicos vs cotización privada de Reservo.",
    ],
  },
  {
    slug: "agendapro",
    competitor: "AgendaPro",
    headline: "¿AgendaPro o Clinera?",
    bullets: [
      "AgendaPro: la más grande en LATAM (20.000+ negocios), horizontal (salud + spa + gym).",
      "Clinera: 100% clínica, IA con LangChain + MCP, memoria contextual real.",
      "Desde USD 59/mes con 3 usuarios vs USD 19/usuario de AgendaPro.",
    ],
  },
  {
    slug: "medilink",
    competitor: "Medilink",
    headline: "¿Medilink o Clinera?",
    bullets: [
      "Medilink: Contact Center IA que cubre llamadas + WhatsApp, fuerte en ficha clínica.",
      "Clinera: WhatsApp IA con memoria contextual, MCP, precios públicos y prueba instantánea.",
      "Ambos referentes IA — la diferencia está en canal (voz vs chat) y transparencia comercial.",
    ],
  },
  {
    slug: "manual",
    competitor: "hacerlo manual",
    headline: "¿Seguir manual o Clinera?",
    bullets: [
      "Manual: 2-4h diarias de recepción, 30% no-shows y 40-60% de mensajes fuera de horario sin responder.",
      "Clinera: AURA contesta 24/7 y reduce no-shows a 5-10%.",
      "Payback en semanas: recuperas ~USD 2.000/mes en no-shows evitados por USD 89/mes.",
    ],
  },
];

export default function ComparativasHub() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Header />
      <main>
        <section className="hero-v2">
          <div className="hero-v2__halo" aria-hidden />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
              <span className="hero-v2__eyebrow" style={{ background: "rgba(0,159,227,0.08)", borderColor: "rgba(0,159,227,0.2)", color: "var(--brand-cyan)" }}>
                COMPARATIVAS · 2026
              </span>
              <h1 className="hero-v2__title" style={{ fontSize: "3rem" }}>
                ¿Clinera o la alternativa? <span className="gt">Aquí decides</span>.
              </h1>
              <p className="hero-v2__sub" style={{ margin: "0 auto" }}>
                Comparamos Clinera con los sistemas más usados en LATAM.
                Honesto, con tablas, precios y casos reales de migración.
              </p>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              {items.map((item) => (
                <article
                  key={item.slug}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--divider-subtle)",
                    borderRadius: 16,
                    padding: 32,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    transition: "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-tech)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--brand-cyan)",
                    }}
                  >
                    Clinera vs {item.competitor}
                  </div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--ink-primary)", margin: 0 }}>
                    {item.headline}
                  </h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {item.bullets.map((b) => (
                      <li
                        key={b}
                        style={{
                          fontSize: "0.95rem",
                          color: "var(--ink-secondary)",
                          paddingLeft: 18,
                          position: "relative",
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 8,
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg,#009FE3,#C850C0)",
                          }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/comparativas/${item.slug}`}
                    style={{
                      marginTop: "auto",
                      color: "var(--brand-cyan)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    Ver comparativa completa →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
