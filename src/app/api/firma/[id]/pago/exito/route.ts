// ============================================================================
// /api/firma/[id]/pago/exito — retorno del checkout de Stripe
// ----------------------------------------------------------------------------
// Stripe redirige acá tras el pago con ?sesion=<CHECKOUT_SESSION_ID>. Antes de
// marcar el sobre como pagado se consulta la sesión DIRECTO a Stripe: debe
// estar en payment_status "paid" y pertenecer a este folio. Un ?pago=ok
// escrito a mano en la URL no habilita nada.
// ============================================================================

import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { ipDelRequest, superaRateLimit } from "@/lib/firma/auth";
import { blobConfigurado, esIdValido, guardarMeta, leerMeta } from "@/lib/firma/store";
import { sesionPagada, stripeConfigurado } from "@/lib/firma/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/firma/[id]/pago/exito">,
) {
  const { id } = await ctx.params;

  const h = await headers();
  const host = h.get("host") ?? "www.clinera.io";
  const protocolo = host.startsWith("localhost") ? "http" : "https";
  const volverCon = (codigo: string) =>
    NextResponse.redirect(`${protocolo}://${host}/firma/${id}?pago=${codigo}`, {
      status: 303,
    });

  if (!blobConfigurado() || !stripeConfigurado() || !esIdValido(id)) {
    return volverCon("error");
  }

  if (superaRateLimit(`pago-exito:${await ipDelRequest(h)}`, 15)) {
    return volverCon("reintentar");
  }

  const sessionId = request.nextUrl.searchParams.get("sesion") ?? "";
  const meta = await leerMeta(id);
  if (!meta || !meta.cotizacion) return volverCon("error");
  if (meta.pagoRealizado) return volverCon("ok");

  let pagada = false;
  try {
    pagada = await sesionPagada(sessionId, id);
  } catch {
    return volverCon("error");
  }
  if (!pagada) return volverCon("error");

  try {
    await guardarMeta({
      ...meta,
      pagoRealizado: {
        checkoutSessionId: sessionId,
        pagadoEn: new Date().toISOString(),
      },
    });
  } catch {
    // El pago existe en Stripe aunque no pudimos persistirlo: el cliente puede
    // reintentar el retorno (la sesión sigue pagada) sin doble cobro.
    return volverCon("error");
  }

  return volverCon("ok");
}
