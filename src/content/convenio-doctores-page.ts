/**
 * Copy de `/convenio-doctores`. Corto: beneficios, Clinera O.S., postula.
 * Los tres puntos y el wizard viven también en `PARTNERS_DOCTORS_CONVENIO`.
 *
 * El programa partner es solo el bono. Acá se suma Clinera 3 meses y
 * 30% de descuento sobre precio de lista.
 */
import {
  CONVENIO_DOCTORES_PATH,
  CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT,
  CONVENIO_DOCTORES_SOFTWARE_MESES,
  PARTNERS_BONUS_ANNUAL_USD,
  PARTNERS_BONUS_MONTHLY_USD,
  PARTNERS_BONUS_SEMESTER_USD,
  PARTNERS_DOCTORS_CONVENIO,
  PARTNERS_PATH,
} from "@/content/partners-program";

export const CONVENIO_DOCTORES_META_TITLE = "Convenio doctores";
export const CONVENIO_DOCTORES_META_DESCRIPTION =
  `Si eres doctor: Clinera ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses gratis, ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% de descuento sobre precio de lista y US$ ${PARTNERS_BONUS_MONTHLY_USD} / ${PARTNERS_BONUS_SEMESTER_USD} / ${PARTNERS_BONUS_ANNUAL_USD} por referido. El programa partner es solo el bono.`;
export const CONVENIO_DOCTORES_OG_DESCRIPTION =
  `Clinera ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses, ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% sobre lista y los mismos bonos de referido. Se postula; no es automático.`;

export const CONVENIO_DOCTORES_PAGE = {
  hero: {
    eyebrow: "Convenio doctores",
    h1Before: "Clinera por 3 meses.",
    h1Accent: "Si eres doctor, postula.",
    lead: `Usas Clinera ${CONVENIO_DOCTORES_SOFTWARE_MESES} meses gratis. Después, ${CONVENIO_DOCTORES_PLAN_DESCUENTO_PCT}% de descuento sobre precio de lista. Por cada referido, los mismos bonos del partner: US$ ${PARTNERS_BONUS_MONTHLY_USD} mensual, US$ ${PARTNERS_BONUS_SEMESTER_USD} semestral o US$ ${PARTNERS_BONUS_ANNUAL_USD} anual.`,
    vsPartner: PARTNERS_DOCTORS_CONVENIO.vsPartner,
    cta: "Postula",
    ctaSecondary: "Programa partner",
    ctaSecondaryHref: PARTNERS_PATH,
  },
  beneficios: {
    eyebrow: "Beneficios",
    h2Before: "Tres cosas.",
    h2Accent: "Ese es el trato.",
    items: PARTNERS_DOCTORS_CONVENIO.points,
  },
  postula: {
    eyebrow: "Postula",
    h2Before: "Nombre, correo y motivo.",
    h2Accent: "Tres pasos.",
    lead: "La revisamos y te escribimos. No es automático: no asumas que ya está activo.",
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
