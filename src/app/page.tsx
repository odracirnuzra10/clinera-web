import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroVisual from "@/components/HeroVisual";

export const metadata: Metadata = {
  title: "Clinera.io | Software clínico con IA · Agenda, WhatsApp y fichas",
  description:
    "AURA atiende WhatsApp, agenda en tu calendario y confirma citas 24/7. Tu clínica responde, agenda y confirma pacientes sin que tú hagas nada.",
  alternates: { canonical: "https://clinera.io/" },
  openGraph: {
    url: "https://clinera.io/",
    title: "Clinera.io — La IA que atiende, agenda y confirma pacientes",
    description:
      "Tu clínica responde, agenda y confirma pacientes 24/7 con IA. Sin que tú hagas nada.",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Clinera.io",
  url: "https://clinera.io",
  logo: "https://clinera.io/images/clinera-logo.svg",
  sameAs: [
    "https://cl.linkedin.com/company/clinera-io",
    "https://www.instagram.com/clinera.io",
    "https://www.youtube.com/channel/UCl4Bh9sNp22PjJuSLgz9ZsQ",
  ],
};

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Clinera",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "Software clínico con IA que atiende WhatsApp, agenda pacientes y mantiene tu calendario lleno 24/7.",
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
    ratingValue: "4.8",
    ratingCount: "500",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />

      <Header />

      <main>
        {/* ============================================================
            SECTION 1 — HERO (light)
           ============================================================ */}
        <section className="hero-v2">
          <div className="hero-v2__halo" aria-hidden />
          <div className="container hero-v2__grid">
            <div>
              <span className="hero-v2__eyebrow">
                <span className="hero-v2__dot" aria-hidden />
                AURA · Agente IA activo 24/7
              </span>
              <h1 className="hero-v2__title">
                Tu clínica responde, agenda y confirma pacientes{" "}
                <span className="gt">24/7 con IA</span>. Sin que tú hagas nada.
              </h1>
              <p className="hero-v2__sub">
                AURA atiende WhatsApp, agenda en tu calendario y confirma citas
                automáticamente. Tu equipo se enfoca en pacientes, no en mensajes.
              </p>
              <div className="hero-v2__actions">
                <Link href="/inicia" className="hero-v2__primary">
                  Prueba gratis 7 días
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/demo" className="hero-v2__secondary">
                  Ver demo completo (12 min) →
                </Link>
              </div>
              <div className="hero-v2__trust">
                <div className="avatar-group" aria-hidden>
                  <span className="avatar-plus" style={{ background: "linear-gradient(135deg,#009FE3,#7C3AED)", marginLeft: 0 }}>KM</span>
                  <span className="avatar-plus" style={{ background: "linear-gradient(135deg,#7C3AED,#C850C0)" }}>CD</span>
                  <span className="avatar-plus" style={{ background: "linear-gradient(135deg,#C850C0,#009FE3)" }}>JR</span>
                  <span className="avatar-plus">+</span>
                </div>
                <span className="hero-v2__trust-text">
                  <strong>+500 médicos</strong> en 10 países confían en Clinera
                </span>
              </div>
            </div>

            <HeroVisual />
          </div>
        </section>

        {/* ============================================================
            TRUST STRIP — Partnerships & Certifications
           ============================================================ */}
        <section className="trust-strip" aria-label="Partnerships y certificaciones">
          <div className="container">
            <div className="trust-strip__inner">
              <span className="trust-strip__label">Partnerships y certificaciones</span>
              <div className="trust-strip__logos">
                <a
                  href="https://www.facebook.com/business/partner-directory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="trust-strip__badge"
                  aria-label="Clinera es Meta Business Partner"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/badges/meta-business-partner.svg"
                    alt="Meta Business Partner — Clinera.io"
                    width={240}
                    height={72}
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 2 — PROBLEM (DARK NEON)
           ============================================================ */}
        <section className="section-dark">
          <div className="dark-halo-top-left" aria-hidden />
          <div className="container">
            <div className="section-header">
              <span className="section-tag">EL PROBLEMA</span>
              <h2 className="section-title">
                Lo que le está costando a tu clínica cada día
              </h2>
              <p className="section-subtitle">
                Mientras no automatizas, tu clínica pierde pacientes, tiempo y
                dinero. Los números hablan solos.
              </p>
            </div>

            <div className="pain-grid">
              <article className="pain-card pain-card--cyan">
                <div className="pain-card__number">30%</div>
                <h3 className="pain-card__label">De pacientes no llegan</h3>
                <p className="pain-card__desc">
                  El no-show te quita 1 de cada 3 citas. Sin recordatorios
                  automáticos, tu agenda nunca está llena de verdad.
                </p>
              </article>

              <article className="pain-card pain-card--violet">
                <div className="pain-card__number">2h</div>
                <h3 className="pain-card__label">Perdidas al día</h3>
                <p className="pain-card__desc">
                  Tu recepción contesta 200+ mensajes y arma agendas a mano.
                  Tiempo que podría dedicarse a pacientes reales.
                </p>
              </article>

              <article className="pain-card pain-card--magenta">
                <div className="pain-card__number">62%</div>
                <h3 className="pain-card__label">No vuelve</h3>
                <p className="pain-card__desc">
                  Sin seguimiento automatizado, más de la mitad de tus pacientes
                  no regresa. Es revenue que se va por la puerta.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 3 — WHATSAPP COEXIST VIDEO (light)
           ============================================================ */}
        <section className="section">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-tag">TU MISMO WHATSAPP</span>
              <h2 className="section-title">
                Utiliza tu actual número de WhatsApp para conectarlo a Clinera
              </h2>
              <p className="section-subtitle">
                No cambies de número ni migres conversaciones. AURA atiende en
                el mismo WhatsApp que ya usas, en paralelo con tu equipo.
              </p>
            </div>

            <div className="video-vimeo-wrap">
              <iframe
                src="https://player.vimeo.com/video/1184854869?badge=0&autopause=0&player_id=0&app_id=58479"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                title="WhatsApp API Business coexistencia — Clinera"
                loading="lazy"
              />
            </div>

            <p className="video-link-below">
              ¿Quieres el demo completo?{" "}
              <Link href="/demo">Ver demo de 12 minutos →</Link>
            </p>
          </div>
        </section>

        {/* ============================================================
            SECTION 4 — HOW IT WORKS (light)
           ============================================================ */}
        <section className="section" style={{ background: "var(--surface-1)" }}>
          <div className="container">
            <div className="section-header text-center">
              <span className="section-tag">CÓMO FUNCIONA</span>
              <h2 className="section-title">Configurarlo toma menos de 1 hora</h2>
              <p className="section-subtitle">
                Sin programador, sin integraciones complejas. Tu clínica
                atendiendo 24/7 esta misma semana.
              </p>
            </div>

            <div className="steps-v2">
              <div className="step-v2">
                <div className="step-v2__num">01</div>
                <h3 className="step-v2__title">Conectas tu WhatsApp Business</h3>
                <p className="step-v2__desc">
                  AURA empieza a leer y responder mensajes de inmediato. Sin
                  cambiar de número.
                </p>
              </div>
              <div className="step-v2">
                <div className="step-v2__num">02</div>
                <h3 className="step-v2__title">AURA aprende tu agenda y servicios</h3>
                <p className="step-v2__desc">
                  Le cuentas disponibilidad, servicios y precios. Lista en
                  minutos.
                </p>
              </div>
              <div className="step-v2">
                <div className="step-v2__num">03</div>
                <h3 className="step-v2__title">Empieza a atender 24/7</h3>
                <p className="step-v2__desc">
                  Pacientes agendan solos. Tú ves tu calendario llenarse en
                  tiempo real.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 5 — TESTIMONIALS (light, surface-1)
           ============================================================ */}
        <section className="testimonial-section">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-tag">RESULTADOS REALES</span>
              <h2 className="section-title">Lo que dicen nuestras clínicas</h2>
              <p className="section-subtitle">
                Médicos y clínicas en 10 países usan Clinera todos los días para
                atender, agendar y confirmar pacientes.
              </p>
            </div>

            <div className="testimonial-carousel-wrap">
              <div className="testimonial-carousel">
                <article className="testimonial-card-v2">
                  <div className="testimonial-card-v2__stars" aria-label="5 de 5 estrellas">★★★★★</div>
                  <p className="testimonial-card-v2__quote">
                    &ldquo;Por fin tengo tiempo para mis pacientes. AURA contesta
                    incluso cuando estoy en consulta o durmiendo. La diferencia
                    se nota en la agenda desde la primera semana.&rdquo;
                  </p>
                  <span className="testimonial-card-v2__metric">
                    No-shows: 30% → 5%
                  </span>
                  <div className="testimonial-card-v2__author">
                    <span className="testimonial-card-v2__avatar">KM</span>
                    <div className="testimonial-card-v2__meta">
                      <span className="testimonial-card-v2__name">Dra. Katherin Meza</span>
                      <span className="testimonial-card-v2__role">Clínica Estética · Santiago</span>
                    </div>
                  </div>
                </article>

                <article className="testimonial-card-v2">
                  <div className="testimonial-card-v2__stars" aria-label="5 de 5 estrellas">★★★★★</div>
                  <p className="testimonial-card-v2__quote">
                    &ldquo;Pasamos de perder mensajes todo el día a tener un
                    equipo enfocado en pacientes. AURA nos reemplazó a media
                    recepción sin reemplazar a nadie.&rdquo;
                  </p>
                  <span className="testimonial-card-v2__metric">
                    Citas agendadas: +2.4×
                  </span>
                  <div className="testimonial-card-v2__author">
                    <span className="testimonial-card-v2__avatar">CD</span>
                    <div className="testimonial-card-v2__meta">
                      <span className="testimonial-card-v2__name">Central Dent</span>
                      <span className="testimonial-card-v2__role">Clínica Dental · Multiclínica</span>
                    </div>
                  </div>
                </article>

                <article className="testimonial-card-v2">
                  <div className="testimonial-card-v2__stars" aria-label="5 de 5 estrellas">★★★★★</div>
                  <p className="testimonial-card-v2__quote">
                    &ldquo;Configuramos AURA en una tarde. Al día siguiente ya
                    estaba agendando consultas por WhatsApp. Mi recepción
                    respira y los pacientes llegan confirmados.&rdquo;
                  </p>
                  <span className="testimonial-card-v2__metric">
                    Respuesta: 24/7
                  </span>
                  <div className="testimonial-card-v2__author">
                    <span className="testimonial-card-v2__avatar">JR</span>
                    <div className="testimonial-card-v2__meta">
                      <span className="testimonial-card-v2__name">Dr. Jorge Rojas</span>
                      <span className="testimonial-card-v2__role">Medicina General · Ciudad de México</span>
                    </div>
                  </div>
                </article>

                <article className="testimonial-card-v2">
                  <div className="testimonial-card-v2__stars" aria-label="5 de 5 estrellas">★★★★★</div>
                  <p className="testimonial-card-v2__quote">
                    &ldquo;Clinera nos simplificó las comunicaciones con
                    pacientes y el seguimiento de marketing. Recuperamos horas
                    todos los días.&rdquo;
                  </p>
                  <span className="testimonial-card-v2__metric">
                    Comunicaciones unificadas
                  </span>
                  <div className="testimonial-card-v2__author">
                    <span className="testimonial-card-v2__avatar">TO</span>
                    <div className="testimonial-card-v2__meta">
                      <span className="testimonial-card-v2__name">Tamara Oyarzún · CEO</span>
                      <span className="testimonial-card-v2__role">Protocolo Lumina</span>
                    </div>
                  </div>
                </article>

                <article className="testimonial-card-v2">
                  <div className="testimonial-card-v2__stars" aria-label="5 de 5 estrellas">★★★★★</div>
                  <p className="testimonial-card-v2__quote">
                    &ldquo;Clinera me permite crecer sin pagar más en marketing.
                    AURA atiende el WhatsApp y llena la agenda por mí.&rdquo;
                  </p>
                  <span className="testimonial-card-v2__metric">
                    -71% costos marketing
                  </span>
                  <div className="testimonial-card-v2__author">
                    <span className="testimonial-card-v2__avatar">FR</span>
                    <div className="testimonial-card-v2__meta">
                      <span className="testimonial-card-v2__name">Dr. Flavio Rojas</span>
                      <span className="testimonial-card-v2__role">infiltraciones.cl</span>
                    </div>
                  </div>
                </article>
              </div>
              <div className="testimonial-carousel__hint" aria-hidden>← Desliza para ver más →</div>
            </div>

            <p className="video-link-below">
              <Link href="/demo">Ver todos los casos de éxito →</Link>
            </p>
          </div>
        </section>

        {/* ============================================================
            SECTION 6 — PRICING TEASER (DARK NEON)
           ============================================================ */}
        <section className="section-dark">
          <div className="dark-halo-center" aria-hidden />
          <div className="container">
            <div className="section-header text-center">
              <span className="section-tag">PLANES</span>
              <h2 className="section-title">Planes simples, sin sorpresas</h2>
              <p className="section-subtitle">
                Empieza gratis 7 días. Elige tu plan cuando estés listo. Sin
                contratos, cancela cuando quieras.
              </p>
            </div>

            <div className="pricing-grid">
              <article className="pricing-card-dark">
                <div className="pricing-card-dark__name">Growth</div>
                <div className="pricing-card-dark__price">
                  <span className="pricing-card-dark__amount">$59</span>
                  <span className="pricing-card-dark__period">USD / mes</span>
                </div>
                <p className="pricing-card-dark__tagline">
                  Mensajería IA para clínicas que ya tienen software.
                </p>
                <ul className="pricing-card-dark__features">
                  <li>150 conversaciones con IA / mes</li>
                  <li>WhatsApp API</li>
                  <li>Memoria contextual vía LangChain</li>
                  <li>Derivación automática a humano</li>
                  <li>Integración vía API y MCP</li>
                  <li>3 usuarios incluidos</li>
                </ul>
                <Link
                  href="/inicia?plan=growth"
                  className="pricing-card-dark__cta pricing-card-dark__cta--secondary"
                >
                  Prueba gratis
                </Link>
              </article>

              <article className="pricing-card-dark pricing-card-dark--featured">
                <span className="pricing-card-dark__badge">Popular</span>
                <div className="pricing-card-dark__name">Conect</div>
                <div className="pricing-card-dark__price">
                  <span className="pricing-card-dark__amount">$89</span>
                  <span className="pricing-card-dark__period">USD / mes</span>
                </div>
                <p className="pricing-card-dark__tagline">
                  Mensajería + clínica completa sin otro software.
                </p>
                <ul className="pricing-card-dark__features">
                  <li>500 conversaciones / mes</li>
                  <li>5 usuarios</li>
                  <li>Agenda médica</li>
                  <li>Fichas clínicas</li>
                  <li>Consentimientos informados</li>
                  <li>Clinera Vault</li>
                  <li>Panel ventas</li>
                  <li>Trazabilidad campaña-cita-venta</li>
                </ul>
                <Link
                  href="/inicia?plan=conect"
                  className="pricing-card-dark__cta pricing-card-dark__cta--primary"
                >
                  Prueba gratis
                </Link>
              </article>

              <article className="pricing-card-dark">
                <div className="pricing-card-dark__name">Advanced</div>
                <div className="pricing-card-dark__price">
                  <span className="pricing-card-dark__amount">$149</span>
                  <span className="pricing-card-dark__period">USD / mes</span>
                </div>
                <p className="pricing-card-dark__tagline">
                  Para cadenas clínicas multi-sede.
                </p>
                <ul className="pricing-card-dark__features">
                  <li>2.000 conversaciones / mes</li>
                  <li>15 usuarios</li>
                  <li>Multi-sede</li>
                  <li>Webhooks avanzados</li>
                  <li>Soporte prioritario</li>
                  <li>Onboarding dedicado</li>
                </ul>
                <Link
                  href="/inicia?plan=advanced"
                  className="pricing-card-dark__cta pricing-card-dark__cta--secondary"
                >
                  Prueba gratis
                </Link>
              </article>
            </div>

            <p className="pricing-link-below">
              <Link href="/planes">Ver detalle completo de planes →</Link>
            </p>
          </div>
        </section>

        {/* ============================================================
            SECTION 7 — FINAL CTA (DARK NEON)
           ============================================================ */}
        <section className="section-dark">
          <div className="dark-halo-top-left" aria-hidden />
          <div className="dark-halo-bottom-right" aria-hidden />
          <div className="container">
            <div className="cta-final-dark">
              <h2 className="cta-final-dark__title">
                Empieza gratis hoy.
                <br />
                <span className="gt-neon">Sin tarjeta de crédito.</span>
              </h2>
              <p className="cta-final-dark__sub">
                Prueba Clinera 7 días. Si no ves resultados, te ayudamos a
                configurarlo o cancelas sin costo. Simple.
              </p>
              <div className="cta-final-dark__actions">
                <Link href="/inicia" className="cta-final-dark__primary">
                  Prueba gratis 7 días
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/demo" className="cta-final-dark__secondary">
                  Agendar demo con un humano
                </Link>
              </div>
              <div className="trust-row">
                <span className="trust-row__item">
                  <svg className="trust-row__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Setup en menos de 1 hora
                </span>
                <span className="trust-row__item">
                  <svg className="trust-row__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Soporte en español
                </span>
                <span className="trust-row__item">
                  <svg className="trust-row__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Datos encriptados y cumplimiento
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
