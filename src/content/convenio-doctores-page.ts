/**
 * Copy de `/convenio-doctores`. Los cinco puntos cortos y el wizard siguen
 * en `PARTNERS_DOCTORS_CONVENIO` (el bloque de `/partners` los consume).
 * Acá va el detalle: para quién, qué incluye, cómo se postula y qué no es.
 *
 * Términos (Ricardo, sep 2026): no inventar plazos extra, precios de plan
 * ni que el software queda de regalo para siempre.
 */
import {
  CONVENIO_DOCTORES_BIO,
  CONVENIO_DOCTORES_PATH,
  CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT,
  CONVENIO_DOCTORES_SOFTWARE_MESES,
  PARTNERS_PATH,
} from "@/content/partners-program";

export const CONVENIO_DOCTORES_META_TITLE = "Convenio doctores";
export const CONVENIO_DOCTORES_META_DESCRIPTION =
  `Si eres doctor, postula al convenio Clinera: software ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses de regalo, sitio web optimizado, ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% de descuento sobre el valor del plan y +${CONVENIO_DOCTORES_SOFTWARE_MESES} meses por cada cliente nuevo que pague. En redes: ${CONVENIO_DOCTORES_BIO}. No es automático.`;
export const CONVENIO_DOCTORES_OG_DESCRIPTION =
  `Doctor partner: Clinera ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses, sitio optimizado, ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% sobre el plan. Se postula; no es automático.`;

export const CONVENIO_DOCTORES_PAGE = {
  hero: {
    eyebrow: "Convenio doctores",
    h1Before: "Clinera por 3 meses.",
    h1Accent: "Si eres doctor, postula.",
    lead: `Te regalamos el software ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses y optimizamos tu sitio. Después puedes seguir con ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% de descuento sobre el valor del plan. Por cada cliente nuevo que pague, +${CONVENIO_DOCTORES_SOFTWARE_MESES} meses. En redes: ${CONVENIO_DOCTORES_BIO}. Se postula; no es automático.`,
    cta: "Postula",
    ctaSecondary: "Programa partner",
    ctaSecondaryHref: PARTNERS_PATH,
  },
  queEs: {
    eyebrow: "Qué es",
    h2Before: "Un convenio de doctor partner.",
    h2Accent: "Software, sitio y descuento.",
    lead: `No es el programa de Instagram (bono al cierre). Es un convenio para doctores: Clinera ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses, sitio optimizado, ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% de descuento después, renovación por cliente que pague, y ${CONVENIO_DOCTORES_BIO} en la descripción de tus redes.`,
  },
  paraQuien: {
    eyebrow: "Para quién",
    h2Before: "Doctor.",
    h2Accent: "Esa es la puerta.",
    items: [
      {
        title: "Sí, si eres doctor",
        desc: "Consultorio, clínica o consulta independiente. El convenio parte de que operas como doctor, no de que hoy no tengas web.",
      },
      {
        title: "En redes, como partner",
        desc: `En la descripción de tus redes sociales debe ir ${CONVENIO_DOCTORES_BIO}. Sin eso no hay convenio.`,
      },
      {
        title: "No es el programa de Instagram",
        desc: "Ahí el bono es al cierre de un referido (US$ 150 / 200 / 400). Acá no hay bono: hay software, sitio y descuento, si la postulación queda.",
      },
    ],
  },
  incluye: {
    eyebrow: "Qué incluye",
    h2Before: "Cinco puntos.",
    h2Accent: "Ese es el trato.",
    items: [
      {
        title: `Software ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses`,
        desc: `Clinera de regalo los primeros ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses.`,
      },
      {
        title: "Sitio web",
        desc: "Optimizamos el sitio de tu clínica. No es un sitio de cero salvo que haga falta: el trato es dejarlo listo.",
      },
      {
        title: `${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% sobre el plan`,
        desc: `Después de los ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses puedes seguir usando Clinera con ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% de descuento sobre el valor del plan.`,
      },
      {
        title: `+${CONVENIO_DOCTORES_SOFTWARE_MESES} meses por cliente`,
        desc: `Por cada cliente nuevo que pague una suscripción de Clinera, se renuevan ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses más de software de regalo.`,
      },
      {
        title: "Bio partner",
        desc: `En la descripción de tus redes: ${CONVENIO_DOCTORES_BIO}. Es requisito, no un extra.`,
      },
    ],
  },
  pasos: {
    eyebrow: "Cómo se postula",
    h2Before: "Tres datos.",
    h2Accent: "Después, espera.",
    items: [
      {
        n: "01",
        title: "Postulas",
        desc: "Nombre, correo y motivo: especialidad, ciudad y por qué quieres el convenio. No es el wizard de agendar una demo.",
      },
      {
        n: "02",
        title: "Lo revisamos",
        desc: "Confirmamos que eres doctor y que el convenio aplica. Si falta algo, te escribimos al correo que dejaste.",
      },
      {
        n: "03",
        title: "Te confirmamos",
        desc: "Solo entonces existe el convenio. Hasta ese mail, la postulación está en revisión.",
      },
    ],
  },
  noEs: {
    eyebrow: "Qué no es",
    h2Before: "Tres confusiones.",
    h2Accent: "Ninguna aplica.",
    items: [
      {
        title: "No es automático",
        desc: "Enviar el formulario no activa Clinera ni el descuento. Si no te confirmamos, no hay convenio.",
      },
      {
        title: "No es el programa partner",
        desc: "Partners es para quien refiere clínicas y cobra un bono al cierre. Este convenio es para el doctor que usa Clinera.",
      },
      {
        title: "No es agendar una demo",
        desc: "El calendario de /agenda y /reunion-comercial es otra puerta. Acá solo se postula el convenio.",
      },
    ],
  },
  faq: [
    {
      q: "¿Qué me dan si postulo?",
      a: `Si queda: Clinera ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses de regalo, sitio web optimizado, después ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% de descuento sobre el valor del plan, y +${CONVENIO_DOCTORES_SOFTWARE_MESES} meses por cada cliente nuevo que pague suscripción. En redes: ${CONVENIO_DOCTORES_BIO}. No es un bono en dinero.`,
    },
    {
      q: "¿Es automático?",
      a: "No. Revisamos cada postulación y te confirmamos. Hasta ese correo, no asumas que ya está activo.",
    },
    {
      q: "¿Puedo seguir después de los 3 meses?",
      a: `Sí: con ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% de descuento sobre el valor del plan. Y por cada cliente nuevo que pague una suscripción se renuevan ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses más de software de regalo.`,
    },
    {
      q: "¿Es lo mismo que el programa partner?",
      a: `No. El partner cobra un bono al cierre (US$ 150 / 200 / 400 según modalidad) y necesita perfil en redes. El convenio doctores no paga bono: da software, sitio y descuento si la postulación queda. Los dos piden ${CONVENIO_DOCTORES_BIO} en la descripción.`,
    },
    {
      q: "¿Dónde postulo?",
      a: "En esta página o en el bloque Convenio doctores de /partners. Nombre, correo y motivo. El mismo formulario en los dos lados.",
    },
  ],
  postula: {
    eyebrow: "Postula",
    h2Before: "Nombre, correo y motivo.",
    h2Accent: "Tres pasos.",
    lead: "La revisamos y te escribimos. No es automático: no asumas que ya está activo.",
  },
  partnersNote: {
    before: "Si lo tuyo es referir clínicas y cobrar un bono al cierre:",
    link: "programa partner",
    href: PARTNERS_PATH,
  },
} as const;

export const CONVENIO_DOCTORES_BREADCRUMB = [
  { name: "Inicio", url: "https://www.clinera.io/" },
  { name: "Partners", url: "https://www.clinera.io/partners" },
  { name: "Convenio doctores", url: `https://www.clinera.io${CONVENIO_DOCTORES_PATH}` },
] as const;
