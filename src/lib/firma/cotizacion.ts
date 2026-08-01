// ============================================================================
// Firma + pago — snapshot de la cotización dentro del sobre
// ----------------------------------------------------------------------------
// El botón "Enviar a firma" de /cotizacion pasa la CONFIGURACIÓN de la
// cotización (plan, modalidad, extras, descuentos), nunca montos: acá se
// recalcula todo server-side contra el catálogo de src/content/pricing, que es
// la misma fuente que usa el cotizador. Con eso el checkout de Stripe cobra
// exactamente lo cotizado sin confiar en números que vengan del navegador.
// ============================================================================

import {
  CLINERA_PLANS,
  EXTRA_CREDIT_PACK_USD,
  EXTRA_USER_USD,
  SEMESTER_MONTHS,
  SETUP_FEE_USD,
} from "@/content/pricing";

/** Cuánto dura la personalización de precio de la suscripción. */
export type DescuentoDuracion =
  | { tipo: "primer_pago" }
  | { tipo: "siempre" }
  | { tipo: "meses"; meses: number };

export type CotizacionSnapshot = {
  numero: string;
  planId: (typeof CLINERA_PLANS)[number]["id"];
  planNombre: string;
  billing: "monthly" | "semester";
  periodoMeses: 1 | 6;
  extraUsuarios: number;
  extraPacks: number;
  incluirSetup: boolean;
  descuentos: {
    plan: number;
    users: number;
    credits: number;
    setup: number;
    global: number;
  };
  duracionDescuento: DescuentoDuracion;
  moneda: "USD";
  /** Montos en centavos de USD, recalculados del catálogo. */
  centavos: {
    /** Precio de lista del plan por período. */
    planLista: number;
    /** Precio de lista por usuario extra por período. */
    usuarioLista: number;
    /** Precio de lista por pack de créditos por período. */
    packLista: number;
    setupLista: number;
    /** Total recurrente de lista por período (sin setup). */
    recurrenteLista: number;
    /** Total recurrente con descuentos por ítem + global. */
    recurrenteFinal: number;
    /** Lo que cubre el cupón de Stripe en cada período con descuento. */
    descuentoRecurrente: number;
    /** Setup con su descuento y el global aplicados (cobro único). */
    setupFinal: number;
  };
};

const clampPct = (v: unknown) =>
  Math.min(100, Math.max(0, Math.round(Number(v) || 0)));
const clampQty = (v: unknown) =>
  Math.min(999, Math.max(0, Math.round(Number(v) || 0)));
const aCentavos = (usd: number) => Math.round(usd * 100);

/**
 * Valida la configuración cruda que envía el navegador y reconstruye el
 * snapshot con montos del catálogo. Devuelve null si no es interpretable.
 */
export function construirCotizacion(cruda: unknown): CotizacionSnapshot | null {
  if (typeof cruda !== "object" || cruda === null) return null;
  const c = cruda as Record<string, unknown>;

  const plan = CLINERA_PLANS.find((p) => p.id === c.planId);
  if (!plan) return null;

  const billing = c.billing === "semester" ? "semester" : c.billing === "monthly" ? "monthly" : null;
  if (!billing) return null;
  const periodoMeses = billing === "semester" ? SEMESTER_MONTHS : 1;

  const d = (typeof c.descuentos === "object" && c.descuentos !== null
    ? c.descuentos
    : {}) as Record<string, unknown>;
  const descuentos = {
    plan: clampPct(d.plan),
    users: clampPct(d.users),
    credits: clampPct(d.credits),
    setup: clampPct(d.setup),
    global: clampPct(d.global),
  };

  const dur = (typeof c.duracionDescuento === "object" && c.duracionDescuento !== null
    ? c.duracionDescuento
    : {}) as Record<string, unknown>;
  let duracionDescuento: DescuentoDuracion;
  if (dur.tipo === "siempre") {
    duracionDescuento = { tipo: "siempre" };
  } else if (dur.tipo === "meses") {
    const meses = Math.min(60, Math.max(1, Math.round(Number(dur.meses) || 0)));
    duracionDescuento = { tipo: "meses", meses };
  } else {
    duracionDescuento = { tipo: "primer_pago" };
  }

  const extraUsuarios = clampQty(c.extraUsuarios);
  const extraPacks = clampQty(c.extraPacks);
  const incluirSetup = c.incluirSetup === true;

  // Mismo cálculo que QuoteBuilder: descuento por línea y luego el global
  // sobre todo (incluido el setup).
  const planListaUsd = billing === "semester" ? plan.semesterTotal : plan.monthlyPrice;
  const usuarioListaUsd = EXTRA_USER_USD * periodoMeses;
  const packListaUsd = EXTRA_CREDIT_PACK_USD * periodoMeses;

  const factorGlobal = 1 - descuentos.global / 100;
  const recurrenteListaUsd =
    planListaUsd + extraUsuarios * usuarioListaUsd + extraPacks * packListaUsd;
  const recurrenteFinalUsd =
    (planListaUsd * (1 - descuentos.plan / 100) +
      extraUsuarios * usuarioListaUsd * (1 - descuentos.users / 100) +
      extraPacks * packListaUsd * (1 - descuentos.credits / 100)) *
    factorGlobal;
  const setupFinalUsd = incluirSetup
    ? SETUP_FEE_USD * (1 - descuentos.setup / 100) * factorGlobal
    : 0;

  const recurrenteLista = aCentavos(recurrenteListaUsd);
  const recurrenteFinal = aCentavos(recurrenteFinalUsd);

  return {
    numero: String(c.numero ?? "").trim().slice(0, 40) || "Clinera",
    planId: plan.id,
    planNombre: plan.name,
    billing,
    periodoMeses: periodoMeses as 1 | 6,
    extraUsuarios,
    extraPacks,
    incluirSetup,
    descuentos,
    duracionDescuento,
    moneda: "USD",
    centavos: {
      planLista: aCentavos(planListaUsd),
      usuarioLista: aCentavos(usuarioListaUsd),
      packLista: aCentavos(packListaUsd),
      setupLista: incluirSetup ? aCentavos(SETUP_FEE_USD) : 0,
      recurrenteLista,
      recurrenteFinal,
      descuentoRecurrente: Math.max(0, recurrenteLista - recurrenteFinal),
      setupFinal: aCentavos(setupFinalUsd),
    },
  };
}
