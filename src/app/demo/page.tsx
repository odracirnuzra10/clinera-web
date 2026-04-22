import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./demo.module.css";

export const metadata: Metadata = {
  title: "Demo Clinera — Software clínico con IA en acción",
  description:
    "Mira cómo AURA agenda pacientes por WhatsApp 24/7. Demo completo de Clinera.io: agenda, ficha clínica, confirmaciones automáticas y analytics.",
  alternates: { canonical: "https://clinera.io/demo" },
  openGraph: {
    url: "https://clinera.io/demo",
    title: "Demo Clinera — Software clínico con IA en acción",
    description:
      "AURA atiende WhatsApp 24/7 y llena tu agenda sola. Mira el demo.",
    type: "website",
  },
};

const PLANS = [
  {
    name: "Growth",
    slug: "growth",
    price: "89",
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
    slug: "conect",
    price: "129",
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
    slug: "advanced",
    price: "179",
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
                  <Link
                    href="/ventas"
                    className={`${styles.planCta} ${styles[`planCta_${plan.ctaClass}`]}`}
                    data-plan={plan.slug}
                    data-plan-value={plan.price}
                    data-plan-name={`${plan.name} talk-to-sales`}
                  >
                    Hablar con ventas
                  </Link>
                  <a
                    href={plan.stripeUrl}
                    target="_blank"
                    rel="noopener"
                    className={styles.planCtaSecondary}
                    data-plan={plan.slug}
                    data-plan-value={plan.price}
                    data-plan-name={`${plan.name} pay`}
                  >
                    Activar plan →
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

      <Footer />
    </>
  );
}
