// ============================================================================
// Firma simple — persistencia en Vercel Blob
// ----------------------------------------------------------------------------
// No hay base de datos: cada sobre vive bajo el prefijo firma/<id>/ con tres
// blobs privados (nunca accesibles por URL pública — todo se sirve a través
// de las rutas /api/firma/*):
//
//   firma/<id>/original.pdf   PDF subido por el closer
//   firma/<id>/meta.json      estado + evidencia de firmas (SobreMeta)
//   firma/<id>/firmado.pdf    PDF final con hoja de firmas (tras firmar el cliente)
//
// Config: BLOB_READ_WRITE_TOKEN (la inyecta Vercel al conectar un Blob store).
// ============================================================================

import { del, get, list, put } from "@vercel/blob";
import type { SobreMeta, SobreResumen } from "./tipos";
import { proyectarSobre } from "./tipos";

const PREFIJO = "firma/";

export function blobConfigurado(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function rutaOriginal(id: string) {
  return `${PREFIJO}${id}/original.pdf`;
}

export function rutaFirmado(id: string) {
  return `${PREFIJO}${id}/firmado.pdf`;
}

function rutaMeta(id: string) {
  return `${PREFIJO}${id}/meta.json`;
}

/** IDs de sobre: 32 hex generados con crypto — también actúan de capability URL. */
export function esIdValido(id: string): boolean {
  return /^[a-f0-9]{32}$/.test(id);
}

async function streamABuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  return Buffer.from(await new Response(stream).arrayBuffer());
}

export async function guardarPdf(ruta: string, bytes: Buffer | Uint8Array) {
  await put(ruta, Buffer.from(bytes), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/pdf",
  });
}

export async function guardarMeta(meta: SobreMeta) {
  await put(rutaMeta(meta.id), JSON.stringify(meta), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

/** Lee el meta.json directo de origen (sin caché CDN) — el estado debe ser fresco. */
export async function leerMeta(id: string): Promise<SobreMeta | null> {
  if (!esIdValido(id)) return null;
  const resultado = await get(rutaMeta(id), { access: "private", useCache: false });
  if (!resultado || resultado.statusCode !== 200) return null;
  try {
    const crudo = (await streamABuffer(resultado.stream)).toString("utf8");
    const meta = JSON.parse(crudo) as SobreMeta;
    return meta?.version === 1 && meta.id === id ? meta : null;
  } catch {
    return null;
  }
}

export async function leerPdf(ruta: string): Promise<Buffer | null> {
  const resultado = await get(ruta, { access: "private", useCache: false });
  if (!resultado || resultado.statusCode !== 200) return null;
  return streamABuffer(resultado.stream);
}

/** Lista los sobres más recientes para el panel del closer. */
export async function listarSobres(maximo = 60): Promise<SobreResumen[]> {
  const { blobs } = await list({ prefix: PREFIJO, limit: 1000 });
  const metas = blobs
    .filter((blob) => blob.pathname.endsWith("/meta.json"))
    .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
    .slice(0, maximo);

  const sobres = await Promise.all(
    metas.map(async (blob) => {
      const id = blob.pathname.slice(PREFIJO.length).split("/")[0];
      const meta = await leerMeta(id);
      return meta ? proyectarSobre(meta) : null;
    }),
  );

  return sobres.filter((sobre): sobre is SobreResumen => sobre !== null);
}

/** Borra todos los blobs de un sobre (solo se usa con sobres pendientes). */
export async function eliminarSobre(id: string) {
  if (!esIdValido(id)) return;
  const { blobs } = await list({ prefix: `${PREFIJO}${id}/`, limit: 20 });
  if (blobs.length > 0) {
    await del(blobs.map((blob) => blob.url));
  }
}
