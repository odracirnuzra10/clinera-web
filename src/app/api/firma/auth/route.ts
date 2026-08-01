// ============================================================================
// /api/firma/auth — verificación de la clave del equipo comercial
// ----------------------------------------------------------------------------
// La página /firma valida acá la clave antes de mostrar el panel. La clave
// nunca vive en el bundle: solo se compara server-side contra FIRMA_ACCESS_KEY.
// ============================================================================

import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { claveConfigurada, claveValida, ipDelRequest, superaRateLimit } from "@/lib/firma/auth";
import { COOKIE_SESION, sesionValida, ssoConfigurado } from "@/lib/firma/sso";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SIN_CACHE = { "Cache-Control": "no-store" };

/** Estado de sesión: usado por /firma al cargar para saber si hay SSO activo. */
export async function GET() {
  const sesion = sesionValida((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) {
    return NextResponse.json(
      { ok: false, sso: ssoConfigurado() },
      { status: 401, headers: SIN_CACHE },
    );
  }
  return NextResponse.json(
    { ok: true, email: sesion.email, nombre: sesion.nombre, sso: ssoConfigurado() },
    { headers: SIN_CACHE },
  );
}

/** Cierra la sesión SSO (borra la cookie). */
export async function DELETE() {
  const respuesta = NextResponse.json({ ok: true }, { headers: SIN_CACHE });
  respuesta.cookies.set(COOKIE_SESION, "", { maxAge: 0, path: "/" });
  return respuesta;
}

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
