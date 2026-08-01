// ============================================================================
// /api/firma/[id]/documento — adjuntar el contrato (paso secundario)
// ----------------------------------------------------------------------------
// En el flujo "link de pago" el sobre nace sin contrato. Una vez pagado, el
// closer adjunta acá el PDF del contrato (o de la cotización) y recién
// entonces el cliente puede firmarlo desde su mismo enlace.
//
// Requiere acceso de closer (clave o SSO). Se puede reemplazar mientras el
// sobre no esté firmado.
// ============================================================================

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { accesoCloser } from "@/lib/firma/auth";
import { inspeccionarPdf } from "@/lib/firma/certificado";
import {
  blobConfigurado,
  esIdValido,
  guardarMeta,
  guardarPdf,
  leerMeta,
  rutaOriginal,
} from "@/lib/firma/store";
import { proyectarSobre } from "@/lib/firma/tipos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PDF_BYTES = 4 * 1024 * 1024;
const SIN_CACHE = { "Cache-Control": "no-store" };

function error(mensaje: string, status: number) {
  return NextResponse.json({ ok: false, error: mensaje }, { status, headers: SIN_CACHE });
}

export async function POST(request: Request, ctx: RouteContext<"/api/firma/[id]/documento">) {
  const { id } = await ctx.params;
  if (!blobConfigurado()) return error("El sistema de firmas no está configurado.", 503);
  if (!(await accesoCloser())) return error("Clave de acceso incorrecta.", 401);
  if (!esIdValido(id)) return error("Solicitud no encontrada.", 404);

  const meta = await leerMeta(id);
  if (!meta) return error("Solicitud no encontrada.", 404);
  if (meta.estado === "firmado") {
    return error("El sobre ya está firmado: el contrato no se puede reemplazar.", 409);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return error("No pudimos leer el formulario.", 400);
  }

  const archivo = form.get("archivo");
  if (!(archivo instanceof File)) return error("Falta el archivo PDF del contrato.", 400);
  if (archivo.size === 0) return error("El PDF llegó vacío.", 400);
  if (archivo.size > MAX_PDF_BYTES) return error("El PDF supera el máximo de 4 MB.", 400);

  const bytes = Buffer.from(await archivo.arrayBuffer());
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return error("El archivo no es un PDF.", 400);
  }

  let paginas = 0;
  try {
    ({ paginas } = await inspeccionarPdf(bytes));
  } catch {
    return error("No pudimos leer el PDF (¿está protegido con contraseña?).", 400);
  }

  const metaActualizada = {
    ...meta,
    documento: {
      nombreArchivo: (archivo.name || "contrato.pdf").slice(0, 120),
      titulo: meta.titulo,
      paginas,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    },
  };

  try {
    await guardarPdf(rutaOriginal(id), bytes);
    await guardarMeta(metaActualizada);
  } catch {
    return error("No pudimos guardar el contrato. Inténtalo de nuevo.", 502);
  }

  return NextResponse.json(
    { ok: true, sobre: proyectarSobre(metaActualizada) },
    { headers: SIN_CACHE },
  );
}
