// ============================================================================
// Firma — SSO de Google para el equipo comercial
// ----------------------------------------------------------------------------
// Login con Google restringido al dominio @oacg.cl, sin librerías: OAuth 2.0
// directo contra Google (authorization code). El id_token llega por el token
// endpoint de Google sobre TLS, así que su payload es confiable sin verificar
// la firma JWT; aun así el dominio del email se valida SIEMPRE server-side
// (el parámetro hd de Google es solo una sugerencia de UI).
//
// La sesión es una cookie httpOnly firmada con HMAC-SHA256 usando
// FIRMA_ACCESS_KEY como secreto: si se rota la clave del equipo, todas las
// sesiones SSO caducan también.
//
// Config: GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET (ver docs/firma.md).
// Redirect URI a registrar: https://www.clinera.io/api/firma/auth/google/callback
// ============================================================================

import { createHmac, timingSafeEqual } from "node:crypto";

export const DOMINIO_SSO = "oacg.cl";
export const COOKIE_SESION = "firma_sesion";
export const COOKIE_STATE = "firma_oauth_state";
const SESION_HORAS = 12;

export function ssoConfigurado(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

function secreto(): string {
  return `firma-sso:${process.env.FIRMA_ACCESS_KEY || ""}`;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

function firmar(cuerpo: string): string {
  return b64url(createHmac("sha256", secreto()).update(cuerpo).digest());
}

export type SesionSso = { email: string; nombre: string };

/** Crea el valor de la cookie de sesión (payload firmado, expira en 12 h). */
export function crearSesion(datos: SesionSso): string {
  const cuerpo = b64url(
    Buffer.from(
      JSON.stringify({
        email: datos.email,
        nombre: datos.nombre,
        exp: Date.now() + SESION_HORAS * 3_600_000,
      }),
    ),
  );
  return `${cuerpo}.${firmar(cuerpo)}`;
}

/** Valida la cookie de sesión; null si falta, está corrupta o expiró. */
export function sesionValida(valor: string | undefined | null): SesionSso | null {
  if (!valor) return null;
  const [cuerpo, firma] = valor.split(".");
  if (!cuerpo || !firma) return null;
  const esperada = firmar(cuerpo);
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const datos = JSON.parse(Buffer.from(cuerpo, "base64url").toString("utf8")) as {
      email?: string;
      nombre?: string;
      exp?: number;
    };
    if (!datos.email || typeof datos.exp !== "number" || datos.exp < Date.now()) return null;
    if (!emailPermitido(datos.email)) return null;
    return { email: datos.email, nombre: datos.nombre ?? "" };
  } catch {
    return null;
  }
}

export function emailPermitido(email: string): boolean {
  return email.toLowerCase().endsWith(`@${DOMINIO_SSO}`);
}

/** Decodifica el payload de un id_token de Google (recibido vía TLS directo). */
export function payloadDeIdToken(idToken: string): {
  email?: string;
  email_verified?: boolean;
  hd?: string;
  name?: string;
} | null {
  const partes = idToken.split(".");
  if (partes.length !== 3) return null;
  try {
    return JSON.parse(Buffer.from(partes[1], "base64url").toString("utf8"));
  } catch {
    return null;
  }
}
