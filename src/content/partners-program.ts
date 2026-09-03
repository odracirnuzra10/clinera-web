/**
 * Fuente única del programa partner público (`/partners`).
 *
 * Números, requisitos de contenido y FAQ viven acá. La landing, el
 * metadata, el JSON-LD y el deck `public/presentacion-partners/index.html`
 * tienen que leer o copiar desde este archivo.
 *
 * Tres números distintos que no hay que mezclar:
 *   · US$ 150 — bono del partner al cierre (no es comisión sobre el plan).
 *   · 10% × 3 meses — descuento de la clínica referida; lo aplica el closer.
 *   · 15% permanente — modelo viejo de `/agencias`. Muerto, no reabrir.
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

/** Bono único por cliente referido que cierra. No hay comisión sobre el plan. */
export const PARTNERS_REFERRAL_FEE_USD = 150;

export const PARTNERS_REFERRAL_FEE_LABEL = `US$ ${PARTNERS_REFERRAL_FEE_USD}`;

/**
 * Descuento de la clínica referida, no del partner.
 * Cada partner tiene un código; lo aplica el closer de Clinera al cierre.
 */
export const PARTNERS_CLIENT_DISCOUNT_PERCENT = 10;
export const PARTNERS_CLIENT_DISCOUNT_MONTHS = 3;
export const PARTNERS_CLIENT_DISCOUNT_LABEL = `${PARTNERS_CLIENT_DISCOUNT_PERCENT}%`;

export const PARTNERS_META_TITLE =
  "Programa Partner — US$ 150 por referido | Clinera.io";

export const PARTNERS_META_DESCRIPTION =
  "Programa partner de Clinera: 4 historias al mes con mención, 1 reel mensual en colaboración y partner de clinera.io en la bio. Tú cobras US$ 150 por referido. Tu referido recibe 10% de descuento por 3 meses.";

export const PARTNERS_OG_DESCRIPTION =
  "US$ 150 por cada referido que cierra. Tu referido recibe 10% de descuento por 3 meses. Lo aplica el closer de Clinera.";

export const PARTNERS_HERO = {
  eyebrow: "Programa partner",
  h1Before: "Tres requisitos.",
  h1Accent: "US$ 150 por referido.",
  lead: "Publicas Clinera en tu Instagram. Tú cobras US$ 150 al cierre. Tu referido recibe 10% de descuento por 3 meses.",
  cta: "Aplicar al programa",
  ctaSecondary: "Ver presentación",
} as const;

export const PARTNERS_STATS = [
  { label: "Historias al mes, con mención", value: "4" },
  { label: "Reel mensual en colaboración", value: "1" },
  { label: "Bono por referido que cierra", value: PARTNERS_REFERRAL_FEE_LABEL },
  {
    label: "Descuento de tu referido, 3 meses",
    value: PARTNERS_CLIENT_DISCOUNT_LABEL,
  },
] as const;

export const PARTNERS_REQUIREMENTS = [
  {
    num: "01",
    title: "4 historias al mes",
    desc: "Historias de Instagram con mención a Clinera.",
  },
  {
    num: "02",
    title: "1 reel al mes",
    desc: "Un reel mensual en colaboración con Clinera.",
  },
  {
    num: "03",
    title: "Bio de Instagram",
    desc: "En la descripción del perfil: partner de clinera.io.",
  },
] as const;

export const PARTNERS_BENEFITS = [
  {
    kicker: "Tú",
    title: PARTNERS_REFERRAL_FEE_LABEL,
    subtitle: "por cada clínica referida que cierre.",
    desc: "Un pago al cierre. Sin comisión sobre el plan.",
    featured: true,
  },
  {
    kicker: "Tu referido",
    title: PARTNERS_CLIENT_DISCOUNT_LABEL,
    subtitle: `de descuento durante ${PARTNERS_CLIENT_DISCOUNT_MONTHS} meses.`,
    desc: "Cada partner tiene un código. Lo aplica el closer de Clinera cuando la clínica entra referida por ti.",
    featured: false,
  },
] as const;

export const PARTNERS_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "¿Cuánto se paga por un referido?",
    a: `${PARTNERS_REFERRAL_FEE_LABEL} cuando la clínica cierra. Un pago, no una comisión mensual.`,
  },
  {
    q: "¿Qué descuento tiene mi referido?",
    a: `${PARTNERS_CLIENT_DISCOUNT_LABEL} durante ${PARTNERS_CLIENT_DISCOUNT_MONTHS} meses. Lo aplica el closer de Clinera al cierre, con el código de descuento de ese partner. No es un descuento permanente.`,
  },
  {
    q: "¿Qué hay que publicar?",
    a: "Cuatro historias al mes con mención a Clinera, un reel mensual en colaboración, y en la bio de Instagram: partner de clinera.io.",
  },
  {
    q: "¿Hay comisión sobre el plan?",
    a: "No. El partner cobra el bono de US$ 150. No lleva un porcentaje del plan.",
  },
  {
    q: "¿Cómo se atribuye el referido?",
    a: "Con un código o enlace tuyo. La clínica tiene que entrar por ahí para que cuenten el bono y el descuento. Agenda una reunión y te activamos.",
  },
  {
    q: "¿Me regalan un sitio web si soy doctor?",
    a: "Si eres doctor y no tienes sitio, postulas al convenio: te armamos una web para posicionar tu clínica y Clinera, con el dominio el primer año incluido. No es automático. Lo revisamos y te confirmamos.",
  },
];

export const PARTNERS_FINAL_CTA = {
  kicker: "Programa partner",
  h2Before: "Tres requisitos.",
  h2Accent: "El bono es tuyo.",
  lead: `${PARTNERS_REFERRAL_FEE_LABEL} para ti. ${PARTNERS_CLIENT_DISCOUNT_LABEL} por ${PARTNERS_CLIENT_DISCOUNT_MONTHS} meses para tu referido. Coordinamos en una reunión.`,
  cta: "Aplicar al programa",
  ctaSecondary: "Ver presentación",
} as const;

/**
 * Convenio paralelo para doctores sin web. No es el programa Instagram
 * (historias/reel/bio) ni un abrazo automático: hay que postular.
 */
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
} as const;
