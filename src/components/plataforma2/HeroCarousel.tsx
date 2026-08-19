"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroCarousel.module.css";

/* Carrusel del hero: cuatro vistas del producto rotando en la misma ventana.
   Muestra qué es Clinera O.S. en vez de describirlo. */

const VIEWS = [
  { id: "red", label: "Consolidado de red", url: "app.clinera.io / consolidado-red" },
  { id: "ficha", label: "Ficha clínica", url: "app.clinera.io / pacientes / ficha" },
  { id: "aura", label: "AURA por WhatsApp", url: "app.clinera.io / conversaciones" },
  { id: "intelligence", label: "Clinera Intelligence", url: "app.clinera.io / intelligence" },
] as const;

const ROTATION_MS = 6500;

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="15" height="15" fill="none">
      <path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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

function IntelligenceView() {
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
        <strong className={styles.answerTotal}>$4.180.000</strong>
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

const RENDERERS = [NetworkView, ChartView, AuraView, IntelligenceView];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reduced.current) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % VIEWS.length), ROTATION_MS);
    return () => clearTimeout(t);
  }, [active, paused]);

  return (
    <div
      className={styles.frame}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
        <span className={styles.url}>{VIEWS[active].url}</span>
        <span className={styles.badge}><i /> IA activa</span>
      </div>

      <div className={styles.stage}>
        {RENDERERS.map((View, i) => (
          <div
            key={VIEWS[i].id}
            className={i === active ? `${styles.slide} ${styles.slideOn}` : styles.slide}
            aria-hidden={i !== active}
            inert={i !== active}
          >
            <View />
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
              setPaused(true);
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      <p className={styles.note}>Vistas de ejemplo con datos de demostración.</p>
    </div>
  );
}
