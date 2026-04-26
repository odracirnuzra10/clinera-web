import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { CrossComparativa } from "@/components/comparativas/CrossComparativa";
import { cruzadas, getCruzadasForCompetitor } from "@/content/comparativas-cross";

type Slug = "reservo" | "agendapro" | "medilink" | "manual";

type Row = {
  feature: string;
  clinera: string; // "yes" | "no" | "partial" | text
  them: string;
  themNote?: string; // small footnote shown under the cell, e.g. "anunciado, no activo"
  clineraHighlight?: boolean; // true = only Clinera has it (used for marketing diff rows)
};

type Dimension = {
  title: string;
  body: string;
};

type FaqItem = { q: string; a: string };

type Competitor = {
  name: string;
  siteLabel: string;
  title: string;
  intro: string;
  tldr: { clinera: string; them: string };
  clineraWins: string[]; // Long list — always heavier than themWins
  themWins: string[]; // Short list — honest acknowledgement
  table: Row[];
  dimensions: Dimension[];
  faqs: FaqItem[];
};

const competitors: Record<Slug, Competitor> = {
  reservo: {
    name: "Reservo",
    siteLabel: "reservo.cl",
    title: "Clinera vs Reservo: ¿cuál es mejor para tu clínica en 2026?",
    intro:
      "Reservo es un software chileno tradicional para gestionar agenda, ficha clínica y finanzas. Clinera es un software con IA conversacional que atiende WhatsApp 24/7. Aquí la comparativa honesta, con tabla, precios y casos de migración.",
    tldr: {
      clinera:
        "Clinera es mejor si el cuello de botella de tu clínica es contestar WhatsApp a tiempo. AURA responde, agenda y confirma pacientes 24/7 sin que tú muevas un dedo.",
      them:
        "Reservo es mejor si ya tienes una recepción que cubre tus horas hábiles y solo necesitas un sistema sólido de agenda + ficha + cobros, sin IA.",
    },
    clineraWins: [
      "IA conversacional AURA que responde tu WhatsApp 24/7 con memoria contextual LangChain.",
      "Coexistencia nativa con WhatsApp Business — opera en el mismo número que ya usa tu clínica.",
      "Difusiones masivas de WhatsApp marketing desde el mismo panel.",
      "Landing pages de conversión con analítica medible incluidas.",
      "Atribución de ventas a campañas (Meta/Google → conversación → cita → venta).",
      "IA integrable con tu agenda actual vía API y MCP (no obliga a migrar).",
      "Derivación automática a humano cuando la conversación lo requiere.",
      "Precios públicos desde USD 89/mes, sin permanencia.",
      "Setup en menos de 1 hora, sin programador.",
      "Reducción típica de no-shows del 30% al 5-10% en el primer mes.",
    ],
    themWins: [
      "Reservo tiene más años en el mercado chileno (500+ clínicas, +1M citas históricas) y una marca muy reconocida.",
      "Su módulo de ficha clínica es maduro: odontograma dental y plantillas por especialidad.",
      "Módulo financiero robusto con facturación electrónica DTE y comisiones para equipos.",
    ],
    table: [
      // Differentiators (marketing + IA + coexistencia)
      { feature: "IA conversacional WhatsApp activa en producción", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Difusiones masivas de WhatsApp marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Landing pages de conversión con analítica medible", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas de marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "IA integrable con agenda externa (Reservo/Dentalink/otros)", clinera: "yes", them: "no", clineraHighlight: true },
      // Core capabilities
      { feature: "Memoria contextual (LangChain)", clinera: "yes", them: "no" },
      { feature: "Integración MCP", clinera: "yes", them: "no" },
      { feature: "Derivación automática a humano", clinera: "yes", them: "partial" },
      { feature: "Agenda multi-profesional", clinera: "yes", them: "yes" },
      { feature: "Reserva online 24/7", clinera: "yes", them: "yes" },
      { feature: "Ficha clínica digital", clinera: "yes", them: "yes" },
      { feature: "Odontograma dental", clinera: "partial", them: "yes" },
      { feature: "Consentimientos informados", clinera: "yes", them: "yes" },
      { feature: "Multi-sede", clinera: "yes", them: "yes" },
      { feature: "Facturación electrónica", clinera: "partial", them: "yes" },
      { feature: "Módulo de comisiones", clinera: "partial", them: "yes" },
      { feature: "App móvil nativa", clinera: "yes", them: "no" },
      { feature: "Panel de ventas / trazabilidad", clinera: "yes", them: "partial" },
      { feature: "Precios públicos", clinera: "yes", them: "no" },
      { feature: "Plan desde USD", clinera: "$89", them: "consulta" },
    ],
    dimensions: [
      {
        title: "IA y automatización",
        body:
          "Aquí está la mayor diferencia. Clinera nació con IA conversacional: AURA entiende intención, ofrece horarios, agenda, confirma y deriva a humano cuando hace falta — todo por WhatsApp, 24/7, con memoria contextual entre conversaciones. Reservo, en cambio, trata WhatsApp como un canal de envío manual: tú o tu recepción escriben, Reservo no responde por ti. Si tu flujo depende de que alguien conteste cada mensaje, Reservo no te libera tiempo.",
      },
      {
        title: "Agendamiento y calendario",
        body:
          "Los dos tienen agenda multi-profesional con reserva online, bloqueos por disponibilidad y visualización por profesional o por sede. Reservo tiene una experiencia más pulida en la gestión manual (drag-and-drop, bloques recurrentes, recursos). Clinera pone el énfasis en que AURA agenda sola sin pasar por la recepción — y sincroniza con Google Calendar y WhatsApp en tiempo real.",
      },
      {
        title: "Comunicación con paciente",
        body:
          "Clinera: WhatsApp como canal principal, IA que responde siempre, recordatorios y confirmaciones automáticas. Reservo: recordatorios por email/SMS y envío manual de WhatsApp desde el panel. Si tu paciente escribe fuera de horario, Reservo no responde; Clinera sí.",
      },
      {
        title: "Ficha clínica",
        body:
          "Reservo tiene ventaja histórica acá: plantillas por especialidad bien maduras, odontograma para dental y un flujo de consulta muy completo. Clinera cubre ficha clínica digital, firma, consentimientos y telemedicina, pero sabemos que nuestro foco principal ha sido la capa de IA y WhatsApp. Si tu prioridad absoluta es la ficha, Reservo sigue siendo fuerte.",
      },
      {
        title: "Precio y planes",
        body:
          "Clinera publica sus precios: Growth USD 89/mes, Conect USD 129/mes, Advanced USD 179/mes, sin permanencia. Reservo no publica precios — atiende por formulario o teléfono con un plan único ajustado al tamaño del centro. Si valoras saber cuánto pagas antes de llamar, Clinera tiene la transparencia.",
      },
      {
        title: "Soporte y onboarding",
        body:
          "Clinera ofrece setup en menos de 1 hora, soporte en español y (en Advanced) onboarding dedicado. Reservo tiene equipo de soporte local en Chile con fama de responder bien, y es un estándar en varias redes de clínicas chilenas. Ambas empresas son sólidas en este aspecto.",
      },
    ],
    faqs: [
      {
        q: "¿Puedo migrar mis datos desde Reservo a Clinera?",
        a: "Sí. Clinera exporta pacientes, agenda y fichas desde Reservo vía API o CSV. Te acompañamos en la migración sin costo durante el onboarding.",
      },
      {
        q: "¿Reservo tiene IA conversacional como AURA?",
        a: "A abril 2026, según materiales públicos de Reservo, no. Reservo ofrece envío manual de WhatsApp desde el panel, no un agente IA autónomo que responda 24/7.",
      },
      {
        q: "¿Puedo mantener Reservo y sumar Clinera solo para la IA?",
        a: "Sí. El plan Growth de Clinera está diseñado justo para eso: clínicas que ya tienen software y solo quieren sumar la capa de mensajería con IA. Conectamos vía API o MCP.",
      },
      {
        q: "¿Cuánto cuesta Reservo vs Clinera?",
        a: "Reservo no publica precios (cotización por tamaño de clínica). Clinera publica USD 89/129/179 por mes, sin permanencia.",
      },
      {
        q: "¿Reservo cubre dental?",
        a: "Sí, con un módulo fuerte de odontograma. Clinera cubre dental también pero su fortaleza principal está en la capa de IA y WhatsApp; si dental es tu único vertical, evaluá ambos.",
      },
    ],
  },

  agendapro: {
    name: "AgendaPro",
    siteLabel: "agendapro.com",
    title: "Clinera vs AgendaPro: ¿cuál es mejor para tu clínica en 2026?",
    intro:
      "AgendaPro es el software de agendamiento más grande de LATAM (20.000+ negocios en 10+ países, US$35M levantados en 2025). Clinera está enfocada 100% en clínicas con IA conversacional. Esta es la comparativa honesta.",
    tldr: {
      clinera:
        "Clinera es mejor si necesitas profundidad clínica real (ficha médica, consentimientos, memoria contextual en WhatsApp) y precios transparentes desde USD 89/mes.",
      them:
        "AgendaPro es mejor si tu negocio mezcla varios verticales (estética + spa + peluquería + gym) y necesitas escala comprobada con apps móviles nativas y pasarela de pagos pulida.",
    },
    clineraWins: [
      "IA conversacional WhatsApp activa en producción (no un anuncio) — AURA responde 24/7 hoy.",
      "Memoria contextual LangChain: AURA recuerda al paciente entre conversaciones.",
      "Coexistencia nativa con WhatsApp Business en el mismo número.",
      "Difusiones masivas de WhatsApp marketing desde el panel.",
      "Landing pages de conversión con analítica medible.",
      "Atribución de ventas a campañas de marketing (campaña → cita → venta).",
      "Foco 100% clínico: ficha por especialidad, consentimientos, telemedicina.",
      "Precio plano USD 89/mes con 3 usuarios incluidos (sin sumar por usuario).",
      "Integración MCP con cualquier stack existente.",
      "Setup en menos de 1 hora y onboarding asistido en el plan Advanced.",
    ],
    themWins: [
      "Escala enorme: 20.000+ negocios, 135.000+ profesionales, 100M+ citas históricas.",
      "US$35M levantados con Riverwood Capital (2025); lanzó Julia como recepcionista IA.",
      "Apps móviles nativas iOS/Android más pulidas, precio de entrada USD 19/usuario.",
      "Cubre verticales amplios: spa, peluquería, gym, yoga, pilates, además de salud.",
    ],
    table: [
      // Differentiators (marketing + IA + coexistencia)
      { feature: "IA conversacional WhatsApp activa en producción", clinera: "yes", them: "partial", themNote: "Julia (2025) — recepcionista IA, WhatsApp no documentado", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Difusiones masivas de WhatsApp marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Landing pages de conversión con analítica medible", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas de marketing", clinera: "yes", them: "partial", themNote: "tracking básico Meta/Google", clineraHighlight: true },
      { feature: "IA integrable con agenda externa", clinera: "yes", them: "no", clineraHighlight: true },
      // Core capabilities
      { feature: "IA con memoria contextual (LangChain)", clinera: "yes", them: "no" },
      { feature: "Integración MCP", clinera: "yes", them: "no" },
      { feature: "Enfoque 100% clínico", clinera: "yes", them: "no" },
      { feature: "Agenda multi-profesional", clinera: "yes", them: "yes" },
      { feature: "Reserva online 24/7", clinera: "yes", them: "yes" },
      { feature: "Ficha clínica digital", clinera: "yes", them: "yes" },
      { feature: "Consentimientos informados", clinera: "yes", them: "partial" },
      { feature: "Multi-sede", clinera: "yes", them: "yes" },
      { feature: "Pasarela de pagos online", clinera: "partial", them: "yes" },
      { feature: "Apps móviles nativas iOS/Android", clinera: "partial", them: "yes" },
      { feature: "Recordatorios automáticos", clinera: "yes", them: "yes" },
      { feature: "Cobertura LATAM", clinera: "yes", them: "yes" },
      { feature: "Precio publicado", clinera: "yes", them: "partial" },
      { feature: "Plan base (USD/mes)", clinera: "$89 · 3 usuarios", them: "$19/usuario" },
    ],
    dimensions: [
      {
        title: "IA y automatización",
        body:
          "AgendaPro lanzó Julia en agosto 2025 — una recepcionista IA que cubre respuestas fuera de horario y fines de semana. Es un paso real, pero sus materiales públicos no mencionan memoria contextual LangChain ni MCP: está más posicionada como un chatbot de respuestas rápidas que como un agente conversacional con razonamiento contextual. Clinera (AURA) incorpora LangChain con memoria entre conversaciones y soporta MCP, lo que le permite recordar al paciente, entender el contexto de consultas previas y conectarse a tu stack sin integraciones custom.",
      },
      {
        title: "Agendamiento y calendario",
        body:
          "Ambos cubren agenda multi-profesional, reserva online, recordatorios por múltiples canales. AgendaPro tiene ventaja en polish móvil (apps nativas) y en integraciones con Google/Meta. Clinera apunta a que el agendamiento pase por AURA — el paciente agenda conversando, no navegando una UI.",
      },
      {
        title: "Comunicación con paciente",
        body:
          "AgendaPro: recordatorios por email, SMS y teléfono; Julia responde consultas fuera de horario. Clinera: WhatsApp como canal principal, AURA responde 24/7 con memoria contextual, deriva a humano cuando hace falta. Si WhatsApp es tu canal crítico, Clinera tiene más profundidad en ese canal específico.",
      },
      {
        title: "Ficha clínica",
        body:
          "AgendaPro cubre ficha digital pero su enfoque horizontal (belleza + salud + wellness) significa menos profundidad en lo estrictamente médico. Clinera se enfoca en clínicas: ficha por especialidad, consentimientos informados firmados, telemedicina. Si eres spa, AgendaPro te queda mejor; si eres clínica médica, Clinera va más alineado.",
      },
      {
        title: "Precio y planes",
        body:
          "AgendaPro arranca en USD 19/usuario/mes (plus add-ons de pagos y recepcionista). Clinera publica Growth USD 89/mes con 3 usuarios incluidos, Conect USD 129/mes con 5 usuarios, Advanced USD 179/mes con 15 usuarios. Para equipos pequeños AgendaPro suele salir más barato; desde 4-5 usuarios Clinera empareja o queda más barato, y con la ventaja de IA conversacional incluida.",
      },
      {
        title: "Soporte y onboarding",
        body:
          "AgendaPro tiene presencia corporativa enorme y equipo regional. Clinera apuesta por setup en menos de 1 hora y soporte en español con onboarding dedicado en el plan Advanced.",
      },
    ],
    faqs: [
      {
        q: "¿Puedo migrar de AgendaPro a Clinera?",
        a: "Sí. Exportamos tus pacientes y agenda vía API o CSV, y migramos conversaciones recientes de WhatsApp para que AURA arranque con contexto. Sin costo durante el onboarding.",
      },
      {
        q: "¿Julia (AgendaPro) y AURA (Clinera) hacen lo mismo?",
        a: "Se parecen en el objetivo (responder fuera de horario) pero son distintas en profundidad. AURA incluye memoria contextual LangChain y soporta MCP; Julia, según los materiales públicos a abril 2026, se comunica como recepcionista IA sin memoria contextual explícita.",
      },
      {
        q: "¿Cuál es más barato para mi clínica?",
        a: "Depende del tamaño. Con 1-2 usuarios, AgendaPro (USD 19/usuario) suele salir más barato. Desde 3+ usuarios, Clinera Growth USD 89/mes con 3 usuarios incluidos empareja o queda más barato, e incluye IA conversacional.",
      },
      {
        q: "¿Clinera sirve si tengo spa además de mi clínica?",
        a: "Clinera está enfocada 100% en clínicas. Si tu negocio mezcla clínica + spa + peluquería + gym, AgendaPro cubre todo en un solo sistema y probablemente te queda mejor.",
      },
      {
        q: "¿Clinera tiene apps nativas como AgendaPro?",
        a: "Clinera tiene apps móviles pero AgendaPro las tiene más pulidas y con más años de iteración. Si la experiencia móvil es tu prioridad #1, es un punto a favor de AgendaPro.",
      },
    ],
  },

  medilink: {
    name: "Medilink",
    siteLabel: "softwaremedilink.com",
    title: "Clinera vs Medilink: ¿cuál es mejor para tu clínica en 2026?",
    intro:
      "Medilink tiene uno de los relatos IA más fuertes en Chile pero su agente conversacional aún no está en producción generalizada. Clinera ya opera 24/7 con AURA, memoria contextual LangChain, coexistencia nativa con WhatsApp Business y precios públicos. Acá la comparativa honesta.",
    tldr: {
      clinera:
        "Clinera es mejor si quieres IA conversacional que YA está operando en producción, con coexistencia con WhatsApp Business, difusiones masivas, landing pages de conversión y atribución de ventas — todo en un mismo panel. Precios desde USD 89/mes.",
      them:
        "Medilink es mejor si necesitas ecosistema profundo en Chile (integraciones con BSale, Nubox, Kame, DTE completo) y llamadas telefónicas con IA, y no te importa esperar a que su agente WhatsApp entre en producción general.",
    },
    clineraWins: [
      "IA conversacional WhatsApp activa en producción hoy — Medilink lo anunció pero no está disponible generalizado.",
      "Coexistencia nativa con WhatsApp Business en el mismo número.",
      "Difusiones masivas de WhatsApp marketing — no disponible en Medilink.",
      "Landing pages de conversión con analítica medible.",
      "Atribución de ventas a campañas de marketing.",
      "Memoria contextual LangChain documentada y operativa.",
      "IA integrable con agendas externas (Reservo, Dentalink, etc.) vía MCP + API.",
      "Precios públicos: Growth $89, Conect $129, Advanced $179 USD/mes.",
      "Contratación self-service sin cotización telefónica.",
      "Setup en menos de 1 hora.",
      "Derivación automática a humano con trazabilidad completa.",
    ],
    themWins: [
      "Contact Center IA de Medilink cubre llamadas telefónicas además de WhatsApp.",
      "Integraciones nativas con el stack chileno (BSale, Nubox, Kame, Optimuz, Woxi).",
      "Notas Clínicas IA (voz a texto) y ContralorIA (supervisor clínico) — funciones más maduras.",
      "Telemedicina incluida de fábrica; presencia en 20+ países + España.",
    ],
    table: [
      // Differentiators (marketing + IA + coexistencia)
      { feature: "IA conversacional WhatsApp activa en producción", clinera: "yes", them: "partial", themNote: "anunciado, no disponible en producción generalizada", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Difusiones masivas de WhatsApp marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Landing pages de conversión con analítica medible", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas de marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "IA integrable con agenda externa", clinera: "yes", them: "no", clineraHighlight: true },
      // Core capabilities
      { feature: "Llamadas telefónicas con IA", clinera: "no", them: "yes" },
      { feature: "Memoria contextual (LangChain)", clinera: "yes", them: "partial" },
      { feature: "Integración MCP", clinera: "yes", them: "no" },
      { feature: "Derivación automática a humano", clinera: "yes", them: "yes" },
      { feature: "Notas clínicas por voz", clinera: "partial", them: "yes" },
      { feature: "Agenda multi-profesional", clinera: "yes", them: "yes" },
      { feature: "Ficha clínica por especialidad", clinera: "yes", them: "yes" },
      { feature: "Telemedicina", clinera: "partial", them: "yes" },
      { feature: "Facturación electrónica DTE Chile", clinera: "partial", them: "yes" },
      { feature: "Integración BSale / Nubox / Kame", clinera: "partial", them: "yes" },
      { feature: "Multi-sede", clinera: "yes", them: "yes" },
      { feature: "Panel ventas y trazabilidad", clinera: "yes", them: "yes" },
      { feature: "Precios públicos", clinera: "yes", them: "no" },
      { feature: "Plan base (USD/mes)", clinera: "$89", them: "consulta" },
    ],
    dimensions: [
      {
        title: "IA y automatización",
        body:
          "Los dos juegan en la misma categoría IA-first. Medilink gana en amplitud: cubre llamadas + WhatsApp + notas clínicas por voz + ContralorIA. Clinera gana en profundidad conversacional: AURA usa LangChain con memoria contextual explícita, lo que significa que recuerda conversaciones previas del mismo paciente y mantiene contexto entre mensajes. Medilink comunica su Contact Center IA como orientación por prompts, sin detallar memoria contextual ni MCP en materiales públicos.",
      },
      {
        title: "Agendamiento y calendario",
        body:
          "Prácticamente empate. Ambas tienen reserva online 24/7, multi-profesional, multi-sede, recordatorios automáticos y confirmaciones. Medilink lleva más años puliendo la UI de agenda; Clinera apuesta por que el agendamiento pase por conversación con AURA más que por navegación.",
      },
      {
        title: "Comunicación con paciente",
        body:
          "Medilink cubre WhatsApp + llamada telefónica 24/7 — si tus pacientes llaman mucho, es una ventaja real. Clinera cubre WhatsApp 24/7 con memoria contextual y derivación a humano, pero no responde llamadas telefónicas. Si tu flujo es principalmente WhatsApp, los dos te sirven; si llamadas son críticas, Medilink adelanta.",
      },
      {
        title: "Ficha clínica",
        body:
          "Medilink es fuerte: plantillas por especialidad, firma digital, Vademecum, telemedicina incluida, fichas estéticas faciales, Notas Clínicas IA (voz a texto). Clinera cubre lo esencial pero Notas por voz está en roadmap, no en producto actual. Si la ficha es crítica y la usas intensivamente durante la consulta, Medilink es más profundo.",
      },
      {
        title: "Precio y planes",
        body:
          "Medilink no publica precios (cotización por clínica). Clinera publica Growth USD 89, Conect USD 129, Advanced USD 179, sin permanencia. Si valoras transparencia total y precio predecible, Clinera tiene ventaja clara.",
      },
      {
        title: "Soporte y onboarding",
        body:
          "Medilink se pitchea como no-contrato, actualizaciones gratis y soporte local. Clinera ofrece setup en menos de 1 hora y onboarding dedicado en Advanced. Los dos son sólidos en este frente — la diferencia está en el modelo comercial (Medilink: contacto y cotización; Clinera: autoservicio con activación instantánea).",
      },
    ],
    faqs: [
      {
        q: "¿Puedo migrar de Medilink a Clinera?",
        a: "Sí. Exportamos pacientes y fichas desde Medilink vía CSV/API. La mayoría de los datos críticos (paciente, historial, agenda) se mueven sin fricción durante el onboarding.",
      },
      {
        q: "¿Cuál IA es más inteligente: AURA o Contact Center IA de Medilink?",
        a: "Son diferentes. Contact Center IA de Medilink cubre llamadas + WhatsApp; AURA de Clinera cubre WhatsApp con memoria contextual LangChain y soporte MCP. Si llamadas telefónicas son importantes para ti, Medilink adelanta. Si priorizas profundidad conversacional y arquitectura abierta, AURA.",
      },
      {
        q: "¿Clinera se integra con BSale o Nubox como Medilink?",
        a: "Clinera conecta vía API y MCP con cualquier sistema que exponga integración. A abril 2026, Medilink tiene integraciones nativas más maduras con el stack chileno tradicional (BSale, Nubox, Kame). Clinera suele requerir una integración inicial por API.",
      },
      {
        q: "¿Cuánto cuesta Medilink vs Clinera?",
        a: "Medilink no publica precios — cotización telefónica. Clinera publica USD 89/129/179 por mes, sin permanencia.",
      },
      {
        q: "¿Clinera tiene telemedicina?",
        a: "Clinera cubre teleconsulta básica. Medilink incluye telemedicina como módulo más maduro. Si teleconsulta es central para tu operación, revisá ambos.",
      },
    ],
  },

  manual: {
    name: "hacerlo manual",
    siteLabel: "recepción manual",
    title: "Clinera vs hacerlo manual: ¿cuánto te cuesta realmente no automatizar?",
    intro:
      "La decisión más cara que muchas clínicas toman es no decidir nada — seguir con una recepción manual contestando mensajes y llamando pacientes. Aquí los números reales de lo que cuesta quedarse así.",
    tldr: {
      clinera:
        "Clinera se paga sola en menos de un mes: recupera revenue perdido por no-shows, libera 2h diarias de recepción y responde a pacientes fuera de horario. Precio USD 89-179/mes.",
      them:
        "Seguir manual tiene sentido solo si atiendes menos de 30 citas al mes, no piensas crecer y tu recepción tiene capacidad sobrada. Para el resto, los números no dan.",
    },
    clineraWins: [
      "AURA responde WhatsApp 24/7 sin contratar más recepción.",
      "Reducción típica de no-shows del 30% al 5-10% en los primeros 30 días.",
      "Ahorro de 2-4 horas diarias en recepción dedicadas a mensajes.",
      "Respuesta a pacientes fines de semana, noches y feriados.",
      "Confirmaciones y recordatorios automáticos por WhatsApp.",
      "Seguimiento automatizado post-cita (reagenda, post-operatorio, reviews).",
      "Trazabilidad completa: campaña → conversación → cita → venta.",
      "Landing pages y difusiones masivas incluidas — marketing medible.",
      "Escalas sin aumentar costo operativo proporcional.",
      "Datos centralizados en la nube (sin Excel ni cuadernos).",
      "ROI típico en menos de 30 días (USD 129/mes vs USD 2.000+ recuperados).",
    ],
    themWins: [
      "Cero costo de software mensual (pero pagas con tiempo y revenue perdido).",
      "Control humano total sobre cada mensaje.",
      "Sin curva de aprendizaje de una plataforma nueva.",
    ],
    table: [
      // Differentiators vs manual
      { feature: "IA conversacional WhatsApp activa en producción", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Difusiones masivas de WhatsApp marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Landing pages de conversión con analítica medible", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas de marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "IA integrable con agenda externa", clinera: "yes", them: "no", clineraHighlight: true },
      // Operational reality
      { feature: "Costo mensual directo", clinera: "$89-179 USD", them: "$0 (aparente)" },
      { feature: "Horas/día de recepción en mensajes", clinera: "< 30 min", them: "2-4 horas" },
      { feature: "Tasa de no-shows típica", clinera: "5-10%", them: "25-35%" },
      { feature: "Tiempo medio de primera respuesta", clinera: "< 1 min", them: "30 min – 2 h" },
      { feature: "Respuesta fuera de horario", clinera: "yes", them: "no" },
      { feature: "Respuesta fines de semana", clinera: "yes", them: "no" },
      { feature: "Confirmación automática de citas", clinera: "yes", them: "no" },
      { feature: "Seguimiento automatizado post-cita", clinera: "yes", them: "no" },
      { feature: "Panel de métricas de conversión", clinera: "yes", them: "no" },
      { feature: "Trazabilidad campaña → cita → venta", clinera: "yes", them: "no" },
      { feature: "Escala sin contratar más recepción", clinera: "yes", them: "no" },
      { feature: "Riesgo humano (licencias, rotación)", clinera: "bajo", them: "alto" },
      { feature: "Capacidad 24/7 real", clinera: "yes", them: "no" },
    ],
    dimensions: [
      {
        title: "El costo real de no automatizar",
        body:
          "El número más importante: la tasa de no-shows promedio en clínicas LATAM es ~30%. Si facturas USD 10.000/mes en citas agendadas, estás perdiendo ~USD 3.000/mes por citas que no llegan. Clinera baja eso típicamente a 5-10% — recuperas USD 2.000/mes solo en reducción de no-shows. El plan Conect cuesta USD 129/mes. El retorno es obvio.",
      },
      {
        title: "Tiempo de recepción",
        body:
          "Estudios internos con clínicas chilenas y mexicanas muestran que una recepcionista gasta entre 2 y 4 horas al día respondiendo mensajes de WhatsApp y llamando para confirmar. Al mes son 40-80 horas. Al año, 480-960 horas — el equivalente a media recepción adicional. Clinera hace ese trabajo por ti y libera a la recepción para atender al paciente que sí está en la clínica.",
      },
      {
        title: "Mensajes fuera de horario",
        body:
          "El 40-60% de los mensajes entrantes a clínicas ocurren fuera del horario hábil (tarde, noche, fin de semana). Cada mensaje sin responder es un paciente que se va a la competencia. AURA responde 24/7 con memoria contextual. Manual, no.",
      },
      {
        title: "Ficha clínica y trazabilidad",
        body:
          "Manual implica agendas en cuaderno o Excel, fichas en papel o Drive, y cero trazabilidad de de dónde vino cada paciente. Clinera te da trazabilidad campaña → conversación → cita → venta en un solo panel. Si corres Meta Ads, esa trazabilidad define qué campaña funciona y cuál tirar.",
      },
      {
        title: "Riesgo operacional",
        body:
          "Tu recepción se enferma, sale de vacaciones, se va. Cada transición manual cuesta. Con Clinera, AURA no falta nunca; la recepción humana se enfoca en casos complejos y experiencia presencial del paciente.",
      },
      {
        title: "Crecimiento",
        body:
          "Manual no escala linealmente — cada 50% más de pacientes exige contratar más recepción. Clinera sí: subir de Growth a Conect o Advanced cuesta USD 30-60/mes más y soporta 3-10× el volumen.",
      },
    ],
    faqs: [
      {
        q: "¿Cuánto me ahorro pasando de manual a Clinera?",
        a: "Depende del tamaño. Clínicas típicas de 1-3 profesionales recuperan USD 1.500-3.000/mes solo en reducción de no-shows + horas de recepción recuperadas. El plan Conect cuesta USD 129/mes. El payback suele ser de semanas, no meses.",
      },
      {
        q: "¿Qué pasa si mis pacientes prefieren hablar con una persona?",
        a: "AURA deriva automáticamente a humano cuando la conversación lo requiere. La mayoría de los casos simples (agendar, reagendar, preguntar horarios, precios) los resuelve AURA; los casos sensibles los toma tu equipo.",
      },
      {
        q: "¿Es difícil pasar de manual a Clinera?",
        a: "No. Setup en menos de 1 hora, sin programador. Conectas WhatsApp, cargas tus servicios y horarios, y AURA empieza a responder. Si tienes datos en Excel, los subimos nosotros.",
      },
      {
        q: "¿Y si mi volumen es muy bajo? ¿Me sirve igual?",
        a: "Si haces menos de 20-30 citas al mes y tu recepción tiene capacidad sobrada, quizás no justifique aún — ahí manual sigue siendo viable. Desde ~50 citas/mes, Clinera ya te paga sola.",
      },
      {
        q: "¿Qué mide la trazabilidad campaña → cita → venta?",
        a: "Sabes exactamente de qué campaña (Meta Ads, Google, referido) vino cada conversación, si agendó, si llegó a la cita y si convirtió en venta. Es lo que manual no puede darte.",
      },
    ],
  },
};

export function generateStaticParams() {
  return [
    ...Object.keys(competitors).map((slug) => ({ slug })),
    ...Object.keys(cruzadas).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Cruzada (A vs B)
  const cross = cruzadas[slug];
  if (cross) {
    return {
      title: cross.title,
      description: cross.description,
      alternates: { canonical: `https://clinera.io/comparativas/${slug}` },
      openGraph: {
        type: "website",
        locale: "es_CL",
        url: `https://clinera.io/comparativas/${slug}`,
        title: cross.title,
        description: cross.description,
        images: ["/images/og-banner.png"],
      },
      twitter: {
        card: "summary_large_image",
        title: cross.title,
        description: cross.description,
        images: ["/images/og-banner.png"],
      },
    };
  }

  // Directa (Clinera vs X)
  const data = competitors[slug as Slug];
  if (!data) return {};
  return {
    title: `Clinera vs ${data.name} 2026 — Comparativa completa`,
    description: `Comparamos Clinera con ${data.name}: IA, agenda, WhatsApp, ficha clínica, precio, soporte y casos de migración. Guía honesta para decidir en 2026.`,
    alternates: { canonical: `https://clinera.io/comparativas/${slug}` },
    openGraph: {
      url: `https://clinera.io/comparativas/${slug}`,
      title: `Clinera vs ${data.name} 2026 — Comparativa completa`,
      description: `Tabla, análisis por dimensión, precios y casos reales de migración desde ${data.name} a Clinera.`,
    },
  };
}

function Mark({ value }: { value: string }) {
  if (value === "yes")
    return (
      <span
        aria-label="Sí"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#009FE3,#7C3AED,#C850C0)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        ✓
      </span>
    );
  if (value === "no")
    return (
      <span
        aria-label="No"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#F5F6F8",
          color: "#8B92A5",
          fontSize: 14,
        }}
      >
        ✕
      </span>
    );
  if (value === "partial")
    return (
      <span
        aria-label="Parcial"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "rgba(245,166,35,0.12)",
          color: "#B57B00",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        ◐
      </span>
    );
  return (
    <span style={{ fontFamily: "var(--font-tech)", fontSize: "0.85rem", color: "var(--ink-primary)", fontWeight: 500 }}>
      {value}
    </span>
  );
}

export default async function ComparativaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Cruzada (renderer separado, layout más simple)
  const cross = cruzadas[slug];
  if (cross) {
    const breadcrumbCrossLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://clinera.io/" },
        { "@type": "ListItem", position: 2, name: "Comparativas", item: "https://clinera.io/comparativas" },
        {
          "@type": "ListItem",
          position: 3,
          name: `${cross.competitorA.name} vs ${cross.competitorB.name}`,
          item: `https://clinera.io/comparativas/${slug}`,
        },
      ],
    };
    const faqCrossLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: cross.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbCrossLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqCrossLd) }}
        />
        <CrossComparativa data={cross} />
      </>
    );
  }

  // Directa (Clinera vs X) — render existente
  const data = competitors[slug as Slug];
  if (!data) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://clinera.io/" },
      { "@type": "ListItem", position: 2, name: "Comparativas", item: "https://clinera.io/comparativas" },
      {
        "@type": "ListItem",
        position: 3,
        name: `Clinera vs ${data.name}`,
        item: `https://clinera.io/comparativas/${slug}`,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  // Testimonio asignado por slug (citas EXACTAS de /ventas, sección 7.5 del plan SEO).
  const testimoniosBySlug: Record<Slug, { author: string; clinic: string; quote: string }> = {
    agendapro: {
      author: "Dr. Flavio Rojas",
      clinic: "Infiltracion.cl",
      quote: "Clinera me permite crecer sin pagar de más.",
    },
    reservo: {
      author: "Dra. Stefani Michailiszen",
      clinic: "Dermaclinic · Las Condes",
      quote: "Clinera es el corazón de mi clínica.",
    },
    medilink: {
      author: "Dra. Yasna Vásquez",
      clinic: "Estética Facial · Talca",
      quote: "Clinera me ayuda a organizar todo.",
    },
    manual: {
      author: "Tamara Oyarzún",
      clinic: "Estética Corporal · Vitacura",
      quote: "Clinera nos simplificó las comunicaciones.",
    },
  };
  const t = testimoniosBySlug[slug as Slug];
  const reviewLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
    author: { "@type": "Person", name: t.author, affiliation: t.clinic },
    reviewBody: t.quote,
    itemReviewed: { "@id": "https://clinera.io/#software" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewLd) }}
      />
      <NavV3 />
      <main>
        {/* HERO */}
        <section className="hero-v2">
          <div className="hero-v2__halo" aria-hidden />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <span className="hero-v2__eyebrow" style={{ background: "rgba(0,159,227,0.08)", borderColor: "rgba(0,159,227,0.2)", color: "var(--brand-cyan)" }}>
                COMPARATIVA · 2026
              </span>
              <h1 className="hero-v2__title" style={{ fontSize: "2.75rem" }}>
                {data.title}
              </h1>
              <p className="hero-v2__sub">{data.intro}</p>
              <div className="hero-v2__actions">
                <Link href="/hablar-con-ventas" className="hero-v2__primary">
                  Hablar con ventas
                </Link>
                <a href="#tabla" className="hero-v2__secondary">
                  Ver tabla comparativa ↓
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TL;DR */}
        <section className="section" style={{ paddingTop: 40 }} id="tldr">
          <div className="container">
            <div
              style={{
                maxWidth: 860,
                margin: "0 auto",
                background: "#fff",
                border: "1px solid rgba(0,159,227,0.25)",
                borderRadius: 20,
                padding: "36px 40px",
                boxShadow: "0 8px 32px -12px rgba(0,159,227,0.2)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-tech)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--brand-cyan)",
                  marginBottom: 16,
                }}
              >
                TL;DR
              </div>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.65, color: "var(--ink-primary)", marginBottom: 16 }}>
                <strong>Clinera es mejor si…</strong> {data.tldr.clinera}
              </p>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.65, color: "var(--ink-primary)" }}>
                <strong>
                  {data.name.charAt(0).toUpperCase() + data.name.slice(1)} es mejor si…
                </strong>{" "}
                {data.tldr.them}
              </p>
            </div>
          </div>
        </section>

        {/* Dónde gana cada uno — 2 cajas */}
        <section className="section" style={{ paddingTop: 40 }}>
          <div className="container">
            <div style={{ maxWidth: 1040, margin: "0 auto" }}>
              <h2 style={{ fontSize: "1.7rem", marginBottom: 28, color: "var(--ink-primary)", textAlign: "center" }}>
                Dónde gana cada uno
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr",
                  gap: 24,
                }}
                className="wins-grid"
              >
                {/* Clinera wins — loaded heavier */}
                <article
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(0,159,227,0.3)",
                    borderRadius: 20,
                    padding: "32px 32px 36px",
                    boxShadow: "0 16px 48px -16px rgba(0,159,227,0.18)",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: -12,
                      left: 32,
                      background: "linear-gradient(135deg,#009FE3,#7C3AED,#C850C0)",
                      color: "#fff",
                      fontFamily: "var(--font-tech)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "5px 12px",
                      borderRadius: 999,
                      fontWeight: 700,
                      boxShadow: "0 4px 12px rgba(0,159,227,0.3)",
                    }}
                  >
                    Recomendado
                  </span>
                  <h3 style={{ fontSize: "1.4rem", margin: "4px 0 8px", color: "var(--ink-primary)" }}>
                    Dónde gana Clinera
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "var(--ink-secondary)", marginBottom: 22, lineHeight: 1.5 }}>
                    {data.clineraWins.length} ventajas reales para tu clínica.
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {data.clineraWins.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontSize: "0.98rem",
                          color: "var(--ink-primary)",
                          paddingLeft: 28,
                          position: "relative",
                          lineHeight: 1.55,
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 2,
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg,#009FE3,#C850C0)",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 800,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>

                {/* Them wins — honest but shorter */}
                <article
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid var(--divider-subtle)",
                    borderRadius: 20,
                    padding: "32px 28px 36px",
                  }}
                >
                  <h3 style={{ fontSize: "1.2rem", margin: "4px 0 8px", color: "var(--ink-primary)" }}>
                    Dónde gana {data.name}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--ink-tertiary)", marginBottom: 22, lineHeight: 1.5 }}>
                    Ventajas reconocidas (honesto — datos públicos a abril 2026).
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {data.themWins.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontSize: "0.95rem",
                          color: "var(--ink-secondary)",
                          paddingLeft: 22,
                          position: "relative",
                          lineHeight: 1.55,
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 7,
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "rgba(245,166,35,0.18)",
                            border: "2px solid #F5A623",
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* TABLA COMPARATIVA */}
        <section className="section" style={{ paddingTop: 40 }} id="tabla">
          <div className="container">
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <h2 style={{ fontSize: "1.6rem", marginBottom: 20, color: "var(--ink-primary)" }}>
                Tabla comparativa completa
              </h2>
              <div
                style={{
                  overflow: "hidden",
                  borderRadius: 16,
                  border: "1px solid var(--divider-subtle)",
                  background: "#fff",
                  boxShadow: "0 8px 24px -12px rgba(17,19,24,0.08)",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                  <thead>
                    <tr style={{ background: "var(--surface-1)" }}>
                      <th style={{ textAlign: "left", padding: "14px 20px", fontWeight: 600, color: "var(--ink-secondary)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-tech)" }}>
                        Característica
                      </th>
                      <th style={{ textAlign: "center", padding: "14px 20px", fontWeight: 700, color: "var(--brand-cyan)" }}>
                        Clinera
                      </th>
                      <th style={{ textAlign: "center", padding: "14px 20px", fontWeight: 600, color: "var(--ink-secondary)" }}>
                        {data.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.table.map((row, idx) => (
                      <tr
                        key={row.feature}
                        style={{
                          borderTop: idx === 0 ? "none" : "1px solid var(--divider-subtle)",
                          background: row.clineraHighlight ? "rgba(0,159,227,0.035)" : "transparent",
                        }}
                      >
                        <td style={{ padding: "14px 20px", color: "var(--ink-primary)" }}>
                          {row.feature}
                          {row.clineraHighlight && (
                            <span
                              style={{
                                fontFamily: "var(--font-tech)",
                                fontSize: "0.7rem",
                                color: "var(--brand-cyan)",
                                marginLeft: 8,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                              }}
                            >
                              Único
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "center" }}>
                          <Mark value={row.clinera} />
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "center" }}>
                          <Mark value={row.them} />
                          {row.themNote && (
                            <div
                              style={{
                                fontSize: "0.72rem",
                                color: "var(--ink-tertiary)",
                                marginTop: 4,
                                fontStyle: "italic",
                              }}
                            >
                              {row.themNote}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-tertiary)", marginTop: 12, textAlign: "right" }}>
                Datos tomados de materiales públicos a abril 2026.
              </p>
            </div>
          </div>
        </section>

        {/* DIMENSIONES */}
        <section className="section" style={{ paddingTop: 40 }}>
          <div className="container">
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <h2 style={{ fontSize: "1.6rem", marginBottom: 28, color: "var(--ink-primary)" }}>
                Análisis por dimensión
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {data.dimensions.map((d) => (
                  <article key={d.title}>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: 10, color: "var(--ink-primary)" }}>
                      {d.title}
                    </h3>
                    <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "var(--ink-secondary)" }}>
                      {d.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" style={{ paddingTop: 40 }}>
          <div className="container">
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <h2 style={{ fontSize: "1.6rem", marginBottom: 20, color: "var(--ink-primary)" }}>
                Preguntas frecuentes
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {data.faqs.map((f) => (
                  <details
                    key={f.q}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      padding: "18px 24px",
                    }}
                  >
                    <summary
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--ink-primary)",
                        cursor: "pointer",
                        listStyle: "none",
                      }}
                    >
                      {f.q}
                    </summary>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        color: "var(--ink-secondary)",
                        lineHeight: 1.6,
                        marginTop: 10,
                      }}
                    >
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Internal linking — otras comparativas y recursos */}
        <section className="section" style={{ paddingTop: 60, paddingBottom: 20 }}>
          <div className="container">
            <div style={{ maxWidth: 1040, margin: "0 auto" }}>
              <h2
                style={{
                  fontFamily: "var(--font-tech)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink-tertiary)",
                  textAlign: "center",
                  margin: "0 0 18px",
                }}
              >
                Seguir comparando
              </h2>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 10,
                }}
              >
                {/* Otras 3 directas */}
                {(Object.keys(competitors) as Slug[])
                  .filter((s) => s !== slug)
                  .map((otherSlug) => (
                    <li key={otherSlug}>
                      <Link
                        href={`/comparativas/${otherSlug}`}
                        style={{
                          display: "block",
                          padding: "14px 18px",
                          background: "#fff",
                          border: "1px solid var(--divider-subtle)",
                          borderRadius: 12,
                          textDecoration: "none",
                          color: "var(--ink-primary)",
                          fontSize: "0.93rem",
                          fontWeight: 500,
                        }}
                      >
                        Clinera vs {competitors[otherSlug].name} →
                      </Link>
                    </li>
                  ))}
                {/* Cruzadas que incluyen este competidor */}
                {(slug === "agendapro" || slug === "reservo" || slug === "medilink") &&
                  getCruzadasForCompetitor(slug as "agendapro" | "reservo" | "medilink").map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/comparativas/${c.slug}`}
                        style={{
                          display: "block",
                          padding: "14px 18px",
                          background: "#fff",
                          border: "1px solid var(--divider-subtle)",
                          borderRadius: 12,
                          textDecoration: "none",
                          color: "var(--ink-primary)",
                          fontSize: "0.93rem",
                          fontWeight: 500,
                        }}
                      >
                        {c.competitorA.name} vs {c.competitorB.name} →
                      </Link>
                    </li>
                  ))}
                {/* Recursos relacionados */}
                <li>
                  <Link
                    href="/efectividad"
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "var(--ink-primary)",
                      fontSize: "0.93rem",
                      fontWeight: 500,
                    }}
                  >
                    Estudio de efectividad: 100% en ≤3 intentos →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/efectividad"
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "var(--ink-primary)",
                      fontSize: "0.93rem",
                      fontWeight: 500,
                    }}
                  >
                    Cómo medimos la efectividad (metodología) →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/planes"
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "var(--ink-primary)",
                      fontSize: "0.93rem",
                      fontWeight: 500,
                    }}
                  >
                    Ver planes desde USD 89/mes →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Final DARK */}
        <section className="section-dark">
          <div className="dark-halo-bottom-right" aria-hidden />
          <div className="container">
            <div className="cta-final-dark">
              <h2 className="cta-final-dark__title">
                Activa Clinera{" "}
                <span className="gt-neon">hoy</span>
              </h2>
              <p className="cta-final-dark__sub">
                Sin permanencia. Cancela cuando quieras. Simple.
              </p>
              <div className="cta-final-dark__actions">
                <Link href="/hablar-con-ventas" className="cta-final-dark__primary">
                  Hablar con ventas
                </Link>
                <Link href="/demo" className="cta-final-dark__secondary">
                  Ver demo del software
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}
