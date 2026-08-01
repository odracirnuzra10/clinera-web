// ============================================================================
// Firma + pago — creación del checkout de Stripe
// ----------------------------------------------------------------------------
// Cuando el cliente ya firmó y el sobre trae cotización, este módulo arma una
// Checkout Session en modo suscripción que replica la cotización:
//
//   - Ítems recurrentes a PRECIO DE LISTA (plan, usuarios extra, packs de
//     créditos), con el intervalo mensual o semestral.
//   - Un cupón por el monto exacto del descuento por período, con la duración
//     elegida por el closer: solo el primer pago, N meses, o para siempre.
//     Así una personalización temporal expira sola y la suscripción vuelve a
//     precio de lista sin tocar nada.
//   - La configuración inicial como cobro único en el primer pago (ya con su
//     descuento aplicado).
//
// Las sesiones expiran a las 24 h, por eso se crean on-demand en cada visita
// a /api/firma/[id]/pago en vez de guardarse.
//
// Config: STRIPE_SECRET_KEY — se recomienda una clave restringida con Write en
// Checkout Sessions, Customers, Products, Prices y Coupons (ver docs/firma.md).
// ============================================================================

import Stripe from "stripe";
import type { SobreMeta } from "./tipos";

export function stripeConfigurado(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function descripcionDuracion(meta: SobreMeta): Stripe.CouponCreateParams {
  const cotizacion = meta.cotizacion!;
  const base: Stripe.CouponCreateParams = {
    amount_off: cotizacion.centavos.descuentoRecurrente,
    currency: "usd",
    name: `Descuento cotización ${cotizacion.numero}`.slice(0, 40),
  };
  const dur = cotizacion.duracionDescuento;
  if (dur.tipo === "siempre") return { ...base, duration: "forever" };
  if (dur.tipo === "meses") {
    return { ...base, duration: "repeating", duration_in_months: dur.meses };
  }
  return { ...base, duration: "once" };
}

/** Crea la sesión de pago y devuelve la URL de checkout. */
export async function crearSesionPago(
  meta: SobreMeta,
  urls: { exito: string; cancelado: string },
): Promise<string> {
  const cotizacion = meta.cotizacion;
  if (!cotizacion) throw new Error("El sobre no tiene cotización asociada.");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const recurring: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring = {
    interval: "month",
    interval_count: cotizacion.periodoMeses,
  };
  const sufijoPeriodo = cotizacion.periodoMeses === 6 ? "semestre" : "mes";

  const lineas: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: cotizacion.centavos.planLista,
        recurring,
        product_data: {
          name: `Plan ${cotizacion.planNombre} · Clinera`,
          description: `Suscripción ${sufijoPeriodo === "mes" ? "mensual" : "semestral"} — cotización ${cotizacion.numero}`,
        },
      },
    },
  ];

  if (cotizacion.extraUsuarios > 0) {
    lineas.push({
      quantity: cotizacion.extraUsuarios,
      price_data: {
        currency: "usd",
        unit_amount: cotizacion.centavos.usuarioLista,
        recurring,
        product_data: { name: `Usuario adicional · Clinera (por ${sufijoPeriodo})` },
      },
    });
  }

  if (cotizacion.extraPacks > 0) {
    lineas.push({
      quantity: cotizacion.extraPacks,
      price_data: {
        currency: "usd",
        unit_amount: cotizacion.centavos.packLista,
        recurring,
        product_data: { name: `Pack de créditos IA · Clinera (por ${sufijoPeriodo})` },
      },
    });
  }

  if (cotizacion.incluirSetup && cotizacion.centavos.setupFinal > 0) {
    lineas.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: cotizacion.centavos.setupFinal,
        product_data: { name: "Configuración inicial · Clinera (pago único)" },
      },
    });
  }

  let descuentos: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
  if (cotizacion.centavos.descuentoRecurrente > 0) {
    const cupon = await stripe.coupons.create(descripcionDuracion(meta));
    descuentos = [{ coupon: cupon.id }];
  }

  const sesion = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: meta.cliente.email,
    line_items: lineas,
    discounts: descuentos,
    success_url: urls.exito,
    cancel_url: urls.cancelado,
    metadata: {
      folio_firma: meta.id,
      cotizacion: cotizacion.numero,
      cliente: meta.cliente.nombre.slice(0, 100),
    },
    subscription_data: {
      metadata: { folio_firma: meta.id, cotizacion: cotizacion.numero },
    },
  });

  if (!sesion.url) throw new Error("Stripe no devolvió URL de checkout.");
  return sesion.url;
}
