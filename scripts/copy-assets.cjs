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

// Copy sw.js (Service Worker)
const swSource = path.join(publicDir, 'sw.js');
const swDest = path.join(distDir, 'sw.js');
if (fs.existsSync(swSource)) {
  fs.copyFileSync(swSource, swDest);
  console.log(`✅ Copied: sw.js (Service Worker)\n`);
}

// Copy HTML pages (including main index.html from root)
const htmlPages = [];
let htmlCopied = 0;
htmlPages.forEach(page => {
  const source = path.join(publicDir, page);
  const dest = path.join(distDir, page);
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    htmlCopied++;
  }
});

// Copy main index.html from root
const indexSource = path.join(__dirname, '..', 'index.html');
const indexDest = path.join(distDir, 'index.html');
if (fs.existsSync(indexSource)) {
  fs.copyFileSync(indexSource, indexDest);
  htmlCopied++;
  console.log(`✅ Copied: index.html\n`);
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

const logos = [
  { name: 'nexx-logo-white.svg', desc: 'White logo (for dark header)' },
  { name: 'nexx-logo-blue.svg', desc: 'Blue logo (for white header)' },
  { name: 'nexx-logo.svg', desc: 'Default logo' }
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
}

console.log('✨ All assets copied successfully!');
