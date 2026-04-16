import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./demo.module.css";

export const metadata: Metadata = {
  title: "Demo del Software",
  description:
    "Mira la demo de Clinera.io en accion. Software de IA para clinicas que agenda pacientes automaticamente por WhatsApp.",
  openGraph: {
    url: "https://clinera.io/demo",
  },
};

const PLANS = [
  {
    name: "Growth",
    price: "59",
    tagline: "Mensajeria IA para clinicas que ya tienen software",
    features: [
      "150 conversaciones con IA/mes",
      "WhatsApp API",
      "Memoria contextual via LangChain",
      "3 usuarios incluidos",
    ],
    ctaClass: "secondary" as const,
    stripeUrl: "https://buy.stripe.com/00wcN79l7bmO9wT6VZ14415",
  },
  {
    name: "Conect",
    price: "89",
    tagline: "Mensajeria + clinica completa sin otro software",
    popular: true,
    features: [
      "500 conversaciones con IA/mes",
      "5 usuarios/profesionales",
      "Agenda medica con automatizaciones",
      "Fichas clinicas personalizables",
      "Panel centralizado de ventas",
    ],
    ctaClass: "primary" as const,
    stripeUrl: "https://buy.stripe.com/aFa9AV8h3ez07oL2FJ14416",
  },
  {
    name: "Advanced",
    price: "149",
    tagline: "Para cadenas clinicas multi-sede",
    features: [
      "2,000 conversaciones con IA/mes",
      "15 usuarios/profesionales",
      "Multi-sede",
      "Webhooks avanzados",
      "Soporte prioritario",
    ],
    ctaClass: "dark" as const,
    stripeUrl: "https://buy.stripe.com/4gM3cxapb9eG4cz1BF1441a",
  },
];

export default function DemoPage() {
  return (
    <>
      <Header />

      <main>
        {/* Video Section */}
        <section className={styles.videoSection}>
          <div className={styles.container}>
            <span className={styles.badge}>DEMO EN VIVO</span>
            <h1 className={styles.title}>
              Conoce Clinera.io en accion
            </h1>
            <p className={styles.subtitle}>
              Descubre como la IA agenda pacientes por WhatsApp, gestiona fichas
              clinicas y rastrea tus ventas en una sola plataforma.
            </p>

            <div className={styles.videoWrapper}>
              <iframe
                src="https://player.vimeo.com/video/1180590198?h=796514cf95&badge=0&autopause=0&player_id=0&app_id=58479"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                title="SOFTWARE DEMOSTRACION FINAL | CLINERA.IO"
                className={styles.videoIframe}
              />
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className={styles.plansSection}>
          <div className={styles.container}>
            <h2 className={styles.plansTitle}>Elige tu plan y activa hoy</h2>
            <p className={styles.plansSubtitle}>
              Sin permanencia. Sin costo de implementacion. Precios en USD.
            </p>

            <div className={styles.plansGrid}>
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ""}`}
                >
                  {plan.popular && (
                    <span className={styles.popularBadge}>MAS POPULAR</span>
                  )}
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <p className={styles.planTagline}>{plan.tagline}</p>
                  <div className={styles.planPrice}>
                    <span className={styles.planDollar}>$</span>
                    <span className={styles.planAmount}>{plan.price}</span>
                    <span className={styles.planPeriod}>USD/mes</span>
                  </div>
                  <ul className={styles.planFeatures}>
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <a
                    href={plan.stripeUrl}
                    className={`${styles.planCta} ${styles[`planCta_${plan.ctaClass}`]}`}
                  >
                    Prueba Gratis
                  </a>
                  <p className={styles.planCtaSub}>
                    Sin permanencia · Cancela en 1 click
                  </p>
                </div>
              ))}
            </div>

            {/* Add-ons */}
            <div className={styles.addons}>
              <h3 className={styles.addonsTitle}>Add-ons</h3>
              <div className={styles.addonsGrid}>
                <div className={styles.addonCard}>
                  <div className={styles.addonPrice}>
                    <span className={styles.addonAmount}>$15</span>
                    <span className={styles.addonPeriod}>/mes</span>
                  </div>
                  <p className={styles.addonDesc}>+100 conversaciones con IA</p>
                </div>
                <div className={styles.addonCard}>
                  <div className={styles.addonPrice}>
                    <span className={styles.addonAmount}>$9</span>
                    <span className={styles.addonPeriod}>/mes</span>
                  </div>
                  <p className={styles.addonDesc}>Profesional o usuario extra</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/56985581524"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.waFloat}
        aria-label="Contactar por WhatsApp"
      >
        <svg viewBox="0 0 32 32" fill="#fff" width="28" height="28">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.744 3.047 9.381L1.054 31.2l6.012-1.93a15.906 15.906 0 008.938 2.734C24.826 32.004 32 24.828 32 16.004 32 7.176 24.826 0 16.004 0zm9.305 22.617c-.39 1.1-2.283 2.103-3.156 2.162-.873.063-1.693.39-5.703-1.188-4.827-1.898-7.882-6.86-8.117-7.18-.235-.316-1.921-2.555-1.921-4.875 0-2.316 1.215-3.457 1.648-3.93.43-.472.94-.59 1.254-.59.313 0 .625.003.898.016.29.012.676-.11 1.059.808.39.937 1.332 3.254 1.449 3.488.117.235.195.508.04.82-.157.313-.235.508-.47.784-.234.274-.492.614-.703.824-.234.234-.477.489-.205.96.274.47 1.215 2.004 2.61 3.246 1.793 1.597 3.305 2.09 3.773 2.325.469.234.742.195 1.016-.118.273-.312 1.176-1.37 1.488-1.843.313-.469.625-.39 1.055-.234.43.156 2.742 1.293 3.211 1.527.469.235.781.352.898.547.117.195.117 1.133-.273 2.227z" />
        </svg>
      </a>

      <Footer />
      <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
    </>
  );
}
