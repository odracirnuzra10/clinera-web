/**
 * Copy de `/convenio-doctores`. El doctor ya está calificado: beneficios,
 * requisitos (con ejemplo de bio) y Clinera O.S. La postulación vive en
 * `/partners#convenio-doctores`.
 */
import {
  CONVENIO_DOCTORES_BENEFICIOS,
  CONVENIO_DOCTORES_BIO_LINE,
  CONVENIO_DOCTORES_PATH,
  CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT,
  CONVENIO_DOCTORES_PLAN_NAME,
  CONVENIO_DOCTORES_REQUISITOS,
  CONVENIO_DOCTORES_REQUISITOS_ID,
  CONVENIO_DOCTORES_SOFTWARE_MESES,
  PARTNERS_BONUS_ANNUAL_USD,
  PARTNERS_BONUS_MONTHLY_USD,
  PARTNERS_BONUS_SEMESTER_USD,
  PARTNERS_PATH,
} from "@/content/partners-program";

export const CONVENIO_DOCTORES_META_TITLE = "Convenio doctores";
export const CONVENIO_DOCTORES_META_DESCRIPTION =
  `Doctor calificado: sitio remodelado, Clinera ${CONVENIO_DOCTORES_PLAN_NAME} ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses, bonos US$ ${PARTNERS_BONUS_MONTHLY_USD} / ${PARTNERS_BONUS_SEMESTER_USD} / ${PARTNERS_BONUS_ANNUAL_USD} y ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% después. Requisitos: usar Clinera, recomendarla y ${CONVENIO_DOCTORES_BIO_LINE} en el perfil.`;
export const CONVENIO_DOCTORES_OG_DESCRIPTION =
  `Sitio remodelado, Clinera ${CONVENIO_DOCTORES_PLAN_NAME} ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses, bonos por referido y ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% después. Usar, recomendar y asociar el perfil.`;

export const CONVENIO_DOCTORES_BIO_EXAMPLE = {
  src: "/convenio-doctores/km-estetica-partner-bio.png",
  width: 1758,
  height: 932,
  alt: `Bio de Instagram de KM Estética con «${CONVENIO_DOCTORES_BIO_LINE}».`,
  caption: `Así se asocia el perfil. Ejemplo: KM Estética, «${CONVENIO_DOCTORES_BIO_LINE}».`,
} as const;

export const CONVENIO_DOCTORES_PAGE = {
  hero: {
    eyebrow: "Convenio doctores",
    h1Before: "Ya estás calificado.",
    h1Accent: "Este es el trato.",
    lead: `Sitio web remodelado por nuestro equipo, Clinera ${CONVENIO_DOCTORES_PLAN_NAME} ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses, los mismos bonos por referido y ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% de descuento después de esos ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses.`,
    vsPartner:
      "El programa partner es solo el bono. Acá se suma el sitio, Vortex y el 30%.",
    cta: "Ver requisitos",
    ctaHref: `#${CONVENIO_DOCTORES_REQUISITOS_ID}`,
    ctaSecondary: "Programa partner",
    ctaSecondaryHref: PARTNERS_PATH,
  },
  beneficios: {
    eyebrow: "Beneficios",
    h2Before: "Cuatro cosas.",
    h2Accent: "Eso recibes.",
    items: CONVENIO_DOCTORES_BENEFICIOS,
  },
  requisitos: {
    id: CONVENIO_DOCTORES_REQUISITOS_ID,
    eyebrow: "Requisitos",
    h2Before: "Tres cosas.",
    h2Accent: "Eso pedimos.",
    lead: "Usar Clinera, recomendarla y asociar el perfil empresarial.",
    items: CONVENIO_DOCTORES_REQUISITOS,
    bioExample: CONVENIO_DOCTORES_BIO_EXAMPLE,
  },
  partnersNote: {
    before: "Si solo quieres el bono al cierre, sin Clinera:",
    link: "programa partner",
    href: PARTNERS_PATH,
  },
} as const;

export const CONVENIO_DOCTORES_BREADCRUMB = [
  { name: "Inicio", url: "https://www.clinera.io/" },
  { name: "Partners", url: "https://www.clinera.io/partners" },
  { name: "Convenio doctores", url: `https://www.clinera.io${CONVENIO_DOCTORES_PATH}` },
] as const;
