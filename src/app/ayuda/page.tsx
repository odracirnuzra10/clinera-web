'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './ayuda.module.css';


/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface Video {
  id: string;
  title: string;
  category: string;
  videoId: string;
  platform: 'youtube' | 'vimeo';
  duration?: string;
  thumbnail?: string;
}

interface Faq {
  id: number | string;
  question: string;
  answer: string;
}

/* ──────────────────────────────────────────────
   Configuration & Fallback Data
   ────────────────────────────────────────────── */

const AI_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwJKtkMCOV8nDh3J5ngXzmU39xiB9zXbs6zFm5bTV1rlo6WKzm_XZXFFOzgEjEuIKF-/exec';
const APP_TOKEN = 'Clinera_Internal_Secure_Key_2026';

const KNOWLEDGE_CATEGORIES = [
  { id: 'ia', title: 'Agente IA (AURA)', icon: '🤖', count: 12, description: 'Configuración de tono, horarios y respuestas.' },
  { id: 'whatsapp', title: 'WhatsApp API', icon: '💬', count: 8, description: 'Conexión, plantillas y estados de número.' },
  { id: 'agenda', title: 'Agenda y Citas', icon: '📅', count: 15, description: 'Gestión de turnos, cancelaciones y recordatorios.' },
  { id: 'pacientes', title: 'Fichas y Pacientes', icon: '🏥', count: 10, description: 'Historias clínicas y archivos adjuntos.' },
  { id: 'pagos', title: 'Pagos y Facturación', icon: '💳', count: 6, description: 'Planes, suscripciones y comprobantes.' },
  { id: 'config', title: 'Configuración Global', icon: '⚙️', count: 9, description: 'Usuarios, permisos y sedes.' },
];

const FALLBACK_FAQS = [
  { id: 1, question: '¿Cómo conectar WhatsApp Business API?', answer: 'Sigue nuestra guía paso a paso para vincular tu número oficial.' },
  { id: 2, question: '¿Cómo personalizar el tono de AURA?', answer: 'En Configuración > IA, puedes definir si tu agente debe ser formal o amigable.' },
];

const FALLBACK_VIDEOS: Video[] = [
  { id: '1', category: 'IA', title: 'Configura tu Agente IA desde cero', videoId: 'wfO1YlVy48c', platform: 'youtube', duration: '4:20' },
  { id: '2', category: 'WHATSAPP', title: 'Vinculación de número oficial', videoId: 'wfO1YlVy48c', platform: 'youtube', duration: '6:15' },
];


const TABS = ['Todo', 'Video Tutoriales', 'Preguntas Frecuentes'];


export default function AyudaPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Todo');
  const [videoModal, setVideoModal] = useState<{ open: boolean; src: string }>({ open: false, src: '' });
  
  // Data States
  const [videos, setVideos] = useState<Video[]>(FALLBACK_VIDEOS);
  const [faqs, setFaqs] = useState<Faq[]>(FALLBACK_FAQS);
  const [loading, setLoading] = useState(true);

  // ── Load Data from Excel/API ──
  useEffect(() => {
    // Robust Video Info extractor
    const extractVideoData = (url: string) => {
      const result = { id: 'wfO1YlVy48c', platform: 'youtube' as 'youtube' | 'vimeo' };
      if (!url) return result;

      // Vimeo
      const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
      if (vimeoMatch) {
        return { id: vimeoMatch[1], platform: 'vimeo' as const };
      }

      // YouTube
      const ytRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const ytMatch = url.match(ytRegExp);
      if (ytMatch && ytMatch[7].length === 11) {
        return { id: ytMatch[7], platform: 'youtube' as const };
      }

      return result;
    };

    async function fetchData() {
      try {
        setLoading(true);
        
        // 1. Fetch Tutorials
        const videoRes = await fetch(AI_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify({ type: 'get_tutorials', token: APP_TOKEN })
        });
        if (videoRes.ok) {
          const videoData = await videoRes.json();
          if (Array.isArray(videoData)) {
            const mappedVideos = videoData.map((v: any) => {
              const info = extractVideoData(v.videoUrl);
              return {
                ...v,
                id: v.id || Math.random().toString(),
                title: v.title || 'Sin Título',
                category: v.category || 'General',
                platform: info.platform,
                videoId: info.id,
                thumbnail: v.thumbnail || (info.platform === 'youtube' ? `https://img.youtube.com/vi/${info.id}/maxresdefault.jpg` : ''),
                duration: v.duration || '5:00'
              };
            });
            if (mappedVideos.length > 0) setVideos(mappedVideos);
          }
        }

        // 2. Fetch FAQs
        const faqRes = await fetch(AI_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify({ type: 'get_faqs', token: APP_TOKEN })
        });
        if (faqRes.ok) {
          const faqData = await faqRes.json();
          if (Array.isArray(faqData) && faqData.length > 0) {
            // Map Google Script keys (title, content) to component keys (question, answer)
            const mappedFaqs = faqData.map((f: any) => ({
              id: f.rowIndex || Math.random(),
              question: f.title || f.question || '',
              answer: f.content || f.answer || ''
            })).filter(f => f.question !== '');
            
            if (mappedFaqs.length > 0) setFaqs(mappedFaqs);
          }
        }

      } catch (error) {
        console.error("Error loading knowledge base data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const normalise = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const filteredFaqs = useMemo(() =>
    faqs.filter(f => normalise(f.question).includes(normalise(search)) || normalise(f.answer).includes(normalise(search))),
    [search, faqs]
  );

  const filteredVideos = useMemo(() =>
    videos.filter(v => normalise(v.title).includes(normalise(search)) || normalise(v.category).includes(normalise(search))),
    [search, videos]
  );

  const openVideo = (video: Video) => {
    const embedSrc = video.platform === 'youtube' 
      ? `https://www.youtube.com/embed/${video.videoId}?autoplay=1`
      : `https://player.vimeo.com/video/${video.videoId}?autoplay=1`;
    setVideoModal({ open: true, src: embedSrc });
  };

  const closeVideo = () => setVideoModal({ open: false, src: '' });

  return (
    <div className={styles.pageWrapper}>
      <Header />

      {/* ── Hero Search ── */}
      <section className={styles.kbHero}>
        <div className={styles.container}>
          <span className={styles.kbBadge}>Centro de Ayuda</span>
          <h1>Base de Conocimiento</h1>
          <p>Encuentra respuestas rápidas y guías detalladas para potenciar tu clínica con Inteligencia Artificial.</p>
          
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="¿Cómo configuro mi IA? / ¿Cómo conecto WhatsApp?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── Content Sections ── */}
      <main className={styles.container}>
        
        {/* Category Grid (Only if no search) */}
        {!search && activeTab === 'Todo' && (
          <section className={styles.kbSection}>
            <div className={styles.kbGrid}>
              {KNOWLEDGE_CATEGORIES.map(cat => (
                <div key={cat.id} className={styles.categoryCard}>
                  <div className={styles.catIcon}>{cat.icon}</div>
                  <div className={styles.catContent}>
                    <h3>{cat.title}</h3>
                    <p>{cat.description}</p>
                    <span className={styles.catCount}>{cat.count} artículos</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Tabs ── */}
        <div className={styles.tabsContainer}>
          {TABS.map(tab => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Sincronizando con la base de conocimientos...</p>
          </div>
        )}


        {/* ── Video Grid ── */}
        {(activeTab === 'Todo' || activeTab === 'Video Tutoriales') && (
          <section className={styles.kbSection}>
            <div className={styles.sectionHeader}>
              <h2>📹 Video Tutoriales</h2>
            </div>
            <div className={styles.videoGrid}>
              {filteredVideos.map(video => (
                <div key={video.id} className={styles.videoCard} onClick={() => openVideo(video)}>
                  <div className={styles.videoHeader}>
                    {video.thumbnail ? (
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        onError={(e) => {
                          if (video.platform === 'youtube') {
                            e.currentTarget.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                          }
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         🎬
                      </div>
                    )}
                    <div className={styles.durationBadge}>{video.duration}</div>
                    <div className={styles.playOverlay}>▶</div>
                  </div>
                  <div className={styles.videoBody}>
                    <span className={styles.catTag}>{video.category}</span>
                    <h3>{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FAQ Section ── */}
        {(activeTab === 'Todo' || activeTab === 'Preguntas Frecuentes') && (
          <section className={styles.kbSection}>
            <div className={styles.sectionHeader}>
              <h2>❓ Preguntas Frecuentes</h2>
            </div>
            <div className={styles.faqGrid}>
              {filteredFaqs.map(faq => (
                <details key={faq.id} className={styles.faqItem}>
                  <summary>{faq.question}</summary>
                  <div className={styles.faqBody}>
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── Help CTA ── */}
        <section className={styles.supportCTA}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaIcon}>🎧</div>
            <div className={styles.ctaInfo}>
              <h3>¿No encuentras lo que buscas?</h3>
              <p>Nuestro equipo de soporte técnico está disponible para ayudarte por WhatsApp.</p>
            </div>
            <a href="https://wa.me/something" className={styles.ctaBtn}>Contactar Soporte</a>
          </div>
        </section>

      </main>

      {/* ── Video Modal ── */}
      {videoModal.open && (
        <div className={styles.modalOverlay} onClick={closeVideo}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeVideo}>✕</button>
            <iframe src={videoModal.src} allow="autoplay; fullscreen" allowFullScreen />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
