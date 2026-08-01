"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./IntelligenceSection.module.css";

/* ============================================================
   Clinera Intelligence — chat animado (mockup vivo)
   Loop: se tipea la pregunta → puntos de "pensando" → la
   respuesta entra en cascada y los gráficos crecen → pausa de
   lectura → cambia a la otra pregunta y repite.
   · Parte recién cuando la ventana entra en pantalla
     (IntersectionObserver) y se pausa al salir.
   · Con prefers-reduced-motion queda la vista estática completa.
   · SSR/no-JS renderiza la conversación completa (fase "estatico").
   ============================================================ */

type Escenario = "ventas" | "citas";
type Fase = "estatico" | "tipeo" | "pensando" | "respuesta";

const PREGUNTA: Record<Escenario, string> = {
  ventas: "Quiero saber cuánto vendí el mes pasado",
  citas:
    "¿Cuántos pacientes agendaron el mes pasado y cuántos efectivamente llegaron al tratamiento?",
};

const OTRO: Record<Escenario, Escenario> = { ventas: "citas", citas: "ventas" };

const MS_POR_LETRA = 26;
const MS_ANTES_DE_PENSAR = 380;
const MS_PENSANDO = 1250;
const MS_LECTURA = 5800;

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

function AiHead() {
  return (
    <span className={styles.aiHead}>
      <SparkIcon /> Clinera Intelligence
    </span>
  );
}

const retraso = (anima: boolean, ms: number): CSSProperties | undefined =>
  anima ? { animationDelay: `${ms}ms` } : undefined;

/* ------------------------------------------------------------
   Respuesta 1 — Ventas del mes (donut + barras cobrado/pendiente)
   ------------------------------------------------------------ */
function VentasDonut() {
  // r = 36 → circunferencia 226.2 · Pagadas 86% → arco 194.5
  return (
    <svg
      viewBox="0 0 96 96"
      className={styles.donut}
      role="img"
      aria-label="Distribución de ventas: pagadas 86 por ciento, parciales 14 por ciento"
    >
      <circle cx="48" cy="48" r="36" fill="none" stroke="#E5E7EB" strokeWidth="13" />
      <circle
        className={styles.donutArco}
        cx="48"
        cy="48"
        r="36"
        fill="none"
        stroke="#7C3AED"
        strokeWidth="13"
        strokeDasharray="194.5 226.2"
        transform="rotate(-90 48 48)"
      />
      <text
        className={styles.donutPct}
        x="48"
        y="53"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="16"
        fontWeight="700"
        fill="#0A0A0A"
      >
        86%
      </text>
    </svg>
  );
}

function RespuestaVentas({ anima }: { anima: boolean }) {
  return (
    <div className={`${styles.aiMsg}${anima ? ` ${styles.aiEntra} ${styles.anima}` : ""}`}>
      <AiHead />
      <p className={styles.aiText}>
        En julio vendiste <strong>$101.293.919</strong> en 63 ventas.
      </p>
      <ul className={styles.aiStats}>
        <li style={retraso(anima, 240)}>
          <i className={styles.dotViolet} />
          <span>
            Cobrado: <strong>$92.505.165</strong> · 54 ventas pagadas
          </span>
        </li>
        <li style={retraso(anima, 360)}>
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
  );
}

/* ------------------------------------------------------------
   Respuesta 2 — Citas y asistencia (barras por estado)
   ------------------------------------------------------------ */
function CitasBars({ anima }: { anima: boolean }) {
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
      {bars.map((b, i) => (
        <g key={b.label}>
          <rect
            className={styles.barra}
            style={retraso(anima, 520 + i * 140)}
            x={b.x}
            y={b.y}
            width="46"
            height={b.h}
            rx="3"
            fill={b.fill}
            stroke={b.stroke}
          />
          <text
            className={styles.barraDato}
            style={retraso(anima, 720 + i * 140)}
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

function RespuestaCitas({ anima }: { anima: boolean }) {
  return (
    <div className={`${styles.aiMsg}${anima ? ` ${styles.aiEntra} ${styles.anima}` : ""}`}>
      <AiHead />
      <p className={styles.aiText}>
        El mes pasado se agendaron <strong>2.046 citas</strong> y <strong>1.176 pacientes</strong>{" "}
        llegaron a su tratamiento (57% de asistencia). Del resto: 541 se cancelaron, 273 no
        asistieron y 56 quedaron en otros estados.
      </p>
      <div className={styles.chartFull}>
        <span className={styles.chartLabel}>Citas por estado</span>
        <CitasBars anima={anima} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Conversación según fase
   ------------------------------------------------------------ */
function Conversacion({
  escenario,
  fase,
  tipeado,
}: {
  escenario: Escenario;
  fase: Fase;
  tipeado: number;
}) {
  const pregunta = PREGUNTA[escenario];
  return (
    <>
      <div className={`${styles.userMsg}${fase === "tipeo" ? ` ${styles.userEntra}` : ""}`}>
        {fase === "tipeo" ? pregunta.slice(0, tipeado) : pregunta}
        {fase === "tipeo" && <i className={styles.caret} aria-hidden="true" />}
      </div>
      {fase === "pensando" && (
        <div className={styles.pensando} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      )}
      {(fase === "respuesta" || fase === "estatico") &&
        (escenario === "ventas" ? (
          <RespuestaVentas anima={fase === "respuesta"} />
        ) : (
          <RespuestaCitas anima={fase === "respuesta"} />
        ))}
    </>
  );
}

/* ------------------------------------------------------------
   Ventana de chat animada
   ------------------------------------------------------------ */
export function ChatAnimado({
  inicial,
  conHistorial = false,
}: {
  inicial: Escenario;
  conHistorial?: boolean;
}) {
  const [escenario, setEscenario] = useState<Escenario>(inicial);
  const [fase, setFase] = useState<Fase>("estatico");
  const [tipeado, setTipeado] = useState(0);
  const [visible, setVisible] = useState(false);
  const raiz = useRef<HTMLDivElement | null>(null);

  // Arranca al entrar en pantalla; con prefers-reduced-motion no arranca nunca.
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        setVisible(entrada.isIntersecting);
        if (entrada.isIntersecting) setFase((f) => (f === "estatico" ? "tipeo" : f));
      },
      { threshold: 0.35 },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // Máquina de fases. Fuera de pantalla los timers se limpian (pausa).
  useEffect(() => {
    if (!visible || fase === "estatico") return;
    if (fase === "tipeo") {
      const pregunta = PREGUNTA[escenario];
      const timer = window.setInterval(() => {
        setTipeado((n) => (n >= pregunta.length ? n : n + 1));
      }, MS_POR_LETRA);
      return () => window.clearInterval(timer);
    }
    if (fase === "pensando") {
      const timer = window.setTimeout(() => setFase("respuesta"), MS_PENSANDO);
      return () => window.clearTimeout(timer);
    }
    // fase "respuesta": pausa de lectura y cambio a la otra pregunta.
    const timer = window.setTimeout(() => {
      setEscenario((e) => OTRO[e]);
      setTipeado(0);
      setFase("tipeo");
    }, MS_LECTURA);
    return () => window.clearTimeout(timer);
  }, [visible, fase, escenario]);

  // Pregunta completa → pequeña pausa y pasa a "pensando".
  useEffect(() => {
    if (!visible || fase !== "tipeo" || tipeado < PREGUNTA[escenario].length) return;
    const timer = window.setTimeout(() => setFase("pensando"), MS_ANTES_DE_PENSAR);
    return () => window.clearTimeout(timer);
  }, [visible, fase, tipeado, escenario]);

  return (
    <div ref={raiz} className={styles.chat} aria-label="Vista del chat Clinera Intelligence">
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
      {conHistorial && (
        <div className={styles.history}>
          <span>Recientes</span>
          <i>Ventas de julio</i>
          <i>Asistencia y no-show</i>
          <i>Cobros pendientes</i>
        </div>
      )}
      <div className={`${styles.chatBody} ${styles.chatBodyVivo}`}>
        {/* Copia estática invisible: fija la altura de la ventana para que la
            animación no mueva el resto de la página (stop-scrolling sin saltos). */}
        <div className={styles.chatSizer} aria-hidden="true">
          <Conversacion escenario={escenario} fase="estatico" tipeado={0} />
        </div>
        <div className={styles.chatCapa}>
          <Conversacion escenario={escenario} fase={fase} tipeado={tipeado} />
        </div>
      </div>
      <div className={styles.chatInput}>
        <span>Pregúntale a tu clínica…</span>
        <i aria-hidden="true">
          <SendIcon />
        </i>
      </div>
    </div>
  );
}
