"use client";

import { useState, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAdminAuth } from "../useAdminAuth";
import styles from "./admin-blog.module.css";

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

// Helper to resize proportionally without cropping, returning WebP
async function processAndConvertImage(file: File): Promise<{ base64: string, previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No canvas context"));

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/webp", 0.85); // 85% WebP quality
      const base64 = dataUrl.split(",")[1];
      resolve({ base64, previewUrl: dataUrl });
    };
    img.onerror = () => reject(new Error("Error leyendo imagen"));
    img.src = url;
  });
}

export default function AdminBlogPage() {
  const { authenticated, checked, login } = useAdminAuth();
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [form, setForm] = useState({
    category: "GENERAL",
    title: "",
    excerpt: "",
    image: "",
    keywords: "",
    full_content: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!login(loginPw)) setLoginError(true);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Convert file to base64 and trigger Drive upload
  const processImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen (JPG, PNG, WebP, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5MB.");
      return;
    }

    setError(null);
    setImageFile(file);

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreviewUrl(localUrl);

    setUploadingImage(true);

    try {
      const { base64, previewUrl } = await processAndConvertImage(file);
      setImagePreviewUrl(previewUrl);

      // Extract raw filename and change extension
      const oldName = file.name;
      const newName = (oldName.substring(0, oldName.lastIndexOf(".")) || "imagen") + ".webp";

      const res = await fetch(AI_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          type: "upload_image",
          token: APP_TOKEN,
          base64,
          mimeType: "image/webp",
          fileName: newName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.url }));
        setImagePreviewUrl(data.url); // Use the final Drive URL just in case
      } else {
        setError("Error subiendo imagen: " + (data.response || "Error desconocido"));
      }
    } catch (err: any) {
      setError("Error de procesamiento o de conexión al subir la imagen.");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(true);
  }

  function handleDragLeave() {
    setIsDraggingOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  }

  function clearImage() {
    setImageFile(null);
    setImagePreviewUrl(null);
    setForm((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.full_content.trim()) {
      setError("El título y el contenido son obligatorios.");
      return;
    }
    if (uploadingImage) {
      setError("Espera a que termine de subir la imagen.");
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
        setSuccess(`✅ Artículo publicado. URL: /blog/${data.slug}`);
        setForm({
          category: "GENERAL",
          title: "",
          excerpt: "",
          image: "",
          keywords: "",
          full_content: "",
        });
        clearImage();
      } else {
        setError("Error al guardar: " + (data.response || "Error desconocido"));
      }
    } catch {
      setError("Error de conexión con el servidor.");
    } finally {
      setSaving(false);
    }
  }

  // Show nothing until sessionStorage is checked
  if (!checked) return null;

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
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                className={`${styles.input} ${loginError ? styles.inputError : ""}`}
                autoFocus
              />
              {loginError && <p className={styles.errorMsg}>Contraseña incorrecta.</p>}
              <button type="submit" className={styles.btnPrimary}>Entrar</button>
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
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <a href="/admin/dashboard" className={styles.btnSecondary}>
                ← Dashboard
              </a>
              <a href="/novedades" className={styles.btnSecondary}>
                Ver Blog →
              </a>
            </div>
          </div>

          {success && <div className={styles.successBanner}>{success}</div>}
          {error && <div className={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Row 1: Category + Title */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Categoría</label>
                <select name="category" value={form.category} onChange={handleChange} className={styles.input}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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

            {/* Excerpt */}
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

            {/* Image Upload + Keywords */}
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 2 }}>
                <label>Imagen de portada</label>

                {/* Drag & Drop Zone */}
                <div
                  className={`${styles.dropzone} ${isDraggingOver ? styles.dropzoneActive : ""} ${imagePreviewUrl ? styles.dropzoneHidden : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.fileInputHidden}
                    onChange={handleFileInputChange}
                  />
                  <div className={styles.dropzoneIcon}>🖼️</div>
                  <p className={styles.dropzoneText}>
                    <strong>Haz clic o arrastra</strong> una imagen aquí
                  </p>
                  <p className={styles.dropzoneHint}>JPG, PNG, WebP · Máx. 5MB</p>
                </div>

                {/* Image Preview + Upload Status */}
                {imagePreviewUrl && (
                  <div className={styles.imagePreviewWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreviewUrl} alt="Preview" className={styles.imagePreview} />
                    <div className={styles.imagePreviewOverlay}>
                      {uploadingImage ? (
                        <span className={styles.uploadingBadge}>⏳ Subiendo a Drive…</span>
                      ) : (
                        <span className={styles.uploadedBadge}>✅ Guardada en Drive</span>
                      )}
                      <button type="button" onClick={clearImage} className={styles.removeImageBtn}>
                        ✕ Quitar
                      </button>
                    </div>
                  </div>
                )}
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

            {/* Content */}
            <div className={styles.formGroup}>
              <label>Contenido completo del artículo *</label>
              <p className={styles.hint}>
                Puedes usar HTML básico:{" "}
                <code>&lt;h2&gt;Subtítulo&lt;/h2&gt;</code>,{" "}
                <code>&lt;p&gt;Párrafo&lt;/p&gt;</code>,{" "}
                <code>&lt;strong&gt;negrita&lt;/strong&gt;</code>,{" "}
                <code>&lt;ul&gt;&lt;li&gt;…&lt;/li&gt;&lt;/ul&gt;</code>
              </p>
              <textarea
                name="full_content"
                value={form.full_content}
                onChange={handleChange}
                placeholder="<h2>Introducción</h2>&#10;<p>El contenido de tu artículo aquí...</p>"
                className={`${styles.textarea} ${styles.textareaLarge}`}
                rows={18}
                required
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => {
                  setForm({ category: "GENERAL", title: "", excerpt: "", image: "", keywords: "", full_content: "" });
                  clearImage();
                }}
                className={styles.btnSecondary}
              >
                Limpiar
              </button>
              <button type="submit" className={styles.btnPrimary} disabled={saving || uploadingImage}>
                {saving ? "Publicando…" : uploadingImage ? "Esperando imagen…" : "📤 Publicar Artículo"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
