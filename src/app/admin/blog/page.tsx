"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./admin-blog.module.css";

const ADMIN_PASSWORD = "clinera2026admin";
const AI_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwJKtkMCOV8nDh3J5ngXzmU39xiB9zXbs6zFm5bTV1rlo6WKzm_XZXFFOzgEjEuIKF-/exec";
const APP_TOKEN = "Clinera_Internal_Secure_Key_2026";

const CATEGORIES = [
  "GENERAL",
  "MARKETING",
  "TECNOLOGÍA",
  "CONFIGURACIÓN",
  "WHATSAPP",
  "INTELIGENCIA ARTIFICIAL",
  "NOVEDADES",
];

export default function AdminBlogPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [form, setForm] = useState({
    category: "GENERAL",
    title: "",
    excerpt: "",
    image: "",
    keywords: "",
    full_content: "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.full_content.trim()) {
      setError("El título y el contenido son obligatorios.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(AI_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          type: "save_blog",
          token: APP_TOKEN,
          ...form,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(
          `✅ Artículo publicado con éxito. URL: /blog/${data.slug}`
        );
        setForm({
          category: "GENERAL",
          title: "",
          excerpt: "",
          image: "",
          keywords: "",
          full_content: "",
        });
      } else {
        setError("Error al guardar: " + (data.response || "Error desconocido"));
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setSaving(false);
    }
  }

  // ── Login Screen ──
  if (!authenticated) {
    return (
      <>
        <Header />
        <main className={styles.loginMain}>
          <div className={styles.loginCard}>
            <div className={styles.loginIcon}>🔒</div>
            <h1>Área Privada</h1>
            <p>Introduce la contraseña de administrador para continuar.</p>
            <form onSubmit={handleLogin} className={styles.loginForm}>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${authError ? styles.inputError : ""}`}
                autoFocus
              />
              {authError && (
                <p className={styles.errorMsg}>Contraseña incorrecta.</p>
              )}
              <button type="submit" className={styles.btnPrimary}>
                Entrar
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Editor Screen ──
  return (
    <>
      <Header />
      <main className={styles.editorMain}>
        <div className={styles.editorContainer}>
          <div className={styles.editorHeader}>
            <div>
              <span className={styles.badge}>ADMIN</span>
              <h1>Publicar Nuevo Artículo</h1>
              <p>Completa el formulario para publicar en el Blog de Clinera.</p>
            </div>
            <a href="/novedades" className={styles.btnSecondary}>
              Ver Blog →
            </a>
          </div>

          {success && <div className={styles.successBanner}>{success}</div>}
          {error && <div className={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Categoría</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={styles.input}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup} style={{ flex: 3 }}>
                <label>Título del artículo *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ej: Por qué la IA cambia la gestión clínica"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Resumen / Excerpt</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Breve descripción del artículo (aparece en la tarjeta del Blog)"
                className={styles.textarea}
                rows={2}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 2 }}>
                <label>URL de imagen de portada</label>
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://... (imagen de portada del artículo)"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label>Tags / Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={form.keywords}
                  onChange={handleChange}
                  placeholder="whatsapp, ia, clinica"
                  className={styles.input}
                />
              </div>
            </div>

            {form.image && (
              <div className={styles.imagePreview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="Preview" />
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Contenido completo del artículo *</label>
              <p className={styles.hint}>
                Puedes usar HTML básico:{" "}
                <code>&lt;h2&gt;Subtítulo&lt;/h2&gt;</code>,{" "}
                <code>&lt;p&gt;Párrafo&lt;/p&gt;</code>,{" "}
                <code>&lt;strong&gt;negrita&lt;/strong&gt;</code>,{" "}
                <code>&lt;ul&gt;&lt;li&gt;...&lt;/li&gt;&lt;/ul&gt;</code>
              </p>
              <textarea
                name="full_content"
                value={form.full_content}
                onChange={handleChange}
                placeholder="<h2>Introducción</h2><p>El contenido de tu artículo aquí...</p>"
                className={`${styles.textarea} ${styles.textareaLarge}`}
                rows={18}
                required
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    category: "GENERAL",
                    title: "",
                    excerpt: "",
                    image: "",
                    keywords: "",
                    full_content: "",
                  })
                }
                className={styles.btnSecondary}
              >
                Limpiar
              </button>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={saving}
              >
                {saving ? "Publicando..." : "📤 Publicar Artículo"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
