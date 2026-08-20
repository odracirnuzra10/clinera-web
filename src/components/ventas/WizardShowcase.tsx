"use client";

import HeroCarousel from "@/components/plataforma/HeroCarousel";
import { ACTIONS, FeatureIcon, INPUTS } from "@/components/plataforma/AuraNetwork";
import { ANNUAL_DISCOUNT_PERCENT, CLINERA_PLANS, SETUP_FEE_NUMBER } from "@/content/pricing";
import styles from "./WizardShowcase.module.css";

/* La columna izquierda de /agenda: el argumento de venta que antes vivía en
   /plataforma, sincronizado con el paso del wizard.
 *
 * Por qué acá y no dentro de la tarjeta del wizard: AURA y el carrusel de
 * producto son piezas anchas (AuraNetwork es una grilla de tres columnas), y
 * meterlas en una tarjeta de ~500px obliga a rehacerlas. Dejándolas al lado, el
 * wizard queda compacto y la pregunta del paso siempre visible sin scroll. En
 * móvil la columna se apila encima del wizard, que es el orden que se pidió:
 * primero la información, después la pregunta.
 *
 * Los datos NO se copian: INPUTS/ACTIONS salen de AuraNetwork y los precios de
 * pricing.ts, que es la fuente única (ver AGENTS.md).
 */

/** El plan más barato manda el "desde": nunca escribas el número a mano. */
const PRECIO_DESDE = Math.min(...CLINERA_PLANS.map((p) => p.monthlyPrice));

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className={styles.eyebrow}>{children}</span>;
}

function AuraMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" width="34" height="34" fill="none">
      <path
        d="M32 7c3.2 14.2 10.8 21.8 25 25-14.2 3.2-21.8 10.8-25 25C28.8 42.8 21.2 35.2 7 32 21.2 28.8 28.8 21.2 32 7Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ---------- Paso 1 — el sistema operativo y AURA ---------- */
function PasoSistemaOperativo() {
  return (
    <div className={styles.panel}>
      <Eyebrow>Todo conectado · una sola IA</Eyebrow>
      <h2 className={styles.title}>
        Todas las operaciones de tu clínica, bajo un mismo{" "}
        <em>sistema operativo con IA.</em>
      </h2>

      <div className={styles.auraGrid}>
        <div className={styles.feeds}>
          <span className={styles.columnLabel}>Cada sede alimenta la IA</span>
          <div className={styles.chipGrid}>
            {INPUTS.map((item) => (
              <span key={item.title} className={styles.chip}>
                <i>
                  <FeatureIcon name={item.icon} />
                </i>
                {item.title}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.core} aria-label="AURA, núcleo de inteligencia artificial">
          <span className={styles.orb}>
            <AuraMark />
          </span>
          <strong>AURA</strong>
          <small>Núcleo IA</small>
        </div>
      </div>

      <div className={styles.doesBlock}>
        <span className={styles.columnLabel}>La IA ejecuta por ti</span>
        <ul className={styles.actionList}>
          {ACTIONS.map((item) => (
            <li key={item.title}>
              <i>
                <FeatureIcon name={item.icon} />
              </i>
              <span>
                <strong>{item.title}</strong>
                <small>{item.copy}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Paso 2 — Intelligence y las fichas ---------- */
// Un solo paso para las dos capacidades: Intelligence lee la operación y las
// fichas son de dónde la lee. Separarlas costaba un paso extra sin ganar nada.
const VISTAS_PASO_2 = ["intelligence", "ficha", "odonto", "corporal"] as const;

function PasoIntelligence() {
  return (
    <div className={styles.panel}>
      <Eyebrow>Clinera Intelligence · ficha integral</Eyebrow>
      <h2 className={styles.title}>
        Un agente que <em>lee tu operación</em> y una ficha para cada
        especialidad.
      </h2>
      <p className={styles.lead}>
        Intelligence se conecta con tus ventas, tu agenda y tus pacientes para
        responderte sin planillas. Debajo, la ficha clínica, el odontograma y la
        ficha corporal sostienen el historial completo.
      </p>
      <div className={styles.carousel}>
        <HeroCarousel only={VISTAS_PASO_2} />
      </div>
    </div>
  );
}

/* ---------- Paso 3 — la inversión ---------- */
function PasoInversion() {
  const desde = PRECIO_DESDE;
  return (
    <div className={styles.panel}>
      <Eyebrow>Planes y condiciones</Eyebrow>
      <h2 className={styles.title}>
        Desde <em>USD {desde} al mes.</em>
      </h2>
      <p className={styles.lead}>
        Sin sorpresas en la reunión: estas son las condiciones con las que
        trabajamos.
      </p>
      <ul className={styles.factList}>
        <li>
          <strong>USD {desde}/mes</strong>
          <small>Plan de entrada. Atlas y Summit suman canales y sedes.</small>
        </li>
        <li>
          <strong>{ANNUAL_DISCOUNT_PERCENT}% OFF anual</strong>
          <small>Anticipando el año, con la implementación incluida.</small>
        </li>
        <li>
          <strong>USD {SETUP_FEE_NUMBER} de implementación</strong>
          <small>Pago único. Gratis si contratas el plan anual.</small>
        </li>
        <li>
          <strong>Permanencia de 6 meses</strong>
          <small>Migración de tus datos y capacitación incluidas.</small>
        </li>
      </ul>
    </div>
  );
}

/* ---------- Paso 4 — la reunión ---------- */
function PasoReunion({ meetingMinutes }: { meetingMinutes: number }) {
  return (
    <div className={styles.panel}>
      <Eyebrow>Último paso</Eyebrow>
      <h2 className={styles.title}>
        Te mostramos <em>tu clínica</em> dentro de Clinera.
      </h2>
      <p className={styles.lead}>
        {meetingMinutes} minutos por videollamada, con tus sedes, tu equipo y tus
        procesos reales sobre la mesa.
      </p>
      <ul className={styles.factList}>
        <li>
          <strong>Revisamos tu operación</strong>
          <small>Qué se migra desde tu sistema actual y en qué plazo.</small>
        </li>
        <li>
          <strong>Vemos el producto en vivo</strong>
          <small>Agenda, fichas, WhatsApp con IA y reportes.</small>
        </li>
        <li>
          <strong>Cerramos números</strong>
          <small>Plan, implementación y calendario, sin letra chica.</small>
        </li>
      </ul>
    </div>
  );
}

export default function WizardShowcase({
  step,
  meetingMinutes,
}: {
  step: number;
  meetingMinutes: number;
}) {
  if (step <= 1) return <PasoSistemaOperativo />;
  if (step === 2) return <PasoIntelligence />;
  if (step === 3) return <PasoInversion />;
  return <PasoReunion meetingMinutes={meetingMinutes} />;
}
