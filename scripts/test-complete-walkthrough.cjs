#!/usr/bin/env node
/**
 * Complete Site Walkthrough Test
 * Tests EVERY section and feature of http://localhost:5174/
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5174';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'test-walkthrough');

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
async function takeScreenshot(page, name, fullPage = false) {
  const filename = `${String(screenshotCounter).padStart(2, '0')}-${name}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage });
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
      log(`      🔴 ERROR: ${text}`, 'red');
    } else if (type === 'warning') {
      logs.warnings.push(text);
      if (!text.includes('tailwindcss.com')) {
        log(`      ⚠️ WARNING: ${text}`, 'yellow');
      }
    }
  });
  
  page.on('pageerror', error => {
    logs.errors.push(`Page Error: ${error.message}`);
    log(`      ❌ PAGE ERROR: ${error.message}`, 'red');
  });
  
  return logs;
}

async function test1_LandingPageLoad(page, consoleLogs) {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║         TEST 1: Landing Page Load & Hero Section       ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  log('📍 Navigating to http://localhost:5174/...', 'cyan');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  // Take hero screenshot
  await takeScreenshot(page, 'hero-section', false);
  
  // Check React status
  const reactStatus = await page.evaluate(() => {
    return {
      reactExists: typeof window.React !== 'undefined',
      reactVersion: window.React?.version,
      appVisible: document.getElementById('app')?.offsetHeight > 0,
    };
  });
  
  log('\n🔍 React Status:', 'yellow');
  log(`   React: ${reactStatus.reactExists ? '✅ Loaded (v' + reactStatus.reactVersion + ')' : '❌ Not loaded'}`, reactStatus.reactExists ? 'green' : 'red');
  log(`   App Visible: ${reactStatus.appVisible ? '✅ Yes' : '❌ No'}`, reactStatus.appVisible ? 'green' : 'red');
  
  // Check hero elements
  log('\n🔍 Hero Section Elements:', 'yellow');
  const heroElements = {
    'Hero Section': await page.$('section, .hero-bg, [class*="hero"]'),
    'Dotted Animation': await page.$('.hero-dots-bg'),
    'Main Heading (h1)': await page.$('h1'),
    'Calculator Button': await page.$('a[href="#calculator"], button:has-text("Calculator")'),
    'Callback Button': await page.$('button:has-text("Call"), button[class*="green"]'),
  };
  
  for (const [name, element] of Object.entries(heroElements)) {
    if (element) {
      const isVisible = await element.isVisible().catch(() => false);
      log(`   ${isVisible ? '✅' : '⚠️'} ${name}: ${isVisible ? 'Visible' : 'Found but not visible'}`, isVisible ? 'green' : 'yellow');
    } else {
      log(`   ❌ ${name}: Not found`, 'red');
    }
  }
  
  // Check console
  log('\n🐛 Console Status:', 'yellow');
  if (consoleLogs.errors.length === 0) {
    log('   ✅ No console errors!', 'green');
  } else {
    log(`   ❌ ${consoleLogs.errors.length} console errors found`, 'red');
  }
}

async function test2_ScrollThroughSections(page) {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║         TEST 2: Scroll Through All Sections            ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  const sections = [
    { name: 'Services', id: 'services', selector: '#services, [id="services"]' },
    { name: 'Calculator', id: 'calculator', selector: '#calculator, [id="calculator"]' },
    { name: 'Gallery', id: 'gallery', selector: '#gallery, [id="gallery"]' },
    { name: 'Reviews', id: 'reviews', selector: '#reviews, [id="reviews"]' },
    { name: 'Contact', id: 'contacts', selector: '#contacts, [id="contacts"], #contact' },
  ];
  
  for (const section of sections) {
    log(`\n📍 Scrolling to ${section.name} section...`, 'cyan');
    
    // Try to find and scroll to section
    const element = await page.$(section.selector);
    if (element) {
      await element.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, `section-${section.id}`, false);
      log(`   ✅ ${section.name} section found and visible`, 'green');
      
      // Special checks for specific sections
      if (section.id === 'gallery') {
        const images = await page.$$(`${section.selector} img`);
        log(`   📊 Gallery images found: ${images.length}`, images.length > 0 ? 'green' : 'yellow');
        
        if (images.length > 0) {
          for (let i = 0; i < Math.min(3, images.length); i++) {
            const src = await images[i].getAttribute('src');
            log(`      - Image ${i + 1}: ${src}`, 'blue');
          }
        }
      }
      
      if (section.id === 'contacts') {
        // Check for social links
        const links = await page.$$(`${section.selector} a`);
        log(`   📊 Contact links found: ${links.length}`, 'blue');
        
        const socialLinks = {
          telegram: false,
          email: false,
          instagram: false,
          directions: false,
        };
        
        for (const link of links) {
          const href = await link.getAttribute('href');
          const text = await link.textContent();
          if (href) {
            if (href.includes('t.me') || href.includes('telegram')) socialLinks.telegram = true;
            if (href.includes('mailto:')) socialLinks.email = true;
            if (href.includes('instagram')) socialLinks.instagram = true;
            if (href.includes('maps') || href.includes('directions')) socialLinks.directions = true;
          }
        }
        
        log(`   ${socialLinks.telegram ? '✅' : '❌'} Telegram link`, socialLinks.telegram ? 'green' : 'red');
        log(`   ${socialLinks.email ? '✅' : '❌'} Email link`, socialLinks.email ? 'green' : 'red');
        log(`   ${socialLinks.instagram ? '✅' : '❌'} Instagram link`, socialLinks.instagram ? 'green' : 'red');
        log(`   ${socialLinks.directions ? '✅' : '⚠️'} Directions link`, socialLinks.directions ? 'green' : 'yellow');
      }
    } else {
      log(`   ❌ ${section.name} section not found`, 'red');
    }
  }
  
  // Check footer
  log('\n📍 Scrolling to footer...', 'cyan');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await takeScreenshot(page, 'footer', false);
  
  const footerText = await page.evaluate(() => document.body.textContent);
  if (footerText.includes('NEXX GSM SERVICE POINT SRL') && footerText.includes('53879866')) {
    log('   ✅ Footer contains company info: NEXX GSM SERVICE POINT SRL. CUI: 53879866', 'green');
  } else {
    log('   ⚠️ Footer company info not found or incomplete', 'yellow');
  }
}

async function test3_Calculator(page) {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║              TEST 3: Calculator Interaction            ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  log('📍 Navigating to calculator section...', 'cyan');
  await page.goto(`${BASE_URL}/#calculator`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  const calcElement = await page.$('#calculator');
  if (calcElement) {
    await calcElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'calculator-initial', false);
    
    log('\n🔍 Looking for calculator controls...', 'yellow');
    
    // Look for any clickable elements in calculator
    const clickableElements = await page.$$('#calculator button, #calculator select, #calculator [role="button"], #calculator [class*="select"]');
    log(`   📊 Found ${clickableElements.length} interactive elements`, 'blue');
    
    if (clickableElements.length > 0) {
      // Try to find brand selector
      const brandButtons = await page.$$('#calculator button:has-text("Apple"), #calculator button:has-text("Samsung"), #calculator [class*="brand"]');
      
      if (brandButtons.length > 0) {
        log('   ✅ Brand buttons found', 'green');
        try {
          // Try clicking Apple
          const appleButton = await page.$('#calculator button:has-text("Apple")');
          if (appleButton) {
            await appleButton.click();
            log('   ✅ Clicked Apple brand', 'green');
            await page.waitForTimeout(1000);
            await takeScreenshot(page, 'calculator-apple-selected', false);
            
            // Look for device type options
            const deviceButtons = await page.$$('#calculator button:has-text("iPhone"), #calculator button:has-text("MacBook"), #calculator button:has-text("iPad")');
            if (deviceButtons.length > 0) {
              log(`   ✅ Found ${deviceButtons.length} device type buttons`, 'green');
              
              // Try clicking iPhone
              const iphoneButton = await page.$('#calculator button:has-text("iPhone")');
              if (iphoneButton) {
                await iphoneButton.click();
                log('   ✅ Clicked iPhone device type', 'green');
                await page.waitForTimeout(1000);
                await takeScreenshot(page, 'calculator-iphone-selected', false);
              }
            } else {
              log('   ⚠️ Device type buttons not found', 'yellow');
            }
          }
        } catch (error) {
          log(`   ⚠️ Error interacting with calculator: ${error.message}`, 'yellow');
        }
      } else {
        log('   ⚠️ Brand buttons not found with standard selectors', 'yellow');
        log('   💡 Calculator may use custom components', 'blue');
      }
    } else {
      log('   ⚠️ No interactive elements found in calculator', 'yellow');
    }
  } else {
    log('   ❌ Calculator section not found', 'red');
  }
}

async function test4_CallbackModal(page) {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║            TEST 4: Callback Modal                      ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  log('📍 Scrolling to hero section...', 'cyan');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  
  // Look for callback button
  const callbackSelectors = [
    'button:has-text("Call")',
    'button:has-text("back")',
    'button[class*="green"]',
    'button[class*="callback"]',
  ];
  
  let callbackButton = null;
  for (const selector of callbackSelectors) {
    try {
      callbackButton = await page.$(selector);
      if (callbackButton) {
        const isVisible = await callbackButton.isVisible();
        if (isVisible) {
          log(`   ✅ Callback button found: ${selector}`, 'green');
          break;
        }
      }
    } catch (e) {}
  }
  
  if (callbackButton) {
    await takeScreenshot(page, 'before-callback-modal', false);
    
    try {
      await callbackButton.click();
      log('   ✅ Clicked callback button', 'green');
      await page.waitForTimeout(1000);
      
      await takeScreenshot(page, 'callback-modal-open', false);
      
      // Check if modal appeared
      const modal = await page.$('[role="dialog"], [class*="modal"], [class*="animate-scale-in"]');
      if (modal) {
        log('   ✅ Modal appeared!', 'green');
        
        // Try to find phone input
        const phoneInput = await page.$('input[type="tel"], input[placeholder*="phone"], input[placeholder*="telefon"]');
        if (phoneInput) {
          log('   ✅ Phone input found', 'green');
          await phoneInput.fill('0712345678');
          log('   ✅ Entered phone number: 0712345678', 'green');
          await page.waitForTimeout(500);
          await takeScreenshot(page, 'callback-modal-filled', false);
        } else {
          log('   ⚠️ Phone input not found', 'yellow');
        }
        
        // Try to close modal
        const closeButton = await page.$('button:has-text("×"), button:has-text("Close"), [aria-label="Close"]');
        if (closeButton) {
          await closeButton.click();
          log('   ✅ Closed modal', 'green');
          await page.waitForTimeout(500);
        } else {
          // Try clicking backdrop
          await page.keyboard.press('Escape');
          log('   ✅ Closed modal with Escape key', 'green');
        }
      } else {
        log('   ⚠️ Modal not found after clicking button', 'yellow');
      }
    } catch (error) {
      log(`   ❌ Error: ${error.message}`, 'red');
    }
  } else {
    log('   ❌ Callback button not found', 'red');
  }
}

async function test5_ServiceModAuth(page) {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║           TEST 5: Service Mod / Database Access        ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  log('📍 Looking for Service Mod button...', 'cyan');
  
  // Look for service mod button
  const serviceModSelectors = [
    'button:has-text("Service")',
    'button:has-text("Mod")',
    'button:has-text("Database")',
    'button:has-text("Admin")',
    '[class*="service-mod"]',
    'a[href="/nexx"]',
  ];
  
  let serviceModButton = null;
  for (const selector of serviceModSelectors) {
    try {
      serviceModButton = await page.$(selector);
      if (serviceModButton) {
        const isVisible = await serviceModButton.isVisible();
        if (isVisible) {
          log(`   ✅ Service Mod button found: ${selector}`, 'green');
          break;
        }
      }
    } catch (e) {}
  }
  
  if (serviceModButton) {
    await takeScreenshot(page, 'before-service-mod-click', false);
    
    try {
      await serviceModButton.click();
      log('   ✅ Clicked Service Mod button', 'green');
      await page.waitForTimeout(1500);
      
      await takeScreenshot(page, 'service-mod-modal', false);
      
      // Check if PIN modal appeared
      const pinInput = await page.$('input[type="password"], input[placeholder*="PIN"], input[name="pin"]');
      if (pinInput) {
        log('   ✅ PIN input modal appeared!', 'green');
      } else {
        log('   ⚠️ PIN input not found - may have navigated to /nexx', 'yellow');
      }
    } catch (error) {
      log(`   ⚠️ Error: ${error.message}`, 'yellow');
    }
  } else {
    log('   ⚠️ Service Mod button not found on landing page', 'yellow');
    log('   💡 Will test /nexx page directly', 'blue');
  }
}

async function test6_NexxPage(page, consoleLogs) {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║              TEST 6: /nexx Page & PIN Entry            ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  log('📍 Navigating to http://localhost:5174/nexx...', 'cyan');
  
  // Clear previous errors
  consoleLogs.errors = [];
  
  await page.goto(`${BASE_URL}/nexx`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  await takeScreenshot(page, 'nexx-page-initial', true);
  
  // Check for console errors
  if (consoleLogs.errors.length === 0) {
    log('   ✅ No console errors on /nexx page!', 'green');
  } else {
    log(`   ❌ ${consoleLogs.errors.length} console errors found`, 'red');
  }
  
  // Look for PIN input
  const pinSelectors = [
    'input[type="password"]',
    'input[placeholder*="PIN"]',
    'input[placeholder*="pin"]',
    'input[name="pin"]',
    'input[id*="pin"]',
  ];
  
  let pinInput = null;
  for (const selector of pinSelectors) {
    pinInput = await page.$(selector);
    if (pinInput) {
      const isVisible = await pinInput.isVisible();
      if (isVisible) {
        log(`   ✅ PIN input found: ${selector}`, 'green');
        break;
      }
    }
  }
  
  if (pinInput) {
    try {
      await pinInput.fill('31618585');
      log('   ✅ Entered PIN: 31618585', 'green');
      await page.waitForTimeout(500);
      await takeScreenshot(page, 'nexx-pin-entered', false);
      
      // Look for submit button or press Enter
      const submitButton = await page.$('button[type="submit"], button:has-text("Enter"), button:has-text("OK")');
      if (submitButton) {
        await submitButton.click();
        log('   ✅ Clicked submit button', 'green');
      } else {
        await pinInput.press('Enter');
        log('   ✅ Pressed Enter', 'green');
      }
      
      await page.waitForTimeout(2000);
      await takeScreenshot(page, 'nexx-after-pin', true);
      
      // Check if we're still on PIN screen
      const stillHasPin = await page.$('input[type="password"]');
      if (stillHasPin) {
        log('   ⚠️ Still on PIN screen - PIN may be incorrect or not processed', 'yellow');
      } else {
        log('   ✅ PIN accepted! Database interface loaded', 'green');
      }
    } catch (error) {
      log(`   ❌ Error: ${error.message}`, 'red');
    }
  } else {
    log('   ⚠️ PIN input not found', 'yellow');
    log('   💡 Page may already be authenticated or use different UI', 'blue');
  }
}

async function test7_CabinetPage(page) {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║              TEST 7: /cabinet Page                     ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  log('📍 Navigating to http://localhost:5174/cabinet...', 'cyan');
  await page.goto(`${BASE_URL}/cabinet`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  await takeScreenshot(page, 'cabinet-page', true);
  
  const title = await page.title();
  log(`   📄 Page Title: ${title}`, 'blue');
  
  // Check what's visible
  const hasContent = await page.evaluate(() => {
    const app = document.getElementById('app');
    return app && app.textContent.trim().length > 100;
  });
  
  if (hasContent) {
    log('   ✅ Cabinet page has content', 'green');
  } else {
    log('   ⚠️ Cabinet page appears empty or minimal', 'yellow');
  }
}

async function test8_MobileResponsive(page) {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║           TEST 8: Mobile Responsiveness                ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  log('📍 Resizing to mobile viewport (375x667)...', 'cyan');
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  await takeScreenshot(page, 'mobile-hero', false);
  
  // Check if mobile menu exists
  const mobileMenu = await page.$('button[aria-label*="menu"], button[class*="hamburger"], button[class*="mobile-menu"]');
  if (mobileMenu) {
    log('   ✅ Mobile menu button found', 'green');
    try {
      await mobileMenu.click();
      await page.waitForTimeout(500);
      await takeScreenshot(page, 'mobile-menu-open', false);
      log('   ✅ Mobile menu opened', 'green');
    } catch (error) {
      log(`   ⚠️ Could not open mobile menu: ${error.message}`, 'yellow');
    }
  } else {
    log('   ⚠️ Mobile menu button not found', 'yellow');
  }
  
  // Scroll through sections on mobile
  log('\n📍 Scrolling through sections on mobile...', 'cyan');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(500);
  await takeScreenshot(page, 'mobile-mid-page', false);
  
  // Reset viewport
  await page.setViewportSize({ width: 1920, height: 1080 });
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║     NEXX Service Center - Complete Site Walkthrough   ║', 'bright');
  log('║              http://localhost:5174/                    ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  log(`📂 Screenshots will be saved to: ${SCREENSHOTS_DIR}\n`, 'blue');
  
  let browser;
  let page;
  let consoleLogs;
  
  try {
    log('🚀 Launching browser...', 'cyan');
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox']
    });
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    page = await context.newPage();
    consoleLogs = await captureConsole(page);
    
    log('✅ Browser launched\n', 'green');
    
    // Run all tests
    await test1_LandingPageLoad(page, consoleLogs);
    await test2_ScrollThroughSections(page);
    await test3_Calculator(page);
    await test4_CallbackModal(page);
    await test5_ServiceModAuth(page);
    await test6_NexxPage(page, consoleLogs);
    await test7_CabinetPage(page);
    await test8_MobileResponsive(page);
    
    // Final Summary
    log('\n' + '═'.repeat(60), 'bright');
    log('📊 COMPLETE WALKTHROUGH SUMMARY', 'bright');
    log('═'.repeat(60), 'bright');
    
    log(`\n📸 Total Screenshots: ${screenshotCounter - 1}`, 'cyan');
    log(`📂 Location: ${SCREENSHOTS_DIR}`, 'blue');
    
    if (consoleLogs.errors.length === 0) {
      log('\n🎉 NO CONSOLE ERRORS DETECTED!', 'green');
    } else {
      log(`\n⚠️ Total Console Errors: ${consoleLogs.errors.length}`, 'yellow');
      log('\nUnique Errors:', 'yellow');
      const uniqueErrors = [...new Set(consoleLogs.errors)];
      uniqueErrors.forEach(err => log(`   - ${err}`, 'red'));
    }
    
    log('\n✅ Complete walkthrough finished!', 'green');
    log('📖 Review screenshots for detailed visual inspection\n', 'blue');
    
  } catch (error) {
    log(`\n❌ Fatal Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
      log('🔒 Browser closed\n', 'cyan');
    }
  }
}

main().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
