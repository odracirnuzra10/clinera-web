"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./HeroCarousel.module.css";

/* Carrusel del hero: seis vistas del producto rotando en la misma ventana (o el
   subconjunto que pida `only`).
   Muestra qué es Clinera O.S. en vez de describirlo.

   Cada vista arma sus elementos en cascada al entrar (las animaciones cuelgan
   de .slideOn en el CSS, así que se reinician cada vez que la vista se activa)
   y la barra del tab activo avanza durante el ciclo para que se vea que la
   siguiente vista viene sola. */

const VIEWS = [
  { id: "aura", label: "WhatsApp con IA", url: "app.clinera.io / conversaciones", hold: 9200 },
  { id: "intelligence", label: "Intelligence", url: "app.clinera.io / intelligence", hold: 6200 },
  { id: "red", label: "Consolidado", url: "app.clinera.io / consolidado-red", hold: 6000 },
  { id: "ficha", label: "Ficha clínica", url: "app.clinera.io / pacientes / ficha", hold: 6400 },
  { id: "odonto", label: "Odontograma", url: "app.clinera.io / pacientes / odontograma", hold: 6000 },
  { id: "corporal", label: "Ficha corporal", url: "app.clinera.io / pacientes / evaluacion", hold: 6200 },
] as const;

export type HeroViewId = (typeof VIEWS)[number]["id"];

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
        <p className={styles.incoming}>Dale, perfecto</p>
        <span className={styles.systemEvent}>
          <Check />Cita agendada en el sistema · jue 10:00 · Dra. Meza
        </span>
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
        <rect width="26" height="26" rx="4" fill="var(--od-missing)" stroke="var(--od-missing-line)" />
        <path d="M7 7 19 19M19 7 7 19" stroke="var(--od-x)" strokeWidth="1.6" strokeLinecap="round" />
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
            fill={mark ? FACE_FILL[mark] : "var(--od-face)"}
            stroke={state?.corona ? "var(--od-crown)" : "var(--od-line)"}
            strokeWidth={state?.corona ? 1.1 : 0.8}
          />
        );
      })}
      {state?.corona && <rect width="26" height="26" rx="3" fill="none" stroke="var(--od-crown)" strokeWidth="1.6" />}
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
            fill="var(--od-num)"
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
          <line x1="-4" y1="42" x2="498" y2="42" stroke="var(--od-line)" strokeWidth="1" />
          <ToothRow codes={LOWER_TEETH} y={52} labelsBelow />
        </svg>
      </div>

      <div className={styles.legend}>
        <span><i style={{ background: "#ef4444" }} />Caries</span>
        <span><i style={{ background: "#3b82f6" }} />Obturado</span>
        <span><i style={{ background: "var(--od-face)", border: "1.5px solid var(--od-crown)" }} />Corona</span>
        <span><i style={{ background: "var(--od-missing)", border: "1px solid var(--od-missing-line)" }} />Ausente</span>
      </div>

      <div className={styles.nextUp}>
        <Check />Presupuesto de 1.6 enviado por WhatsApp · pendiente de aprobación
      </div>
    </div>
  );
}

/* ---------- Ficha corporal ---------- */

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

      {/* Evaluación corporal real del producto, encuadrada en las figuras;
          el detalle del plan va al lado para aprovechar el ancho. */}
      <div className={styles.bodyCard}>
        <figure className={styles.bodyShot}>
          <Image
            src="/presentacion/eval-corporal.jpg"
            alt="Evaluación corporal con abdomen, flancos y muslos marcados"
            width={1600}
            height={1022}
            sizes="260px"
          />
          <span className={styles.scan} aria-hidden="true" />
        </figure>

        <div className={styles.bodyPanel}>
          <span className={styles.panelLabel}>Zonas evaluadas</span>
          <ul className={styles.zoneList}>
            <li><i className={styles.zAbdomen} />Abdomen<b>3 sesiones</b></li>
            <li><i className={styles.zFlank} />Flancos<b>2 sesiones</b></li>
            <li><i className={styles.zThigh} />Muslos<b>1 sesión</b></li>
          </ul>
          <dl className={styles.panelMeta}>
            <div><dt>Plan</dt><dd>Reducción localizada</dd></div>
            <div><dt>Próxima</dt><dd>jue 14:30 · Dra. Reyes</dd></div>
          </dl>
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

/* `only` recorta el carrusel a un subconjunto de vistas, en el orden pedido: el
   wizard de /agenda muestra sólo las vistas del paso en que va el visitante. Sin
   la prop se ven las seis, que es lo que hace /plataforma. */
export default function HeroCarousel({ only }: { only?: readonly HeroViewId[] } = {}) {
  const views = useMemo(
    () => {
      const picked = only ? only.map((id) => VIEWS.find((v) => v.id === id)).filter((v) => !!v) : [];
      return picked.length ? picked : [...VIEWS];
    },
    [only],
  );
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Cambia en cada arranque de ciclo: reinicia la barra de progreso y el
  // contador sin desincronizarse del temporizador.
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Las escenas se reproducen sólo mientras la ventana está a la vista: si
  // rotara desde la carga, quien llega scrolleando se pierde la animación.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setPlaying(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting),
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !playing || reduced.current) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % views.length), views[active].hold);
    return () => clearTimeout(t);
  }, [active, paused, playing, run, views]);

  const next = views[(active + 1) % views.length].label;

  return (
    <div
      ref={frameRef}
      className={playing ? `${styles.frame} ${styles.playing}` : styles.frame}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setRun((r) => r + 1);
      }}
    >
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
        <span className={styles.url}>{views[active].url}</span>
        <span className={styles.badge}><i /> IA activa</span>
      </div>

      <div className={styles.stage}>
        {views.map((v, i) => (
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
            {v.id === "intelligence" && <IntelligenceView run={playing ? run : -1} />}
          </div>
        ))}
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Vistas de Clinera">
        {views.map((v, i) => (
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

      <div className={styles.progressTrack} aria-hidden="true">
        {/* La key incluye la vista: al rotar sola, la barra debe volver a cero. */}
        <i
          key={`${active}-${run}`}
          className={styles.progressFill}
          style={{
            animationDuration: `${views[active].hold}ms`,
            animationPlayState: paused || !playing ? "paused" : "running",
          }}
        />
      </div>
    </div>
  );
}
