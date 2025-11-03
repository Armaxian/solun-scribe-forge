/**
 * Script to generate OG images and PWA icons
 * Run with: npm run generate-assets
 * 
 * This script creates placeholder images that should be replaced with
 * proper branded images before production.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Since we don't have a canvas library, we'll create SVG placeholders
// that match the brand colors and can be converted to PNG

const BRAND_COLORS = {
  phthalo: '#0B3D2E', // Dark green
  olive: '#6B7F47',   // Olive green
  cream: '#F5F2E8',   // Cream background
  foreground: '#0C0C0C' // Dark text
};

/**
 * Creates an OG image SVG (should be converted to PNG: 1200x630)
 */
function createOGImage(title: string, filename: string) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${BRAND_COLORS.cream}"/>
  <rect width="1200" height="120" fill="${BRAND_COLORS.phthalo}" opacity="0.1"/>
  <text x="600" y="280" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="bold" 
        text-anchor="middle" fill="${BRAND_COLORS.foreground}">${title}</text>
  <text x="600" y="360" font-family="system-ui, -apple-system, sans-serif" font-size="32" 
        text-anchor="middle" fill="${BRAND_COLORS.phthalo}" opacity="0.8">solun.app</text>
  <circle cx="150" cy="75" r="40" fill="${BRAND_COLORS.phthalo}" opacity="0.2"/>
  <circle cx="1050" cy="555" r="50" fill="${BRAND_COLORS.olive}" opacity="0.15"/>
</svg>`;

  const publicPath = join(process.cwd(), 'public');
  writeFileSync(join(publicPath, filename), svg);
  console.log(`✓ Created ${filename} (SVG placeholder - convert to PNG 1200x630)`);
}

/**
 * Creates a PWA icon SVG (should be converted to PNG)
 */
function createPWAIcon(size: number) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${BRAND_COLORS.phthalo}" rx="${size * 0.15}"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.25}" fill="${BRAND_COLORS.cream}" opacity="0.9"/>
  <path d="M ${size * 0.35} ${size * 0.5} L ${size * 0.5} ${size * 0.65} L ${size * 0.65} ${size * 0.35}" 
        stroke="${BRAND_COLORS.phthalo}" stroke-width="${size * 0.08}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const publicPath = join(process.cwd(), 'public');
  writeFileSync(join(publicPath, `icon-${size}.svg`), svg);
  console.log(`✓ Created icon-${size}.svg (SVG placeholder - convert to PNG ${size}x${size})`);
}

/**
 * Creates a blog post image SVG placeholder
 */
function createBlogImage(slug: string) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="450" fill="${BRAND_COLORS.cream}"/>
  <rect width="800" height="80" fill="${BRAND_COLORS.phthalo}" opacity="0.1"/>
  <rect x="80" y="80" width="640" height="290" fill="${BRAND_COLORS.phthalo}" opacity="0.05" rx="8"/>
  <text x="400" y="250" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="600" 
        text-anchor="middle" fill="${BRAND_COLORS.phthalo}" opacity="0.6">Blog Image</text>
  <text x="400" y="290" font-family="system-ui, -apple-system, sans-serif" font-size="16" 
        text-anchor="middle" fill="${BRAND_COLORS.foreground}" opacity="0.4">${slug}</text>
  <circle cx="150" cy="50" r="30" fill="${BRAND_COLORS.phthalo}" opacity="0.15"/>
  <circle cx="650" cy="400" r="35" fill="${BRAND_COLORS.olive}" opacity="0.12"/>
</svg>`;

  const blogPath = join(process.cwd(), 'public', 'blog');
  mkdirSync(blogPath, { recursive: true });
  
  // Create as SVG for now - should be converted to optimized JPG
  writeFileSync(join(blogPath, `${slug}.svg`), svg);
  console.log(`✓ Created blog/${slug}.svg (SVG placeholder - convert to optimized JPG 800x450)`);
}

// Generate OG images
console.log('Generating OG images...');
createOGImage('Solun - Premium AI Writing Workspace', 'og-image-home.svg');
createOGImage('Solun Blog - World-Building & AI Writing Insights', 'og-image-blog.svg');
createOGImage('Download Solun - Premium AI Writing Workspace', 'og-image-download.svg');

// Generate PWA icons
console.log('\nGenerating PWA icons...');
createPWAIcon(192);
createPWAIcon(512);

// Generate blog post images
console.log('\nGenerating blog post images...');
const blogSlugs = [
  'introducing-lore-vault',
  'writing-with-ai-context',
  'offline-first-architecture',
  'continuity-engine-deep-dive',
  'version-control-for-writers',
  'olive-cream-theme-story'
];

blogSlugs.forEach(slug => createBlogImage(slug));

console.log('\n✓ Asset generation complete!');
console.log('\n⚠️  IMPORTANT: These are SVG placeholders. You need to:');
console.log('   1. Convert SVG OG images to PNG (1200x630px)');
console.log('   2. Convert SVG PWA icons to PNG (192x192 and 512x512)');
console.log('   3. Convert blog SVG images to optimized JPG (800x450px, ~100-200KB)');
console.log('   4. Replace placeholder images with proper branded assets');
console.log('\n💡 Tip: Use tools like sharp, ImageMagick, or online converters to convert SVGs to PNG/JPG');

