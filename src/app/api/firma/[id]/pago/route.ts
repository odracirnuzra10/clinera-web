// ============================================================================
// /api/firma/[id]/pago — checkout de Stripe para el sobre
// ----------------------------------------------------------------------------
// El flujo comercial es PAGAR → FIRMAR: el cliente revisa el documento, paga
// la suscripción y recién ahí se habilita su firma (el POST de firma exige
// pago verificado cuando hay cotización).
//
// La Checkout Session se crea on-demand (expiran a las 24 h). Al pagar,
// Stripe vuelve a /api/firma/[id]/pago/exito, donde se VERIFICA el pago
// contra Stripe antes de marcar el sobre como pagado.
//
// Reglas:
//   - Solo sobres con cotización asociada y aún sin pago registrado.
//   - Sin STRIPE_SECRET_KEY el endpoint avisa con ?pago=sin-config.
// ============================================================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ipDelRequest, superaRateLimit } from "@/lib/firma/auth";
import { blobConfigurado, esIdValido, leerMeta } from "@/lib/firma/store";
import { crearSesionPago, stripeConfigurado } from "@/lib/firma/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: RouteContext<"/api/firma/[id]/pago">) {
  const { id } = await ctx.params;

  const h = await headers();
  const host = h.get("host") ?? "www.clinera.io";
  const protocolo = host.startsWith("localhost") ? "http" : "https";
  const base = `${protocolo}://${host}/firma/${id}`;
  const volverCon = (codigo: string) =>
    NextResponse.redirect(`${base}?pago=${codigo}`, { status: 303 });

  if (!blobConfigurado() || !esIdValido(id)) return volverCon("no-disponible");
  if (!stripeConfigurado()) return volverCon("sin-config");

  if (superaRateLimit(`pago:${await ipDelRequest(h)}`, 10)) {
    return volverCon("reintentar");
  }

  const meta = await leerMeta(id);
  if (!meta || !meta.cotizacion) return volverCon("no-disponible");
  if (meta.pagoRealizado) return volverCon("ya-pagado");

  try {
    const url = await crearSesionPago(meta, {
      // {CHECKOUT_SESSION_ID} lo reemplaza Stripe: /exito verifica el pago
      // server-side antes de habilitar la firma.
      exito: `${protocolo}://${host}/api/firma/${id}/pago/exito?sesion={CHECKOUT_SESSION_ID}`,
      cancelado: base,
    });
    return NextResponse.redirect(url, { status: 303 });
  } catch {
    return volverCon("error");
  }
}
