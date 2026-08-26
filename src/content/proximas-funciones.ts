/**
 * Funciones que existen o están en desarrollo, pero **no se publican** todavía.
 * El sitio, el deck `/presentacion` y los llms*.txt no deben mencionarlas
 * hasta que `publicado` pase a true — y eso lo decide Ricardo, no el agente.
 *
 * Cuando se anuncie Open Factura: es emisor de DTE (boletas/facturas Chile,
 * sync con el SII), no un ERP. Inventario y liquidaciones de sueldos son de
 * Clinera (diciembre 2026). En el deck, jerarquía visual a Open Factura.
 */
export type ProximaFuncion = {
  id: string;
  nombre: string;
  cuando: string;
  donde: "chile" | "clinera";
  publicado: false;
  porQueNo: string;
  copyInterno: string;
};

export const PROXIMAS_FUNCIONES = [
  {
    id: "open-factura",
    nombre: "Open Factura",
    cuando: "pendiente de anuncio",
    donde: "chile",
    publicado: false,
    porQueNo:
      "Recién desarrollado. No mencionarlo en /presentacion, landings ni llms hasta que Ricardo lo habilite.",
    copyInterno:
      "Integración DTE en Chile (https://www.openfactura.cl/): emite boletas y facturas electrónicas; las ventas de la clínica salen al SII. No es un ERP ni contabilidad: solo emisor de DTE.",
  },
  {
    id: "inventario",
    nombre: "Inventario",
    cuando: "diciembre 2026",
    donde: "clinera",
    publicado: false,
    porQueNo:
      "Aún no opera. No adelantarlo en el deck como si ya estuviera, ni colgarlo de Open Factura.",
    copyInterno:
      "Stock, insumos y recuento. Función de ERP de la clínica, dentro de Clinera — no de Open Factura.",
  },
  {
    id: "liquidaciones-sueldos",
    nombre: "Liquidaciones de sueldos",
    cuando: "diciembre 2026",
    donde: "clinera",
    publicado: false,
    porQueNo:
      "Aún no opera. Mismo recorte que inventario: Clinera, no el emisor de DTE.",
    copyInterno:
      "Nómina y liquidaciones del equipo. Función de ERP de la clínica, dentro de Clinera — no de Open Factura.",
  },
] as const satisfies readonly ProximaFuncion[];
