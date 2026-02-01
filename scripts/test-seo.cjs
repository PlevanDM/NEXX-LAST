#!/usr/bin/env node
/**
 * SEO Testing Checklist 2026
 * Based on SEO Best Practices 2026
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://nexxgsm.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'test-results');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🔍 SEO Testing Checklist 2026');
console.log('═'.repeat(60));
console.log(`Site: ${SITE_URL}\n`);

// Fetch HTML content
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ html: data, status: res.statusCode, headers: res.headers });
      });
    }).on('error', reject);
  });
}

// Extract meta tags
function extractMetaTags(html) {
  const meta = {
    title: null,
    description: null,
    keywords: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    ogType: null,
    canonical: null,
    robots: null,
    viewport: null,
    charset: null
  };

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) meta.title = titleMatch[1].trim();

  // Meta tags
  const metaRegex = /<meta\s+([^>]+)>/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    const attrs = match[1];
    const nameMatch = attrs.match(/name=["']([^"']+)["']/i);
    const propertyMatch = attrs.match(/property=["']([^"']+)["']/i);
    const contentMatch = attrs.match(/content=["']([^"']+)["']/i);
    const charsetMatch = attrs.match(/charset=["']([^"']+)["']/i);

    if (charsetMatch) {
      meta.charset = charsetMatch[1];
    }

    if (contentMatch) {
      const content = contentMatch[1];
      const name = nameMatch ? nameMatch[1].toLowerCase() : '';
      const property = propertyMatch ? propertyMatch[1].toLowerCase() : '';

      if (name === 'description') meta.description = content;
      if (name === 'keywords') meta.keywords = content;
      if (name === 'viewport') meta.viewport = content;
      if (name === 'robots') meta.robots = content;

      if (property === 'og:title') meta.ogTitle = content;
      if (property === 'og:description') meta.ogDescription = content;
      if (property === 'og:image') meta.ogImage = content;
      if (property === 'og:type') meta.ogType = content;
    }
  }

  // Canonical
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (canonicalMatch) meta.canonical = canonicalMatch[1];

  return meta;
}

// Check headings structure
function checkHeadings(html) {
  const h1Matches = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || [];
  const h2Matches = html.match(/<h2[^>]*>([^<]+)<\/h2>/gi) || [];
  const h3Matches = html.match(/<h3[^>]*>([^<]+)<\/h3>/gi) || [];

  return {
    h1: h1Matches.length,
    h2: h2Matches.length,
    h3: h3Matches.length,
    h1Text: h1Matches.map(m => m.replace(/<[^>]+>/g, '').trim()).slice(0, 3)
  };
}

// Check images alt text
function checkImages(html) {
  const imgRegex = /<img[^>]+>/gi;
  const images = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const imgTag = match[0];
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
    images.push({
      hasAlt: !!altMatch,
      alt: altMatch ? altMatch[1] : '',
      src: srcMatch ? srcMatch[1] : ''
    });
  }

  const withoutAlt = images.filter(img => !img.hasAlt || !img.alt.trim());
  return {
    total: images.length,
    withAlt: images.length - withoutAlt.length,
    withoutAlt: withoutAlt.length,
    missingAlt: withoutAlt.slice(0, 5).map(img => img.src.substring(0, 50))
  };
}

// Run SEO checks
async function runSEOChecks() {
  console.log('Running SEO checks...\n');

  try {
    const { html, status, headers } = await fetchHtml(SITE_URL);

    if (status !== 200) {
      console.error(`❌ Site returned status ${status}`);
      process.exit(1);
    }

    console.log('✅ Site is accessible\n');

    const meta = extractMetaTags(html);
    const headings = checkHeadings(html);
    const images = checkImages(html);

    console.log('📋 SEO Checklist Results:');
    console.log('═'.repeat(60));

    // Meta tags
    console.log('\n📄 Meta Tags:');
    console.log(`Title:              ${meta.title ? `✅ "${meta.title.substring(0, 60)}"` : '❌ Missing'}`);
    console.log(`Description:        ${meta.description ? `✅ "${meta.description.substring(0, 60)}"` : '❌ Missing'}`);
    console.log(`Keywords:           ${meta.keywords ? '✅ Present' : '⚠️  Not recommended (use structured data)'}`);
    console.log(`Charset:            ${meta.charset ? `✅ ${meta.charset}` : '❌ Missing'}`);
    console.log(`Viewport:           ${meta.viewport ? `✅ ${meta.viewport}` : '❌ Missing'}`);
    console.log(`Robots:             ${meta.robots ? `✅ ${meta.robots}` : '⚠️  Not set (default: index, follow)'}`);

    // Open Graph
    console.log('\n📱 Open Graph Tags:');
    console.log(`og:title:           ${meta.ogTitle ? '✅' : '❌ Missing'}`);
    console.log(`og:description:     ${meta.ogDescription ? '✅' : '❌ Missing'}`);
    console.log(`og:image:           ${meta.ogImage ? '✅' : '❌ Missing'}`);
    console.log(`og:type:            ${meta.ogType ? `✅ ${meta.ogType}` : '⚠️  Not set'}`);

    // Structure
    console.log('\n📐 Page Structure:');
    console.log(`H1 tags:            ${headings.h1 === 1 ? '✅ 1 (optimal)' : headings.h1 === 0 ? '❌ Missing' : `⚠️  ${headings.h1} (should be 1)`}`);
    if (headings.h1Text.length > 0) {
      console.log(`H1 text:            "${headings.h1Text[0].substring(0, 60)}"`);
    }
    console.log(`H2 tags:            ${headings.h2 > 0 ? `✅ ${headings.h2}` : '⚠️  None found'}`);
    console.log(`H3 tags:            ${headings.h3 > 0 ? `✅ ${headings.h3}` : '⚠️  None found'}`);

    // Images
    console.log('\n🖼️  Images:');
    console.log(`Total images:       ${images.total}`);
    console.log(`With alt text:      ${images.withAlt} (${Math.round(images.withAlt / images.total * 100)}%)`);
    console.log(`Without alt text:   ${images.withoutAlt > 0 ? `❌ ${images.withoutAlt}` : '✅ All have alt'}`);
    if (images.missingAlt.length > 0) {
      console.log(`Missing alt:        ${images.missingAlt.join(', ')}`);
    }

    // Canonical
    console.log('\n🔗 Canonical URL:');
    console.log(`Canonical:          ${meta.canonical ? `✅ ${meta.canonical}` : '⚠️  Not set'}`);

    // Recommendations
    const issues = [];
    if (!meta.title) issues.push('Add <title> tag');
    if (!meta.description) issues.push('Add meta description');
    if (!meta.charset) issues.push('Add charset meta tag');
    if (!meta.viewport) issues.push('Add viewport meta tag');
    if (headings.h1 !== 1) issues.push(`Fix H1 count (currently ${headings.h1}, should be 1)`);
    if (images.withoutAlt > 0) issues.push(`Add alt text to ${images.withoutAlt} images`);
    if (!meta.ogTitle) issues.push('Add og:title for social sharing');
    if (!meta.ogDescription) issues.push('Add og:description for social sharing');
    if (!meta.ogImage) issues.push('Add og:image for social sharing');
    if (!meta.canonical) issues.push('Add canonical URL');

    console.log('\n💡 SEO Recommendations:');
    console.log('═'.repeat(60));
    if (issues.length === 0) {
      console.log('✅ All basic SEO elements are present!');
    } else {
      issues.forEach((issue, idx) => {
        console.log(`   ${idx + 1}. ${issue}`);
      });
    }

    // Save report
    const report = {
      site: SITE_URL,
      checked: new Date().toISOString(),
      meta,
      headings,
      images,
      issues,
      recommendations: [
        'Ensure title is 50-60 characters',
        'Ensure description is 150-160 characters',
        'Use structured data (JSON-LD)',
        'Optimize images (WebP, lazy loading)',
        'Ensure fast page load speed',
        'Mobile-friendly design',
        'Internal linking structure',
        'XML sitemap',
        'robots.txt file'
      ]
    };

    const reportPath = path.join(OUTPUT_DIR, 'seo-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved: ${reportPath}`);

    console.log('\n✅ SEO check complete!');

    if (issues.length > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ SEO check failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runSEOChecks();
}

module.exports = { runSEOChecks };
