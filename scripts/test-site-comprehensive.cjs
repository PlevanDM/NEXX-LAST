#!/usr/bin/env node
/**
 * Comprehensive Site Testing Script
 * Tests the dev site at http://localhost:5173/
 */

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:5173';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    }).on('error', reject);
  });
}

async function testPage(path, testName) {
  const url = `${BASE_URL}${path}`;
  log(`\n📄 Testing: ${testName}`, 'cyan');
  log(`   URL: ${url}`, 'blue');
  
  try {
    const response = await fetchUrl(url);
    
    if (response.statusCode === 200) {
      log(`   ✅ Status: ${response.statusCode} OK`, 'green');
      
      // Check content length
      const contentLength = response.body.length;
      log(`   📊 Content Length: ${(contentLength / 1024).toFixed(2)} KB`, 'blue');
      
      // Check for critical elements
      const checks = {
        'HTML structure': response.body.includes('<!DOCTYPE html>'),
        'React app div': response.body.includes('id="app"'),
        'Vite client': response.body.includes('/@vite/client'),
        'Landing client': response.body.includes('/src/landing-client.tsx'),
        'Tailwind CSS': response.body.includes('tailwindcss'),
        'Meta tags': response.body.includes('<meta'),
        'Title tag': response.body.includes('<title>'),
      };
      
      log(`   🔍 Content Checks:`, 'yellow');
      for (const [check, passed] of Object.entries(checks)) {
        log(`      ${passed ? '✅' : '❌'} ${check}`, passed ? 'green' : 'red');
      }
      
      // Check for specific sections (only for landing page)
      if (path === '/') {
        const sections = {
          'Calculator section': response.body.includes('calculator') || response.body.includes('Calculator'),
          'Services section': response.body.includes('services') || response.body.includes('Services'),
          'Contact section': response.body.includes('contact') || response.body.includes('Contact'),
        };
        
        log(`   📋 Section Checks:`, 'yellow');
        for (const [section, found] of Object.entries(sections)) {
          log(`      ${found ? '✅' : '⚠️'} ${section}`, found ? 'green' : 'yellow');
        }
      }
      
      // Check for potential errors
      const errors = [];
      if (response.body.includes('error') || response.body.includes('Error')) {
        errors.push('Contains "error" text');
      }
      if (response.body.includes('404')) {
        errors.push('Contains "404" text');
      }
      if (response.body.length < 1000) {
        errors.push('Content suspiciously small');
      }
      
      if (errors.length > 0) {
        log(`   ⚠️ Warnings:`, 'yellow');
        errors.forEach(err => log(`      - ${err}`, 'yellow'));
      }
      
      return { success: true, url, statusCode: response.statusCode };
    } else {
      log(`   ❌ Status: ${response.statusCode}`, 'red');
      return { success: false, url, statusCode: response.statusCode };
    }
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'red');
    return { success: false, url, error: error.message };
  }
}

async function testStaticAssets() {
  log(`\n📦 Testing Static Assets`, 'cyan');
  
  const assets = [
    '/static/nexx-logo.png',
    '/static/utils.min.js',
    '/static/database.min.js',
    '/static/nexx-core.min.js',
    '/static/i18n.js',
    '/static/ui-components.js',
    '/static/navigation-system.min.js',
    '/static/analytics.min.js',
    '/static/price-calculator.js',
  ];
  
  for (const asset of assets) {
    const url = `${BASE_URL}${asset}`;
    try {
      const response = await fetchUrl(url);
      const status = response.statusCode === 200 ? '✅' : '❌';
      const color = response.statusCode === 200 ? 'green' : 'red';
      log(`   ${status} ${asset} (${response.statusCode})`, color);
    } catch (error) {
      log(`   ❌ ${asset} (${error.message})`, 'red');
    }
  }
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║     NEXX Service Center - Comprehensive Site Test     ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  const results = [];
  
  // Test main pages
  results.push(await testPage('/', 'Landing Page (Home)'));
  results.push(await testPage('/nexx', 'NEXX Database (PIN-protected)'));
  results.push(await testPage('/cabinet', 'Cabinet/Dashboard'));
  
  // Test static assets
  await testStaticAssets();
  
  // Summary
  log('\n' + '═'.repeat(60), 'bright');
  log('📊 TEST SUMMARY', 'bright');
  log('═'.repeat(60), 'bright');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  log(`\n✅ Successful: ${successful}`, 'green');
  log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  
  if (failed > 0) {
    log('\n⚠️ Failed Tests:', 'yellow');
    results.filter(r => !r.success).forEach(r => {
      log(`   - ${r.url} (${r.statusCode || r.error})`, 'red');
    });
  }
  
  log('\n' + '═'.repeat(60), 'bright');
  log('\n💡 Next Steps:', 'cyan');
  log('   1. Open http://localhost:5173/ in your browser', 'blue');
  log('   2. Check browser console for JavaScript errors', 'blue');
  log('   3. Test calculator functionality manually', 'blue');
  log('   4. Test PIN entry on /nexx page (PIN: 31618585)', 'blue');
  log('   5. Verify all sections render correctly\n', 'blue');
  
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
