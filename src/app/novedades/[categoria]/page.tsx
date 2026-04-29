import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import NovedadesV3 from "@/components/interior-v3/NovedadesV3";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, orgSchema } from "@/components/seo/schemas";
import { allPosts, getAllTags } from "@/content/posts";

// Catalogo de categorias soportadas. Cada slug mapea al tag real en MDX
// frontmatter + display name + meta SEO. Para sumar una nueva categoria,
// agregar una entrada aca y asegurarse que el tag exista en algun post.
type CategoryMeta = {
  slug: string;
  tag: string;
  name: string;
  title: string;
  description: string;
  intro: string;
};

const CATEGORIES: Record<string, CategoryMeta> = {
  whatsapp: {
    slug: "whatsapp",
    tag: "whatsapp",
    name: "WhatsApp",
    title: "WhatsApp para clínicas: guías y casos | Blog Clinera",
    description:
      "Todo sobre WhatsApp Business + IA para clínicas: API, plantillas, coexistencia, ventana 24h, recordatorios y atribución. Guías prácticas con datos reales.",
    intro:
      "Cómo operar WhatsApp Business y la API en clínicas: setup, plantillas, ventana 24h, IA conversacional y atribución de campañas Meta + Google.",
  },
  ia: {
    slug: "ia",
    tag: "ia",
    name: "IA",
    title: "IA para clínicas: agente AURA, LLMs y automatización | Blog Clinera",
    description:
      "Cómo aplicar agentes de IA y LLMs en una clínica: diferencia chatbot vs agente, memoria contextual, derivación a humano y casos auditados.",
    intro:
      "Agentes de IA, modelos LLM y automatización conversacional aplicada a clínicas — desde la diferencia con un chatbot hasta arquitecturas auditables.",
  },
  operaciones: {
    slug: "operaciones",
    tag: "operaciones",
    name: "Operaciones",
    title: "Operaciones de clínicas: agenda, no-shows, recepción | Blog Clinera",
    description:
      "Optimiza la operativa de tu clínica: protocolos para reducir no-shows, gestión de agenda, recepción 24/7 con IA y métricas de productividad.",
    intro:
      "Cómo operar una clínica con menos fricciones: agenda, recepción, no-shows, derivación a humano y procesos que escalan sin contratar más equipo.",
  },
  "no-shows": {
    slug: "no-shows",
    tag: "no-shows",
    name: "No-shows",
    title: "Reducir no-shows en clínicas: protocolos y datos | Blog Clinera",
    description:
      "Protocolos auditados para bajar el no-show del 30% al 8% en 90 días. Confirmaciones por WhatsApp, IA, penalizaciones, política de reagendamiento.",
    intro:
      "Cómo reducir el no-show en clínicas estéticas y médicas con protocolos comprobados: WhatsApp, IA, política 24-2-0, recuperación automática.",
  },
  estrategia: {
    slug: "estrategia",
    tag: "estrategia",
    name: "Estrategia",
    title: "Estrategia comercial para clínicas | Blog Clinera",
    description:
      "Cómo armar la estrategia comercial de tu clínica: segmentación, oferta, precios, embudo y atribución de campañas.",
    intro:
      "Estrategia comercial para clínicas: cómo segmentar, fijar precios, armar la oferta y medir el funnel completo desde el anuncio hasta la venta.",
  },
  ltv: {
    slug: "ltv",
    tag: "ltv",
    name: "LTV",
    title: "Lifetime Value en clínicas: cómo aumentarlo | Blog Clinera",
    description:
      "Cómo aumentar el LTV de tus pacientes: retención, planes de tratamiento, recuperación, recompra automática por WhatsApp e IA.",
    intro:
      "Lifetime Value de pacientes: estrategias de retención, recompra y planes de tratamiento que cambian la economía unitaria de la clínica.",
  },
  marketing: {
    slug: "marketing",
    tag: "marketing",
    name: "Marketing",
    title: "Marketing para clínicas: Meta + Google + WhatsApp | Blog Clinera",
    description:
      "Marketing digital para clínicas: campañas Meta y Google, atribución, landing pages, funnel WhatsApp y casos reales con números auditables.",
    intro:
      "Marketing digital aplicado a clínicas: cómo correr campañas en Meta y Google, medir atribución completa y convertir el clic en cita pagada.",
  },
  estetica: {
    slug: "estetica",
    tag: "estetica",
    name: "Estética",
    title: "Clínicas estéticas: marketing, agenda y operaciones | Blog Clinera",
    description:
      "Guías y casos para clínicas estéticas: ficha clínica con fotos antes/después, planes de tratamiento, marketing por canal y reducción de no-shows.",
    intro:
      "Contenido específico para clínicas estéticas: ficha clínica con consentimientos, planes de múltiples sesiones, marketing y operaciones del rubro.",
  },
  "fichas-clinicas": {
    slug: "fichas-clinicas",
    tag: "fichas-clinicas",
    name: "Fichas Clínicas",
    title: "Ficha Clínica en Chile: Guía Completa 2026 | Clinera.io",
    description:
      "Todo sobre la ficha clínica en Chile: qué es, ley 20.584, formato electrónico, cómo pedirla y software para clínicas. Guía actualizada por Clinera.io.",
    intro:
      "Todo sobre la ficha clínica en Chile y LATAM: qué es, marco legal Ley 20.584, ficha electrónica (FCE), elementos obligatorios, cómo pedirla y qué software elegir.",
  },
};

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((categoria) => ({ categoria }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const meta = CATEGORIES[categoria];
  if (!meta) {
    return {
      title: "Categoría — Blog Clinera",
      robots: { index: false, follow: true },
    };
  }
  const url = `https://www.clinera.io/novedades/${meta.slug}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_CL",
      url,
      siteName: "Clinera.io",
      title: meta.title,
      description: meta.description,
      images: ["/images/og-banner.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/images/og-banner.png"],
    },
  };
}

type Blog = {
  title: string;
  excerpt?: string;
  category?: string;
  image?: string;
  url?: string;
  slug?: string;
  publishedAt?: string;
  tags?: string[];
};

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const meta = CATEGORIES[categoria];
  if (!meta) notFound();

  const filtered = allPosts.filter((p) => p.tags?.includes(meta.tag));

  const blogs: Blog[] = filtered.map((p) => ({
    title: p.title,
    excerpt: p.description,
    category: p.category,
    image: p.heroImage,
    url: `/blog/${p.slug}`,
    slug: p.slug,
    publishedAt: p.publishedAt,
    tags: p.tags,
  }));

  const allTags = getAllTags();
  const url = `https://www.clinera.io/novedades/${meta.slug}`;

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: meta.title,
    description: meta.description,
    url,
    inLanguage: "es-CL",
    isPartOf: { "@id": "https://www.clinera.io/#website" },
    publisher: { "@id": "https://www.clinera.io/#organization" },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: filtered.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.clinera.io/blog/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io" },
            { name: "Novedades", url: "https://www.clinera.io/novedades" },
            { name: meta.name, url },
          ]),
          collectionPageSchema,
          itemListSchema,
        ]}
      />
      <NavV3 />
      <main>
        <NovedadesV3
          blogs={blogs}
          faqs={[]}
          allTags={allTags}
          activeTag={meta.tag}
          categoryName={meta.name}
          categoryIntro={meta.intro}
        />
      </main>
      <FooterV3 />
    </>
  );
}
