// ============================================================================
// /api/firma — lado closer del sistema de firmas
// ----------------------------------------------------------------------------
//   POST  crea un sobre: recibe el PDF de la cotización (multipart) + datos de
//         las partes + la firma manuscrita del closer. Devuelve el enlace que
//         se comparte con el cliente.
//   GET   lista los sobres más recientes para el panel de /firma.
//
// Ambos exigen el header x-firma-clave == FIRMA_ACCESS_KEY (ver lib/firma/auth).
// Config requerida (ver docs/firma.md):
//   FIRMA_ACCESS_KEY        clave compartida del equipo comercial
//   BLOB_READ_WRITE_TOKEN   inyectada por Vercel al conectar un Blob store
// ============================================================================

import { randomBytes, createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { claveConfigurada, claveValida, ipDelRequest, superaRateLimit } from "@/lib/firma/auth";
import { inspeccionarPdf } from "@/lib/firma/certificado";
import {
  blobConfigurado,
  guardarMeta,
  guardarPdf,
  listarSobres,
  rutaOriginal,
} from "@/lib/firma/store";
import type { SobreMeta } from "@/lib/firma/tipos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel corta los bodies serverless en 4.5 MB: dejamos margen.
const MAX_PDF_BYTES = 4 * 1024 * 1024;
const MAX_FIRMA_PNG = 300 * 1024;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function error(mensaje: string, status: number) {
  return NextResponse.json(
    { ok: false, error: mensaje },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function faltaConfig(): NextResponse | null {
  if (!claveConfigurada() || !blobConfigurado()) {
    return error(
      "El sistema de firmas todavía no está configurado (faltan FIRMA_ACCESS_KEY o el Blob store). Avísale al equipo técnico.",
      503,
    );
  }
  return null;
}

async function claveDelRequest(): Promise<string | null> {
  const h = await headers();
  return h.get("x-firma-clave");
}

function textoCorto(valor: FormDataEntryValue | null, max = 120): string {
  return typeof valor === "string" ? valor.trim().slice(0, max) : "";
}

function esFirmaPngValida(dataUrl: string): boolean {
  return (
    dataUrl.startsWith("data:image/png;base64,") &&
    dataUrl.length > 200 &&
    dataUrl.length <= MAX_FIRMA_PNG
  );
}

export async function POST(request: Request) {
  const sinConfig = faltaConfig();
  if (sinConfig) return sinConfig;

  if (!claveValida(await claveDelRequest())) {
    return error("Clave de acceso incorrecta.", 401);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return error("No pudimos leer el formulario.", 400);
  }

  const archivo = form.get("archivo");
  const titulo = textoCorto(form.get("titulo"), 140);
  const clienteNombre = textoCorto(form.get("clienteNombre"));
  const clienteEmail = textoCorto(form.get("clienteEmail")).toLowerCase();
  const clienteClinica = textoCorto(form.get("clienteClinica"));
  const closerNombre = textoCorto(form.get("closerNombre"));
  const closerEmail = textoCorto(form.get("closerEmail")).toLowerCase();
  const firmaPng = typeof form.get("firmaPng") === "string" ? (form.get("firmaPng") as string) : "";

  if (!(archivo instanceof File)) return error("Falta el archivo PDF de la cotización.", 400);
  if (archivo.size === 0) return error("El PDF llegó vacío.", 400);
  if (archivo.size > MAX_PDF_BYTES) {
    return error("El PDF supera el máximo de 4 MB. Exporta la cotización de nuevo sin imágenes pesadas.", 400);
  }
  if (!titulo) return error("Falta el título del documento.", 400);
  if (!clienteNombre) return error("Falta el nombre de quien firma por el cliente.", 400);
  if (!EMAIL_RE.test(clienteEmail)) return error("El email del cliente no es válido.", 400);
  if (!closerNombre) return error("Falta el nombre del closer.", 400);
  if (!EMAIL_RE.test(closerEmail)) return error("El email del closer no es válido.", 400);
  if (!esFirmaPngValida(firmaPng)) return error("Falta tu firma manuscrita (dibújala en el recuadro).", 400);

  const bytes = Buffer.from(await archivo.arrayBuffer());
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return error("El archivo no es un PDF. Sube la cotización exportada desde /cotizacion.", 400);
  }

  let paginas = 0;
  try {
    ({ paginas } = await inspeccionarPdf(bytes));
  } catch {
    return error("No pudimos leer el PDF (¿está protegido con contraseña?). Exporta la cotización de nuevo.", 400);
  }

  const h = await headers();
  const id = randomBytes(16).toString("hex");
  const ahora = new Date().toISOString();

  const meta: SobreMeta = {
    version: 1,
    id,
    creadoEn: ahora,
    estado: "pendiente",
    documento: {
      nombreArchivo: (archivo.name || "cotizacion.pdf").slice(0, 120),
      titulo,
      paginas,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    },
    cliente: {
      nombre: clienteNombre,
      email: clienteEmail,
      ...(clienteClinica ? { clinica: clienteClinica } : {}),
    },
    closer: {
      nombre: closerNombre,
      email: closerEmail,
      firmadoEn: ahora,
      ip: await ipDelRequest(h),
      userAgent: (h.get("user-agent") ?? "desconocido").slice(0, 300),
      firmaPng,
    },
  };

  try {
    await guardarPdf(rutaOriginal(id), bytes);
    await guardarMeta(meta);
  } catch {
    return error("No pudimos guardar el documento. Inténtalo de nuevo en un momento.", 502);
  }

  const host = h.get("host") ?? "www.clinera.io";
  const protocolo = host.startsWith("localhost") ? "http" : "https";

  return NextResponse.json(
    { ok: true, id, url: `${protocolo}://${host}/firma/${id}` },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET() {
  const sinConfig = faltaConfig();
  if (sinConfig) return sinConfig;

  if (!claveValida(await claveDelRequest())) {
    return error("Clave de acceso incorrecta.", 401);
  }

  const h = await headers();
  if (superaRateLimit(`lista:${await ipDelRequest(h)}`, 30)) {
    return error("Demasiadas consultas seguidas. Espera un minuto.", 429);
  }

  try {
    const sobres = await listarSobres();
    return NextResponse.json(
      { ok: true, sobres },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error("No pudimos cargar las solicitudes. Inténtalo de nuevo.", 502);
  }
}
