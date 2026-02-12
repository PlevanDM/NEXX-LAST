#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'test-screenshots-debug');

const colors = {
  reset: '\x1b[0m', bright: '\x1b[1m', red: '\x1b[31m', green: '\x1b[32m',
  yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m', magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

let screenshotCounter = 1;
async function takeScreenshot(page, name) {
  const filename = `${String(screenshotCounter).padStart(2, '0')}-${name}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  log(`   📸 Screenshot ${screenshotCounter}: ${filename}`, 'green');
  screenshotCounter++;
  return filepath;
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║      Service Mod Detailed Debugging Test              ║', 'bright');
  log('║           http://localhost:5173/                       ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  const consoleLogs = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleLogs.push({ type, text, timestamp: new Date().toISOString() });
    if (type === 'error') log(`      🔴 Console Error: ${text}`, 'red');
    else if (type === 'warning') log(`      ⚠️ Console Warning: ${text}`, 'yellow');
  });
  
  page.on('pageerror', error => {
    log(`      ❌ Page Error: ${error.message}`, 'red');
    consoleLogs.push({ type: 'pageerror', text: error.message, timestamp: new Date().toISOString() });
  });
  
  try {
    // STEP 1: Navigate
    log('═'.repeat(60), 'cyan');
    log('STEP 1: Navigate to http://localhost:5173/', 'bright');
    log('═'.repeat(60), 'cyan');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    log('   ✅ Page loaded', 'green');
    
    // STEP 2: Wait 5 seconds
    log('\n═'.repeat(60), 'cyan');
    log('STEP 2: Waiting 5 seconds for full page load', 'bright');
    log('═'.repeat(60), 'cyan');
    await page.waitForTimeout(5000);
    log('   ✅ Wait complete', 'green');
    
    // STEP 3: Initial screenshot
    log('\n═'.repeat(60), 'cyan');
    log('STEP 3: Taking initial screenshot', 'bright');
    log('═'.repeat(60), 'cyan');
    await takeScreenshot(page, 'initial-page');
    
    // STEP 4: Console commands
    log('\n═'.repeat(60), 'cyan');
    log('STEP 4: Running Console Commands', 'bright');
    log('═'.repeat(60), 'cyan');
    
    const checks = [
      { cmd: 'typeof window.React', desc: 'React loaded' },
      { cmd: 'typeof window.ReactDOM', desc: 'ReactDOM loaded' },
      { cmd: 'typeof window.openServiceModAuth', desc: 'openServiceModAuth function' },
      { cmd: 'typeof window.NEXXDesign?.Header', desc: 'NEXXDesign.Header' },
      { cmd: 'document.querySelectorAll(".landing-app").length', desc: 'landing-app elements' },
      { cmd: 'document.querySelectorAll("[class*=\\"landing\\"]").length', desc: 'elements with "landing" class' },
      { cmd: 'document.getElementById("app")?.innerHTML?.substring(0, 200)', desc: '#app innerHTML (first 200 chars)' },
    ];
    
    const results = {};
    for (const check of checks) {
      try {
        const result = await page.evaluate((cmd) => {
          try {
            return { success: true, value: eval(cmd) };
          } catch (e) {
            return { success: false, error: e.message };
          }
        }, check.cmd);
        
        results[check.cmd] = result;
        
        log(`\n   ${String.fromCharCode(97 + checks.indexOf(check))}) ${check.cmd}`, 'cyan');
        log(`      Description: ${check.desc}`, 'blue');
        
        if (result.success) {
          const value = typeof result.value === 'string' ? 
            `"${result.value}"` : 
            JSON.stringify(result.value);
          log(`      Result: ${value}`, 'green');
          
          // Check expectations
          if (check.cmd.includes('typeof window.React') && result.value !== 'object') {
            log(`      ⚠️ Expected: "object", Got: "${result.value}"`, 'yellow');
          }
          if (check.cmd.includes('typeof window.ReactDOM') && result.value !== 'object') {
            log(`      ⚠️ Expected: "object", Got: "${result.value}"`, 'yellow');
          }
          if (check.cmd.includes('typeof window.openServiceModAuth') && result.value !== 'function') {
            log(`      ⚠️ Expected: "function", Got: "${result.value}"`, 'yellow');
          }
        } else {
          log(`      ❌ Error: ${result.error}`, 'red');
        }
      } catch (e) {
        log(`      ❌ Failed to execute: ${e.message}`, 'red');
      }
    }
    
    await takeScreenshot(page, 'after-console-checks');
    
    // STEP 5: Call openServiceModAuth if it exists
    log('\n═'.repeat(60), 'cyan');
    log('STEP 5: Checking window.openServiceModAuth', 'bright');
    log('═'.repeat(60), 'cyan');
    
    const funcExists = results['typeof window.openServiceModAuth'];
    if (funcExists?.success && funcExists.value === 'function') {
      log('   ✅ window.openServiceModAuth exists!', 'green');
      log('   🖱️ Calling window.openServiceModAuth()...', 'cyan');
      
      await page.evaluate(() => {
        console.log('🔐 About to call window.openServiceModAuth()');
        window.openServiceModAuth();
        console.log('🔐 Called window.openServiceModAuth()');
      });
      
      await page.waitForTimeout(2000);
      await takeScreenshot(page, 'after-function-call');
      
      // Check if modal appeared
      const modalCheck = await page.evaluate(() => {
        const selectors = ['[role="dialog"]', '[class*="modal"]', '[aria-modal="true"]'];
        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el) {
            const styles = window.getComputedStyle(el);
            if (styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0') {
              return { found: true, selector: sel, text: el.textContent.substring(0, 200) };
            }
          }
        }
        return { found: false };
      });
      
      if (modalCheck.found) {
        log('   ✅ Modal appeared!', 'green');
        log(`      Selector: ${modalCheck.selector}`, 'blue');
        log(`      Text: ${modalCheck.text}`, 'blue');
      } else {
        log('   ⚠️ Modal did not appear', 'yellow');
      }
    } else {
      log('   ❌ window.openServiceModAuth does NOT exist', 'red');
      log(`      typeof result: ${funcExists?.value || 'undefined'}`, 'blue');
    }
    
    // STEP 6: Check console errors
    log('\n═'.repeat(60), 'cyan');
    log('STEP 6: Console Errors & Warnings', 'bright');
    log('═'.repeat(60), 'cyan');
    
    const errors = consoleLogs.filter(l => l.type === 'error' || l.type === 'pageerror');
    const warnings = consoleLogs.filter(l => l.type === 'warning');
    
    if (errors.length > 0) {
      log(`   🔴 Found ${errors.length} errors:`, 'red');
      errors.forEach((err, i) => {
        log(`      ${i + 1}. ${err.text}`, 'red');
      });
    } else {
      log('   ✅ No console errors', 'green');
    }
    
    if (warnings.length > 0) {
      log(`\n   ⚠️ Found ${warnings.length} warnings:`, 'yellow');
      warnings.slice(0, 5).forEach((warn, i) => {
        log(`      ${i + 1}. ${warn.text}`, 'yellow');
      });
    }
    
    // STEP 7: Try clicking Service button
    log('\n═'.repeat(60), 'cyan');
    log('STEP 7: Looking for Service Button in Header', 'bright');
    log('═'.repeat(60), 'cyan');
    
    const serviceButtonSelectors = [
      'button:has-text("Service")',
      'a:has-text("Service")',
      'button[title*="Service"]',
      '[class*="service"]',
    ];
    
    let serviceButton = null;
    for (const selector of serviceButtonSelectors) {
      try {
        const btn = await page.$(selector);
        if (btn) {
          const isVisible = await btn.isVisible();
          if (isVisible) {
            serviceButton = btn;
            log(`   ✅ Service button found: ${selector}`, 'green');
            break;
          }
        }
      } catch (e) {}
    }
    
    if (serviceButton) {
      await takeScreenshot(page, 'before-service-click');
      log('   🖱️ Clicking Service button...', 'cyan');
      await serviceButton.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, 'after-service-click');
      
      const modalCheck2 = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"], [class*="modal"]');
        if (modal) {
          const styles = window.getComputedStyle(modal);
          return styles.display !== 'none' && styles.visibility !== 'hidden';
        }
        return false;
      });
      
      if (modalCheck2) {
        log('   ✅ Modal appeared after clicking!', 'green');
      } else {
        log('   ⚠️ Modal did not appear', 'yellow');
      }
    } else {
      log('   ⚠️ Service button not found', 'yellow');
    }
    
    // Summary
    log('\n' + '═'.repeat(60), 'bright');
    log('📊 DETAILED DEBUG SUMMARY', 'bright');
    log('═'.repeat(60), 'bright');
    
    log('\n🔍 Console Command Results:', 'cyan');
    for (const [cmd, result] of Object.entries(results)) {
      const value = result.success ? JSON.stringify(result.value) : `Error: ${result.error}`;
      log(`   ${cmd} = ${value}`, result.success ? 'blue' : 'red');
    }
    
    log(`\n📸 Screenshots: ${screenshotCounter - 1}`, 'cyan');
    log(`🐛 Console Errors: ${errors.length}`, errors.length > 0 ? 'red' : 'green');
    log(`⚠️ Console Warnings: ${warnings.length}`, 'yellow');
    
    log('\n✅ Test Completed!', 'green');
    log('\n💡 Browser will stay open for manual inspection.', 'cyan');
    log('   Press Ctrl+C when done.\n', 'blue');
    
    await page.waitForTimeout(300000);
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    console.error(error);
  } finally {
    await browser.close();
    log('\n🔒 Browser closed\n', 'cyan');
  }
}

main().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
