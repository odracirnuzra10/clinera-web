/**
 * Fuente única del programa partner público (`/partners`).
 *
 * Números, requisitos de contenido y FAQ viven acá. La landing, el
 * metadata, el JSON-LD y el deck `public/presentacion-partners/index.html`
 * tienen que leer o copiar desde este archivo — no reinventar el bono a
 * mano (eso fue el bug del 15% de descuento y, después, del 10% de
 * comisión).
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

export const PARTNERS_META_TITLE =
  "Programa Partner — US$ 150 por referido | Clinera.io";

export const PARTNERS_META_DESCRIPTION =
  "Programa partner de Clinera: 4 historias al mes con mención, 1 reel mensual en colaboración y partner de clinera.io en la bio. Beneficio: US$ 150 por cada referido que cierra.";

export const PARTNERS_OG_DESCRIPTION =
  "4 historias al mes, 1 reel en colaboración, bio de Instagram como partner de clinera.io. US$ 150 por cada referido que cierra.";

export const PARTNERS_HERO = {
  eyebrow: "Programa partner",
  h1Before: "Tres requisitos.",
  h1Accent: "US$ 150 por referido.",
  lead: "Publicas Clinera en tu Instagram. Por cada clínica que cierre, cobras el bono. Sin comisión sobre el plan.",
  cta: "Aplicar al programa",
  ctaSecondary: "Ver presentación",
} as const;

export const PARTNERS_STATS = [
  { label: "Historias al mes, con mención", value: "4" },
  { label: "Reel mensual en colaboración", value: "1" },
  { label: "Bono por referido que cierra", value: PARTNERS_REFERRAL_FEE_LABEL },
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

export const PARTNERS_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "¿Cuánto se paga por un referido?",
    a: `${PARTNERS_REFERRAL_FEE_LABEL} cuando la clínica cierra. Un pago, no una comisión mensual.`,
  },
  {
    q: "¿Qué hay que publicar?",
    a: "Cuatro historias al mes con mención a Clinera, un reel mensual en colaboración, y en la bio de Instagram: partner de clinera.io.",
  },
  {
    q: "¿Hay comisión sobre el plan o descuento al cliente?",
    a: "No. El programa es el bono por referido. El cliente paga el plan de Clinera; tú no llevas un porcentaje ni un descuento para entregar.",
  },
  {
    q: "¿Cómo se atribuye el referido?",
    a: "Con un código o enlace tuyo. La clínica tiene que entrar por ahí para que el cierre cuente. Agenda una reunión y te activamos.",
  },
];

export const PARTNERS_FINAL_CTA = {
  kicker: "Programa partner",
  h2Before: "Tres requisitos.",
  h2Accent: "El bono es tuyo.",
  lead: `${PARTNERS_REFERRAL_FEE_LABEL} por cada clínica referida que cierre. Coordinamos en una reunión.`,
  cta: "Aplicar al programa",
  ctaSecondary: "Ver presentación",
} as const;
