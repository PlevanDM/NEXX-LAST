#!/usr/bin/env node
/**
 * Complete Manual Testing Script
 * Performs all requested tests with screenshots and console monitoring
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5174';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'test-screenshots-manual');

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

async function captureConsole(page) {
  const logs = { errors: [], warnings: [], logs: [] };
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      logs.errors.push(text);
      log(`      🔴 Console Error: ${text}`, 'red');
    } else if (type === 'warning') {
      logs.warnings.push(text);
    } else if (type === 'log' && (text.includes('✅') || text.includes('❌'))) {
      logs.logs.push(text);
    }
  });
  
  page.on('pageerror', error => {
    logs.errors.push(`Page Error: ${error.message}`);
    log(`      ❌ Page Error: ${error.message}`, 'red');
  });
  
  return logs;
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║     NEXX Service Center - Complete Manual Test        ║', 'bright');
  log('║              http://localhost:5174/                    ║', 'bright');
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
  const consoleLogs = await captureConsole(page);
  
  try {
    // STEP 1: Navigate to landing page
    log('═'.repeat(60), 'cyan');
    log('STEP 1: Navigate to Landing Page', 'bright');
    log('═'.repeat(60), 'cyan');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // STEP 2: Take screenshot of landing page
    log('\nSTEP 2: Taking screenshot of landing page...', 'cyan');
    await takeScreenshot(page, 'landing-page-initial');
    
    // STEP 3: Check console for errors
    log('\nSTEP 3: Checking console for errors...', 'cyan');
    if (consoleLogs.errors.length === 0) {
      log('   ✅ No console errors detected!', 'green');
    } else {
      log(`   ❌ Found ${consoleLogs.errors.length} console errors:`, 'red');
      consoleLogs.errors.forEach(err => log(`      - ${err}`, 'red'));
    }
    
    // Check React status
    const reactStatus = await page.evaluate(() => {
      return {
        reactExists: typeof window.React !== 'undefined',
        reactVersion: window.React?.version,
        appVisible: document.getElementById('app')?.offsetParent !== null,
      };
    });
    
    log(`\n   React Status:`, 'yellow');
    log(`      React Loaded: ${reactStatus.reactExists ? '✅' : '❌'}`, reactStatus.reactExists ? 'green' : 'red');
    if (reactStatus.reactVersion) {
      log(`      React Version: ${reactStatus.reactVersion}`, 'blue');
    }
    log(`      App Visible: ${reactStatus.appVisible ? '✅' : '❌'}`, reactStatus.appVisible ? 'green' : 'red');
    
    // STEP 4: Scroll down to see all sections
    log('\n═'.repeat(60), 'cyan');
    log('STEP 4: Scrolling through all sections...', 'bright');
    log('═'.repeat(60), 'cyan');
    
    const sections = [
      { name: 'Hero Section', selector: 'section:first-of-type, .hero-bg', scroll: 0 },
      { name: 'Services Section', selector: '#services', scroll: true },
      { name: 'Calculator Section', selector: '#calculator', scroll: true },
      { name: 'Gallery Section', selector: '#gallery', scroll: true },
      { name: 'Reviews Section', selector: '#reviews', scroll: true },
      { name: 'Contact Section', selector: '#contacts, #contact', scroll: true },
    ];
    
    for (const section of sections) {
      log(`\n   Checking ${section.name}...`, 'yellow');
      
      if (section.scroll === true) {
        try {
          await page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, section.selector);
          await page.waitForTimeout(1000);
        } catch (e) {
          log(`      ⚠️ Could not scroll to ${section.name}`, 'yellow');
        }
      }
      
      const element = await page.$(section.selector);
      if (element) {
        const isVisible = await element.isVisible();
        if (isVisible) {
          log(`      ✅ ${section.name} found and visible`, 'green');
          await takeScreenshot(page, section.name.toLowerCase().replace(/\s+/g, '-'));
        } else {
          log(`      ⚠️ ${section.name} found but not visible`, 'yellow');
        }
      } else {
        log(`      ❌ ${section.name} not found`, 'red');
      }
    }
    
    // STEP 5: Click the green callback button
    log('\n═'.repeat(60), 'cyan');
    log('STEP 5: Testing Callback Button & Modal', 'bright');
    log('═'.repeat(60), 'cyan');
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    
    log('\n   Looking for green callback button...', 'yellow');
    
    const buttonSelectors = [
      'button:has-text("Call")',
      'button:has-text("back")',
      'button[class*="green"]',
      'button[class*="bg-green"]',
      'a:has-text("Call")',
    ];
    
    let callbackButton = null;
    for (const selector of buttonSelectors) {
      try {
        const btn = await page.$(selector);
        if (btn) {
          const isVisible = await btn.isVisible();
          if (isVisible) {
            callbackButton = btn;
            log(`      ✅ Callback button found: ${selector}`, 'green');
            break;
          }
        }
      } catch (e) {}
    }
    
    if (callbackButton) {
      await takeScreenshot(page, 'before-callback-click');
      
      log('      🖱️ Clicking callback button...', 'cyan');
      await callbackButton.click();
      await page.waitForTimeout(1500);
      
      await takeScreenshot(page, 'after-callback-click-modal-open');
      
      // Check if modal appeared
      const modalSelectors = [
        '[class*="modal"]',
        '[role="dialog"]',
        '[class*="animate-scale-in"]',
        '.modal',
      ];
      
      let modalFound = false;
      for (const selector of modalSelectors) {
        const modal = await page.$(selector);
        if (modal) {
          const isVisible = await modal.isVisible();
          if (isVisible) {
            log(`      ✅ Modal appeared with animation: ${selector}`, 'green');
            modalFound = true;
            break;
          }
        }
      }
      
      if (!modalFound) {
        log('      ⚠️ Modal not found after click', 'yellow');
      }
      
      // STEP 6: Close the modal
      log('\n   Closing modal...', 'yellow');
      
      const closeSelectors = [
        'button:has-text("Close")',
        'button:has-text("×")',
        '[aria-label="Close"]',
        'button[class*="close"]',
        '.modal button',
      ];
      
      let closed = false;
      for (const selector of closeSelectors) {
        try {
          const closeBtn = await page.$(selector);
          if (closeBtn) {
            const isVisible = await closeBtn.isVisible();
            if (isVisible) {
              await closeBtn.click();
              log(`      ✅ Modal closed using: ${selector}`, 'green');
              closed = true;
              await page.waitForTimeout(500);
              break;
            }
          }
        } catch (e) {}
      }
      
      if (!closed) {
        // Try clicking outside modal
        await page.keyboard.press('Escape');
        log('      ⚠️ Tried closing with Escape key', 'yellow');
        await page.waitForTimeout(500);
      }
      
      await takeScreenshot(page, 'after-modal-closed');
    } else {
      log('      ❌ Callback button not found', 'red');
    }
    
    // STEP 7: Scroll to calculator and try clicking brand
    log('\n═'.repeat(60), 'cyan');
    log('STEP 7: Testing Calculator Section', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.evaluate(() => {
      const calc = document.getElementById('calculator');
      if (calc) calc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(1500);
    
    await takeScreenshot(page, 'calculator-section');
    
    log('\n   Looking for calculator elements...', 'yellow');
    
    // Look for any clickable elements in calculator
    const calcElements = await page.$$('#calculator button, #calculator select, #calculator [role="button"], #calculator [class*="select"]');
    log(`      Found ${calcElements.length} interactive elements in calculator`, 'blue');
    
    if (calcElements.length > 0) {
      log('      Attempting to click first element...', 'cyan');
      try {
        await calcElements[0].click();
        await page.waitForTimeout(1000);
        await takeScreenshot(page, 'calculator-after-click');
        log('      ✅ Clicked calculator element', 'green');
        
        // Look for "Apple" option
        const appleElements = await page.$$('[class*="option"]:has-text("Apple"), button:has-text("Apple"), [role="option"]:has-text("Apple")');
        if (appleElements.length > 0) {
          log('      ✅ Apple option found, clicking...', 'green');
          await appleElements[0].click();
          await page.waitForTimeout(500);
          await takeScreenshot(page, 'calculator-apple-selected');
        } else {
          log('      ⚠️ Apple option not found', 'yellow');
        }
      } catch (e) {
        log(`      ⚠️ Could not interact with calculator: ${e.message}`, 'yellow');
      }
    } else {
      log('      ⚠️ No interactive calculator elements found', 'yellow');
    }
    
    // STEP 8: Scroll to gallery and check images
    log('\n═'.repeat(60), 'cyan');
    log('STEP 8: Testing Gallery Section', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.evaluate(() => {
      const gallery = document.getElementById('gallery');
      if (gallery) gallery.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(1500);
    
    await takeScreenshot(page, 'gallery-section');
    
    log('\n   Checking gallery images...', 'yellow');
    
    const galleryImages = await page.$$('#gallery img, [id*="gallery"] img, section:has-text("Gallery") img, section:has-text("Galerie") img');
    log(`      Found ${galleryImages.length} images in gallery area`, 'blue');
    
    if (galleryImages.length > 0) {
      let loadedCount = 0;
      let staticImagesCount = 0;
      
      for (let i = 0; i < Math.min(galleryImages.length, 10); i++) {
        const img = galleryImages[i];
        const src = await img.getAttribute('src');
        const isLoaded = await img.evaluate(el => el.complete && el.naturalHeight > 0);
        
        if (isLoaded) loadedCount++;
        if (src && src.includes('/static/images/')) {
          staticImagesCount++;
          log(`      ✅ Image from /static/images/: ${src}`, 'green');
        } else if (src) {
          log(`      📷 Image from: ${src}`, 'blue');
        }
      }
      
      log(`\n      Summary: ${loadedCount}/${galleryImages.length} images loaded`, loadedCount > 0 ? 'green' : 'yellow');
      log(`      Images from /static/images/: ${staticImagesCount}`, staticImagesCount > 0 ? 'green' : 'yellow');
    } else {
      log('      ⚠️ No images found in gallery', 'yellow');
    }
    
    // STEP 9: Scroll to contacts and verify links
    log('\n═'.repeat(60), 'cyan');
    log('STEP 9: Testing Contact Section', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.evaluate(() => {
      const contacts = document.getElementById('contacts') || document.getElementById('contact');
      if (contacts) contacts.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(1500);
    
    await takeScreenshot(page, 'contact-section');
    
    log('\n   Checking contact links...', 'yellow');
    
    const socialLinks = [
      { name: 'Telegram', patterns: ['telegram', 't.me'], icon: '📱' },
      { name: 'Email', patterns: ['mailto:', 'email', '@'], icon: '📧' },
      { name: 'Instagram', patterns: ['instagram', 'insta'], icon: '📸' },
    ];
    
    for (const social of socialLinks) {
      let found = false;
      const links = await page.$$('a');
      
      for (const link of links) {
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        
        if (href || text) {
          const combined = `${href} ${text}`.toLowerCase();
          if (social.patterns.some(pattern => combined.includes(pattern))) {
            log(`      ✅ ${social.icon} ${social.name} link found: ${href || text}`, 'green');
            found = true;
            break;
          }
        }
      }
      
      if (!found) {
        log(`      ❌ ${social.icon} ${social.name} link not found`, 'red');
      }
    }
    
    // STEP 10: Check footer
    log('\n═'.repeat(60), 'cyan');
    log('STEP 10: Checking Footer', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    await page.waitForTimeout(1500);
    
    await takeScreenshot(page, 'footer');
    
    log('\n   Looking for footer information...', 'yellow');
    
    const footerText = await page.evaluate(() => {
      const footer = document.querySelector('footer, [role="contentinfo"]');
      return footer ? footer.textContent : document.body.textContent;
    });
    
    const footerChecks = [
      { text: 'NEXX GSM SERVICE POINT SRL', found: footerText.includes('NEXX GSM SERVICE POINT SRL') },
      { text: 'CUI: 53879866', found: footerText.includes('53879866') || footerText.includes('CUI') },
    ];
    
    for (const check of footerChecks) {
      if (check.found) {
        log(`      ✅ Found: ${check.text}`, 'green');
      } else {
        log(`      ⚠️ Not found: ${check.text}`, 'yellow');
      }
    }
    
    // STEP 11: Navigate to /nexx
    log('\n═'.repeat(60), 'cyan');
    log('STEP 11: Testing NEXX Database Page (/nexx)', 'bright');
    log('═'.repeat(60), 'cyan');
    
    log('\n   Navigating to /nexx...', 'cyan');
    await page.goto(`${BASE_URL}/nexx`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    await takeScreenshot(page, 'nexx-database-page');
    
    // Check console errors on /nexx
    log('\n   Checking console on /nexx page...', 'yellow');
    if (consoleLogs.errors.length === 0) {
      log('      ✅ No new console errors on /nexx', 'green');
    } else {
      log(`      ⚠️ Console errors detected`, 'yellow');
    }
    
    // STEP 12: Try entering PIN
    log('\n   Looking for PIN input...', 'yellow');
    
    const pinSelectors = [
      'input[type="password"]',
      'input[type="text"][placeholder*="PIN"]',
      'input[placeholder*="pin"]',
      'input[name="pin"]',
      'input[id*="pin"]',
      'input[type="number"]',
    ];
    
    let pinInput = null;
    for (const selector of pinSelectors) {
      pinInput = await page.$(selector);
      if (pinInput) {
        const isVisible = await pinInput.isVisible();
        if (isVisible) {
          log(`      ✅ PIN input found: ${selector}`, 'green');
          break;
        }
        pinInput = null;
      }
    }
    
    if (pinInput) {
      log('\n   Entering PIN: 31618585...', 'cyan');
      await pinInput.fill('31618585');
      await page.waitForTimeout(500);
      
      await takeScreenshot(page, 'nexx-pin-entered');
      
      // STEP 13: Submit PIN
      log('\n   Looking for submit button...', 'yellow');
      
      const submitSelectors = [
        'button[type="submit"]',
        'button:has-text("Enter")',
        'button:has-text("Submit")',
        'button:has-text("Войти")',
        'button:has-text("OK")',
        'form button',
      ];
      
      let submitButton = null;
      for (const selector of submitSelectors) {
        try {
          submitButton = await page.$(selector);
          if (submitButton) {
            const isVisible = await submitButton.isVisible();
            if (isVisible) {
              log(`      ✅ Submit button found: ${selector}`, 'green');
              break;
            }
            submitButton = null;
          }
        } catch (e) {}
      }
      
      if (submitButton) {
        log('      🖱️ Clicking submit button...', 'cyan');
        await submitButton.click();
        await page.waitForTimeout(3000);
        
        await takeScreenshot(page, 'nexx-after-pin-submit');
        
        // Check if we entered the database
        const stillHasPinInput = await page.$(pinSelectors[0]);
        if (stillHasPinInput) {
          const isVisible = await stillHasPinInput.isVisible();
          if (isVisible) {
            log('      ⚠️ Still on PIN screen - PIN may be incorrect', 'yellow');
          } else {
            log('      ✅ PIN screen disappeared - likely authenticated!', 'green');
          }
        } else {
          log('      ✅ Successfully entered database!', 'green');
        }
        
        // Check for database content
        const dbElements = await page.$$('[class*="database"], [class*="table"], table, [role="table"]');
        if (dbElements.length > 0) {
          log(`      ✅ Found ${dbElements.length} database elements`, 'green');
        }
      } else {
        log('      ⚠️ Submit button not found, trying Enter key...', 'yellow');
        await pinInput.press('Enter');
        await page.waitForTimeout(3000);
        await takeScreenshot(page, 'nexx-after-enter-key');
      }
    } else {
      log('      ⚠️ PIN input not found', 'yellow');
      log('      💡 Page may already be authenticated or use different UI', 'blue');
    }
    
    // Final summary
    log('\n' + '═'.repeat(60), 'bright');
    log('📊 TEST SUMMARY', 'bright');
    log('═'.repeat(60), 'bright');
    
    log(`\n📸 Total Screenshots: ${screenshotCounter - 1}`, 'cyan');
    log(`📂 Saved to: ${SCREENSHOTS_DIR}`, 'blue');
    
    log(`\n🐛 Console Errors: ${consoleLogs.errors.length}`, consoleLogs.errors.length === 0 ? 'green' : 'red');
    if (consoleLogs.errors.length > 0) {
      log('\nErrors found:', 'red');
      consoleLogs.errors.forEach(err => log(`   - ${err}`, 'red'));
    }
    
    log(`\n⚠️ Console Warnings: ${consoleLogs.warnings.length}`, 'yellow');
    
    log('\n✅ Tests Completed!', 'green');
    log('\n💡 Browser will stay open for manual inspection.', 'cyan');
    log('   Press Ctrl+C in terminal when done.\n', 'blue');
    
    // Keep browser open for manual inspection
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
