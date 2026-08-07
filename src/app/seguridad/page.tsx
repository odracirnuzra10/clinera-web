import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import SeguridadLanding from "@/components/seguridad/SeguridadLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  CONTACTO_PRIVACIDAD,
  SEGURIDAD_FAQ,
  ULTIMA_ACTUALIZACION,
} from "@/content/seguridad";

const URL = "https://www.clinera.io/seguridad";

const TITULO = "Seguridad y Ley 21.719 — cómo Clinera trata los datos de tus pacientes";
const DESCRIPCION =
  "Clinera es encargado del tratamiento y tu clínica la responsable. Controles de seguridad, subencargados con nombre, retención de datos, derechos del paciente y anexo DPA, frente a la Ley 21.719 que entra en vigencia el 1 de diciembre de 2026.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  keywords: [
    "ley 21719",
    "software clinica ley 21719",
    "proteccion de datos clinicas chile",
    "encargado del tratamiento",
    "responsable del tratamiento",
    "DPA clinica",
    "contrato de encargo de tratamiento",
    "datos de salud ley 21719",
    "ficha clinica 15 anos decreto 41",
    "seguridad software medico",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: TITULO,
    description: DESCRIPCION,
    locale: "es_CL",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
  },
};

// Sólo entran al JSON-LD las preguntas con respuesta confirmada. Las que hoy se
// responden con un <Pendiente> quedan fuera a propósito: publicar en datos
// estructurados algo que todavía no está verificado es exactamente lo que esta
// página existe para no hacer.
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SEGURIDAD_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const pageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": URL,
  url: URL,
  name: TITULO,
  description: DESCRIPCION,
  inLanguage: "es-CL",
  isPartOf: { "@type": "WebSite", name: "Clinera.io", url: "https://www.clinera.io" },
  about: [
    { "@type": "Legislation", name: "Ley 21.719 de protección de datos personales (Chile)" },
    { "@type": "Legislation", name: "Ley 20.584 de derechos y deberes del paciente (Chile)" },
  ],
  publisher: {
    "@type": "Organization",
    name: "Clinera.io",
    url: "https://www.clinera.io",
    email: CONTACTO_PRIVACIDAD,
  },
};

// Marca <html> antes de que pinte el contenido para que el CSS pueda ocultar
// los bloques que todavía no entran en viewport. Sin JavaScript el atributo no
// se pone y la página se lee completa: un documento de cumplimiento no puede
// quedar en blanco porque falló un script.
const ANIM_SCRIPT = `document.documentElement.setAttribute('data-sg-anim','')`;

export default function SeguridadPage() {
  return (
    <>
      <NavV3 />
      <JsonLd data={[pageLd, faqLd]} />
      <script dangerouslySetInnerHTML={{ __html: ANIM_SCRIPT }} />
      <main>
        <SeguridadLanding />
      </main>
      <FooterV3 />
    </>
  );
}

// Referenciada en el pie del documento; se deja exportada para que un cambio de
// fecha en el contenido no pase silencioso por el build.
export const revisionPublicada = ULTIMA_ACTUALIZACION;
