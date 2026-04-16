import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./novedades.module.css";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog y Novedades | Clinera",
  description: "Descubre las ultimas novedades, tutoriales, articulos y respuestas a preguntas frecuentes sobre Clinera.",
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
  const { blogs, faqs } = await getHelpData();

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
              <div className={styles.blogGrid}>
                {blogs.map((blog: any, index: number) => {
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
                    <div className={styles.faqIcon}>{faq.icon || "💡"}</div>
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
