#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'test-screenshots-servicemod-precise');

const colors = {
  reset: '\x1b[0m', bright: '\x1b[1m', red: '\x1b[31m', green: '\x1b[32m',
  yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m',
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
  log('║       ServiceMod PIN Authentication Test              ║', 'bright');
  log('║              http://localhost:5173/                    ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  const consoleLogs = [];
  const networkActivity = [];
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleLogs.push({ type, text });
    if (type === 'error') log(`      🔴 ${text}`, 'red');
    else if (type === 'warning') log(`      ⚠️ ${text}`, 'yellow');
    else if (text.includes('🔐')) log(`      📝 ${text}`, 'blue');
  });
  
  page.on('pageerror', error => {
    consoleLogs.push({ type: 'pageerror', text: error.message });
    log(`      ❌ ${error.message}`, 'red');
  });
  
  page.on('request', req => {
    const url = req.url();
    if (url.includes('/api/auth/login')) {
      networkActivity.push({
        type: 'request', method: req.method(), url, postData: req.postData()
      });
      log(`      🌐 REQUEST: ${req.method()} ${url}`, 'cyan');
    }
  });
  
  page.on('response', async res => {
    const url = res.url();
    if (url.includes('/api/auth/login')) {
      let body = null;
      try { body = await res.text(); } catch (e) {}
      networkActivity.push({
        type: 'response', status: res.status(), statusText: res.statusText(), url, body
      });
      log(`      📡 RESPONSE: ${res.status()} ${res.statusText()}`, res.status() < 400 ? 'green' : 'red');
      if (body) log(`         Body: ${body}`, 'blue');
    }
  });
  
  try {
    // STEP 1
    log('STEP 1: Navigate to http://localhost:5173/', 'cyan');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    log('✅ Page loaded\n', 'green');
    
    // STEP 2
    log('STEP 2: Waiting 5 seconds...', 'cyan');
    await page.waitForTimeout(5000);
    log('✅ Wait complete\n', 'green');
    
    // STEP 3
    log('STEP 3: Taking screenshot', 'cyan');
    await takeScreenshot(page, 'initial');
    
    // STEP 4
    log('\nSTEP 4: typeof window.openServiceModAuth', 'cyan');
    const funcType = await page.evaluate(() => typeof window.openServiceModAuth);
    log(`📋 RESULT: "${funcType}"\n`, funcType === 'function' ? 'green' : 'red');
    
    // STEP 5
    log('STEP 5: document.querySelectorAll(\'.landing-app\').length', 'cyan');
    const landingCount = await page.evaluate(() => document.querySelectorAll('.landing-app').length);
    log(`📋 RESULT: ${landingCount}\n`, landingCount > 0 ? 'green' : 'red');
    
    if (funcType === 'function') {
      // STEP 6: Function exists!
      log('═'.repeat(60), 'green');
      log('STEP 6: openServiceModAuth IS A FUNCTION!', 'bright');
      log('═'.repeat(60), 'green');
      
      // 6a
      log('\n6a) Calling window.openServiceModAuth()...', 'cyan');
      await page.evaluate(() => {
        console.log('🔐 Calling openServiceModAuth');
        window.openServiceModAuth();
      });
      
      // 6b
      log('6b) Waiting 2 seconds...', 'cyan');
      await page.waitForTimeout(2000);
      await takeScreenshot(page, 'modal-opened');
      
      const modalVisible = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"], [class*="modal"]');
        if (modal) {
          const styles = window.getComputedStyle(modal);
          return styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0';
        }
        return false;
      });
      
      if (modalVisible) {
        log('✅ Modal is visible!\n', 'green');
        
        // 6c
        log('6c) Finding PIN input and typing 31618585...', 'cyan');
        const pinInput = await page.$('input[type="password"], input[type="text"], [role="dialog"] input');
        
        if (pinInput) {
          await pinInput.fill('31618585');
          log('✅ PIN entered: 31618585\n', 'green');
          await takeScreenshot(page, 'pin-entered');
          
          // 6d
          log('6d) Finding and clicking submit button...', 'cyan');
          const submitBtn = await page.$('button:has-text("Accesează"), button[type="submit"], [role="dialog"] button');
          
          if (submitBtn) {
            const btnText = await submitBtn.textContent();
            log(`✅ Submit button found: "${btnText}"`, 'green');
            
            await submitBtn.click();
            log('✅ Button clicked\n', 'green');
            
            // 6e
            log('6e) Waiting 3 seconds for API response...', 'cyan');
            await page.waitForTimeout(3000);
            
            // 6f
            log('\n6f) Taking screenshot and checking URL...', 'cyan');
            await takeScreenshot(page, 'after-submit');
            
            const currentUrl = page.url();
            log(`📍 Current URL: ${currentUrl}`, 'blue');
            
            if (currentUrl.includes('/nexx')) {
              log('✅ Redirected to /nexx!\n', 'green');
            } else {
              log('⚠️ Not redirected to /nexx\n', 'yellow');
            }
            
            // 6g
            log('6g) Network response for /api/auth/login:', 'cyan');
            const authActivity = networkActivity.filter(a => a.url.includes('/api/auth/login'));
            
            if (authActivity.length > 0) {
              authActivity.forEach((act, i) => {
                log(`\n   Activity ${i + 1}:`, 'cyan');
                if (act.type === 'request') {
                  log(`      Type: REQUEST`, 'blue');
                  log(`      Method: ${act.method}`, 'blue');
                  log(`      URL: ${act.url}`, 'blue');
                  if (act.postData) log(`      POST Data: ${act.postData}`, 'blue');
                } else {
                  log(`      Type: RESPONSE`, 'blue');
                  log(`      Status: ${act.status} ${act.statusText}`, act.status < 400 ? 'green' : 'red');
                  log(`      URL: ${act.url}`, 'blue');
                  if (act.body) log(`      Body: ${act.body}`, 'blue');
                }
              });
            } else {
              log('   ⚠️ No /api/auth/login requests found', 'yellow');
            }
          } else {
            log('❌ Submit button not found\n', 'red');
          }
        } else {
          log('❌ PIN input not found\n', 'red');
        }
      } else {
        log('⚠️ Modal did not appear\n', 'yellow');
      }
    } else {
      // STEP 7: Function undefined
      log('═'.repeat(60), 'red');
      log('STEP 7: openServiceModAuth is UNDEFINED', 'bright');
      log('═'.repeat(60), 'red');
      
      log('\nChecking console errors...', 'cyan');
      const errors = consoleLogs.filter(l => l.type === 'error' || l.type === 'pageerror');
      if (errors.length > 0) {
        log(`🔴 Found ${errors.length} errors:`, 'red');
        errors.forEach((e, i) => log(`   ${i + 1}. ${e.text}`, 'red'));
      } else {
        log('✅ No console errors', 'green');
      }
    }
    
    // ALSO: Look for Service button
    log('\n' + '═'.repeat(60), 'cyan');
    log('ALSO: Looking for "Service" button in page', 'bright');
    log('═'.repeat(60), 'cyan');
    
    const serviceBtn = await page.$('button:has-text("Service"), a:has-text("Service")');
    if (serviceBtn) {
      const isVisible = await serviceBtn.isVisible();
      if (isVisible) {
        log('✅ Service button found!', 'green');
        log('🖱️ Clicking Service button...', 'cyan');
        await takeScreenshot(page, 'before-service-click');
        await serviceBtn.click();
        await page.waitForTimeout(2000);
        await takeScreenshot(page, 'after-service-click');
        log('✅ Service button clicked\n', 'green');
      } else {
        log('⚠️ Service button found but not visible\n', 'yellow');
      }
    } else {
      log('⚠️ Service button not found\n', 'yellow');
    }
    
    // Summary
    log('═'.repeat(60), 'bright');
    log('📊 FINAL SUMMARY', 'bright');
    log('═'.repeat(60), 'bright');
    log(`\n📋 typeof window.openServiceModAuth = "${funcType}"`, funcType === 'function' ? 'green' : 'red');
    log(`📋 .landing-app elements = ${landingCount}`, landingCount > 0 ? 'green' : 'red');
    log(`📸 Screenshots: ${screenshotCounter - 1}`, 'cyan');
    log(`🐛 Console Errors: ${consoleLogs.filter(l => l.type === 'error' || l.type === 'pageerror').length}`, 'red');
    log(`🌐 Network Activity: ${networkActivity.length} auth requests`, 'cyan');
    
    log('\n✅ Test Completed!', 'green');
    log('💡 Browser stays open. Press Ctrl+C when done.\n', 'cyan');
    
    await page.waitForTimeout(300000);
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    console.error(error);
  } finally {
    await browser.close();
    log('\n🔒 Browser closed\n', 'cyan');
  }
}

main();
