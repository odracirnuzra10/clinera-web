/**
 * Postulación del convenio doctores. Tres campos, nada del wizard de
 * agendar: nombre, correo y motivo. El API los revalida; el navegador
 * sólo adelanta el feedback.
 */

export type PostulacionDoctores = {
  nombre: string;
  correo: string;
  motivo: string;
};

export const EMAIL_POSTULACION_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const NOMBRE_MIN = 2;
const NOMBRE_MAX = 80;
const MOTIVO_MIN = 20;
const MOTIVO_MAX = 1200;

export function normalizarPostulacion(
  crudo: Partial<PostulacionDoctores>,
): PostulacionDoctores {
  return {
    nombre: (crudo.nombre ?? "").trim().replace(/\s+/g, " "),
    correo: (crudo.correo ?? "").trim().toLowerCase(),
    motivo: (crudo.motivo ?? "").trim(),
  };
}

export function validarPostulacion(p: PostulacionDoctores): string[] {
  const errores: string[] = [];
  if (p.nombre.length < NOMBRE_MIN) errores.push("Escribe tu nombre.");
  if (p.nombre.length > NOMBRE_MAX) errores.push("El nombre es demasiado largo.");
  if (!EMAIL_POSTULACION_RE.test(p.correo)) {
    errores.push("El correo no es válido.");
  }
  if (p.motivo.length < MOTIVO_MIN) {
    errores.push("Cuéntanos un poco más el motivo.");
  }
  if (p.motivo.length > MOTIVO_MAX) {
    errores.push("El motivo es demasiado largo.");
  }
  return errores;
}

export function errorDelPaso(
  paso: keyof PostulacionDoctores,
  valor: string,
): string | null {
  const normalizado = normalizarPostulacion({ [paso]: valor });
  if (paso === "nombre") {
    if (normalizado.nombre.length < NOMBRE_MIN) return "Escribe tu nombre.";
    if (normalizado.nombre.length > NOMBRE_MAX) return "El nombre es demasiado largo.";
    return null;
  }
  if (paso === "correo") {
    return EMAIL_POSTULACION_RE.test(normalizado.correo)
      ? null
      : "El correo no es válido.";
  }
  if (normalizado.motivo.length < MOTIVO_MIN) {
    return "Cuéntanos un poco más el motivo.";
  }
  if (normalizado.motivo.length > MOTIVO_MAX) {
    return "El motivo es demasiado largo.";
  }
  return null;
}
