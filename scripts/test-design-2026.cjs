#!/usr/bin/env node
/**
 * Design System Testing Script 2026
 * Based on best practices for UI/UX testing and design system unification
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - NOT FOUND`, 'red');
    return false;
  }
}

function checkContent(filePath, pattern, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    log(`⚠️  ${description} - File not found`, 'yellow');
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  if (pattern.test(content)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Pattern not found`, 'red');
    return false;
  }
}

function checkDesignTokens() {
  log('\n📐 Checking Design Tokens...', 'cyan');
  
  const checks = [
    checkContent('public/static/ui-components.js', /theme\s*=\s*\{/, 'Design tokens defined'),
    checkContent('public/static/ui-components.js', /colors:\s*\{/, 'Color tokens defined'),
    checkContent('public/static/ui-components.js', /transitions:\s*\{/, 'Transition tokens defined'),
  ];
  
  return checks.every(Boolean);
}

function checkComponentConsistency() {
  log('\n🧩 Checking Component Consistency...', 'cyan');
  
  const checks = [
    checkContent('public/static/ui-components.js', /const\s+Button\s*=/, 'Button component exists'),
    checkContent('public/static/ui-components.js', /const\s+Modal\s*=/, 'Modal component exists'),
    checkContent('public/static/ui-components.js', /const\s+Header\s*=/, 'Header component exists'),
    checkContent('public/static/ui-components.js', /const\s+Footer\s*=/, 'Footer component exists'),
  ];
  
  return checks.every(Boolean);
}

function checkFOUCPrevention() {
  log('\n⚡ Checking FOUC Prevention...', 'cyan');
  
  const checks = [
    checkContent('index.html', /body:not\(\.react-loaded\)\s+#app/, 'FOUC prevention CSS'),
    checkContent('index.html', /react-ready/, 'React ready class'),
    checkContent('index.html', /react-loaded/, 'React loaded class'),
    checkContent('index.html', /styles-loaded/, 'Styles loaded class'),
  ];
  
  return checks.every(Boolean);
}

function checkMobileResponsiveness() {
  log('\n📱 Checking Mobile Responsiveness...', 'cyan');
  
  const checks = [
    checkContent('index.html', /viewport/, 'Viewport meta tag'),
    checkContent('index.html', /@media.*max-width.*768/, 'Mobile media queries'),
    checkContent('public/static/ui-components.js', /md:hidden|md:flex/, 'Responsive utilities'),
  ];
  
  return checks.every(Boolean);
}

function checkAccessibility() {
  log('\n♿ Checking Accessibility...', 'cyan');
  
  const checks = [
    checkContent('index.html', /aria-label/, 'ARIA labels'),
    checkContent('index.html', /alt=/, 'Image alt attributes'),
    checkContent('index.html', /focus:outline/, 'Focus styles'),
  ];
  
  return checks.every(Boolean);
}

function checkPerformance() {
  log('\n⚡ Checking Performance Optimizations...', 'cyan');
  
  const checks = [
    checkContent('index.html', /preconnect|dns-prefetch/, 'Resource hints'),
    checkContent('index.html', /async|defer/, 'Async/defer scripts'),
    checkFile('public/sw.js', 'Service Worker exists'),
  ];
  
  return checks.every(Boolean);
}

function checkDesignUnification() {
  log('\n🎨 Checking Design Unification...', 'cyan');
  
  // Check for consistent color usage
  const uiComponents = fs.readFileSync('public/static/ui-components.js', 'utf8');
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  
  const hasConsistentColors = 
    (uiComponents.match(/bg-gray-\d+|bg-slate-\d+|bg-zinc-\d+/g) || []).length > 0 &&
    !uiComponents.includes('bg-white/20') || uiComponents.includes('bg-transparent');
  
  if (hasConsistentColors) {
    log('✅ Consistent color usage', 'green');
  } else {
    log('⚠️  Check color consistency (avoid bg-white/20 on dark backgrounds)', 'yellow');
  }
  
  // Check for white squares issue in header (critical)
  // bg-white/20 is OK in other contexts (cards, modals), but not in header buttons
  const headerHasWhiteSquares = 
    (uiComponents.includes('bg-white/20') && !uiComponents.includes('bg-transparent')) ||
    (indexHtml.includes('bg-white/20') && !indexHtml.includes('bg-transparent border'));
  
  // Check if header buttons use transparent background
  const headerButtonsFixed = 
    uiComponents.includes('bg-transparent hover:bg-white/10 border border-white/20');
  
  if (headerButtonsFixed && !headerHasWhiteSquares) {
    log('✅ Header buttons use transparent background (no white squares)', 'green');
  } else if (headerButtonsFixed) {
    log('✅ Header buttons fixed, but check other bg-white/20 usage', 'yellow');
  } else {
    log('❌ Header buttons may have white squares - check bg-white/20 usage', 'red');
  }
  
  return headerButtonsFixed;
}

function main() {
  log('\n🧪 NEXX Design System Testing 2026\n', 'blue');
  log('='.repeat(50), 'cyan');
  
  const results = {
    designTokens: checkDesignTokens(),
    componentConsistency: checkComponentConsistency(),
    foucPrevention: checkFOUCPrevention(),
    mobileResponsiveness: checkMobileResponsiveness(),
    accessibility: checkAccessibility(),
    performance: checkPerformance(),
    designUnification: checkDesignUnification(),
  };
  
  log('\n' + '='.repeat(50), 'cyan');
  log('\n📊 Test Results Summary:', 'blue');
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    log(`${icon} ${test}: ${passed ? 'PASSED' : 'FAILED'}`, color);
  });
  
  log(`\n📈 Score: ${passed}/${total} (${Math.round(passed/total*100)}%)`, 
    passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 All tests passed! Design system is unified and ready.', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some tests failed. Please review and fix issues.', 'yellow');
    process.exit(1);
  }
}

main();
