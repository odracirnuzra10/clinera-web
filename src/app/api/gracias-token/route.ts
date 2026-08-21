// ============================================================================
// /api/gracias-token — emite el token de corta duración que /gracias exige
// para disparar el Pixel. Ver src/app/gracias/token.ts para el porqué y el
// caveat de seguridad (mismo patrón y misma salvedad que /api/triage).
// ============================================================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { emitirToken, secretoConfigurado } from "@/app/gracias/token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 5;
const golpes = new Map<string, number[]>();

function superaRateLimit(ip: string): boolean {
  const ahora = Date.now();
  const previos = (golpes.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  previos.push(ahora);
  golpes.set(ip, previos);

  if (golpes.size > 500) {
    for (const [clave, marcas] of golpes) {
      if (marcas.every((t) => ahora - t >= VENTANA_MS)) golpes.delete(clave);
    }
  }

  return previos.length > MAX_POR_VENTANA;
}

export async function POST(request: Request) {
  if (!secretoConfigurado()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const h = await headers();

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
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  const ip =
    (h.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    (h.get("x-real-ip") ?? "") ||
    "desconocida";
  if (superaRateLimit(ip)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: { event_id?: unknown; source?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const eventId = typeof body.event_id === "string" ? body.event_id.trim() : "";
  const source = typeof body.source === "string" ? body.source.trim() : "";
  if (!eventId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  return NextResponse.json({ ok: true, token: emitirToken(eventId, source) });
}
