'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './ayuda.module.css';

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

const FAQ_DATA = [
  {
    id: 1,
    question: 'Como conectar WhatsApp Business API?',
    answer:
      'Sigue nuestra guia paso a paso para vincular tu numero de WhatsApp Business con Clinera.',
  },
  {
    id: 2,
    question: 'Como personalizar el agente IA?',
    answer:
      'Configura el tono, horarios y respuestas de tu asistente virtual AURA.',
  },
  {
    id: 3,
    question: 'Como ver reportes de ventas?',
    answer:
      'Accede al panel de ventas para ver metricas de conversion y ROI.',
  },
];

const VIDEO_TUTORIALS = [
  {
    id: 1,
    category: 'CONFIGURACION',
    title: 'Como configurar tu Agente IA',
    videoId: 'wfO1YlVy48c',
  },
  {
    id: 2,
    category: 'WHATSAPP',
    title: 'Conectar WhatsApp Business API',
    videoId: 'wfO1YlVy48c',
  },
  {
    id: 3,
    category: 'FICHAS',
    title: 'Crear fichas clinicas personalizadas',
    videoId: 'wfO1YlVy48c',
  },
];

const TABS = ['Video Tutoriales', 'Preguntas Frecuentes', 'Novedades y Blog'];

const CATEGORIES = ['Todos', 'CONFIGURACION', 'WHATSAPP', 'FICHAS'];

const KNOWLEDGE_CARDS = [
  {
    id: 1,
    type: 'horizontal' as const,
    label: 'GUIA',
    title: 'Guia de implementacion rapida',
    description:
      'Aprende a configurar Clinera desde cero en menos de 15 minutos con nuestra guia paso a paso.',
    icon: '📋',
  },
  {
    id: 2,
    type: 'vertical' as const,
    label: 'INTEGRACION',
    title: 'Conectar WhatsApp Business API',
    description:
      'Vincula tu numero de WhatsApp Business para que AURA atienda tus pacientes automaticamente.',
    icon: '💬',
  },
  {
    id: 3,
    type: 'horizontal' as const,
    label: 'FICHAS',
    title: 'Configurar fichas clinicas por especialidad',
    description:
      'Personaliza los formularios de ingreso para cada especialidad de tu clinica.',
    icon: '🏥',
  },
  {
    id: 4,
    type: 'dark' as const,
    label: 'SOPORTE',
    title: 'Necesitas ayuda personalizada?',
    description:
      'Nuestro equipo de soporte esta disponible para ayudarte con cualquier duda.',
    icon: '🎯',
  },
];

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

export default function AyudaPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Video Tutoriales');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [videoModal, setVideoModal] = useState<{
    open: boolean;
    src: string;
  }>({ open: false, src: '' });

  const normalise = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  /* Filtered data */
  const filteredFaqs = useMemo(
    () =>
      FAQ_DATA.filter(
        (f) =>
          normalise(f.question).includes(normalise(search)) ||
          normalise(f.answer).includes(normalise(search)),
      ),
    [search],
  );

  const filteredVideos = useMemo(
    () =>
      VIDEO_TUTORIALS.filter((v) => {
        const matchesSearch =
          normalise(v.title).includes(normalise(search)) ||
          normalise(v.category).includes(normalise(search));
        const matchesCategory =
          activeCategory === 'Todos' || v.category === activeCategory;
        return matchesSearch && matchesCategory;
      }),
    [search, activeCategory],
  );

  const filteredKb = useMemo(
    () =>
      KNOWLEDGE_CARDS.filter(
        (k) =>
          normalise(k.title).includes(normalise(search)) ||
          normalise(k.description).includes(normalise(search)),
      ),
    [search],
  );

  const openVideo = (videoId: string) => {
    setVideoModal({
      open: true,
      src: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
    });
  };

  const closeVideo = () => {
    setVideoModal({ open: false, src: '' });
  };

  const thumbUrl = (id: string) =>
    `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  const hasResults =
    filteredFaqs.length > 0 ||
    filteredVideos.length > 0 ||
    filteredKb.length > 0;

  return (
    <div className={styles.pageWrapper}>
      <Header />

      {/* ── Hero Search ── */}
      <section className={styles.helpHero}>
        <h1>En que te podemos ayudar?</h1>
        <p>
          Explora tutoriales, preguntas frecuentes y guias para sacar el maximo
          provecho de Clinera.
        </p>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar tutoriales, guias, preguntas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className={styles.tabsContainer}>
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {!hasResults && search.length > 0 && (
        <div className={styles.noResults}>
          <p>No se encontraron resultados para &ldquo;{search}&rdquo;</p>
        </div>
      )}

      {/* ── Dashboard Grid: Featured + Sidebar FAQs ── */}
      {(activeTab === 'Video Tutoriales' || activeTab === 'Preguntas Frecuentes') &&
        (filteredFaqs.length > 0 || filteredVideos.length > 0) && (
          <section className={styles.dashboardGrid}>
            {/* Featured Video */}
            <div
              className={styles.featuredMain}
              onClick={() => openVideo('wfO1YlVy48c')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openVideo('wfO1YlVy48c');
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbUrl('wfO1YlVy48c')}
                alt="Como configurar tu Agente IA en 5 minutos"
                className={styles.featuredThumbnail}
              />
              <div className={styles.featuredOverlay}>
                <span className={styles.featuredTag}>NUEVO</span>
                <h3 className={styles.featuredTitle}>
                  Como configurar tu Agente IA en 5 minutos
                </h3>
              </div>
              <div className={styles.playBtnOverlay}>
                <span className={styles.playTriangle} />
              </div>
            </div>

            {/* Sidebar FAQs */}
            <div className={styles.sidebarFaqs}>
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className={styles.faqItemSmall}>
                  <h4>
                    <span className={styles.faqIcon}>?</span>
                    {faq.question}
                  </h4>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      {/* ── Video Tutorials ── */}
      {(activeTab === 'Video Tutoriales' || activeTab === 'Novedades y Blog') &&
        filteredVideos.length > 0 && (
          <>
            <div className={styles.sectionHeader}>
              <h2>Video Tutoriales</h2>
              <a href="#" className={styles.viewAllLink}>
                Ver todos
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>

            {/* Category Filters */}
            <div className={styles.categoryFilters}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.categoryPill} ${activeCategory === cat ? styles.categoryPillActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className={styles.videoGrid}>
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className={styles.videoCard}
                  onClick={() => openVideo(video.videoId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      openVideo(video.videoId);
                  }}
                >
                  <div className={styles.videoThumbWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbUrl(video.videoId)}
                      alt={video.title}
                      className={styles.videoThumb}
                    />
                    <div className={styles.videoPlayOverlay}>
                      <div className={styles.videoPlayBtn}>
                        <span className={styles.videoPlayTriangle} />
                      </div>
                    </div>
                  </div>
                  <div className={styles.videoCardBody}>
                    <div className={styles.videoCategory}>{video.category}</div>
                    <h3>{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      {/* ── Knowledge Base Grid ── */}
      {filteredKb.length > 0 && (
        <>
          <div className={styles.sectionHeader}>
            <h2>Base de Conocimiento</h2>
          </div>

          <div className={styles.mixedGrid}>
            {filteredKb.map((card) => {
              if (card.type === 'horizontal') {
                return (
                  <div
                    key={card.id}
                    className={`${styles.cardKb} ${styles.cardHorizontal}`}
                  >
                    <div className={styles.cardImageSide}>
                      <span className={styles.cardImagePlaceholder}>
                        {card.icon}
                      </span>
                    </div>
                    <div className={styles.cardTextSide}>
                      <span className={styles.cardLabel}>{card.label}</span>
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>
                  </div>
                );
              }

              if (card.type === 'vertical') {
                return (
                  <div
                    key={card.id}
                    className={`${styles.cardKb} ${styles.cardVertical}`}
                  >
                    <div className={styles.cardIconBox}>
                      <div className={styles.cardIconCircle}>{card.icon}</div>
                    </div>
                    <div className={styles.cardVerticalText}>
                      <span className={styles.cardLabel}>{card.label}</span>
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>
                  </div>
                );
              }

              if (card.type === 'dark') {
                return (
                  <div
                    key={card.id}
                    className={`${styles.cardKb} ${styles.cardDark}`}
                  >
                    <span className={styles.cardDarkIcon}>{card.icon}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <a
                      href="https://clinera.io/support"
                      className={styles.ctaButton}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contactar soporte
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </>
      )}

      {/* ── Video Modal ── */}
      {videoModal.open && (
        <div
          className={styles.modalOverlay}
          onClick={closeVideo}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={closeVideo}
              aria-label="Cerrar video"
            >
              &#x2715;
            </button>
            <iframe
              className={styles.modalIframe}
              src={videoModal.src}
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              title="Video tutorial"
            />
          </div>
        </div>
      )}

      {/* ── Cuky Widget ── */}
      <div className={styles.cukyWidget}>
        <div className={styles.cukyBubble}>Necesitas ayuda?</div>
        <a
          href="https://clinera.io/support"
          className={styles.cukyBtn}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir soporte"
        >
          <span className={styles.cukyAvatar}>🤖</span>
        </a>
      </div>

      <Footer />
    </div>
  );
}
