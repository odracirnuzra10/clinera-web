"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroCarousel.module.css";

/* Carrusel del hero: seis vistas del producto rotando en la misma ventana.
   Muestra qué es Clinera O.S. en vez de describirlo.

   Cada vista arma sus elementos en cascada al entrar (las animaciones cuelgan
   de .slideOn en el CSS, así que se reinician cada vez que la vista se activa)
   y la barra del tab activo avanza durante el ciclo para que se vea que la
   siguiente vista viene sola. */

const VIEWS = [
  { id: "red", label: "Consolidado", url: "app.clinera.io / consolidado-red" },
  { id: "aura", label: "WhatsApp con IA", url: "app.clinera.io / conversaciones" },
  { id: "ficha", label: "Ficha clínica", url: "app.clinera.io / pacientes / ficha" },
  { id: "odonto", label: "Odontograma", url: "app.clinera.io / pacientes / odontograma" },
  { id: "corporal", label: "Ficha corporal", url: "app.clinera.io / pacientes / evaluacion" },
  { id: "intelligence", label: "Intelligence", url: "app.clinera.io / intelligence" },
] as const;

const ROTATION_MS = 5800;

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="15" height="15" fill="none">
      <path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* El total de Intelligence sube desde cero cada vez que la vista entra: es el
   dato que el ojo persigue y quieto se ve como una captura. */
function CountUp({ value, run }: { value: number; run: number }) {
  const [shown, setShown] = useState(value);

  useEffect(() => {
    // Sin animación el estado ya arranca en el valor final.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const start = performance.now();
    const duration = 950;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, run]);

  return <>${shown.toLocaleString("es-CL")}</>;
}

function NetworkView() {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>Consolidado de red</span>
          <strong>3 sedes · este mes</strong>
        </div>
        <span className={styles.synced}>Sincronizado hace 40 s</span>
      </div>

      <div className={styles.kpiGrid}>
        <div><span>Citas</span><strong>2.347</strong><small>+11,4%</small></div>
        <div><span>Ocupación</span><strong>83%</strong><small>+6 pts</small></div>
        <div><span>No-show</span><strong>6,1%</strong><small>−8,3 pts</small></div>
        <div><span>Recuperados</span><strong>184</strong><small>por IA</small></div>
      </div>

      <div className={styles.branchList}>
        <div><span><i className={styles.dotViolet} />Providencia</span><b><i style={{ width: "88%" }} /></b><small>88%</small></div>
        <div><span><i className={styles.dotBlue} />Las Condes</span><b><i style={{ width: "81%" }} /></b><small>81%</small></div>
        <div><span><i className={styles.dotMagenta} />Viña del Mar</span><b><i style={{ width: "74%" }} /></b><small>74%</small></div>
      </div>
    </div>
  );
}

function AuraView() {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>AURA · WhatsApp</span>
          <strong>Atiende las 3 sedes · 24/7</strong>
        </div>
        <span className={styles.livePill}><i />En línea</span>
      </div>

      <div className={styles.thread}>
        <p className={styles.incoming}>Hola, ¿tienen hora mañana en Las Condes?</p>
        {/* El "escribiendo" se apaga justo cuando aparece la respuesta: es lo
            que hace que la conversación se lea en vivo y no como captura. */}
        <span className={styles.typing} aria-hidden="true"><i /><i /><i /></span>
        <p className={styles.outgoing}>Sí: mañana 10:00 con la Dra. Meza. ¿Se la agendo?</p>
        <p className={styles.incoming}>Sí, perfecto</p>
        <p className={styles.outgoing}>Listo. Te confirmo por acá el día anterior.</p>
      </div>

      <div className={styles.callRow}>
        <span className={styles.avatar}>MR</span>
        <div><strong>Sra. Rojas</strong><small>llamada de confirmación · 00:14</small></div>
        <span className={styles.wave} aria-hidden="true"><i /><i /><i /><i /><i /></span>
      </div>

      <div className={styles.result}><Check />14 citas agendadas hoy sin intervención del equipo</div>
    </div>
  );
}

function ChartView() {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>Ficha clínica</span>
          <strong>Carla Mendieta · 34 años</strong>
        </div>
        <span className={styles.tagOk}><Check />Consentimiento firmado</span>
      </div>

      <div className={styles.chips}>
        <span>Última visita: 14 ago</span>
        <span>Plan: 6 sesiones</span>
        <span>Alergias: ninguna</span>
      </div>

      <ul className={styles.timeline}>
        <li>
          <span className={styles.tlDate}>14 ago</span>
          <div><strong>Sesión 4 · Rejuvenecimiento facial</strong><small>Dra. Javiera Solís · evolución favorable</small></div>
        </li>
        <li>
          <span className={styles.tlDate}>31 jul</span>
          <div><strong>Control post-tratamiento</strong><small>Sin reacciones adversas</small></div>
        </li>
        <li>
          <span className={styles.tlDate}>17 jul</span>
          <div><strong>Exámenes cargados</strong><small>2 archivos · revisados</small></div>
        </li>
      </ul>

      <div className={styles.nextUp}>
        <Check />Próximo control agendado por AURA · 28 ago 11:30
      </div>
    </div>
  );
}

/* ---------- Odontograma ---------- */

const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

type Face = "v" | "l" | "m" | "d" | "o";
type ToothState = { faces?: Partial<Record<Face, "caries" | "obturado">>; missing?: boolean; corona?: boolean };

// Hallazgos de la ficha de ejemplo, en notación FDI.
const FINDINGS: Record<number, ToothState> = {
  16: { faces: { o: "caries" } },
  15: { faces: { d: "obturado" } },
  24: { faces: { o: "obturado" } },
  26: { faces: { v: "caries", o: "obturado" } },
  36: { missing: true },
  46: { corona: true },
  11: { faces: { m: "caries" } },
  37: { faces: { o: "obturado" } },
};

const FACE_POINTS: Record<Face, string> = {
  v: "0,0 26,0 18,8 8,8",
  l: "0,26 26,26 18,18 8,18",
  m: "0,0 8,8 8,18 0,26",
  d: "26,0 18,8 18,18 26,26",
  o: "8,8 18,8 18,18 8,18",
};

const FACE_FILL = { caries: "#ef4444", obturado: "#3b82f6" } as const;

function Tooth({ state, index }: { state?: ToothState; index: number }) {
  const delay = `${index * 22}ms`;

  if (state?.missing) {
    return (
      <g className={styles.tooth} style={{ animationDelay: delay }}>
        <rect width="26" height="26" rx="4" fill="#f4f4f6" stroke="#e2e2e8" />
        <path d="M7 7 19 19M19 7 7 19" stroke="#a8a8b3" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    );
  }

  return (
    <g className={styles.tooth} style={{ animationDelay: delay }}>
      {(Object.keys(FACE_POINTS) as Face[]).map((face) => {
        const mark = state?.faces?.[face];
        return (
          <polygon
            key={face}
            points={FACE_POINTS[face]}
            fill={mark ? FACE_FILL[mark] : "#fff"}
            stroke={state?.corona ? "#7c3aed" : "#dcdce3"}
            strokeWidth={state?.corona ? 1.1 : 0.8}
          />
        );
      })}
      {state?.corona && <rect width="26" height="26" rx="3" fill="none" stroke="#7c3aed" strokeWidth="1.6" />}
    </g>
  );
}

function ToothRow({ codes, y, labelsBelow }: { codes: number[]; y: number; labelsBelow: boolean }) {
  return (
    <>
      {codes.map((code, i) => (
        <g key={code} transform={`translate(${i * 31}, ${y})`}>
          <Tooth state={FINDINGS[code]} index={labelsBelow ? i : codes.length - i} />
          <text
            x="13"
            y={labelsBelow ? 38 : -6}
            textAnchor="middle"
            fontSize="8.5"
            fill="#9aa0aa"
            fontFamily="'JetBrains Mono', monospace"
          >
            {code}
          </text>
        </g>
      ))}
    </>
  );
}

function OdontogramView() {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>Odontograma</span>
          <strong>Tomás Errázuriz · pieza 1.6</strong>
        </div>
        <span className={styles.tagOk}><Check />Actualizado hoy</span>
      </div>

      <div className={styles.odontoWrap}>
        <svg viewBox="-4 -14 502 108" className={styles.odonto} role="img" aria-label="Odontograma con hallazgos por pieza">
          <ToothRow codes={UPPER_TEETH} y={0} labelsBelow={false} />
          <line x1="-4" y1="42" x2="498" y2="42" stroke="#eeecf1" strokeWidth="1" />
          <ToothRow codes={LOWER_TEETH} y={52} labelsBelow />
        </svg>
      </div>

      <div className={styles.legend}>
        <span><i style={{ background: "#ef4444" }} />Caries</span>
        <span><i style={{ background: "#3b82f6" }} />Obturado</span>
        <span><i style={{ background: "#fff", border: "1.5px solid #7c3aed" }} />Corona</span>
        <span><i style={{ background: "#f4f4f6", border: "1px solid #e2e2e8" }} />Ausente</span>
      </div>

      <div className={styles.nextUp}>
        <Check />Presupuesto de 1.6 enviado por WhatsApp · pendiente de aprobación
      </div>
    </div>
  );
}

/* ---------- Ficha corporal ---------- */

function BodySilhouette({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 100 174" className={styles.body} aria-hidden="true">
      <g fill="#e6e6ee">
        {/* Cabeza y cuello */}
        <ellipse cx="50" cy="13" rx="9" ry="11" />
        <path d="M45 21h10v8a5 5 0 0 1-10 0Z" />

        {/* Tronco: hombros redondeados, cintura marcada, pelvis */}
        <path d="M36 28h28a9 9 0 0 1 9 8l1.5 16h-49L27 36a9 9 0 0 1 9-8Z" />
        <path d="M25.5 50h49l-2.5 17h-44Z" />
        <path d="M28 64h44l-3.5 20a8 8 0 0 1-8 6H39.5a8 8 0 0 1-8-6Z" />

        {/* Brazos: brazo y antebrazo, con hombro empalmado al tronco */}
        <path d="M28 34a7 7 0 0 1 1 5l-2.5 24h-8l2-24a7 7 0 0 1 7.5-5Z" />
        <path d="M72 34a7 7 0 0 0-1 5l2.5 24h8l-2-24A7 7 0 0 0 72 34Z" />
        <rect x="18.5" y="58" width="8" height="27" rx="4" />
        <rect x="73.5" y="58" width="8" height="27" rx="4" />

        {/* Piernas: muslo ancho que se afina en la pantorrilla */}
        <path d="M36.5 82h12.5l-1 40h-12Z" />
        <path d="M51 82h12.5l.5 40h-12Z" />
        <rect x="37" y="112" width="10.5" height="50" rx="5" />
        <rect x="52.5" y="112" width="10.5" height="50" rx="5" />
      </g>

      {/* Zonas evaluadas: entran una a una y laten suave. */}
      <g className={styles.zones}>
        <rect className={styles.zoneAbdomen} x="39" y="46" width="22" height="21" rx="8" />
        <ellipse className={styles.zoneFlank} cx="31" cy="55" rx="5" ry="10" />
        <ellipse className={styles.zoneFlank} cx="69" cy="55" rx="5" ry="10" />
        <ellipse className={styles.zoneThigh} cx="42.5" cy="100" rx="6.5" ry="17" />
        <ellipse className={styles.zoneThigh} cx="57.5" cy="100" rx="6.5" ry="17" />
      </g>

      <text x="50" y="171" textAnchor="middle" fontSize="7" fill="#9aa0aa" fontFamily="'JetBrains Mono', monospace">
        {back ? "POSTERIOR" : "ANTERIOR"}
      </text>
    </svg>
  );
}

function BodyChartView() {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>Ficha corporal</span>
          <strong>Matías Fuentes · 41 años</strong>
        </div>
        <span className={styles.livePill}><i />Reducción localizada</span>
      </div>

      <div className={styles.bodyCard}>
        <div className={styles.bodyStage}>
          <BodySilhouette />
          <BodySilhouette back />
        </div>
        <div className={styles.bodyLegend}>
          <span className={styles.legendAbdomen}><i />Abdomen</span>
          <span className={styles.legendFlank}><i />Flancos</span>
          <span className={styles.legendThigh}><i />Muslos</span>
        </div>
      </div>

      <div className={styles.nextUp}>
        <Check />Zonas leídas por AURA desde el chat · próxima sesión jue 14:30
      </div>
    </div>
  );
}

/* ---------- Intelligence ---------- */

function IntelligenceView({ run }: { run: number }) {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>Clinera Intelligence</span>
          <strong>Tu agente interno</strong>
        </div>
        <span className={styles.livePill}><i />Datos en vivo</span>
      </div>

      <p className={styles.question}>¿Cuánto vendimos hoy y qué tratamiento lidera?</p>

      <div className={styles.answer}>
        <strong className={styles.answerTotal}><CountUp value={4180000} run={run} /></strong>
        <small>32 tratamientos cerrados · +14% vs. mismo día del mes pasado</small>
        <div className={styles.bars}>
          <div><span>Rejuvenecimiento</span><b><i style={{ width: "100%" }} /></b><small>$1.840.000</small></div>
          <div><span>Depilación láser</span><b><i style={{ width: "62%" }} /></b><small>$1.140.000</small></div>
          <div><span>Limpieza facial</span><b><i style={{ width: "34%" }} /></b><small>$620.000</small></div>
        </div>
      </div>

      <div className={styles.result}><Check />Sin reportes manuales ni planillas</div>
    </div>
  );
}

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Cambia en cada arranque de ciclo: reinicia la barra de progreso y el
  // contador sin desincronizarse del temporizador.
  const [run, setRun] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reduced.current) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % VIEWS.length), ROTATION_MS);
    return () => clearTimeout(t);
  }, [active, paused, run]);

  const next = VIEWS[(active + 1) % VIEWS.length].label;

  return (
    <div
      className={styles.frame}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setRun((r) => r + 1);
      }}
    >
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
        <span className={styles.url}>{VIEWS[active].url}</span>
        <span className={styles.badge}><i /> IA activa</span>
      </div>

      <div className={styles.stage}>
        {VIEWS.map((v, i) => (
          <div
            key={v.id}
            className={i === active ? `${styles.slide} ${styles.slideOn}` : styles.slide}
            aria-hidden={i !== active}
            inert={i !== active}
          >
            {v.id === "red" && <NetworkView />}
            {v.id === "aura" && <AuraView />}
            {v.id === "ficha" && <ChartView />}
            {v.id === "odonto" && <OdontogramView />}
            {v.id === "corporal" && <BodyChartView />}
            {v.id === "intelligence" && <IntelligenceView run={run} />}
          </div>
        ))}
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Vistas de Clinera">
        {VIEWS.map((v, i) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? `${styles.tab} ${styles.tabOn}` : styles.tab}
            onClick={() => {
              setActive(i);
              setRun((r) => r + 1);
            }}
          >
            {v.label}
            {i === active && (
              <i
                key={run}
                className={styles.tabProgress}
                style={{
                  animationDuration: `${ROTATION_MS}ms`,
                  animationPlayState: paused ? "paused" : "running",
                }}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>

      <p className={styles.note}>
        <span>Vistas de ejemplo con datos de demostración.</span>
        <span className={styles.upNext}>
          {paused ? (
            "En pausa"
          ) : (
            <>
              <i className={styles.upNextDot} aria-hidden="true" />
              Sigue: {next}
            </>
          )}
        </span>
      </p>
    </div>
  );
}
