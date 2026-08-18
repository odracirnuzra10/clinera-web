import Image from "next/image";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { CnnLogo } from "@/components/brand-v3/Brand";
import CtaLink from "./CtaLink";
import PlanesSection2 from "./PlanesSection2";
import styles from "./PlataformaLanding2.module.css";

const CLIENTS = [
  { src: "/presentacion/clientes/andes.png", alt: "Andes Salud" },
  { src: "/presentacion/clientes/everest.png", alt: "Everest Clínicas Dentales" },
  { src: "/presentacion/clientes/sanatorio.png", alt: "Sanatorio Alemán" },
  { src: "/presentacion/clientes/sonrie.png", alt: "Sonríe" },
  { src: "/presentacion/clientes/lumina.png", alt: "Lumina Clínica Facial" },
  { src: "/presentacion/clientes/hebe.png", alt: "Método Hebe" },
];

const MODULES = [
  {
    title: "Agenda multi-sede",
    copy: "Horas, bloqueos y profesionales de todas tus sedes en una sola vista.",
  },
  {
    title: "Ficha clínica y consentimientos",
    copy: "Historial, exámenes y consentimientos firmados, archivados por paciente.",
  },
  {
    title: "Pagos y cobros",
    copy: "Cobra, concilia y sabe qué entra por tratamiento y por sede.",
  },
  {
    title: "AURA, la IA que atiende",
    copy: "Responde WhatsApp 24/7, agenda, reagenda y confirma citas por voz.",
  },
  {
    title: "Ventas y marketing",
    copy: "Campañas, difusiones y seguimiento de cada paciente que no volvió.",
  },
  {
    title: "Clinera Intelligence",
    copy: "Pregunta en lenguaje natural; responde con los datos reales de tu clínica.",
  },
];

const MIGRATION_STEPS = [
  { number: "01", title: "Migramos", copy: "Pacientes, agendas e historial desde tu sistema actual." },
  { number: "02", title: "Configuramos", copy: "Sedes, roles, precios, protocolos y automatizaciones." },
  { number: "03", title: "Capacitamos", copy: "Al equipo operativo y a quien necesita control gerencial." },
  { number: "04", title: "Entregamos", copy: "Validamos contigo y activamos la operación." },
];

export const FAQ = [
  {
    q: "¿Se integra con Reservo, AgendaPro o Medilink?",
    a: "No. Clinera opera sobre su propia agenda, ficha clínica y módulo de pagos — por eso migramos tus datos en el onboarding en vez de sincronizar dos sistemas. Para conectar otras herramientas tienes Webhooks y API pública (n8n, Make, Zapier) en los planes Atlas y Summit.",
  },
  {
    q: "¿Qué pasa con el software que usamos hoy?",
    a: "Revisamos tu sistema actual, definimos qué se migra y preparamos el cambio antes de intervenir la operación. Mapeamos los datos, hacemos controles de integridad y validamos contigo las excepciones antes de la entrega.",
  },
  {
    q: "¿Cuánto demora la implementación?",
    a: "Depende del volumen de datos, las sedes y las integraciones. El alcance y el calendario quedan definidos antes de comenzar. La implementación tiene un costo único de USD 450, incluido sin costo si contratas el plan anual.",
  },
  {
    q: "¿Hay permanencia?",
    a: "Sí, 6 meses mínimo en todos los planes. Puedes pagar mes a mes, anticipar el semestre con 20% de descuento, o anticipar el año con 20% de descuento y la implementación incluida.",
  },
  {
    q: "¿Cómo protegen los datos de los pacientes?",
    a: "Datos aislados por clínica, cifrado AES-256-GCM con Cloud KMS, accesos registrados, backups con point-in-time recovery y operación conforme a la Ley 20.584.",
  },
];

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17" fill="none">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Console() {
  return (
    <figure className={styles.console}>
      <div className={styles.consoleBar}>
        <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
        <span className={styles.consoleUrl}>app.clinera.io / consolidado-red</span>
      </div>
      <div className={styles.consoleBody}>
        <div className={styles.consoleHead}>
          <strong>3 sedes · este mes</strong>
          <span className={styles.live}><i />AURA activa</span>
        </div>
        <div className={styles.kpis}>
          <div><span>Citas</span><strong>2.347</strong></div>
          <div><span>Ocupación</span><strong>83%</strong></div>
          <div><span>No-show</span><strong>6,1%</strong></div>
          <div><span>Recuperados</span><strong>184</strong></div>
        </div>
        <div className={styles.branches}>
          <div><span>Providencia</span><b><i style={{ width: "88%" }} /></b><small>88%</small></div>
          <div><span>Las Condes</span><b><i style={{ width: "81%" }} /></b><small>81%</small></div>
          <div><span>Viña del Mar</span><b><i style={{ width: "74%" }} /></b><small>74%</small></div>
        </div>
        <div className={styles.chat}>
          <p className={styles.incoming}>Hola, ¿tienen hora mañana en Las Condes?</p>
          <p className={styles.outgoing}>Sí: mañana 10:00 con la Dra. Meza. ¿Se la agendo?</p>
        </div>
      </div>
      <figcaption className={styles.consoleNote}>Vista de ejemplo con datos de demostración.</figcaption>
    </figure>
  );
}

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        <div>
          <span className={styles.eyebrow}>Para clínicas con equipo, alto volumen o varias sedes</span>
          <h1>
            Clinera O.S.<span>El sistema operativo de tu clínica.</span>
          </h1>
          <p className={styles.lead}>
            Agenda, fichas, pagos y WhatsApp con IA en una sola plataforma. Migramos tus datos,
            configuramos la operación y capacitamos a tu equipo.
          </p>
          <div className={styles.actions}>
            <CtaLink href="/agenda" id="hero-demo" location="hero" className={styles.primaryCta}>
              Agendar demo de 30 min<Arrow />
            </CtaLink>
            <CtaLink href="#precios" id="hero-planes" location="hero" className={styles.secondaryCta}>
              Ver planes
            </CtaLink>
          </div>
          <p className={styles.proof}>
            <strong>+52</strong> clínicas activas<i />
            <strong>+500</strong> profesionales<i />
            <strong>10</strong> países
          </p>
        </div>
        <Console />
      </div>
    </section>
  );
}

function Credibility() {
  return (
    <section className={styles.credibility} aria-label="Clínicas y prensa">
      <div className={styles.logos}>
        {CLIENTS.map((c) => (
          <Image key={c.src} src={c.src} alt={c.alt} width={132} height={44} />
        ))}
      </div>
      <Link href="/prensa" className={styles.pressLink}>
        <CnnLogo height={20} color="#111111" />
        <span>Clinera en CNN — ver cobertura</span>
        <Arrow />
      </Link>
    </section>
  );
}

function Modules() {
  return (
    <section className={styles.modules}>
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>Un solo sistema</span>
        <h2>Todo lo que hoy tienes repartido en cinco herramientas.</h2>
      </header>
      <div className={styles.moduleGrid}>
        {MODULES.map((m) => (
          <article key={m.title}>
            <h3>{m.title}</h3>
            <p>{m.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Result() {
  return (
    <section className={styles.result}>
      <div>
        <strong className={styles.bigNumber}>−73%</strong>
        <p className={styles.resultCopy}>
          de no-shows en promedio, medido sobre 52 clínicas activas comparando los 90 días previos y
          posteriores a Clinera (abril 2026).
        </p>
        <Link href="/recursos/calculadora-roi" className={styles.textLink}>
          Calcular mi ahorro <Arrow />
        </Link>
      </div>
      <figure className={styles.testimonial}>
        <blockquote>“Clinera me permite crecer sin pagar de más.”</blockquote>
        <figcaption>
          <Image src="/images/testimonials/flavio-rojas.jpeg" alt="Dr. Flavio Rojas" width={44} height={44} />
          <span>
            <strong>Dr. Flavio Rojas</strong>
            <small>Fundador · infiltracion.cl</small>
          </span>
        </figcaption>
      </figure>
    </section>
  );
}

function Migration() {
  return (
    <section id="migracion" className={styles.migration}>
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>Implementación gestionada</span>
        <h2>Cambiar de sistema no tiene que paralizar tu clínica.</h2>
      </header>
      <ol className={styles.steps}>
        {MIGRATION_STEPS.map((s) => (
          <li key={s.number}>
            <span>{s.number}</span>
            <h3>{s.title}</h3>
            <p>{s.copy}</p>
          </li>
        ))}
      </ol>
      <div className={styles.securityStrip}>
        <span>Datos aislados por clínica y accesos registrados</span>
        <ul>
          <li>AES-256-GCM</li>
          <li>Cloud KMS</li>
          <li>Ley 20.584</li>
          <li>Backups + PITR</li>
        </ul>
        <Link href="/seguridad" className={styles.textLink}>Ver seguridad <Arrow /></Link>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className={styles.faq}>
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>Antes de cambiar</span>
        <h2>Las preguntas que importan.</h2>
      </header>
      <div className={styles.faqList}>
        {FAQ.map((item) => (
          <details key={item.q}>
            <summary>{item.q}<span aria-hidden="true" /></summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className={styles.finalCta}>
      <h2>Te mostramos tu clínica dentro de Clinera.</h2>
      <p>30 minutos, con tus sedes, tu equipo y tus procesos reales.</p>
      <CtaLink href="/agenda" id="final-demo" location="cierre" className={styles.primaryCtaDark}>
        Agendar demo de 30 min<Arrow />
      </CtaLink>
      <p className={styles.finalMeta}>
        Desde USD 279/mes · Implementación USD 450 (gratis en plan anual) · Permanencia mínima 6 meses
      </p>
    </section>
  );
}

export default function PlataformaLanding2() {
  return (
    <>
      <NavV3 ctaHref="/agenda" />
      <main className={styles.page}>
        <Hero />
        <Credibility />
        <Modules />
        <Result />
        <Migration />
        <PlanesSection2 />
        <Faq />
        <FinalCta />
      </main>
      <FooterV3 />
    </>
  );
}
