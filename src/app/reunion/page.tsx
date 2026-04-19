import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalEmbed from "./CalEmbed";
import styles from "./reunion.module.css";

export const metadata: Metadata = {
  title: "Agenda una reunión con Clinera",
  description:
    "Reserva tu reunión con el equipo de Clinera. Elige el horario que mejor te acomode y conversemos sobre cómo activar AURA en tu clínica.",
  openGraph: {
    title: "Agenda una reunión con Clinera",
    description: "Reserva tu reunión con el equipo de Clinera.",
    url: "https://clinera.io/reunion",
    type: "website",
  },
};

export default function ReunionPage() {
  return (
    <>
      <Header />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>
              <span className={styles.dot} /> REUNIÓN · 30 MIN
            </div>
            <h1 className={styles.title}>
              Agenda una reunión con el{" "}
              <span className={styles.accent}>equipo de Clinera</span>
            </h1>
            <p className={styles.subtitle}>
              Elige el horario que mejor te acomode. Conversemos sobre cómo
              activar AURA en tu clínica y resolvemos todas tus dudas.
            </p>
          </div>
        </section>

        <section className={styles.calWrap}>
          <CalEmbed />
        </section>
      </main>

      <Footer />
    </>
  );
}
