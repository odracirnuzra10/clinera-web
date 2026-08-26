/**
 * Funciones en desarrollo o recién anunciadas.
 *
 * Superficies:
 * - `blog` / `llms`: se pueden nombrar (agosto 2026: las cinco del post).
 * - `presentacion`: el deck `/presentacion` **no** las nombra. Open Factura
 *   sigue fuera del HTML a propósito — no reabrir esa puerta sin Ricardo.
 *
 * Inventario y liquidaciones de sueldos siguen inéditos (diciembre 2026).
 *
 * Open Factura es emisor de DTE (boletas/facturas Chile → SII), no un ERP.
 */
export type SuperficiePublica = "blog" | "llms" | "presentacion";

export type ProximaFuncion = {
  id: string;
  nombre: string;
  cuando: string;
  donde: "chile" | "clinera";
  publicadoEn: readonly SuperficiePublica[];
  copyInterno: string;
};

export const POST_PROXIMAS_FUNCIONES_SLUG =
  "proximas-funciones-clinera-dte-odontograma-instagram" as const;

export const POST_PROXIMAS_FUNCIONES_PATH =
  `/blog/${POST_PROXIMAS_FUNCIONES_SLUG}` as const;

const BLOG_Y_LLMS = ["blog", "llms"] as const satisfies readonly SuperficiePublica[];

export const PROXIMAS_FUNCIONES = [
  {
    id: "open-factura",
    nombre: "Open Factura",
    cuando: "anunciada agosto 2026",
    donde: "chile",
    publicadoEn: BLOG_Y_LLMS,
    copyInterno:
      "Integración DTE en Chile (https://www.openfactura.cl/): emite boletas y facturas electrónicas desde Clinera; las ventas salen al SII. No es un ERP ni contabilidad: solo emisor de DTE. Se nombra en el blog y en llms*.txt; no en /presentacion.",
  },
  {
    id: "odontograma-presupuestador",
    nombre: "Odontograma y presupuestador",
    cuando: "anunciada agosto 2026",
    donde: "clinera",
    publicadoEn: BLOG_Y_LLMS,
    copyInterno:
      "Odontograma + presupuestador en la ficha de Clinera para clínicas dentales que antes solo tenían ese flujo en Dentalink o Dentalsoft. Detalle clínico: /blog/odontograma-digital-presupuesto-diagnostico-evolucion. No es periodontograma ni ortodoncia a profundidad de Dentalink.",
  },
  {
    id: "instagram-facebook",
    nombre: "Instagram Direct y Facebook Messenger",
    cuando: "anunciada agosto 2026",
    donde: "clinera",
    publicadoEn: BLOG_Y_LLMS,
    copyInterno:
      "Inbox unificado: Instagram Direct y Facebook Messenger entran al mismo lugar que WhatsApp, con IA y la ficha del paciente. No contradice el recorte 1 cuenta = 1 WhatsApp + 1 Instagram + 1 Facebook del deck; es la conexión de Direct/Messenger a esa operación.",
  },
  {
    id: "email-marketing",
    nombre: "Email marketing",
    cuando: "anunciada agosto 2026",
    donde: "clinera",
    publicadoEn: BLOG_Y_LLMS,
    copyInterno:
      "Email marketing configurable desde Clinera para optimizar campañas. No inventar ESP, precios ni volúmenes.",
  },
  {
    id: "trigger-cumpleanos",
    nombre: "Trigger de cumpleaños",
    cuando: "anunciada agosto 2026",
    donde: "clinera",
    publicadoEn: BLOG_Y_LLMS,
    copyInterno:
      "Automatizaciones de saludo y promoción especial por WhatsApp y/o email el día del cumpleaños del paciente.",
  },
  {
    id: "inventario",
    nombre: "Inventario",
    cuando: "diciembre 2026",
    donde: "clinera",
    publicadoEn: [],
    copyInterno:
      "Stock, insumos y recuento. Función de ERP de la clínica, dentro de Clinera — no de Open Factura. Sigue inédita.",
  },
  {
    id: "liquidaciones-sueldos",
    nombre: "Liquidaciones de sueldos",
    cuando: "diciembre 2026",
    donde: "clinera",
    publicadoEn: [],
    copyInterno:
      "Nómina y liquidaciones del equipo. Función de ERP de la clínica, dentro de Clinera — no de Open Factura. Sigue inédita.",
  },
] as const satisfies readonly ProximaFuncion[];

export function publicadaEn(
  funcion: (typeof PROXIMAS_FUNCIONES)[number],
  superficie: SuperficiePublica,
): boolean {
  return (funcion.publicadoEn as readonly SuperficiePublica[]).includes(
    superficie,
  );
}
