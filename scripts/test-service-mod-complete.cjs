#!/usr/bin/env node
/**
 * Complete Service Mod PIN Authentication Flow Test
 * Tests http://localhost:5175/
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5175';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'test-screenshots-service-mod-complete');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Create screenshots directory
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
  log('║   Complete Service Mod PIN Authentication Flow Test   ║', 'bright');
  log('║              http://localhost:5175/                    ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  log(`📂 Screenshots will be saved to: ${SCREENSHOTS_DIR}\n`, 'blue');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  // Capture console messages
  const consoleLogs = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleLogs.push({ type, text, timestamp: new Date().toISOString() });
    
    if (type === 'error') {
      log(`      🔴 Console Error: ${text}`, 'red');
    } else if (type === 'warning') {
      log(`      ⚠️ Console Warning: ${text}`, 'yellow');
    } else if (text.includes('Service') || text.includes('auth') || text.includes('PIN') || text.includes('🔐')) {
      log(`      📝 Console: ${text}`, 'blue');
    }
  });
  
  page.on('pageerror', error => {
    log(`      ❌ Page Error: ${error.message}`, 'red');
    consoleLogs.push({ type: 'pageerror', text: error.message, timestamp: new Date().toISOString() });
  });
  
  // Capture network requests
  const networkRequests = [];
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/') || url.includes('auth') || url.includes('login')) {
      const req = {
        type: 'request',
        method: request.method(),
        url: url,
        headers: request.headers(),
        postData: request.postData(),
        timestamp: new Date().toISOString()
      };
      networkRequests.push(req);
      log(`      🌐 Request: ${request.method()} ${url}`, 'cyan');
      if (req.postData) {
        log(`         POST Data: ${req.postData}`, 'blue');
      }
    }
  });
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/') || url.includes('auth') || url.includes('login')) {
      const status = response.status();
      const statusText = response.statusText();
      let body = null;
      
      try {
        body = await response.text();
      } catch (e) {
        body = '[Could not read response body]';
      }
      
      const res = {
        type: 'response',
        status,
        statusText,
        url: url,
        headers: response.headers(),
        body,
        timestamp: new Date().toISOString()
      };
      networkRequests.push(res);
      
      const statusColor = status >= 200 && status < 300 ? 'green' : status >= 400 ? 'red' : 'yellow';
      log(`      📡 Response: ${status} ${statusText} - ${url}`, statusColor);
      if (body && body.length < 500) {
        log(`         Body: ${body}`, 'blue');
      }
    }
  });
  
  try {
    // STEP 1: Navigate to page
    log('═'.repeat(60), 'cyan');
    log('STEP 1: Navigate to http://localhost:5175/', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    log('   ✅ Page loaded', 'green');
    
    // STEP 2: Wait for page to fully load
    log('\n═'.repeat(60), 'cyan');
    log('STEP 2: Waiting 3 seconds for full page load', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.waitForTimeout(3000);
    log('   ✅ Wait complete', 'green');
    
    await takeScreenshot(page, 'page-loaded');
    
    // STEP 3 & 4: Check if window.openServiceModAuth exists
    log('\n═'.repeat(60), 'cyan');
    log('STEP 3-4: Checking window.openServiceModAuth', 'bright');
    log('═'.repeat(60), 'cyan');
    
    const functionCheck = await page.evaluate(() => {
      return {
        exists: typeof window.openServiceModAuth,
        isFunction: typeof window.openServiceModAuth === 'function',
        windowKeys: Object.keys(window).filter(k => 
          k.toLowerCase().includes('service') || 
          k.toLowerCase().includes('auth') ||
          k.toLowerCase().includes('modal')
        )
      };
    });
    
    log(`   📋 typeof window.openServiceModAuth: "${functionCheck.exists}"`, 'blue');
    
    if (functionCheck.isFunction) {
      log('   ✅ window.openServiceModAuth is a function!', 'green');
    } else {
      log('   ❌ window.openServiceModAuth is NOT a function', 'red');
      log(`   📋 Related window properties found: ${functionCheck.windowKeys.join(', ') || 'none'}`, 'blue');
    }
    
    // STEP 5: Call the function if it exists
    if (functionCheck.isFunction) {
      log('\n═'.repeat(60), 'cyan');
      log('STEP 5: Calling window.openServiceModAuth()', 'bright');
      log('═'.repeat(60), 'cyan');
      
      await page.evaluate(() => {
        console.log('🔐 About to call window.openServiceModAuth()');
        window.openServiceModAuth();
        console.log('🔐 Called window.openServiceModAuth()');
      });
      
      log('   ✅ Function called', 'green');
      await page.waitForTimeout(1500);
      
      await takeScreenshot(page, 'after-function-call');
    } else {
      // STEP 6: Check for React errors
      log('\n═'.repeat(60), 'cyan');
      log('STEP 6: Checking for React Rendering Errors', 'bright');
      log('═'.repeat(60), 'cyan');
      
      const errors = consoleLogs.filter(log => log.type === 'error' || log.type === 'pageerror');
      if (errors.length > 0) {
        log(`   🔴 Found ${errors.length} errors:`, 'red');
        errors.forEach(err => {
          log(`      - ${err.text}`, 'red');
        });
      } else {
        log('   ✅ No React errors found', 'green');
      }
    }
    
    // STEP 7: Take screenshot of current state
    log('\n═'.repeat(60), 'cyan');
    log('STEP 7: Current Page State', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await takeScreenshot(page, 'current-state');
    
    // Check if modal is visible
    const modalCheck = await page.evaluate(() => {
      const modalSelectors = [
        '[role="dialog"]',
        '[class*="modal"]',
        '[class*="Modal"]',
        '[aria-modal="true"]',
        '.modal'
      ];
      
      for (const selector of modalSelectors) {
        const modal = document.querySelector(selector);
        if (modal) {
          const styles = window.getComputedStyle(modal);
          const isVisible = styles.display !== 'none' && 
                           styles.visibility !== 'hidden' && 
                           styles.opacity !== '0';
          if (isVisible) {
            return {
              found: true,
              selector,
              text: modal.textContent.substring(0, 200),
              hasInput: !!modal.querySelector('input'),
              hasButton: !!modal.querySelector('button')
            };
          }
        }
      }
      return { found: false };
    });
    
    if (modalCheck.found) {
      log('   ✅ Modal is visible!', 'green');
      log(`      Selector: ${modalCheck.selector}`, 'blue');
      log(`      Text: ${modalCheck.text}`, 'blue');
      log(`      Has input: ${modalCheck.hasInput}`, 'blue');
      log(`      Has button: ${modalCheck.hasButton}`, 'blue');
      
      // STEP 8: Enter PIN
      log('\n═'.repeat(60), 'cyan');
      log('STEP 8: Entering PIN: 31618585', 'bright');
      log('═'.repeat(60), 'cyan');
      
      const pinInputSelectors = [
        'input[type="password"]',
        'input[type="text"]',
        'input[type="number"]',
        'input[placeholder*="PIN"]',
        'input[placeholder*="pin"]',
        'input[name="pin"]',
        '[role="dialog"] input',
        '.modal input',
      ];
      
      let pinInput = null;
      for (const selector of pinInputSelectors) {
        try {
          const input = await page.$(selector);
          if (input) {
            const isVisible = await input.isVisible();
            if (isVisible) {
              pinInput = input;
              log(`   ✅ PIN input found: ${selector}`, 'green');
              break;
            }
          }
        } catch (e) {}
      }
      
      if (pinInput) {
        await pinInput.fill('31618585');
        log('   ✅ PIN entered: 31618585', 'green');
        await page.waitForTimeout(500);
        
        await takeScreenshot(page, 'pin-entered');
        
        // STEP 9: Click submit button
        log('\n═'.repeat(60), 'cyan');
        log('STEP 9: Clicking Submit/Login Button', 'bright');
        log('═'.repeat(60), 'cyan');
        
        const submitSelectors = [
          'button[type="submit"]',
          'button:has-text("Submit")',
          'button:has-text("Login")',
          'button:has-text("Enter")',
          'button:has-text("OK")',
          'button:has-text("Войти")',
          '[role="dialog"] button',
          '.modal button',
        ];
        
        let submitButton = null;
        for (const selector of submitSelectors) {
          try {
            const btn = await page.$(selector);
            if (btn) {
              const isVisible = await btn.isVisible();
              if (isVisible) {
                submitButton = btn;
                log(`   ✅ Submit button found: ${selector}`, 'green');
                break;
              }
            }
          } catch (e) {}
        }
        
        if (submitButton) {
          const requestsBefore = networkRequests.length;
          
          log('   🖱️ Clicking submit button...', 'cyan');
          await submitButton.click();
          log('   ✅ Button clicked', 'green');
          
          // Wait for network activity
          await page.waitForTimeout(3000);
          
          await takeScreenshot(page, 'after-submit');
          
          // STEP 10: Check network requests
          log('\n═'.repeat(60), 'cyan');
          log('STEP 10: Network Activity - /api/auth/login', 'bright');
          log('═'.repeat(60), 'cyan');
          
          const newRequests = networkRequests.slice(requestsBefore);
          
          if (newRequests.length > 0) {
            log(`   📊 Found ${newRequests.length} network requests after submit`, 'green');
            
            const authRequests = newRequests.filter(r => 
              r.url.includes('/api/auth/login') || 
              r.url.includes('auth') || 
              r.url.includes('login')
            );
            
            if (authRequests.length > 0) {
              log('\n   🔐 Authentication Requests:', 'green');
              authRequests.forEach((req, i) => {
                log(`\n   Request ${i + 1}:`, 'cyan');
                if (req.type === 'request') {
                  log(`      Method: ${req.method}`, 'blue');
                  log(`      URL: ${req.url}`, 'blue');
                  if (req.postData) {
                    log(`      POST Data: ${req.postData}`, 'blue');
                  }
                } else if (req.type === 'response') {
                  const statusColor = req.status >= 200 && req.status < 300 ? 'green' : 'red';
                  log(`      Status: ${req.status} ${req.statusText}`, statusColor);
                  log(`      URL: ${req.url}`, 'blue');
                  if (req.body && req.body.length < 1000) {
                    log(`      Response Body:`, 'blue');
                    log(`      ${req.body}`, 'blue');
                  }
                }
              });
            } else {
              log('   ⚠️ No /api/auth/login requests found', 'yellow');
              log('   💡 Showing all requests:', 'blue');
              newRequests.forEach((req, i) => {
                if (req.type === 'request') {
                  log(`      ${i + 1}. ${req.method} ${req.url}`, 'blue');
                } else if (req.type === 'response') {
                  log(`      ${i + 1}. Response ${req.status} - ${req.url}`, 'blue');
                }
              });
            }
          } else {
            log('   ⚠️ No network requests detected after submit', 'yellow');
          }
          
          // STEP 11: Check if redirected to /nexx
          log('\n═'.repeat(60), 'cyan');
          log('STEP 11: Checking for Redirect to /nexx', 'bright');
          log('═'.repeat(60), 'cyan');
          
          await page.waitForTimeout(2000);
          
          const currentUrl = page.url();
          log(`   📍 Current URL: ${currentUrl}`, 'blue');
          
          if (currentUrl.includes('/nexx')) {
            log('   ✅ Successfully redirected to /nexx!', 'green');
            await takeScreenshot(page, 'redirected-to-nexx');
          } else {
            log('   ⚠️ Not redirected to /nexx', 'yellow');
            log('   💡 Still on: ' + currentUrl, 'blue');
          }
          
        } else {
          log('   ❌ Submit button not found', 'red');
        }
      } else {
        log('   ❌ PIN input not found', 'red');
      }
      
    } else {
      log('   ⚠️ Modal not visible', 'yellow');
      
      // Try clicking the Service button in header
      log('\n═'.repeat(60), 'cyan');
      log('ALTERNATIVE: Looking for Service Button in Header', 'bright');
      log('═'.repeat(60), 'cyan');
      
      const serviceButtonSelectors = [
        'button:has-text("Service")',
        'button[title*="Service"]',
        'button:has-text("🔒")',
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
        log('   🖱️ Clicking Service button...', 'cyan');
        await serviceButton.click();
        await page.waitForTimeout(2000);
        
        await takeScreenshot(page, 'after-service-button-click');
        
        // Check again for modal
        const modalCheck2 = await page.evaluate(() => {
          const modal = document.querySelector('[role="dialog"], [class*="modal"]');
          if (modal) {
            const styles = window.getComputedStyle(modal);
            return styles.display !== 'none' && styles.visibility !== 'hidden';
          }
          return false;
        });
        
        if (modalCheck2) {
          log('   ✅ Modal appeared after clicking Service button!', 'green');
        } else {
          log('   ⚠️ Modal still not visible', 'yellow');
        }
      } else {
        log('   ⚠️ Service button not found in header', 'yellow');
      }
    }
    
    // Final summary
    log('\n' + '═'.repeat(60), 'bright');
    log('📊 TEST SUMMARY', 'bright');
    log('═'.repeat(60), 'bright');
    
    log(`\n📸 Screenshots: ${screenshotCounter - 1}`, 'cyan');
    log(`📂 Saved to: ${SCREENSHOTS_DIR}`, 'blue');
    
    log(`\n🐛 Console Logs: ${consoleLogs.length}`, 'cyan');
    const errors = consoleLogs.filter(log => log.type === 'error' || log.type === 'pageerror');
    log(`   Errors: ${errors.length}`, errors.length > 0 ? 'red' : 'green');
    
    log(`\n🌐 Network Requests: ${networkRequests.length}`, 'cyan');
    const authRequests = networkRequests.filter(r => 
      r.url.includes('auth') || r.url.includes('login')
    );
    log(`   Auth-related: ${authRequests.length}`, 'blue');
    
    log(`\n🔐 Service Mod Authentication:`, 'cyan');
    log(`   Function exists: ${functionCheck.isFunction ? '✅' : '❌'}`, functionCheck.isFunction ? 'green' : 'red');
    log(`   Modal appeared: ${modalCheck.found ? '✅' : '❌'}`, modalCheck.found ? 'green' : 'red');
    
    log('\n✅ Test Completed!', 'green');
    log('\n💡 Browser will stay open for manual inspection.', 'cyan');
    log('   Press Ctrl+C in terminal when done.\n', 'blue');
    
    // Keep browser open
    await page.waitForTimeout(300000); // 5 minutes
    
  } catch (error) {
    log(`\n❌ Error during testing: ${error.message}`, 'red');
    console.error(error);
    await takeScreenshot(page, 'error-state');
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
