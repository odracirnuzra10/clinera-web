// ============================================================================
// /gracias — token de corta duración para el disparo del Pixel
// ----------------------------------------------------------------------------
// Hasta ahora /gracias disparaba `CompleteRegistration` con solo
// `?event_id=x&source=y` en la URL — cualquiera que compartiera o visitara
// ese link inflaba el Pixel con una conversión falsa, sin haber dejado datos
// reales. Hallazgo #3 de auditoria-leads-clinera.md (PR #170).
//
// El flujo que confirma un lead real (hoy: RoiCalculator.tsx; ver nota en
// ThanksContent.tsx sobre por qué no es el wizard) pide este token DESPUÉS de
// que su propio envío del lead respondió OK, y lo agrega a la URL de
// redirección. `page.tsx` lo valida server-side antes de decirle a
// ThanksContent si puede disparar el Pixel — la firma nunca viaja al cliente,
// así que no se puede fabricar sin el secreto.
//
// Caveat igual al de /api/triage: el endpoint que emite el token exige mismo
// origen + rate limit, no una autenticación real — alguien que deliberadamente
// spoofee el header Origin de un POST directo podría igual pedir un token
// para un event_id inventado. Sube el costo del ataque, no lo elimina del
// todo; cerrarlo del todo requeriría que el mint conociera el lead real, y
// hoy vive en un n8n distinto (clinerasoftware.app.n8n.cloud) sin API acá.
// ============================================================================

import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.GRACIAS_TOKEN_SECRET || "";

/** El usuario tarda segundos en llegar a /gracias; 10 min sobra con margen. */
const VIGENCIA_MS = 10 * 60_000;

function firma(eventId: string, source: string, expira: number): string {
  return createHmac("sha256", SECRET)
    .update(`${eventId}:${source}:${expira}`)
    .digest("base64url");
}

export function secretoConfigurado(): boolean {
  return Boolean(SECRET);
}

export function emitirToken(eventId: string, source: string): string {
  const expira = Date.now() + VIGENCIA_MS;
  return `${expira}.${firma(eventId, source, expira)}`;
}

export function tokenValido(
  eventId: string,
  source: string,
  token: string,
): boolean {
  if (!SECRET || !eventId || !token) return false;

  const [expiraStr, recibida] = token.split(".");
  const expira = Number(expiraStr);
  if (!expiraStr || !recibida || !Number.isFinite(expira)) return false;
  if (Date.now() > expira) return false;

  const esperada = firma(eventId, source, expira);
  const a = Buffer.from(recibida);
  const b = Buffer.from(esperada);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
