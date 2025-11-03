# Asset Conversion Guide

This document explains how to convert the generated SVG placeholder assets to production-ready PNG and JPG images.

## Current Status

✅ SVG placeholders have been generated for:
- OG images (Home, Blog, Download routes)
- PWA icons (192x192 and 512x512)
- Blog post images (6 blog posts)

## Conversion Requirements

### OG Images (1200x630px PNG)
Convert these SVG files to PNG format:
- `public/og-image-home.svg` → `public/og-image-home.png`
- `public/og-image-blog.svg` → `public/og-image-blog.png`
- `public/og-image-download.svg` → `public/og-image-download.png`

**Requirements:**
- Format: PNG
- Dimensions: 1200x630px (OG image standard)
- File size: < 300KB (optimized)
- Should include proper branding and text

**After conversion, update routes:**
- `src/routes/Home.tsx`: Change `.svg` to `.png` in OG meta tags
- `src/routes/Blog.tsx`: Change `.svg` to `.png` in OG meta tags
- `src/routes/Download.tsx`: Change `.svg` to `.png` in OG meta tags
- `index.html`: Change `.svg` to `.png` in OG meta tags

### PWA Icons (192x192 and 512x512 PNG)
Convert these SVG files to PNG format:
- `public/icon-192.svg` → `public/icon-192.png`
- `public/icon-512.svg` → `public/icon-512.png`

**Requirements:**
- Format: PNG
- Dimensions: Exactly 192x192px and 512x512px
- Transparent background (or solid brand color)
- Should be optimized for web

**After conversion, update:**
- `public/manifest.webmanifest`: Change `.svg` to `.png` and update `type` to `image/png`

### Blog Post Images (800x450px JPG)
Convert these SVG files to optimized JPG format:
- `public/blog/introducing-lore-vault.svg` → `public/blog/introducing-lore-vault.jpg`
- `public/blog/writing-with-ai-context.svg` → `public/blog/writing-with-ai-context.jpg`
- `public/blog/offline-first-architecture.svg` → `public/blog/offline-first-architecture.jpg`
- `public/blog/continuity-engine-deep-dive.svg` → `public/blog/continuity-engine-deep-dive.jpg`
- `public/blog/version-control-for-writers.svg` → `public/blog/version-control-for-writers.jpg`
- `public/blog/olive-cream-theme-story.svg` → `public/blog/olive-cream-theme-story.jpg`

**Requirements:**
- Format: JPG (optimized)
- Dimensions: 800x450px (16:9 aspect ratio)
- File size: 100-200KB per image
- Quality: 80-85% (balance quality vs size)
- Should be lazy-loaded (already implemented in code)

**After conversion, update:**
- `src/routes/Blog.tsx`: Change all `.svg` to `.jpg` in blog post image paths

## Conversion Tools

### Option 1: Using Sharp (Recommended for automation)

Install sharp as a dev dependency:
```bash
npm install --save-dev sharp
```

Then create a conversion script using sharp to batch convert all images.

### Option 2: Using ImageMagick

```bash
# Convert OG images
convert public/og-image-home.svg -resize 1200x630 public/og-image-home.png
convert public/og-image-blog.svg -resize 1200x630 public/og-image-blog.png
convert public/og-image-download.svg -resize 1200x630 public/og-image-download.png

# Convert PWA icons
convert public/icon-192.svg -resize 192x192 public/icon-192.png
convert public/icon-512.svg -resize 512x512 public/icon-512.png

# Convert blog images (to JPG)
convert public/blog/*.svg -resize 800x450 -quality 85 public/blog/*.jpg
```

### Option 3: Online Tools
- [CloudConvert](https://cloudconvert.com/svg-to-png) - Convert SVG to PNG
- [Squoosh](https://squoosh.app/) - Optimize images after conversion
- [TinyPNG](https://tinypng.com/) - Compress PNG files

### Option 4: Design Tools
- Adobe Illustrator / Photoshop
- Figma (Export as PNG/JPG)
- Canva (Export with custom dimensions)

## Testing

After conversion, verify:

1. **OG Images:**
   - Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - Test with [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

2. **PWA Icons:**
   - Run Lighthouse audit (PWA section should pass)
   - Test on mobile devices
   - Verify icons appear correctly in browser tabs

3. **Blog Images:**
   - Check lazy loading works correctly
   - Verify images load on scroll
   - Check responsive behavior on mobile
   - Verify file sizes are optimized

## Brand Colors Reference

When creating proper branded images, use:
- Phthalo Green: `#0B3D2E`
- Olive Green: `#6B7F47`
- Cream Background: `#F5F2E8`
- Foreground Text: `#0C0C0C`

## Notes

- SVG placeholders are functional but not optimized for social sharing
- OG images work better as PNG for compatibility
- PWA icons must be PNG for proper maskable icon support
- Blog images should be JPG for better compression
- All images should be optimized for web delivery

