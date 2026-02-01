#!/usr/bin/env node
/**
 * Lighthouse Performance & Accessibility Testing 2026
 * Based on Web Testing Best Practices 2026
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://nexxgsm.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'test-results');
const LIGHTHOUSE_THRESHOLDS = {
  performance: 80,
  accessibility: 90,
  bestPractices: 85,
  seo: 80
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🔍 Lighthouse Testing 2026');
console.log('═'.repeat(60));
console.log(`Site: ${SITE_URL}`);
console.log(`Output: ${OUTPUT_DIR}\n`);

// Check if lighthouse CLI is available
function checkLighthouse() {
  try {
    execSync('lighthouse --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Run Lighthouse audit
function runLighthouse() {
  if (!checkLighthouse()) {
    console.log('⚠️  Lighthouse CLI not found. Installing...');
    try {
      execSync('npm install -g lighthouse', { stdio: 'inherit' });
    } catch (e) {
      console.error('❌ Failed to install Lighthouse. Please install manually:');
      console.error('   npm install -g lighthouse');
      console.error('\nOr use Lighthouse in Chrome DevTools:');
      console.error('   1. Open Chrome DevTools (F12)');
      console.error('   2. Go to Lighthouse tab');
      console.error('   3. Run audit for Performance, Accessibility, Best Practices, SEO');
      return false;
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(OUTPUT_DIR, `lighthouse-${timestamp}.json`);
  const htmlReportPath = path.join(OUTPUT_DIR, `lighthouse-${timestamp}.html`);

  console.log('🚀 Running Lighthouse audit...\n');

  try {
    // Run Lighthouse
    execSync(
      `lighthouse ${SITE_URL} ` +
      `--output=json,html ` +
      `--output-path=${reportPath.replace('.json', '')} ` +
      `--chrome-flags="--headless --no-sandbox" ` +
      `--only-categories=performance,accessibility,best-practices,seo`,
      { stdio: 'inherit' }
    );

    // Read and parse results
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    const scores = {
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(report.categories['best-practices'].score * 100),
      seo: Math.round(report.categories.seo.score * 100)
    };

    console.log('\n📊 Lighthouse Results:');
    console.log('═'.repeat(60));
    console.log(`Performance:      ${scores.performance}/100 ${scores.performance >= LIGHTHOUSE_THRESHOLDS.performance ? '✅' : '❌'}`);
    console.log(`Accessibility:    ${scores.accessibility}/100 ${scores.accessibility >= LIGHTHOUSE_THRESHOLDS.accessibility ? '✅' : '❌'}`);
    console.log(`Best Practices:   ${scores.bestPractices}/100 ${scores.bestPractices >= LIGHTHOUSE_THRESHOLDS.bestPractices ? '✅' : '❌'}`);
    console.log(`SEO:              ${scores.seo}/100 ${scores.seo >= LIGHTHOUSE_THRESHOLDS.seo ? '✅' : '❌'}`);
    console.log('═'.repeat(60));

    // Performance metrics
    const metrics = report.audits;
    console.log('\n⚡ Performance Metrics:');
    console.log(`First Contentful Paint:     ${metrics['first-contentful-paint'].displayValue || 'N/A'}`);
    console.log(`Largest Contentful Paint:   ${metrics['largest-contentful-paint'].displayValue || 'N/A'}`);
    console.log(`Total Blocking Time:         ${metrics['total-blocking-time'].displayValue || 'N/A'}`);
    console.log(`Cumulative Layout Shift:    ${metrics['cumulative-layout-shift'].displayValue || 'N/A'}`);
    console.log(`Speed Index:                ${metrics['speed-index'].displayValue || 'N/A'}`);

    // Accessibility issues
    const a11yAudit = report.audits['accessibility'];
    if (a11yAudit && a11yAudit.details && a11yAudit.details.items) {
      const a11yIssues = a11yAudit.details.items;
      if (a11yIssues.length > 0) {
        console.log('\n♿ Accessibility Issues:');
        a11yIssues.slice(0, 5).forEach((issue, idx) => {
          const snippet = issue.node?.snippet || issue.node?.selector || '';
          const description = issue.description || issue.message || 'Unknown issue';
          console.log(`  ${idx + 1}. ${description}${snippet ? ` (${snippet.substring(0, 50)})` : ''}`);
        });
        if (a11yIssues.length > 5) {
          console.log(`  ... and ${a11yIssues.length - 5} more issues`);
        }
      }
    }

    // Check thresholds
    const failed = [];
    if (scores.performance < LIGHTHOUSE_THRESHOLDS.performance) {
      failed.push(`Performance (${scores.performance} < ${LIGHTHOUSE_THRESHOLDS.performance})`);
    }
    if (scores.accessibility < LIGHTHOUSE_THRESHOLDS.accessibility) {
      failed.push(`Accessibility (${scores.accessibility} < ${LIGHTHOUSE_THRESHOLDS.accessibility})`);
    }
    if (scores.bestPractices < LIGHTHOUSE_THRESHOLDS.bestPractices) {
      failed.push(`Best Practices (${scores.bestPractices} < ${LIGHTHOUSE_THRESHOLDS.bestPractices})`);
    }
    if (scores.seo < LIGHTHOUSE_THRESHOLDS.seo) {
      failed.push(`SEO (${scores.seo} < ${LIGHTHOUSE_THRESHOLDS.seo})`);
    }

    if (failed.length > 0) {
      console.log('\n❌ Some thresholds not met:');
      failed.forEach(f => console.log(`   - ${f}`));
      console.log(`\n📄 Full report: ${htmlReportPath}`);
      process.exit(1);
    } else {
      console.log('\n✅ All thresholds met!');
      console.log(`📄 Full report: ${htmlReportPath}`);
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Lighthouse audit failed:');
    console.error(`   Error: ${error.message}`);
    if (error.stdout) console.error(`   Output: ${error.stdout}`);
    if (error.stderr) console.error(`   Error output: ${error.stderr}`);
    console.error('\n💡 Tips:');
    console.error('   1. Make sure Chrome/Chromium is installed');
    console.error('   2. Try running: npm install -g lighthouse chrome-launcher');
    console.error('   3. Or use Lighthouse in Chrome DevTools (F12 > Lighthouse tab)');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runLighthouse();
}

module.exports = { runLighthouse, checkLighthouse };
