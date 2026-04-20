'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './ayuda.module.css';

/* ──────────────────────────────────────────────
   Data - Base de Conocimiento
   ────────────────────────────────────────────── */

const KNOWLEDGE_CATEGORIES = [
  { id: 'ia', title: 'Agente IA (AURA)', icon: '🤖', count: 12, description: 'Configuración de tono, horarios y respuestas.' },
  { id: 'whatsapp', title: 'WhatsApp API', icon: '💬', count: 8, description: 'Conexión, plantillas y estados de número.' },
  { id: 'agenda', title: 'Agenda y Citas', icon: '📅', count: 15, description: 'Gestión de turnos, cancelaciones y recordatorios.' },
  { id: 'pacientes', title: 'Fichas y Pacientes', icon: '🏥', count: 10, description: 'Historias clínicas y archivos adjuntos.' },
  { id: 'pagos', title: 'Pagos y Facturación', icon: '💳', count: 6, description: 'Planes, suscripciones y comprobantes.' },
  { id: 'config', title: 'Configuración Global', icon: '⚙️', count: 9, description: 'Usuarios, permisos y sedes.' },
];

const FAQ_DATA = [
  {
    id: 1,
    category: 'whatsapp',
    question: '¿Cómo conectar WhatsApp Business API?',
    answer: 'Sigue nuestra guía paso a paso para vincular tu número oficial a través de Meta Business Suite.',
  },
  {
    id: 2,
    category: 'ia',
    question: '¿Cómo personalizar el tono de AURA?',
    answer: 'En Configuración > IA, puedes definir si tu agente debe ser formal, amigable o directo.',
  },
  {
    id: 3,
    category: 'pagos',
    question: '¿Cómo ver mis facturas?',
    answer: 'Accede a Mi Cuenta > Suscripción para descargar tus comprobantes mensuales.',
  },
  {
    id: 4,
    category: 'agenda',
    question: '¿Puedo sincronizar con Google Calendar?',
    answer: 'Sí, Clinera permite sincronización bidireccional con cuentas de Google y Outlook.',
  },
];

const VIDEO_TUTORIALS = [
  {
    id: 1,
    category: 'IA',
    title: 'Configura tu Agente IA desde cero',
    videoId: 'wfO1YlVy48c',
    duration: '4:20'
  },
  {
    id: 2,
    category: 'WHATSAPP',
    title: 'Vinculación de número oficial en Meta',
    videoId: 'wfO1YlVy48c',
    duration: '6:15'
  },
  {
    id: 3,
    category: 'FICHAS',
    title: 'Personalización de formularios médicos',
    videoId: 'wfO1YlVy48c',
    duration: '3:45'
  },
  {
    id: 4,
    category: 'PAGOS',
    title: 'Gestión de métodos de pago y planes',
    videoId: 'wfO1YlVy48c',
    duration: '2:30'
  },
];

const ONBOARDING_STEPS = [
  { id: 1, title: 'Validación de Cuenta', icon: '📧', desc: 'Confirma tu email y configura tu perfil básico.' },
  { id: 2, title: 'Crear Consultorio', icon: '🏢', desc: 'Define tus sedes, horarios y especialidades.' },
  { id: 3, title: 'Conexión WhatsApp', icon: '🔗', desc: 'El paso más importante para activar la IA.' },
  { id: 4, title: 'Primer Paciente', icon: '👤', desc: 'Haz una prueba real agendando a tu primer paciente.' },
];

const TABS = ['Todo', 'Video Tutoriales', 'Preguntas Frecuentes', 'Guía de Inicio'];

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

export default function AyudaPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Todo');
  const [videoModal, setVideoModal] = useState<{ open: boolean; src: string }>({ open: false, src: '' });

  const normalise = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const filteredFaqs = useMemo(() =>
    FAQ_DATA.filter(f => normalise(f.question).includes(normalise(search)) || normalise(f.answer).includes(normalise(search))),
    [search]
  );

  const filteredVideos = useMemo(() =>
    VIDEO_TUTORIALS.filter(v => normalise(v.title).includes(normalise(search)) || normalise(v.category).includes(normalise(search))),
    [search]
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
                    <img src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`} alt={video.title} />
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
