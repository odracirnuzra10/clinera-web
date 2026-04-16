import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Clinera.io | Software de IA para Clinicas",
  description:
    "Agenda pacientes con IA las 24 horas. Clinera responde, agenda y confirma citas por ti 24/7 con inteligencia artificial.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Clinera.io",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "Software de IA para clinicas. Agenda pacientes con inteligencia artificial 24/7 via WhatsApp.",
  url: "https://clinera.io",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "59",
    highPrice: "149",
    priceCurrency: "USD",
    offerCount: "3",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "500",
  },
};

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main>
        {/* ================================================================
            Hero Section
            ================================================================ */}
        <section className="section hero">
          <div className="container hero-grid">
            {/* Left Column: Calendar Mockup */}
            <div className="hero-left">
              <div className="mock-container" style={{ position: "relative" }}>
                <div className="mock-header">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        background: "#7c3aed",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: "18px", height: "18px" }}
                        aria-hidden="true"
                      >
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M3 10h18" />
                        <path d="M8 14h.01" />
                        <path d="M12 14h.01" />
                        <path d="M16 14h.01" />
                        <path d="M8 18h.01" />
                        <path d="M12 18h.01" />
                        <path d="M16 18h.01" />
                      </svg>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>
                      Agenda Medica
                    </div>
                  </div>
                  <div />
                </div>

                <div style={{ display: "flex", flexGrow: 1 }}>
                  <div className="mock-sidebar">
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        marginBottom: "12px",
                      }}
                    >
                      Pacientes hoy
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {[60, 40, 70].map((w, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              background: "#e2e8f0",
                              borderRadius: "50%",
                            }}
                          />
                          <div
                            style={{
                              height: "8px",
                              background: "#f1f5f9",
                              width: `${w}%`,
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mock-content">
                    <div className="calendar-grid">
                      {/* Day 1 */}
                      <div className="calendar-cell">
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#94a3b8",
                            margin: "4px",
                            display: "block",
                          }}
                        >
                          1
                        </span>
                      </div>
                      {/* Day 2 - Control */}
                      <div className="calendar-cell">
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#94a3b8",
                            margin: "4px",
                            display: "block",
                          }}
                        >
                          2
                        </span>
                        <div
                          className="event-bar"
                          style={{
                            background: "#ecfdf5",
                            borderColor: "#10b981",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "7px",
                              fontWeight: 700,
                              color: "#065f46",
                              display: "block",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Control
                          </span>
                        </div>
                      </div>
                      {/* Day 3 */}
                      <div className="calendar-cell">
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#94a3b8",
                            margin: "4px",
                            display: "block",
                          }}
                        >
                          3
                        </span>
                      </div>
                      {/* Day 4 - Cita */}
                      <div className="calendar-cell">
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#94a3b8",
                            margin: "4px",
                            display: "block",
                          }}
                        >
                          4
                        </span>
                        <div
                          className="event-bar"
                          style={{
                            background: "#eef2ff",
                            borderColor: "#6366f1",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "7px",
                              fontWeight: 700,
                              color: "#3730a3",
                              display: "block",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Cita
                          </span>
                        </div>
                      </div>
                      {/* Days 5-7 */}
                      {[5, 6, 7].map((d) => (
                        <div key={d} className="calendar-cell">
                          <span
                            style={{
                              fontSize: "9px",
                              color: "#94a3b8",
                              margin: "4px",
                              display: "block",
                            }}
                          >
                            {d}
                          </span>
                        </div>
                      ))}
                      {/* Days 8-9 */}
                      {[8, 9].map((d) => (
                        <div key={d} className="calendar-cell">
                          <span
                            style={{
                              fontSize: "9px",
                              color: "#94a3b8",
                              margin: "4px",
                              display: "block",
                            }}
                          >
                            {d}
                          </span>
                        </div>
                      ))}
                      {/* Day 10 - Urg. */}
                      <div className="calendar-cell">
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#94a3b8",
                            margin: "4px",
                            display: "block",
                          }}
                        >
                          10
                        </span>
                        <div
                          className="event-bar"
                          style={{
                            background: "#fff7ed",
                            borderColor: "#f97316",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "7px",
                              fontWeight: 700,
                              color: "#9a3412",
                              display: "block",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Urg.
                          </span>
                        </div>
                      </div>
                      {/* Day 11 - Cirugia */}
                      <div className="calendar-cell">
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#7c3aed",
                            fontWeight: "bold",
                            margin: "4px",
                            display: "block",
                          }}
                        >
                          11
                        </span>
                        <div
                          className="event-bar"
                          style={{
                            background: "#f5f3ff",
                            borderColor: "#7c3aed",
                            borderWidth: "2px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "7px",
                              fontWeight: 700,
                              color: "#5b21b6",
                              display: "block",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Cirugia
                          </span>
                        </div>
                      </div>
                      {/* Days 12-14 */}
                      {[12, 13, 14].map((d) => (
                        <div key={d} className="calendar-cell">
                          <span
                            style={{
                              fontSize: "9px",
                              color: "#94a3b8",
                              margin: "4px",
                              display: "block",
                            }}
                          >
                            {d}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Next Appointment Card */}
                    <div
                      style={{
                        marginTop: "20px",
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          marginBottom: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: "10px", height: "10px" }}
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>{" "}
                        Proxima Cita
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontSize: "11px", fontWeight: 600 }}>
                          Dr. Alexander Fisher
                        </div>
                        <div
                          style={{
                            fontSize: "9px",
                            background: "#f1f5f9",
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          15:30 PM
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Mockup - AI Assistant */}
                <div className="phone-mockup">
                  <div className="phone-screen">
                    <div className="chat-header">
                      <div className="ai-status-dot" />
                      <div className="chat-title">Asistente IA</div>
                    </div>
                    <div className="chat-body" id="chat-messages">
                      <div className="msg incoming">
                        Necesito una cita para manana.
                      </div>
                      <div className="msg outgoing">
                        Procesando disponibilidad... Tengo 3 espacios.
                      </div>
                      <div className="selection-card">
                        <div className="selection-label">SELECCIONE:</div>
                        <div className="selection-options">
                          <div className="opt-btn">09:00 AM - Consulta</div>
                          <div className="opt-btn">11:30 AM - Control</div>
                          <div className="opt-btn">04:00 PM - Urgencia</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Headline */}
            <div className="hero-right">
              <span className="badge">Nueva IA 2.0</span>
              <h1 className="hero-title">
                Agenda pacientes con IA las 24 horas
              </h1>
              <p className="hero-subtitle">
                Clinera responde, agenda y confirma citas por ti 24/7 con
                inteligencia artificial.
              </p>
              <div className="hero-cta">
                <div className="hero-actions">
                  <Link href="/planes" className="btn btn-gradient btn-lg">
                    Prueba Gratis &rarr;
                  </Link>
                  <Link href="/demo" className="btn btn-outline btn-lg">
                    Ver demo &rarr;
                  </Link>
                </div>

                <div className="hero-social-proof">
                  <div className="avatar-group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://i.pravatar.cc/150?img=1"
                      alt="Medico"
                      width={36}
                      height={36}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://i.pravatar.cc/150?img=2"
                      alt="Medico"
                      width={36}
                      height={36}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://i.pravatar.cc/150?img=3"
                      alt="Medico"
                      width={36}
                      height={36}
                    />
                    <div className="avatar-plus">+</div>
                  </div>
                  <div className="social-proof-text">
                    + de 500 Medicos en 10 paises ya usan Clinera.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            Problem Section
            ================================================================ */}
        <section className="section problem-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">EL PROBLEMA</span>
              <h2 className="section-title">
                Lo que le cuesta a tu clinica no automatizar
              </h2>
              <p className="section-subtitle">
                Cada dia que pasa sin automatizacion, tu clinica pierde
                pacientes, tiempo y dinero.
              </p>
            </div>

            <div className="problem-grid">
              {/* Card 1: WhatsApp */}
              <div className="problem-card panel">
                <div className="card-icon-wrapper cyan-bg">
                  <span className="card-emoji">💬</span>
                </div>
                <h3>WhatsApp sin responder</h3>
                <p>
                  Cada mensaje sin respuesta es un paciente que agenda con tu
                  competencia. El 62% no vuelve a escribir si no le contestan al
                  primer intento.
                </p>
                <div className="card-check">
                  <span className="check-icon">&#10003;</span>
                  <span className="check-text">
                    IA que contesta y agenda 24/7
                  </span>
                </div>
              </div>

              {/* Card 2: Citas */}
              <div className="problem-card panel">
                <div className="card-icon-wrapper magenta-bg">
                  <span className="card-emoji">📅</span>
                </div>
                <h3>Citas que no llegan</h3>
                <p>
                  El ausentismo promedio en clinicas es del 30%. Sin
                  confirmacion automatica, tu agenda queda con huecos que no
                  puedes llenar.
                </p>
                <div className="card-check">
                  <span className="check-icon">&#10003;</span>
                  <span className="check-text">
                    Confirmacion automatica por WhatsApp
                  </span>
                </div>
              </div>

              {/* Card 3: Fichas */}
              <div className="problem-card panel">
                <div className="card-icon-wrapper cyan-bg">
                  <span className="card-emoji">📄</span>
                </div>
                <h3>Fichas en papel o Excel</h3>
                <p>
                  Informacion perdida, imposible de buscar, y sin respaldo. Un
                  riesgo para tus pacientes y para tu clinica.
                </p>
                <div className="card-check">
                  <span className="check-icon">&#10003;</span>
                  <span className="check-text">
                    Fichas digitales seguras en la nube
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            How It Works Section
            ================================================================ */}
        <section className="section how-it-works">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-tag">COMO FUNCIONA</span>
              <h2 className="section-title">Activa tu clinica en 3 pasos</h2>
              <p className="section-subtitle">
                Configuralo todo tu mismo, Sin contratos, En menos de 24 horas
                tu IA podria estar atendiendo.
              </p>
            </div>

            <div className="steps-grid">
              <div className="step-card panel">
                <span className="step-tag">PASO 01</span>
                <div className="step-icon">👤+</div>
                <h3>Crea tu cuenta</h3>
                <p>
                  Registrate facil en 2 minutos. Configura tu clinica, servicios
                  y horarios disponibles.
                </p>
              </div>

              <div className="step-card panel">
                <span className="step-tag">PASO 02</span>
                <div className="step-icon">💬</div>
                <h3>Conecta WhatsApp</h3>
                <p>
                  Despierta a tu Agente IA. Con nuestro paso a paso activaras tu
                  Whatsapp Api.
                </p>
              </div>

              <div className="step-card panel">
                <span className="step-tag">PASO 03</span>
                <div className="step-icon">✅</div>
                <h3>Recibe citas automaticas</h3>
                <p>
                  Tu IA responde 24/7, agenda citas y envia confirmaciones. Tu
                  solo atiende.
                </p>
              </div>
            </div>

            {/* Highlights Banner */}
            <div className="highlights-banner panel mt-48">
              <div className="highlights-grid">
                {/* Left: Video */}
                <div className="highlights-video-container">
                  <span className="highlights-tag">CASOS DE EXITO REALES</span>
                  <div className="testimonial-video-inline">
                    <iframe
                      src="https://www.youtube.com/embed/wfO1YlVy48c"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Testimonio Metodo Hebe"
                    />
                  </div>
                </div>

                {/* Right: Reviews & CTA */}
                <div className="highlights-cta">
                  <div className="mini-reviews">
                    {/* Review 1 */}
                    <div className="mini-review">
                      <Image
                        src="/images/km.png"
                        alt="Dra. Katherin Meza"
                        width={40}
                        height={40}
                        className="review-avatar"
                      />
                      <div className="review-content">
                        <h5>Dra. Katherin Meza</h5>
                        <div className="review-stars">★★★★★</div>
                        <p className="review-text">
                          &ldquo;Por fin tengo tiempo para mis pacientes y no
                          para responder mensajes todo el dia.&rdquo;
                        </p>
                      </div>
                    </div>
                    {/* Review 2 */}
                    <div className="mini-review">
                      <Image
                        src="/images/cd.png"
                        alt="Central Dent"
                        width={40}
                        height={40}
                        className="review-avatar"
                      />
                      <div className="review-content">
                        <h5>Central Dent</h5>
                        <div className="review-stars">★★★★★</div>
                        <p className="review-text">
                          &ldquo;Redujimos las ausencias al 5% gracias a las
                          confirmaciones automaticas.&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="cta-bottom">
                    <h3>Lleva tu clinica al siguiente nivel</h3>
                    <Link href="/planes" className="btn btn-gradient btn-lg">
                      Prueba Gratis
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            Features Section
            ================================================================ */}
        <section className="section features-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">TODO LO QUE NECESITAS</span>
              <h2 className="section-title">
                Una plataforma, cero dolores de cabeza
              </h2>
            </div>

            <div className="features-grid">
              <div className="feature-card panel">
                <div className="feature-icon">💬</div>
                <h3>IA que agenda por WhatsApp</h3>
                <p>
                  AURA atiende a tus pacientes, ofrece horarios disponibles y
                  agenda citas — todo automatico, todo por WhatsApp.
                </p>
              </div>
              <div className="feature-card panel">
                <div className="feature-icon">⚡</div>
                <h3>Confirmacion automatica</h3>
                <p>
                  Recordatorios y confirmaciones de citas por WhatsApp. Reduce
                  el ausentismo hasta un 70% sin mover un dedo.
                </p>
              </div>
              <div className="feature-card panel">
                <div className="feature-icon">📅</div>
                <h3>Agenda inteligente</h3>
                <p>
                  Gestiona horarios de todos tus profesionales. Bloquea, mueve y
                  visualiza citas en un calendario moderno.
                </p>
              </div>
              <div className="feature-card panel">
                <div className="feature-icon">📄</div>
                <h3>Fichas medicas digitales</h3>
                <p>
                  Plantillas personalizables por especialidad. Toda la info del
                  paciente segura en la nube, accesible desde cualquier lugar.
                </p>
              </div>
              <div className="feature-card panel">
                <div className="feature-icon">👥</div>
                <h3>Multi-profesional</h3>
                <p>
                  Gestiona la agenda de todos los profesionales de tu clinica
                  desde un solo lugar. Cada uno con su configuracion.
                </p>
              </div>
              <div className="feature-card panel">
                <div className="feature-icon">🔒</div>
                <h3>Seguridad de datos</h3>
                <p>
                  Datos encriptados, servidores seguros y cumplimiento con
                  normativas de proteccion de datos de salud.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            CTA Banner
            ================================================================ */}
        <section className="section">
          <div className="container">
            <div className="cta-banner">
              <h2>¿Listo para modernizar tu gestion?</h2>
              <p>
                Unete a las clinicas que ya estan automatizando sus operaciones
                con inteligencia artificial.
              </p>
              <div className="banner-actions">
                <Link href="/planes" className="btn btn-primary">
                  Conoce nuestros planes
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TODO: App Download Modal (client component) */}
      </main>

      <Footer />
    </>
  );
}
