#!/usr/bin/env node
/**
 * Copy Assets Script for Windows/Unix
 * Копіює images та data в dist папку після build
 */

const fs = require('fs');
const path = require('path');

// Utility: Recursive copy directory
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Source not found: ${src}`);
    return;
  }

  // Create destination if doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Main
console.log('📦 Copying assets to dist/...\n');

const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

// Build version: unique per deploy so cache always invalidates (deploy = immediate update)
const BUILD_VERSION = process.env.BUILD_VERSION || new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);

// Ensure dist exists
if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ folder not found. Run build first.');
  process.exit(1);
}

// Copy images
const imagesSource = path.join(publicDir, 'images');
const imagesDest = path.join(distDir, 'images');
console.log('📸 Copying images...');
copyDir(imagesSource, imagesDest);
console.log(`✅ Copied: public/images → dist/images\n`);

// Copy data
const dataSource = path.join(publicDir, 'data');
const dataDest = path.join(distDir, 'data');
console.log('📊 Copying data...');
copyDir(dataSource, dataDest);
console.log(`✅ Copied: public/data → dist/data\n`);

// Copy robots.txt
const robotsSource = path.join(publicDir, 'robots.txt');
const robotsDest = path.join(distDir, 'robots.txt');
if (fs.existsSync(robotsSource)) {
  fs.copyFileSync(robotsSource, robotsDest);
  console.log(`✅ Copied: robots.txt\n`);
}

// Copy sitemap.xml
const sitemapSource = path.join(publicDir, 'sitemap.xml');
const sitemapDest = path.join(distDir, 'sitemap.xml');
if (fs.existsSync(sitemapSource)) {
  fs.copyFileSync(sitemapSource, sitemapDest);
  console.log(`✅ Copied: sitemap.xml\n`);
}

// Copy manifest.json (PWA)
const manifestSource = path.join(publicDir, 'manifest.json');
const manifestDest = path.join(distDir, 'manifest.json');
if (fs.existsSync(manifestSource)) {
  fs.copyFileSync(manifestSource, manifestDest);
  console.log(`✅ Copied: manifest.json (PWA)\n`);
}

// Copy EcoFlow PWA manifest + service worker
const ecoManifest = path.join(publicDir, 'ecoflow-manifest.json');
if (fs.existsSync(ecoManifest)) {
  fs.copyFileSync(ecoManifest, path.join(distDir, 'ecoflow-manifest.json'));
  console.log(`✅ Copied: ecoflow-manifest.json (EcoFlow PWA)\n`);
}
const ecoSw = path.join(publicDir, 'ecoflow-sw.js');
if (fs.existsSync(ecoSw)) {
  let c = fs.readFileSync(ecoSw, 'utf8');
  c = c.replace(/const CACHE_NAME = '[^']+';/, `const CACHE_NAME = 'ecoflow-tracker-${BUILD_VERSION}';`);
  fs.writeFileSync(path.join(distDir, 'ecoflow-sw.js'), c);
  console.log(`✅ Copied: ecoflow-sw.js (EcoFlow PWA SW)\n`);
}

// Copy sw.js (Service Worker) and inject BUILD_VERSION into CACHE_NAME
const swSource = path.join(publicDir, 'sw.js');
const swDest = path.join(distDir, 'sw.js');
if (fs.existsSync(swSource)) {
  let swContent = fs.readFileSync(swSource, 'utf8');
  swContent = swContent.replace(/const CACHE_NAME = '[^']+';/, `const CACHE_NAME = 'nexx-gsm-${BUILD_VERSION}';`);
  fs.writeFileSync(swDest, swContent);
  console.log(`✅ Copied: sw.js (CACHE_NAME=nexx-gsm-${BUILD_VERSION})\n`);
}

// Copy HTML pages (nexx.html gets version injection for fresh scripts after deploy)
const htmlPages = ['faq.html', 'about.html', 'privacy.html', 'terms.html'];
let htmlCopied = 0;
htmlPages.forEach(page => {
  const source = path.join(publicDir, page);
  const dest = path.join(distDir, page);
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    htmlCopied++;
  }
});
// nexx.html: inject BUILD_VERSION so /nexx always loads latest scripts after deploy
const nexxSource = path.join(publicDir, 'nexx.html');
const nexxDest = path.join(distDir, 'nexx.html');
if (fs.existsSync(nexxSource)) {
  let nexxHtml = fs.readFileSync(nexxSource, 'utf8');
  nexxHtml = nexxHtml.replace(/\?v=[^"'\s&]+/g, `?v=${BUILD_VERSION}`);
  fs.writeFileSync(nexxDest, nexxHtml);
  htmlCopied++;
}

// Copy main index.html from root
const indexSource = path.join(__dirname, '..', 'index.html');
const indexDest = path.join(distDir, 'index.html');
if (fs.existsSync(indexSource)) {
  fs.copyFileSync(indexSource, indexDest);
  htmlCopied++;
  // Inject BUILD_VERSION so every deploy gets fresh scripts (no stale cache)
  let indexHtml = fs.readFileSync(indexDest, 'utf8');
  indexHtml = indexHtml.replace(/<meta name="version" content="[^"]*">/, `<meta name="version" content="${BUILD_VERSION}">`);
  // Replace dev entry point with production bundle
  indexHtml = indexHtml.replace(/src="\/src\/landing-client\.tsx"/, `src="/static/landing.min.js?v=${BUILD_VERSION}"`);
  indexHtml = indexHtml.replace(/\?v=[^"'\s&]+/g, `?v=${BUILD_VERSION}`);
  fs.writeFileSync(indexDest, indexHtml);
  console.log(`✅ Copied: index.html (version=${BUILD_VERSION})\n`);
}

if (htmlCopied > 0) {
  console.log(`✅ Copied ${htmlCopied} HTML pages\n`);
}

// Copy _headers (Cloudflare config)
const headersSource = path.join(publicDir, '_headers');
const headersDest = path.join(distDir, '_headers');
if (fs.existsSync(headersSource)) {
  fs.copyFileSync(headersSource, headersDest);
  console.log(`✅ Copied: _headers (Cloudflare)\n`);
}

// Copy _redirects (Cloudflare routing)
const redirectsSource = path.join(publicDir, '_redirects');
const redirectsDest = path.join(distDir, '_redirects');
if (fs.existsSync(redirectsSource)) {
  fs.copyFileSync(redirectsSource, redirectsDest);
  console.log(`✅ Copied: _redirects (Cloudflare)\n`);
}

// Copy _routes.json (Cloudflare Pages routing config)
const routesSource = path.join(publicDir, '_routes.json');
const routesDest = path.join(distDir, '_routes.json');
if (fs.existsSync(routesSource)) {
  fs.copyFileSync(routesSource, routesDest);
  console.log(`✅ Copied: _routes.json (Cloudflare Pages routing)\n`);
}

// Copy SVG logos (white and blue)
const staticDestDir = path.join(distDir, 'static');
if (!fs.existsSync(staticDestDir)) {
  fs.mkdirSync(staticDestDir, { recursive: true });
}

// Один лого везде + EcoFlow PWA icon
const logos = [
  { name: 'nexx-logo.png', desc: 'NEXX GSM logo' },
  { name: 'ecoflow-pwa-icon.svg', desc: 'EcoFlow PWA icon' }
];

let logosCopied = 0;
for (const logo of logos) {
  const logoSvgSource = path.join(publicDir, 'static', logo.name);
  const logoSvgDest = path.join(distDir, 'static', logo.name);
  if (fs.existsSync(logoSvgSource)) {
    fs.copyFileSync(logoSvgSource, logoSvgDest);
    logosCopied++;
  }
}

if (logosCopied > 0) {
  console.log(`✅ Copied ${logosCopied} logo file(s)\n`);
}

// Copy vendor libraries (React, ReactDOM, etc.)
const vendorSource = path.join(publicDir, 'static', 'vendor');
const vendorDest = path.join(distDir, 'static', 'vendor');
if (fs.existsSync(vendorSource)) {
  copyDir(vendorSource, vendorDest);
  console.log(`✅ Copied: static/vendor/ (React, ReactDOM, etc.)\n`);
}

// Copy brand logos
const brandsSource = path.join(publicDir, 'static', 'brands');
const brandsDest = path.join(distDir, 'static', 'brands');
if (fs.existsSync(brandsSource)) {
  copyDir(brandsSource, brandsDest);
  console.log(`✅ Copied: static/brands/ (brand SVGs)\n`);
}

// Copy other static subdirectories (fonts, etc.)
const staticSubDirs = ['fonts', 'icons'];
for (const subDir of staticSubDirs) {
  const subSource = path.join(publicDir, 'static', subDir);
  const subDest = path.join(distDir, 'static', subDir);
  if (fs.existsSync(subSource)) {
    copyDir(subSource, subDest);
    console.log(`✅ Copied: static/${subDir}/\n`);
  }
}

// Copy enrichment ticker
const tickerSource = path.join(publicDir, 'static', 'enrichment-ticker.js');
const tickerDest = path.join(distDir, 'static', 'enrichment-ticker.js');
if (fs.existsSync(tickerSource)) {
  fs.copyFileSync(tickerSource, tickerDest);
  console.log(`✅ Copied: enrichment-ticker.js\n`);
}

// Use minified JS if available
const staticSource = path.join(publicDir, 'static');
const staticDest = path.join(distDir, 'static');

if (fs.existsSync(staticSource) && fs.existsSync(staticDest)) {
  console.log('🗜️  Using minified JS files...');
  const files = fs.readdirSync(staticSource);
  const minFiles = files.filter(f => f.endsWith('.min.js'));
  
  let minified = 0;
  for (const minFile of minFiles) {
    const srcPath = path.join(staticSource, minFile);
    // For i18n.min.js, copy as both i18n.min.js and i18n.js
    // For other files, replace .min.js with .js
    let destPath;
    if (minFile === 'i18n.min.js') {
      // Copy as both i18n.min.js and i18n.js
      const destPathMin = path.join(staticDest, minFile);
      const destPathJs = path.join(staticDest, 'i18n.js');
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPathMin);
        fs.copyFileSync(srcPath, destPathJs);
        minified += 2;
      }
    } else {
      const baseName = minFile.replace('.min.js', '.js');
      destPath = path.join(staticDest, baseName);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        minified++;
      }
    }
  }
  
  if (minified > 0) {
    console.log(`✅ Copied ${minified} minified JS files\n`);
  }
  
  // Copy non-minified JS files that need to override minified versions
  console.log('📄 Copying source JS files...');
  const sourceJsFiles = ['directions.js', 'price-calculator.js', 'i18n.js', 'ui-components.js'];
  let sourceJsCopied = 0;
  for (const jsFile of sourceJsFiles) {
    const srcPath = path.join(staticSource, jsFile);
    const destPath = path.join(staticDest, jsFile);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      sourceJsCopied++;
    }
  }
  if (sourceJsCopied > 0) {
    console.log(`✅ Copied ${sourceJsCopied} source JS files\n`);
  }
}

// Note: _worker.js is built by `vite build` (Hono server) — do NOT overwrite it here
// The Hono server handles auth, API routes, and static assets serving

console.log('✨ All assets copied successfully!');
