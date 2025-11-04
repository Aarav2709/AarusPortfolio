import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() || 'https://aarus2709.me/';

  // Get all projects for dynamic URLs
  const projects = await getCollection('projects');

  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '#about', priority: '0.8', changefreq: 'monthly' },
    { url: '#projects', priority: '0.9', changefreq: 'weekly' },
    { url: '#skills', priority: '0.7', changefreq: 'monthly' },
    { url: '#setup', priority: '0.6', changefreq: 'monthly' },
    { url: '#contact', priority: '0.8', changefreq: 'monthly' },
  ];

  const lastmod = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
