"use client";

import Link from "next/link";
import { useState } from "react";
import SetupFeeBand from "@/components/cro/SetupFeeBand";
import { SETUP_FEE_NUMBER } from "@/content/pricing";
import styles from "./PlatformPricing.module.css";

const PLANS = [
  {
    name: "Atlas",
    monthlyPrice: "379",
    semesterListPrice: "2.274",
    semesterPrice: "1.819,20",
    monthlyEquivalent: "303,20",
    audience: "Clínicas con alto volumen o dos sedes.",
    detail: "Texto + voz · 15 usuarios · 2 sedes",
    monthlyCheckoutUrl: "https://buy.stripe.com/5kQ7sN40Nez08sP9471441v",
    semesterCheckoutUrl: "https://buy.stripe.com/3cIfZj7cZfD410ncgj1441y",
  },
  {
    name: "Summit",
    monthlyPrice: "479",
    semesterListPrice: "2.874",
    semesterPrice: "2.299,20",
    monthlyEquivalent: "383,20",
    audience: "Grupos clínicos que necesitan control central.",
    detail: "Texto + voz + API · 25 usuarios · sedes ilimitadas",
    monthlyCheckoutUrl: "https://buy.stripe.com/5kQ6oJbtf3UmdN94NR1441w",
    semesterCheckoutUrl: "https://buy.stripe.com/aFa8wR9l79eG10nbcf1441z",
    featured: true,
  },
  {
    name: "Corporativo",
    monthlyPrice: "1.900",
    semesterListPrice: "11.400",
    semesterPrice: "9.120",
    monthlyEquivalent: "1.520",
    audience: "Cadenas, redes y hospitales.",
    detail: "Capacidad a medida · SLA · integraciones",
    dark: true,
    quotedSetup: true,
  },
];

type BillingMode = "monthly" | "semester";

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17" fill="none">
      <path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PlatformPricing() {
  const [billingMode, setBillingMode] = useState<BillingMode>("semester");
  const isSemester = billingMode === "semester";

  return (
    <section className={styles.section} aria-labelledby="platform-pricing-title">
      <div className={styles.container}>
        <div className={styles.heading}>
          <span>Planes para operaciones con volumen</span>
          <h2 id="platform-pricing-title">Elige cómo pagar tus primeros 6 meses.</h2>
          <p>
            El semestral es la primera opción: anticipas 6 meses con 20% de descuento. También puedes
            pagar mensualmente, con permanencia mínima de 6 meses. A eso se suma un único costo de
            configuración inicial.
          </p>
        </div>

        <div className={styles.billingSwitch} role="group" aria-label="Frecuencia de pago">
          <button
            type="button"
            className={`${styles.preferredMode} ${isSemester ? styles.active : ""}`}
            aria-pressed={isSemester}
            onClick={() => setBillingMode("semester")}
          >
            <span className={styles.billingOption}>
              <strong>Semestral</strong>
              <small>Primera opción · 20% OFF</small>
            </span>
          </button>
          <button
            type="button"
            className={!isSemester ? styles.active : ""}
            aria-pressed={!isSemester}
            onClick={() => setBillingMode("monthly")}
          >
            <span className={styles.billingOption}>
              <strong>Mensual</strong>
              <small>Pago mes a mes</small>
            </span>
          </button>
        </div>

        <div className={styles.billingStatus} aria-live="polite">
          <span>{isSemester ? "Primera opción seleccionada" : "Pago mensual seleccionado"}</span>
          <strong>{isSemester ? "Semestral · 20% OFF aplicado al total de 6 meses" : "Mensual · facturación mes a mes durante 6 meses"}</strong>
          <small>Permanencia mínima: 6 meses</small>
        </div>

        <SetupFeeBand style={{ marginTop: 18 }} />

        <div className={styles.planGrid} aria-live="polite">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`${styles.planCard} ${plan.featured ? styles.featured : ""} ${plan.dark ? styles.dark : ""}`}
            >
              {plan.featured && <span className={styles.recommended}>Recomendado</span>}
              {isSemester && <span className={styles.discount}>20% OFF</span>}
              <span className={styles.planName}>{plan.name}</span>

              {isSemester ? (
                <>
                  <div className={styles.originalPrice}>
                    <span>6 mensualidades de USD {plan.monthlyPrice}</span>
                    <s>USD {plan.semesterListPrice}</s>
                  </div>
                  <div className={styles.price}>
                    <strong>USD {plan.monthlyEquivalent}</strong>
                    <small>/ mes</small>
                  </div>
                  <span className={styles.semesterTotal}>Total semestral: USD {plan.semesterPrice}</span>
                </>
              ) : (
                <>
                  <div className={styles.monthlyLabel}>Pago mensual</div>
                  <div className={styles.price}>
                    <strong>USD {plan.monthlyPrice}</strong>
                    <small>/ mes</small>
                  </div>
                  <span className={styles.equivalent}>Durante un mínimo de 6 meses</span>
                </>
              )}

              <div className={styles.implementationFee}>
                <strong>{plan.quotedSetup ? "A cotizar" : `+ USD ${SETUP_FEE_NUMBER}`}</strong>
                <span>de configuración inicial</span>
                <small>Pago único adicional</small>
              </div>

              <p>{plan.audience}</p>
              <div className={styles.detail}><Check />{plan.detail}</div>
              {isSemester && plan.semesterCheckoutUrl ? (
                <a
                  className={styles.planCta}
                  href={plan.semesterCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contratar {plan.name} semestral <Arrow />
                </a>
              ) : !isSemester && plan.monthlyCheckoutUrl ? (
                <a
                  className={styles.planCta}
                  href={plan.monthlyCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contratar {plan.name} mensual <Arrow />
                </a>
              ) : (
                <Link className={styles.planCta} href="/ventas">
                  Hablar con ventas <Arrow />
                </Link>
              )}
              <span className={styles.commitment}>Permanencia mínima: 6 meses</span>
            </article>
          ))}
        </div>

        <div className={styles.action}>
          <p>¿Necesitas ayuda para elegir? Revisamos tu software actual, sedes y volumen.</p>
          <Link href="/ventas">Hablar con ventas <Arrow /></Link>
        </div>
      </div>
    </section>
  );
}
