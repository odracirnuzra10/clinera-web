import Link from "next/link";
import { ReactNode } from "react";
import styles from "./IntelligenceSection.module.css";

/* ============================================================
   Clinera Intelligence — secciones de marketing
   · IntelligenceHomeSection: destacado en el home
   · IntelligencePlataformaSection: "cómo funciona" en /plataforma
   Mockup del chat recreado en HTML/CSS + SVG inline (sin imágenes).
   Un solo acento: violeta #7C3AED.
   ============================================================ */

function SparkIcon({ size = 12 }: { size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width={size} height={size} fill="none">
      <path
        d="M8 1.8c.5 3 1.9 4.7 4.7 5.7.4.1.4.9 0 1-2.8 1-4.2 2.7-4.7 5.7-.5-3-1.9-4.7-4.7-5.7-.4-.1-.4-.9 0-1C6.1 6.5 7.5 4.8 8 1.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" fill="none">
      <path
        d="m5 10.5 3.2 3L15 6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17" fill="none">
      <path
        d="M4 10h11M11 6l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="13" height="13" fill="none">
      <path
        d="M8 13V3M3.8 7.2 8 3l4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------
   Ventana de chat (marco compartido)
   ------------------------------------------------------------ */
function ChatWindow({ children, extra }: { children: ReactNode; extra?: ReactNode }) {
  return (
    <div className={styles.chat} aria-label="Vista del chat Clinera Intelligence">
      <div className={styles.chatBar}>
        <span className={styles.chatDots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.chatTitle}>Clinera Intelligence</span>
        <span className={styles.chatCredits}>
          <SparkIcon size={10} /> Créditos IA
        </span>
      </div>
      {extra}
      <div className={styles.chatBody}>{children}</div>
      <div className={styles.chatInput}>
        <span>Pregúntale a tu clínica…</span>
        <i aria-hidden="true">
          <SendIcon />
        </i>
      </div>
    </div>
  );
}

function AiHead() {
  return (
    <span className={styles.aiHead}>
      <SparkIcon /> Clinera Intelligence
    </span>
  );
}

/* ------------------------------------------------------------
   Mockup 1 — Ventas del mes (donut + barras cobrado/pendiente)
   ------------------------------------------------------------ */
function VentasDonut() {
  // r = 36 → circunferencia 226.2 · Pagadas 86% → arco 194.5
  return (
    <svg viewBox="0 0 96 96" className={styles.donut} role="img" aria-label="Distribución de ventas: pagadas 86 por ciento, parciales 14 por ciento">
      <circle cx="48" cy="48" r="36" fill="none" stroke="#E5E7EB" strokeWidth="13" />
      <circle
        cx="48"
        cy="48"
        r="36"
        fill="none"
        stroke="#7C3AED"
        strokeWidth="13"
        strokeDasharray="194.5 226.2"
        transform="rotate(-90 48 48)"
      />
      <text x="48" y="53" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="700" fill="#0A0A0A">
        86%
      </text>
    </svg>
  );
}

function ChatMockVentas() {
  return (
    <ChatWindow>
      <div className={styles.userMsg}>Quiero saber cuánto vendí el mes pasado</div>
      <div className={styles.aiMsg}>
        <AiHead />
        <p className={styles.aiText}>
          En julio vendiste <strong>$101.293.919</strong> en 63 ventas.
        </p>
        <ul className={styles.aiStats}>
          <li>
            <i className={styles.dotViolet} />
            <span>
              Cobrado: <strong>$92.505.165</strong> · 54 ventas pagadas
            </span>
          </li>
          <li>
            <i className={styles.dotGray} />
            <span>
              Pendiente: <strong>$8.788.754</strong> · 9 ventas parciales
            </span>
          </li>
        </ul>
        <div className={styles.chartRow}>
          <div className={styles.chartCol}>
            <span className={styles.chartLabel}>Distribución de ventas</span>
            <div className={styles.donutWrap}>
              <VentasDonut />
              <ul className={styles.legend}>
                <li>
                  <i className={styles.dotViolet} />
                  Pagadas · 86%
                </li>
                <li>
                  <i className={styles.dotGray} />
                  Parciales · 14%
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.chartCol}>
            <span className={styles.chartLabel}>Cobrado vs pendiente</span>
            <div className={styles.hBars}>
              <div>
                <span>Cobrado</span>
                <b>
                  <i style={{ width: "91%" }} />
                </b>
                <small>$92,5 M</small>
              </div>
              <div>
                <span>Pendiente</span>
                <b>
                  <i className={styles.hBarGray} style={{ width: "9%" }} />
                </b>
                <small>$8,8 M</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChatWindow>
  );
}

/* ------------------------------------------------------------
   Mockup 2 — Citas y asistencia (barras por estado)
   ------------------------------------------------------------ */
function CitasBars() {
  // Escala: valor / 2.046 × 84 px de alto máximo
  const bars = [
    { x: 16, y: 20, h: 84, v: "2.046", label: "Agendadas", fill: "#F3F4F6", stroke: "#E5E7EB" },
    { x: 90, y: 56, h: 48, v: "1.176", label: "Asistieron", fill: "#7C3AED" },
    { x: 164, y: 82, h: 22, v: "541", label: "Canceladas", fill: "#D1D5DB" },
    { x: 238, y: 93, h: 11, v: "273", label: "Ausentes", fill: "#D1D5DB" },
  ];
  return (
    <svg
      viewBox="0 0 300 132"
      className={styles.barsChart}
      role="img"
      aria-label="Citas por estado: 2.046 agendadas, 1.176 asistieron, 541 canceladas, 273 ausentes"
    >
      {bars.map((b) => (
        <g key={b.label}>
          <rect x={b.x} y={b.y} width="46" height={b.h} rx="3" fill={b.fill} stroke={b.stroke} />
          <text
            x={b.x + 23}
            y={b.y - 7}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="10"
            fontWeight="600"
            fill="#0A0A0A"
          >
            {b.v}
          </text>
          <text
            x={b.x + 23}
            y="120"
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8"
            fill="#6B7280"
          >
            {b.label.toUpperCase()}
          </text>
        </g>
      ))}
      <line x1="8" y1="104" x2="292" y2="104" stroke="#E5E7EB" />
    </svg>
  );
}

function ChatMockCitas() {
  return (
    <ChatWindow
      extra={
        <div className={styles.history}>
          <span>Recientes</span>
          <i>Ventas de julio</i>
          <i>Asistencia y no-show</i>
          <i>Cobros pendientes</i>
        </div>
      }
    >
      <div className={styles.userMsg}>
        ¿Cuántos pacientes agendaron el mes pasado y cuántos efectivamente llegaron al tratamiento?
      </div>
      <div className={styles.aiMsg}>
        <AiHead />
        <p className={styles.aiText}>
          El mes pasado se agendaron <strong>2.046 citas</strong> y <strong>1.176 pacientes</strong>{" "}
          llegaron a su tratamiento (57% de asistencia). Del resto: 541 se cancelaron, 273 no
          asistieron y 56 quedaron en otros estados.
        </p>
        <div className={styles.chartFull}>
          <span className={styles.chartLabel}>Citas por estado</span>
          <CitasBars />
        </div>
      </div>
    </ChatWindow>
  );
}

/* ------------------------------------------------------------
   Sección destacada — HOME
   ------------------------------------------------------------ */
const HOME_BULLETS = [
  "Ventas, cobros, citas, asistencia y tratamientos en un solo chat",
  "Respuestas en segundos, con gráficos generados al momento",
  "Cero reportes manuales, cero planillas",
  "Para todo el equipo, según los permisos de cada rol",
];

export function IntelligenceHomeSection() {
  return (
    <section id="intelligence" className={styles.homeSection}>
      <div className={styles.homeInner}>
        <div className={`${styles.homeCopy} reveal`}>
          <span className={styles.kicker}>
            <SparkIcon /> Nuevo · Clinera Intelligence
          </span>
          <h2 className={styles.homeTitle}>
            Pregúntale a tu clínica. <span>Te responde con tus números.</span>
          </h2>
          <p className={styles.homeLead}>
            Clinera Intelligence es un chat con IA dentro de Clinera para conversar con toda tu
            operación: escribe la pregunta en lenguaje natural y recibe cifras reales de tu clínica,
            con gráficos generados al momento.
          </p>
          <ul className={styles.homeBullets}>
            {HOME_BULLETS.map((b) => (
              <li key={b}>
                <i>
                  <CheckIcon />
                </i>
                {b}
              </li>
            ))}
          </ul>
          <div className={styles.homeActions}>
            <Link className={styles.primaryCta} href="/demo">
              Ver una demo <ArrowIcon />
            </Link>
            <Link className={styles.secondaryCta} href="/hablar-con-ventas">
              Hablar con ventas
            </Link>
          </div>
        </div>
        <div className={`${styles.homeMockup} reveal`}>
          <ChatMockVentas />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   Sección "cómo funciona" — /PLATAFORMA
   ------------------------------------------------------------ */
const PLATAFORMA_STEPS = [
  {
    number: "01",
    title: "Pregunta en lenguaje natural",
    copy: "Escríbele como a tu administrador: “¿cuánto vendí el mes pasado?”, “¿cuántos pacientes llegaron a su cita?”.",
  },
  {
    number: "02",
    title: "Consulta tus datos reales",
    copy: "La IA lee las ventas, cobros, citas, asistencia y tratamientos de tu clínica — no cifras de ejemplo.",
  },
  {
    number: "03",
    title: "Responde con cifras y gráficos",
    copy: "En segundos: totales, desglose y gráficos generados al momento, listos para decidir.",
  },
];

const PLATAFORMA_META = [
  "Historial de conversaciones recientes",
  "Funciona con los créditos IA de tu plan",
  "Acceso para todo el equipo, según permisos",
];

export function IntelligencePlataformaSection() {
  return (
    <section id="intelligence" className={styles.platSection}>
      <div className={styles.platInner}>
        <div className={styles.platIntro}>
          <span className={styles.kicker}>
            <SparkIcon /> Nuevo · Clinera Intelligence
          </span>
          <h2>Conversa con toda tu operación.</h2>
          <p>
            Clinera Intelligence es el chat interno con IA de la plataforma: pregunta en lenguaje
            natural y responde con los datos reales de tu clínica — sin reportes manuales ni
            planillas.
          </p>
        </div>
        <div className={styles.platGrid}>
          <div className={styles.platSteps}>
            <ol>
              {PLATAFORMA_STEPS.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
            <ul className={styles.platMeta}>
              {PLATAFORMA_META.map((m) => (
                <li key={m}>
                  <i>
                    <CheckIcon />
                  </i>
                  {m}
                </li>
              ))}
            </ul>
            <Link className={styles.primaryCta} href="/demo">
              Ver una demo <ArrowIcon />
            </Link>
          </div>
          <div className={styles.platMockup}>
            <ChatMockCitas />
          </div>
        </div>
      </div>
    </section>
  );
}
