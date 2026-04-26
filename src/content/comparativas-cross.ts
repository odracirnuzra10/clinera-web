// Pilar B.3 — Comparativas cruzadas (sección 3.x del plan SEO).
// Capturan tráfico de búsquedas tipo "AgendaPro vs Reservo": el usuario YA está
// comparando entre dos competidores; entramos como tercera opción.

export type CrossCell = "yes" | "no" | "partial";

export type CrossRow = {
  feature: string;
  A: CrossCell | string;
  B: CrossCell | string;
  clinera: CrossCell | string;
};

export type CrossDimension = {
  title: string;
  body: string;
};

export type Cruzada = {
  slug: string;
  competitorA: { key: "agendapro" | "reservo" | "medilink" | "doctocliq"; name: string; siteLabel: string };
  competitorB: { key: "agendapro" | "reservo" | "medilink" | "doctocliq"; name: string; siteLabel: string };
  title: string;
  description: string;
  h1: string;
  intro: string;
  tldr: { A: string; B: string; clinera: string };
  table: CrossRow[];
  dimensions: CrossDimension[];
  faqs: { q: string; a: string }[];
  publishedAt: string;
  updatedAt?: string;
};

const COMPETITORS = {
  agendapro: { key: "agendapro" as const, name: "AgendaPro", siteLabel: "agendapro.com" },
  reservo: { key: "reservo" as const, name: "Reservo", siteLabel: "reservo.cl" },
  medilink: { key: "medilink" as const, name: "Medilink", siteLabel: "medilink.cl" },
  doctocliq: { key: "doctocliq" as const, name: "Doctocliq", siteLabel: "doctocliq.com" },
};

// Filas comunes de la tabla — solo varían los cell-values entre cruzadas.
// Todas las cruzadas comparten el patrón: A | B | Clinera (3 columnas).

export const cruzadas: Record<string, Cruzada> = {
  // ============================================================
  // 1. AgendaPro vs Reservo
  // ============================================================
  "agendapro-vs-reservo": {
    slug: "agendapro-vs-reservo",
    competitorA: COMPETITORS.agendapro,
    competitorB: COMPETITORS.reservo,
    title: "AgendaPro vs Reservo 2026: comparativa completa (+ alternativa con IA)",
    description:
      "AgendaPro y Reservo comparados feature por feature: agenda, ficha clínica, WhatsApp, integraciones, precio. Más una tercera alternativa con IA conversacional para tu clínica.",
    h1: "AgendaPro vs Reservo 2026: ¿cuál conviene a tu clínica?",
    intro:
      "AgendaPro tiene escala regional con 20.000+ negocios en LATAM y atiende múltiples verticales (salud, spa, gym). Reservo es chileno, enfocado en clínicas médicas, con 500+ clínicas activas. Ambos resuelven agenda + cobros, pero ninguno tiene IA conversacional en producción para responder WhatsApp 24/7. Si ese es tu cuello de botella, evaluá Clinera como tercera opción.",
    tldr: {
      A: "AgendaPro es mejor si tienes negocio multi-vertical (no sólo clínica) y quieres una marca consolidada en toda LATAM con muchas integraciones de pagos.",
      B: "Reservo es mejor si tu prioridad es ficha clínica madura (odontograma, plantillas por especialidad) y facturación electrónica DTE en Chile.",
      clinera:
        "Clinera es mejor si tu cuello de botella son los WhatsApps sin responder. AURA atiende, agenda y confirma 24/7 con IA conversacional, y se integra con tu agenda actual.",
    },
    table: [
      { feature: "IA conversacional WhatsApp en producción", A: "no", B: "no", clinera: "yes" },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", A: "no", B: "no", clinera: "yes" },
      { feature: "Atención 24/7 sin recepción humana", A: "no", B: "no", clinera: "yes" },
      { feature: "Difusiones masivas WhatsApp marketing", A: "partial", B: "partial", clinera: "yes" },
      { feature: "Integración MCP / API abierta para IA", A: "no", B: "no", clinera: "yes" },
      { feature: "Atribución de ventas a campañas (Meta/Google)", A: "partial", B: "no", clinera: "yes" },
      { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Reserva online 24/7", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Ficha clínica digital", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Odontograma dental nativo", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Consentimientos informados", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Facturación electrónica DTE Chile", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Pagos online integrados", A: "yes", B: "yes", clinera: "yes" },
      { feature: "App móvil nativa", A: "yes", B: "no", clinera: "yes" },
      { feature: "Precios públicos en web", A: "yes", B: "no", clinera: "yes" },
      { feature: "Sin permanencia", A: "no", B: "partial", clinera: "yes" },
      { feature: "Plan inicial USD/mes", A: "$19/usuario", B: "consultar", clinera: "$89 (3 usuarios)" },
    ],
    dimensions: [
      {
        title: "Origen, escala y foco",
        body:
          "AgendaPro nació en 2014 en Chile y hoy opera en 9 países de LATAM con más de 20.000 negocios. Su foco es horizontal: sirve a clínicas, spas, gimnasios y centros estéticos por igual. Reservo es chileno, fundado más recientemente, con foco vertical en clínicas médicas (500+ activas) y un módulo de ficha clínica históricamente más maduro que el de AgendaPro.",
      },
      {
        title: "Agenda y reserva online",
        body:
          "Ambos tienen agenda multi-profesional, reserva online 24/7, multi-sede y bloqueos de horarios. AgendaPro suma una app móvil nativa con buena UX para que el equipo gestione la agenda desde el celular. Reservo no tiene app nativa pero su web responsive es sólida en escritorio.",
      },
      {
        title: "Ficha clínica",
        body:
          "Ventaja Reservo: plantillas por especialidad, odontograma dental nativo, consentimientos informados con firma digital. AgendaPro cubre lo básico de ficha clínica pero el flujo completo es más liviano que el de Reservo, especialmente para verticales muy específicas (dental, medicina estética).",
      },
      {
        title: "WhatsApp e IA — donde gana Clinera",
        body:
          "Esta es la dimensión que ninguno de los dos cubre bien. AgendaPro y Reservo tratan WhatsApp como un canal de envío manual (recordatorios, confirmaciones simples) o como integración para que TÚ escribas los mensajes. Ninguno tiene un agente IA que responda al paciente, agende solo y derive a humano sólo cuando hace falta. Clinera, con AURA, atiende 24/7 desde el WhatsApp Business de tu clínica con memoria contextual y derivación a humano automática.",
      },
      {
        title: "Precio y transparencia",
        body:
          "AgendaPro publica USD 19/usuario/mes (te puede subir rápido si tienes 5+ profesionales). Reservo no publica precios — atiende por formulario o teléfono. Clinera tiene Growth USD 89/mes (3 usuarios incluidos), Conect USD 129/mes y Advanced USD 179/mes, todos sin permanencia.",
      },
    ],
    faqs: [
      {
        q: "¿AgendaPro o Reservo es más caro?",
        a: "AgendaPro publica USD 19/usuario/mes — para una clínica de 4 profesionales son USD 76/mes solo en agenda. Reservo no publica precios pero suele cotizarse en el rango de USD 60-120/mes para clínicas pequeñas-medianas en Chile. Ambos cobran extras por SMS, recordatorios y módulos avanzados.",
      },
      {
        q: "¿Cuál soporta multi-sede?",
        a: "Los dos. AgendaPro tiene panel multi-sede consolidado y Reservo permite gestionar varias sedes con permisos por sucursal. Clinera también soporta multi-sede en todos los planes.",
      },
      {
        q: "¿Puedo migrar de AgendaPro a Reservo (o viceversa) sin perder datos?",
        a: "En teoría sí: ambos exportan pacientes, agenda histórica y fichas a CSV o vía API. La migración manual de notas de evolución suele ser la parte más delicada y puede tomar 1-2 semanas con acompañamiento del proveedor receptor.",
      },
      {
        q: "¿Hay alternativas con IA conversacional?",
        a: "Sí: Clinera (con AURA) responde, agenda y confirma pacientes 24/7 desde tu WhatsApp Business, con memoria contextual entre conversaciones e integración MCP. Es la única opción de las tres con IA en producción para clínicas en LATAM.",
      },
      {
        q: "¿Tengo que elegir solo uno?",
        a: "No necesariamente. Clinera puede convivir con AgendaPro o Reservo: vos mantenés tu agenda donde está y AURA opera el canal WhatsApp + analítica de marketing por encima vía API. Es la decisión típica de clínicas que ya invirtieron mucho tiempo en su sistema actual.",
      },
    ],
    publishedAt: "2026-04-25",
  },

  // ============================================================
  // 2. AgendaPro vs Medilink
  // ============================================================
  "agendapro-vs-medilink": {
    slug: "agendapro-vs-medilink",
    competitorA: COMPETITORS.agendapro,
    competitorB: COMPETITORS.medilink,
    title: "AgendaPro vs Medilink 2026: comparativa (+ alternativa con WhatsApp IA)",
    description:
      "AgendaPro vs Medilink: agenda multi-vertical vs Contact Center IA por voz para clínicas. Más una tercera opción que opera por WhatsApp 24/7 con IA conversacional.",
    h1: "AgendaPro vs Medilink 2026: ¿cuál conviene a tu clínica?",
    intro:
      "AgendaPro es la solución de agenda más usada en LATAM (20.000+ negocios, multi-vertical). Medilink es chileno y tiene IA pero por canal de voz (Contact Center). Si tu paciente prefiere WhatsApp antes que llamada, ninguno cubre eso bien — Clinera es la tercera opción.",
    tldr: {
      A: "AgendaPro es mejor si querés escala regional, app móvil sólida y precios por usuario claros, sin foco IA.",
      B: "Medilink es mejor si tu cuello de botella son las llamadas perdidas y querés un Contact Center IA por voz integrado a tu agenda.",
      clinera:
        "Clinera es mejor si tus pacientes hablan por WhatsApp (no llaman). AURA atiende, agenda y confirma 24/7 desde tu WhatsApp Business.",
    },
    table: [
      { feature: "IA conversacional WhatsApp en producción", A: "no", B: "no", clinera: "yes" },
      { feature: "IA por canal de voz (llamadas)", A: "no", B: "yes", clinera: "no" },
      { feature: "Coexistencia con WhatsApp Business", A: "no", B: "partial", clinera: "yes" },
      { feature: "Atención 24/7 sin recepción humana", A: "no", B: "yes", clinera: "yes" },
      { feature: "Memoria contextual entre conversaciones", A: "no", B: "partial", clinera: "yes" },
      { feature: "Integración MCP / API para IA", A: "no", B: "no", clinera: "yes" },
      { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Reserva online 24/7", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Ficha clínica digital", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Odontograma dental nativo", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Pagos online integrados", A: "yes", B: "partial", clinera: "yes" },
      { feature: "App móvil nativa", A: "yes", B: "partial", clinera: "yes" },
      { feature: "Atribución de ventas a campañas", A: "partial", B: "no", clinera: "yes" },
      { feature: "Difusiones masivas WhatsApp", A: "partial", B: "partial", clinera: "yes" },
      { feature: "Precios públicos en web", A: "yes", B: "no", clinera: "yes" },
      { feature: "Setup en menos de 1 hora", A: "yes", B: "no", clinera: "yes" },
      { feature: "Plan inicial USD/mes", A: "$19/usuario", B: "consultar", clinera: "$89 (3 usuarios)" },
    ],
    dimensions: [
      {
        title: "Estrategia de canal: voz vs chat",
        body:
          "Medilink apostó por IA en el canal de voz: tiene un Contact Center que recibe llamadas, agenda y deriva. Es buena opción si tu clínica recibe muchas llamadas que no logra contestar. AgendaPro no tiene IA y trata WhatsApp como canal manual. Clinera apostó por IA en WhatsApp porque, en estética y medicina ambulatoria en LATAM, el canal dominante hoy es chat — no llamada. La elección depende de cómo se comunica tu paciente.",
      },
      {
        title: "Foco vertical",
        body:
          "AgendaPro es horizontal (clínica + spa + gym + estética + barbería). Medilink es 100% clínico, con foco en clínicas médicas chilenas. Clinera es 100% clínico también (médica + estética). Si tienes negocio mixto, AgendaPro encaja; si es solo clínica, Medilink y Clinera son más específicos.",
      },
      {
        title: "Ficha clínica",
        body:
          "Medilink tiene ficha clínica robusta, plantillas por especialidad y telemedicina integrada. AgendaPro tiene ficha clínica liviana, suficiente para clínicas estéticas pero corta para especialidades muy técnicas (dental complejo, neurología, etc).",
      },
      {
        title: "Precio y transparencia",
        body:
          "AgendaPro publica USD 19/usuario/mes. Medilink no publica precios — atiende por demo/cotización. Clinera publica Growth USD 89/mes, Conect USD 129, Advanced USD 179, todos sin permanencia y con devolución 100% en los primeros 7 días.",
      },
    ],
    faqs: [
      {
        q: "¿Medilink es mejor que AgendaPro para una clínica médica?",
        a: "Medilink suele ser mejor si tu volumen alto es de llamadas telefónicas y querés que IA las conteste. AgendaPro es mejor si tu prioridad es agenda + cobros + multi-vertical y no necesitas IA. Para WhatsApp con IA, ninguno — ahí Clinera tiene ventaja.",
      },
      {
        q: "¿Cuál tiene mejor app móvil?",
        a: "AgendaPro tiene la app móvil más pulida de los tres (iOS + Android). Medilink tiene web responsive sólida pero app más limitada. Clinera tiene app móvil nativa y panel web completo.",
      },
      {
        q: "¿Cuál es más caro?",
        a: "Depende del tamaño. AgendaPro es USD 19/usuario, así que para 5 profesionales son USD 95/mes. Medilink suele cotizarse en USD 100-200/mes para clínicas pequeñas-medianas. Clinera Growth son USD 89/mes con 3 usuarios incluidos.",
      },
      {
        q: "¿Hay alternativas con IA conversacional WhatsApp 24/7?",
        a: "Clinera es la única de las tres con IA conversacional WhatsApp en producción (con AURA, basada en LangChain + MCP, memoria contextual y derivación automática a humano).",
      },
      {
        q: "¿Puedo combinar Medilink (voz) con WhatsApp IA?",
        a: "Sí. Clinera puede operar el canal WhatsApp encima de Medilink vía API/MCP. Tus llamadas siguen entrando a Medilink y los chats van a AURA. Es una arquitectura común en clínicas que recién están migrando hacia IA.",
      },
    ],
    publishedAt: "2026-04-25",
  },

  // ============================================================
  // 3. Reservo vs Medilink
  // ============================================================
  "reservo-vs-medilink": {
    slug: "reservo-vs-medilink",
    competitorA: COMPETITORS.reservo,
    competitorB: COMPETITORS.medilink,
    title: "Reservo vs Medilink 2026: comparativa para clínicas chilenas (+ alternativa IA)",
    description:
      "Reservo vs Medilink: ficha clínica robusta vs Contact Center IA por voz. Más una alternativa con IA WhatsApp 24/7 que se integra con tu agenda actual.",
    h1: "Reservo vs Medilink 2026: ¿cuál conviene a tu clínica chilena?",
    intro:
      "Ambos son chilenos, los dos tienen ficha clínica madura y los dos están enfocados 100% en clínicas médicas. La diferencia está en IA: Reservo no tiene, Medilink tiene IA por canal de voz. Si tus pacientes prefieren WhatsApp, evaluá Clinera como tercera opción.",
    tldr: {
      A: "Reservo es mejor si tu prioridad absoluta es ficha clínica madura, odontograma, DTE, y no necesitas IA conversacional.",
      B: "Medilink es mejor si te pierdes muchas llamadas y querés un Contact Center IA que las atienda 24/7.",
      clinera:
        "Clinera es mejor si tu canal principal es WhatsApp y querés IA que responda, agende y derive a humano sin recepción humana detrás.",
    },
    table: [
      { feature: "IA conversacional WhatsApp en producción", A: "no", B: "no", clinera: "yes" },
      { feature: "IA por canal de voz", A: "no", B: "yes", clinera: "no" },
      { feature: "Coexistencia WhatsApp Business", A: "no", B: "partial", clinera: "yes" },
      { feature: "Atención 24/7 sin recepción humana", A: "no", B: "yes", clinera: "yes" },
      { feature: "Memoria contextual IA", A: "no", B: "partial", clinera: "yes" },
      { feature: "Integración MCP / API para IA", A: "no", B: "no", clinera: "yes" },
      { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Reserva online 24/7", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Ficha clínica digital madura", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Odontograma dental nativo", A: "yes", B: "yes", clinera: "partial" },
      { feature: "Telemedicina integrada", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Facturación electrónica DTE Chile", A: "yes", B: "yes", clinera: "partial" },
      { feature: "Atribución de ventas a campañas", A: "no", B: "no", clinera: "yes" },
      { feature: "Difusiones masivas WhatsApp", A: "partial", B: "partial", clinera: "yes" },
      { feature: "App móvil nativa", A: "no", B: "partial", clinera: "yes" },
      { feature: "Precios públicos en web", A: "no", B: "no", clinera: "yes" },
      { feature: "Plan inicial USD/mes", A: "consultar", B: "consultar", clinera: "$89 (3 usuarios)" },
    ],
    dimensions: [
      {
        title: "Foco y trayectoria en Chile",
        body:
          "Los dos son fuertes en Chile y tienen reputación sólida. Reservo es referente histórico en agenda + ficha (500+ clínicas, +1M citas históricas). Medilink se posicionó más recientemente con su Contact Center IA por voz. Ambos tienen soporte local en Chile.",
      },
      {
        title: "Estrategia IA",
        body:
          "Reservo no tiene IA conversacional en producción. Medilink sí, pero por canal de voz (llamadas). Si tu paciente promedio prefiere chat, ninguno te resuelve el problema; Clinera, con AURA, opera 24/7 sobre WhatsApp Business.",
      },
      {
        title: "Ficha clínica",
        body:
          "Empate técnico. Los dos tienen ficha madura, plantillas por especialidad, odontograma dental, consentimientos informados con firma digital. Para clínicas que priorizan la capa clínica sobre la operativa, cualquiera de los dos resuelve.",
      },
      {
        title: "WhatsApp",
        body:
          "Ambos tratan WhatsApp como canal complementario: envío manual de recordatorios, confirmaciones simples. Ninguno tiene un agente IA que mantenga conversaciones reales con pacientes y agende sin intervención humana. Esa es la categoría donde Clinera juega solo entre los chilenos.",
      },
      {
        title: "Precio",
        body:
          "Ni Reservo ni Medilink publican precios — atienden por cotización. Clinera tiene Growth USD 89/mes, Conect USD 129, Advanced USD 179, todos sin permanencia.",
      },
    ],
    faqs: [
      {
        q: "¿Reservo o Medilink tiene mejor ficha clínica?",
        a: "Empate técnico. Reservo tiene más años de iteración en plantillas por especialidad y odontograma dental. Medilink tiene un flujo más moderno con telemedicina integrada. La elección depende del peso que le des a la antigüedad vs la modernidad de la UX.",
      },
      {
        q: "¿Cuál soporta DTE / facturación electrónica chilena?",
        a: "Los dos tienen DTE integrado para clínicas chilenas. Reservo tiene módulo financiero más detallado (comisiones por profesional, reportes contables). Medilink cumple lo básico de DTE.",
      },
      {
        q: "¿Cuál atiende llamadas 24/7?",
        a: "Medilink tiene Contact Center IA por voz que atiende llamadas fuera de horario. Reservo no — depende de tu recepción humana o de un servicio externo.",
      },
      {
        q: "¿Hay alternativa con WhatsApp IA en Chile?",
        a: "Clinera. Es chilena (OACG SpA), opera con IA conversacional WhatsApp 24/7 (AURA, basada en LangChain + MCP), tiene atribución de ventas a campañas Meta/Google, y publica precios desde USD 89/mes.",
      },
      {
        q: "¿Puedo usar Clinera sin migrar de Reservo o Medilink?",
        a: "Sí. Clinera se integra vía API y MCP con Reservo, Medilink y otros. AURA opera el canal WhatsApp por encima y sincroniza la agenda con tu sistema actual. Es la decisión común de clínicas que ya tienen mucha data en su software.",
      },
    ],
    publishedAt: "2026-04-25",
  },

  // ============================================================
  // 4. AgendaPro vs Doctocliq
  // ============================================================
  "agendapro-vs-doctocliq": {
    slug: "agendapro-vs-doctocliq",
    competitorA: COMPETITORS.agendapro,
    competitorB: COMPETITORS.doctocliq,
    title: "AgendaPro vs Doctocliq 2026: comparativa para clínicas (+ alternativa con IA)",
    description:
      "AgendaPro vs Doctocliq: agenda LATAM multi-vertical vs telemedicina + agenda mexicana. Más una alternativa con IA conversacional WhatsApp 24/7.",
    h1: "AgendaPro vs Doctocliq 2026: ¿cuál conviene a tu clínica?",
    intro:
      "AgendaPro es la opción de agenda más usada en LATAM con 20.000+ negocios y foco multi-vertical. Doctocliq es mexicana, especializada en telemedicina + agenda con foco en consulta médica. Ninguno tiene IA conversacional en producción para responder pacientes por WhatsApp 24/7 — ahí entra Clinera como tercera opción.",
    tldr: {
      A: "AgendaPro es mejor si querés agenda multi-vertical (clínica + spa + gym), app móvil pulida y escala regional consolidada.",
      B: "Doctocliq es mejor si tu volumen alto es telemedicina y necesitás un flujo de videoconsulta integrado a la agenda.",
      clinera:
        "Clinera es mejor si tu canal de captación principal es WhatsApp y querés IA que atienda, agende y derive 24/7.",
    },
    table: [
      { feature: "IA conversacional WhatsApp en producción", A: "no", B: "no", clinera: "yes" },
      { feature: "Telemedicina / videoconsulta integrada", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Coexistencia WhatsApp Business", A: "no", B: "no", clinera: "yes" },
      { feature: "Atención 24/7 sin recepción humana", A: "no", B: "no", clinera: "yes" },
      { feature: "Integración MCP / API para IA", A: "no", B: "no", clinera: "yes" },
      { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Reserva online 24/7", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Ficha clínica digital", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Receta médica electrónica", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Pagos online integrados", A: "yes", B: "yes", clinera: "yes" },
      { feature: "App móvil nativa", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Atribución de ventas a campañas", A: "partial", B: "no", clinera: "yes" },
      { feature: "Difusiones masivas WhatsApp", A: "partial", B: "no", clinera: "yes" },
      { feature: "Precios públicos en web", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Cobertura LATAM", A: "yes", B: "partial", clinera: "yes" },
      { feature: "Sin permanencia", A: "no", B: "partial", clinera: "yes" },
      { feature: "Plan inicial USD/mes", A: "$19/usuario", B: "$25/profesional", clinera: "$89 (3 usuarios)" },
    ],
    dimensions: [
      {
        title: "Origen y cobertura",
        body:
          "AgendaPro nació en Chile (2014) y opera en 9 países LATAM. Doctocliq es mexicana, fuerte en México y con presencia creciente en otros países hispanohablantes. Si tu clínica está en CL/PE/CO, AgendaPro tiene más casos locales; si estás en MX, Doctocliq tiene ventaja territorial.",
      },
      {
        title: "Telemedicina",
        body:
          "Doctocliq nació pensando en consulta médica y tiene videoconsulta integrada como funcionalidad central, con receta médica electrónica y firma digital. AgendaPro cubre telemedicina como módulo opcional pero no es su foco. Para una clínica 100% telemedicina, Doctocliq encaja mejor.",
      },
      {
        title: "Multi-vertical vs especialización médica",
        body:
          "AgendaPro sirve por igual a clínicas, spas, gym, barberías y centros estéticos. Doctocliq es 100% médico. Si tienes operación mixta o querés un único proveedor para varios negocios, AgendaPro encaja; si es solo clínica médica, Doctocliq y Clinera son más específicos.",
      },
      {
        title: "WhatsApp e IA — donde gana Clinera",
        body:
          "Ninguno de los dos tiene IA conversacional en producción para WhatsApp. AgendaPro permite enviar mensajes manuales y recordatorios automáticos básicos. Doctocliq tiene confirmaciones automáticas pero no IA que mantenga conversaciones reales. Clinera, con AURA, atiende, agenda y deriva 24/7 con memoria contextual entre conversaciones.",
      },
      {
        title: "Precio",
        body:
          "AgendaPro USD 19/usuario/mes (escala con el equipo). Doctocliq desde USD 25/profesional/mes. Clinera Growth USD 89/mes con 3 usuarios incluidos, Conect USD 129, Advanced USD 179 — todos sin permanencia.",
      },
    ],
    faqs: [
      {
        q: "¿AgendaPro o Doctocliq es mejor para telemedicina?",
        a: "Doctocliq tiene mejor flujo nativo de videoconsulta + receta médica electrónica integrada. AgendaPro la cubre como módulo pero no es su foco principal.",
      },
      {
        q: "¿Cuál tiene mejor cobertura en México?",
        a: "Doctocliq es mexicana y tiene mayor base instalada en MX. AgendaPro también opera en México pero su base más grande está en Chile, Colombia y Perú.",
      },
      {
        q: "¿Cuál es más caro?",
        a: "Depende del tamaño del equipo. AgendaPro es USD 19/usuario, Doctocliq desde USD 25/profesional. Para una clínica de 4 personas: AgendaPro ~USD 76, Doctocliq ~USD 100. Clinera Growth USD 89 fijo con 3 usuarios.",
      },
      {
        q: "¿Hay opción con IA conversacional WhatsApp?",
        a: "Sí: Clinera. Es la única de las tres opciones con AURA, agente IA en producción que atiende WhatsApp 24/7 con memoria contextual e integración MCP.",
      },
      {
        q: "¿Puedo combinar AgendaPro o Doctocliq con Clinera?",
        a: "Sí. Clinera se integra vía API/MCP con ambos. Mantenés tu agenda donde está y AURA opera el canal WhatsApp + analítica de campañas por encima. No hay que migrar para empezar.",
      },
    ],
    publishedAt: "2026-04-25",
  },

  // ============================================================
  // 5. Reservo vs Doctocliq
  // ============================================================
  "reservo-vs-doctocliq": {
    slug: "reservo-vs-doctocliq",
    competitorA: COMPETITORS.reservo,
    competitorB: COMPETITORS.doctocliq,
    title: "Reservo vs Doctocliq 2026: comparativa para clínicas (+ alternativa con IA)",
    description:
      "Reservo (Chile) vs Doctocliq (México): ambos enfocados en clínicas médicas. Comparativa de ficha clínica, telemedicina, precio. Más alternativa con IA WhatsApp.",
    h1: "Reservo vs Doctocliq 2026: ¿cuál conviene a tu clínica?",
    intro:
      "Reservo es chileno, fuerte en agenda + ficha clínica + DTE local (500+ clínicas). Doctocliq es mexicano, fuerte en telemedicina + receta médica electrónica. Ambos son 100% médicos. Si querés agregar IA conversacional WhatsApp, Clinera es la tercera opción.",
    tldr: {
      A: "Reservo es mejor si tu clínica está en Chile y necesitás DTE + ficha clínica madura + odontograma dental.",
      B: "Doctocliq es mejor si tu clínica está en México o tu volumen alto es telemedicina con receta médica electrónica.",
      clinera:
        "Clinera es mejor si querés WhatsApp con IA conversacional 24/7 y atribución real de ventas a tus campañas Meta/Google.",
    },
    table: [
      { feature: "IA conversacional WhatsApp en producción", A: "no", B: "no", clinera: "yes" },
      { feature: "Coexistencia WhatsApp Business", A: "no", B: "no", clinera: "yes" },
      { feature: "Atención 24/7 sin recepción humana", A: "no", B: "no", clinera: "yes" },
      { feature: "Telemedicina integrada", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Receta médica electrónica", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Integración MCP / API para IA", A: "no", B: "no", clinera: "yes" },
      { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Reserva online 24/7", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Ficha clínica digital madura", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Odontograma dental nativo", A: "yes", B: "partial", clinera: "partial" },
      { feature: "Facturación electrónica local", A: "yes (CL DTE)", B: "yes (MX CFDI)", clinera: "partial" },
      { feature: "Atribución de ventas a campañas", A: "no", B: "no", clinera: "yes" },
      { feature: "Difusiones masivas WhatsApp", A: "partial", B: "no", clinera: "yes" },
      { feature: "App móvil nativa", A: "no", B: "yes", clinera: "yes" },
      { feature: "Precios públicos en web", A: "no", B: "yes", clinera: "yes" },
      { feature: "Sin permanencia", A: "partial", B: "partial", clinera: "yes" },
      { feature: "Plan inicial USD/mes", A: "consultar", B: "$25/profesional", clinera: "$89 (3 usuarios)" },
    ],
    dimensions: [
      {
        title: "Geografía y compliance fiscal",
        body:
          "Reservo está hecho para Chile y tiene DTE integrado (SII). Doctocliq está hecho para México y tiene CFDI integrado (SAT). Si tu clínica opera en uno solo de esos países, la elección es directa por compliance fiscal local.",
      },
      {
        title: "Telemedicina y receta electrónica",
        body:
          "Doctocliq tiene videoconsulta + receta médica electrónica integrada como funcionalidad central. Reservo cubre telemedicina como módulo complementario, con menos énfasis en receta digital firmada.",
      },
      {
        title: "Ficha clínica",
        body:
          "Reservo tiene odontograma dental maduro y plantillas por especialidad muy completas (referente en dental en Chile). Doctocliq tiene ficha clínica sólida con foco en consulta médica general y telemedicina.",
      },
      {
        title: "WhatsApp e IA",
        body:
          "Ninguno tiene IA conversacional WhatsApp. Reservo tiene envío manual de mensajes desde el panel. Doctocliq tiene confirmaciones automáticas pero no IA que mantenga conversación. Clinera (AURA) atiende 24/7 con memoria contextual e integración MCP.",
      },
      {
        title: "Precio y transparencia",
        body:
          "Reservo no publica precios — atiende por cotización. Doctocliq publica desde USD 25/profesional. Clinera publica Growth USD 89/mes (3 usuarios incluidos), Conect USD 129, Advanced USD 179, sin permanencia.",
      },
    ],
    faqs: [
      {
        q: "¿Reservo o Doctocliq es mejor para una clínica dental?",
        a: "Reservo tiene odontograma dental nativo más maduro y plantillas dentales muy completas. Doctocliq cubre dental pero no es su foco principal.",
      },
      {
        q: "¿Cuál tiene mejor receta médica electrónica?",
        a: "Doctocliq tiene receta médica electrónica con firma digital integrada al flujo de telemedicina, pensada para México. Reservo tiene receta como parte del flujo de consulta pero menos énfasis en firma electrónica.",
      },
      {
        q: "¿Cuál es más adecuado fuera de Chile y México?",
        a: "Para clínicas en Perú, Colombia, Argentina o Ecuador, ambos requieren validar el cumplimiento fiscal local. AgendaPro suele tener mejor cobertura LATAM general que Reservo o Doctocliq.",
      },
      {
        q: "¿Hay alternativa con WhatsApp IA?",
        a: "Sí: Clinera. AURA es agente IA en producción que atiende, agenda y deriva por WhatsApp Business 24/7. Disponible en CL, PE, CO, MX, AR, EC, UY, CR, PA.",
      },
      {
        q: "¿Puedo combinar Reservo o Doctocliq con Clinera?",
        a: "Sí. Clinera se integra vía API y MCP con ambos. AURA opera el canal WhatsApp por encima y sincroniza la agenda con tu sistema actual. No hace falta migrar.",
      },
    ],
    publishedAt: "2026-04-25",
  },

  // ============================================================
  // 6. Medilink vs Doctocliq
  // ============================================================
  "medilink-vs-doctocliq": {
    slug: "medilink-vs-doctocliq",
    competitorA: COMPETITORS.medilink,
    competitorB: COMPETITORS.doctocliq,
    title: "Medilink vs Doctocliq 2026: IA por voz vs telemedicina (+ alternativa WhatsApp IA)",
    description:
      "Medilink (Contact Center IA por voz) vs Doctocliq (telemedicina + agenda mexicana). Más una alternativa con IA conversacional WhatsApp 24/7.",
    h1: "Medilink vs Doctocliq 2026: ¿cuál conviene a tu clínica?",
    intro:
      "Medilink es chileno y tiene IA por canal de voz (Contact Center). Doctocliq es mexicano y se especializa en telemedicina + agenda. Ambos cubren clínica médica pero por canales muy distintos. Si tu paciente prefiere WhatsApp, Clinera es la tercera opción que ninguno tiene.",
    tldr: {
      A: "Medilink es mejor si te pierdes muchas llamadas y querés un Contact Center IA por voz que atienda 24/7 desde Chile.",
      B: "Doctocliq es mejor si tu volumen alto es telemedicina y necesitás videoconsulta + receta electrónica integrada (México).",
      clinera:
        "Clinera es mejor si tu canal principal es WhatsApp y querés IA que atienda, agende y derive 24/7 con memoria contextual.",
    },
    table: [
      { feature: "IA conversacional WhatsApp en producción", A: "no", B: "no", clinera: "yes" },
      { feature: "IA por canal de voz (llamadas)", A: "yes", B: "no", clinera: "no" },
      { feature: "Telemedicina / videoconsulta integrada", A: "yes", B: "yes", clinera: "partial" },
      { feature: "Receta médica electrónica", A: "yes", B: "yes", clinera: "partial" },
      { feature: "Coexistencia WhatsApp Business", A: "partial", B: "no", clinera: "yes" },
      { feature: "Atención 24/7 sin recepción humana", A: "yes", B: "no", clinera: "yes" },
      { feature: "Memoria contextual IA", A: "partial", B: "no", clinera: "yes" },
      { feature: "Integración MCP / API para IA", A: "no", B: "no", clinera: "yes" },
      { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Reserva online 24/7", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Ficha clínica digital madura", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Atribución de ventas a campañas", A: "no", B: "no", clinera: "yes" },
      { feature: "Difusiones masivas WhatsApp", A: "partial", B: "no", clinera: "yes" },
      { feature: "App móvil nativa", A: "partial", B: "yes", clinera: "yes" },
      { feature: "Precios públicos en web", A: "no", B: "yes", clinera: "yes" },
      { feature: "Sin permanencia", A: "no", B: "partial", clinera: "yes" },
      { feature: "Plan inicial USD/mes", A: "consultar", B: "$25/profesional", clinera: "$89 (3 usuarios)" },
    ],
    dimensions: [
      {
        title: "Estrategia de canal: voz vs telemedicina vs chat",
        body:
          "Medilink apostó por IA en voz (llamadas). Doctocliq apostó por videoconsulta integrada (telemedicina). Clinera apostó por IA en chat (WhatsApp). Las tres son válidas pero apuntan a comportamientos distintos del paciente: paciente que llama, paciente que necesita consulta remota, paciente que escribe.",
      },
      {
        title: "Foco geográfico",
        body:
          "Medilink es chileno, fuerte en CL. Doctocliq es mexicano, fuerte en MX. Clinera opera en CL, PE, CO, MX, AR, EC, UY, CR, PA. Si tu clínica está fuera de CL o MX, validá la cobertura local de Medilink y Doctocliq antes de cotizar.",
      },
      {
        title: "Telemedicina y receta electrónica",
        body:
          "Empate. Los dos cubren videoconsulta y receta médica electrónica con firma digital. Doctocliq tiene foco más fuerte en telemedicina pura (es su producto central). Medilink la suma como funcionalidad complementaria a su Contact Center IA.",
      },
      {
        title: "WhatsApp e IA conversacional",
        body:
          "Ninguno tiene IA conversacional WhatsApp en producción. Medilink puede integrar WhatsApp como canal complementario a su Contact Center pero no tiene agente IA específico para chat. Doctocliq trata WhatsApp como envío de recordatorios. Clinera, con AURA, opera el canal WhatsApp con IA real, memoria contextual y derivación a humano.",
      },
      {
        title: "Precio y transparencia",
        body:
          "Medilink no publica precios. Doctocliq desde USD 25/profesional. Clinera Growth USD 89/mes (3 usuarios incluidos), Conect USD 129, Advanced USD 179, todos sin permanencia.",
      },
    ],
    faqs: [
      {
        q: "¿Medilink o Doctocliq es mejor para telemedicina?",
        a: "Doctocliq tiene flujo más maduro de telemedicina pura (videoconsulta + receta + firma). Medilink la cubre pero su foco principal es el Contact Center IA por voz.",
      },
      {
        q: "¿Cuál atiende llamadas 24/7 con IA?",
        a: "Medilink: tiene IA en voz que atiende llamadas fuera de horario, agenda y deriva. Doctocliq no tiene Contact Center IA por voz.",
      },
      {
        q: "¿Cuál tiene mejor app móvil?",
        a: "Doctocliq tiene app nativa más completa (iOS + Android) con foco en consulta médica. Medilink tiene web responsive sólida pero app más limitada.",
      },
      {
        q: "¿Hay alternativa con IA conversacional WhatsApp?",
        a: "Clinera. AURA es agente IA en producción que atiende WhatsApp 24/7 con memoria contextual entre conversaciones, integración MCP y derivación automática a humano.",
      },
      {
        q: "¿Puedo combinar Medilink (voz) + Doctocliq (telemedicina) + Clinera (WhatsApp)?",
        a: "En teoría sí — Clinera se integra vía API/MCP. La práctica recomendada es elegir una sola plataforma como núcleo y agregar otra solo para canales complementarios. Tener tres sistemas exige sincronización rigurosa de la agenda.",
      },
    ],
    publishedAt: "2026-04-25",
  },
};

export const allCruzadas = Object.values(cruzadas);

// Mapeo: dado un slug directo (reservo, agendapro, etc.), ¿qué cruzadas lo incluyen?
// Útil para internal-linking desde la página de comparativa directa.
export function getCruzadasForCompetitor(
  competitorKey: "agendapro" | "reservo" | "medilink" | "doctocliq",
): Cruzada[] {
  return allCruzadas.filter(
    (c) => c.competitorA.key === competitorKey || c.competitorB.key === competitorKey,
  );
}
