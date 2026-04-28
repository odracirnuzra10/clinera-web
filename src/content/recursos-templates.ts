import { allClinics, type Clinic } from "@/content/clinics";
import type { Recurso, RecursoTopic } from "@/content/recursos";

// Estructura del contenido renderizado por el template.
// Cada topic usa la misma forma para que el page.tsx no necesite ramificar.
export type RecursoContent = {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: RecursoSection[];
  faqs: { q: string; a: string }[];
  cta: {
    title: string;
    body: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref: string;
    secondaryLabel: string;
  };
};

export type RecursoSection =
  | { type: "h2"; title: string }
  | { type: "p"; body: string }
  | { type: "list-criterios"; items: string[] }
  | { type: "software"; ranking: number; software: SoftwareCard }
  | { type: "clinicas-locales"; clinicas: Clinic[]; ciudad: string }
  | { type: "migracion"; pasos: { title: string; body: string }[] };

export type SoftwareCard = {
  nombre: string;
  url?: string;
  comparativaUrl?: string;
  resumen: string;
  fortalezas: string[];
  debilidades: string[];
  precioMensual: string;
  idealPara: string;
  ctaPrimaryHref: string;
  ctaPrimaryLabel: string;
};

// Slugs de ciudades cubiertos hoy en /comparativas (4 directas relevantes).
// Cada recurso linkea a la comparativa más útil según topic.
const COMPARATIVAS_RELEVANTES: Record<RecursoTopic, string> = {
  "mejor-software-clinicas": "agendapro",
  "agenda-online-clinicas": "reservo",
  "whatsapp-clinicas": "medilink",
  "sistema-fichas-clinicas": "dentalink",
};

export function generateRecursoContent(r: Recurso): RecursoContent {
  switch (r.topic) {
    case "mejor-software-clinicas":
      return mejorSoftwareTemplate(r);
    // Stubs por implementar en olas 2-5
    case "agenda-online-clinicas":
    case "whatsapp-clinicas":
    case "sistema-fichas-clinicas":
      throw new Error(
        `Template ${r.topic} no implementado todavía. Solo ola 1 (mejor-software-clinicas) está activa.`,
      );
  }
}

// ============================================================
// Template: mejor-software-clinicas
// ============================================================
function mejorSoftwareTemplate(r: Recurso): RecursoContent {
  const { ciudad, ciudadSlug, year } = r;
  const clinicasLocales = allClinics.filter(
    (c) =>
      c.consentGranted &&
      c.ciudad.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") ===
        ciudad.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""),
  );

  const sections: RecursoSection[] = [
    { type: "h2", title: `Cómo elegimos los softwares de esta lista para ${ciudad}` },
    {
      type: "p",
      body: `Comparamos las plataformas que más se usan en clínicas médicas y estéticas de ${ciudad} a abril de ${year}, con foco en lo que cambia el día a día — no en listas de features genéricas. Estos son los criterios que aplicamos:`,
    },
    {
      type: "list-criterios",
      items: [
        `Activos en ${ciudad} con clientes verificables o cobertura LATAM con soporte en español.`,
        "Atención al castellano + onboarding documentado.",
        "Precio accesible para clínicas de 1 a 15 profesionales.",
        "Cumplen con confidencialidad de datos médicos (Ley 19.628 en Chile).",
        "Permiten al paciente reservar sin recepción humana de por medio.",
      ],
    },

    { type: "h2", title: `Top 5 software para clínicas en ${ciudad} ${year}` },

    // 1. Clinera
    {
      type: "software",
      ranking: 1,
      software: {
        nombre: "Clinera — IA que agenda por WhatsApp 24/7",
        url: "https://clinera.io",
        comparativaUrl: "/efectividad",
        resumen: `Clinera es el software clínico chileno con AURA, agente de IA conversacional que atiende WhatsApp 24/7. Para clínicas de ${ciudad} que pierden pacientes por no contestar mensajes a tiempo, Clinera resuelve el cuello de botella sin sumar recepción humana.`,
        fortalezas: [
          "AURA contesta por WhatsApp Business 24/7 con memoria contextual (LangChain).",
          "Coexistencia nativa: opera en el mismo número de WhatsApp que ya usa la clínica.",
          "Atribución real de ventas: trazabiliza cada conversación desde la campaña Meta o Google hasta la cita.",
          "Integración MCP + API: opera encima de Reservo, AgendaPro, Dentalink u otros sin obligar a migrar.",
          "Setup en menos de 1 hora, sin programador.",
        ],
        debilidades: [
          "No es marketplace de pacientes (no genera demanda nueva por sí solo).",
          "Odontograma dental básico — para clínicas 100% odontológicas conviene combinar con Dentalink.",
        ],
        precioMensual: "USD 89/mes (Growth, 3 usuarios incluidos) — sin permanencia.",
        idealPara: `Clínicas en ${ciudad} que reciben WhatsApps fuera de horario o pierden pacientes por no contestar a tiempo. Clínicas con inversión en publicidad digital que necesitan saber qué anuncio trae pacientes reales.`,
        ctaPrimaryHref: "/planes",
        ctaPrimaryLabel: "Ver planes desde USD 89/mes",
      },
    },
    // 2. AgendaPro
    {
      type: "software",
      ranking: 2,
      software: {
        nombre: "AgendaPro",
        url: "https://www.agendapro.com",
        comparativaUrl: "/comparativas/agendapro",
        resumen: `AgendaPro es la plataforma de agenda más usada en LATAM (20.000+ negocios), horizontal: sirve a clínicas, spas, gyms y centros estéticos. Buena opción si tu clínica en ${ciudad} mezcla verticales o si valoras una marca consolidada en toda la región.`,
        fortalezas: [
          "Escala regional con cobertura sólida en Chile, Colombia, Perú y México.",
          "App móvil nativa pulida (iOS + Android).",
          "Integraciones de pago locales en cada país.",
          "Precios públicos por usuario.",
        ],
        debilidades: [
          "Sin IA conversacional: WhatsApp es canal manual.",
          "Ficha clínica liviana — corta para especialidades técnicas (dental, medicina estética avanzada).",
          "El precio escala rápido si el equipo es grande (USD 19/usuario × 5 personas = USD 95/mes solo en agenda).",
        ],
        precioMensual: "Desde USD 19/usuario/mes.",
        idealPara: `Clínicas en ${ciudad} con operación multi-vertical (estética + spa + gym) o que priorizan app móvil sólida sobre IA conversacional.`,
        ctaPrimaryHref: "/comparativas/agendapro",
        ctaPrimaryLabel: "Ver comparativa Clinera vs AgendaPro",
      },
    },
    // 3. Reservo
    {
      type: "software",
      ranking: 3,
      software: {
        nombre: "Reservo",
        url: "https://www.reservo.cl",
        comparativaUrl: "/comparativas/reservo",
        resumen: `Reservo es el software clínico chileno tradicional (500+ clínicas, +1M citas históricas). Fuerte en ficha clínica madura, odontograma dental, y módulo financiero con DTE. Buena opción para clínicas en ${ciudad} con foco en la capa clínica más que en la conversación con pacientes.`,
        fortalezas: [
          "Ficha clínica muy madura con plantillas por especialidad.",
          "Odontograma dental nativo + módulo financiero con DTE chileno integrado.",
          "Marca consolidada en Chile y soporte local con buena reputación.",
        ],
        debilidades: [
          "Sin IA conversacional: WhatsApp es canal complementario.",
          "Sin precios públicos — atiende por cotización.",
          "Sin app móvil nativa (web responsive).",
        ],
        precioMensual: "Sin precios públicos (atiende por cotización).",
        idealPara: `Clínicas en ${ciudad} cuya prioridad absoluta es ficha clínica + DTE chileno y que ya tienen recepción humana cubriendo las horas hábiles.`,
        ctaPrimaryHref: "/comparativas/reservo",
        ctaPrimaryLabel: "Ver comparativa Clinera vs Reservo",
      },
    },
    // 4. Medilink
    {
      type: "software",
      ranking: 4,
      software: {
        nombre: "Medilink",
        url: "https://medilink.cl",
        comparativaUrl: "/comparativas/medilink",
        resumen: `Medilink es chileno, con Contact Center IA por canal de voz (llamadas) integrado a la agenda. Para clínicas en ${ciudad} que pierden muchas llamadas y necesitan IA que las conteste 24/7 — pero por voz, no por chat.`,
        fortalezas: [
          "IA por canal de voz que atiende llamadas 24/7.",
          "Ficha clínica robusta con telemedicina integrada.",
          "Soporte local en Chile.",
        ],
        debilidades: [
          "Sin IA conversacional para WhatsApp (solo voz).",
          "Sin precios públicos.",
          "Cobertura geográfica concentrada en Chile.",
        ],
        precioMensual: "Sin precios públicos.",
        idealPara: `Clínicas en ${ciudad} cuyo cuello de botella son las llamadas perdidas y donde el paciente promedio prefiere llamar antes que escribir.`,
        ctaPrimaryHref: "/comparativas/medilink",
        ctaPrimaryLabel: "Ver comparativa Clinera vs Medilink",
      },
    },
    // 5. Dentalink
    {
      type: "software",
      ranking: 5,
      software: {
        nombre: "Dentalink",
        url: "https://www.softwaredentalink.com",
        comparativaUrl: "/comparativas/dentalink",
        resumen: `Dentalink es el líder dental LATAM con 15.000+ clientes, 100% vertical odontológico. Para clínicas dentales en ${ciudad} que necesitan odontograma + periodontograma + ortodoncia + análisis IA de radiografías con la profundidad de un sistema vertical.`,
        fortalezas: [
          "Odontograma + periodontograma + módulo de ortodoncia diseñados para dental.",
          "IA propia especializada en flujos dentales (análisis de RX, asistente CRM).",
          "Financiamiento de pacientes y control de caja maduros.",
        ],
        debilidades: [
          "Solo dental — si la clínica abre vertical estética o médica, no la cubre.",
          "Sin precios públicos.",
        ],
        precioMensual: "Sin precios públicos.",
        idealPara: `Clínicas dentales puras en ${ciudad} que necesitan profundidad de odontograma + ortodoncia. Combina bien con Clinera para la capa WhatsApp + marketing por encima vía API.`,
        ctaPrimaryHref: "/comparativas/dentalink",
        ctaPrimaryLabel: "Ver comparativa Clinera vs Dentalink",
      },
    },
  ];

  // Sección "Clínicas locales" solo si hay seed
  if (clinicasLocales.length > 0) {
    sections.push(
      {
        type: "h2",
        title: `Clínicas de ${ciudad} que ya están automatizadas con Clinera`,
      },
      { type: "clinicas-locales", clinicas: clinicasLocales, ciudad },
    );
  } else {
    sections.push(
      {
        type: "h2",
        title: `¿Tu clínica en ${ciudad} todavía no está aquí?`,
      },
      {
        type: "p",
        body: `Aún no tenemos clínicas activas con Clinera publicadas en ${ciudad}. Sé la primera de tu ciudad y te dejamos un onboarding dedicado + acompañamiento técnico durante el primer mes. Hablamos por WhatsApp y te mostramos AURA con tu agenda real en menos de 30 minutos.`,
      },
    );
  }

  // Migración
  sections.push(
    {
      type: "h2",
      title: "Cómo migrar al software correcto sin paralizar tu agenda",
    },
    {
      type: "migracion",
      pasos: [
        {
          title: "1. Exporta tu agenda actual",
          body:
            "Casi todos los sistemas (Reservo, AgendaPro, Dentalink, Excel, hojas de cálculo) permiten exportar pacientes, citas históricas y notas a CSV. Pide ese export antes de cualquier demo — es el activo más importante que tienes.",
        },
        {
          title: "2. Pide demo en el sistema candidato",
          body:
            "Una buena demo dura 30-45 minutos y te muestra el flujo real de tu día — no una presentación genérica. Pide ver: agenda, ficha clínica, cómo se contesta un WhatsApp y cómo se ve el reporte de pacientes que llegaron vs. cancelaron.",
        },
        {
          title: "3. Setup técnico (menos de 1 hora si el proveedor sabe lo que hace)",
          body:
            "Conexión de WhatsApp Business, importación del CSV, configuración de servicios y horarios, y prueba con un paciente real. Si te dicen que el setup toma semanas o que necesitan un programador de tu lado, es bandera roja.",
        },
        {
          title: "4. Capacitación al equipo (90 minutos)",
          body:
            "Una sesión por Zoom con la recepción y los profesionales. Si el sistema es claro, esa única sesión basta. Si necesitan 5 capacitaciones, el sistema es complejo de operar y vas a perder tiempo todos los meses.",
        },
      ],
    },
  );

  // FAQ
  const comparativaSlug = COMPARATIVAS_RELEVANTES[r.topic];
  const faqs = [
    {
      q: `¿Cuál es el software más barato para clínicas en ${ciudad}?`,
      a: `Si miras solo precio nominal, los planes desde USD 19/usuario de AgendaPro o el Sacmed chileno con su plan Starter ($26.000 CLP/mes ≈ USD 27) son los más bajos. Para clínicas con 3+ profesionales que invierten en marketing digital, el plan Growth de Clinera (USD 89/mes con 3 usuarios incluidos) suele ser más eficiente porque integra IA + atribución de ventas.`,
    },
    {
      q: `¿Cuál es mejor para clínicas estéticas en ${ciudad}?`,
      a: `Para clínicas estéticas, las que tienen mayor volumen de WhatsApps (consultas de precios, agendamiento, reagendamiento) suelen elegir Clinera por AURA + atribución de ventas a campañas Meta. Si tu clínica estética tiene recepción cubriendo todo el día y solo necesita agenda + cobros, AgendaPro es opción más liviana.`,
    },
    {
      q: `¿Funciona Clinera en ${ciudad}?`,
      a: `Sí, Clinera funciona en toda LATAM y tiene foco fuerte en Chile (incluyendo ${ciudad}). El soporte está en español, los precios en USD, y no requiere número telefónico local — opera con tu WhatsApp Business actual.`,
    },
    {
      q: `¿Hay versión gratuita?`,
      a: `Ninguno de los softwares de esta lista ofrece plan gratuito permanente. Clinera tiene costo de implementación $0 y sin permanencia: pagas solo el plan mensual desde USD 89/mes y puedes cancelar cuando quieras.`,
    },
    {
      q: `¿Migrar de un software a otro pierde datos?`,
      a: `No, si se hace bien. Reservo, AgendaPro, Dentalink y la mayoría de los sistemas exportan a CSV. La migración manual de notas de evolución puede tomar 1-2 semanas con acompañamiento del proveedor receptor. En Clinera te acompañamos sin costo en la importación durante el onboarding.`,
    },
  ];

  // Meta SEO
  const metaTitle = `Mejor software para clínicas en ${ciudad} ${year}: comparativa real`;
  const metaDescription = `Comparamos los 5 mejores softwares para clínicas en ${ciudad}: AgendaPro, Reservo, Medilink, Dentalink y Clinera (con AURA, IA WhatsApp 24/7). Honest review con precios, fortalezas y debilidades.`;

  const intro = `Si tienes una clínica en ${ciudad}, sabes que el cuello de botella ya no es la atención clínica — es la operación: WhatsApps sin responder, no-shows del 30%, fichas dispersas en hojas de cálculo y agendas que se llenan a medio gas. Este artículo compara los softwares clínicos más usados en ${ciudad} a ${year}, con foco honesto en lo que cambia tu día a día — no en listas infinitas de features genéricas. Cada uno gana en algo distinto y la elección correcta depende del cuello de botella real de tu clínica en ${ciudad}.`;

  // CTA final dinámico — apunta a la comparativa relevante por topic
  const cta = {
    title: `¿Tu clínica en ${ciudad} ya pierde pacientes por no contestar WhatsApp?`,
    body: `Activa Clinera con costo de implementación $0 y sin permanencia. Setup en menos de 1 hora, sin programador. AURA empieza a contestar tu WhatsApp Business hoy mismo.`,
    primaryHref: "/planes",
    primaryLabel: "Ver planes desde USD 89/mes",
    secondaryHref: `/comparativas/${comparativaSlug}`,
    secondaryLabel: `Ver comparativa Clinera vs ${comparativaSlug.charAt(0).toUpperCase() + comparativaSlug.slice(1)}`,
  };

  // Conserva ciudadSlug para algún uso futuro (sitemap, etc.)
  void ciudadSlug;

  return {
    h1: `Mejor software para clínicas en ${ciudad} ${year}: comparativa real`,
    metaTitle,
    metaDescription,
    intro,
    sections,
    faqs,
    cta,
  };
}
