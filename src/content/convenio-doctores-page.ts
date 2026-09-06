/**
 * Copy de `/convenio-doctores`. Los tres puntos cortos y el wizard siguen
 * en `PARTNERS_DOCTORS_CONVENIO` (el bloque de `/partners` los consume).
 * Acá va el detalle: para quién, qué incluye, cómo se postula y qué no es.
 *
 * No inventar plazos, precios ni que el sitio incluye Clinera O.S.
 */
import {
  CONVENIO_DOCTORES_PATH,
  PARTNERS_PATH,
} from "@/content/partners-program";

export const CONVENIO_DOCTORES_META_TITLE = "Convenio doctores";
export const CONVENIO_DOCTORES_META_DESCRIPTION =
  "Si eres doctor y no tienes sitio web, postula al convenio Clinera: te armamos una web para tu clínica y Clinera, con el dominio el primer año. No es automático.";
export const CONVENIO_DOCTORES_OG_DESCRIPTION =
  "Sitio de regalo para doctores sin web. Dominio el primer año. Se postula; no es automático.";

export const CONVENIO_DOCTORES_PAGE = {
  hero: {
    eyebrow: "Convenio doctores",
    h1Before: "Un sitio para tu clínica.",
    h1Accent: "Si no tienes web, postula.",
    lead: "Clinera te arma una web para posicionar tu consulta y Clinera. El dominio va el primer año. No es el programa partner ni un alta automática: cada postulación se revisa.",
    cta: "Postula",
    ctaSecondary: "Programa partner",
    ctaSecondaryHref: PARTNERS_PATH,
  },
  queEs: {
    eyebrow: "Qué es",
    h2Before: "Un convenio de sitio.",
    h2Accent: "No un software de regalo.",
    lead: "Si operas como doctor y no tienes página, Clinera puede armarte una. El sitio existe para que te encuentren — y para que Clinera también aparezca. Por eso el dominio del primer año va incluido: sin web no hay nada que posicionar.",
  },
  paraQuien: {
    eyebrow: "Para quién",
    h2Before: "Doctor sin sitio.",
    h2Accent: "Esa es la puerta.",
    items: [
      {
        title: "Sí, si no tienes web",
        desc: "Consultorio, clínica o consulta independiente. El convenio parte de que hoy no tienes un sitio propio.",
      },
      {
        title: "No, si ya tienes sitio",
        desc: "Este convenio no rediseña una web que ya existe. Si quieres referir clínicas a Clinera, eso es el programa partner.",
      },
      {
        title: "No es el programa de Instagram",
        desc: "Ahí el bono es al cierre de un referido. Acá no hay bono US$ 150 / 200 / 400: hay un sitio, si la postulación queda.",
      },
    ],
  },
  incluye: {
    eyebrow: "Qué incluye",
    h2Before: "Sitio y dominio.",
    h2Accent: "El primer año.",
    items: [
      {
        title: "Sitio de tu clínica",
        desc: "Te armamos una web para tu consulta, no una ficha genérica. También posiciona Clinera: es parte del trato.",
      },
      {
        title: "Dominio el primer año",
        desc: "El dominio va incluido el primer año. Sin eso el sitio no publica.",
      },
      {
        title: "Revisión humana",
        desc: "Cada postulación la miramos. Si no aplica, te lo decimos. No asumas el sitio al enviar el formulario.",
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
        desc: "Nombre, correo y motivo: especialidad, ciudad y por qué no tienes sitio. No es el wizard de agendar una demo.",
      },
      {
        n: "02",
        title: "Lo revisamos",
        desc: "Confirmamos que eres doctor y que no tienes web. Si falta algo, te escribimos al correo que dejaste.",
      },
      {
        n: "03",
        title: "Te confirmamos",
        desc: "Solo entonces existe el sitio. Hasta ese mail, la postulación está en revisión.",
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
        desc: "Enviar el formulario no crea el sitio. Si no te confirmamos, no hay convenio.",
      },
      {
        title: "No es el programa partner",
        desc: "Partners es para quien refiere clínicas y cobra un bono al cierre. Este convenio es para el doctor sin web.",
      },
      {
        title: "No es agendar una demo",
        desc: "El calendario de /agenda y /reunion-comercial es otra puerta. Acá solo se postula el sitio.",
      },
    ],
  },
  faq: [
    {
      q: "¿Qué me dan si postulo?",
      a: "Si queda, un sitio para tu clínica —y para Clinera— con el dominio el primer año. No es Clinera O.S. de regalo ni un bono en dinero.",
    },
    {
      q: "¿Es automático?",
      a: "No. Revisamos cada postulación y te confirmamos. Hasta ese correo, no asumas que ya tienes el sitio.",
    },
    {
      q: "¿Puedo postular si ya tengo web?",
      a: "Este convenio es para quien no tiene sitio. Si quieres referir clínicas a Clinera, ve al programa partner.",
    },
    {
      q: "¿Es lo mismo que el programa partner?",
      a: "No. El partner cobra un bono al cierre (US$ 150 / 200 / 400 según modalidad) y necesita perfil en redes. El convenio doctores no paga bono: arma un sitio si la postulación queda.",
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
    lead: "La revisamos y te escribimos. No es automático: no asumas que ya tienes el sitio.",
  },
  partnersNote: {
    before: "Si lo tuyo es referir clínicas, no pedirnos un sitio:",
    link: "programa partner",
    href: PARTNERS_PATH,
  },
} as const;

export const CONVENIO_DOCTORES_BREADCRUMB = [
  { name: "Inicio", url: "https://www.clinera.io/" },
  { name: "Partners", url: "https://www.clinera.io/partners" },
  { name: "Convenio doctores", url: `https://www.clinera.io${CONVENIO_DOCTORES_PATH}` },
] as const;
