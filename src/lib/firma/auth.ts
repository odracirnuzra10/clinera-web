// ============================================================================
// Firma simple — acceso del closer y rate limit
// ----------------------------------------------------------------------------
// El lado closer (/firma) se protege con una clave compartida que viaja en el
// header x-firma-clave y se valida SIEMPRE server-side contra FIRMA_ACCESS_KEY.
// Sin la variable configurada el sistema responde 503 (igual criterio que
// /api/triage: un error visible es mejor que una herramienta abierta a todos).
//
// El lado cliente (/firma/<id>) no usa clave: el id de 32 hex ES la capacidad.
// ============================================================================

import { timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { COOKIE_SESION, sesionValida, type SesionSso } from "./sso";

export function claveConfigurada(): boolean {
  return Boolean(process.env.FIRMA_ACCESS_KEY);
}

export function claveValida(candidata: string | null): boolean {
  const esperada = process.env.FIRMA_ACCESS_KEY || "";
  if (!esperada || !candidata) return false;
  const a = Buffer.from(candidata);
  const b = Buffer.from(esperada);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Acceso del lado closer: clave compartida en el header x-firma-clave O una
 * sesión SSO de Google (@oacg.cl) en cookie. Devuelve la sesión si el acceso
 * vino por SSO (para prefills), true si vino por clave, false si no hay acceso.
 */
export async function accesoCloser(): Promise<SesionSso | boolean> {
  const h = await headers();
  if (claveValida(h.get("x-firma-clave"))) return true;
  const sesion = sesionValida((await cookies()).get(COOKIE_SESION)?.value);
  return sesion ?? false;
}

// ── Rate limit en memoria (mismo patrón que /api/triage) ────────────────────
// Por instancia y se reinicia en cada deploy: defensa contra floods, no es
// autenticación.
const VENTANA_MS = 60_000;
const golpes = new Map<string, number[]>();

export function superaRateLimit(clave: string, maxPorVentana: number): boolean {
  const ahora = Date.now();
  const previos = (golpes.get(clave) ?? []).filter((t) => ahora - t < VENTANA_MS);
  previos.push(ahora);
  golpes.set(clave, previos);

  if (golpes.size > 500) {
    for (const [k, marcas] of golpes) {
      if (marcas.every((t) => ahora - t >= VENTANA_MS)) golpes.delete(k);
    }
  }

  return previos.length > maxPorVentana;
}

export async function ipDelRequest(headers: Headers): Promise<string> {
  return (
    (headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    (headers.get("x-real-ip") ?? "") ||
    "desconocida"
  );
}
