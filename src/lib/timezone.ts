/** IANA válido, o "" si el header/navegador mandó basura. */
export function zonaIanaOVacia(raw: string | null | undefined): string {
  const tz = (raw || "").trim();
  if (!tz || tz.length > 80) return "";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz }).format(new Date());
    return tz;
  } catch {
    return "";
  }
}

/**
 * Zona con la que se PINTAN los bloques. Gana la IP (Vercel
 * `x-vercel-ip-timezone`): el reloj del OS puede estar en Chile aunque el
 * dueño esté en México, y entonces veía 10:00 creyendo que era su 10:00.
 * Sin header (local, tests) cae al navegador; si tampoco hay, Chile.
 */
export function zonaMostrada(
  tzIp: string,
  tzNavegador: string,
  fallback = "America/Santiago",
): string {
  return zonaIanaOVacia(tzIp) || zonaIanaOVacia(tzNavegador) || fallback;
}
