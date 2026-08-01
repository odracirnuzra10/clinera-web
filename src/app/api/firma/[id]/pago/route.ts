// ============================================================================
// /api/firma/[id]/pago — checkout de Stripe para el sobre firmado
// ----------------------------------------------------------------------------
// El botón "Continuar al pago" navega acá. Se crea una Checkout Session
// on-demand (expiran a las 24 h, no tiene sentido guardarlas) y se redirige
// al cliente a Stripe. Reglas:
//
//   - Solo sobres con cotización asociada.
//   - Solo DESPUÉS de que el cliente firmó: primero contrato, después cobro.
//   - Sin STRIPE_SECRET_KEY el endpoint avisa con un redirect (?pago=sin-config)
//     en vez de romper: el resto del sistema de firmas funciona igual.
//
// Los errores redirigen a /firma/<id>?pago=<código> para que la página los
// muestre en contexto.
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
  if (meta.estado !== "firmado") return volverCon("firma-pendiente");

  try {
    const url = await crearSesionPago(meta, {
      exito: `${base}?pago=ok`,
      cancelado: base,
    });
    return NextResponse.redirect(url, { status: 303 });
  } catch {
    return volverCon("error");
  }
}
