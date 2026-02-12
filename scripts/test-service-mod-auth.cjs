#!/usr/bin/env node
/**
 * Service Mod Authentication Test
 * Tests the Service Mod PIN authentication flow
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5174';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'test-screenshots-service-mod');

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
  log('║        Service Mod PIN Authentication Test            ║', 'bright');
  log('║              http://localhost:5174/                    ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  log(`📂 Screenshots will be saved to: ${SCREENSHOTS_DIR}\n`, 'blue');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
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
    consoleLogs.push({ type, text });
    
    if (type === 'error') {
      log(`      🔴 Console Error: ${text}`, 'red');
    } else if (type === 'warning') {
      log(`      ⚠️ Console Warning: ${text}`, 'yellow');
    } else if (text.includes('Service') || text.includes('auth') || text.includes('PIN')) {
      log(`      📝 Console: ${text}`, 'blue');
    }
  });
  
  page.on('pageerror', error => {
    log(`      ❌ Page Error: ${error.message}`, 'red');
    consoleLogs.push({ type: 'pageerror', text: error.message });
  });
  
  // Capture network requests
  const networkRequests = [];
  page.on('request', request => {
    if (request.url().includes('/api/') || request.url().includes('auth') || request.url().includes('login')) {
      networkRequests.push({
        type: 'request',
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
        postData: request.postData()
      });
      log(`      🌐 Request: ${request.method()} ${request.url()}`, 'cyan');
    }
  });
  
  page.on('response', async response => {
    if (response.url().includes('/api/') || response.url().includes('auth') || response.url().includes('login')) {
      const status = response.status();
      const statusText = response.statusText();
      let body = null;
      
      try {
        body = await response.text();
      } catch (e) {
        body = '[Could not read response body]';
      }
      
      networkRequests.push({
        type: 'response',
        status,
        statusText,
        url: response.url(),
        headers: response.headers(),
        body
      });
      
      const statusColor = status >= 200 && status < 300 ? 'green' : status >= 400 ? 'red' : 'yellow';
      log(`      📡 Response: ${status} ${statusText} - ${response.url()}`, statusColor);
      if (body && body.length < 500) {
        log(`         Body: ${body}`, 'blue');
      }
    }
  });
  
  try {
    // STEP 1: Navigate to landing page
    log('═'.repeat(60), 'cyan');
    log('STEP 1: Navigate to Landing Page', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    await takeScreenshot(page, 'landing-page');
    log('   ✅ Page loaded', 'green');
    
    // STEP 2: DevTools is open (we're monitoring console already)
    log('\n═'.repeat(60), 'cyan');
    log('STEP 2: Monitoring Console (DevTools equivalent)', 'bright');
    log('═'.repeat(60), 'cyan');
    log('   ✅ Console monitoring active', 'green');
    
    // STEP 3: Find Service Mod button
    log('\n═'.repeat(60), 'cyan');
    log('STEP 3: Looking for Service Mod Button', 'bright');
    log('═'.repeat(60), 'cyan');
    
    // Check header/navigation area
    log('\n   Checking header/navigation area...', 'yellow');
    
    const headerContent = await page.evaluate(() => {
      const header = document.querySelector('header, nav, [role="navigation"]');
      if (header) {
        return {
          html: header.innerHTML.substring(0, 500),
          text: header.textContent,
          buttons: Array.from(header.querySelectorAll('button')).map(btn => ({
            text: btn.textContent.trim(),
            class: btn.className,
            id: btn.id
          })),
          links: Array.from(header.querySelectorAll('a')).map(a => ({
            text: a.textContent.trim(),
            href: a.href,
            class: a.className
          }))
        };
      }
      return null;
    });
    
    if (headerContent) {
      log('   ✅ Header found', 'green');
      log(`      Buttons in header: ${headerContent.buttons.length}`, 'blue');
      headerContent.buttons.forEach((btn, i) => {
        log(`         ${i + 1}. "${btn.text}" (class: ${btn.class})`, 'blue');
      });
      log(`      Links in header: ${headerContent.links.length}`, 'blue');
      headerContent.links.slice(0, 5).forEach((link, i) => {
        log(`         ${i + 1}. "${link.text}" -> ${link.href}`, 'blue');
      });
    } else {
      log('   ⚠️ Header not found', 'yellow');
    }
    
    // Look for Service Mod button
    const serviceModSelectors = [
      'button:has-text("Service Mod")',
      'button:has-text("Service")',
      '[class*="service"]',
      '[class*="lock"]',
      'button[class*="lock"]',
      'a:has-text("Service")',
      '[aria-label*="Service"]',
    ];
    
    let serviceModButton = null;
    let foundSelector = null;
    
    for (const selector of serviceModSelectors) {
      try {
        const btn = await page.$(selector);
        if (btn) {
          const isVisible = await btn.isVisible();
          if (isVisible) {
            serviceModButton = btn;
            foundSelector = selector;
            log(`   ✅ Service Mod button found: ${selector}`, 'green');
            break;
          }
        }
      } catch (e) {}
    }
    
    if (!serviceModButton) {
      log('   ⚠️ Service Mod button not found with standard selectors', 'yellow');
      log('   💡 Trying to call window.openServiceModAuth()...', 'cyan');
      
      // Try calling the function directly
      const functionExists = await page.evaluate(() => {
        return typeof window.openServiceModAuth === 'function';
      });
      
      if (functionExists) {
        log('   ✅ window.openServiceModAuth() exists!', 'green');
        log('   🖱️ Calling window.openServiceModAuth()...', 'cyan');
        
        await page.evaluate(() => {
          window.openServiceModAuth();
        });
        
        await page.waitForTimeout(1000);
      } else {
        log('   ❌ window.openServiceModAuth() does not exist', 'red');
        
        // Check what's available
        const windowProps = await page.evaluate(() => {
          const props = Object.keys(window).filter(key => 
            key.toLowerCase().includes('service') || 
            key.toLowerCase().includes('auth') ||
            key.toLowerCase().includes('modal')
          );
          return props;
        });
        
        if (windowProps.length > 0) {
          log('   📋 Found related window properties:', 'blue');
          windowProps.forEach(prop => log(`      - window.${prop}`, 'blue'));
        }
      }
    } else {
      // Click the button
      log(`   🖱️ Clicking Service Mod button...`, 'cyan');
      await serviceModButton.click();
      await page.waitForTimeout(1000);
    }
    
    // STEP 4: Check if modal appeared
    log('\n═'.repeat(60), 'cyan');
    log('STEP 4: Checking for PIN Modal', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await takeScreenshot(page, 'after-service-mod-click');
    
    const modalSelectors = [
      '[role="dialog"]',
      '[class*="modal"]',
      '[class*="Modal"]',
      '[class*="dialog"]',
      '[class*="Dialog"]',
      '.modal',
      '[aria-modal="true"]',
    ];
    
    let modal = null;
    let modalSelector = null;
    
    for (const selector of modalSelectors) {
      modal = await page.$(selector);
      if (modal) {
        const isVisible = await modal.isVisible();
        if (isVisible) {
          modalSelector = selector;
          log(`   ✅ Modal found: ${selector}`, 'green');
          break;
        }
        modal = null;
      }
    }
    
    if (modal) {
      await takeScreenshot(page, 'pin-modal-appeared');
      
      // Check modal content
      const modalContent = await page.evaluate((sel) => {
        const modal = document.querySelector(sel);
        return {
          text: modal?.textContent?.substring(0, 300),
          html: modal?.innerHTML?.substring(0, 500),
          hasInput: !!modal?.querySelector('input'),
          hasButton: !!modal?.querySelector('button'),
          inputTypes: Array.from(modal?.querySelectorAll('input') || []).map(inp => inp.type)
        };
      }, modalSelector);
      
      log('   📋 Modal content:', 'blue');
      log(`      Text: ${modalContent.text}`, 'blue');
      log(`      Has input: ${modalContent.hasInput}`, 'blue');
      log(`      Has button: ${modalContent.hasButton}`, 'blue');
      log(`      Input types: ${modalContent.inputTypes.join(', ')}`, 'blue');
      
      // STEP 5: (Modal appeared, skip this)
      
      // STEP 6: Enter PIN
      log('\n═'.repeat(60), 'cyan');
      log('STEP 6: Entering PIN: 31618585', 'bright');
      log('═'.repeat(60), 'cyan');
      
      const pinInputSelectors = [
        'input[type="password"]',
        'input[type="text"]',
        'input[type="number"]',
        'input[placeholder*="PIN"]',
        'input[placeholder*="pin"]',
        'input[name="pin"]',
        'input',
      ];
      
      let pinInput = null;
      for (const selector of pinInputSelectors) {
        try {
          const inputs = await page.$$(selector);
          for (const input of inputs) {
            const isVisible = await input.isVisible();
            if (isVisible) {
              pinInput = input;
              log(`   ✅ PIN input found: ${selector}`, 'green');
              break;
            }
          }
          if (pinInput) break;
        } catch (e) {}
      }
      
      if (pinInput) {
        await pinInput.fill('31618585');
        log('   ✅ PIN entered: 31618585', 'green');
        await page.waitForTimeout(500);
        
        await takeScreenshot(page, 'pin-entered');
        
        // STEP 7: Click submit
        log('\n═'.repeat(60), 'cyan');
        log('STEP 7: Clicking Submit Button', 'bright');
        log('═'.repeat(60), 'cyan');
        
        const submitSelectors = [
          'button[type="submit"]',
          'button:has-text("Submit")',
          'button:has-text("Enter")',
          'button:has-text("Login")',
          'button:has-text("OK")',
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
          log('   🖱️ Clicking submit button...', 'cyan');
          
          // Start monitoring network before click
          const requestsBefore = networkRequests.length;
          
          await submitButton.click();
          log('   ✅ Submit button clicked', 'green');
          
          // Wait for network activity
          await page.waitForTimeout(3000);
          
          await takeScreenshot(page, 'after-submit');
          
          // STEP 8: Check network requests
          log('\n═'.repeat(60), 'cyan');
          log('STEP 8: Network Activity Analysis', 'bright');
          log('═'.repeat(60), 'cyan');
          
          const newRequests = networkRequests.slice(requestsBefore);
          
          if (newRequests.length > 0) {
            log(`   📊 Found ${newRequests.length} network requests after submit`, 'green');
            
            newRequests.forEach((req, i) => {
              if (req.type === 'request') {
                log(`\n   Request ${i + 1}:`, 'cyan');
                log(`      Method: ${req.method}`, 'blue');
                log(`      URL: ${req.url}`, 'blue');
                if (req.postData) {
                  log(`      POST Data: ${req.postData}`, 'blue');
                }
              } else if (req.type === 'response') {
                log(`\n   Response ${i + 1}:`, 'cyan');
                log(`      Status: ${req.status} ${req.statusText}`, req.status >= 200 && req.status < 300 ? 'green' : 'red');
                log(`      URL: ${req.url}`, 'blue');
                if (req.body && req.body.length < 500) {
                  log(`      Body: ${req.body}`, 'blue');
                }
              }
            });
            
            // Check for /api/auth/login specifically
            const authRequests = newRequests.filter(r => 
              r.url.includes('/api/auth/login') || 
              r.url.includes('auth') || 
              r.url.includes('login')
            );
            
            if (authRequests.length > 0) {
              log('\n   🔐 Authentication Requests Found:', 'green');
              authRequests.forEach(req => {
                if (req.type === 'response') {
                  log(`      Status: ${req.status} ${req.statusText}`, req.status >= 200 && req.status < 300 ? 'green' : 'red');
                  log(`      URL: ${req.url}`, 'blue');
                }
              });
            } else {
              log('\n   ⚠️ No /api/auth/login requests found', 'yellow');
            }
          } else {
            log('   ⚠️ No network requests detected after submit', 'yellow');
            log('   💡 This might mean:', 'blue');
            log('      - Authentication is client-side only', 'blue');
            log('      - Request was blocked or failed', 'blue');
            log('      - Using a different endpoint', 'blue');
          }
          
          // Check if modal closed
          await page.waitForTimeout(1000);
          const modalStillVisible = await page.$(modalSelector);
          if (modalStillVisible) {
            const isVisible = await modalStillVisible.isVisible();
            if (isVisible) {
              log('\n   ⚠️ Modal still visible after submit', 'yellow');
            } else {
              log('\n   ✅ Modal closed after submit', 'green');
            }
          }
          
        } else {
          log('   ❌ Submit button not found', 'red');
        }
      } else {
        log('   ❌ PIN input not found', 'red');
      }
      
    } else {
      // STEP 5: Modal didn't appear
      log('\n═'.repeat(60), 'cyan');
      log('STEP 5: Modal Did Not Appear', 'bright');
      log('═'.repeat(60), 'cyan');
      
      log('   ❌ PIN modal did not appear', 'red');
      
      // Check console for errors
      const errors = consoleLogs.filter(log => log.type === 'error' || log.type === 'pageerror');
      if (errors.length > 0) {
        log('\n   🔴 Console Errors Found:', 'red');
        errors.forEach(err => {
          log(`      - ${err.text}`, 'red');
        });
      } else {
        log('\n   ✅ No console errors', 'green');
      }
      
      // Check what's on the page
      const pageInfo = await page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          bodyText: document.body.textContent.substring(0, 200),
          modals: document.querySelectorAll('[role="dialog"], .modal').length,
          buttons: document.querySelectorAll('button').length,
        };
      });
      
      log('\n   📋 Page Information:', 'blue');
      log(`      Title: ${pageInfo.title}`, 'blue');
      log(`      URL: ${pageInfo.url}`, 'blue');
      log(`      Modals on page: ${pageInfo.modals}`, 'blue');
      log(`      Buttons on page: ${pageInfo.buttons}`, 'blue');
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
    
    log('\n✅ Test Completed!', 'green');
    log('\n💡 Browser will stay open for manual inspection.', 'cyan');
    log('   Press Ctrl+C in terminal when done.\n', 'blue');
    
    // Keep browser open
    await page.waitForTimeout(300000); // 5 minutes
    
  } catch (error) {
    log(`\n❌ Error during testing: ${error.message}`, 'red');
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
