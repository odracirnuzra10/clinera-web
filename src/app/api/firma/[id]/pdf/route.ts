// ============================================================================
// /api/firma/[id]/pdf — proxy del documento
// ----------------------------------------------------------------------------
// Los PDFs viven como blobs PRIVADOS: la única forma de leerlos es esta ruta,
// que responde same-origin (así el visor <iframe> de /firma/[id] pasa el CSP
// frame-src 'self' del sitio, y las URLs del Blob store jamás se exponen).
//
//   ?version=original   documento subido por el closer (default)
//   ?version=firmado    documento final con hoja de firmas (solo si ya firmó)
//   &descargar=1        fuerza Content-Disposition attachment
// ============================================================================

import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { ipDelRequest, superaRateLimit } from "@/lib/firma/auth";
import {
  blobConfigurado,
  esIdValido,
  leerMeta,
  leerPdf,
  rutaFirmado,
  rutaOriginal,
} from "@/lib/firma/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function error(mensaje: string, status: number) {
  return NextResponse.json(
    { ok: false, error: mensaje },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

/** Nombre seguro para Content-Disposition (ASCII, sin comillas ni saltos). */
function nombreDescarga(base: string, sufijo: string): string {
  const limpio = base
    .replace(/\.pdf$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .trim()
    .slice(0, 80);
  return `${limpio || "documento"}${sufijo}.pdf`;
}

export async function GET(request: NextRequest, ctx: RouteContext<"/api/firma/[id]/pdf">) {
  const { id } = await ctx.params;
  if (!blobConfigurado()) return error("El sistema de firmas no está configurado.", 503);
  if (!esIdValido(id)) return error("Documento no encontrado.", 404);

  const h = await headers();
  if (superaRateLimit(`pdf:${await ipDelRequest(h)}`, 30)) {
    return error("Demasiadas descargas seguidas. Espera un minuto.", 429);
  }

  const meta = await leerMeta(id);
  if (!meta) return error("Documento no encontrado.", 404);

  const version = request.nextUrl.searchParams.get("version") === "firmado" ? "firmado" : "original";
  if (version === "firmado" && meta.estado !== "firmado") {
    return error("El documento todavía no ha sido firmado por el cliente.", 409);
  }

  const bytes = await leerPdf(version === "firmado" ? rutaFirmado(id) : rutaOriginal(id));
  if (!bytes) return error("No pudimos recuperar el documento.", 502);

  const descargar = request.nextUrl.searchParams.get("descargar") === "1";
  const nombre = nombreDescarga(
    meta.documento.nombreArchivo,
    version === "firmado" ? "-firmado" : "",
  );

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(bytes.length),
      "Content-Disposition": `${descargar ? "attachment" : "inline"}; filename="${nombre}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
