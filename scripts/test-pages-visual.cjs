#!/usr/bin/env node
/**
 * Test pages visually - check HTML structure and content
 * Usage: node scripts/test-pages-visual.cjs
 */

const BASE_URL = 'http://localhost:5173';

async function testPage(path, description) {
  console.log('\n' + '═'.repeat(60));
  console.log(`📄 Testing: ${description}`);
  console.log(`🔗 URL: ${BASE_URL}${path}`);
  console.log('═'.repeat(60));

  try {
    const response = await fetch(BASE_URL + path);
    const html = await response.text();
    
    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    console.log(`📏 Content Length: ${html.length} bytes`);
    
    // Check for common elements
    const checks = {
      'Has <html> tag': html.includes('<html'),
      'Has <body> tag': html.includes('<body'),
      'Has <div id="app">': html.includes('id="app"') || html.includes("id='app'"),
      'Has viewport meta': html.includes('viewport') && html.includes('device-width'),
      'Has script tags': html.includes('<script'),
      'Has CSS/styles': html.includes('<style') || html.includes('.css'),
      'No "error" in title': !html.toLowerCase().includes('<title>error'),
      'No "404" in title': !html.toLowerCase().includes('<title>404'),
    };

    console.log('\n🔍 HTML Structure Checks:');
    for (const [check, passed] of Object.entries(checks)) {
      console.log(`  ${passed ? '✅' : '❌'} ${check}`);
    }

    // Check for specific content based on page
    console.log('\n📋 Content Analysis:');
    if (path === '/') {
      const hasNexxBrand = html.includes('NEXX') || html.includes('nexx');
      const hasServices = html.includes('service') || html.includes('ремонт') || html.includes('reparație');
      const hasContact = html.includes('contact') || html.includes('phone') || html.includes('tel');
      console.log(`  ${hasNexxBrand ? '✅' : '❌'} Contains NEXX branding`);
      console.log(`  ${hasServices ? '✅' : '❌'} Contains service information`);
      console.log(`  ${hasContact ? '✅' : '❌'} Contains contact information`);
    } else if (path === '/nexx') {
      const hasPin = html.includes('pin') || html.includes('PIN') || html.includes('пін') || html.includes('Introduceți');
      const hasDatabase = html.includes('database') || html.includes('база') || html.includes('bază');
      const hasAuth = html.includes('auth') || html.includes('password') || html.includes('parola');
      console.log(`  ${hasPin ? '✅' : '❌'} Contains PIN/password input`);
      console.log(`  ${hasDatabase ? '✅' : '❌'} Contains database references`);
      console.log(`  ${hasAuth ? '✅' : '⚠️'} Contains authentication elements`);
    } else if (path === '/cabinet') {
      const hasCabinet = html.includes('cabinet') || html.includes('кабінет') || html.includes('cabinet');
      const hasAuth = html.includes('auth') || html.includes('login') || html.includes('вхід');
      console.log(`  ${hasCabinet ? '✅' : '❌'} Contains cabinet/dashboard elements`);
      console.log(`  ${hasAuth ? '✅' : '⚠️'} Contains authentication`);
    }

    // Check for potential JavaScript errors in inline scripts
    console.log('\n🐛 Potential Issues:');
    const issues = [];
    if (html.includes('console.error')) issues.push('Contains console.error calls');
    if (html.includes('throw new Error')) issues.push('Contains throw statements');
    if (html.includes('undefined is not')) issues.push('Possible undefined reference');
    if (html.includes('Cannot read property')) issues.push('Possible null reference error');
    if (html.match(/404|not found/gi)) issues.push('Contains 404/not found text');
    
    if (issues.length === 0) {
      console.log('  ✅ No obvious issues detected in HTML');
    } else {
      issues.forEach(issue => console.log(`  ⚠️ ${issue}`));
    }

    // Show a snippet of the page
    console.log('\n📝 HTML Preview (first 500 chars):');
    console.log('─'.repeat(60));
    console.log(html.substring(0, 500).trim());
    console.log('─'.repeat(60));

    return { success: true, status: response.status, html };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🧪 NEXX Landing Page Visual Test');
  console.log('Testing localhost:5173 pages\n');

  const pages = [
    { path: '/', description: 'Landing Page (Home)' },
    { path: '/nexx', description: 'NEXX Database (PIN-protected)' },
    { path: '/cabinet', description: 'Cabinet/Dashboard' },
  ];

  const results = [];
  for (const page of pages) {
    const result = await testPage(page.path, page.description);
    results.push({ ...page, ...result });
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
  }

  // Summary
  console.log('\n\n' + '═'.repeat(60));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(60));
  
  const successful = results.filter(r => r.success).length;
  console.log(`\n✅ Successful: ${successful}/${results.length}`);
  
  results.forEach(r => {
    const status = r.success ? '✅' : '❌';
    console.log(`${status} ${r.path.padEnd(15)} - ${r.description}`);
  });

  console.log('\n' + '═'.repeat(60));
  console.log('💡 Note: This test only checks HTML structure.');
  console.log('   For full visual testing, open pages in a browser.');
  console.log('   For JavaScript errors, check browser console.');
  console.log('═'.repeat(60) + '\n');

  process.exit(successful === results.length ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
