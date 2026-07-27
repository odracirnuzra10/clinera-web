"use client";

import Link from "next/link";
import { useState } from "react";
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
  },
  {
    name: "Summit",
    monthlyPrice: "479",
    semesterListPrice: "2.874",
    semesterPrice: "2.299,20",
    monthlyEquivalent: "383,20",
    audience: "Grupos clínicos que necesitan control central.",
    detail: "Texto + voz + API · 25 usuarios · sedes ilimitadas",
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
            La permanencia mínima es de 6 meses. Puedes pagar mensualmente o anticipar el semestre
            completo con 20% de descuento.
          </p>
        </div>

        <div className={styles.billingSwitch} role="group" aria-label="Frecuencia de pago">
          <button
            type="button"
            className={!isSemester ? styles.active : ""}
            aria-pressed={!isSemester}
            onClick={() => setBillingMode("monthly")}
          >
            Mensual
          </button>
          <button
            type="button"
            className={isSemester ? styles.active : ""}
            aria-pressed={isSemester}
            onClick={() => setBillingMode("semester")}
          >
            Semestral
            <span>20% OFF</span>
          </button>
        </div>

        <div className={styles.billingStatus} aria-live="polite">
          <span>{isSemester ? "Pago semestral seleccionado" : "Pago mensual seleccionado"}</span>
          <strong>{isSemester ? "20% OFF aplicado al total de 6 meses" : "Facturación mensual durante 6 meses"}</strong>
          <small>Permanencia mínima: 6 meses</small>
        </div>

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
                    <strong>USD {plan.semesterPrice}</strong>
                    <small>/ 6 meses</small>
                  </div>
                  <span className={styles.equivalent}>Equivale a USD {plan.monthlyEquivalent}/mes</span>
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

              <p>{plan.audience}</p>
              <div className={styles.detail}><Check />{plan.detail}</div>
              <span className={styles.commitment}>Permanencia mínima: 6 meses</span>
            </article>
          ))}
        </div>

        <div className={styles.action}>
          <p>El wizard define el plan correcto según tu software actual, sedes y volumen.</p>
          <Link href="/ventas">Ver mi plan <Arrow /></Link>
        </div>
      </div>
    </section>
  );
}
