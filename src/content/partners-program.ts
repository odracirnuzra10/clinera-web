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

/**
 * CTA «Aplicar al programa»: ancla al formulario en esta misma página.
 * Ya no manda a `/reunion-comercial` — el lead deja nombre + celular acá.
 */
export const PARTNERS_CTA_HREF = "/partners#aplicar" as const;
export const PARTNERS_PRESENTATION_HREF = "/presentacion-partners" as const;
export const PARTNERS_APPLY_HREF = `${PARTNERS_PATH}#aplicar` as const;
export const PARTNERS_APPLY_API = "/api/partner-apply" as const;

/**
 * Destino del formulario «Aplicar al programa». Mismo buzón que el convenio
 * doctores (Ricardo).
 */
const _partnersApplyUser = ["ric", "ardo"].join("");
const _partnersApplyHost = ["oa", "cg", ".", "cl"].join("");
export const PARTNERS_APPLY_EMAIL = `${_partnersApplyUser}@${_partnersApplyHost}`; // pragma: allowlist secret

export const PARTNERS_APPLY = {
  id: "aplicar",
  eyebrow: "Aplicar",
  h2Before: "Dejá tu celular.",
  h2Accent: "Te contactamos.",
  lead: "Nombre y WhatsApp. El equipo te escribe para activarte como partner.",
  submit: "Enviar solicitud",
  sending: "Enviando…",
  successTitle: "Solicitud enviada",
  success:
    "Ricardo o el equipo comercial te escriben por WhatsApp. Revisá que el número esté bien.",
  errorSend: "No pudimos enviar tu solicitud. Inténtalo de nuevo.",
  fields: {
    nombre: {
      label: "Tu nombre",
      placeholder: "María Soto",
      hint: "Como querés que te llamemos.",
    },
    celular: {
      label: "Celular / WhatsApp",
      hint: "Con código de país. Ahí te contactamos.",
    },
  },
} as const;

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
  lead: "Presentás Clinera en clínicas. Cobras US$ 150, US$ 200 o US$ 400 según el plan que cierre tu referido. El equipo comercial te ayuda a cerrar y tenés acceso al CRM. Este programa es el bono al cierre: no incluye Clinera de regalo ni 30% sobre lista.",
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
    q: "¿Hay un convenio si soy doctor?",
    a: "Sí. El programa partner es solo el bono (US$ 150 / 200 / 400). El convenio suma sitio web remodelado, Clinera Vortex 3 meses, los mismos bonos y 30% de descuento después de esos 3 meses. La postulación es previa; /convenio-doctores es el trato una vez calificado.",
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
 * Convenio para doctores ya calificados. La postulación es previa
 * (`/partners#convenio-doctores`). `/convenio-doctores` es el trato:
 * sitio remodelado, Vortex 3 meses, bonos y 30% después; a cambio usar
 * Clinera, recomendarla y poner «Partner de @clinera.io» en el perfil.
 */
export const CONVENIO_DOCTORES_SOFTWARE_MESES = 3;
export const CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT = 30;
export const CONVENIO_DOCTORES_PLAN_NAME = "Vortex" as const;
export const CONVENIO_DOCTORES_BIO_LINE = "Partner de @clinera.io" as const;
export const PARTNERS_DOCTORS_EMAIL = PARTNERS_APPLY_EMAIL;
export const PARTNERS_DOCTORS_API = "/api/convenio-doctores" as const;
export const PARTNERS_DOCTORS_HREF = `${PARTNERS_PATH}#convenio-doctores` as const;
export const CONVENIO_DOCTORES_PATH = "/convenio-doctores" as const;
export const CONVENIO_DOCTORES_CANONICAL =
  `https://www.clinera.io${CONVENIO_DOCTORES_PATH}` as const;
export const CONVENIO_DOCTORES_POSTULA_ID = "postula" as const;
export const CONVENIO_DOCTORES_POSTULA_HREF =
  `${CONVENIO_DOCTORES_PATH}#${CONVENIO_DOCTORES_POSTULA_ID}` as const;
export const CONVENIO_DOCTORES_REQUISITOS_ID = "requisitos" as const;
export const CONVENIO_DOCTORES_REQUISITOS_HREF =
  `${CONVENIO_DOCTORES_PATH}#${CONVENIO_DOCTORES_REQUISITOS_ID}` as const;

/** Contraste en `/partners`: este programa es solo el bono. */
export const PARTNERS_VS_DOCTORES = {
  before: "Este programa es el bono al cierre. Si eres doctor y quieres sitio, Vortex 3 meses y 30%,",
  link: "es el convenio doctores",
  href: CONVENIO_DOCTORES_PATH,
} as const;

export const CONVENIO_DOCTORES_BENEFICIOS = [
  {
    title: "Sitio web remodelado",
    desc: "Lo arma nuestro equipo.",
  },
  {
    title: `Clinera ${CONVENIO_DOCTORES_PLAN_NAME} 3 meses`,
    desc: `Usas el plan ${CONVENIO_DOCTORES_PLAN_NAME} gratis los primeros ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses.`,
  },
  {
    title: "Bonos por referido",
    desc: `Los mismos del partner: US$ ${PARTNERS_BONUS_MONTHLY_USD} mensual, US$ ${PARTNERS_BONUS_SEMESTER_USD} semestral o US$ ${PARTNERS_BONUS_ANNUAL_USD} anual.`,
  },
  {
    title: "30% después de 3 meses",
    desc: `Cuando termina el periodo gratis, ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% de descuento sobre el precio de lista.`,
  },
] as const;

export const CONVENIO_DOCTORES_REQUISITOS = [
  {
    title: "Usar Clinera",
    desc: "Utilizar activamente la herramienta.",
  },
  {
    title: "Recomendarla",
    desc: "Presentar Clinera a otras clínicas.",
  },
  {
    title: "Perfil partner",
    desc: `Asociar el perfil empresarial como ${CONVENIO_DOCTORES_BIO_LINE}.`,
  },
] as const;

export const PARTNERS_DOCTORS_CONVENIO = {
  id: "convenio-doctores",
  eyebrow: "Convenio doctores",
  h2Before: "Si eres doctor.",
  h2Accent: "Postula.",
  lead: `Sitio remodelado, Clinera ${CONVENIO_DOCTORES_PLAN_NAME} ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses, bonos por referido y ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% después. El programa partner es solo el bono. Si eres doctor, postulas acá. No es automático: lo revisamos y te confirmamos.`,
  vsPartner:
    "El programa partner es solo el bono. El convenio suma sitio, Vortex 3 meses y el 30%.",
  cta: "Postula",
  detalleCta: "Cómo funciona el convenio",
  detalleHref: CONVENIO_DOCTORES_PATH,
  points: CONVENIO_DOCTORES_BENEFICIOS,
  wizard: {
    continuar: "Continuar",
    enviar: "Enviar postulación",
    volver: "Volver",
    exitoTitulo: "Postulación enviada",
    exito:
      "La revisamos y te escribimos. No es automático: no asumas que ya está activo.",
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
        placeholder: "Soy dermatóloga en Temuco y quiero el convenio…",
        hint: "Especialidad, ciudad y por qué postulas.",
      },
    ],
  },
} as const;
