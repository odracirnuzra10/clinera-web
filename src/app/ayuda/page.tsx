'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './ayuda.module.css';

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

const FALLBACK_VIDEOS = [
  { id: '1', category: 'IA', title: 'Configura tu Agente IA desde cero', videoId: 'wfO1YlVy48c', duration: '4:20' },
  { id: '2', category: 'WHATSAPP', title: 'Vinculación de número oficial', videoId: 'wfO1YlVy48c', duration: '6:15' },
];

const ONBOARDING_STEPS = [
  { id: 1, title: 'Validación de Cuenta', icon: '📧', desc: 'Confirma tu email y configura tu perfil básico.' },
  { id: 2, title: 'Crear Consultorio', icon: '🏢', desc: 'Define tus sedes, horarios y especialidades.' },
  { id: 3, title: 'Conexión WhatsApp', icon: '🔗', desc: 'El paso más importante para activar la IA.' },
  { id: 4, title: 'Primer Paciente', icon: '👤', desc: 'Haz una prueba real agendando a tu primer paciente.' },
];

const TABS = ['Todo', 'Video Tutoriales', 'Preguntas Frecuentes', 'Guía de Inicio'];

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface Video {
  id: string;
  title: string;
  category: string;
  videoId: string;
  duration?: string;
  videoUrl?: string; // Optional if provided directly
}

interface Faq {
  id: number | string;
  question: string;
  answer: string;
}

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
          // Map to handle different formats (videoUrl vs videoId)
          const mappedVideos = videoData.map((v: any) => ({
            ...v,
            videoId: v.videoId || v.videoUrl?.split('embed/')[1]?.split('?')[0] || 'wfO1YlVy48c',
            duration: v.duration || '5:00'
          }));
          if (mappedVideos.length > 0) setVideos(mappedVideos);
        }

        // 2. Fetch FAQs
        const faqRes = await fetch(AI_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify({ type: 'get_faqs', token: APP_TOKEN })
        });
        if (faqRes.ok) {
          const faqData = await faqRes.json();
          if (faqData.length > 0) setFaqs(faqData);
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

  const openVideo = (videoId: string) => {
    setVideoModal({ open: true, src: `https://www.youtube.com/embed/${videoId}?autoplay=1` });
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

        {/* ── Onboarding Section (Guía de Inicio) ── */}
        {(activeTab === 'Todo' || activeTab === 'Guía de Inicio') && !search && (
          <section className={styles.kbSection}>
            <div className={styles.sectionHeader}>
              <h2>🚀 Guía de Inicio Rápido</h2>
              <p>Sigue estos pasos para activar tu clínica en menos de 10 minutos.</p>
            </div>
            <div className={styles.onboardingGrid}>
              {ONBOARDING_STEPS.map(step => (
                <div key={step.id} className={styles.stepCard}>
                  <div className={styles.stepNumber}>{step.id}</div>
                  <span className={styles.stepIcon}>{step.icon}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Video Grid ── */}
        {(activeTab === 'Todo' || activeTab === 'Video Tutoriales') && (
          <section className={styles.kbSection}>
            <div className={styles.sectionHeader}>
              <h2>📹 Video Tutoriales</h2>
            </div>
            <div className={styles.videoGrid}>
              {filteredVideos.map(video => (
                <div key={video.id} className={styles.videoCard} onClick={() => openVideo(video.videoId)}>
                  <div className={styles.videoHeader}>
                    <img 
                      src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`} 
                      alt={video.title} 
                      onError={(e) => (e.currentTarget.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`)}
                    />
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
