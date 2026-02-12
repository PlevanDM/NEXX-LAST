#!/usr/bin/env node
/**
 * Manual Browser Check Script
 * Opens the site in a real browser for manual inspection
 */

const { chromium } = require('playwright');

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

async function main() {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║     NEXX Service Center - Manual Browser Check        ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  log('🚀 Launching browser in headed mode...', 'cyan');
  log('   The browser will stay open for manual inspection.\n', 'blue');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  // Capture console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      log(`   🔴 Console Error: ${text}`, 'red');
    } else if (type === 'warning') {
      log(`   ⚠️ Console Warning: ${text}`, 'yellow');
    } else if (type === 'log') {
      log(`   📝 Console Log: ${text}`, 'blue');
    }
  });
  
  page.on('pageerror', error => {
    log(`   ❌ Page Error: ${error.message}`, 'red');
  });
  
  try {
    log('📍 Navigating to Landing Page...', 'cyan');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    log('✅ Page loaded!', 'green');
    log('\n' + '═'.repeat(60), 'bright');
    log('🔍 MANUAL INSPECTION CHECKLIST', 'bright');
    log('═'.repeat(60), 'bright');
    
    log('\n1. Landing Page (/):', 'cyan');
    log('   [ ] Hero section visible', 'blue');
    log('   [ ] Services section visible', 'blue');
    log('   [ ] Calculator section visible', 'blue');
    log('   [ ] Gallery section visible', 'blue');
    log('   [ ] Reviews section visible', 'blue');
    log('   [ ] Contact section visible', 'blue');
    log('   [ ] No console errors', 'blue');
    
    log('\n2. Calculator (#calculator):', 'cyan');
    log('   [ ] Can select brand', 'blue');
    log('   [ ] Can select device type', 'blue');
    log('   [ ] Price calculation works', 'blue');
    
    log('\n3. NEXX Database (/nexx):', 'cyan');
    log('   [ ] PIN screen appears', 'blue');
    log('   [ ] Can enter PIN: 31618585', 'blue');
    log('   [ ] Database loads after PIN', 'blue');
    
    log('\n4. Cabinet (/cabinet):', 'cyan');
    log('   [ ] Dashboard loads', 'blue');
    log('   [ ] Navigation works', 'blue');
    
    log('\n' + '═'.repeat(60), 'bright');
    log('\n💡 Instructions:', 'yellow');
    log('   1. Check the browser window that just opened', 'blue');
    log('   2. Manually test all features listed above', 'blue');
    log('   3. Check the console for errors (F12)', 'blue');
    log('   4. Navigate to /nexx and /cabinet', 'blue');
    log('   5. Press Ctrl+C in this terminal when done\n', 'blue');
    
    // Wait for user to inspect
    await page.waitForTimeout(300000); // 5 minutes
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
  } finally {
    log('\n🔒 Closing browser...', 'cyan');
    await browser.close();
  }
}

main().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
