// ============================================================================
// Programa partner — solicitud por correo a Ricardo
// ----------------------------------------------------------------------------
// Formulario de /partners#aplicar. El navegador postea acá (sin SMTP en el
// bundle). El servidor manda nombre + celular E.164 al buzón de Ricardo.
//
//   Navegador  →  POST /api/partner-apply
//   Servidor   →  SMTP  (mismas vars que cotizaciones: SMTP_USER / SMTP_PASS)
// ============================================================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { PARTNERS_APPLY_EMAIL } from "@/content/partners-program";
import {
  normalizarPostulacionPartner,
  validarPostulacionPartner,
  type PostulacionPartner,
} from "@/lib/partner-apply";
import { aE164 } from "@/lib/telefono";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIMEOUT_MS = 15_000;
const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 3;
const golpes = new Map<string, number[]>();

function smtpListo(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

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

function respuestaError(errores: string[], status: number) {
  return NextResponse.json({ ok: false, errores }, { status });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
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
      return respuestaError(["Origen no permitido."], 403);
    }
  }

  const ip =
    (h.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    (h.get("x-real-ip") ?? "") ||
    "desconocida";

  if (superaRateLimit(ip)) {
    return respuestaError(
      ["Demasiadas solicitudes seguidas. Espera un minuto e inténtalo de nuevo."],
      429,
    );
  }

  let crudo: Partial<PostulacionPartner>;
  try {
    crudo = (await request.json()) as Partial<PostulacionPartner>;
  } catch {
    return respuestaError(["No pudimos leer el formulario."], 400);
  }

  const payload = normalizarPostulacionPartner(crudo);
  const errores = validarPostulacionPartner(payload);
  if (errores.length) return respuestaError(errores, 400);

  if (!smtpListo()) {
    return respuestaError(
      [
        "El envío todavía no está conectado (falta SMTP). Avísale al equipo técnico.",
      ],
      503,
    );
  }

  const e164 = aE164(payload.prefix, payload.telefono);
  const transporte = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const nombre = escapeHtml(payload.nombre);
  const celular = escapeHtml(e164);
  const prefix = escapeHtml(payload.prefix);

  const mail = {
    from: process.env.COTIZACION_EMAIL_FROM || `Clinera <${process.env.SMTP_USER}>`,
    to: PARTNERS_APPLY_EMAIL,
    subject: `Partner apply — ${payload.nombre} (${e164})`,
    html: `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; color: #111318;">
  <p style="font-size: 13px; color: #656a76; margin: 0 0 16px;">Solicitud al programa partner · clinera.io/partners#aplicar</p>
  <p style="margin: 0 0 8px;"><b>Nombre</b><br>${nombre}</p>
  <p style="margin: 0 0 8px;"><b>Celular (E.164)</b><br>${celular}</p>
  <p style="margin: 0;"><b>Código país</b><br>${prefix}</p>
</div>`,
    text: [
      "Solicitud al programa partner",
      "",
      `Nombre: ${payload.nombre}`,
      `Celular: ${e164}`,
      `Código país: ${payload.prefix}`,
    ].join("\n"),
  };

  try {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        transporte.sendMail(mail),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS);
        }),
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  } catch {
    return respuestaError(
      ["No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo."],
      502,
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
