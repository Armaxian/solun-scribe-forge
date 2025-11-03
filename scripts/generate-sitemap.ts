import { writeFileSync } from 'fs';
import { join } from 'path';

// Static routes to include in sitemap
const staticRoutes = [
  '',
  '/about',
  '/download',
  '/features',
  '/pricing',
  '/docs',
  '/blog',
  '/story',
  '/login',
  '/terms',
  '/privacy',
  '/contact',
  '/faqs'
];

// Blog posts from the blog data
const blogPosts = [
  'introducing-lore-vault',
  'writing-with-ai-context',
  'offline-first-architecture',
  'continuity-engine-deep-dive'
];

const baseUrl = 'https://solun.app';

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static routes
  staticRoutes.forEach(route => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}${route}</loc>\n`;
    sitemap += `    <lastmod>${today}</lastmod>\n`;
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>0.8</priority>\n';
    sitemap += '  </url>\n';
  });

  // Add blog posts
  blogPosts.forEach(slug => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}/blog/${slug}</loc>\n`;
    sitemap += `    <lastmod>${today}</lastmod>\n`;
    sitemap += '    <changefreq>monthly</changefreq>\n';
    sitemap += '    <priority>0.6</priority>\n';
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>';

  // Write to public directory
  const outputPath = join(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(outputPath, sitemap, 'utf8');

  console.log(`Sitemap generated at ${outputPath}`);
}

generateSitemap();
