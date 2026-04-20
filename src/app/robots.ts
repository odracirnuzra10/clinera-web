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

// Competitive SEO scrapers (blocked)
const scrapers = ['SemrushBot', 'AhrefsBot', 'MJ12bot', 'DotBot', 'rogerbot', 'BLEXBot'];

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
      ...scrapers.map((agent) => ({ userAgent: agent, disallow: '/' })),
    ],
    sitemap: 'https://clinera.io/sitemap.xml',
    host: 'https://clinera.io',
  };
}
