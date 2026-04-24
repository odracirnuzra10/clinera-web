"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Footer from "@/components/Footer";
import styles from "./start.module.css";

/* ------------------------------------------------------------------ */
/*  Base64 image constants (extracted from original HTML)              */
/* ------------------------------------------------------------------ */
const LOGO_SRC = "/images/start/logo.svg";
const FOUNDER_PHOTO_SRC = "/images/start/founder.png";
const TEST_PHOTO_1 = "/images/start/test1.jpg";
const TEST_PHOTO_2 = "/images/start/test2.png";
const TEST_PHOTO_3 = "/images/start/test3.png";
const TEST_PHOTO_4 = "/images/start/test4.jpg";
const TEST_PHOTO_5 = "/images/start/test5.jpg";
const WA_PHOTO_SRC = "/images/start/wa-photo.png";

/* ------------------------------------------------------------------ */
/*  Stripe links                                                       */
/* ------------------------------------------------------------------ */
const STRIPE_GROWTH = "https://buy.stripe.com/00wcN79l7bmO9wT6VZ14415";
const STRIPE_CONECT = "https://buy.stripe.com/aFa9AV8h3ez07oL2FJ14416";
const STRIPE_ADVANCED = "https://buy.stripe.com/4gM3cxapb9eG4cz1BF1441a";

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */
const FAQ_DATA = [
  {
    q: "Funciona con mi numero de WhatsApp Business actual?",
    a: "Si, Clinera se conecta directamente a tu numero de WhatsApp Business existente. No necesitas cambiar de numero ni de proveedor.",
  },
  {
    q: "Cuanto tarda la implementacion?",
    a: "Activa en 35 minutos tu solo con nuestra guia interactiva. Si prefieres ayuda, agenda una sesion gratuita con un especialista y te dejamos operando en el dia.",
  },
  {
    q: "Puedo contratar Growth si ya tengo AgendaPro o Reservo?",
    a: "Si, Growth es ideal para eso. Es solo la capa de mensajeria con IA. Se integra con Reservo, AgendaPro, Sacmed, Medilik, Dentalink sin que cambies nada. Si no tienes software de agendamiento, te recomendamos Conect.",
  },
  {
    q: "Que pasa si un paciente necesita hablar con un humano?",
    a: "La IA detecta cuando una conversacion necesita intervencion humana y la deriva automaticamente a tu equipo.",
  },
  {
    q: "Que pasa si supero las conversaciones de mi plan?",
    a: "Puedes agregar paquetes de +100 conversaciones extra por $15/mes. Growth incluye 150, Conect incluye 500 y Advanced incluye 2,000 conversaciones con IA al mes.",
  },
  {
    q: "Hay clausula de permanencia?",
    a: "No. Sin contratos anuales, sin permanencia. Cancelas cuando quieras.",
  },
  {
    q: "Cuales son los precios de los planes?",
    a: "Growth cuesta $89 USD/mes (solo mensajeria IA), Conect $129 USD/mes (mensajeria + clinica completa) y Advanced $179 USD/mes (multi-sede con IA avanzada). Sin permanencia, cancela cuando quieras.",
  },
];

/* ------------------------------------------------------------------ */
/*  Testimonial data                                                   */
/* ------------------------------------------------------------------ */
const TESTIMONIALS = [
  {
    photo: TEST_PHOTO_1,
    name: "Dr. Flavio Rojas",
    clinic: "www.infiltraciones.cl",
    metric: "-71% en costos de marketing",
    metricClass: "m1",
    quote: "\u201cClinera me permite crecer sin pagar de mas\u201d",
  },
  {
    photo: TEST_PHOTO_2,
    name: "Dra. Stefani Michailiszen",
    clinic: "drastefani.com.br",
    metric: "+89 pacientes recuperados en marzo",
    metricClass: "m2",
    quote: "\u201cClinera es el corazon de mi clinica\u201d",
  },
  {
    photo: TEST_PHOTO_3,
    name: "Dra. Yasna Vasquez",
    clinic: "@dra.yasnavasquez",
    metric: "+29% de citas confirmadas",
    metricClass: "m3",
    quote: "\u201cClinera me ayuda a organizar todo\u201d",
  },
  {
    photo: TEST_PHOTO_4,
    name: "Tamara Oyarzun -- CEO",
    clinic: "www.protocololumina.cl",
    metric: "Comunicaciones simplificadas",
    metricClass: "m4",
    quote: "\u201cClinera nos simplifico las comunicaciones\u201d",
  },
  {
    photo: TEST_PHOTO_5,
    name: "Katherine Meza",
    clinic: "@km_estetica_avanzada",
    metric: "Menos carga operativa",
    metricClass: "m5",
    quote: "\u201cClinera me libera de responder mensajes\u201d",
  },
];

/* ------------------------------------------------------------------ */
/*  Compare table data                                                 */
/* ------------------------------------------------------------------ */
const COMPARE_ROWS: { feature: string; clinera: string; reservo: string; agendapro: string; medilink: string; dentalink: string }[] = [
  { feature: "Agente IA en WhatsApp", clinera: "yes", reservo: "no", agendapro: "no", medilink: "no", dentalink: "no" },
  { feature: "Agendamiento automatico por IA", clinera: "yes", reservo: "no", agendapro: "no", medilink: "no", dentalink: "no" },
  { feature: "Memoria contextual (LangChain)", clinera: "yes", reservo: "no", agendapro: "no", medilink: "no", dentalink: "no" },
  { feature: "Derivacion automatica a humano", clinera: "yes", reservo: "no", agendapro: "no", medilink: "no", dentalink: "no" },
  { feature: "Agenda medica", clinera: "yes", reservo: "yes-other", agendapro: "yes-other", medilink: "yes-other", dentalink: "yes-other" },
  { feature: "Ficha clinica", clinera: "yes", reservo: "partial", agendapro: "yes-other", medilink: "yes-other", dentalink: "yes-other" },
  { feature: "API abierta + MCP", clinera: "yes", reservo: "partial", agendapro: "partial", medilink: "partial", dentalink: "partial" },
  { feature: "Trazabilidad campana - cita - venta", clinera: "yes", reservo: "no", agendapro: "no", medilink: "no", dentalink: "no" },
];

function CompareCell({ type }: { type: string }) {
  switch (type) {
    case "yes":
      return <span className={styles.compareYes}>{"✓"}</span>;
    case "yes-other":
      return <span className={styles.compareYesOther}>{"✓"}</span>;
    case "no":
      return <span className={styles.compareNo}>{"✗"}</span>;
    case "partial":
      return <span className={styles.comparePartial}>{"~"}</span>;
    default:
      return null;
  }
}

/* ================================================================== */
/*  CheckSvg / XSvg reusable icons                                    */
/* ================================================================== */
function CheckSvg() {
  return (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M13.3 4.7l-7 7L3 8.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function XSvg() {
  return (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                                */
/* ================================================================== */
export default function StartPage() {
  /* ----- state ----- */
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [waVisible, setWaVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  /* ----- sticky guarantee bar on scroll ----- */
  useEffect(() => {
    function handleScroll() {
      const plansEl = document.getElementById("plans");
      if (!plansEl) return;
      const triggerY = plansEl.getBoundingClientRect().top;
      setStickyVisible(triggerY < 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ----- adjust nav top when sticky bar is visible ----- */
  useEffect(() => {
    if (navRef.current) {
      navRef.current.style.top = stickyVisible ? "44px" : "0";
    }
  }, [stickyVisible]);

  /* ----- WhatsApp popup after delay ----- */
  useEffect(() => {
    const timer = setTimeout(() => setWaVisible(true), 12000);
    return () => clearTimeout(timer);
  }, []);

  /* ----- fade-up observer ----- */
  useEffect(() => {
    const els = document.querySelectorAll(`.${styles.fadeUp}`);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.fadeUpVisible);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ----- testimonial carousel scroll handler ----- */
  const updateCarouselState = useCallback(() => {
    if (!carouselRef.current) return;
    const carousel = carouselRef.current;
    const cards = carousel.children;
    if (!cards.length) return;
    const cardWidth = (cards[0] as HTMLElement).offsetWidth + 20;
    const idx = Math.round(carousel.scrollLeft / cardWidth);
    setActiveTestimonial(idx);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.addEventListener("scroll", updateCarouselState);
    return () => carousel.removeEventListener("scroll", updateCarouselState);
  }, [updateCarouselState]);

  function scrollCarouselTo(idx: number) {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.children;
    if (!cards.length) return;
    const cardWidth = (cards[0] as HTMLElement).offsetWidth + 20;
    carouselRef.current.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
  }

  /* ----- close mobile menu helper ----- */
  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div className={styles.startPage}>
      {/* ===== STICKY GUARANTEE BAR ===== */}
      <div
        className={`${styles.stickyGuarantee} ${stickyVisible ? styles.stickyGuaranteeVisible : ""}`}
      >
        <div className={styles.stickyGuaranteeInner}>
          <span className={styles.stickyGuaranteeText}>
            <span className={styles.stickyShield}>{"🛡️"}</span>
            <span className={styles.stickyHighlight}>Garantia real de 7 dias</span> {"—"} contrata sin riesgo
          </span>
          <a href="#plans" className={styles.stickyGuaranteeCta}>Ver planes</a>
        </div>
      </div>

      {/* ===== NAV ===== */}
      <nav className={styles.nav} ref={navRef}>
        <div className={`${styles.container} ${styles.navInner}`}>
          <a href="/start" className={styles.navLogo}>
            <img src={LOGO_SRC} alt="Clinera Logo" height={22} />
          </a>
          <span className={styles.navBadge}>AIaaS para clinicas</span>
          <div className={styles.navLinks}>
            <a href="#plans" className={styles.navLink}>Planes</a>
            <a href="#como-funciona" className={styles.navLink}>Como funciona</a>
            <a href="#comparativa" className={styles.navLink}>Comparativa</a>
            <a href="#faq" className={styles.navLink}>FAQ</a>
          </div>
          <button
            className={styles.navHamburger}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <a href="#plans" className={styles.navCta}>Activa ahora</a>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      <div
        className={`${styles.navMobileOverlay} ${mobileMenuOpen ? styles.navMobileOverlayOpen : ""}`}
        onClick={closeMobileMenu}
      />
      <div className={`${styles.navMobileMenu} ${mobileMenuOpen ? styles.navMobileMenuOpen : ""}`}>
        <button className={styles.navMobileClose} onClick={closeMobileMenu}>{"×"}</button>
        <div className={styles.navMobileLinks}>
          <a href="#plans" onClick={closeMobileMenu}>Planes</a>
          <a href="#como-funciona" onClick={closeMobileMenu}>Como funciona</a>
          <a href="#comparativa" onClick={closeMobileMenu}>Comparativa</a>
          <a href="#faq" onClick={closeMobileMenu}>FAQ</a>
        </div>
        <a href="#plans" className={styles.navMobileCta} onClick={closeMobileMenu}>Activa ahora</a>
      </div>

      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroContainer}`}>
          <div className={styles.heroSplit}>
            {/* Left column */}
            <div>
              <div className={styles.heroLabel}>
                <span className={styles.dot} />
                IA PARA CLINICAS
                <span style={{ marginLeft: 12, fontSize: 12, letterSpacing: 0, textTransform: "none" as const, fontWeight: 500, color: "var(--ink-s)" }}>
                  {"🇨🇱"} Chile &nbsp; {"🇲🇽"} Mexico
                </span>
              </div>
              <h1 className={styles.heroTitle}>
                Agenda pacientes con IA <span className={styles.price}>desde $89/mes</span>
              </h1>
              <p className={styles.heroSub}>
                Conecta tu clinica con IA. Incluye agente IA, agenda, fichas clinicas, consentimientos informados, recordatorios y automatizaciones.
              </p>
              <a href="#plans" className={styles.btnPrimary}>Activa ahora</a>
              <p className={styles.heroMicro}>Activacion inmediata - Sin permanencia - Precios en USD</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginTop: 16 }}>
                <span style={{ fontSize: 12, color: "var(--ink-s)", background: "rgba(0,0,0,0.03)", padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(0,0,0,0.06)" }}>{"💉"} Esteticas</span>
                <span style={{ fontSize: 12, color: "var(--ink-s)", background: "rgba(0,0,0,0.03)", padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(0,0,0,0.06)" }}>{"🩹"} Dentales</span>
                <span style={{ fontSize: 12, color: "var(--ink-s)", background: "rgba(0,0,0,0.03)", padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(0,0,0,0.06)" }}>{"🏥"} Medicina general</span>
              </div>
              <div className={styles.heroGuarantee}>
                <img src={FOUNDER_PHOTO_SRC} alt="Ricardo Oyarzun" className={styles.heroGuaranteePhoto} />
                <div className={styles.heroGuaranteeText}>
                  <strong>Ricardo Oyarzun Acuna - CEO de Clinera</strong>
                  Garantia de 7 dias: si no estas conforme, te devolvemos tu dinero.
                </div>
              </div>
            </div>
            {/* Right column - Video */}
            <div className={styles.heroVideo}>
              <div className={styles.heroVideoInner}>
                <iframe
                  src="https://player.vimeo.com/video/1169967968?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="La IA agendo 12 pacientes por mi hoy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROOF BAR ===== */}
      <section className={styles.proofBar}>
        <div className={styles.proofStatic}>
          <span className={styles.proofItem}><strong>+2,400</strong> citas agendadas por IA</span>
          <span className={styles.proofItem}><strong>71+</strong> clinicas activas en LATAM</span>
          <span className={styles.proofItem}><strong>-47%</strong> costo por paciente</span>
          <span className={styles.proofItem}><strong>4.8/5</strong> satisfaccion</span>
          <span className={styles.proofItem}><strong>$0</strong> implementacion</span>
        </div>
      </section>

      {/* ===== GUARANTEE SECTION ===== */}
      <section className={styles.guaranteeSection}>
        <div className={styles.container}>
          <div className={styles.guaranteeInner}>
            <div className={styles.guaranteeBadge}>
              <div className={styles.guaranteeDays}>7</div>
              <div className={styles.guaranteeDaysLabel}>dias de garantia</div>
            </div>
            <div className={styles.guaranteeContent}>
              <div className={styles.guaranteeShield}>{"🛡️"} GARANTIA DE SATISFACCION</div>
              <h2 className={styles.guaranteeTitle}>
                Prueba Clinera sin riesgo. Si no te sirve, <strong>te devolvemos el 100% de tu dinero</strong>.
              </h2>
              <p className={styles.guaranteeDesc}>
                Sin preguntas, sin letra chica, sin clausulas escondidas. Activa tu plan hoy, y si en 7 dias no estas conforme con Clinera, te hacemos la devolucion completa.
              </p>
              <div className={styles.guaranteeSig}>
                <div>
                  <div className={styles.guaranteeSigScript}>Ricardo Oyarzun</div>
                  <div className={styles.guaranteeSigName}>Ricardo Oyarzun Acuna</div>
                  <div className={styles.guaranteeSigRole}>CEO &amp; Fundador, Clinera.io</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section className={`${styles.section} ${styles.sectionDark}`} id="como-funciona">
        <div className={styles.container}>
          <div style={{ textAlign: "center" as const, marginBottom: 48 }}>
            <p className={styles.sectLabel}>&gt; Como funciona</p>
            <h2 className={styles.sectTitle} style={{ color: "#fff" }}>Activa Clinera en 3 pasos</h2>
            <p className={styles.sectDesc} style={{ margin: "0 auto", color: "rgba(255,255,255,0.55)" }}>
              No necesitas conocimientos tecnicos. En menos de 35 minutos estaras operando.
            </p>
          </div>

          {/* STEP 1 */}
          <div className={`${styles.fadeUp} ${styles.stepRow}`}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div className={styles.stepNum} style={{ margin: 0 }}>1</div>
                <span className={styles.stepBadge} style={{ color: "var(--mint)", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>~2 min</span>
              </div>
              <h3 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Conecta tu WhatsApp</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 16 }}>
                Conecta tu numero a la API oficial de WhatsApp. AURA, tu agente IA, empieza a responder dudas, agendar citas y confirmar asistencia -- <strong style={{ color: "#fff" }}>24/7, con memoria contextual</strong> via LangChain.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                <span className={styles.stepTag} style={{ background: "rgba(16,185,129,0.1)", color: "var(--mint)", border: "1px solid rgba(16,185,129,0.2)" }}>Mensajeria con IA</span>
                <span className={styles.stepTag} style={{ background: "rgba(16,185,129,0.1)", color: "var(--mint)", border: "1px solid rgba(16,185,129,0.2)" }}>Growth + Conect</span>
              </div>
            </div>
            <div className={styles.stepVideoWrap}>
              <div className={styles.stepVideoInner}>
                <iframe
                  src="https://player.vimeo.com/video/1179303330?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Conectar WhatsApp API"
                />
              </div>
              <div className={styles.stepGuide}>
                <div>
                  <p style={{ margin: 0, fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "#fff" }}>Nohelymar Sanchez</p>
                  <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Te guia en este paso</p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className={`${styles.fadeUp} ${styles.stepRow}`}>
            <div style={{ order: 1 }} className={styles.stepVideoWrap}>
              <div className={styles.stepVideoInner}>
                <iframe
                  src="https://player.vimeo.com/video/1172581909?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Crear Ficha Personalizada"
                />
              </div>
              <div className={styles.stepGuide}>
                <div>
                  <p style={{ margin: 0, fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "#fff" }}>Mauricio Lopez</p>
                  <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Te guia en este paso</p>
                </div>
              </div>
            </div>
            <div style={{ order: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div className={styles.stepNum} style={{ margin: 0 }}>2</div>
                <span className={styles.stepBadge} style={{ color: "var(--cyan)", background: "var(--cyan-f)", border: "1px solid rgba(0,159,227,0.2)" }}>~25 min</span>
              </div>
              <h3 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Configura tu clinica</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 12 }}>
                Carga tratamientos, profesionales, horarios y sucursales. Crea <strong style={{ color: "#fff" }}>fichas clinicas personalizables</strong> por especialidad y gestiona <strong style={{ color: "#fff" }}>consentimientos informados</strong> con firma digital y respaldo legal.
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 16 }}>
                Toda esta informacion alimenta a la IA: cuando un paciente escribe por WhatsApp, AURA accede al <strong style={{ color: "#fff" }}>contexto completo del paciente</strong> -- sesiones anteriores, pagos realizados, ficha clinica y tratamientos activos -- para dar respuestas precisas y personalizadas.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                <span className={styles.stepTag} style={{ background: "var(--cyan-f)", color: "var(--cyan)", border: "1px solid rgba(0,159,227,0.2)" }}>Fichas clinicas</span>
                <span className={styles.stepTag} style={{ background: "var(--cyan-f)", color: "var(--cyan)", border: "1px solid rgba(0,159,227,0.2)" }}>Consentimientos</span>
                <span className={styles.stepTag} style={{ background: "var(--cyan-f)", color: "var(--cyan)", border: "1px solid rgba(0,159,227,0.2)" }}>Contexto del paciente</span>
                <span className={styles.stepTag} style={{ background: "var(--cyan-f)", color: "var(--cyan)", border: "1px solid rgba(0,159,227,0.2)" }}>Solo plan Conect</span>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className={`${styles.fadeUp} ${styles.stepRow} ${styles.stepRowLast}`}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div className={styles.stepNum} style={{ margin: 0 }}>3</div>
                <span className={styles.stepBadge} style={{ color: "var(--violet)", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>~5 min</span>
              </div>
              <h3 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Configura tu agente IA</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 16 }}>
                Dale instrucciones minimas: que decir, que no decir, cuando derivar a humano. AURA agenda citas automaticamente usando los datos de tu clinica, <strong style={{ color: "#fff" }}>revisa el historial del paciente</strong> antes de responder y adapta su tono segun tus indicaciones.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                <span className={styles.stepTag} style={{ background: "rgba(124,58,237,0.08)", color: "var(--violet)", border: "1px solid rgba(124,58,237,0.2)" }}>Agente IA</span>
                <span className={styles.stepTag} style={{ background: "rgba(124,58,237,0.08)", color: "var(--violet)", border: "1px solid rgba(124,58,237,0.2)" }}>Growth + Conect</span>
              </div>
            </div>
            <div className={styles.stepVideoWrap}>
              <div className={styles.stepVideoInner}>
                <iframe
                  src="https://player.vimeo.com/video/1172555837?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Como editar el Agente IA de Clinera"
                />
              </div>
              <div className={styles.stepGuide}>
                <div>
                  <p style={{ margin: 0, fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "#fff" }}>Mauricio Lopez</p>
                  <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Te guia en este paso</p>
                </div>
              </div>
            </div>
          </div>

          {/* Steps Note */}
          <div className={styles.stepsNote} style={{ marginTop: 40 }}>
            <p>
              Si solo contrataste <strong>Growth</strong> (mensajeria), Clinera se conecta a tu software actual (Medilink, Dentalink, AgendaPro, Reservo, Sacmed) via API. Consulta con tu proveedor si tu plan permite API publica.
            </p>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <p className={styles.sectLabel} style={{ textAlign: "center" as const }}>&gt; Resultados reales</p>
          <h2 className={styles.sectTitle} style={{ textAlign: "center" as const, color: "#fff" }}>Lo que dicen nuestras clinicas</h2>
          <div className={styles.testNavWrap}>
            <button
              className={`${styles.testNav} ${styles.testNavLeft} ${activeTestimonial <= 0 ? styles.testNavHide : ""}`}
              onClick={() => scrollCarouselTo(activeTestimonial - 1)}
              aria-label="Anterior"
            >
              {"‹"}
            </button>
            <button
              className={`${styles.testNav} ${styles.testNavRight} ${activeTestimonial >= TESTIMONIALS.length - 1 ? styles.testNavHide : ""}`}
              onClick={() => scrollCarouselTo(activeTestimonial + 1)}
              aria-label="Siguiente"
            >
              {"›"}
            </button>
            <div className={styles.testCarousel} ref={carouselRef}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className={styles.testCard}>
                  <div className={styles.testCardPhoto}>
                    <img src={t.photo} alt={t.name} />
                  </div>
                  <div className={styles.testCardBody}>
                    <div className={styles.testName}>{t.name}</div>
                    <div className={styles.testClinic}>{t.clinic}</div>
                    <div className={`${styles.testMetric} ${styles[t.metricClass as keyof typeof styles]}`}>{t.metric}</div>
                    <div className={styles.testQuote}>{t.quote}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.testDots}>
            {TESTIMONIALS.map((_, i) => (
              <div
                key={i}
                className={`${styles.testDot} ${activeTestimonial === i ? styles.testDotActive : ""}`}
                onClick={() => scrollCarouselTo(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PLANS ===== */}
      <section className={styles.section} id="plans">
        <div className={styles.container} style={{ textAlign: "center" as const }}>
          <p className={styles.sectLabel}>&gt; Planes</p>
          <h2 className={styles.sectTitle}>Elige tu plan. Activa hoy.</h2>
          <p className={styles.sectDesc} style={{ margin: "0 auto" }}>
            Todos los planes incluyen API completa y sin permanencia. Precios en USD.
          </p>

          <div className={styles.pricingGrid}>
            {/* GROWTH */}
            <div className={`${styles.planCard} ${styles.fadeUp}`}>
              <h3 className={styles.planName}>Growth</h3>
              <p className={styles.planDesc}>Mensajeria IA para clinicas que ya tienen software</p>
              <div className={styles.planPrice}>
                <span className={styles.planCurrency}>$</span>
                <span className={styles.planAmount}>89</span>
                <span className={styles.planPeriod}>USD/mes</span>
              </div>
              <p className={styles.planBilling}>Facturacion mensual</p>
              <div className={styles.moduleBadges}>
                <div className={`${styles.moduleBadge} ${styles.moduleBadgeActive}`}><CheckSvg />Mensajeria con IA</div>
                <div className={`${styles.moduleBadge} ${styles.moduleBadgeInactive}`}><XSvg />Modulo clinico</div>
              </div>
              <div className={styles.featuresSection}>
                <p className={styles.featuresLabel}>Incluye</p>
                <ul className={styles.featuresList}>
                  <li><span className={styles.featuresDot} /><strong>150 conversaciones con IA/mes</strong></li>
                  <li><span className={styles.featuresDot} />WhatsApp API</li>
                  <li><span className={styles.featuresDot} />Memoria contextual via LangChain</li>
                  <li><span className={styles.featuresDot} />Derivacion automatica a humano</li>
                  <li><span className={styles.featuresDot} />Integracion via API y MCP</li>
                  <li><span className={styles.featuresDot} />3 usuarios incluidos</li>
                </ul>
              </div>
              <a href={STRIPE_GROWTH} className={`${styles.planCta} ${styles.planCtaSecondary}`}>Activa Growth</a>
              <p className={styles.planCtaSub}>Sin permanencia · Cancela en 1 click</p>
            </div>

            {/* CONECT (POPULAR) */}
            <div className={`${styles.planCard} ${styles.planCardPopular} ${styles.fadeUp}`}>
              <h3 className={styles.planName}>Conect</h3>
              <p className={styles.planDesc}>Mensajeria + clinica completa sin otro software</p>
              <div className={styles.planPrice}>
                <span className={styles.planCurrency}>$</span>
                <span className={styles.planAmount}>129</span>
                <span className={styles.planPeriod}>USD/mes</span>
              </div>
              <p className={styles.planBilling}>Facturacion mensual</p>
              <div className={styles.moduleBadges}>
                <div className={`${styles.moduleBadge} ${styles.moduleBadgeActive}`}><CheckSvg />Mensajeria con IA</div>
                <div className={`${styles.moduleBadge} ${styles.moduleBadgeActive}`}><CheckSvg />Modulo clinico</div>
              </div>
              <div className={styles.featuresSection}>
                <p className={styles.featuresLabel}>Todo de Growth, mas</p>
                <ul className={styles.featuresList}>
                  <li><span className={styles.featuresDot} /><strong>500 conversaciones con IA/mes</strong></li>
                  <li><span className={styles.featuresDot} /><strong>5 usuarios/profesionales</strong></li>
                  <li><span className={styles.featuresDot} />Agenda medica con automatizaciones</li>
                  <li><span className={styles.featuresDot} />Fichas clinicas personalizables</li>
                  <li><span className={styles.featuresDot} />Consentimientos informados</li>
                  <li><span className={styles.featuresDot} />Clinera Vault -- respaldo legal</li>
                  <li><span className={styles.featuresDot} />Panel centralizado de ventas</li>
                  <li><span className={styles.featuresDot} />Trazabilidad campana - cita - venta</li>
                </ul>
              </div>
              <a href={STRIPE_CONECT} className={`${styles.planCta} ${styles.planCtaPrimary}`}>Activa Conect</a>
              <p className={styles.planCtaSub}>Sin permanencia · Cancela en 1 click</p>
            </div>

            {/* ADVANCED */}
            <div className={`${styles.planCard} ${styles.fadeUp}`}>
              <h3 className={styles.planName}>Advanced</h3>
              <p className={styles.planDesc}>Para cadenas clinicas multi-sede</p>
              <div className={styles.planPrice}>
                <span className={styles.planCurrency}>$</span>
                <span className={styles.planAmount}>179</span>
                <span className={styles.planPeriod}>USD/mes</span>
              </div>
              <p className={styles.planBilling}>Facturacion mensual</p>
              <div className={styles.moduleBadges}>
                <div className={`${styles.moduleBadge} ${styles.moduleBadgeActive}`}><CheckSvg />Mensajeria con IA</div>
                <div className={`${styles.moduleBadge} ${styles.moduleBadgeActive}`}><CheckSvg />Modulo clinico</div>
              </div>
              <div className={styles.featuresSection}>
                <p className={styles.featuresLabel}>Todo de Conect, mas</p>
                <ul className={styles.featuresList}>
                  <li><span className={styles.featuresDot} /><strong>2,000 conversaciones con IA/mes</strong></li>
                  <li><span className={styles.featuresDot} /><strong>15 usuarios/profesionales</strong></li>
                  <li><span className={styles.featuresDot} /><strong>Multi-sede</strong> -- varias sucursales</li>
                  <li><span className={styles.featuresDot} />Webhooks avanzados</li>
                  <li><span className={styles.featuresDot} />Soporte prioritario</li>
                  <li><span className={styles.featuresDot} />Onboarding dedicado</li>
                </ul>
              </div>
              <a href={STRIPE_ADVANCED} className={`${styles.planCta} ${styles.planCtaDark}`}>Activa Advanced</a>
              <p className={styles.planCtaSub}>Sin permanencia · Cancela en 1 click</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ADD-ONS ===== */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.container} style={{ textAlign: "center" as const }}>
          <div style={{ marginTop: 52 }}>
            <p className={styles.sectLabel}>&gt; Add-ons</p>
            <h3 className={styles.sectTitle}>Escala segun necesites</h3>
            <div className={styles.addonsGrid}>
              <div className={styles.addonCard}>
                <div className={styles.addonPrice}>
                  <span className={styles.addonCurrency}>$</span>
                  <span className={styles.addonAmount}>15</span>
                  <span className={styles.addonPeriod}>/mes</span>
                </div>
                <p className={styles.addonDesc}>+100 conversaciones con IA</p>
              </div>
              <div className={styles.addonCard}>
                <div className={styles.addonPrice}>
                  <span className={styles.addonCurrency}>$</span>
                  <span className={styles.addonAmount}>9</span>
                  <span className={styles.addonPeriod}>/mes</span>
                </div>
                <p className={styles.addonDesc}>Profesional o usuario extra</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPARATIVA ===== */}
      <section className={styles.section} id="comparativa">
        <div className={styles.container} style={{ textAlign: "center" as const }}>
          <p className={styles.sectLabel}>&gt; Comparativa</p>
          <h2 className={styles.sectTitle}>Por que Clinera y no otro software?</h2>
          <p className={styles.sectDesc} style={{ margin: "0 auto" }}>
            Clinera es el unico sistema que combina IA conversacional + gestion clinica completa desde $89 USD/mes.
          </p>
          <div className={`${styles.compareTableWrap} ${styles.fadeUp}`}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th className={styles.compareTdFeature}>Funcionalidad</th>
                  <th className={styles.compareThClinera}>Clinera</th>
                  <th>Reservo</th>
                  <th>AgendaPro</th>
                  <th>Medilink</th>
                  <th>Dentalink</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={i}>
                    <td className={styles.compareTdFeature}>{row.feature}</td>
                    <td className={styles.compareTdClinera}><CompareCell type={row.clinera} /></td>
                    <td><CompareCell type={row.reservo} /></td>
                    <td><CompareCell type={row.agendapro} /></td>
                    <td><CompareCell type={row.medilink} /></td>
                    <td><CompareCell type={row.dentalink} /></td>
                  </tr>
                ))}
                {/* Summary row - features count */}
                <tr style={{ background: "rgba(0,0,0,0.02)" }}>
                  <td className={styles.compareTdFeature} style={{ fontSize: 11, color: "var(--ink-m)", fontWeight: 600 }}>Funcionalidades incluidas</td>
                  <td className={styles.compareTdClinera}>
                    <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(0,159,227,0.1)", color: "var(--cyan)" }}>8/8</span>
                  </td>
                  <td><span style={{ fontSize: 11, color: "var(--ink-m)" }}>3/8</span></td>
                  <td><span style={{ fontSize: 11, color: "var(--ink-m)" }}>3/8</span></td>
                  <td><span style={{ fontSize: 11, color: "var(--ink-m)" }}>3/8</span></td>
                  <td><span style={{ fontSize: 11, color: "var(--ink-m)" }}>3/8</span></td>
                </tr>
                {/* Price row */}
                <tr style={{ background: "rgba(0,159,227,0.02)" }}>
                  <td className={styles.compareTdFeature} style={{ fontWeight: 700, color: "var(--ink)", lineHeight: 1.3 }}>
                    Costo mensual con IA en WhatsApp
                    <span style={{ display: "block", fontSize: 10, fontWeight: 400, color: "var(--ink-m)", marginTop: 2 }}>Software + agente IA conversacional</span>
                  </td>
                  <td className={styles.compareTdClinera} style={{ background: "rgba(0,159,227,0.08)", borderBottom: "none", padding: 16 }}>
                    <strong style={{ color: "var(--cyan)", fontSize: 16 }}>$89/mes</strong>
                    <span style={{ display: "block", fontSize: 10, color: "var(--ink-m)", fontWeight: 400, marginTop: 2 }}>Todo incluido</span>
                  </td>
                  <td style={{ padding: 16 }}>
                    <span style={{ fontSize: 12, color: "var(--ink-m)" }}>$30-60 + IA externa<br /><span style={{ fontSize: 10 }}>~$200+/mes total</span></span>
                  </td>
                  <td style={{ padding: 16 }}>
                    <span style={{ fontSize: 12, color: "var(--ink-m)" }}>$40-80 + IA externa<br /><span style={{ fontSize: 10 }}>~$250+/mes total</span></span>
                  </td>
                  <td style={{ padding: 16 }}>
                    <span style={{ fontSize: 12, color: "var(--ink-m)" }}>Variable + IA externa<br /><span style={{ fontSize: 10 }}>No disponible</span></span>
                  </td>
                  <td style={{ padding: 16 }}>
                    <span style={{ fontSize: 12, color: "var(--ink-m)" }}>$50-90 + IA externa<br /><span style={{ fontSize: 10 }}>~$250+/mes total</span></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="faq">
        <div className={styles.container} style={{ textAlign: "center" as const }}>
          <p className={styles.sectLabel}>&gt; Preguntas frecuentes</p>
          <h2 className={styles.sectTitle}>Respuestas rapidas</h2>
          <div className={styles.faqGrid} style={{ textAlign: "left" as const }}>
            {FAQ_DATA.map((faq, i) => (
              <div
                key={i}
                className={styles.faqItem}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className={styles.faqQ}>
                  {faq.q}
                  <span className={styles.faqToggle}>{openFaq === i ? "\u2212" : "+"}</span>
                </div>
                <div className={`${styles.faqA} ${openFaq === i ? styles.faqAOpen : ""}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container} style={{ textAlign: "center" as const }}>
          <div className={styles.ctaFinalInner}>
            <p className={styles.sectLabel}>&gt; Empieza hoy</p>
            <h2 className={styles.ctaFinalTitle}>Activa Clinera y comienza a recuperar pacientes con IA</h2>
            <p className={styles.ctaFinalDesc}>
              Conecta tu WhatsApp e instala IA en tu clinica <strong>desde $89 USD/mes</strong>. Incluye agente IA, agenda, fichas clinicas, consentimientos informados, recordatorios y automatizaciones.
            </p>
            <div className={styles.ctaFinalButtons}>
              <a href="#plans" className={styles.btnPrimary}>Activa ahora</a>
            </div>
            <p className={styles.ctaFinalMicro}>Activacion inmediata - Sin permanencia · Cancela en 1 click</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--grad)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 14, fontWeight: 700, color: "#fff" }}>C</div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
              clinera<span style={{ color: "var(--mint)" }}>.io</span>
            </span>
          </div>
          <p>Disenado para clinicas de LATAM - Copyright 2026 Clinera AI, Inc.</p>
          <p style={{ marginTop: 8 }}>
            <a href="https://clinera.io/terminos.html">Terminos</a> - <a href="#">Privacidad</a>
          </p>
        </div>
      </footer>

      {/* ===== WHATSAPP FLOAT ===== */}
      <div className={`${styles.waPopupWrap} ${waVisible ? styles.waPopupVisible : ""}`}>
        <a
          href="https://wa.me/56985581524?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Clinera"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.waAssistBtn}
        >
          <img src={WA_PHOTO_SRC} alt="Asistencia" className={styles.waAssistPhoto} />
          Solicita asistencia
        </a>
      </div>

      {/* ===== STRIPE INTERCEPTOR SCRIPT ===== */}
      <StripeInterceptor />

      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stripe client_reference_id interceptor                             */
/* ------------------------------------------------------------------ */
function StripeInterceptor() {
  useEffect(() => {
    function getCookie(name: string) {
      const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return m ? m[2] : "";
    }
    function getQS(name: string) {
      return new URLSearchParams(window.location.search).get(name) || "";
    }
    function buildClientRef() {
      const gclid = getQS("gclid") || getCookie("_gcl_aw").split(".").pop() || "";
      const gaClientId = (getCookie("_ga") || "").split(".").slice(-2).join(".");
      let fbc = getCookie("_fbc") || "";
      const fbclid = getQS("fbclid");
      if (!fbc && fbclid) {
        fbc = "fb.1." + Date.now() + "." + fbclid;
        document.cookie = "_fbc=" + fbc + "; max-age=7776000; path=/; domain=.clinera.io";
      }
      const gaSessionId = (() => {
        const cookies = document.cookie.split("; ").reduce<Record<string, string>>((a, c) => {
          const [k, v] = c.split("=");
          a[k] = v;
          return a;
        }, {});
        const ck = Object.keys(cookies).find((k) => k.startsWith("_ga_"));
        if (!ck) return "";
        const v = cookies[ck];
        const parts = v.split(".");
        return parts[2] || "";
      })();
      const fbp = getCookie("_fbp") || "";
      const userAgent = encodeURIComponent(navigator.userAgent);
      return [gclid, gaClientId, fbc, gaSessionId, fbp, "", userAgent].join("::").substring(0, 200);
    }
    function attachStripeInterceptor() {
      document.querySelectorAll<HTMLAnchorElement>('a[href*="buy.stripe.com"]').forEach((link) => {
        if (link.dataset.stripePatched) return;
        link.dataset.stripePatched = "1";
        link.addEventListener("click", () => {
          try {
            const url = new URL(link.href);
            url.searchParams.set("client_reference_id", buildClientRef());
            link.href = url.toString();
          } catch {
            // ignore
          }
        });
      });
    }
    attachStripeInterceptor();
    const t1 = setTimeout(attachStripeInterceptor, 1500);
    const t2 = setTimeout(attachStripeInterceptor, 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return null;
}
