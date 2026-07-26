// ============================================================================
// Triage — reglas de validación compartidas cliente + servidor
// ----------------------------------------------------------------------------
// Este módulo es la ÚNICA fuente de verdad de la validación. Lo importa tanto
// el formulario (src/app/triage/TriageForm.tsx) como el endpoint del servidor
// (src/app/api/triage/route.ts).
//
// El cliente valida para dar feedback inmediato bajo cada campo. El servidor
// vuelve a validar SIEMPRE — la validación del navegador se puede saltar con
// un curl, así que nunca es una garantía.
//
// No importa React ni nada de `next/*`: debe poder correr en ambos lados.
// ============================================================================

export const TIPOS = ["bug", "solicitud", "consulta"] as const;
export type TriageTipo = (typeof TIPOS)[number];

export const DOMINIO_PERMITIDO = "@oacg.cl";
export const MIN_TITULO = 10;
export const MIN_DESCRIPCION = 30;

export type TriagePayload = {
  reportante_nombre: string;
  reportante_email: string;
  clinica: string;
  tipo: TriageTipo;
  titulo: string;
  descripcion: string;
  url_captura: string;
};

export type CampoTriage = keyof TriagePayload;
export type ErroresCampo = Partial<Record<CampoTriage, string>>;

export type ResultadoValidacion = {
  /** Errores por campo — se pintan bajo el input correspondiente. */
  errores: ErroresCampo;
  /**
   * Aviso de datos de pacientes. Va aparte de `errores` porque no es un error
   * de formato: es un bloqueo de cumplimiento (Ley 21.719) y se muestra como
   * un aviso destacado, no como una línea roja bajo el campo.
   */
  aviso: string | null;
};

// ── Detección de datos personales de pacientes ──────────────────────────────
// Ley 21.719 (vigente 01-12-2026): los datos de salud son categoría sensible.
// Si un RUT entra por acá, termina replicado en Linear, Gmail y Google Chat.
// Estos patrones son deliberadamente amplios: preferimos un falso positivo
// (la persona reescribe la frase) a filtrar el RUT de una paciente.

const PATRON_RUT = /\b\d{1,2}[.\s]?\d{3}[.\s]?\d{3}\s?[-–]\s?[\dkK]\b/;
const PATRON_FONO = /(\+?56\s?9|\b9)\s?\d{4}\s?\d{4}\b/;
const PATRON_MAIL = /\b[^@\s]+@(?!oacg\.cl)[a-z0-9.-]+\.[a-z]{2,}\b/i;

const AVISO_RUT =
  "No incluyas datos de pacientes. Detectamos lo que parece ser un RUT. Usa el ID interno o el número de ficha en su lugar.";
const AVISO_FONO =
  "No incluyas datos de pacientes. Detectamos lo que parece ser un teléfono. Usa el ID interno o el número de ficha en su lugar.";
const AVISO_MAIL =
  "No incluyas datos de pacientes. Detectamos lo que parece ser un correo de una persona externa. Usa el ID interno o el número de ficha en su lugar.";

/**
 * Revisa `titulo` + `descripcion` en busca de datos de pacientes.
 * Devuelve el aviso accionable a mostrar, o `null` si el texto está limpio.
 */
export function detectarDatosPaciente(
  titulo: string,
  descripcion: string,
): string | null {
  const texto = `${titulo}\n${descripcion}`;
  if (PATRON_RUT.test(texto)) return AVISO_RUT;
  if (PATRON_FONO.test(texto)) return AVISO_FONO;
  if (PATRON_MAIL.test(texto)) return AVISO_MAIL;
  return null;
}

// ── Validaciones de formato ─────────────────────────────────────────────────

function esEmailValido(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function esUrlValida(valor: string): boolean {
  try {
    const u = new URL(valor);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Normaliza el payload: recorta espacios y fuerza el tipo a un valor conocido.
 * El servidor la usa antes de validar para no confiar en lo que llegó crudo.
 */
export function normalizarTriage(entrada: Partial<TriagePayload>): TriagePayload {
  const texto = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const tipo = texto(entrada.tipo) as TriageTipo;
  return {
    reportante_nombre: texto(entrada.reportante_nombre),
    reportante_email: texto(entrada.reportante_email).toLowerCase(),
    clinica: texto(entrada.clinica),
    tipo: TIPOS.includes(tipo) ? tipo : "bug",
    titulo: texto(entrada.titulo),
    descripcion: texto(entrada.descripcion),
    url_captura: texto(entrada.url_captura),
  };
}

/**
 * Valida un reporte ya normalizado. Los valores se asumen recortados.
 */
export function validarTriage(v: TriagePayload): ResultadoValidacion {
  const errores: ErroresCampo = {};

  if (!v.reportante_nombre) {
    errores.reportante_nombre = "Escribe tu nombre.";
  }

  if (!v.reportante_email) {
    errores.reportante_email = "Escribe tu correo.";
  } else if (!esEmailValido(v.reportante_email)) {
    errores.reportante_email = "Ese correo no tiene un formato válido.";
  } else if (!v.reportante_email.endsWith(DOMINIO_PERMITIDO)) {
    errores.reportante_email = `Usa tu correo ${DOMINIO_PERMITIDO}.`;
  }

  if (!v.clinica) {
    errores.clinica = "Indica la clínica afectada.";
  }

  if (!TIPOS.includes(v.tipo)) {
    errores.tipo = "Elige un tipo de reporte.";
  }

  if (!v.titulo) {
    errores.titulo = "Cuéntanos qué pasa.";
  } else if (v.titulo.length < MIN_TITULO) {
    errores.titulo = `Muy corto: al menos ${MIN_TITULO} caracteres (llevas ${v.titulo.length}).`;
  }

  if (!v.descripcion) {
    errores.descripcion = "Necesitamos el detalle para poder reproducirlo.";
  } else if (v.descripcion.length < MIN_DESCRIPCION) {
    errores.descripcion = `Muy corto: al menos ${MIN_DESCRIPCION} caracteres (llevas ${v.descripcion.length}).`;
  }

  if (v.url_captura && !esUrlValida(v.url_captura)) {
    errores.url_captura = "Ese link no es una URL válida (debe empezar con https://).";
  }

  return {
    errores,
    aviso: detectarDatosPaciente(v.titulo, v.descripcion),
  };
}

/**
 * Aplana el resultado a un array de strings — el formato que el contrato de
 * n8n usa para `errores` en las respuestas 400, y que el formulario sabe
 * pintar tal cual.
 */
export function erroresComoLista(r: ResultadoValidacion): string[] {
  const lista = Object.values(r.errores).filter(Boolean) as string[];
  if (r.aviso) lista.push(r.aviso);
  return lista;
}

export function hayErrores(r: ResultadoValidacion): boolean {
  return Object.keys(r.errores).length > 0 || r.aviso !== null;
}
