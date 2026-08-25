/**
 * Fuente única del programa partner público (`/partners`).
 *
 * Números, copy y FAQ viven acá. La landing, el metadata, el JSON-LD y el
 * deck `public/presentacion-partners/index.html` tienen que leer o copiar
 * desde este archivo — no reinventar el bono a mano (eso fue el bug del
 * 15% de descuento y, después, del 10% de comisión).
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
  "Programa Partner — US$ 150 por cada cliente referido | Clinera.io";

export const PARTNERS_META_DESCRIPTION =
  "Programa partner de Clinera: US$ 150 de bono por cada cliente referido que cierra. El equipo de ventas cierra. Tú recibes el bono. Cada partner tiene su landing.";

export const PARTNERS_OG_DESCRIPTION =
  "US$ 150 de bono por cada cliente referido que cierra. Ventas de Clinera cierra. Tú recibes el bono.";

export const PARTNERS_HERO = {
  eyebrow: "Programa partner",
  h1Before: "Refiere clínicas.",
  h1Accent: "Ganas desde el primer cierre.",
  lead: `US$ ${PARTNERS_REFERRAL_FEE_USD} de bono por cada cliente referido que cierra. El equipo de ventas de Clinera cierra. Tú recibes el bono.`,
  cta: "Aplicar al programa",
  ctaSecondary: "Ver presentación",
} as const;

export const PARTNERS_STATS = [
  {
    label: "Bono por cierre",
    value: PARTNERS_REFERRAL_FEE_LABEL,
  },
  {
    label: "Comisión del plan",
    value: "No",
  },
  {
    label: "Cuándo se paga",
    value: "Al cierre",
  },
  {
    label: "Quién cierra",
    value: "Ventas Clinera",
  },
] as const;

export const PARTNERS_FUNCTIONS = [
  {
    num: "01",
    title: "Subir historias",
    desc: "Muestra Clinera en tus redes. Una historia bien puesta abre la conversación con clínicas que ya te siguen.",
  },
  {
    num: "02",
    title: "Crear contenido",
    desc: "Idealmente: posts, reels o notas que expliquen cómo opera un empleado digital en una clínica. No hace falta ser media company.",
  },
  {
    num: "03",
    title: "Referir clientes",
    desc: "Presentas la clínica. Nosotros tomamos el lead, calificamos y cerramos. El bono es tuyo aunque el cierre lo haga Clinera.",
  },
  {
    num: "04",
    title: "Eventos y webinars",
    desc: "Armas un evento o un webinar para vender la solución. El equipo de Clinera se sienta a cerrar con quien llegue de ahí.",
  },
] as const;

export const PARTNERS_COMPENSATION = {
  eyebrow: "Lo que ganas tú",
  h2: "Un bono de US$ 150 por cada cliente que cierra.",
  lead: "Un solo número. Sin comisión recurrente sobre el plan.",
  items: [
    {
      num: "01",
      title: PARTNERS_REFERRAL_FEE_LABEL,
      unit: " de bono",
      desc: "Pago único por cada cliente referido que cierra. Se paga al cierre. No hay comisión recurrente sobre el plan.",
      featured: true,
    },
  ],
} as const;

export const PARTNERS_SUPPORT = {
  eyebrow: "Cómo operamos juntos",
  h2: "Tú abres la puerta. Clinera cierra. El bono es tuyo.",
  lead: "No te pedimos que armes un equipo comercial propio ni que pelees el contrato.",
  points: [
    {
      title: "Ventas de Clinera cierra",
      desc: "Cuentas con el equipo de ventas de Clinera para calificar y cerrar cada referido. El bono de US$ 150 se paga igual aunque el cierre lo hagamos nosotros.",
    },
    {
      title: "Landing propia dentro de Clinera",
      desc: "Cada partner tiene su landing en clinera.io, con su nombre y su atribución. El lead llega marcado: no se pierde en el genérico.",
    },
  ],
} as const;

export const PARTNERS_PRODUCT = {
  eyebrow: "Lo que refieres",
  h2: "Un empleado digital que opera la clínica, no un chatbot.",
  lead: "AURA atiende por WhatsApp, CAMILA llama y LIA orquesta. Clinera corre sobre su propia agenda, fichas clínicas y pagos. La migración del software anterior se hace en el onboarding.",
  items: [
    {
      num: "01",
      title: "Agenda, cobra y confirma",
      desc: "El empleado digital agenda, reagenda y cancela sobre la agenda de Clinera. No es un bot que manda links a un calendario de terceros.",
    },
    {
      num: "02",
      title: "WhatsApp 24/7",
      desc: "AURA responde, cotiza y mueve la cita por WhatsApp a cualquier hora. La clínica deja de perder leads fuera de horario.",
    },
    {
      num: "03",
      title: "Onboarding con el equipo",
      desc: "Configuración asistida. Si hay que migrar fichas y pacientes desde el software actual, lo hace Clinera en el onboarding.",
    },
    {
      num: "04",
      title: "Webhooks y API",
      desc: "En Atlas y Summit hay webhooks y API pública hacia n8n, Make y Zapier. Eso no es integración con agendas de terceros: es para el stack de marketing y CRM del partner.",
    },
  ],
} as const;

export const PARTNERS_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "¿Cuánto gano por cada cliente referido?",
    a: `US$ ${PARTNERS_REFERRAL_FEE_USD} de bono cuando el cliente cierra. Un solo pago. No hay comisión sobre el plan ni un segundo número.`,
  },
  {
    q: "¿Quién cierra la venta?",
    a: "El equipo de ventas de Clinera. Tú refieres; nosotros calificamos y cerramos. El bono se paga igual: no se recorta porque el cierre lo haga Clinera.",
  },
  {
    q: "¿Hay comisión mensual sobre el plan?",
    a: "No. El programa publica un solo número: US$ 150 de bono por cierre. No hay comisión recurrente sobre el plan.",
  },
  {
    q: "¿Qué se espera de un partner?",
    a: "Subir historias, idealmente crear contenido, referir clientes, y armar eventos o webinars para vender la solución. No hay cuota mínima de clínicas para entrar.",
  },
  {
    q: "¿Tengo una landing propia?",
    a: "Sí. Cada partner tiene su landing dentro de Clinera, con su atribución. El lead que entra por ahí queda marcado a tu nombre.",
  },
  {
    q: "¿Cómo aplico al programa?",
    a: "Agenda una reunión comercial con el equipo de Clinera. Vemos tu audiencia, el tipo de clínicas que puedes referir y te activamos — incluida tu landing — en cuanto calce.",
  },
];

export const PARTNERS_FINAL_CTA = {
  kicker: "Programa partner · 2026",
  h2Before: "El primer cliente que refieras",
  h2Accent: "ya paga el bono.",
  lead: `US$ ${PARTNERS_REFERRAL_FEE_USD} al cierre. Agendamos, revisamos tu red y te activamos.`,
  cta: "Aplicar al programa",
  ctaSecondary: "Ver presentación",
} as const;
