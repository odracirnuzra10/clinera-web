import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./funciones.module.css";

export const metadata: Metadata = {
  title: "Funciones — Software clínico con IA",
  description:
    "Agenda inteligente, AURA (IA conversacional), ficha clínica, comunicación automatizada y reportes. Todas las funciones de Clinera.",
  alternates: {
    canonical: "https://clinera.io/funciones",
  },
  openGraph: {
    url: "https://clinera.io/funciones",
  },
};

export default function FuncionesPage() {
  return (
    <>
      <Header />

      <main>
        {/* ── Software Hero ── */}
        <section className={`${styles.softwareHero} container`}>
          <h1>Gesti&oacute;n m&eacute;dica dise&ntilde;ada para la velocidad</h1>
          <p className="section-subtitle">
            Software para cl&iacute;nicas que responde y agenda pacientes
            autom&aacute;ticamente. Deja atr&aacute;s las interfaces lentas y
            sobrecargadas.
          </p>
        </section>

        {/* ── Feature Blocks ── */}
        <section className="container">
          {/* Agenda medica inteligente */}
          <div className={styles.featureBlock}>
            <div className={styles.featureImage}>
              <Image
                src="/images/agenda.webp"
                alt="Agenda medica inteligente"
                width={600}
                height={400}
              />
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureSubtitle}>Agendamiento</span>
              <h2>Agenda m&eacute;dica inteligente</h2>
              <p>
                Un calendario dise&ntilde;ado para equipos cl&iacute;nicos que
                necesitan rapidez y precisi&oacute;n. Sin fricci&oacute;n, sin
                clics innecesarios.
              </p>
              <ul className={styles.featureListMini}>
                <li>Calendario Ultra-r&aacute;pido</li>
                <li>Recordatorios Auto</li>
                <li>Ficha auto-creada</li>
                <li>Confirmaci&oacute;n v&iacute;a WhatsApp</li>
              </ul>
            </div>
          </div>

          {/* Mensajeria Omnicanal */}
          <div className={`${styles.featureBlock} ${styles.reverse}`}>
            <div className={styles.featureImage}>
              <Image
                src="/images/mensajeria.webp"
                alt="Mensajeria Omnicanal"
                width={600}
                height={400}
              />
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureSubtitle}>Comunicaciones</span>
              <h2>Mensajer&iacute;a Omnicanal</h2>
              <p>
                Centraliza WhatsApp, Instagram y llamadas en un solo inbox. La
                IA responde cuando tu equipo no est&aacute; disponible.
              </p>
              <ul className={styles.featureListMini}>
                <li>Inbox Omnicanal</li>
                <li>Respuestas 24/7</li>
                <li>Derivaci&oacute;n Humana</li>
                <li>Botones de acci&oacute;n r&aacute;pida</li>
              </ul>
            </div>
          </div>

          {/* Ventas Trazables */}
          <div className={styles.featureBlock}>
            <div className={styles.featureImage}>
              <Image
                src="/images/ventas.webp"
                alt="Ventas Trazables"
                width={600}
                height={400}
              />
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureSubtitle}>Ventas</span>
              <h2>Ventas Trazables</h2>
              <p>
                Sigue cada peso desde el anuncio hasta el cobro. Atribuci&oacute;n
                real, sin planillas ni supuestos.
              </p>
              <ul className={styles.featureListMini}>
                <li>Control de ROI Real</li>
                <li>Seguimiento de Pagos</li>
                <li>Atribuci&oacute;n de Canal</li>
                <li>Reportes Directos</li>
              </ul>
            </div>
          </div>

          {/* Ficha Clinica Digital */}
          <div className={`${styles.featureBlock} ${styles.reverse}`}>
            <div className={styles.featureImage}>
              <Image
                src="/images/ficha.webp"
                alt="Ficha Clinica Digital"
                width={600}
                height={400}
              />
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureSubtitle}>Ficha Cl&iacute;nica</span>
              <h2>Ficha Cl&iacute;nica Digital</h2>
              <p>
                Historial completo de cada paciente, accesible en segundos.
                Campos personalizables y adjuntos sin l&iacute;mite.
              </p>
              <ul className={styles.featureListMini}>
                <li>Historial Ordenado</li>
                <li>Campos Flexibles</li>
                <li>Evoluci&oacute;n Cl&iacute;nica</li>
                <li>Adjuntos Ilimitados</li>
              </ul>
            </div>
          </div>

          {/* Marketing (Meta + Google) */}
          <div className={styles.featureBlock}>
            <div className={styles.featureImage}>
              <Image
                src="/images/marketing.webp"
                alt="Marketing Meta y Google"
                width={600}
                height={400}
              />
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureSubtitle}>Marketing</span>
              <h2>Marketing (Meta + Google)</h2>
              <p>
                Conecta tus campa&ntilde;as directamente al software. Visualiza
                qu&eacute; anuncio genera cada paciente y optimiza sin salir de
                Clinera.
              </p>
              <ul className={styles.featureListMini}>
                <li>Conector Meta/Google</li>
                <li>Atribuci&oacute;n autom&aacute;tica</li>
                <li>Panel por campa&ntilde;a</li>
                <li>Decisiones sin planillas</li>
              </ul>
              <div style={{ marginTop: "2rem" }}>
                <Link href="/planes" className="btn btn-primary">
                  Agendar Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className={styles.testimonialSection}>
          <div className="text-center" style={{ marginBottom: "3rem" }}>
            <h2 className="section-title">Lo que dicen nuestros clientes</h2>
          </div>
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <span className={styles.testimonialResult}>+24%</span>
              <p className={styles.testimonialText}>
                &ldquo;Logramos facturar 45M adicionales gracias a la
                trazabilidad de ventas.&rdquo;
              </p>
              <span className={styles.testimonialAuthor}>Karla D&iacute;az</span>
              <span className={styles.testimonialClinic}>M&eacute;todo Hebe</span>
            </div>

            <div className={styles.testimonialCard}>
              <span className={styles.testimonialResult}>+39%</span>
              <p className={styles.testimonialText}>
                &ldquo;La IA Aura recuper&oacute; pacientes que antes
                perd&iacute;amos fuera de horario.&rdquo;
              </p>
              <span className={styles.testimonialAuthor}>Tamara Oyarz&uacute;n</span>
              <span className={styles.testimonialClinic}>Lumina Protocolo</span>
            </div>

            <div className={styles.testimonialCard}>
              <span className={styles.testimonialResult}>6.7x</span>
              <p className={styles.testimonialText}>
                &ldquo;Nuestro ROAS se estabiliz&oacute; en niveles r&eacute;cord
                desde la integraci&oacute;n.&rdquo;
              </p>
              <span className={styles.testimonialAuthor}>Daniela Aguilera</span>
              <span className={styles.testimonialClinic}>Beauty Esthetics</span>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="container">
          <div className="cta-banner">
            <h2>&iquest;Listo para modernizar tu gesti&oacute;n?</h2>
            <p>
              Descubre c&oacute;mo Clinera puede transformar la operaci&oacute;n
              de tu cl&iacute;nica.
            </p>
            <div className="banner-actions">
              <Link href="/planes" className="btn btn-primary btn-lg">
                Ver Demo en Vivo
              </Link>
              <Link href="/contacto" className="btn btn-outline btn-lg">
                Contacta a un especialista
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
