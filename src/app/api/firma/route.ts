// ============================================================================
// /api/firma — lado closer del sistema de firmas
// ----------------------------------------------------------------------------
//   POST  crea un sobre: recibe el PDF de la cotización (multipart) + datos del
//         cliente y del gestor. La firma por Clinera se estampa server-side con
//         la firma registrada del CEO. Devuelve el enlace para el cliente.
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
import { accesoCloser, claveConfigurada, ipDelRequest, superaRateLimit } from "@/lib/firma/auth";
import { inspeccionarPdf } from "@/lib/firma/certificado";
import { CEO_CLINERA, FIRMA_CEO_PNG } from "@/lib/firma/firma-ceo";
import { construirCotizacion } from "@/lib/firma/cotizacion";
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

function textoCorto(valor: FormDataEntryValue | null, max = 120): string {
  return typeof valor === "string" ? valor.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const sinConfig = faltaConfig();
  if (sinConfig) return sinConfig;

  if (!(await accesoCloser())) {
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
  const gestorNombre = textoCorto(form.get("gestorNombre"));
  const gestorEmail = textoCorto(form.get("gestorEmail")).toLowerCase();
  const cotizacionCruda = form.get("cotizacion");
  // Modo "link de pago": el sobre nace desde /cotizacion SIN contrato adjunto.
  // El link va impreso en la cotización; el contrato se adjunta después del
  // pago, como paso secundario, y recién ahí se habilita la firma.
  const sinDocumento = form.get("sinDocumento") === "1";

  if (!titulo) return error("Falta el título del documento.", 400);
  if (!clienteNombre) return error("Falta el nombre del cliente.", 400);
  if (clienteEmail && !EMAIL_RE.test(clienteEmail)) {
    return error("El email del cliente no es válido.", 400);
  }
  if (!sinDocumento && !EMAIL_RE.test(clienteEmail)) {
    return error("El email del cliente no es válido.", 400);
  }
  if (!gestorNombre) return error("Falta tu nombre (gestor de la solicitud).", 400);
  if (!EMAIL_RE.test(gestorEmail)) return error("Tu email no es válido.", 400);

  if (!sinDocumento) {
    if (!(archivo instanceof File)) return error("Falta el archivo PDF de la cotización.", 400);
    if (archivo.size === 0) return error("El PDF llegó vacío.", 400);
    if (archivo.size > MAX_PDF_BYTES) {
      return error("El PDF supera el máximo de 4 MB. Exporta la cotización de nuevo sin imágenes pesadas.", 400);
    }
  }

  // La cotización habilita el pago; en modo link de pago es obligatoria.
  let cotizacion = undefined;
  if (typeof cotizacionCruda === "string" && cotizacionCruda.length > 0) {
    if (cotizacionCruda.length > 4000) return error("La cotización adjunta no es válida.", 400);
    try {
      cotizacion = construirCotizacion(JSON.parse(cotizacionCruda)) ?? undefined;
    } catch {
      cotizacion = undefined;
    }
    if (!cotizacion) {
      return error(
        "No pudimos interpretar los datos de la cotización. Recarga /cotizacion e inténtalo de nuevo.",
        400,
      );
    }
  }
  if (sinDocumento && !cotizacion) {
    return error("El link de pago necesita los datos de la cotización.", 400);
  }

  let documento: SobreMeta["documento"] = null;
  let bytes: Buffer | null = null;
  if (!sinDocumento) {
    bytes = Buffer.from(await (archivo as File).arrayBuffer());
    if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") {
      return error("El archivo no es un PDF. Sube la cotización exportada desde /cotizacion.", 400);
    }
    let paginas = 0;
    try {
      ({ paginas } = await inspeccionarPdf(bytes));
    } catch {
      return error("No pudimos leer el PDF (¿está protegido con contraseña?). Exporta la cotización de nuevo.", 400);
    }
    documento = {
      nombreArchivo: ((archivo as File).name || "cotizacion.pdf").slice(0, 120),
      titulo,
      paginas,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    };
  }

  const h = await headers();
  const id = randomBytes(16).toString("hex");
  const ahora = new Date().toISOString();

  const meta: SobreMeta = {
    version: 1,
    id,
    creadoEn: ahora,
    estado: "pendiente",
    titulo,
    documento,
    cliente: {
      nombre: clienteNombre,
      ...(clienteEmail ? { email: clienteEmail } : {}),
      ...(clienteClinica ? { clinica: clienteClinica } : {}),
    },
    // Clinera firma siempre a través de su representante legal, con la firma
    // registrada del CEO. El closer queda como gestor de la solicitud.
    closer: {
      nombre: CEO_CLINERA.nombre,
      cargo: CEO_CLINERA.cargo,
      email: CEO_CLINERA.email,
      firmadoEn: ahora,
      ip: await ipDelRequest(h),
      userAgent: (h.get("user-agent") ?? "desconocido").slice(0, 300),
      firmaPng: FIRMA_CEO_PNG,
    },
    gestor: {
      nombre: gestorNombre,
      email: gestorEmail,
    },
    ...(cotizacion ? { cotizacion } : {}),
  };

  try {
    if (bytes) await guardarPdf(rutaOriginal(id), bytes);
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

  if (!(await accesoCloser())) {
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
