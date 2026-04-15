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
                    href="https://app.clinera.io/auth/register"
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
          </div>
        </section>
      </main>

      <Footer />
      <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
    </>
  );
}
