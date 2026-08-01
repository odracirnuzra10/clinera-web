// ============================================================================
// /api/firma/auth/google/callback — cierre del login con Google
// ----------------------------------------------------------------------------
// Valida el state anti-CSRF, canjea el code por el id_token directamente con
// Google y ACÁ se decide el acceso: solo emails verificados @oacg.cl. Si pasa,
// deja la cookie de sesión firmada y vuelve a /firma.
// ============================================================================

import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import {
  COOKIE_SESION,
  COOKIE_STATE,
  crearSesion,
  emailPermitido,
  payloadDeIdToken,
  ssoConfigurado,
} from "@/lib/firma/sso";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const h = await headers();
  const host = h.get("host") ?? "www.clinera.io";
  const protocolo = host.startsWith("localhost") ? "http" : "https";
  const volver = (codigo?: string) =>
    NextResponse.redirect(`${protocolo}://${host}/firma${codigo ? `?sso=${codigo}` : ""}`, {
      status: 303,
    });

  if (!ssoConfigurado()) return volver("sin-config");

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const stateEsperado = request.cookies.get(COOKIE_STATE)?.value;
  if (!code || !state || !stateEsperado || state !== stateEsperado) {
    return volver("error");
  }

  let idToken = "";
  try {
    const respuesta = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: `${protocolo}://${host}/api/firma/auth/google/callback`,
        grant_type: "authorization_code",
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const json = (await respuesta.json()) as { id_token?: string };
    idToken = json.id_token ?? "";
  } catch {
    return volver("error");
  }

  const payload = idToken ? payloadDeIdToken(idToken) : null;
  if (!payload?.email || payload.email_verified !== true) return volver("error");
  if (!emailPermitido(payload.email)) return volver("dominio");

  const respuesta = volver();
  respuesta.cookies.set(
    COOKIE_SESION,
    crearSesion({ email: payload.email.toLowerCase(), nombre: payload.name ?? "" }),
    {
      httpOnly: true,
      secure: protocolo === "https",
      sameSite: "lax",
      maxAge: 12 * 3600,
      path: "/",
    },
  );
  respuesta.cookies.set(COOKIE_STATE, "", { maxAge: 0, path: "/api/firma/auth/google" });
  return respuesta;
}
