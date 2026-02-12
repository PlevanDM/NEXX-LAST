#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'test-screenshots-5173-final');

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
  log('║   ServiceMod PIN Authentication Test - Port 5173      ║', 'bright');
  log('║              CRITICAL: Must use port 5173!             ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  const consoleLogs = [];
  const networkActivity = [];
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleLogs.push({ type, text, timestamp: new Date().toISOString() });
    if (type === 'error') log(`      🔴 Console Error: ${text}`, 'red');
    else if (type === 'warning') log(`      ⚠️ Console Warning: ${text}`, 'yellow');
    else if (text.includes('🔐') || text.includes('Service') || text.includes('auth')) {
      log(`      📝 Console: ${text}`, 'blue');
    }
  });
  
  page.on('pageerror', error => {
    log(`      ❌ Page Error: ${error.message}`, 'red');
    consoleLogs.push({ type: 'pageerror', text: error.message, timestamp: new Date().toISOString() });
  });
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/') || url.includes('auth') || url.includes('login')) {
      const req = {
        type: 'request',
        method: request.method(),
        url: url,
        postData: request.postData(),
        timestamp: new Date().toISOString()
      };
      networkActivity.push(req);
      log(`      🌐 Request: ${request.method()} ${url}`, 'cyan');
      if (req.postData) log(`         POST: ${req.postData}`, 'blue');
    }
  });
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/') || url.includes('auth') || url.includes('login')) {
      const status = response.status();
      let body = null;
      try { body = await response.text(); } catch (e) { body = '[unreadable]'; }
      
      networkActivity.push({
        type: 'response',
        status,
        statusText: response.statusText(),
        url: url,
        body,
        timestamp: new Date().toISOString()
      });
      
      const color = status >= 200 && status < 300 ? 'green' : 'red';
      log(`      📡 Response: ${status} ${response.statusText()} - ${url}`, color);
      if (body && body.length < 500) log(`         Body: ${body}`, 'blue');
    }
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
    
    // STEP 3: Screenshot
    log('\n═'.repeat(60), 'cyan');
    log('STEP 3: Taking initial screenshot', 'bright');
    log('═'.repeat(60), 'cyan');
    await takeScreenshot(page, 'initial-page');
    
    // STEP 4: Check window.React
    log('\n═'.repeat(60), 'cyan');
    log('STEP 4: Checking typeof window.React', 'bright');
    log('═'.repeat(60), 'cyan');
    
    const reactType = await page.evaluate(() => typeof window.React);
    log(`   📋 typeof window.React = "${reactType}"`, reactType === 'object' ? 'green' : 'red');
    
    // STEP 5: Check window.openServiceModAuth
    log('\n═'.repeat(60), 'cyan');
    log('STEP 5: Checking typeof window.openServiceModAuth', 'bright');
    log('═'.repeat(60), 'cyan');
    
    const funcType = await page.evaluate(() => typeof window.openServiceModAuth);
    log(`   📋 typeof window.openServiceModAuth = "${funcType}"`, funcType === 'function' ? 'green' : 'red');
    
    if (funcType === 'function') {
      // STEP 6: Function exists - test the flow
      log('\n═'.repeat(60), 'cyan');
      log('STEP 6: openServiceModAuth is a function!', 'bright');
      log('═'.repeat(60), 'cyan');
      
      // 6a: Call the function
      log('\n   6a) Calling window.openServiceModAuth()...', 'cyan');
      await page.evaluate(() => {
        console.log('🔐 Calling window.openServiceModAuth()');
        window.openServiceModAuth();
      });
      
      // 6b: Wait and screenshot
      log('   6b) Waiting 1 second...', 'cyan');
      await page.waitForTimeout(1000);
      await takeScreenshot(page, 'after-function-call');
      
      // Check if modal appeared
      const modalVisible = await page.evaluate(() => {
        const selectors = ['[role="dialog"]', '[class*="modal"]', '[aria-modal="true"]'];
        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el) {
            const styles = window.getComputedStyle(el);
            if (styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0') {
              return true;
            }
          }
        }
        return false;
      });
      
      if (modalVisible) {
        log('   ✅ Modal appeared!', 'green');
        
        // 6c: Find PIN input and type
        log('\n   6c) Finding PIN input and typing 31618585...', 'cyan');
        
        const pinInputSelectors = [
          'input[type="password"]',
          'input[type="text"]',
          'input[placeholder*="PIN"]',
          'input[name="pin"]',
          '[role="dialog"] input',
        ];
        
        let pinInput = null;
        for (const selector of pinInputSelectors) {
          try {
            pinInput = await page.$(selector);
            if (pinInput) {
              const isVisible = await pinInput.isVisible();
              if (isVisible) {
                log(`      ✅ PIN input found: ${selector}`, 'green');
                break;
              }
            }
            pinInput = null;
          } catch (e) {}
        }
        
        if (pinInput) {
          await pinInput.fill('31618585');
          log('      ✅ PIN entered: 31618585', 'green');
          await page.waitForTimeout(500);
          await takeScreenshot(page, 'pin-entered');
          
          // 6d: Find and click submit button
          log('\n   6d) Finding and clicking submit button...', 'cyan');
          
          const submitSelectors = [
            'button:has-text("Accesează")',
            'button:has-text("Submit")',
            'button:has-text("Login")',
            'button[type="submit"]',
            '[role="dialog"] button',
          ];
          
          let submitButton = null;
          for (const selector of submitSelectors) {
            try {
              submitButton = await page.$(selector);
              if (submitButton) {
                const isVisible = await submitButton.isVisible();
                if (isVisible) {
                  const text = await submitButton.textContent();
                  log(`      ✅ Submit button found: ${selector} ("${text}")`, 'green');
                  break;
                }
              }
              submitButton = null;
            } catch (e) {}
          }
          
          if (submitButton) {
            const networkBefore = networkActivity.length;
            
            log('      🖱️ Clicking submit button...', 'cyan');
            await submitButton.click();
            log('      ✅ Button clicked', 'green');
            
            // 6e: Wait 3 seconds for API response
            log('\n   6e) Waiting 3 seconds for API response...', 'cyan');
            await page.waitForTimeout(3000);
            
            // 6f: Screenshot and check URL
            log('\n   6f) Checking current URL and taking screenshot...', 'cyan');
            await takeScreenshot(page, 'after-submit');
            
            const currentUrl = page.url();
            log(`      📍 Current URL: ${currentUrl}`, 'blue');
            
            if (currentUrl.includes('/nexx')) {
              log('      ✅ Redirected to /nexx!', 'green');
            } else {
              log('      ⚠️ Not redirected to /nexx', 'yellow');
            }
            
            // 6g: Check network activity
            log('\n   6g) Checking Network Activity for /api/auth/login...', 'cyan');
            
            const newActivity = networkActivity.slice(networkBefore);
            const authActivity = newActivity.filter(a => 
              a.url.includes('/api/auth/login') || a.url.includes('auth')
            );
            
            if (authActivity.length > 0) {
              log(`      ✅ Found ${authActivity.length} auth-related network requests`, 'green');
              authActivity.forEach((activity, i) => {
                log(`\n      Activity ${i + 1}:`, 'cyan');
                if (activity.type === 'request') {
                  log(`         Type: REQUEST`, 'blue');
                  log(`         Method: ${activity.method}`, 'blue');
                  log(`         URL: ${activity.url}`, 'blue');
                  if (activity.postData) log(`         POST Data: ${activity.postData}`, 'blue');
                } else {
                  log(`         Type: RESPONSE`, 'blue');
                  log(`         Status: ${activity.status} ${activity.statusText}`, activity.status < 400 ? 'green' : 'red');
                  log(`         URL: ${activity.url}`, 'blue');
                  if (activity.body) log(`         Body: ${activity.body}`, 'blue');
                }
              });
            } else {
              log('      ⚠️ No /api/auth/login requests found', 'yellow');
              if (newActivity.length > 0) {
                log('      📋 Other network activity:', 'blue');
                newActivity.forEach((a, i) => {
                  log(`         ${i + 1}. ${a.type === 'request' ? a.method : a.status} ${a.url}`, 'blue');
                });
              }
            }
          } else {
            log('      ❌ Submit button not found', 'red');
          }
        } else {
          log('      ❌ PIN input not found', 'red');
        }
      } else {
        log('   ⚠️ Modal did not appear', 'yellow');
      }
      
    } else {
      // STEP 7: Function doesn't exist
      log('\n═'.repeat(60), 'cyan');
      log('STEP 7: openServiceModAuth is NOT a function', 'bright');
      log('═'.repeat(60), 'cyan');
      
      // 7a: Check console errors
      log('\n   7a) Checking console for errors/warnings...', 'cyan');
      const errors = consoleLogs.filter(l => l.type === 'error' || l.type === 'pageerror');
      const warnings = consoleLogs.filter(l => l.type === 'warning');
      
      if (errors.length > 0) {
        log(`      🔴 Found ${errors.length} errors:`, 'red');
        errors.forEach((err, i) => log(`         ${i + 1}. ${err.text}`, 'red'));
      } else {
        log('      ✅ No console errors', 'green');
      }
      
      if (warnings.length > 0) {
        log(`      ⚠️ Found ${warnings.length} warnings:`, 'yellow');
        warnings.slice(0, 5).forEach((warn, i) => log(`         ${i + 1}. ${warn.text}`, 'yellow'));
      }
      
      // 7b: Check landing-app elements
      log('\n   7b) Running: document.querySelectorAll(".landing-app").length', 'cyan');
      const landingAppCount = await page.evaluate(() => document.querySelectorAll('.landing-app').length);
      log(`      Result: ${landingAppCount}`, landingAppCount > 0 ? 'green' : 'red');
      
      // 7c: Check #app innerHTML
      log('\n   7c) Running: document.getElementById("app")?.innerHTML?.substring(0, 500)', 'cyan');
      const appInnerHTML = await page.evaluate(() => document.getElementById('app')?.innerHTML?.substring(0, 500));
      if (appInnerHTML) {
        log(`      Result (first 500 chars):`, 'blue');
        log(`      ${appInnerHTML}`, 'blue');
      } else {
        log(`      Result: ${appInnerHTML}`, 'red');
      }
      
      // 7d: Screenshot
      log('\n   7d) Taking screenshot...', 'cyan');
      await takeScreenshot(page, 'function-not-found');
    }
    
    // ALSO TRY: Look for Service button
    log('\n═'.repeat(60), 'cyan');
    log('ALSO TRY: Looking for "Service" button in header', 'bright');
    log('═'.repeat(60), 'cyan');
    
    const serviceButtonSelectors = [
      'button:has-text("Service")',
      'a:has-text("Service")',
      'button[title*="Service"]',
    ];
    
    let serviceButton = null;
    for (const selector of serviceButtonSelectors) {
      try {
        serviceButton = await page.$(selector);
        if (serviceButton) {
          const isVisible = await serviceButton.isVisible();
          if (isVisible) {
            log(`   ✅ Service button found: ${selector}`, 'green');
            break;
          }
        }
        serviceButton = null;
      } catch (e) {}
    }
    
    if (serviceButton) {
      log('   🖱️ Clicking Service button...', 'cyan');
      await takeScreenshot(page, 'before-service-click');
      await serviceButton.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, 'after-service-click');
    } else {
      log('   ⚠️ Service button not found in header', 'yellow');
    }
    
    // Final Summary
    log('\n' + '═'.repeat(60), 'bright');
    log('📊 FINAL TEST SUMMARY', 'bright');
    log('═'.repeat(60), 'bright');
    
    log(`\n📋 Console Command Results:`, 'cyan');
    log(`   typeof window.React = "${reactType}"`, 'blue');
    log(`   typeof window.openServiceModAuth = "${funcType}"`, 'blue');
    
    log(`\n📸 Screenshots: ${screenshotCounter - 1}`, 'cyan');
    log(`📂 Saved to: ${SCREENSHOTS_DIR}`, 'blue');
    
    log(`\n🐛 Console Logs: ${consoleLogs.length}`, 'cyan');
    log(`   Errors: ${consoleLogs.filter(l => l.type === 'error' || l.type === 'pageerror').length}`, 'red');
    log(`   Warnings: ${consoleLogs.filter(l => l.type === 'warning').length}`, 'yellow');
    
    log(`\n🌐 Network Activity: ${networkActivity.length} requests`, 'cyan');
    
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
