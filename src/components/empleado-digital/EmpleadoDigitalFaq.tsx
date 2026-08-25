import styles from "@/app/empleado-digital/empleado-digital.module.css";
import { EMPLEADO_DIGITAL_FAQ } from "@/content/empleado-digital-faq";

export default function EmpleadoDigitalFaq() {
  return (
    <section className={styles.faqSection} aria-labelledby="ed-faq-h2">
      <div className={styles.faqInner}>
        <p className={styles.duoEyebrow}>Preguntas frecuentes</p>
        <h2 id="ed-faq-h2" className={styles.duoH2}>
          Empleados digitales, sin misterio
        </h2>
        <dl className={styles.faqList}>
          {EMPLEADO_DIGITAL_FAQ.map((item) => (
            <div key={item.q} className={styles.faqItem}>
              <dt className={styles.faqQ}>{item.q}</dt>
              <dd className={styles.faqA}>{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
