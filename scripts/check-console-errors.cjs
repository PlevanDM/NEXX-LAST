#!/usr/bin/env node
/**
 * Check for potential JavaScript errors by analyzing the HTML and scripts
 */

const BASE_URL = 'http://localhost:5173';

async function checkPage(path, name) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`Checking: ${name}`);
  console.log(`URL: ${BASE_URL}${path}`);
  console.log('═'.repeat(60));

  try {
    const response = await fetch(BASE_URL + path);
    const html = await response.text();

    // Check for inline script errors
    const inlineScripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    console.log(`\n📜 Found ${inlineScripts.length} inline scripts`);

    // Check for external scripts
    const externalScripts = html.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
    console.log(`📦 Found ${externalScripts.length} external scripts`);
    
    if (externalScripts.length > 0) {
      console.log('\n🔗 External Scripts:');
      externalScripts.forEach(script => {
        const srcMatch = script.match(/src=["']([^"']+)["']/);
        if (srcMatch) {
          const src = srcMatch[1];
          console.log(`  • ${src}`);
        }
      });
    }

    // Check for common error patterns
    console.log('\n🔍 Checking for error patterns...');
    const errorPatterns = [
      { pattern: /console\.error/gi, name: 'console.error calls' },
      { pattern: /throw new Error/gi, name: 'throw statements' },
      { pattern: /undefined is not/gi, name: 'undefined errors' },
      { pattern: /Cannot read property/gi, name: 'null reference errors' },
      { pattern: /is not a function/gi, name: 'function errors' },
      { pattern: /404|not found/gi, name: '404 errors' },
      { pattern: /Failed to fetch/gi, name: 'fetch errors' },
      { pattern: /NetworkError/gi, name: 'network errors' }
    ];

    let foundErrors = false;
    errorPatterns.forEach(({ pattern, name }) => {
      const matches = html.match(pattern);
      if (matches) {
        console.log(`  ⚠️ Found ${matches.length} instance(s) of: ${name}`);
        foundErrors = true;
      }
    });

    if (!foundErrors) {
      console.log('  ✅ No error patterns found in HTML');
    }

    // Check for React-specific patterns
    console.log('\n⚛️ React checks:');
    const hasReact = html.includes('react') || html.includes('React');
    const hasReactDOM = html.includes('react-dom') || html.includes('ReactDOM');
    const hasStrictMode = html.includes('StrictMode');
    console.log(`  ${hasReact ? '✅' : '❌'} React detected`);
    console.log(`  ${hasReactDOM ? '✅' : '❌'} ReactDOM detected`);
    console.log(`  ${hasStrictMode ? '✅' : '⚠️'} StrictMode ${hasStrictMode ? 'enabled' : 'not detected'}`);

    // Check for Vite HMR
    const hasViteClient = html.includes('/@vite/client');
    const hasViteHMR = html.includes('vite') || html.includes('hmr');
    console.log(`  ${hasViteClient ? '✅' : '⚠️'} Vite client ${hasViteClient ? 'loaded' : 'not found'}`);
    console.log(`  ${hasViteHMR ? '✅' : '⚠️'} Vite HMR ${hasViteHMR ? 'available' : 'not detected'}`);

    // Check for app mounting
    const hasAppDiv = html.includes('id="app"') || html.includes("id='app'");
    console.log(`  ${hasAppDiv ? '✅' : '❌'} #app container found`);

    // Check for specific page content
    console.log('\n📄 Page-specific checks:');
    if (path === '/') {
      const checks = {
        'NEXX branding': /nexx/gi.test(html),
        'Service info': /service|reparații|repair/gi.test(html),
        'Contact info': /contact|phone|tel/gi.test(html),
        'Hero section': /hero|banner|jumbotron/gi.test(html)
      };
      Object.entries(checks).forEach(([name, passed]) => {
        console.log(`  ${passed ? '✅' : '⚠️'} ${name}`);
      });
    } else if (path === '/nexx') {
      const checks = {
        'PIN input': /pin|password|auth/gi.test(html),
        'Database refs': /database|db|data/gi.test(html),
        'Protected content': /protected|secure|auth/gi.test(html)
      };
      Object.entries(checks).forEach(([name, passed]) => {
        console.log(`  ${passed ? '✅' : '⚠️'} ${name}`);
      });
    } else if (path === '/cabinet') {
      const checks = {
        'Cabinet/Dashboard': /cabinet|dashboard|panel/gi.test(html),
        'Auth system': /auth|login|signin/gi.test(html),
        'User interface': /user|profile|account/gi.test(html)
      };
      Object.entries(checks).forEach(([name, passed]) => {
        console.log(`  ${passed ? '✅' : '⚠️'} ${name}`);
      });
    }

    // Try to fetch and check external scripts
    console.log('\n🔬 Testing external script accessibility...');
    const scriptUrls = externalScripts
      .map(s => {
        const match = s.match(/src=["']([^"']+)["']/);
        return match ? match[1] : null;
      })
      .filter(Boolean)
      .slice(0, 5); // Check first 5 scripts

    for (const scriptUrl of scriptUrls) {
      try {
        const fullUrl = scriptUrl.startsWith('http') ? scriptUrl : BASE_URL + scriptUrl;
        const scriptRes = await fetch(fullUrl);
        const status = scriptRes.status;
        console.log(`  ${status === 200 ? '✅' : '❌'} ${scriptUrl} (${status})`);
      } catch (err) {
        console.log(`  ❌ ${scriptUrl} (${err.message})`);
      }
    }

    return { success: true, hasErrors: foundErrors };
  } catch (error) {
    console.log(`\n❌ Error fetching page: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🧪 NEXX Console Error Check');
  console.log('Analyzing pages for potential JavaScript errors\n');

  const pages = [
    { path: '/', name: 'Landing Page' },
    { path: '/nexx', name: 'NEXX Database' },
    { path: '/cabinet', name: 'Cabinet' }
  ];

  const results = [];
  for (const page of pages) {
    const result = await checkPage(page.path, page.name);
    results.push({ ...page, ...result });
  }

  // Summary
  console.log(`\n\n${'═'.repeat(60)}`);
  console.log('📊 SUMMARY');
  console.log('═'.repeat(60));

  const successful = results.filter(r => r.success).length;
  const withErrors = results.filter(r => r.hasErrors).length;

  console.log(`\n✅ Pages accessible: ${successful}/${results.length}`);
  console.log(`${withErrors > 0 ? '⚠️' : '✅'} Pages with error patterns: ${withErrors}/${results.length}`);

  console.log('\n💡 Note: This checks HTML for error patterns.');
  console.log('   For real-time console errors, open browser DevTools (F12).');
  console.log('   The pages are already open in your browser tabs.');
  console.log('═'.repeat(60) + '\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
