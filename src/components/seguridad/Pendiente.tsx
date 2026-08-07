import styles from "./seguridad.module.css";

/**
 * Marcador de dato sin confirmar.
 *
 * En /seguridad no se publica ningún dato técnico que no esté verificado. Lo
 * que falta se muestra acá, en amarillo, a la vista del visitante. Es
 * deliberadamente feo: una página de cumplimiento con un bloque amarillo es
 * incómoda, pero una que inventa la región de alojamiento de datos clínicos
 * frente a la Ley 21.719 cuesta caro. El inventario de pendientes y sus
 * responsables está en README-seguridad.md.
 */
export default function Pendiente({
  texto,
  compact = false,
}: {
  texto: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? styles.pendienteCompact : styles.pendiente}>
      <p className={styles.pendienteLabel}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="6.5" />
          <path d="M8 4.75v3.75" />
          <path d="M8 11.1v.05" />
        </svg>
        Pendiente de confirmación
      </p>
      <p className={styles.pendienteTexto}>{texto}</p>
    </div>
  );
}
