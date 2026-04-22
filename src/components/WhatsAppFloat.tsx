import styles from "./WhatsAppFloat.module.css";

const WA_NUMBER = "56985581524";
const WA_TEXT = encodeURIComponent(
  "Hola, quiero asistencia con Clinera."
);

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.waFloat}
      aria-label="Asistencia por WhatsApp"
    >
      <svg viewBox="0 0 32 32" fill="#fff" width="22" height="22" aria-hidden="true">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.744 3.047 9.381L1.054 31.2l6.012-1.93a15.906 15.906 0 008.938 2.734C24.826 32.004 32 24.828 32 16.004 32 7.176 24.826 0 16.004 0zm9.305 22.617c-.39 1.1-2.283 2.103-3.156 2.162-.873.063-1.693.39-5.703-1.188-4.827-1.898-7.882-6.86-8.117-7.18-.235-.316-1.921-2.555-1.921-4.875 0-2.316 1.215-3.457 1.648-3.93.43-.472.94-.59 1.254-.59.313 0 .625.003.898.016.29.012.676-.11 1.059.808.39.937 1.332 3.254 1.449 3.488.117.235.195.508.04.82-.157.313-.235.508-.47.784-.234.274-.492.614-.703.824-.234.234-.477.489-.205.96.274.47 1.215 2.004 2.61 3.246 1.793 1.597 3.305 2.09 3.773 2.325.469.234.742.195 1.016-.118.273-.312 1.176-1.37 1.488-1.843.313-.469.625-.39 1.055-.234.43.156 2.742 1.293 3.211 1.527.469.235.781.352.898.547.117.195.117 1.133-.273 2.227z" />
      </svg>
      <span className={styles.waFloatText}>Asistencia</span>
    </a>
  );
}
