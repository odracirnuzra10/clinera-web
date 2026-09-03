import { ANNUAL_DISCOUNT_PERCENT, CLINERA_PLANS } from "@/content/pricing";
import { pageDate } from "@/content/page-dates";
import {
  ADDRESS_COUNTRY,
  ADDRESS_LOCALITY,
  AREA_SERVED,
  DISAMBIGUATING_DESCRIPTION,
  ENTITY_DESCRIPTION,
  ENTITY_NAME,
  FOUNDER,
  FOUNDING_DATE,
  HOME_META_DESCRIPTION,
  LEGAL_NAME,
  LOGO_URL,
  PARENT_ORG_NAME,
  PARENT_ORG_URL,
  PRODUCT_NAME,
  SAME_AS,
  SITE_URL,
} from "@/content/entidad";

export { SITE_URL };

export const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: ENTITY_NAME,
  alternateName: ["Clinera.io", PRODUCT_NAME],
  legalName: LEGAL_NAME,
  url: SITE_URL,
  logo: LOGO_URL,
  description: ENTITY_DESCRIPTION,
  disambiguatingDescription: DISAMBIGUATING_DESCRIPTION,
  foundingDate: FOUNDING_DATE,
  founder: {
    "@type": "Person",
    "@id": `${SITE_URL}/equipo#${FOUNDER.slug}`,
    name: FOUNDER.name,
    jobTitle: FOUNDER.jobTitle,
    sameAs: [FOUNDER.sameAs],
  },
  parentOrganization: {
    "@type": "Organization",
    name: PARENT_ORG_NAME,
    url: PARENT_ORG_URL,
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: ADDRESS_COUNTRY,
    addressLocality: ADDRESS_LOCALITY,
  },
  areaServed: [...AREA_SERVED],
  sameAs: [...SAME_AS],
  knowsAbout: [
    "empleado digital",
    "agendamiento con IA",
    "ficha clínica electrónica",
    "WhatsApp Business API",
  ],
};

/** Un Offer por plan y modalidad, misma fuente que `/planes`. */
export const softwareOffers = CLINERA_PLANS.flatMap((plan) => [
  {
    "@type": "Offer" as const,
    name: `${plan.name} · Anual`,
    price: String(plan.annualTotal),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/planes`,
    description: `Pago anual: ${ANNUAL_DISCOUNT_PERCENT}% OFF e implementación gratis (equivale a USD ${plan.annualMonthly}/mes).`,
  },
  {
    "@type": "Offer" as const,
    name: plan.name,
    price: String(plan.monthlyPrice),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/planes`,
    description: `${plan.name}: USD ${plan.monthlyPrice}/mes.`,
  },
]);

export const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: PRODUCT_NAME,
  alternateName: ENTITY_NAME,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Medical Practice Management",
  operatingSystem: "Web, iOS, Android",
  description: HOME_META_DESCRIPTION,
  url: SITE_URL,
  offers: softwareOffers,
  publisher: { "@id": `${SITE_URL}/#organization` },
  brand: { "@type": "Brand", name: ENTITY_NAME },
};

export const productPlansSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: PRODUCT_NAME,
  description: HOME_META_DESCRIPTION,
  brand: { "@type": "Brand", name: ENTITY_NAME },
  offers: softwareOffers,
};

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

export const videoObjectSchema = (v: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  embedUrl: string;
  contentUrl?: string;
  transcript?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: v.name,
  description: v.description,
  thumbnailUrl: v.thumbnailUrl,
  uploadDate: v.uploadDate,
  embedUrl: v.embedUrl,
  ...(v.contentUrl && { contentUrl: v.contentUrl }),
  ...(v.transcript && { transcript: v.transcript }),
  publisher: { "@id": `${SITE_URL}/#organization` },
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

export const webPageSchema = (opts: {
  path: string;
  name: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}) => {
  const dates = pageDate(opts.path);
  const url = `${SITE_URL}${opts.path === "/" ? "/" : opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    datePublished: opts.datePublished ?? dates.published,
    dateModified: opts.dateModified ?? dates.modified,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-entity-phrase]"],
    },
  };
};

export const definedTermSetSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": `${SITE_URL}/#definiciones`,
  name: "Glosario Clinera",
  hasDefinedTerm: [
    {
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/empleado-digital#term`,
      name: "empleado digital",
      url: `${SITE_URL}/empleado-digital`,
    },
    {
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/blog/modo-agentic-agendamiento-ia-clinicas#term`,
      name: "modo Agentic",
      url: `${SITE_URL}/blog/modo-agentic-agendamiento-ia-clinicas`,
    },
    {
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/blog/creditos-clinera-como-funcionan-costos-planes#term`,
      name: "crédito Clinera",
      url: `${SITE_URL}/blog/creditos-clinera-como-funcionan-costos-planes`,
    },
  ],
};

export const KNOWN_AUTHORS: Record<
  string,
  {
    name: string;
    jobTitle: string;
    sameAs: string[];
    description?: string;
    slug: string;
  }
> = {
  "Ricardo Oyarzún": {
    name: "Ricardo Oyarzún",
    jobTitle: "Co-fundador y Head of Growth, Clinera",
    slug: "ricardo-oyarzun",
    sameAs: ["https://www.linkedin.com/in/ricardooyarzunmarketingdigital/"],
    description:
      "Marketing digital para clínicas en LATAM. Co-fundador de Clinera, Método Hebe y Protocolo Lumina.",
  },
  "Mauricio López": {
    name: "Mauricio López",
    jobTitle: "Operaciones y producto, Clinera",
    slug: "mauricio-lopez",
    sameAs: ["https://www.linkedin.com/in/mauro-l%C3%B3pez-5b5642179/"],
    description:
      "Operaciones y producto en Clinera, con foco en agenda inteligente, ficha clínica electrónica e implementación en clínicas LATAM.",
  },
};

export const personSchema = (key: string) => {
  const known =
    KNOWN_AUTHORS[key] ??
    Object.values(KNOWN_AUTHORS).find((a) => a.slug === key);
  if (!known) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/equipo#${known.slug}`,
    name: known.name,
    jobTitle: known.jobTitle,
    sameAs: known.sameAs,
    description: known.description,
    worksFor: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}/equipo#${known.slug}`,
  };
};

export const blogPostingSchema = (post: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}) => {
  const known = post.authorName ? KNOWN_AUTHORS[post.authorName] : undefined;
  const author = known
    ? {
        "@type": "Person",
        "@id": `${SITE_URL}/equipo#${known.slug}`,
        name: known.name,
        jobTitle: known.jobTitle,
        sameAs: known.sameAs,
        ...(known.description && { description: known.description }),
        worksFor: { "@id": `${SITE_URL}/#organization` },
      }
    : {
        "@type": post.authorName ? "Person" : "Organization",
        name: post.authorName || ENTITY_NAME,
      };

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.slug}#post`,
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author,
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(post.image && {
      image: post.image.startsWith("http")
        ? post.image
        : `${SITE_URL}${post.image}`,
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };
};

export const medicalBusinessSchema = (clinic: {
  slug: string;
  name: string;
  city: string;
  region: string;
  countryCode: "CL" | "PE" | "CO" | "MX" | "AR" | "EC" | "PA";
  address?: string;
  phone?: string;
  whatsapp?: string;
  specialties: string[];
  hours?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": `${SITE_URL}/clinicas/${clinic.slug}#business`,
  name: clinic.name,
  url: `${SITE_URL}/clinicas/${clinic.slug}`,
  ...(clinic.phone && { telephone: clinic.phone }),
  ...(clinic.address && {
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address,
      addressLocality: clinic.city,
      addressRegion: clinic.region,
      addressCountry: clinic.countryCode,
    },
  }),
  medicalSpecialty: clinic.specialties,
  ...(clinic.hours && { openingHours: clinic.hours }),
});

export const reviewSchema = (r: {
  author: string;
  clinic: string;
  quote: string;
  rating?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  reviewRating: {
    "@type": "Rating",
    ratingValue: r.rating || 5,
    bestRating: 5,
  },
  author: { "@type": "Person", name: r.author, affiliation: r.clinic },
  reviewBody: r.quote,
  itemReviewed: { "@id": `${SITE_URL}/#software` },
});
