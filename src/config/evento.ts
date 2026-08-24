/**
 * Datos del evento — Cena privada de lanzamiento IA · Clinera.io
 *
 * Este archivo es la única fuente de verdad de /lanzamiento y /qr.
 * Edita acá la fecha, el lugar, los cupos o el webhook: los componentes no
 * tienen texto de negocio hardcodeado.
 */

export const evento = {
  marca: "clinera.io",
  sitio: "https://clinera.io",
  ruta: "/lanzamiento",
  urlCanonica: "https://clinera.io/lanzamiento",

  nombre: "Cena de lanzamiento IA",
  edicion: "Lanzamiento Los Ángeles",
  ciudad: "Los Ángeles",
  pais: "Chile",

  fechaISO: "2026-09-11T19:00:00-04:00",
  fechaLarga: "Viernes 11 de septiembre de 2026",
  fechaCorta: "11",
  mesCorto: "SEP",
  diaSemana: "VIERNES",
  anio: "2026",
  hora: "19:00 hrs",
  metadataMono: "VIE 11 SEP · 19:00 HRS · RESTAURANTE CAMINO ANTUCO",

  lugar: {
    nombre: "Restaurante Camino Antuco",
    direccion: "Camino a Antuco, Los Ángeles, Región del Biobío, Chile",
    mapaEmbedSrc:
      "https://www.google.com/maps?q=Restaurante%20Camino%20Antuco%2C%20Los%20Angeles%2C%20Chile&output=embed",
    mapaLink:
      "https://www.google.com/maps/dir/?api=1&destination=Restaurante+Camino+Antuco,+Los+Angeles,+Chile",
  },

  cupos: {
    total: 20,
    restantes: 9,
  },

  webhookUrl: process.env.NEXT_PUBLIC_EVENT_WEBHOOK_URL ?? "",

  confianza: {
    metricas: [
      "+52 clínicas activas",
      "+2.400 citas gestionadas por IA",
      "Partner de Meta, WhatsApp y Stripe",
    ],
  },

  demos: [
    {
      numero: "01",
      titulo: "AURA en vivo",
      descripcion:
        "La IA agendando por WhatsApp en tiempo real frente a ti. Sin video editado, sin guion: conversación real, agenda real.",
      destacada: true,
    },
    {
      numero: "02",
      titulo: "CAMILA",
      descripcion:
        "El agente de voz que llama y agenda por teléfono. Primera demo pública, en vivo y frente a la mesa.",
      destacada: false,
    },
    {
      numero: "03",
      titulo: "Clinera Intelligence",
      descripcion:
        "Pregúntale a tu clínica y responde con tus números y gráficos. Ocupación, rescates, tratamiento más rentable.",
      destacada: false,
    },
    {
      numero: "04",
      titulo: "Lo que viene",
      descripcion:
        "El roadmap que no está publicado en el sitio. Lo mostramos esa noche antes que a nadie más.",
      destacada: true,
    },
  ],

  programa: [
    { hora: "19:00", titulo: "Recepción y cóctel" },
    { hora: "19:45", titulo: "Demo en vivo de las nuevas funciones" },
    { hora: "20:30", titulo: "Cena" },
    {
      hora: "21:30",
      titulo: "Conversación abierta con Ricardo Oyarzún, fundador de Clinera",
    },
    { hora: "22:30", titulo: "Cierre" },
  ],

  audiencia: {
    si: [
      "Diriges o eres dueño de una clínica médica, dental o estética.",
      "Tu operación ya vende y quieres crecer sin romperla.",
    ],
    no: [
      "Buscas una charla masiva de marketing.",
      "El evento es una mesa de 20 personas, no un seminario.",
    ],
  },

  host: {
    nombre: "Ricardo Oyarzún",
    rol: "Fundador de Clinera y dueño de clínica",
    bajada:
      "Construyó el software que primero necesitó en su propia operación.",
    badge: "VISTO EN CNN Y FORBES",
    foto: "/host-ricardo.jpg",
  },

  faq: [
    {
      pregunta: "¿Tiene costo?",
      respuesta: "No. Es por invitación y postulación.",
    },
    {
      pregunta: "¿Puedo llevar acompañante?",
      respuesta:
        "El cupo es individual. Si tu socio o socia también dirige la clínica, que postule aparte.",
    },
    {
      pregunta: "¿Necesito usar Clinera para asistir?",
      respuesta:
        "No. Es para conocer las nuevas funciones antes que nadie.",
    },
    {
      pregunta: "¿Cómo confirmo mi cupo?",
      respuesta:
        "Te escribimos por WhatsApp tras revisar tu postulación.",
    },
  ],

  especialidades: [
    "Médico",
    "Odontólogo",
    "Medicina estética",
    "Dueño/a de clínica",
    "Otro",
  ],

  codigosPais: [
    { codigo: "+56", pais: "Chile" },
    { codigo: "+54", pais: "Argentina" },
    { codigo: "+51", pais: "Perú" },
    { codigo: "+57", pais: "Colombia" },
    { codigo: "+52", pais: "México" },
    { codigo: "+593", pais: "Ecuador" },
    { codigo: "+598", pais: "Uruguay" },
    { codigo: "+595", pais: "Paraguay" },
    { codigo: "+591", pais: "Bolivia" },
    { codigo: "+1", pais: "EE. UU." },
    { codigo: "+34", pais: "España" },
  ],

  legal: {
    razonSocial: "Clinera SpA",
    grupo: "OACG Group",
    terminos: "https://clinera.io/terminos",
    privacidad: "https://clinera.io/privacidad",
  },
} as const;

export type Evento = typeof evento;
