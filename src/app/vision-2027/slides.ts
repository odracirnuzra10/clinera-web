export const SLIDES = [
  { id: "portada", num: "01", label: "Portada" },
  { id: "donde-estamos", num: "02", label: "Dónde estamos" },
  { id: "para-que", num: "03", label: "Para qué" },
  { id: "tesis", num: "04", label: "La tesis" },
  { id: "capas", num: "05", label: "Por capas" },
  { id: "dos-apps", num: "06", label: "Dos apps" },
  { id: "usuario", num: "07", label: "Un usuario" },
  { id: "alta", num: "08", label: "El alta" },
  { id: "whatsapp", num: "09", label: "WhatsApp" },
  { id: "paciente", num: "10", label: "Qué ve" },
  { id: "notificaciones", num: "11", label: "Avisos" },
  { id: "pagos", num: "12", label: "Pagos" },
  { id: "difusion", num: "13", label: "Difusión" },
  { id: "ficha", num: "14", label: "Su ficha" },
  { id: "circulo", num: "15", label: "El círculo" },
  { id: "reglas", num: "16", label: "Reglas" },
  { id: "orden", num: "17", label: "Orden" },
  { id: "cierre", num: "18", label: "Cierre" },
] as const;

export type SlideId = (typeof SLIDES)[number]["id"];
