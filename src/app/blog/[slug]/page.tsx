import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./blog-post.module.css";

const AI_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwJKtkMCOV8nDh3J5ngXzmU39xiB9zXbs6zFm5bTV1rlo6WKzm_XZXFFOzgEjEuIKF-/exec";
const APP_TOKEN = "Clinera_Internal_Secure_Key_2026";

export const revalidate = 60; // Refresh data gracefully

// Helper to calculate the same slug as the old script
function createSlug(title: string) {
  if (!title) return "articulo";
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with dash
    .replace(/(^-|-$)/g, ""); // remove leading/trailing dashes
}

// Format the content from the google sheet exactly like the old script did
function autoFormatContent(text: string) {
  if (!text) return "";

  // Fix internal links inside the content using absolute root paths
  let formatted = text.replace(/href="(?!http|https|#|\/)(.*?)"/g, 'href="/$1"');

  if (
    formatted.includes("<p>") ||
    formatted.includes("</div>") ||
    formatted.includes("<br>")
  ) {
    return formatted;
  }

  // Markdown-like handling
  formatted = formatted.replace(
    /^## (.*$)/gm,
    '<h2 class="postH2">$1</h2>'
  );
  formatted = formatted.replace(
    /\*(.*?)\*/g,
    '<strong>$1</strong>'
  );

  return formatted
    .split("\n\n")
    .map((p) => {
      if (p.trim().startsWith("<h2")) return p;
      return `<p class="postParagraph">${p.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

// Nextjs dynamic SEO metadata
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = params;

  try {
    const res = await fetch(AI_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ type: "get_blogs", token: APP_TOKEN }),
    });
    if (!res.ok) return { title: "Blog | Clinera" };

    const blogs = await res.json();
    const post = blogs.find(
      (b: any) =>
        createSlug(b.title) === slug ||
        (b.url && b.url.includes(slug))
    );

    if (post) {
      return {
        title: `${post.title} | Blog Clinera`,
        description: post.excerpt || post.title,
      };
    }
  } catch (error) {}

  return { title: "Articulo no encontrado | Clinera" };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Let's fetch all blogs and find the correct one matching the slug
  let post = null;
  try {
    const res = await fetch(AI_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ type: "get_blogs", token: APP_TOKEN }),
    });

    if (res.ok) {
      const blogs = await res.json();
      post = blogs.find(
        (b: any) =>
          createSlug(b.title) === slug || (b.url && b.url.includes(slug))
      );
    }
  } catch (error) {
    console.error("Error fetching blog post", error);
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className={styles.notFoundMain}>
          <div className={styles.notFoundContainer}>
            <h1>Aticulo no encontrado</h1>
            <p>Lo sentimos, el articulo que buscas no existe o ha sido movido.</p>
            <a href="/novedades" className={styles.btnPrimary}>Volver a Novedades</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const richContent = autoFormatContent(post.full_content || post.excerpt);

  return (
    <>
      <Header />
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
                dangerouslySetInnerHTML={{ __html: richContent }}
              />
            </div>

            <div className={styles.postFooterCTA}>
              <h2>¿Te fue util este articulo?</h2>
              <p>
                Si tienes mas dudas, puedes explorar otros temas o contactar a
                soporte.
              </p>
              <div className={styles.ctaButtons}>
                <a href="/novedades" className={styles.btnSecondary}>
                  Volver a Novedades
                </a>
                <a
                  href="https://wa.me/56985581524"
                  className={styles.btnPrimary}
                >
                  Hablar con Soporte
                </a>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
