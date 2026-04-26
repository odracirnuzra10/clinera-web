"use client";

import Link from "next/link";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { FinalCTA, useReveal } from "@/components/home-v3/sections";

type Blog = {
  title: string;
  excerpt?: string;
  category?: string;
  image?: string;
  url?: string;
  slug?: string;
  publishedAt?: string;
  tags?: string[];
};
type Faq = { title: string; content: string; icon?: string };

function createSlug(title: string) {
  if (!title) return "articulo";
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function fmtDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NovedadesV3({
  blogs,
  faqs,
  allTags = [],
  activeTag = null,
}: {
  blogs: Blog[];
  faqs: Faq[];
  allTags?: { tag: string; count: number }[];
  activeTag?: string | null;
}) {
  useReveal();
  return (
    <>
      <style jsx global>{`
        .reveal { opacity: 0; transform: translateY(12px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
        .reveal.in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0ms !important; transition-duration: 0ms !important; } }
        @media (max-width: 720px) {
          main > section { padding-left: 32px !important; padding-right: 32px !important; }
        }
      `}</style>
      <NovedadesHero activeTag={activeTag} />
      {allTags.length > 0 && (
        <TagFilter allTags={allTags} activeTag={activeTag} />
      )}
      <BlogSection blogs={blogs} />
      <FaqSection faqs={faqs} />
      <FinalCTA />
    </>
  );
}

function TagFilter({
  allTags,
  activeTag,
}: {
  allTags: { tag: string; count: number }[];
  activeTag: string | null;
}) {
  return (
    <section
      style={{
        background: "#FAFAFA",
        borderBottom: "1px solid #F0F0F0",
        padding: "20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: "#6B7280",
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          Filtrar:
        </span>
        <Link
          href="/novedades"
          style={{
            ...tagPillStyle,
            background: activeTag === null ? "#0A0A0A" : "#fff",
            color: activeTag === null ? "#fff" : "#374151",
            borderColor: activeTag === null ? "#0A0A0A" : "#E5E7EB",
          }}
        >
          Todos
        </Link>
        {allTags.map((t) => {
          const isActive = activeTag === t.tag;
          return (
            <Link
              key={t.tag}
              href={`/novedades?tag=${encodeURIComponent(t.tag)}`}
              style={{
                ...tagPillStyle,
                background: isActive ? "#0A0A0A" : "#fff",
                color: isActive ? "#fff" : "#374151",
                borderColor: isActive ? "#0A0A0A" : "#E5E7EB",
              }}
            >
              {t.tag}{" "}
              <span style={{ opacity: 0.6, marginLeft: 4 }}>({t.count})</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const tagPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "Inter",
  fontSize: 13,
  fontWeight: 600,
  padding: "7px 14px",
  borderRadius: 999,
  border: "1px solid #E5E7EB",
  textDecoration: "none",
  transition: "background .15s, color .15s",
} as const;

function NovedadesHero({ activeTag }: { activeTag: string | null }) {
  void activeTag;
  return (
    <section
      style={{
        padding: "96px 80px 40px",
        background: "linear-gradient(180deg,#FFFFFF 0%,#FAFAFA 100%)",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div className="reveal" style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow>Blog y novedades</Eyebrow>
        <h1
          className="novedades-hero-title"
          style={{
            fontFamily: "Inter",
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: "16px 0 16px",
            color: "#0A0A0A",
          }}
        >
          Lo nuevo de{" "}
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            Clinera
          </span>
          .
        </h1>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 19,
            color: "#4B5563",
            lineHeight: 1.55,
            margin: "0 auto",
            maxWidth: 680,
          }}
        >
          Releases, artículos y mejores prácticas para que tu clínica saque el máximo de Clinera.
        </p>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.novedades-hero-title) { font-size: 40px !important; }
        }
      `}</style>
    </section>
  );
}

function BlogSection({ blogs }: { blogs: Blog[] }) {
  if (!blogs || blogs.length === 0) {
    return (
      <section style={{ padding: "80px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", color: "#6B7280", fontFamily: "Inter" }}>
          No hay artículos disponibles actualmente.
        </div>
      </section>
    );
  }
  const [featured, ...rest] = blogs;
  const featuredHref = featured.url && featured.url !== "#" ? featured.url : `/blog/${createSlug(featured.title)}`;
  return (
    <section style={{ padding: "80px 80px 40px", background: "#fff", borderTop: "1px solid #F0F0F0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <a
          href={featuredHref}
          className="reveal novedades-featured"
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 40,
            alignItems: "center",
            background: "#FAFAFA",
            border: "1px solid #EEECEA",
            borderRadius: 20,
            padding: 20,
            textDecoration: "none",
            color: "inherit",
            overflow: "hidden",
            marginBottom: 48,
          }}
        >
          {featured.image && (
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                borderRadius: 14,
                overflow: "hidden",
                background: "#EEECEA",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.title}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
            </div>
          )}
          <div style={{ padding: "0 20px" }}>
            <span
              style={{
                display: "inline-block",
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: GRAD,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: 12,
              }}
            >
              {featured.category || "Destacado"}
            </span>
            <h3
              style={{
                fontFamily: "Inter",
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                margin: "0 0 12px",
                color: "#0A0A0A",
              }}
            >
              {featured.title}
            </h3>
            {featured.excerpt && (
              <p style={{ fontFamily: "Inter", fontSize: 16, color: "#4B5563", lineHeight: 1.55, margin: "0 0 16px" }}>
                {featured.excerpt}
              </p>
            )}
            {featured.publishedAt && (
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  color: "#6B7280",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                <time dateTime={featured.publishedAt}>{fmtDate(featured.publishedAt)}</time>
              </div>
            )}
            <span
              style={{
                fontFamily: "Inter",
                fontSize: 14,
                fontWeight: 600,
                color: "#0A0A0A",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Leer artículo destacado <span>→</span>
            </span>
          </div>
        </a>

        {rest.length > 0 && (
          <div
            className="novedades-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}
          >
            {rest.map((b, i) => {
              const href = b.url && b.url !== "#" ? b.url : `/blog/${createSlug(b.title)}`;
              return (
                <a
                  key={i}
                  href={href}
                  className="reveal"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#fff",
                    border: "1px solid #EEECEA",
                    borderRadius: 16,
                    overflow: "hidden",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "transform .25s, box-shadow .25s, border-color .25s",
                  }}
                >
                  {b.image && (
                    <div style={{ position: "relative", aspectRatio: "16 / 10", background: "#EEECEA", overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.image}
                        alt={b.title}
                        loading="lazy"
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  )}
                  <div style={{ padding: "20px 22px 22px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                        fontSize: 10.5,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#7C3AED",
                        marginBottom: 10,
                      }}
                    >
                      {b.category || "Novedades"}
                    </span>
                    <h3
                      style={{
                        fontFamily: "Inter",
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: "-0.015em",
                        lineHeight: 1.2,
                        margin: "0 0 10px",
                        color: "#0A0A0A",
                      }}
                    >
                      {b.title}
                    </h3>
                    {b.excerpt && (
                      <p style={{ fontFamily: "Inter", fontSize: 14, color: "#4B5563", lineHeight: 1.5, margin: "0 0 14px" }}>
                        {b.excerpt}
                      </p>
                    )}
                    {b.publishedAt && (
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                          fontSize: 10.5,
                          fontWeight: 500,
                          letterSpacing: "0.1em",
                          color: "#6B7280",
                          textTransform: "uppercase",
                          marginBottom: 10,
                        }}
                      >
                        <time dateTime={b.publishedAt}>{fmtDate(b.publishedAt)}</time>
                      </div>
                    )}
                    <span
                      style={{
                        fontFamily: "Inter",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#0A0A0A",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      Leer más <span>→</span>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
      <style jsx>{`
        @media (max-width: 960px) {
          :global(.novedades-featured) { grid-template-columns: 1fr !important; }
          :global(.novedades-grid) { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          :global(.novedades-grid) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section style={{ padding: "96px 80px", borderTop: "1px solid #F0F0F0", background: "#FAFAFA" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "14px 0 10px",
              color: "#0A0A0A",
            }}
          >
            Resolvemos tus dudas.
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 16, color: "#6B7280", margin: 0 }}>
            Las principales preguntas sobre la operativa de Clinera.
          </p>
        </div>
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} >
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 16,
                padding: "22px 22px",
                background: "#fff",
                border: "1px solid #EEECEA",
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, rgba(59,130,246,.12) 0%, rgba(124,58,237,.12) 50%, rgba(217,70,239,.12) 100%)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#7C3AED",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <h4 style={{ fontFamily: "Inter", fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 6px", color: "#0A0A0A" }}>
                  {faq.title}
                </h4>
                <p style={{ fontFamily: "Inter", fontSize: 14.5, color: "#4B5563", margin: 0, lineHeight: 1.55 }}>
                  {faq.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 760px) {
          :global(section > div > div:last-child) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
