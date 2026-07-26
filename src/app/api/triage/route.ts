// ============================================================================
// Triage — endpoint server-side del formulario de /triage
// ----------------------------------------------------------------------------
// El navegador NUNCA habla directo con n8n. El webhook está protegido por un
// token compartido y ese token no puede vivir en el bundle del cliente: quien
// abra el inspector lo leería y podría inundar el buzón de Triage.
//
//   Navegador  →  POST /api/triage           (sin token)
//   Servidor   →  POST $TRIAGE_N8N_URL       header: X-Triage-Token: <secreto>
//
// Config por variables de entorno (ver docs/triage.md):
//   TRIAGE_N8N_URL      URL del webhook de n8n            (REQUERIDA)
//   TRIAGE_FORM_SECRET  mismo valor configurado en n8n    (REQUERIDA)
//
// A diferencia de /api/meta/capi, acá NO hay no-op elegante: si falta la
// config, el endpoint responde 503. Un reporte que se pierde en silencio es
// peor que un error visible — la persona necesita saber que nadie lo recibió.
// ============================================================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  erroresComoLista,
  hayErrores,
  normalizarTriage,
  validarTriage,
  type TriagePayload,
} from "@/app/triage/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const N8N_URL = process.env.TRIAGE_N8N_URL || "";
const FORM_SECRET = process.env.TRIAGE_FORM_SECRET || "";

/** Corta la espera si n8n no responde — el usuario no puede quedar colgado. */
const TIMEOUT_MS = 15_000;

// ── Rate limit en memoria ───────────────────────────────────────────────────
// Defensa mínima contra floods. NO es autenticación: hoy /triage no está
// detrás de un login (ver docs/triage.md, "Pendientes"). Es por instancia y se
// reinicia en cada deploy — suficiente para un formulario interno, insuficiente
// como control de acceso.
const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 5;
const golpes = new Map<string, number[]>();

function superaRateLimit(ip: string): boolean {
  const ahora = Date.now();
  const previos = (golpes.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  previos.push(ahora);
  golpes.set(ip, previos);

  // Poda perezosa para que el Map no crezca sin techo.
  if (golpes.size > 500) {
    for (const [clave, marcas] of golpes) {
      if (marcas.every((t) => ahora - t >= VENTANA_MS)) golpes.delete(clave);
    }
  }

  return previos.length > MAX_POR_VENTANA;
}

function respuestaError(errores: string[], status: number) {
  return NextResponse.json({ ok: false, errores }, { status });
}

export async function POST(request: Request) {
  if (!N8N_URL || !FORM_SECRET) {
    return respuestaError(
      [
        "El formulario todavía no está conectado (falta configurar el webhook). Avísale al equipo técnico.",
      ],
      503,
    );
  }

  const h = await headers();

  // Guard de mismo origen. Los navegadores mandan `Origin` en un POST JSON, así
  // que sirve para descartar envíos desde otro sitio. Si no viene (curl, tests
  // server-side), lo dejamos pasar: no es una frontera de autenticación.
  const origin = h.get("origin");
  if (origin) {
    const host = h.get("host");
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = "";
    }
    if (!host || originHost !== host) {
      return respuestaError(["Origen no permitido."], 403);
    }
  }

  const ip =
    (h.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    (h.get("x-real-ip") ?? "") ||
    "desconocida";

  if (superaRateLimit(ip)) {
    return respuestaError(
      ["Demasiados reportes seguidos. Espera un minuto e inténtalo de nuevo."],
      429,
    );
  }

  let crudo: Partial<TriagePayload>;
  try {
    crudo = (await request.json()) as Partial<TriagePayload>;
  } catch {
    return respuestaError(["No pudimos leer el formulario."], 400);
  }

  // Revalidación server-side. La del navegador es para dar feedback rápido,
  // no es una garantía: se salta con un curl.
  const payload = normalizarTriage(crudo);
  const resultado = validarTriage(payload);
  if (hayErrores(resultado)) {
    return respuestaError(erroresComoLista(resultado), 400);
  }

  // El body va exactamente con el contrato acordado con n8n — ni un campo más.
  const cuerpo: TriagePayload = {
    reportante_nombre: payload.reportante_nombre,
    reportante_email: payload.reportante_email,
    clinica: payload.clinica,
    tipo: payload.tipo,
    titulo: payload.titulo,
    descripcion: payload.descripcion,
    url_captura: payload.url_captura,
  };

  let res: Response;
  try {
    res = await fetch(N8N_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Triage-Token": FORM_SECRET,
      },
      body: JSON.stringify(cuerpo),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    // Timeout o n8n caído. El cliente conserva lo escrito y ofrece reintentar.
    return respuestaError(
      ["No pudimos enviar tu reporte. Revisa tu conexión e inténtalo de nuevo."],
      502,
    );
  }

  const json = (await res.json().catch(() => null)) as
    | Record<string, unknown>
    | null;

  if (!res.ok) {
    // n8n valida de nuevo del otro lado: si devuelve `errores`, los pasamos
    // tal cual para mostrarlos en pantalla.
    const errores = Array.isArray(json?.errores)
      ? (json.errores as unknown[]).map(String)
      : ["No pudimos registrar tu reporte. Inténtalo de nuevo en un momento."];
    return NextResponse.json(
      { ok: false, errores },
      { status: res.status === 400 ? 400 : 502 },
    );
  }

  if (!json) {
    return respuestaError(
      ["Tu reporte se envió pero no pudimos leer la confirmación. Avísale al equipo técnico."],
      502,
    );
  }

  return NextResponse.json(json, { status: 200 });
}
