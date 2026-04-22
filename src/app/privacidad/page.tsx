import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidad — Clinera.io",
  description:
    "Política de privacidad de Clinera.io. Cómo recopilamos, usamos y protegemos tu información personal, incluidos los servicios de inteligencia artificial.",
  alternates: { canonical: "https://clinera.io/privacidad" },
  openGraph: {
    url: "https://clinera.io/privacidad",
    title: "Política de Privacidad — Clinera.io",
    description:
      "Cómo recopilamos, usamos y protegemos tu información personal en Clinera.io.",
    type: "article",
  },
};

const LAST_UPDATED = "20 de abril de 2026";

export default function PrivacidadPage() {
  return (
    <>
      <NavV3 />
      <main>
        <section className="section">
          <div className="container" style={{ maxWidth: 820 }}>
            <div style={{ marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "var(--font-tech)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--brand-cyan)",
                }}
              >
                Legal
              </span>
            </div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--ink-primary)",
                marginBottom: 8,
              }}
            >
              Política de Privacidad
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--ink-tertiary)",
                marginBottom: 32,
              }}
            >
              Última actualización: {LAST_UPDATED}
            </p>

            <div
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "var(--ink-secondary)",
              }}
            >
              <h2 style={h2}>1. Entidad Legal</h2>
              <p style={p}>
                La presente Política de Privacidad describe cómo{" "}
                <strong>OACG Inc.</strong>, en adelante &quot;la Empresa&quot;,
                recopila, utiliza y protege la información que obtenemos de
                usted (en adelante, el &quot;Usuario&quot;) a través del sitio
                web y los servicios de Clinera.io (&quot;Clinera&quot;).
              </p>
              <p style={p}>
                Clinera.io es un producto y servicio comercializado y operado
                exclusivamente por OACG Inc.
              </p>

              <h2 style={h2}>2. Qué datos recopilamos</h2>
              <p style={p}>Recopilamos los siguientes tipos de información:</p>
              <ul style={ul}>
                <li>
                  <strong>Datos de contacto:</strong> nombre, dirección de
                  correo electrónico y número de teléfono proporcionados
                  voluntariamente a través de formularios en nuestro sitio web.
                </li>
                <li>
                  <strong>Información de la clínica o negocio:</strong> nombre
                  de la empresa ingresado para solicitar demostraciones o
                  contratar planes de software.
                </li>
                <li>
                  <strong>Datos de uso y navegación:</strong> interacciones con
                  nuestro sitio web, tipo de navegador, sistema operativo y
                  otra información analítica recopilada mediante cookies o
                  herramientas de medición de terceros (p.ej.: píxeles de
                  seguimiento).
                </li>
              </ul>

              <h2 style={h2}>3. Cómo usamos y protegemos la información</h2>
              <p style={p}>
                Utilizamos la información recopilada con los siguientes fines:
              </p>
              <ul style={ul}>
                <li>
                  Proveer, mantener, operar y mejorar nuestros servicios web y
                  de software.
                </li>
                <li>
                  Contactarle para programar demostraciones técnicas, brindar
                  soporte técnico o enviar actualizaciones del servicio.
                </li>
                <li>
                  Personalizar la experiencia web y nuestras comunicaciones
                  comerciales.
                </li>
              </ul>
              <p style={p}>
                <strong>Protección:</strong> en OACG Inc. tomamos medidas de
                seguridad técnicas razonables y acorde a los estándares
                modernos de la industria (encriptación, acceso restringido)
                para proteger sus datos personales a fin de evitar su pérdida,
                alteración o el acceso no autorizado a los mismos.
              </p>

              <h2 style={h2}>4. Uso de servicios de inteligencia artificial</h2>
              <p style={p}>
                Clinera utiliza servicios de inteligencia artificial (IA) de
                terceros para mejorar la experiencia de atención al paciente a
                través de funciones de mensajería automatizada. A continuación,
                detallamos cómo se utilizan estos servicios.
              </p>

              <h3 style={h3}>4.1 Proveedores de IA</h3>
              <p style={p}>
                Los datos son procesados a través de los siguientes
                proveedores:
              </p>
              <ul style={ul}>
                <li>
                  <strong>OpenRouter</strong> (
                  <a
                    href="https://openrouter.ai/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    openrouter.ai
                  </a>
                  ) — servicio de enrutamiento de modelos de IA que actúa como
                  intermediario para acceder a{" "}
                  <strong>Google Gemini</strong> y <strong>OpenAI GPT</strong>.
                </li>
              </ul>

              <h3 style={h3}>4.2 Datos compartidos con proveedores de IA</h3>
              <p style={p}>
                Cuando las funciones de IA están habilitadas, los siguientes
                datos pueden ser enviados a los proveedores mencionados para
                su procesamiento:
              </p>
              <ul style={ul}>
                <li>Nombre del paciente o contacto.</li>
                <li>
                  Contenido de los mensajes de WhatsApp dentro de la
                  conversación activa.
                </li>
                <li>
                  Datos de citas: fecha, hora, disponibilidad y motivo de
                  consulta.
                </li>
                <li>Información básica del profesional asignado.</li>
              </ul>

              <h3 style={h3}>4.3 Finalidad del procesamiento</h3>
              <p style={p}>
                Los datos se envían a estos servicios exclusivamente para:
              </p>
              <ul style={ul}>
                <li>Generar respuestas automatizadas a consultas de pacientes.</li>
                <li>Asistir en el agendamiento inteligente de citas.</li>
                <li>Clasificar y priorizar consultas entrantes.</li>
              </ul>

              <h3 style={h3}>4.4 Consentimiento del usuario</h3>
              <p style={p}>
                Antes de que cualquier dato sea enviado a proveedores de IA,
                la aplicación solicita el consentimiento explícito del usuario
                mediante una pantalla de autorización. El usuario puede:
              </p>
              <ul style={ul}>
                <li>
                  <strong>Aceptar:</strong> se habilitan las funciones de
                  mensajería con IA.
                </li>
                <li>
                  <strong>Rechazar:</strong> no se envían datos a proveedores
                  de IA y las funciones de mensajería automatizada no estarán
                  disponibles.
                </li>
              </ul>
              <p style={p}>
                El usuario puede revocar este consentimiento en cualquier
                momento desde la configuración de la aplicación.
              </p>

              <h3 style={h3}>4.5 Protección de datos</h3>
              <p style={p}>
                Todas las comunicaciones con los proveedores de IA se realizan
                mediante conexiones cifradas (HTTPS/TLS). Los proveedores de
                IA utilizados cumplen con estándares de protección de datos
                equivalentes y no utilizan los datos enviados para entrenar
                sus modelos cuando se acceden a través de API empresariales.
              </p>
              <p style={p}>
                Para más información, consulte las políticas de privacidad de
                cada proveedor:
              </p>
              <ul style={ul}>
                <li>
                  <a
                    href="https://openrouter.ai/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidad de OpenRouter
                  </a>
                </li>
                <li>
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidad de Google
                  </a>
                </li>
                <li>
                  <a
                    href="https://openai.com/policies/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidad de OpenAI
                  </a>
                </li>
              </ul>

              <h2 style={h2}>5. Información de contacto</h2>
              <p style={p}>
                Si tiene preguntas, inquietudes o desea ejercer sus derechos
                sobre sus datos personales, puede comunicarse con nuestro
                equipo oficial escribiendo a{" "}
                <a href="mailto:hola@clinera.io">hola@clinera.io</a>.
              </p>

              <p style={{ ...p, marginTop: 28 }}>
                Consulta también nuestra{" "}
                <Link href="/cookies">Política de Cookies</Link> y los{" "}
                <Link href="/terminos">Términos y Condiciones</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}

const h2 = {
  fontSize: "1.4rem",
  fontWeight: 700,
  color: "var(--ink-primary)",
  marginTop: 36,
  marginBottom: 12,
  letterSpacing: "-0.02em",
} as const;

const h3 = {
  fontSize: "1.1rem",
  fontWeight: 600,
  color: "var(--ink-primary)",
  marginTop: 22,
  marginBottom: 10,
} as const;

const p = {
  marginBottom: 14,
  color: "var(--ink-secondary)",
  lineHeight: 1.7,
} as const;

const ul = {
  margin: "0 0 18px",
  paddingLeft: 24,
  color: "var(--ink-secondary)",
  lineHeight: 1.75,
} as const;
