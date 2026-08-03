// Fuente única del costo de configuración inicial (pago único).
// Lo consumen <SetupFeeBand />, las tarjetas de planes de home-v3/planes/planes-pro,
// PlatformPricing (/plataforma) y las calculadoras de consumo.
export const SETUP_FEE_USD = 450;

/** Monto formateado en es-CL, sin símbolo ni moneda: "450". */
export const SETUP_FEE_NUMBER = "450";

/** Monto con símbolo, para el precio de la banda: "$450". */
export const SETUP_FEE_AMOUNT = `$${SETUP_FEE_NUMBER}`;

/** Línea corta para poner debajo del precio de cada plan. */
export const SETUP_FEE_INLINE = `+ USD ${SETUP_FEE_NUMBER} configuración inicial (pago único)`;

export const SETUP_FEE_TITLE = "Costo de configuración: una sola vez";

export const SETUP_FEE_COPY =
  "Migramos fichas clínicas, datos históricos, pacientes y tratamientos, y configuramos tus agentes de IA. Se paga al inicio y no se repite.";

export const SEMESTER_MONTHS = 6;
export const SEMESTER_DISCOUNT_PERCENT = 20;

export const EXTRA_CREDIT_PACK_USD = 15;
export const EXTRA_CREDIT_PACK_CREDITS = 5_000;
export const EXTRA_USER_USD = 9;

/**
 * Catálogo comercial compartido por /planes y /cotizacion.
 *
 * Los precios semestrales son el total de seis meses con el descuento de
 * catálogo aplicado. Los add-ons no heredan ese descuento automáticamente.
 */
export const CLINERA_PLANS = [
  {
    id: "vortex",
    name: "Vortex",
    monthlyPrice: 279,
    semesterTotal: 1_339.2,
    semesterMonthly: 223.2,
    credits: 28_000,
    users: 10,
    branches: "1 sucursal",
    channel: "Texto",
    consumptionReference: "~933 conversaciones o ~143 agendamientos automáticos",
    description:
      "Para clínicas con equipo de recepción y varios profesionales que empiezan a ordenar su operación.",
    headline: "Incluye",
    featured: false,
    agents: [{ id: "aura", name: "AURA" }],
    stripe: "https://buy.stripe.com/4gM7sN7cZ4Yq9wT5RV1441u",
    stripeSemester: "https://buy.stripe.com/dRmfZj0OBduW5gDcgj1441x",
  },
  {
    id: "atlas",
    name: "Atlas",
    monthlyPrice: 379,
    semesterTotal: 1_819.2,
    semesterMonthly: 303.2,
    credits: 37_000,
    users: 15,
    branches: "2 sucursales",
    channel: "Texto + voz",
    consumptionReference:
      "~1.233 conversaciones o ~190 agendamientos · ~320 min de voz (pronto)",
    description:
      "Para clínicas con alto volumen o 2+ sedes que necesitan estandarizar la atención.",
    headline: "Todo de Vortex, más",
    featured: false,
    agents: [
      { id: "aura", name: "AURA" },
      { id: "camila", name: "CAMILA" },
    ],
    stripe: "https://buy.stripe.com/5kQ7sN40Nez08sP9471441v",
    stripeSemester: "https://buy.stripe.com/3cIfZj7cZfD410ncgj1441y",
  },
  {
    id: "summit",
    name: "Summit",
    monthlyPrice: 479,
    semesterTotal: 2_299.2,
    semesterMonthly: 383.2,
    credits: 46_000,
    users: 25,
    branches: "Sucursales ilimitadas",
    channel: "Texto + voz + API",
    consumptionReference:
      "~1.533 conversaciones o ~236 agendamientos · ~440 min de voz (pronto)",
    description:
      "Para grupos clínicos y clínicas de alto volumen —una o varias sedes— que necesitan control central de toda la operación.",
    headline: "Todo de Atlas, más",
    featured: true,
    agents: [
      { id: "aura", name: "AURA" },
      { id: "camila", name: "CAMILA" },
      { id: "lia", name: "LIA" },
    ],
    stripe: "https://buy.stripe.com/5kQ6oJbtf3UmdN94NR1441w",
    stripeSemester: "https://buy.stripe.com/aFa8wR9l79eG10nbcf1441z",
  },
] as const;

export type ClineraPlan = (typeof CLINERA_PLANS)[number];
