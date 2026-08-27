import {
  EMPLEADO_DIGITAL_AVISO,
  EMPLEADO_DIGITAL_FLUJO,
} from "@/content/empleado-digital-aviso";
import styles from "./AvisoNoReemplaza.module.css";

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3.2 2.4 20.4h19.2L12 3.2Zm0 5.3c.5 0 .9.4.9.9v4.2a.9.9 0 1 1-1.8 0V9.4c0-.5.4-.9.9-.9Zm0 8.6a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z"
      />
    </svg>
  );
}

export default function AvisoNoReemplaza() {
  return (
    <aside className={styles.aviso} role="note">
      <div className={styles.copy}>
        <span className={styles.badge}>
          <WarningIcon />
          Advertencia
        </span>
        <p>{EMPLEADO_DIGITAL_AVISO}</p>
      </div>
      <ol className={styles.flujo} aria-label="Leads, Clinera, paciente">
        {EMPLEADO_DIGITAL_FLUJO.map((step) => (
          <li key={step}>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
