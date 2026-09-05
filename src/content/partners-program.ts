/**
 * Fuente única del programa partner público (`/partners`).
 *
 * Números, requisitos, apoyo y FAQ viven acá. La landing, el metadata, el
 * JSON-LD y el deck `public/presentacion-partners/index.html` tienen que
 * leer o copiar desde este archivo.
 *
 * Modelo vigente (sep 2026):
 *   · Bono al cierre según modalidad del plan contratado:
 *     US$ 150 mensual · US$ 200 semestral · US$ 400 anual.
 *   · Sin pago mensual al partner (no hay comisión recurrente).
 *   · Sin descuento adicional para la clínica referida.
 *   · 15% permanente de `/agencias` — muerto, no reabrir.
 *
 * `/agencias` redirige acá. `public/reseller.html` es un programa viejo y
 * huérfano: no es esta oferta. `/presentacion-agencia` redirige al deck
 * nuevo en `/presentacion-partners`.
 */

export const PARTNERS_PATH = "/partners" as const;
export const PARTNERS_CANONICAL = `https://www.clinera.io${PARTNERS_PATH}` as const;

/** CTA comercial que ya usaba `/agencias`. No inventar un WhatsApp nuevo. */
export const PARTNERS_CTA_HREF = "/reunion-comercial" as const;
export const PARTNERS_PRESENTATION_HREF = "/presentacion-partners" as const;

/** Bono al cierre según la modalidad que contrata el referido. Sin pago mensual. */
export const PARTNERS_BONUS_MONTHLY_USD = 150;
export const PARTNERS_BONUS_SEMESTER_USD = 200;
export const PARTNERS_BONUS_ANNUAL_USD = 400;

export const PARTNERS_BONUSES = [
  {
    billing: "Mensual",
    usd: PARTNERS_BONUS_MONTHLY_USD,
    label: `US$ ${PARTNERS_BONUS_MONTHLY_USD}`,
    subtitle: "si el referido cierra en plan mensual.",
  },
  {
    billing: "Semestral",
    usd: PARTNERS_BONUS_SEMESTER_USD,
    label: `US$ ${PARTNERS_BONUS_SEMESTER_USD}`,
    subtitle: "si el referido cierra en plan semestral.",
  },
  {
    billing: "Anual",
    usd: PARTNERS_BONUS_ANNUAL_USD,
    label: `US$ ${PARTNERS_BONUS_ANNUAL_USD}`,
    subtitle: "si el referido cierra en plan anual.",
  },
] as const;

/** Texto corto para hero / meta (rango de bonos). */
export const PARTNERS_BONUS_RANGE_LABEL = `US$ ${PARTNERS_BONUS_MONTHLY_USD}–${PARTNERS_BONUS_ANNUAL_USD}`;

export const PARTNERS_META_TITLE =
  "Programa Partner — US$ 150 a US$ 400 por referido | Clinera.io";

export const PARTNERS_META_DESCRIPTION =
  "Programa partner de Clinera: perfil profesional en redes, bio «partner @clinera.io» y notebook o tablet para presentar. Bono US$ 150 (mensual), US$ 200 (semestral) o US$ 400 (anual). Apoyo del equipo comercial y acceso al CRM. Sin pago mensual ni descuento extra al referido.";

export const PARTNERS_OG_DESCRIPTION =
  "US$ 150 / US$ 200 / US$ 400 por referido según mensual, semestral o anual. Equipo comercial y CRM de tu lado. Sin comisión mensual ni descuento extra al referido.";

export const PARTNERS_HERO = {
  eyebrow: "Programa partner",
  h1Before: "Tres requisitos.",
  h1Accent: "Hasta US$ 400 por referido.",
  lead: "Presentás Clinera en clínicas. Cobras US$ 150, US$ 200 o US$ 400 según el plan que cierre tu referido. El equipo comercial te ayuda a cerrar y tenés acceso al CRM.",
  cta: "Aplicar al programa",
  ctaSecondary: "Ver presentación",
} as const;

export const PARTNERS_STATS = [
  { label: "Bono si cierra mensual", value: `US$ ${PARTNERS_BONUS_MONTHLY_USD}` },
  { label: "Bono si cierra semestral", value: `US$ ${PARTNERS_BONUS_SEMESTER_USD}` },
  { label: "Bono si cierra anual", value: `US$ ${PARTNERS_BONUS_ANNUAL_USD}` },
  { label: "Pago mensual al partner", value: "No" },
] as const;

export const PARTNERS_REQUIREMENTS = [
  {
    num: "01",
    title: "Perfil profesional",
    desc: "Perfil en redes sociales orientado al trabajo.",
  },
  {
    num: "02",
    title: "Bio de Instagram",
    desc: 'Asociarte como partner en la descripción: "partner @clinera.io".',
  },
  {
    num: "03",
    title: "Notebook o tablet",
    desc: "Para poder realizar la presentación en clínicas.",
  },
] as const;

/** Lo que gana el partner: tres bonos según modalidad. Sin descuento al referido. */
export const PARTNERS_BENEFITS = PARTNERS_BONUSES.map((b, i) => ({
  kicker: b.billing,
  title: b.label,
  subtitle: b.subtitle,
  desc:
    i === 0
      ? "Pago único al cierre. Sin comisión recurrente ni descuento extra para la clínica referida."
      : "Pago único al cierre según la modalidad contratada.",
  featured: i === 2,
}));

export const PARTNERS_SUPPORT = [
  {
    num: "01",
    title: "Equipo comercial",
    desc: "Ayuda del equipo comercial de Clinera para cerrar oportunidades.",
  },
  {
    num: "02",
    title: "Acceso al CRM",
    desc: "Seguimiento de tus referidos y avances en el CRM de Clinera.",
  },
] as const;

export const PARTNERS_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "¿Cuánto se paga por un referido?",
    a: `Depende del plan que contrate la clínica: US$ ${PARTNERS_BONUS_MONTHLY_USD} si cierra mensual, US$ ${PARTNERS_BONUS_SEMESTER_USD} si cierra semestral, US$ ${PARTNERS_BONUS_ANNUAL_USD} si cierra anual. Un pago al cierre, no una comisión mensual.`,
  },
  {
    q: "¿Hay pago mensual o comisión sobre el plan?",
    a: "No. El partner cobra el bono único según la modalidad. No hay pago mensual ni porcentaje del plan.",
  },
  {
    q: "¿El referido tiene descuento extra?",
    a: "No. En este programa no hay descuento adicional para la clínica referida.",
  },
  {
    q: "¿Qué requisitos hay?",
    a: 'Perfil en redes orientado al trabajo; en la bio de Instagram: "partner @clinera.io"; y notebook o tablet para presentar en clínicas.',
  },
  {
    q: "¿Qué apoyo da Clinera?",
    a: "Ayuda del equipo comercial para cerrar oportunidades y acceso al CRM para seguir tus referidos.",
  },
  {
    q: "¿Cómo se atribuye el referido?",
    a: "Con un código o enlace tuyo. La clínica tiene que entrar por ahí para que cuente el bono. Agenda una reunión y te activamos.",
  },
  {
    q: "¿Me regalan un sitio web si soy doctor?",
    a: "Si eres doctor y no tienes sitio, postulas en el bloque Convenio doctores de esta página: nombre, correo y motivo. No es el wizard de agendar. Te armamos una web para posicionar tu clínica y Clinera, con el dominio el primer año. No es automático: lo revisamos y te confirmamos.",
  },
];

export const PARTNERS_FINAL_CTA = {
  kicker: "Programa partner",
  h2Before: "Tres requisitos.",
  h2Accent: "El bono es tuyo.",
  lead: `${PARTNERS_BONUS_RANGE_LABEL} según el plan que cierre tu referido. Equipo comercial y CRM de tu lado. Coordinamos en una reunión.`,
  cta: "Aplicar al programa",
  ctaSecondary: "Ver presentación",
} as const;

/**
 * Convenio paralelo para doctores sin web. No es el programa Instagram
 * ni el wizard de agendar: hay que postular aquí mismo, con nombre, correo
 * y motivo. El correo llega a Ricardo.
 */
export const PARTNERS_DOCTORS_EMAIL = "[REDACTED]";
export const PARTNERS_DOCTORS_API = "/api/convenio-doctores" as const;
export const PARTNERS_DOCTORS_HREF = `${PARTNERS_PATH}#convenio-doctores` as const;

export const PARTNERS_DOCTORS_CONVENIO = {
  id: "convenio-doctores",
  eyebrow: "Convenio doctores",
  h2Before: "Si eres doctor y no tienes sitio web.",
  h2Accent: "Postula.",
  lead: "Te regalamos un sitio para posicionar tu clínica y Clinera. Dominio el primer año incluido. Si eres doctor, postulas. No es automático: lo revisamos y te confirmamos.",
  cta: "Postula",
  points: [
    {
      title: "Sitio de regalo",
      desc: "Si no tienes web, te armamos una para tu clínica y para Clinera.",
    },
    {
      title: "Dominio 1 año",
      desc: "El dominio va incluido el primer año.",
    },
    {
      title: "Postula",
      desc: "No es automático. Cada postulación se revisa.",
    },
  ],
  wizard: {
    continuar: "Continuar",
    enviar: "Enviar postulación",
    volver: "Volver",
    exitoTitulo: "Postulación enviada",
    exito:
      "La revisamos y te escribimos. No es automático: no asumas que ya tienes el sitio.",
    errorEnvio: "No pudimos enviar tu postulación. Inténtalo de nuevo.",
    steps: [
      {
        key: "nombre",
        label: "Tu nombre",
        placeholder: "María Soto",
        hint: "Como quieres que te escribamos.",
      },
      {
        key: "correo",
        label: "Tu correo",
        placeholder: "maria@clinica.cl",
        hint: "Ahí te confirmamos si queda.",
      },
      {
        key: "motivo",
        label: "Motivo",
        placeholder: "Soy dermatóloga en Temuco y no tengo web…",
        hint: "Especialidad, ciudad y por qué postulas.",
      },
    ],
  },
} as const;
