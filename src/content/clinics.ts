// Dataset seed Pilar B.1 — clínicas con consentimiento (sección 2.2 del plan SEO).
// Cualquier clínica nueva debe sumarse aquí solo cuando firme el opt-in del onboarding.

export type Clinic = {
  slug: string;
  nombre: string;
  ciudad: string;
  region: string;
  countryCode: "CL" | "PE" | "CO" | "MX" | "AR" | "EC" | "PA";
  comuna?: string;
  direccion?: string;
  telefono?: string;
  whatsapp: string;
  webOriginal?: string;
  especialidades: string[];
  profesionales?: { nombre: string; especialidad: string }[];
  horario?: string;
  descripcion: string;
  testimonio?: { quote: string; metric?: string };
  logoUrl?: string;
  heroImageUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  consentGranted: boolean;
};

export const allClinics: Clinic[] = [
  // ========================================
  // MÉTODO HEBE — Estética corporal (3 sucursales)
  // ========================================
  {
    slug: "metodo-hebe-vitacura",
    nombre: "Método Hebe — Vitacura",
    ciudad: "Santiago",
    region: "Región Metropolitana",
    countryCode: "CL",
    comuna: "Vitacura",
    direccion: "Los Abedules 3085, Of. 105, Vitacura, Santiago",
    whatsapp: "+56963222683",
    webOriginal: "https://www.metodohebe.cl",
    especialidades: [
      "Estética corporal",
      "Salud metabólica",
      "Reducción de grasa localizada",
      "Tratamiento de flacidez",
      "Tratamiento de celulitis",
      "Tonificación integral",
    ],
    descripcion:
      "Primera red de clínicas corporales en Chile especializada en salud metabólica. Protocolo de 3 fases con tecnología coreana, sin cirugía. Tratamientos: radiofrecuencia SkinWave MAX, electroestimulación iZED, carboxiterapia médica, criolipólisis selectiva, HIFU focalizado.",
    publishedAt: "2026-04-24",
    consentGranted: true,
  },
  {
    slug: "metodo-hebe-concon",
    nombre: "Método Hebe — Concón",
    ciudad: "Concón",
    region: "Valparaíso",
    countryCode: "CL",
    direccion: "Las Pelargonias 842, Of. 1114, Concón, Valparaíso",
    whatsapp: "+56963222683",
    webOriginal: "https://www.metodohebe.cl",
    especialidades: [
      "Estética corporal",
      "Salud metabólica",
      "Reducción de grasa localizada",
      "Tratamiento de flacidez",
      "Radiofrecuencia",
      "Criolipólisis",
    ],
    descripcion:
      "Sucursal de Método Hebe en Concón. Protocolo coreano de 3 fases para resultados visibles en estética corporal sin cirugía. Atiende a la V Región.",
    publishedAt: "2026-04-24",
    consentGranted: true,
  },
  {
    slug: "metodo-hebe-los-angeles",
    nombre: "Método Hebe — Los Ángeles",
    ciudad: "Los Ángeles",
    region: "Biobío",
    countryCode: "CL",
    direccion: "Av. Gabriela Mistral 269, Los Ángeles, Biobío",
    whatsapp: "+56963222683",
    webOriginal: "https://www.metodohebe.cl",
    especialidades: [
      "Estética corporal",
      "Salud metabólica",
      "Reducción de grasa localizada",
      "Tratamiento de flacidez",
      "Radiofrecuencia",
      "Carboxiterapia médica",
    ],
    descripcion:
      "Sucursal de Método Hebe en Los Ángeles, Región del Biobío. Salud metabólica y estética corporal con tecnología coreana, sin cirugía.",
    publishedAt: "2026-04-24",
    consentGranted: true,
  },

  // ========================================
  // PROTOCOLO LUMINA — Estética facial (3 sucursales)
  // ========================================
  {
    slug: "protocolo-lumina-vitacura",
    nombre: "Protocolo Lumina — Vitacura",
    ciudad: "Santiago",
    region: "Región Metropolitana",
    countryCode: "CL",
    comuna: "Vitacura",
    // TODO(seo): agregar direccion completa (calle, numero, of, codigo postal) para schema PostalAddress
    whatsapp: "+56963222683",
    webOriginal: "https://www.protocololumina.cl",
    especialidades: [
      "Estética facial",
      "Lifting facial coreano",
      "Rejuvenecimiento facial",
      "EndoJiwoo",
      "Endolaser Coreano",
      "HIFU facial",
      "Radiofrecuencia Sakura Lift",
      "Limpieza coreana",
    ],
    descripcion:
      "Clínica de estética facial coreana con el protocolo de rejuvenecimiento facial más avanzado de Chile. Lifting facial sin cirugía: EndoJiwoo, Cuky HIFU, Sakura Lift, Yuna Face, Korean Vitaboost, SkinGym.",
    publishedAt: "2026-04-24",
    consentGranted: true,
  },
  {
    slug: "protocolo-lumina-concon",
    nombre: "Protocolo Lumina — Concón",
    ciudad: "Concón",
    region: "Valparaíso",
    countryCode: "CL",
    // TODO(seo): agregar direccion completa (calle, numero, of, codigo postal) para schema PostalAddress
    whatsapp: "+56963222683",
    webOriginal: "https://www.protocololumina.cl",
    especialidades: [
      "Estética facial",
      "Lifting facial coreano",
      "Rejuvenecimiento facial",
      "HIFU facial",
      "Radiofrecuencia",
      "Limpieza coreana",
    ],
    descripcion:
      "Sucursal de Protocolo Lumina en Concón, Región de Valparaíso. Lifting facial coreano sin cirugía con tecnología avanzada.",
    publishedAt: "2026-04-24",
    consentGranted: true,
  },
  {
    slug: "protocolo-lumina-los-angeles",
    nombre: "Protocolo Lumina — Los Ángeles",
    ciudad: "Los Ángeles",
    region: "Biobío",
    countryCode: "CL",
    // TODO(seo): agregar direccion completa (calle, numero, of, codigo postal) para schema PostalAddress
    whatsapp: "+56963222683",
    webOriginal: "https://www.protocololumina.cl",
    especialidades: [
      "Estética facial",
      "Lifting facial coreano",
      "Rejuvenecimiento facial",
      "HIFU facial",
      "Limpieza coreana",
    ],
    descripcion:
      "Sucursal de Protocolo Lumina en Los Ángeles, Región del Biobío. Lifting facial coreano sin cirugía con tecnología avanzada.",
    publishedAt: "2026-04-24",
    consentGranted: true,
  },

  // ========================================
  // INFILTRACIONES ECOGUIADAS — Dr. Flavio Rojas (2 sucursales)
  // ========================================
  {
    slug: "infiltraciones-ecoguiadas-los-angeles",
    nombre: "Infiltraciones Ecoguiadas — Los Ángeles",
    ciudad: "Los Ángeles",
    region: "Biobío",
    countryCode: "CL",
    direccion: "Bulnes 220, Edificio Puerto Mayor II, Of. 507, Los Ángeles",
    whatsapp: "+56995969745",
    webOriginal: "https://www.infiltracion.cl",
    especialidades: [
      "Infiltraciones articulares ecoguiadas",
      "Medicina regenerativa",
      "PRP",
      "Tratamiento del dolor",
      "Tendinitis",
      "Lesiones musculares",
      "Fascitis plantar",
    ],
    profesionales: [
      {
        nombre: "Dr. Flavio Rojas",
        especialidad: "Medicina regenerativa y tratamiento del dolor",
      },
    ],
    horario:
      "Lunes a Viernes 10:00 a 19:00 · Sábado 10:00 a 13:30",
    descripcion:
      "Centro especializado en infiltraciones ecoguiadas en articulaciones (muñeca, codo, hombro, columna, cadera, rodilla, tobillo, pie) y tejidos blandos con PRP. Tratamiento del dolor mediante técnicas mínimamente invasivas y guiadas por ecografía.",
    testimonio: {
      quote: "Clinera me permite crecer sin pagar de más.",
      metric: "−71% en costos de marketing",
    },
    publishedAt: "2026-04-24",
    consentGranted: true,
  },
  // ========================================
  // ANTUKA SPA — Estética y bienestar (Osorno, CL)
  // ========================================
  {
    slug: "antuka-spa-osorno",
    nombre: "Antuka Spa Osorno",
    ciudad: "Osorno",
    region: "Los Lagos",
    countryCode: "CL",
    direccion: "Conrado Amthauer 919, Osorno",
    telefono: "+56993373039",
    whatsapp: "+56963103661",
    webOriginal: "https://www.antuka.cl",
    especialidades: [
      "Tratamientos corporales",
      "Tratamientos faciales",
      "Depilación láser",
      "Criolipólisis Fryss",
      "HIFU Ultraformer 3",
      "Radiofrecuencia Exilis Ultra 360",
      "Masajes terapéuticos",
    ],
    horario:
      "Lunes a viernes 09:30 a 20:00 · Sábado 09:30 a 17:00",
    descripcion:
      "Centro estético y de bienestar fundado en 2015 en Osorno, especializado en tratamientos corporales, faciales y servicios spa con aparatología de primer nivel: MEP, Aquapure, Fryss Criolipólisis, BTL X-Wave, Ultraformer 3, Embody Emsculpt, Venus Velocity, Vanquish ME y Exilis Ultra 360.",
    publishedAt: "2026-04-25",
    consentGranted: true,
  },

  // ========================================
  // TERAPIA SAHEBA — Fisioterapia y bienestar (Panamá, PA)
  // ========================================
  {
    slug: "terapia-saheba-panama",
    nombre: "Terapia Saheba",
    ciudad: "Panamá",
    region: "Provincia de Panamá",
    countryCode: "PA",
    direccion: "Vía España, Plaza Regency, piso 9, Panamá",
    whatsapp: "+50764923846",
    webOriginal: "https://terapiasaheba.com",
    especialidades: [
      "Fisioterapia",
      "Fisioterapia neurológica",
      "Fisioterapia pediátrica",
      "Fisioterapia maxilofacial",
      "Rehabilitación física",
      "Masajes terapéuticos",
      "Estética y cosmetología",
      "Embarazo y profilaxis obstétrica",
    ],
    horario:
      "Lunes a viernes 08:00 a 17:00 · Sábado 08:00 a 12:00",
    descripcion:
      "Centro integral de fisioterapia avanzada y bienestar en Ciudad de Panamá. Más de 9 años de experiencia y más de 5.000 pacientes atendidos en rehabilitación física, masajes terapéuticos, servicios estéticos y cosmetología, con tecnologías como ultrasonoterapia, electroterapia y tecarterapia.",
    publishedAt: "2026-04-25",
    consentGranted: true,
  },

  // ========================================
  // VITAL+FARME ECUADOR — Centro de especialidades médicas (Quito, EC)
  // ========================================
  {
    slug: "vital-farme-quito",
    nombre: "VITAL+FARME Ecuador",
    ciudad: "Quito",
    region: "Pichincha",
    countryCode: "EC",
    direccion: "Alemania y Las Guayanas, Quito 170519, Ecuador",
    telefono: "+593958653377",
    whatsapp: "+593958653377",
    webOriginal: "https://www.vitalfarmeecuador.com",
    especialidades: [
      "Medicina general",
      "Medicina especializada",
      "Nutrición",
      "Ecografía",
      "Terapias de bienestar",
      "Oxigenoterapia",
      "Detoxificación iónica",
      "Terapia endovenosa",
    ],
    descripcion:
      "Centro de especialidades médicas con enfoque integrativo en Quito que combina consulta clínica, diagnóstico y terapias de bienestar. Ofrece evaluación integral, planes personalizados y seguimiento en un solo lugar, con énfasis en explicar resultados al paciente.",
    publishedAt: "2026-04-25",
    consentGranted: true,
  },

  {
    slug: "infiltraciones-ecoguiadas-concepcion",
    nombre: "Infiltraciones Ecoguiadas — Concepción",
    ciudad: "Concepción",
    region: "Biobío",
    countryCode: "CL",
    direccion: "Lincoyan 186, Concepción",
    whatsapp: "+56995969745",
    webOriginal: "https://www.infiltracion.cl",
    especialidades: [
      "Infiltraciones articulares ecoguiadas",
      "Medicina regenerativa",
      "PRP",
      "Tratamiento del dolor",
      "Tendinitis",
      "Lesiones musculares",
    ],
    profesionales: [
      {
        nombre: "Dr. Flavio Rojas",
        especialidad: "Medicina regenerativa y tratamiento del dolor",
      },
    ],
    horario:
      "Lunes a Viernes 10:00 a 19:00 · Sábado 10:00 a 13:30",
    descripcion:
      "Sucursal en Concepción del centro Infiltraciones Ecoguiadas. Tratamiento del dolor mediante infiltraciones articulares y de tejidos blandos guiadas por ecografía.",
    testimonio: {
      quote: "Clinera me permite crecer sin pagar de más.",
      metric: "−71% en costos de marketing",
    },
    publishedAt: "2026-04-24",
    consentGranted: true,
  },
];

// Slugify helper compartido por /clinicas y /recursos.
// Coincide con el formato esperado por los slugs de B.4 ("santiago", "los-angeles", etc.).
export function slugifyCity(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Ciudades cubiertas por la ola 1 de Pilar B.4 (recursos geo).
// Sirve para gate del internal-link "Mejor software para clínicas en X →" en /clinicas/[slug].
export const CITIES_WITH_RECURSO_OLA1 = new Set([
  "santiago",
  "concepcion",
  "vina-del-mar",
  "temuco",
  "la-serena",
  "antofagasta",
  "iquique",
  "los-angeles",
]);
