// ============================================================================
// /api/firma/auth — verificación de la clave del equipo comercial
// ----------------------------------------------------------------------------
// La página /firma valida acá la clave antes de mostrar el panel. La clave
// nunca vive en el bundle: solo se compara server-side contra FIRMA_ACCESS_KEY.
// ============================================================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { claveConfigurada, claveValida, ipDelRequest, superaRateLimit } from "@/lib/firma/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!claveConfigurada()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "El sistema de firmas todavía no está configurado (falta FIRMA_ACCESS_KEY). Avísale al equipo técnico.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const h = await headers();
  if (superaRateLimit(`auth:${await ipDelRequest(h)}`, 10)) {
    return NextResponse.json(
      { ok: false, error: "Demasiados intentos. Espera un minuto." },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  let clave = "";
  try {
    const body = (await request.json()) as { clave?: unknown };
    clave = typeof body.clave === "string" ? body.clave : "";
  } catch {
    // body inválido → clave vacía → 401 abajo
  }

  if (!claveValida(clave)) {
    return NextResponse.json(
      { ok: false, error: "Clave incorrecta." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
