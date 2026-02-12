#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'test-screenshots-pin-flow');

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
  log('║      ServiceMod PIN Entry Flow - Complete Test        ║', 'bright');
  log('║              http://localhost:5173/                    ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  const networkActivity = [];
  
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('🔐') || text.includes('auth')) {
      log(`      📝 ${text}`, 'blue');
    }
  });
  
  page.on('request', req => {
    const url = req.url();
    if (url.includes('/api/auth/login')) {
      const postData = req.postData();
      networkActivity.push({ type: 'request', method: req.method(), url, postData });
      log(`      🌐 REQUEST: ${req.method()} ${url}`, 'cyan');
      if (postData) log(`         POST: ${postData}`, 'blue');
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
    log('STEP 2: Waiting 3 seconds...', 'cyan');
    await page.waitForTimeout(3000);
    log('✅ Wait complete\n', 'green');
    
    // STEP 3
    log('STEP 3: Opening modal with window.openServiceModAuth()', 'cyan');
    await page.evaluate(() => {
      console.log('🔐 Calling window.openServiceModAuth()');
      window.openServiceModAuth();
    });
    log('✅ Function called\n', 'green');
    
    // STEP 4
    log('STEP 4: Waiting 2 seconds for modal to render...', 'cyan');
    await page.waitForTimeout(2000);
    log('✅ Wait complete\n', 'green');
    
    // STEP 5
    log('STEP 5: Taking screenshot of modal', 'cyan');
    await takeScreenshot(page, 'modal-visible');
    
    // Check modal structure
    const modalInfo = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const backdrop = document.querySelector('.bg-black\\/80, [class*="backdrop"]');
      const content = document.querySelector('[role="dialog"] > div');
      
      return {
        modalExists: !!modal,
        backdropExists: !!backdrop,
        contentExists: !!content,
        modalHTML: modal?.outerHTML?.substring(0, 300)
      };
    });
    
    log(`   Modal exists: ${modalInfo.modalExists ? '✅' : '❌'}`, modalInfo.modalExists ? 'green' : 'red');
    log(`   Backdrop exists: ${modalInfo.backdropExists ? '✅' : '❌'}`, modalInfo.backdropExists ? 'green' : 'red');
    log(`   Content exists: ${modalInfo.contentExists ? '✅' : '❌'}\n`, modalInfo.contentExists ? 'green' : 'red');
    
    // STEP 6
    log('STEP 6: Finding password input (type="password", inputMode="numeric")', 'cyan');
    
    const pinInput = await page.$('input[type="password"][inputMode="numeric"], input[type="password"]');
    
    if (pinInput) {
      log('✅ Password input found!\n', 'green');
      
      // STEP 7
      log('STEP 7: Clicking input field and typing 31618585...', 'cyan');
      
      // Force click using JavaScript to bypass backdrop
      await page.evaluate(() => {
        const input = document.querySelector('input[type="password"]');
        if (input) {
          input.focus();
          input.click();
        }
      });
      
      await page.waitForTimeout(500);
      
      // Type the PIN
      await pinInput.type('31618585', { delay: 100 });
      log('✅ PIN entered: 31618585\n', 'green');
      
      // STEP 8
      log('STEP 8: Taking screenshot with PIN entered', 'cyan');
      await takeScreenshot(page, 'pin-entered');
      
      // STEP 9
      log('\nSTEP 9: Finding submit button ("Accesează", type="submit")', 'cyan');
      
      const submitBtn = await page.$('button[type="submit"], button:has-text("Accesează")');
      
      if (submitBtn) {
        const btnText = await submitBtn.textContent();
        log(`✅ Submit button found: "${btnText}"\n`, 'green');
        
        // STEP 10
        log('STEP 10: Clicking submit button...', 'cyan');
        
        // Force click using JavaScript
        await page.evaluate(() => {
          const btn = document.querySelector('button[type="submit"]');
          if (btn) {
            btn.click();
          }
        });
        
        log('✅ Submit button clicked\n', 'green');
        
        // STEP 11
        log('STEP 11: Waiting 3 seconds for response...', 'cyan');
        await page.waitForTimeout(3000);
        log('✅ Wait complete\n', 'green');
        
        // STEP 12
        log('STEP 12: Taking screenshot and checking URL', 'cyan');
        await takeScreenshot(page, 'after-submit');
        
        const currentUrl = page.url();
        log(`\n📍 FULL URL: ${currentUrl}`, 'blue');
        
        if (currentUrl.includes('/nexx')) {
          log('✅ Redirected to /nexx!\n', 'green');
        } else if (currentUrl === BASE_URL + '/') {
          log('⚠️ Still on landing page\n', 'yellow');
        } else {
          log(`⚠️ Unexpected URL: ${currentUrl}\n`, 'yellow');
        }
        
        // STEP 13
        log('STEP 13: Network Activity for /api/auth/login', 'cyan');
        
        const authActivity = networkActivity.filter(a => a.url.includes('/api/auth/login'));
        
        if (authActivity.length > 0) {
          log(`✅ Found ${authActivity.length} auth requests\n`, 'green');
          
          authActivity.forEach((act, i) => {
            log(`Activity ${i + 1}:`, 'cyan');
            if (act.type === 'request') {
              log(`   Type: REQUEST`, 'blue');
              log(`   Method: ${act.method}`, 'blue');
              log(`   URL: ${act.url}`, 'blue');
              if (act.postData) log(`   POST Data: ${act.postData}`, 'blue');
            } else {
              log(`   Type: RESPONSE`, 'blue');
              log(`   Status: ${act.status} ${act.statusText}`, act.status < 400 ? 'green' : 'red');
              log(`   URL: ${act.url}`, 'blue');
              if (act.body) {
                log(`   Response Body:`, 'blue');
                log(`   ${act.body}`, 'blue');
              }
            }
            log('');
          });
        } else {
          log('⚠️ No /api/auth/login requests found\n', 'yellow');
          
          if (networkActivity.length > 0) {
            log('Other network activity:', 'blue');
            networkActivity.forEach(a => {
              log(`   ${a.type === 'request' ? a.method : a.status} ${a.url}`, 'blue');
            });
          }
        }
        
      } else {
        log('❌ Submit button not found\n', 'red');
      }
    } else {
      log('❌ Password input not found\n', 'red');
    }
    
    // Summary
    log('═'.repeat(60), 'bright');
    log('📊 FINAL SUMMARY', 'bright');
    log('═'.repeat(60), 'bright');
    
    log(`\n📸 Screenshots: ${screenshotCounter - 1}`, 'cyan');
    log(`📂 Location: ${SCREENSHOTS_DIR}`, 'blue');
    log(`🌐 Network Activity: ${networkActivity.length} auth requests`, 'cyan');
    log(`📍 Final URL: ${page.url()}`, 'blue');
    
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
