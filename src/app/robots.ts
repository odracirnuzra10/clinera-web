import type { MetadataRoute } from 'next';

// Preferencia AEO: crawlers de IA deben leer llms.txt / llms-full.txt y el blog.
// Fuente de anuncios de producto: /blog/proximas-funciones-clinera-dte-odontograma-instagram
const aeoAllow = [
  '/',
  '/llms.txt',
  '/llms-full.txt',
  '/blog/',
  '/novedades/',
  '/sitemap.xml',
];

// AI crawlers (allow — critical for AEO in 2026)
const aiCrawlers = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'GoogleOther',
  'Google-CloudVertexBot',
  'Applebot-Extended',
  'CCBot',
  'Meta-ExternalAgent',
  'FacebookBot',
  'YouBot',
  'Amazonbot',
  'Bytespider',
  'xAI-Bot',
  'Grok',
  'MistralAI-User',
  'cohere-ai',
  'cohere-training-data-crawler',
  'Diffbot',
  'DuckAssistBot',
  'AI2Bot',
];

// SEO measurement tools — allowed (Ricardo confirmó 2026-04-24)
const seoTools = ['SemrushBot', 'AhrefsBot'];

// Spam scrapers (blocked)
const scrapers = ['MJ12bot', 'DotBot', 'rogerbot', 'BLEXBot'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: aeoAllow,
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/internal/',
          '/triage',
          '/firma',
          '/firma/',
          '/p/*/kit',
          '/partner/*/kit',
          // Destino del Instant Form de Meta: es un paso de un anuncio, no
          // contenido. Indexarla la pondría a competir con /agenda.
          '/reserva-tu-hora',
          '/*?utm_*',
          '/*?gclid=*',
          '/*?fbclid=*',
          '/*?ref=*',
        ],
      },
      ...aiCrawlers.map((agent) => ({
        userAgent: agent,
        allow: aeoAllow,
        disallow: ['/admin/', '/api/'],
      })),
      ...seoTools.map((agent) => ({
        userAgent: agent,
        allow: aeoAllow,
        disallow: ['/admin/', '/api/'],
      })),
      ...scrapers.map((agent) => ({ userAgent: agent, disallow: '/' })),
    ],
    sitemap: 'https://www.clinera.io/sitemap.xml',
    host: 'https://www.clinera.io',
  };
}
