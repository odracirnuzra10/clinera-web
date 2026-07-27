import styles from "./AuraNetwork.module.css";

const INPUTS = [
  { icon: "calendar", title: "Agenda", copy: "Horas y bloqueos" },
  { icon: "branches", title: "Sedes", copy: "Toda tu operación" },
  { icon: "file", title: "Fichas", copy: "Historial de cada paciente" },
  { icon: "spark", title: "Tratamientos", copy: "Precios y protocolos" },
  { icon: "chart", title: "Ventas", copy: "Qué se vende y cuánto" },
  { icon: "card", title: "Pagos", copy: "Cobros y conciliación" },
  { icon: "campaign", title: "Marketing", copy: "Campañas y difusiones" },
  { icon: "message", title: "WhatsApp", copy: "Toda la conversación" },
  { icon: "consent", title: "Consentimientos", copy: "Firmados y archivados" },
  { icon: "pulse", title: "Exámenes", copy: "Resultados y controles" },
];

const ACTIONS = [
  { icon: "calendar", title: "Agenda y reagenda", copy: "Reserva y mueve horas sola" },
  { icon: "message", title: "Responde 24/7", copy: "Por WhatsApp, sin descanso" },
  { icon: "voice", title: "Llama y confirma", copy: "Confirma citas mediante llamadas de voz" },
  { icon: "payment", title: "Cobra y recupera", copy: "Confirma pagos y reactiva pacientes" },
  { icon: "bolt", title: "Automatiza", copy: "Ejecuta flujos sin intervención manual" },
];

function FeatureIcon({ name }: { name: string }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="none">
      {name === "calendar" && (
        <>
          <rect x="4" y="6" width="16" height="14" rx="2" {...common} />
          <path d="M8 4v4M16 4v4M4 10h16" {...common} />
        </>
      )}
      {name === "branches" && (
        <>
          <path d="M5 19h14M7 17V9l5-4 5 4v8" {...common} />
          <path d="M10 17v-4h4v4" {...common} />
        </>
      )}
      {name === "file" && (
        <>
          <path d="M7 3h7l4 4v14H7z" {...common} />
          <path d="M14 3v5h4M10 12h5M10 16h5" {...common} />
        </>
      )}
      {name === "spark" && (
        <path d="M12 4c.8 3.8 2.8 5.8 6.5 6.5-3.7.8-5.7 2.8-6.5 6.5-.8-3.7-2.8-5.7-6.5-6.5C9.2 9.8 11.2 7.8 12 4Z" {...common} />
      )}
      {name === "chart" && (
        <>
          <path d="M5 19V5M5 19h15" {...common} />
          <path d="m8 15 3-4 3 2 5-6" {...common} />
        </>
      )}
      {name === "card" && (
        <>
          <rect x="3" y="6" width="18" height="12" rx="2" {...common} />
          <path d="M3 10h18" {...common} />
        </>
      )}
      {name === "campaign" && (
        <>
          <path d="m4 12 14-6v12L4 12Z" {...common} />
          <path d="m7 13 2 5" {...common} />
        </>
      )}
      {name === "message" && (
        <path d="M20 11.5a7.5 7.5 0 0 1-11.2 6.6L4 20l1.6-4.5A7.5 7.5 0 1 1 20 11.5Z" {...common} />
      )}
      {name === "consent" && (
        <>
          <path d="M8 4h8v3h3v14H5V7h3zM8 4v3h8V4" {...common} />
          <path d="m9 14 2 2 4-5" {...common} />
        </>
      )}
      {name === "pulse" && (
        <path d="M3 13h4l2-6 4 12 2-7h6" {...common} />
      )}
      {name === "voice" && (
        <>
          <rect x="9" y="3" width="6" height="12" rx="3" {...common} />
          <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" {...common} />
        </>
      )}
      {name === "payment" && (
        <>
          <path d="M12 3v18M16 7.5c-1-1-2.2-1.5-4-1.5-2.2 0-4 1.2-4 3s1.8 2.7 4 3 4 1.2 4 3-1.8 3-4 3c-1.8 0-3.2-.5-4-1.5" {...common} />
        </>
      )}
      {name === "bolt" && (
        <path d="m13 2-8 12h7l-1 8 8-12h-7z" {...common} />
      )}
    </svg>
  );
}

function AuraMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" width="72" height="72" fill="none">
      <path
        d="M32 7c3.2 14.2 10.8 21.8 25 25-14.2 3.2-21.8 10.8-25 25C28.8 42.8 21.2 35.2 7 32 21.2 28.8 28.8 21.2 32 7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AuraNetwork() {
  return (
    <section className={styles.section} aria-labelledby="aura-network-title">
      <div className={styles.heading}>
        <span>Todo conectado · una sola IA</span>
        <h2 id="aura-network-title">Todas tus sedes, <em>en una sola IA.</em></h2>
        <p>
          Agenda, fichas, tratamientos, pagos, marketing y WhatsApp de cada sede alimentan un solo
          núcleo. Clinera aprende de toda tu operación y actúa con visibilidad y control central.
        </p>
      </div>

      <div className={styles.network}>
        <div className={styles.inputs}>
          <span className={styles.columnLabel}>Cada sede alimenta la IA</span>
          <div className={styles.inputGrid}>
            {INPUTS.map((item) => (
              <article key={item.title} className={styles.inputCard}>
                <i><FeatureIcon name={item.icon} /></i>
                <span><strong>{item.title}</strong><small>{item.copy}</small></span>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.aura}>
          <div className={styles.auraStage} aria-label="AURA, núcleo de inteligencia artificial activo">
            <span className={styles.auraWave} />
            <span className={styles.auraHalo} />
            <span className={styles.auraOrb}><AuraMark /></span>
          </div>
          <strong>AURA</strong>
          <small>Núcleo IA · una sola operación</small>
          <span className={styles.liveStatus}><i /> Activa ahora</span>
        </div>

        <div className={styles.actions}>
          <span className={styles.columnLabel}>La IA ejecuta por ti</span>
          <div className={styles.actionList}>
            {ACTIONS.map((item) => (
              <article key={item.title} className={styles.actionCard}>
                <i><FeatureIcon name={item.icon} /></i>
                <span><strong>{item.title}</strong><small>{item.copy}</small></span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
