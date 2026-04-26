import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  blogPostingSchema,
  breadcrumbSchema,
  faqSchema,
  orgSchema,
} from "@/components/seo/schemas";
import { allPosts, getPostBySlug, getRelatedPosts } from "@/content/posts";
import styles from "./blog-post.module.css";

export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `https://clinera.io/blog/${slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "es_CL",
      url,
      title: post.title,
      description: post.description,
      siteName: "Clinera.io",
      publishedTime: post.publishedAt,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
      ...(post.author && { authors: [post.author] }),
      ...(post.tags && { tags: post.tags }),
      images: [post.heroImage ?? "/images/og-banner.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.heroImage ?? "/images/og-banner.png"],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post, 3);
  const url = `https://clinera.io/blog/${slug}`;

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          blogPostingSchema({
            title: post.title,
            description: post.description,
            slug: post.slug,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            authorName: post.author,
            image: post.heroImage,
          }),
          breadcrumbSchema([
            { name: "Inicio", url: "https://clinera.io" },
            { name: "Blog", url: "https://clinera.io/novedades" },
            { name: post.title, url },
          ]),
          ...(post.faq && post.faq.length > 0 ? [faqSchema(post.faq)] : []),
        ]}
      />

      <NavV3 />

      <main className={styles.postMain}>
        <div className={styles.postContainer}>
          {/* Breadcrumb */}
          <nav
            aria-label="breadcrumb"
            style={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              color: "#6B7280",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            <Link href="/novedades" style={{ color: "#7C3AED" }}>
              Blog
            </Link>
            {post.category && (
              <>
                <span style={{ margin: "0 8px" }}>·</span>
                <span>{post.category}</span>
              </>
            )}
          </nav>

          {/* Header */}
          <header className={styles.postHeader}>
            <div className={styles.postHeaderContent}>
              {post.category && (
                <span className={styles.postCategory}>{post.category}</span>
              )}
              <h1 className={styles.postTitle}>{post.title}</h1>
              <p className={styles.postExcerptBlock}>{post.description}</p>
              <div
                className={styles.postMeta}
                style={{
                  marginTop: 18,
                  fontFamily: "JetBrains Mono, ui-monospace, monospace",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6B7280",
                }}
              >
                {post.author && <span>{post.author}</span>}
                {post.author && <span style={{ margin: "0 8px" }}>·</span>}
                <time dateTime={post.publishedAt}>
                  {fmtDate(post.publishedAt)}
                </time>
                {post.wordsApprox && (
                  <>
                    <span style={{ margin: "0 8px" }}>·</span>
                    <span>{Math.max(1, Math.round(post.wordsApprox / 220))} min de lectura</span>
                  </>
                )}
              </div>
            </div>
            {post.heroImage && (
              <div className={styles.postHeaderImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.heroImage}
                  alt={post.title}
                  className={styles.postMainImage}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: 16,
                  }}
                />
              </div>
            )}
          </header>

          {/* MDX content */}
          <article className={styles.richContent}>
            <MDXRemote source={post.content} />
          </article>

          {/* FAQ inline si está en frontmatter */}
          {post.faq && post.faq.length > 0 && (
            <section style={{ marginTop: 56 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 18px" }}>
                Preguntas frecuentes
              </h2>
              <div style={{ display: "grid", gap: 10 }}>
                {post.faq.map((f) => (
                  <details
                    key={f.q}
                    style={{
                      background: "#fff",
                      border: "1px solid #EEECEA",
                      borderRadius: 12,
                      padding: "16px 20px",
                    }}
                  >
                    <summary
                      style={{
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#0A0A0A",
                      }}
                    >
                      {f.q}
                    </summary>
                    <p
                      style={{
                        marginTop: 10,
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: "#4B5563",
                      }}
                    >
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related posts + comparativa relacionada */}
          {(related.length > 0 || post.relatedComparativa) && (
            <section style={{ marginTop: 64 }}>
              <h3
                style={{
                  fontFamily: "JetBrains Mono, ui-monospace, monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  color: "#6B7280",
                  textTransform: "uppercase",
                  margin: "0 0 18px",
                }}
              >
                Seguir leyendo
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 12,
                }}
              >
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/blog/${r.slug}`}
                      style={{
                        display: "block",
                        background: "#fff",
                        border: "1px solid #EEECEA",
                        borderRadius: 14,
                        padding: "20px 22px",
                        textDecoration: "none",
                        color: "#0A0A0A",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          letterSpacing: "-0.015em",
                          margin: "0 0 6px",
                          lineHeight: 1.3,
                        }}
                      >
                        {r.title}
                      </h4>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#6B7280",
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {r.description.slice(0, 110)}
                        {r.description.length > 110 ? "…" : ""}
                      </p>
                    </Link>
                  </li>
                ))}
                {post.relatedComparativa && (
                  <li>
                    <Link
                      href={`/comparativas/${post.relatedComparativa}`}
                      style={{
                        display: "block",
                        background: "#0A0A0A",
                        color: "#fff",
                        border: "none",
                        borderRadius: 14,
                        padding: "20px 22px",
                        textDecoration: "none",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          letterSpacing: "-0.015em",
                          margin: "0 0 6px",
                        }}
                      >
                        Ver comparativa Clinera vs {post.relatedComparativa}
                      </h4>
                      <p
                        style={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.7)",
                          margin: 0,
                        }}
                      >
                        Tabla, análisis por dimensión y FAQ →
                      </p>
                    </Link>
                  </li>
                )}
              </ul>
            </section>
          )}

          {/* CTA Final */}
          <section
            style={{
              marginTop: 56,
              background: "#0A0A0A",
              color: "#fff",
              borderRadius: 18,
              padding: "32px 36px",
              backgroundImage:
                "radial-gradient(ellipse 70% 80% at 100% 0%, rgba(217,70,239,.25), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 120%, rgba(124,58,237,.22), transparent 60%)",
            }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                margin: "0 0 12px",
              }}
            >
              ¿Quieres ver Clinera en acción?
            </h2>
            <p
              style={{
                fontSize: 15.5,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.78)",
                margin: "0 0 22px",
                maxWidth: 620,
              }}
            >
              AURA atendiendo WhatsApp 24/7 con tu agenda y tu base de datos.
              Demo grabada de 5 minutos o reunión con ventas.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                href="/hablar-con-ventas"
                style={{
                  background: "#fff",
                  color: "#0A0A0A",
                  padding: "13px 22px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14.5,
                }}
              >
                Hablar con ventas →
              </Link>
              <Link
                href="/planes"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.18)",
                  padding: "13px 22px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14.5,
                }}
              >
                Ver planes
              </Link>
            </div>
          </section>
        </div>
      </main>

      <FooterV3 />
    </>
  );
}
