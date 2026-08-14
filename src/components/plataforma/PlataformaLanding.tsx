import Image from "next/image";
import Link from "next/link";
import { CnnLogo } from "@/components/brand-v3/Brand";
import { IntelligencePlataformaSection } from "@/components/IntelligenceSection";
import AuraNetwork from "./AuraNetwork";
import PlanesSection from "./PlanesSection";
import styles from "./PlataformaLanding.module.css";

const CLIENTS = [
  { src: "/presentacion/clientes/andes.png", alt: "Andes Salud" },
  { src: "/presentacion/clientes/everest.png", alt: "Everest Clínicas Dentales" },
  { src: "/presentacion/clientes/sanatorio.png", alt: "Sanatorio Alemán" },
  { src: "/presentacion/clientes/sonrie.png", alt: "Sonríe" },
  { src: "/presentacion/clientes/lumina.png", alt: "Lumina Clínica Facial" },
  { src: "/presentacion/clientes/hebe.png", alt: "Método Hebe" },
];

const PARTNERS = [
  { src: "/images/badges/meta-business-partner.svg", alt: "Meta Business Partner" },
  { src: "/images/badges/whatsapp-business.svg", alt: "WhatsApp Business API oficial" },
  { src: "/images/badges/stripe.svg", alt: "Stripe" },
  { src: "/images/badges/google-calendar.svg", alt: "Google Calendar" },
];

const MIGRATION_STEPS = [
  {
    number: "01",
    title: "Migramos",
    copy: "Importamos pacientes, agendas y datos históricos desde tu sistema actual.",
  },
  {
    number: "02",
    title: "Configuramos",
    copy: "Preparamos sedes, roles, precios, protocolos y automatizaciones.",
  },
  {
    number: "03",
    title: "Capacitamos",
    copy: "Entrenamos al equipo operativo y a quienes necesitan control gerencial.",
  },
  {
    number: "04",
    title: "Entregamos",
    copy: "Validamos contigo y activamos una operación lista para trabajar.",
  },
];

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17" fill="none">
      <path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NetworkConsole() {
  return (
    <div className={styles.console} aria-label="Vista de control multi-sede de Clinera">
      <div className={styles.consoleBar}>
        <div className={styles.windowDots} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className={styles.consoleUrl}>app.clinera.io / consolidado-red</span>
        <span className={styles.livePill}><i /> IA activa</span>
      </div>

      <div className={styles.consoleBody}>
        <div className={styles.consoleData}>
          <div className={styles.consoleHeading}>
            <div>
              <span className={styles.consoleEyebrow}>Consolidado de red</span>
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
            <div><span><i className={styles.violetDot} />Providencia</span><b><i style={{ width: "88%" }} /></b><small>88%</small></div>
            <div><span><i className={styles.blueDot} />Las Condes</span><b><i style={{ width: "81%" }} /></b><small>81%</small></div>
            <div><span><i className={styles.magentaDot} />Viña del Mar</span><b><i style={{ width: "74%" }} /></b><small>74%</small></div>
          </div>
        </div>

        <div className={styles.consoleAgent}>
          <div className={styles.agentHeading}>
            <span className={styles.agentMark} aria-hidden="true">✦</span>
            <div><strong>AURA</strong><small>Atiende las 3 sedes · 24/7</small></div>
          </div>
          <span className={styles.channelLabel}>Responde por texto</span>
          <div className={styles.incoming}>Hola, ¿tienen hora mañana en Las Condes?</div>
          <div className={styles.outgoing}>Sí: mañana 10:00 con la Dra. Meza. ¿Se la agendo?</div>
          <div className={styles.callRow}>
            <span className={styles.avatar}>MR</span>
            <div><strong>Sra. Rojas</strong><small>en llamada · 00:14</small></div>
            <span className={styles.wave} aria-hidden="true"><i /><i /><i /><i /><i /></span>
          </div>
          <div className={styles.agentResult}><Check />14 citas agendadas hoy</div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Para clínicas con equipo, alto volumen o varias sedes</span>
          <h1>
            Clinera O.S.
            <span> El sistema operativo de tu clínica con IA.</span>
          </h1>
          <strong className={styles.enterpriseThesis}>
            Mucho más que un chatbot: el sistema por el que opera tu clínica, con la potencia
            enterprise de las clínicas grandes al alcance de la tuya.
          </strong>
          <p>
            Agenda, tratamientos, pacientes, fichas clínicas, consentimientos, automatizaciones,
            ventas, marketing y comunicación con IA por voz y texto — en una sola plataforma.
            Migramos tus datos, configuramos la operación y capacitamos a tu equipo.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryCta} href="/ventas">
              Ver Clinera con mi operación
              <Arrow />
            </Link>
            <Link className={styles.secondaryCta} href="#migracion">
              Cómo migramos
            </Link>
          </div>
          <div className={styles.proofLine} aria-label="Cifras de Clinera">
            <span><strong>80+</strong> clínicas activas</span>
            <i />
            <span><strong>500+</strong> profesionales</span>
            <i />
            <span><strong>10</strong> países</span>
          </div>
        </div>
        <div className={styles.heroProduct}>
          <span className={styles.productLabel}>Multi-sede por diseño</span>
          <NetworkConsole />
        </div>
      </div>
    </section>
  );
}

function ClientProof() {
  return (
    <section className={styles.clientProof} aria-label="Clínicas que operan con Clinera">
      <div className={styles.clientProofInner}>
        <span>Clínicas que ya operan con Clinera</span>
        <div className={styles.clientLogos}>
          {CLIENTS.map((client) => (
            <div key={client.src} className={styles.clientLogo}>
              <Image src={client.src} alt={client.alt} width={180} height={64} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomerResult() {
  return (
    <section className={styles.resultSection}>
      <div className={styles.resultGrid}>
        <div className={styles.resultNumber}>
          <span>Resultado reportado por cliente</span>
          <strong>−71%</strong>
          <p>en costos de marketing</p>
        </div>
        <figure className={styles.testimonial}>
          <blockquote>“Clinera me permite crecer sin pagar de más.”</blockquote>
          <figcaption>
            <Image src="/images/testimonials/flavio-rojas.jpeg" alt="Dr. Flavio Rojas" width={56} height={56} />
            <span>
              <strong>Dr. Flavio Rojas</strong>
              <small>Fundador · infiltracion.cl</small>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function PressCNN() {
  return (
    <section className={styles.pressSection} aria-labelledby="cnn-title">
      <div className={styles.pressCard}>
        <div className={styles.pressCopy}>
          <span className={styles.pressEyebrow}>Clinera en la prensa</span>
          <CnnLogo height={36} color="#F03A47" />
          <h2 id="cnn-title">Un gran paso para Clinera.</h2>
          <p>
            CNN conoció cómo estamos construyendo la infraestructura que ayuda a las clínicas de LATAM a
            crecer con más control, automatización e inteligencia.
          </p>
          <div className={styles.pressLinks}>
            <Link href="/prensa">Ver cobertura y prensa <Arrow /></Link>
            <a href="https://www.youtube.com/watch?v=Gskr4kELyx4" target="_blank" rel="noreferrer">
              Abrir en YouTube
            </a>
          </div>
        </div>

        <div className={styles.pressVideo}>
          <iframe
            src="https://player.vimeo.com/video/1205127087?badge=0&autopause=0&player_id=0&app_id=58479"
            title="Reportaje de CNN sobre Clinera"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function Migration() {
  return (
    <section id="migracion" className={styles.migrationSection}>
      <div className={styles.container}>
        <div className={styles.migrationHeading}>
          <div>
            <span className={styles.eyebrow}>Implementación gestionada</span>
            <h2>Cambiar de sistema no tiene que paralizar tu clínica.</h2>
          </div>
          <div>
            <p>
              Nos hacemos cargo del cambio: migración validada, configuración, capacitación y entrega con
              interrupción mínima.
            </p>
            <Link href="/migracion" className={styles.textLink}>Ver proceso de migración <Arrow /></Link>
          </div>
        </div>

        <ol className={styles.migrationSteps}>
          {MIGRATION_STEPS.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </li>
          ))}
        </ol>

        <div className={styles.securityStrip}>
          <div>
            <span className={styles.securityIcon}><Check /></span>
            <span><strong>Seguridad y trazabilidad</strong><small>Datos aislados por clínica y accesos registrados.</small></span>
          </div>
          <ul>
            <li>AES-256-GCM</li>
            <li>Cloud KMS</li>
            <li>Ley 20.584</li>
            <li>Backups + PITR</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className={styles.trustSection}>
      <div className={styles.trustInner}>
        <div>
          <span className={styles.eyebrow}>Infraestructura conectada</span>
          <h2>Opera sobre herramientas oficiales.</h2>
        </div>
        <div className={styles.partnerLogos}>
          {PARTNERS.map((partner) => (
            <Image key={partner.src} src={partner.src} alt={partner.alt} width={147} height={44} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FrequentlyAsked() {
  const questions = [
    {
      q: "¿Qué pasa con el software que usamos hoy?",
      a: "Revisamos tu sistema actual, definimos qué se migra y preparamos el cambio antes de intervenir la operación.",
    },
    {
      q: "¿Cómo validan la migración?",
      a: "Mapeamos los datos, hacemos controles de integridad y validamos contigo las excepciones antes de la entrega.",
    },
    {
      q: "¿Cuánto demora la implementación?",
      a: "Depende del volumen de datos, las sedes y las integraciones. El alcance y el calendario quedan definidos antes de comenzar.",
    },
    {
      q: "¿Hay permanencia?",
      a: "Sí. Todos los planes tienen una permanencia mínima de 6 meses. Puedes pagar mes a mes, anticipar el semestre con 20% de descuento, o anticipar el año con 20% de descuento y la implementación de USD 450 incluida sin costo.",
    },
  ];

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqGrid}>
        <div>
          <span className={styles.eyebrow}>Antes de cambiar</span>
          <h2>Las preguntas que importan.</h2>
          <p>El producto importa. La continuidad de tu clínica también.</p>
        </div>
        <div className={styles.faqList}>
          {questions.map((item) => (
            <details key={item.q}>
              <summary>{item.q}<span aria-hidden="true">+</span></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className={styles.finalCta}>
      <div className={styles.finalCtaInner}>
        <span className={styles.finalEyebrow}>IA enterprise para clínicas medianas</span>
        <h2>La solución enterprise de IA que usan las clínicas grandes, al alcance de la tuya.</h2>
        <p>En 30 minutos te mostramos cómo se verían tus sedes, tu equipo y tus procesos dentro de Clinera.</p>
        <Link className={styles.finalButton} href="/ventas">Ver Clinera con mi operación <Arrow /></Link>
        <div className={styles.finalMeta}>
          <span>Anual: 20% OFF + implementación gratis</span>
          <i />
          <span>Desde USD 279/mes</span>
          <i />
          <span>Permanencia mínima: 6 meses</span>
          <i />
          <span>Migración gestionada</span>
          <i />
          <span>WhatsApp Business API</span>
        </div>
      </div>
    </section>
  );
}

export default function PlataformaLanding() {
  return (
    <div className={styles.page}>
      <Hero />
      <ClientProof />
      <AuraNetwork />
      <IntelligencePlataformaSection />
      <CustomerResult />
      <PressCNN />
      <Migration />
      <PlanesSection />
      <Trust />
      <FrequentlyAsked />
      <FinalCta />
    </div>
  );
}
