import type { MetadataRoute } from 'next';

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
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/internal/',
          '/*?utm_*',
          '/*?gclid=*',
          '/*?fbclid=*',
          '/*?ref=*',
        ],
      },
      ...aiCrawlers.map((agent) => ({
        userAgent: agent,
        allow: '/',
        disallow: ['/admin/', '/api/'],
      })),
      ...seoTools.map((agent) => ({
        userAgent: agent,
        allow: '/',
        disallow: ['/admin/', '/api/'],
      })),
      ...scrapers.map((agent) => ({ userAgent: agent, disallow: '/' })),
    ],
    sitemap: 'https://clinera.io/sitemap.xml',
    host: 'https://clinera.io',
  };
}
