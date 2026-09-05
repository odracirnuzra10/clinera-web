/**
 * Postulación al programa partner (`/partners#aplicar`).
 * Nombre + celular (prefijos LATAM). El API revalida; el navegador adelanta feedback.
 */
import {
  digitosTelefono,
  mensajeErrorTelefono,
  PARTNERS_APPLY_PHONE_PREFIXES,
  telefonoLocalValido,
} from "@/lib/telefono";

export type PartnerApplyPrefix =
  (typeof PARTNERS_APPLY_PHONE_PREFIXES)[number]["prefix"];

export type PostulacionPartner = {
  nombre: string;
  /** Prefijo E.164 del país (`+56`, `+52`, …). */
  prefix: PartnerApplyPrefix;
  /** Dígitos nacionales (sin código de país). */
  telefono: string;
};

const ALLOWED = new Set<string>(
  PARTNERS_APPLY_PHONE_PREFIXES.map((p) => p.prefix),
);

const NOMBRE_MIN = 2;
const NOMBRE_MAX = 80;

export function esPrefijoPartner(value: string): value is PartnerApplyPrefix {
  return ALLOWED.has(value);
}

export function normalizarPostulacionPartner(
  crudo: Partial<PostulacionPartner> & { local?: string },
): PostulacionPartner {
  const prefixRaw = String(crudo.prefix ?? "").trim();
  const prefix = esPrefijoPartner(prefixRaw) ? prefixRaw : ("+56" as PartnerApplyPrefix);
  // El form puede mandar `local` o `telefono` con dígitos nacionales.
  const local = digitosTelefono(
    String(crudo.local ?? crudo.telefono ?? ""),
  );
  return {
    nombre: String(crudo.nombre ?? "")
      .trim()
      .replace(/\s+/g, " "),
    prefix,
    telefono: local,
  };
}

export function validarPostulacionPartner(p: PostulacionPartner): string[] {
  const errores: string[] = [];
  if (p.nombre.length < NOMBRE_MIN) errores.push("Escribe tu nombre.");
  if (p.nombre.length > NOMBRE_MAX) {
    errores.push("El nombre es demasiado largo.");
  }
  if (!esPrefijoPartner(p.prefix)) {
    errores.push("Selecciona un país de la lista.");
  } else {
    const msg = mensajeErrorTelefono(p.prefix, p.telefono);
    if (msg) errores.push(msg);
  }
  return errores;
}

export function errorNombrePartner(nombre: string): string | null {
  const t = nombre.trim();
  if (t.length < NOMBRE_MIN) return "Escribe tu nombre.";
  if (t.length > NOMBRE_MAX) return "El nombre es demasiado largo.";
  return null;
}

export function errorTelefonoPartner(
  prefix: string,
  local: string,
): string | null {
  if (!esPrefijoPartner(prefix)) return "Selecciona un país de la lista.";
  return mensajeErrorTelefono(prefix, digitosTelefono(local));
}

/** ¿El local es válido para el prefijo? (atajo para tests). */
export function telefonoPartnerValido(
  prefix: string,
  local: string,
): boolean {
  return esPrefijoPartner(prefix) && telefonoLocalValido(prefix, digitosTelefono(local));
}
