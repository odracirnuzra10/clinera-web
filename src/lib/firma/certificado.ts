// ============================================================================
// Firma simple — generación del PDF firmado
// ----------------------------------------------------------------------------
// Toma el PDF original + la evidencia de ambas firmas (SobreMeta completo) y
// produce el documento final:
//
//   1. Estampa un pie discreto en cada página original con el folio y la URL
//      de verificación, para que cualquier copia impresa delate su origen.
//   2. Agrega al final una "Hoja de firmas electrónicas" con las dos firmas
//      manuscritas, los datos de cada firmante, los hashes SHA-256 y la
//      declaración de firma electrónica simple (Ley 19.799, Chile).
//
// Las fuentes estándar de PDF usan WinAnsi (Latin-1): todo texto se sanitiza
// antes de dibujar para que un user-agent exótico no reviente la generación.
// ============================================================================

import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { ENTIDAD_LEGAL } from "./firma-ceo";
import type { SobreMeta } from "./tipos";

const A4: [number, number] = [595.28, 841.89];
const MARGEN = 48;

const TINTA = rgb(0.067, 0.075, 0.094); // #111318
const GRIS = rgb(0.396, 0.416, 0.463); // #656a76
const BORDE = rgb(0.89, 0.89, 0.874); // #e3e3df
const VIOLETA = rgb(0.412, 0.255, 0.776); // #6941c6
const PAPEL_SUAVE = rgb(0.973, 0.973, 0.965); // #f8f8f6

/** WinAnsi no cubre todo Unicode: translitera lo común y reemplaza el resto. */
function latin1(texto: string): string {
  return texto
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[—–‒]/g, "-")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
}

function fechaSantiago(iso: string): string {
  const fecha = new Date(iso);
  const dia = new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fecha);
  const hora = new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "shortOffset",
  }).format(fecha);
  return `${dia}, ${hora}`;
}

function partirEnLineas(texto: string, font: PDFFont, tamano: number, anchoMax: number): string[] {
  const palabras = latin1(texto).split(" ");
  const lineas: string[] = [];
  let actual = "";
  for (const palabra of palabras) {
    const candidata = actual ? `${actual} ${palabra}` : palabra;
    if (font.widthOfTextAtSize(candidata, tamano) <= anchoMax) {
      actual = candidata;
    } else {
      if (actual) lineas.push(actual);
      actual = palabra;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

type Fuentes = { regular: PDFFont; negrita: PDFFont; mono: PDFFont };

function dibujarBloqueFirmante(
  pagina: PDFPage,
  fuentes: Fuentes,
  opciones: {
    y: number;
    rol: string;
    filas: Array<[string, string]>;
    notaFirma: string;
    firmaImagen: Awaited<ReturnType<PDFDocument["embedPng"]>> | null;
  },
): number {
  const { y, rol, filas, notaFirma, firmaImagen } = opciones;
  const ancho = A4[0] - MARGEN * 2;
  const alto = 128;

  pagina.drawRectangle({
    x: MARGEN,
    y: y - alto,
    width: ancho,
    height: alto,
    borderColor: BORDE,
    borderWidth: 1,
  });

  // Banda de rol.
  pagina.drawRectangle({
    x: MARGEN,
    y: y - 22,
    width: ancho,
    height: 22,
    color: PAPEL_SUAVE,
  });
  pagina.drawText(latin1(rol.toUpperCase()), {
    x: MARGEN + 12,
    y: y - 15,
    size: 7.5,
    font: fuentes.negrita,
    color: VIOLETA,
  });

  // Columna izquierda: datos del firmante.
  let yFila = y - 38;
  for (const [etiqueta, valor] of filas) {
    pagina.drawText(latin1(etiqueta), {
      x: MARGEN + 12,
      y: yFila,
      size: 7,
      font: fuentes.regular,
      color: GRIS,
    });
    // 60 chars caben antes de la caja de firma de la derecha.
    pagina.drawText(latin1(valor).slice(0, 60), {
      x: MARGEN + 76,
      y: yFila,
      size: 7.5,
      font: etiqueta === "IP" ? fuentes.mono : fuentes.regular,
      color: TINTA,
    });
    yFila -= 14.5;
  }

  // Columna derecha: firma manuscrita.
  const cajaFirmaAncho = 176;
  const cajaFirmaAlto = 72;
  const cajaX = MARGEN + ancho - cajaFirmaAncho - 12;
  const cajaY = y - 34 - cajaFirmaAlto;

  pagina.drawRectangle({
    x: cajaX,
    y: cajaY,
    width: cajaFirmaAncho,
    height: cajaFirmaAlto,
    borderColor: BORDE,
    borderWidth: 0.8,
  });

  if (firmaImagen) {
    const escala = Math.min(
      (cajaFirmaAncho - 12) / firmaImagen.width,
      (cajaFirmaAlto - 10) / firmaImagen.height,
    );
    const anchoImg = firmaImagen.width * escala;
    const altoImg = firmaImagen.height * escala;
    pagina.drawImage(firmaImagen, {
      x: cajaX + (cajaFirmaAncho - anchoImg) / 2,
      y: cajaY + (cajaFirmaAlto - altoImg) / 2,
      width: anchoImg,
      height: altoImg,
    });
  }

  pagina.drawText(latin1(notaFirma), {
    x: cajaX,
    y: cajaY - 11,
    size: 6.2,
    font: fuentes.regular,
    color: GRIS,
  });

  return y - alto - 18;
}

/**
 * Genera el PDF final: original + pie de verificación + hoja de firmas.
 * `meta` debe traer `firmaCliente` (se llama en el momento en que firma el cliente).
 */
export async function generarPdfFirmado(
  originalBytes: Uint8Array,
  meta: SobreMeta,
  urlVerificacion: string,
): Promise<Uint8Array> {
  if (!meta.firmaCliente) {
    throw new Error("El sobre no tiene la firma del cliente.");
  }

  const pdf = await PDFDocument.load(originalBytes);
  const fuentes: Fuentes = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    negrita: await pdf.embedFont(StandardFonts.HelveticaBold),
    mono: await pdf.embedFont(StandardFonts.Courier),
  };

  // 1 — Pie de verificación en cada página original.
  const pie = latin1(
    `Firmado electronicamente · Folio ${meta.id} · Verificacion: ${urlVerificacion}`,
  );
  for (const pagina of pdf.getPages()) {
    pagina.drawText(pie, {
      x: 14,
      y: 8,
      size: 6.2,
      font: fuentes.regular,
      color: GRIS,
      opacity: 0.85,
    });
  }

  // 2 — Hoja de firmas.
  const hoja = pdf.addPage(A4);
  const ancho = A4[0] - MARGEN * 2;
  let y = A4[1] - MARGEN;

  hoja.drawText("CLINERA", {
    x: MARGEN,
    y: y - 12,
    size: 13,
    font: fuentes.negrita,
    color: TINTA,
  });
  hoja.drawText("clinera.io", {
    x: MARGEN + ancho - fuentes.regular.widthOfTextAtSize("clinera.io", 8.5),
    y: y - 11,
    size: 8.5,
    font: fuentes.regular,
    color: GRIS,
  });
  y -= 26;
  hoja.drawRectangle({ x: MARGEN, y, width: ancho, height: 2, color: VIOLETA });
  y -= 34;

  hoja.drawText("Hoja de firmas electrónicas", {
    x: MARGEN,
    y,
    size: 20,
    font: fuentes.negrita,
    color: TINTA,
  });
  y -= 18;
  hoja.drawText(latin1(`Folio ${meta.id}`), {
    x: MARGEN,
    y,
    size: 8.5,
    font: fuentes.mono,
    color: GRIS,
  });
  y -= 30;

  // Bloque documento.
  const infoDoc: Array<[string, string]> = [
    ["Documento", meta.documento.titulo],
    ["Archivo", meta.documento.nombreArchivo],
    [
      "Contenido",
      `${meta.documento.paginas} página${meta.documento.paginas === 1 ? "" : "s"} · ${Math.max(1, Math.round(meta.documento.bytes / 1024))} KB`,
    ],
    ["Creado", fechaSantiago(meta.creadoEn)],
    ...(meta.pagoRealizado
      ? ([["Pago", `Suscripción pagada el ${fechaSantiago(meta.pagoRealizado.pagadoEn)}`]] as Array<
          [string, string]
        >)
      : []),
  ];
  const altoDoc = 30 + infoDoc.length * 15 + 26;
  hoja.drawRectangle({
    x: MARGEN,
    y: y - altoDoc,
    width: ancho,
    height: altoDoc,
    color: PAPEL_SUAVE,
  });
  let yDoc = y - 20;
  for (const [etiqueta, valor] of infoDoc) {
    hoja.drawText(latin1(etiqueta), {
      x: MARGEN + 12,
      y: yDoc,
      size: 7,
      font: fuentes.regular,
      color: GRIS,
    });
    hoja.drawText(latin1(valor).slice(0, 96), {
      x: MARGEN + 76,
      y: yDoc,
      size: 8,
      font: fuentes.regular,
      color: TINTA,
    });
    yDoc -= 15;
  }
  hoja.drawText("SHA-256 original", {
    x: MARGEN + 12,
    y: yDoc,
    size: 7,
    font: fuentes.regular,
    color: GRIS,
  });
  hoja.drawText(meta.documento.sha256, {
    x: MARGEN + 76,
    y: yDoc,
    size: 6.8,
    font: fuentes.mono,
    color: TINTA,
  });
  y = y - altoDoc - 22;

  // Firmas de las partes.
  const firmaCloserImg = await pdf
    .embedPng(meta.closer.firmaPng)
    .catch(() => null);
  const firmaClienteImg = await pdf
    .embedPng(meta.firmaCliente.firmaPng)
    .catch(() => null);

  y = dibujarBloqueFirmante(hoja, fuentes, {
    y,
    rol: "Parte 1 · Clinera — OACG INC",
    filas: [
      ["Nombre", meta.closer.nombre],
      ["Cargo", meta.closer.cargo ?? "Representante legal"],
      ["Email", meta.closer.email],
      ["Fecha y hora", fechaSantiago(meta.closer.firmadoEn)],
      ...(meta.gestor
        ? ([["Gestionado por", `${meta.gestor.nombre} · ${meta.gestor.email}`]] as Array<
            [string, string]
          >)
        : []),
    ],
    notaFirma: "Firma del representante legal de Clinera",
    firmaImagen: firmaCloserImg,
  });

  const rolCliente = meta.cliente.clinica
    ? `Parte 2 · Cliente — ${meta.cliente.clinica}`
    : "Parte 2 · Cliente";
  y = dibujarBloqueFirmante(hoja, fuentes, {
    y,
    rol: rolCliente,
    filas: [
      ["Nombre", meta.firmaCliente.nombre],
      ["Email", meta.firmaCliente.email],
      ...(meta.firmaCliente.rut
        ? ([["RUT", meta.firmaCliente.rut]] as Array<[string, string]>)
        : []),
      ["Fecha y hora", fechaSantiago(meta.firmaCliente.firmadoEn)],
      ["IP", meta.firmaCliente.ip],
      ["Dispositivo", meta.firmaCliente.userAgent],
    ],
    notaFirma: "Firma manuscrita capturada digitalmente",
    firmaImagen: firmaClienteImg,
  });

  // Declaración legal.
  const declaracion =
    "Las partes individualizadas en este documento declaran haber leído íntegramente el documento " +
    "que antecede y manifiestan su consentimiento suscribiéndolo mediante firma electrónica simple, " +
    "conforme a la Ley N° 19.799 de Chile sobre documentos electrónicos, firma electrónica y servicios " +
    "de certificación. La evidencia registrada (identidad declarada, correo electrónico, fecha y hora, " +
    "dirección IP, dispositivo y huella SHA-256 del documento) forma parte integral de esta firma.";
  y -= 4;
  for (const linea of partirEnLineas(declaracion, fuentes.regular, 7.6, ancho)) {
    hoja.drawText(linea, {
      x: MARGEN,
      y,
      size: 7.6,
      font: fuentes.regular,
      color: GRIS,
      lineHeight: 11,
    });
    y -= 11;
  }

  // Pie de verificación de la hoja.
  const piePagina = 64;
  hoja.drawRectangle({
    x: MARGEN,
    y: piePagina + 34,
    width: ancho,
    height: 1,
    color: BORDE,
  });
  hoja.drawText("Verificación", {
    x: MARGEN,
    y: piePagina + 20,
    size: 7,
    font: fuentes.negrita,
    color: TINTA,
  });
  hoja.drawText(
    latin1(
      `Compruebe el estado y la integridad de este documento en ${urlVerificacion}`,
    ),
    {
      x: MARGEN,
      y: piePagina + 8,
      size: 7.4,
      font: fuentes.regular,
      color: GRIS,
    },
  );
  hoja.drawText(latin1(ENTIDAD_LEGAL.linea1), {
    x: MARGEN,
    y: piePagina - 5,
    size: 6.4,
    font: fuentes.regular,
    color: GRIS,
  });
  hoja.drawText(latin1(ENTIDAD_LEGAL.linea2), {
    x: MARGEN,
    y: piePagina - 15,
    size: 6.4,
    font: fuentes.regular,
    color: GRIS,
  });

  pdf.setTitle(latin1(`${meta.documento.titulo} — firmado`), { showInWindowTitleBar: true });
  pdf.setSubject(latin1(`Firma electrónica simple · Folio ${meta.id}`));
  pdf.setProducer("clinera.io/firma");
  pdf.setModificationDate(new Date());

  return pdf.save();
}

/** Valida que el buffer sea un PDF legible y devuelve su número de páginas. */
export async function inspeccionarPdf(bytes: Uint8Array): Promise<{ paginas: number }> {
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
  return { paginas: pdf.getPageCount() };
}
