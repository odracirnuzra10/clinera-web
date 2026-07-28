// Fuente única del costo de configuración inicial (pago único).
// Lo consumen <SetupFeeBand />, las tarjetas de planes de home-v3/planes/planes-pro,
// PlatformPricing (/plataforma) y las calculadoras de consumo.
export const SETUP_FEE_USD = 750;

/** Monto formateado en es-CL, sin símbolo ni moneda: "750". */
export const SETUP_FEE_NUMBER = "750";

/** Monto con símbolo, para el precio de la banda: "$750". */
export const SETUP_FEE_AMOUNT = `$${SETUP_FEE_NUMBER}`;

/** Línea corta para poner debajo del precio de cada plan. */
export const SETUP_FEE_INLINE = `+ USD ${SETUP_FEE_NUMBER} configuración inicial (pago único)`;

export const SETUP_FEE_TITLE = "Costo de configuración: una sola vez";

export const SETUP_FEE_COPY =
  "Migramos fichas clínicas, datos históricos, pacientes y tratamientos, y configuramos tus agentes de IA. Se paga al inicio y no se repite.";
