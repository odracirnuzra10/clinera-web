// ============================================================================
// /api/firma/auth/google — inicio del login con Google (@oacg.cl)
// ----------------------------------------------------------------------------
// Redirige a Google con un state anti-CSRF guardado en cookie. El parámetro
// hd solo pre-filtra la pantalla de cuentas: la validación real del dominio
// ocurre en el callback.
// ============================================================================

import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { COOKIE_STATE, DOMINIO_SSO, ssoConfigurado } from "@/lib/firma/sso";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const h = await headers();
  const host = h.get("host") ?? "www.clinera.io";
  const protocolo = host.startsWith("localhost") ? "http" : "https";

  if (!ssoConfigurado()) {
    return NextResponse.redirect(`${protocolo}://${host}/firma?sso=sin-config`, { status: 303 });
  }

  const state = randomBytes(16).toString("hex");
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    redirect_uri: `${protocolo}://${host}/api/firma/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    hd: DOMINIO_SSO,
    state,
    prompt: "select_account",
  });

  const respuesta = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
    { status: 303 },
  );
  respuesta.cookies.set(COOKIE_STATE, state, {
    httpOnly: true,
    secure: protocolo === "https",
    sameSite: "lax",
    maxAge: 300,
    path: "/api/firma/auth/google",
  });
  return respuesta;
}
