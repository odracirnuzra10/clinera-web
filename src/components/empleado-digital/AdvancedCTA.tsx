import Link from "next/link";
import styles from "@/app/empleado-digital/empleado-digital.module.css";
import { stripeLink } from "@/content/pricing";

const STRIPE_SUMMIT = stripeLink("summit");

const BULLETS = [
  "46.000 créditos / mes · bolsa mensual de IA",
  "Una sola bolsa para texto, voz y agendamiento",
  "3 agentes de IA: AURA (texto) + CAMILA (voz) + LIA (fiscaliza)",
  "Agendamiento agéntico: la IA agenda sola dentro del chat",
  "Modelo orquestador de tools: Kimi K2.6",
  "Módulo clínico completo (agenda + fichas + Vault)",
  "Sucursales ilimitadas + panel de atribución",
  "Webhooks + API pública (integraciones a medida)",
  "25 usuarios / profesionales",
  "Soporte prioritario · onboarding dedicado",
];

export default function AdvancedCTA() {
  return (
    <section className={styles.ctaSection} aria-labelledby="cta-h2">
      <div className={styles.ctaCard}>
        <span className={styles.ctaBadge}>Recomendado · Summit</span>

        <h2 id="cta-h2" className={styles.ctaH2}>
          Estandariza tu operación con Summit
        </h2>

        <div className={styles.ctaPriceRow}>
          <span className={styles.ctaPrice}>USD 479</span>
          <span className={styles.ctaPriceUnit}>/ mes</span>
        </div>

        <ul className={styles.ctaBullets}>
          {BULLETS.map((b) => (
            <li key={b} className={styles.ctaBullet}>
              {b}
            </li>
          ))}
        </ul>

        <Link href="/hablar-con-ventas" className={styles.ctaButton}>
          Agendar demo
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <a
          href={STRIPE_SUMMIT}
          className={styles.ctaDemoLink}
          data-plan="summit"
          data-plan-value="479"
          data-plan-name="Summit checkout final empleado-digital"
        >
          Contratar Summit — USD 479/mes →
        </a>

        <p className={styles.ctaTrust}>
          Configuración inicial USD 450 (onboarding asistido), gratis en plan anual · Pago seguro vía Stripe
        </p>

        <Link href="/demo" className={styles.ctaDemoLink}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          Ver demo en video — 2 min
        </Link>

        <div className={styles.ctaSecondaryLinks}>
          <Link
            href="/planes"
            className={styles.ctaSecondaryLink}
            data-plan="atlas"
            data-plan-value="379"
            data-plan-name="Atlas view from empleado-digital"
          >
            Ver plan Atlas — USD 379/mes →
          </Link>
          <Link
            href="/planes"
            className={styles.ctaSecondaryLink}
            data-plan="vortex"
            data-plan-value="279"
            data-plan-name="Vortex view from empleado-digital"
          >
            Ver plan Vortex — USD 279/mes →
          </Link>
        </div>
      </div>
    </section>
  );
}
