"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAdminAuth } from "../useAdminAuth";
import styles from "./dashboard.module.css";

const AI_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwJKtkMCOV8nDh3J5ngXzmU39xiB9zXbs6zFm5bTV1rlo6WKzm_XZXFFOzgEjEuIKF-/exec";
const APP_TOKEN = "Clinera_Internal_Secure_Key_2026";

const CATEGORIES = ["GENERAL","MARKETING","TECNOLOGÍA","CONFIGURACIÓN","WHATSAPP","INTELIGENCIA ARTIFICIAL","NOVEDADES"];

type Blog = { rowIndex: number; category: string; title: string; excerpt: string; image: string; keywords: string; full_content: string; };
type Faq  = { rowIndex: number; icon: string; title: string; content: string; keywords: string; };

async function apiCall(body: object) {
  const res = await fetch(AI_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ token: APP_TOKEN, ...body }),
  });
  return res.json();
}

// ── Login Screen (reused across pages) ──
function LoginScreen({ onLogin }: { onLogin: (pw: string) => boolean }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!onLogin(pw)) setErr(true);
  }
  return (
    <main className={styles.loginMain}>
      <div className={styles.loginCard}>
        <div className={styles.loginIcon}>🔒</div>
        <h1>Área Privada</h1>
        <p>Introduce la contraseña de administrador.</p>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <input type="password" placeholder="Contraseña" value={pw}
            onChange={e => setPw(e.target.value)}
            className={`${styles.input} ${err ? styles.inputError : ""}`} autoFocus />
          {err && <p className={styles.errorMsg}>Contraseña incorrecta.</p>}
          <button type="submit" className={styles.btnPrimary}>Entrar</button>
        </form>
      </div>
    </main>
  );
}

// ── Edit Blog Modal ──
function EditBlogModal({ blog, onClose, onSaved }: { blog: Blog; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ ...blog });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErr("El archivo debe ser una imagen (JPG, PNG, WebP, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErr("La imagen no puede superar los 5MB.");
      return;
    }

    setErr(null);
    const localUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: localUrl })); // Temporary preview

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Full = reader.result as string;
      const base64 = base64Full.split(",")[1];
      try {
        const res = await fetch(AI_ENDPOINT, {
          method: "POST",
          body: JSON.stringify({
            type: "upload_image",
            token: APP_TOKEN,
            base64,
            mimeType: file.type,
            fileName: file.name,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setForm((prev) => ({ ...prev, image: data.url }));
        } else {
          setErr("Error subiendo imagen: " + (data.response || "Error desconocido"));
        }
      } catch {
        setErr("Error de conexión al subir la imagen.");
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  }

  function clearImage() {
    setForm((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (uploadingImage) {
      setErr("Espera a que termine de subir la imagen.");
      return;
    }
    setSaving(true); setErr(null);
    const data = await apiCall({ type: "update_blog", ...form });
    setSaving(false);
    if (data.success) { onSaved(); onClose(); }
    else setErr(data.response || "Error desconocido");
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>✏️ Editar Artículo</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSave} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Categoría</label>
              <select value={form.category} onChange={e => setForm(f=>({...f, category:e.target.value}))} className={styles.input}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formGroup} style={{flex:3}}>
              <label>Título *</label>
              <input value={form.title} onChange={e => setForm(f=>({...f, title:e.target.value}))} className={styles.input} required />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Resumen</label>
            <textarea value={form.excerpt} onChange={e => setForm(f=>({...f, excerpt:e.target.value}))} className={styles.textarea} rows={2} />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{flex:2}}>
              <label>Imagen de portada</label>
              <div
                className={`${styles.dropzone} ${isDraggingOver ? styles.dropzoneActive : ""} ${form.image ? styles.dropzoneHidden : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) processImageFile(file);
                }}
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

              {form.image && (
                <div className={styles.imagePreviewWrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="Preview" className={styles.imagePreview} />
                  <div className={styles.imagePreviewOverlay}>
                    {uploadingImage ? (
                      <span className={styles.uploadingBadge}>⏳ Subiendo a Drive…</span>
                    ) : (
                      <span className={styles.uploadedBadge}>✅ Cargada</span>
                    )}
                    <button type="button" onClick={clearImage} className={styles.removeImageBtn}>
                      ✕ Quitar
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Keywords</label>
              <input value={form.keywords} onChange={e => setForm(f=>({...f, keywords:e.target.value}))} className={styles.input} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Contenido (HTML)</label>
            <textarea value={form.full_content} onChange={e => setForm(f=>({...f, full_content:e.target.value}))} className={`${styles.textarea} ${styles.textareaLarge}`} rows={14} />
          </div>
          {err && <p className={styles.errorMsg}>{err}</p>}
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.btnSecondary}>Cancelar</button>
            <button type="submit" className={styles.btnPrimary} disabled={saving || uploadingImage}>
              {saving ? "Guardando…" : uploadingImage ? "Esperando imagen…" : "💾 Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit FAQ Modal ──
function EditFaqModal({ faq, onClose, onSaved }: { faq: Faq; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ ...faq });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr(null);
    const data = await apiCall({ type: "update_faq", ...form });
    setSaving(false);
    if (data.success) { onSaved(); onClose(); }
    else setErr(data.response || "Error desconocido");
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalSm} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>✏️ Editar FAQ</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSave} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Icono FA</label>
              <input value={form.icon} onChange={e => setForm(f=>({...f, icon:e.target.value}))} className={styles.input} placeholder="building, user, key…" />
            </div>
            <div className={styles.formGroup} style={{flex:3}}>
              <label>Pregunta *</label>
              <input value={form.title} onChange={e => setForm(f=>({...f, title:e.target.value}))} className={styles.input} required />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Respuesta *</label>
            <textarea value={form.content} onChange={e => setForm(f=>({...f, content:e.target.value}))} className={styles.textarea} rows={4} required />
          </div>
          <div className={styles.formGroup}>
            <label>Keywords</label>
            <input value={form.keywords} onChange={e => setForm(f=>({...f, keywords:e.target.value}))} className={styles.input} />
          </div>
          {err && <p className={styles.errorMsg}>{err}</p>}
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.btnSecondary}>Cancelar</button>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving ? "Guardando…" : "💾 Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Dashboard ──
export default function AdminDashboard() {
  const { authenticated, checked, login, logout } = useAdminAuth();
  const [tab, setTab] = useState<"blogs" | "faqs">("blogs");

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);

  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [editFaq, setEditFaq]   = useState<Faq  | null>(null);
  const [feedback, setFeedback] = useState<{ type: "ok"|"err"; msg: string } | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const data = await apiCall({ type: "get_all_help_data" });
      setBlogs(data.blogs || []);
      setFaqs(data.faqs  || []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { if (authenticated) loadData(); }, [authenticated]);

  async function deleteBlog(blog: Blog) {
    if (!confirm(`¿Eliminar "${blog.title}"?`)) return;
    const data = await apiCall({ type: "delete_blog", rowIndex: blog.rowIndex });
    if (data.success) { setFeedback({ type:"ok", msg:"Artículo eliminado." }); loadData(); }
    else setFeedback({ type:"err", msg: data.response || "Error" });
  }

  async function deleteFaq(faq: Faq) {
    if (!confirm(`¿Eliminar "${faq.title}"?`)) return;
    const data = await apiCall({ type: "delete_faq", rowIndex: faq.rowIndex });
    if (data.success) { setFeedback({ type:"ok", msg:"FAQ eliminada." }); loadData(); }
    else setFeedback({ type:"err", msg: data.response || "Error" });
  }

  if (!checked) return null;

  if (!authenticated) {
    return (
      <>
        <Header />
        <LoginScreen onLogin={login} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.dashMain}>
        <div className={styles.dashContainer}>

          {/* Header */}
          <div className={styles.dashHeader}>
            <div>
              <span className={styles.badge}>ADMIN</span>
              <h1>Dashboard</h1>
              <p>Gestiona los artículos del Blog y las Preguntas Frecuentes.</p>
            </div>
            <div className={styles.dashActions}>
              <a href="/admin/blog" className={styles.btnPrimary}>+ Nuevo Artículo</a>
              <button onClick={logout} className={styles.btnSecondary}>Cerrar sesión</button>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={feedback.type === "ok" ? styles.successBanner : styles.errorBanner}>
              {feedback.msg}
              <button onClick={() => setFeedback(null)} className={styles.dismissBtn}>✕</button>
            </div>
          )}

          {/* Tabs */}
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === "blogs" ? styles.tabActive : ""}`} onClick={() => setTab("blogs")}>
              📝 Artículos ({blogs.length})
            </button>
            <button className={`${styles.tab} ${tab === "faqs" ? styles.tabActive : ""}`} onClick={() => setTab("faqs")}>
              💡 FAQs ({faqs.length})
            </button>
            <button onClick={loadData} className={styles.refreshBtn} disabled={loading}>
              {loading ? "Cargando…" : "↺ Actualizar"}
            </button>
          </div>

          {/* Blogs Tab */}
          {tab === "blogs" && (
            <div className={styles.tableWrapper}>
              {loading ? (
                <div className={styles.loadingState}>Cargando artículos…</div>
              ) : blogs.length === 0 ? (
                <div className={styles.emptyState}>No hay artículos publicados aún.</div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Título</th>
                      <th>Categoría</th>
                      <th>Resumen</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.rowIndex}>
                        <td>
                          {blog.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={blog.image} alt="" className={styles.thumbImg} />
                          ) : (
                            <div className={styles.thumbPlaceholder}>📄</div>
                          )}
                        </td>
                        <td><strong>{blog.title}</strong></td>
                        <td><span className={styles.catBadge}>{blog.category}</span></td>
                        <td className={styles.excerptCell}>{blog.excerpt}</td>
                        <td>
                          <div className={styles.actionBtns}>
                            <button onClick={() => setEditBlog(blog)} className={styles.btnEdit}>✏️ Editar</button>
                            <button onClick={() => deleteBlog(blog)} className={styles.btnDelete}>🗑 Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* FAQs Tab */}
          {tab === "faqs" && (
            <div className={styles.tableWrapper}>
              {loading ? (
                <div className={styles.loadingState}>Cargando FAQs…</div>
              ) : faqs.length === 0 ? (
                <div className={styles.emptyState}>No hay FAQs registradas aún.</div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ícono</th>
                      <th>Pregunta</th>
                      <th>Respuesta</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqs.map((faq) => (
                      <tr key={faq.rowIndex}>
                        <td><span className={styles.faqIconCell}><i className={`fa-solid fa-${faq.icon || "lightbulb"}`} /></span></td>
                        <td><strong>{faq.title}</strong></td>
                        <td className={styles.excerptCell}>{faq.content}</td>
                        <td>
                          <div className={styles.actionBtns}>
                            <button onClick={() => setEditFaq(faq)} className={styles.btnEdit}>✏️ Editar</button>
                            <button onClick={() => deleteFaq(faq)} className={styles.btnDelete}>🗑 Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Modals */}
      {editBlog && <EditBlogModal blog={editBlog} onClose={() => setEditBlog(null)} onSaved={loadData} />}
      {editFaq  && <EditFaqModal  faq={editFaq}   onClose={() => setEditFaq(null)}  onSaved={loadData} />}
    </>
  );
}
