// Pilar B.4 — Recursos geo (sección 4 del plan SEO).
// Captura tráfico "mejor software para clínicas en {ciudad}", segmentado al
// dueño de clínica que YA está buscando una solución en su zona.

export type RecursoTopic =
  | "mejor-software-clinicas"
  | "agenda-online-clinicas"
  | "whatsapp-clinicas"
  | "sistema-fichas-clinicas";

export type Recurso = {
  slug: string;
  topic: RecursoTopic;
  ciudad: string;
  ciudadSlug: string;
  countryCode: "CL" | "PE" | "CO";
  year: number;
  publishedAt: string;
  updatedAt?: string;
  // Gate: solo se renderiza si published === true.
  // Las olas 2-5 quedan en el dataset con published:false hasta lanzar.
  published: boolean;
};

const ciudades = [
  // CL — ola 1 (mejor-software-clinicas) y olas 2-4 quedan pre-pobladas
  { ciudad: "Santiago", ciudadSlug: "santiago", country: "CL" as const },
  { ciudad: "Concepción", ciudadSlug: "concepcion", country: "CL" as const },
  { ciudad: "Viña del Mar", ciudadSlug: "vina-del-mar", country: "CL" as const },
  { ciudad: "Temuco", ciudadSlug: "temuco", country: "CL" as const },
  { ciudad: "La Serena", ciudadSlug: "la-serena", country: "CL" as const },
  { ciudad: "Antofagasta", ciudadSlug: "antofagasta", country: "CL" as const },
  { ciudad: "Iquique", ciudadSlug: "iquique", country: "CL" as const },
  { ciudad: "Los Ángeles", ciudadSlug: "los-angeles", country: "CL" as const },
  // PE/CO — olas 5+ (todas published:false hasta expansión LATAM)
  { ciudad: "Lima", ciudadSlug: "lima", country: "PE" as const },
  { ciudad: "Bogotá", ciudadSlug: "bogota", country: "CO" as const },
  { ciudad: "Medellín", ciudadSlug: "medellin", country: "CO" as const },
];

const topics: RecursoTopic[] = [
  "mejor-software-clinicas",
  "agenda-online-clinicas",
  "whatsapp-clinicas",
  "sistema-fichas-clinicas",
];

// Ola 1: solo mejor-software-clinicas × 8 ciudades CL.
// Los otros (44 - 8 = 36 entries) quedan en dataset con published:false hasta su ola.
export const allRecursos: Recurso[] = ciudades.flatMap((c) =>
  topics.map((topic) => {
    const isOla1 =
      topic === "mejor-software-clinicas" && c.country === "CL";
    return {
      slug: `${topic}-${c.ciudadSlug}-2026`,
      topic,
      ciudad: c.ciudad,
      ciudadSlug: c.ciudadSlug,
      countryCode: c.country,
      year: 2026,
      publishedAt: "2026-04-26",
      published: isOla1,
    };
  }),
);

export const publishedRecursos = allRecursos.filter((r) => r.published);

export function getRecursoBySlug(slug: string): Recurso | undefined {
  return allRecursos.find((r) => r.slug === slug && r.published);
}

// Para el index: agrupa por topic los publicados.
export function getPublishedByTopic(): Record<RecursoTopic, Recurso[]> {
  const acc: Record<RecursoTopic, Recurso[]> = {
    "mejor-software-clinicas": [],
    "agenda-online-clinicas": [],
    "whatsapp-clinicas": [],
    "sistema-fichas-clinicas": [],
  };
  for (const r of publishedRecursos) acc[r.topic].push(r);
  return acc;
}

export const TOPIC_LABELS: Record<RecursoTopic, string> = {
  "mejor-software-clinicas": "Mejor software para clínicas",
  "agenda-online-clinicas": "Agenda online para clínicas",
  "whatsapp-clinicas": "WhatsApp para clínicas",
  "sistema-fichas-clinicas": "Sistema de fichas clínicas",
};
