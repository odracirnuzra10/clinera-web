// Fuente única del costo de configuración inicial (pago único).
// Lo consumen <SetupFeeBand />, las tarjetas de planes de home-v3/planes/planes-pro,
// PlatformPricing (/plataforma) y las calculadoras de consumo.
export const SETUP_FEE_USD = 1500;

/** Monto formateado en es-CL, sin símbolo ni moneda: "1.500". */
export const SETUP_FEE_NUMBER = "1.500";

/** Monto con símbolo, para el precio grande de la banda: "$1.500". */
export const SETUP_FEE_AMOUNT = `$${SETUP_FEE_NUMBER}`;

/** Línea corta para poner debajo del precio de cada plan. */
export const SETUP_FEE_INLINE = `+ USD ${SETUP_FEE_NUMBER} configuración inicial (pago único)`;

export const SETUP_FEE_TITLE = "Costo de configuración: una sola vez";

export const SETUP_FEE_COPY =
  "Dejamos tu clínica operando desde el día uno: migración de fichas clínicas, datos históricos, pacientes y tratamientos, más la configuración y el entrenamiento de tus agentes de IA con tu agenda, tus servicios y tu forma de atender. Es un solo pago al inicio, no se repite.";

export const SETUP_FEE_INCLUDES = [
  "Migración de fichas y datos",
  "Pacientes y tratamientos",
  "Configuración de agentes",
  "Capacitación del equipo",
];
