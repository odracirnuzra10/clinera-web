// ============================================================================
// Correo automático de la cotización al lead
// ----------------------------------------------------------------------------
// Al crear el link de pago desde /cotizacion, si el closer indicó el email
// del cliente, el servidor envía la cotización de inmediato: PDF adjunto +
// botón "Ver y pagar". El Reply-To apunta al gestor, así las respuestas del
// lead llegan directo al closer.
//
// Transporte: SMTP (pensado para Google Workspace con app password).
// Config (ver docs/firma.md):
//   SMTP_USER              cuenta que envía, ej. cotizaciones@oacg.cl
//   SMTP_PASS              app password de esa cuenta
//   SMTP_HOST              opcional, default smtp.gmail.com
//   SMTP_PORT              opcional, default 465
//   COTIZACION_EMAIL_FROM  opcional, remitente visible; default "Clinera <SMTP_USER>"
//
// Sin configuración el envío se omite en silencio hacia el cliente final:
// la respuesta del API informa al closer para que envíe manual.
// ============================================================================

import nodemailer from "nodemailer";
import type { SobreMeta } from "./tipos";

export function correoConfigurado(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

const usd = (centavos: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(centavos / 100);

/** Envía la cotización al lead. Lanza si el transporte falla. */
export async function enviarCotizacionAlLead(
  meta: SobreMeta,
  pdf: Buffer,
  urls: { enLinea: string },
): Promise<void> {
  const cotizacion = meta.cotizacion;
  const email = meta.cliente.email;
  if (!cotizacion || !email) throw new Error("Falta cotización o email del cliente.");

  const transporte = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const totalPeriodo = cotizacion.centavos.recurrenteFinal + cotizacion.centavos.setupFinal;
  const periodo = cotizacion.periodoMeses === 6 ? "semestral" : "mensual";
  const gestor = meta.gestor;
  const primerNombre = meta.cliente.nombre.split(" ")[0] || "Hola";

  const html = `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #111318;">
  <div style="padding: 28px 0 18px; border-bottom: 2px solid #6941c6;">
    <strong style="font-size: 18px; letter-spacing: 0.02em;">CLINERA</strong>
    <span style="float: right; color: #656a76; font-size: 12px; padding-top: 5px;">clinera.io</span>
  </div>
  <div style="padding: 26px 0;">
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 14px;">Hola ${primerNombre},</p>
    <p style="font-size: 14px; line-height: 1.65; color: #3d4250; margin: 0 0 18px;">
      Te compartimos la <b>cotización ${cotizacion.numero}</b> de Clinera
      (plan ${cotizacion.planNombre}, suscripción ${periodo}). Va adjunta en PDF y también
      puedes revisarla y aceptarla en línea:
    </p>
    <table cellpadding="0" cellspacing="0" style="margin: 0 0 18px;"><tr>
      <td style="background: #6941c6; border-radius: 8px;">
        <a href="${urls.enLinea}" style="display: inline-block; padding: 12px 26px; color: #ffffff; font-size: 14px; font-weight: bold; text-decoration: none;">Ver cotización y pagar</a>
      </td>
    </tr></table>
    <p style="font-size: 13px; line-height: 1.6; color: #656a76; margin: 0 0 6px;">
      Total ${periodo}: <b style="color:#111318;">${usd(totalPeriodo)}</b> · Pago seguro con Stripe.
    </p>
    <p style="font-size: 13px; line-height: 1.6; color: #656a76; margin: 0;">
      Tras el pago recibirás el contrato para firma electrónica en el mismo enlace.
    </p>
  </div>
  <div style="border-top: 1px solid #e3e3df; padding: 16px 0; font-size: 12px; color: #656a76; line-height: 1.6;">
    ${gestor ? `Cualquier duda, responde este correo y te contesta ${gestor.nombre} directamente.<br>` : ""}
    Clinera · Software de IA para clínicas · <a href="https://www.clinera.io" style="color: #6941c6;">www.clinera.io</a>
  </div>
</div>`;

  await transporte.sendMail({
    from: process.env.COTIZACION_EMAIL_FROM || `Clinera <${process.env.SMTP_USER}>`,
    to: email,
    ...(gestor ? { replyTo: `${gestor.nombre} <${gestor.email}>`, cc: gestor.email } : {}),
    subject: `Cotización ${cotizacion.numero} — Clinera`,
    html,
    text: [
      `Hola ${primerNombre},`,
      "",
      `Te compartimos la cotización ${cotizacion.numero} de Clinera (plan ${cotizacion.planNombre}, suscripción ${periodo}). Va adjunta en PDF.`,
      "",
      `Revísala y acéptala en línea: ${urls.enLinea}`,
      `Total ${periodo}: ${usd(totalPeriodo)} · Pago seguro con Stripe.`,
      "",
      "Tras el pago recibirás el contrato para firma electrónica en el mismo enlace.",
    ].join("\n"),
    attachments: [
      {
        filename: meta.documento?.nombreArchivo ?? "cotizacion.pdf",
        content: pdf,
        contentType: "application/pdf",
      },
    ],
  });
}
