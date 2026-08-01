// ============================================================================
// /api/firma/[id] — lado cliente del sistema de firmas
// ----------------------------------------------------------------------------
//   GET     estado público del sobre (lo consume /firma/[id]). El id de 32 hex
//           generado con crypto ES la credencial: quien tiene el enlace puede
//           ver y firmar, igual que un "cualquiera con el enlace" de Drive.
//   POST    registra la firma del cliente: valida, genera el PDF final con la
//           hoja de firmas (pdf-lib) y deja el sobre en estado "firmado".
//   DELETE  anula un sobre PENDIENTE (requiere clave de closer). Los sobres
//           firmados no se borran: son el respaldo del contrato.
// ============================================================================

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { claveValida, ipDelRequest, superaRateLimit } from "@/lib/firma/auth";
import { generarPdfFirmado } from "@/lib/firma/certificado";
import {
  blobConfigurado,
  eliminarSobre,
  esIdValido,
  guardarMeta,
  guardarPdf,
  leerMeta,
  leerPdf,
  rutaFirmado,
  rutaOriginal,
} from "@/lib/firma/store";
import { proyectarSobre } from "@/lib/firma/tipos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FIRMA_PNG = 300 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SIN_CACHE = { "Cache-Control": "no-store" };

function error(mensaje: string, status: number) {
  return NextResponse.json({ ok: false, error: mensaje }, { status, headers: SIN_CACHE });
}

export async function GET(_req: Request, ctx: RouteContext<"/api/firma/[id]">) {
  const { id } = await ctx.params;
  if (!blobConfigurado()) return error("El sistema de firmas no está configurado.", 503);
  if (!esIdValido(id)) return error("Solicitud de firma no encontrada.", 404);

  const h = await headers();
  if (superaRateLimit(`estado:${await ipDelRequest(h)}`, 30)) {
    return error("Demasiadas consultas seguidas. Espera un minuto.", 429);
  }

  const meta = await leerMeta(id);
  if (!meta) return error("Solicitud de firma no encontrada.", 404);

  return NextResponse.json({ ok: true, sobre: proyectarSobre(meta) }, { headers: SIN_CACHE });
}

export async function POST(request: Request, ctx: RouteContext<"/api/firma/[id]">) {
  const { id } = await ctx.params;
  if (!blobConfigurado()) return error("El sistema de firmas no está configurado.", 503);
  if (!esIdValido(id)) return error("Solicitud de firma no encontrada.", 404);

  const h = await headers();
  const ip = await ipDelRequest(h);
  if (superaRateLimit(`firmar:${ip}`, 6)) {
    return error("Demasiados intentos seguidos. Espera un minuto.", 429);
  }

  let body: {
    nombre?: unknown;
    email?: unknown;
    rut?: unknown;
    firmaPng?: unknown;
    acepta?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return error("No pudimos leer el formulario.", 400);
  }

  const nombre = typeof body.nombre === "string" ? body.nombre.trim().slice(0, 120) : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 120) : "";
  const rut = typeof body.rut === "string" ? body.rut.trim().slice(0, 20) : "";
  const firmaPng = typeof body.firmaPng === "string" ? body.firmaPng : "";

  if (body.acepta !== true) {
    return error("Debes aceptar la declaración de firma electrónica para continuar.", 400);
  }
  if (nombre.length < 3) return error("Escribe tu nombre completo.", 400);
  if (!EMAIL_RE.test(email)) return error("El email no es válido.", 400);
  if (rut && !/^[0-9.]{7,12}-?[0-9kK]$/.test(rut)) {
    return error("El RUT no tiene un formato válido (ej: 12.345.678-9).", 400);
  }
  if (
    !firmaPng.startsWith("data:image/png;base64,") ||
    firmaPng.length <= 200 ||
    firmaPng.length > MAX_FIRMA_PNG
  ) {
    return error("Falta tu firma manuscrita (dibújala en el recuadro).", 400);
  }

  const meta = await leerMeta(id);
  if (!meta) return error("Solicitud de firma no encontrada.", 404);
  if (meta.estado === "firmado") {
    return error("Este documento ya fue firmado.", 409);
  }

  const original = await leerPdf(rutaOriginal(id));
  if (!original) return error("No pudimos recuperar el documento original.", 502);

  const host = h.get("host") ?? "www.clinera.io";
  const protocolo = host.startsWith("localhost") ? "http" : "https";
  const urlVerificacion = `${protocolo}://${host}/firma/${id}`;

  const metaFirmado = {
    ...meta,
    firmaCliente: {
      nombre,
      email,
      ...(rut ? { rut } : {}),
      firmadoEn: new Date().toISOString(),
      ip,
      userAgent: (h.get("user-agent") ?? "desconocido").slice(0, 300),
      firmaPng,
    },
  };

  let firmado: Uint8Array;
  try {
    firmado = await generarPdfFirmado(original, metaFirmado, urlVerificacion);
  } catch {
    return error("No pudimos generar el documento firmado. Inténtalo de nuevo.", 502);
  }

  const metaFinal = {
    ...metaFirmado,
    estado: "firmado" as const,
    firmadoSha256: createHash("sha256").update(firmado).digest("hex"),
    firmadoBytes: firmado.length,
  };

  try {
    await guardarPdf(rutaFirmado(id), firmado);
    await guardarMeta(metaFinal);
  } catch {
    return error("No pudimos guardar el documento firmado. Inténtalo de nuevo.", 502);
  }

  return NextResponse.json(
    { ok: true, sobre: proyectarSobre(metaFinal) },
    { headers: SIN_CACHE },
  );
}

export async function DELETE(request: Request, ctx: RouteContext<"/api/firma/[id]">) {
  const { id } = await ctx.params;
  if (!blobConfigurado()) return error("El sistema de firmas no está configurado.", 503);

  const h = await headers();
  if (!claveValida(h.get("x-firma-clave"))) {
    return error("Clave de acceso incorrecta.", 401);
  }
  if (!esIdValido(id)) return error("Solicitud de firma no encontrada.", 404);

  const meta = await leerMeta(id);
  if (!meta) return error("Solicitud de firma no encontrada.", 404);
  if (meta.estado === "firmado") {
    return error("Un documento firmado no se puede eliminar: es el respaldo del acuerdo.", 409);
  }

  try {
    await eliminarSobre(id);
  } catch {
    return error("No pudimos anular la solicitud. Inténtalo de nuevo.", 502);
  }

  return NextResponse.json({ ok: true }, { headers: SIN_CACHE });
}
