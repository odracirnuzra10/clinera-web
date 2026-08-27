import {
  EMPLEADO_DIGITAL_AVISO,
  EMPLEADO_DIGITAL_FLUJO,
} from "@/content/empleado-digital-aviso";
import styles from "./AvisoNoReemplaza.module.css";

export default function AvisoNoReemplaza() {
  return (
    <aside className={styles.aviso} role="note">
      <p>
        <strong>Aviso.</strong> {EMPLEADO_DIGITAL_AVISO}
      </p>
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
