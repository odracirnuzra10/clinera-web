import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./novedades.module.css";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Novedades y Changelog — Clinera.io",
  description:
    "Últimas novedades, releases y artículos de Clinera: nueva funcionalidad de IA, mejoras de agenda, integraciones y casos de uso.",
  alternates: { canonical: "https://clinera.io/novedades" },
  openGraph: {
    url: "https://clinera.io/novedades",
    title: "Novedades y Changelog — Clinera.io",
    description: "Releases, mejoras y artículos de Clinera.",
    type: "website",
  },
};

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

export const revalidate = 60; // Refresh data every 60 seconds from the remote Excel


async function getHelpData() {
  try {
    const res = await fetch(AI_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        type: "get_all_help_data",
        token: APP_TOKEN,
      }),
      // no-store since the macro shouldn't be fully cached, or we let Next.js revalidate
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data as {
      blogs: any[];
      faqs: any[];
    };
  } catch (error) {
    console.error("Error fetching data from Google Script", error);
    return { blogs: [], faqs: [] };
  }
}

export default async function NovedadesPage() {
  const data = await getHelpData();
  const faqs = data.faqs;
  // Invertir para mostrar el artículo más reciente (última fila del Excel) como el destacado
  const blogs = data.blogs.slice().reverse();


  return (
    <>
      <Header />

      <main className={styles.mainContainer}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <span className={styles.heroBadge}>INFORMACION Y AYUDA</span>
            <h1 className={styles.heroTitle}>Blog y Novedades</h1>
            <p className={styles.heroSubtitle}>
              Mantente al dia con las ultimas mejoras de Clinera, aprende mejores
              practicas y encuentra respuestas a las preguntas mas frecuentes.
            </p>
          </div>
        </section>

        {/* Blogs / Articles Section */}
        <section className={styles.contentSection}>
          <div className={styles.container}>
            {blogs && blogs.length > 0 ? (
              <>
                {/* ── Artículo Destacado (Estilo Magazine) ── */}
                {(() => {
                  const featured = blogs[0];
                  const slug = createSlug(featured.title);
                  const href = featured.url && featured.url !== "#" ? featured.url : `/blog/${slug}`;
                  return (
                    <a href={href} className={styles.featuredCard}>
                      {featured.image && (
                        <div className={styles.featuredImageWrapper}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={featured.image} alt={featured.title} className={styles.blogImage} loading="lazy" />
                        </div>
                      )}
                      <div className={styles.featuredContent}>
                        <span className={styles.blogCategory}>{featured.category || "Oportunidad"}</span>
                        <h3>{featured.title}</h3>
                        <p className={styles.blogExcerpt}>{featured.excerpt}</p>
                        <span className={styles.readMore}>Leer articulo destacado &rarr;</span>
                      </div>
                    </a>
                  );
                })()}

                {/* ── Resto de Artículos ── */}
                {blogs.length > 1 && (
                  <div className={styles.blogGrid}>
                    {blogs.slice(1).map((blog: any, index: number) => {
                      const slug = createSlug(blog.title);
                      const href = blog.url && blog.url !== "#" ? blog.url : `/blog/${slug}`;
                      
                      return (
                  <a
                    key={index}
                    href={href}
                    className={styles.blogCard}
                  >
                    {blog.image && (
                      <div className={styles.blogImageWrapper}>
                        {/* If the image URL is not relative or lacks a domain configured, we use standard simple img for external images to avoid next/image config errors */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className={styles.blogImage}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className={styles.blogContent}>
                      <span className={styles.blogCategory}>
                        {blog.category || "Novedades"}
                      </span>
                      <h3>{blog.title}</h3>
                      <p className={styles.blogExcerpt}>{blog.excerpt}</p>
                      <span className={styles.readMore}>
                        Leer articulo completo &rarr;
                      </span>
                    </div>
                      </a>
                    );
                  })}
                </div>
                )}
              </>
            ) : (
              <div className={styles.emptyState}>No hay articulos disponibles actualmente.</div>
            )}
          </div>
        </section>

        {/* FAQs Section */}
        <section className={`${styles.contentSection} ${styles.bgLight}`}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Preguntas Frecuentes</h2>
              <p>Resolvemos las principales dudas sobre la operativa de Clinera.</p>
            </div>

            {faqs && faqs.length > 0 ? (
              <div className={styles.faqList}>
                {faqs.map((faq: any, index: number) => (
                  <div key={index} className={styles.faqCard}>
                    <div className={styles.faqIcon}>
                      <i className={`fa-solid fa-${faq.icon || "lightbulb"}`}></i>
                    </div>
                    <div className={styles.faqText}>
                      <h4>{faq.title}</h4>
                      <p>{faq.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>No hay preguntas frecuentes disponibles.</div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
