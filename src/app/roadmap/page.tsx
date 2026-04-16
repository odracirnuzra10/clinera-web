"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./roadmap.module.css";

/* ── Data ── */

type VersionStatus = "released" | "upcoming" | "future";

interface Feature {
  emoji: string;
  category: string;
  items: string[];
}

interface Version {
  id: string;
  name: string;
  status: VersionStatus;
  image: string;
  date: string;
  description: string;
  features: Feature[];
}

const versions: Version[] = [
  {
    id: "platanus",
    name: "Platanus",
    status: "released",
    image: "/images/platanus.avif",
    date: "Enero 2026",
    description:
      "La primera version de Clinera. Sentamos las bases del agendamiento inteligente, la inteligencia artificial conversacional y la gestion de pacientes.",
    features: [
      {
        emoji: "\uD83D\uDCC5",
        category: "Agendamiento",
        items: [
          "Agenda visual por profesional y sucursal",
          "Creacion y edicion de citas manuales",
          "Bloqueo de horarios y disponibilidad",
          "Confirmacion automatica de citas",
        ],
      },
      {
        emoji: "\uD83E\uDDE0",
        category: "IA",
        items: [
          "Aura IA: asistente conversacional por WhatsApp",
          "Respuestas automaticas 24/7 a consultas frecuentes",
          "Agendamiento autonomo desde la conversacion",
        ],
      },
      {
        emoji: "\uD83D\uDC64",
        category: "Pacientes",
        items: [
          "Base de datos de pacientes centralizada",
          "Historial de citas por paciente",
          "Busqueda y filtro de pacientes",
        ],
      },
    ],
  },
  {
    id: "cuky",
    name: "Cuky",
    status: "released",
    image: "/images/cuky.avif",
    date: "Febrero 2026",
    description:
      "Expansion masiva de capacidades. Incorporamos fichas clinicas, automatizaciones, multisucursal y un pipeline de ventas completo para cerrar mas pacientes.",
    features: [
      {
        emoji: "\uD83E\uDDE0",
        category: "IA",
        items: [
          "Mejora en comprension de lenguaje natural",
          "Deteccion de intencion de agendamiento",
          "Respuestas contextuales segun servicio",
          "Seguimiento automatico post-consulta",
          "Entrenamiento personalizado por clinica",
        ],
      },
      {
        emoji: "\uD83D\uDCCA",
        category: "Panel Ventas",
        items: [
          "Pipeline visual de oportunidades",
          "Etapas configurables del embudo",
          "Asignacion de leads a vendedores",
          "Metricas de conversion por etapa",
        ],
      },
      {
        emoji: "\uD83D\uDCE3",
        category: "Marketing",
        items: [
          "Seguimiento de fuentes de trafico",
          "Dashboard de rendimiento de campanas",
          "Integracion con Meta Ads",
          "Atribucion de pacientes por canal",
        ],
      },
      {
        emoji: "\uD83D\uDCCB",
        category: "Fichas Clinicas",
        items: [
          "Fichas clinicas digitales por paciente",
          "Plantillas personalizables por especialidad",
          "Historial clinico completo",
          "Adjuntos y fotografias en ficha",
        ],
      },
      {
        emoji: "\u26A1",
        category: "Automatizaciones",
        items: [
          "Recordatorios automaticos por WhatsApp",
          "Mensajes de bienvenida post-agendamiento",
          "Alertas de no-show al equipo",
          "Seguimiento automatico de citas perdidas",
        ],
      },
      {
        emoji: "\uD83C\uDFE5",
        category: "Multisucursal",
        items: [
          "Gestion de multiples sucursales",
          "Configuracion independiente por sede",
          "Vista consolidada de todas las sedes",
        ],
      },
    ],
  },
  {
    id: "kimi",
    name: "Kimi",
    status: "released",
    image: "/images/kimi.avif",
    date: "Marzo 2026",
    description:
      "La IA da un salto enorme. Aura 2.0 con razonamiento clinico, nueva mensajeria integrada y lanzamiento de la app movil de Clinera.",
    features: [
      {
        emoji: "\uD83E\uDDE0",
        category: "Aura IA 2.0",
        items: [
          "Modelo de lenguaje mas avanzado",
          "Contexto de conversacion extendido",
          "Respuestas multimodales (texto + imagenes)",
          "Sugerencias proactivas de re-agendamiento",
          "Analisis de sentimiento del paciente",
        ],
      },
      {
        emoji: "\uD83E\uDE7A",
        category: "Razonamiento Clinico",
        items: [
          "Sugerencias de tratamiento basadas en historial",
          "Alertas de seguimiento clinico",
          "Prediccion de no-show con machine learning",
        ],
      },
      {
        emoji: "\uD83D\uDCAC",
        category: "Nueva Mensajeria",
        items: [
          "Bandeja de entrada unificada",
          "Mensajes internos entre equipo",
          "Templates de mensajes personalizables",
        ],
      },
      {
        emoji: "\uD83D\uDCF1",
        category: "App Movil",
        items: [
          "Lanzamiento app nativa iOS y Android",
          "Gestion de agenda desde el telefono",
          "Notificaciones push en tiempo real",
        ],
      },
    ],
  },
  {
    id: "dodo",
    name: "Dodo",
    status: "upcoming",
    image: "/images/dodo.avif",
    date: "Abril 2026",
    description:
      "Expansion clinica especializada. Fichas de estetica facial y corporal, odontograma, periodontograma y un onboarding rediseñado para activar clinicas en minutos.",
    features: [
      {
        emoji: "\uD83E\uDDB7",
        category: "Odontologia",
        items: [
          "Odontograma digital interactivo",
          "Periodontograma por paciente",
          "Historial odontologico completo",
          "Notas clinicas por pieza dental",
        ],
      },
      {
        emoji: "\u2728",
        category: "Estetica Facial y Corporal",
        items: [
          "Ficha clinica de estetica facial",
          "Ficha clinica de estetica corporal",
          "Registro fotografico por zona tratada",
          "Seguimiento de tratamientos esteticos",
        ],
      },
      {
        emoji: "\uD83D\uDE80",
        category: "Onboarding Optimizado",
        items: [
          "Wizard de configuracion inicial rediseñado",
          "Activacion guiada paso a paso",
          "Importacion masiva de pacientes",
          "Templates pre-configurados por especialidad",
        ],
      },
    ],
  },
  {
    id: "berta1",
    name: "Berta v1",
    status: "future",
    image: "/images/berta1.avif",
    date: "Mayo 2026",
    description:
      "Refinamiento profundo de todas las funciones existentes. Mejoras de velocidad, usabilidad y estabilidad en agendamiento, fichas, IA y panel de ventas.",
    features: [
      {
        emoji: "\uD83D\uDCC5",
        category: "Agenda Mejorada",
        items: [
          "Vista semanal con drag & drop",
          "Codigo de colores por tipo de servicio",
          "Mini-resumen al hacer hover en cita",
          "Vista de disponibilidad en tiempo real",
        ],
      },
      {
        emoji: "\uD83D\uDCCA",
        category: "Panel de Ventas",
        items: [
          "Mejoras de rendimiento del pipeline",
          "Nuevas metricas de conversion",
          "Filtros avanzados por profesional y sede",
        ],
      },
      {
        emoji: "\u26A1",
        category: "Rendimiento General",
        items: [
          "Reduccion de tiempos de carga",
          "Optimizacion de automatizaciones",
          "Mejoras de estabilidad en WhatsApp IA",
        ],
      },
    ],
  },
  {
    id: "berta2",
    name: "Berta v2",
    status: "future",
    image: "/images/berta2.avif",
    date: "Junio 2026",
    description:
      "Segunda ronda de mejoras. Pulimos la experiencia en fichas clinicas, mensajeria, reportes y la app movil basandonos en el feedback de los usuarios.",
    features: [
      {
        emoji: "\uD83D\uDCCB",
        category: "Fichas Clinicas",
        items: [
          "Mejoras en editor de fichas",
          "Nuevos campos configurables",
          "Exportacion de historial en PDF",
        ],
      },
      {
        emoji: "\uD83D\uDCAC",
        category: "Mensajeria",
        items: [
          "Mejoras en bandeja unificada",
          "Busqueda avanzada en conversaciones",
          "Etiquetas y filtros por estado",
        ],
      },
      {
        emoji: "\uD83D\uDCF1",
        category: "App Movil",
        items: [
          "Mejoras de UX basadas en feedback",
          "Modo offline para consultas basicas",
          "Nuevas notificaciones configurables",
        ],
      },
    ],
  },
];

/* ── Helpers ── */

function getDotClass(status: VersionStatus): string {
  if (status === "released") return styles.dotReleased;
  if (status === "upcoming") return styles.dotUpcoming;
  return styles.dotFuture;
}

function getTabClass(
  version: Version,
  isActive: boolean
): string {
  const classes = [styles.versionTab];
  if (isActive) classes.push(styles.versionTabActive);
  if (version.status === "future" && !isActive)
    classes.push(styles.versionTabFuture);
  return classes.join(" ");
}

function getReleaseBadge(status: VersionStatus) {
  if (status === "released") {
    return (
      <span
        className={`${styles.releaseBadge} ${styles.releaseBadgeReleased}`}
      >
        <span className={`${styles.statusDot} ${styles.dotReleased}`} />
        Lanzado
      </span>
    );
  }
  return (
    <span
      className={`${styles.releaseBadge} ${styles.releaseBadgeUpcoming}`}
    >
      <span className={`${styles.statusDot} ${styles.dotUpcoming}`} />
      Proximamente
    </span>
  );
}

/* ── Component ── */

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState("platanus");

  return (
    <>
      <Header />

      <main>
        {/* ── Hero ── */}
        <section className={styles.roadmapHero}>
          <span className={styles.heroBadge}>Transparencia total</span>
          <h1>
            Roadmap de <span className="gt">Clinera.io</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Cada version tiene nombre de mascota. Conoce lo que ya
            construimos, en que estamos trabajando y que viene para tu
            clinica.
          </p>
        </section>

        {/* ── Version Navigator ── */}
        <nav className={styles.versionNav}>
          {versions.map((v) => (
            <button
              key={v.id}
              className={getTabClass(v, activeTab === v.id)}
              onClick={() => setActiveTab(v.id)}
              type="button"
            >
              <span
                className={`${styles.statusDot} ${getDotClass(v.status)}`}
              />
              {v.name}
            </button>
          ))}
        </nav>

        {/* ── Version Panels ── */}
        <div className={styles.versionPanelContainer}>
          {versions.map((v) => (
            <div
              key={v.id}
              className={`${styles.versionPanel} ${
                activeTab === v.id ? styles.versionPanelActive : ""
              }`}
            >
              {/* Header */}
              <div className={styles.versionHeader}>
                <Image
                  src={v.image}
                  alt={`Mascota ${v.name}`}
                  width={100}
                  height={100}
                  className={styles.mascotImage}
                />
                <div className={styles.versionInfo}>
                  {getReleaseBadge(v.status)}
                  <h2>{v.name}</h2>
                  <p className={styles.versionDate}>{v.date}</p>
                  <p className={styles.versionDesc}>{v.description}</p>
                </div>
              </div>

              {/* Features Grid */}
              <div className={styles.featuresGrid}>
                {v.features.map((feat) => (
                  <div
                    key={feat.category}
                    className={styles.featureCategoryCard}
                  >
                    <div className={styles.categoryHeader}>
                      <span className={styles.categoryEmoji}>
                        {feat.emoji}
                      </span>
                      <span className={styles.categoryTitle}>
                        {feat.category}
                      </span>
                      <span className={styles.categoryCount}>
                        {feat.items.length}
                      </span>
                    </div>
                    <ul className={styles.featureList}>
                      {feat.items.map((item) => (
                        <li key={item} className={styles.featureItem}>
                          <span className={styles.featureCheck}>
                            &#10003;
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Mobile App Banner (Berta v2 only) */}
              {v.id === "berta2" && (
                <div className={styles.mobileAppBanner}>
                  <Image
                    src="/images/mobile-app-clinera.avif"
                    alt="Clinera App Movil"
                    width={220}
                    height={160}
                    className={styles.mobileAppImage}
                  />
                  <div className={styles.mobileAppBannerContent}>
                    <h3>Clinera en tu bolsillo</h3>
                    <p>
                      La app movil nativa te permitira gestionar tu clinica
                      desde cualquier lugar. Agenda, mensajes, notificaciones
                      y mas, todo en tiempo real desde tu telefono.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Disclaimer ── */}
        <div className={styles.disclaimer}>
          <p>
            Este roadmap refleja nuestra vision actual de desarrollo y puede
            cambiar sin previo aviso. Las fechas y funcionalidades son
            estimaciones y no constituyen un compromiso contractual.
            Priorizamos en funcion del feedback de nuestros clientes.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
