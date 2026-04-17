"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./blog-post.module.css";

const AI_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwJKtkMCOV8nDh3J5ngXzmU39xiB9zXbs6zFm5bTV1rlo6WKzm_XZXFFOzgEjEuIKF-/exec";
const APP_TOKEN = "Clinera_Internal_Secure_Key_2026";

function createSlug(title: string) {
  if (!title) return "articulo";
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function autoFormatContent(text: string) {
  if (!text) return "";
  let formatted = text.replace(/href="(?!http|https|#|\/)(.*?)"/g, 'href="/$1"');
  if (formatted.includes("<p>") || formatted.includes("</div>") || formatted.includes("<br>")) {
    return formatted;
  }
  formatted = formatted.replace(/^## (.*$)/gm, '<h2 class="postH2">$1</h2>');
  formatted = formatted.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
  return formatted
    .split("\n\n")
    .map((p) => {
      if (p.trim().startsWith("<h2")) return p;
      return `<p style="margin-bottom:1.6rem;line-height:1.8;">${p.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    fetch(AI_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ type: "get_blogs", token: APP_TOKEN }),
    })
      .then((res) => res.json())
      .then((blogs: any[]) => {
        const found = blogs.find(
          (b) =>
            createSlug(b.title) === slug ||
            (b.url && b.url.includes(slug))
        );
        if (found) {
          setPost(found);
          // Update page title dynamically
          document.title = `${found.title} | Blog Clinera`;
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <Header />

      {loading && (
        <main className={styles.postMain}>
          <div className={styles.postContainer}>
            <div className={styles.loadingSkeleton}>
              <div className={styles.skeletonLine} style={{ width: "60%", height: "16px" }} />
              <div className={styles.skeletonLine} style={{ width: "90%", height: "48px", marginTop: "24px" }} />
              <div className={styles.skeletonLine} style={{ width: "40%", height: "16px", marginTop: "16px" }} />
              <div className={styles.skeletonBlock} />
              <div className={styles.skeletonLine} style={{ width: "100%", height: "14px", marginTop: "32px" }} />
              <div className={styles.skeletonLine} style={{ width: "95%", height: "14px", marginTop: "12px" }} />
              <div className={styles.skeletonLine} style={{ width: "80%", height: "14px", marginTop: "12px" }} />
            </div>
          </div>
        </main>
      )}

      {!loading && notFound && (
        <main className={styles.notFoundMain}>
          <div className={styles.notFoundContainer}>
            <h1>Artículo no encontrado</h1>
            <p>Lo sentimos, el artículo que buscas no existe o ha sido movido.</p>
            <a href="/novedades" className={styles.btnPrimary}>
              Volver a Novedades
            </a>
          </div>
        </main>
      )}

      {!loading && post && (
        <main className={styles.postMain}>
          <div className={styles.postContainer}>
            <article>
              <div className={styles.postHeader}>
                <div className={styles.postHeaderContent}>
                  <span className={styles.postCategory}>
                    {post.category || "Novedades"}
                  </span>
                  <h1 className={styles.postTitle}>{post.title}</h1>
                  <div className={styles.postMeta}>
                    <div className={styles.postAuthorImg}>C</div>
                    <span>
                      Escrito por: <strong>Team Clinera</strong>
                    </span>
                  </div>
                </div>
                {post.image && (
                  <div className={styles.postHeaderImage}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      className={styles.postMainImage}
                      alt={post.title}
                    />
                  </div>
                )}
              </div>

              <div className={styles.postContentWrapper}>
                {post.excerpt && (
                  <p className={styles.postExcerptBlock}>{post.excerpt}</p>
                )}
                <div
                  className={styles.richContent}
                  dangerouslySetInnerHTML={{
                    __html: autoFormatContent(post.full_content || post.excerpt),
                  }}
                />
              </div>

              <div className={styles.postFooterCTA}>
                <h2>¿Te fue útil este artículo?</h2>
                <p>Si tienes más dudas, explora otros temas o contacta a soporte.</p>
                <div className={styles.ctaButtons}>
                  <a href="/novedades" className={styles.btnSecondary}>
                    Volver a Novedades
                  </a>
                  <a href="https://wa.me/56985581524" className={styles.btnPrimary}>
                    Hablar con Soporte
                  </a>
                </div>
              </div>
            </article>
          </div>
        </main>
      )}

      <Footer />
    </>
  );
}
