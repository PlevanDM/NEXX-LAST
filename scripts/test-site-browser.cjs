#!/usr/bin/env node
/**
 * Browser-based Site Testing Script
 * Uses Playwright to test the dev site at http://localhost:5173/
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'test-screenshots');

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

// Create screenshots directory
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function captureConsoleErrors(page) {
  const errors = [];
  const warnings = [];
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      errors.push(text);
    } else if (type === 'warning') {
      warnings.push(text);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });
  
  return { errors, warnings };
}

async function testLandingPage(browser) {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║              TEST 1: Landing Page (/)                  ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  const page = await browser.newPage();
  const consoleData = await captureConsoleErrors(page);
  
  try {
    log('📍 Navigating to http://localhost:5173/', 'cyan');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Take screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, '01-landing-page.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    log(`📸 Screenshot saved: ${screenshotPath}`, 'green');
    
    // Check page title
    const title = await page.title();
    log(`📄 Page Title: ${title}`, 'blue');
    
    // Wait for React to load
    await page.waitForSelector('#app', { timeout: 10000 });
    log('✅ React app div found', 'green');
    
    // Check for main sections
    log('\n🔍 Checking for main sections:', 'yellow');
    
    const sections = [
      { name: 'Hero Section', selector: 'section, .hero-bg, [class*="hero"]' },
      { name: 'Services Section', selector: '#services, [href="#services"]' },
      { name: 'Calculator Section', selector: '#calculator, [href="#calculator"]' },
      { name: 'Gallery Section', selector: '#gallery, [href="#gallery"]' },
      { name: 'Reviews Section', selector: '#reviews, [href="#reviews"]' },
      { name: 'Contact Section', selector: '#contacts, [href="#contacts"]' },
    ];
    
    for (const section of sections) {
      try {
        const element = await page.$(section.selector);
        if (element) {
          log(`   ✅ ${section.name} found`, 'green');
        } else {
          log(`   ⚠️ ${section.name} not found`, 'yellow');
        }
      } catch (error) {
        log(`   ❌ ${section.name} error: ${error.message}`, 'red');
      }
    }
    
    // Check console errors
    log('\n🐛 Console Errors:', 'yellow');
    if (consoleData.errors.length === 0) {
      log('   ✅ No console errors', 'green');
    } else {
      log(`   ❌ Found ${consoleData.errors.length} errors:`, 'red');
      consoleData.errors.forEach(err => log(`      - ${err}`, 'red'));
    }
    
    if (consoleData.warnings.length > 0) {
      log(`   ⚠️ Found ${consoleData.warnings.length} warnings:`, 'yellow');
      consoleData.warnings.slice(0, 5).forEach(warn => log(`      - ${warn}`, 'yellow'));
    }
    
    return { success: true, errors: consoleData.errors, warnings: consoleData.warnings };
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  } finally {
    await page.close();
  }
}

async function testCalculator(browser) {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║          TEST 2: Calculator Functionality              ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  const page = await browser.newPage();
  
  try {
    log('📍 Navigating to calculator section', 'cyan');
    await page.goto(`${BASE_URL}/#calculator`, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Take screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, '02-calculator-section.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    log(`📸 Screenshot saved: ${screenshotPath}`, 'green');
    
    log('\n🔍 Looking for calculator elements:', 'yellow');
    
    // Try to find calculator elements
    const calculatorSelectors = [
      'select[name="brand"]',
      'select[id*="brand"]',
      '[class*="calculator"]',
      'select',
      'input[type="select"]',
    ];
    
    let calculatorFound = false;
    for (const selector of calculatorSelectors) {
      const element = await page.$(selector);
      if (element) {
        log(`   ✅ Calculator element found: ${selector}`, 'green');
        calculatorFound = true;
        
        // Try to interact with it
        try {
          const isVisible = await element.isVisible();
          log(`      Visible: ${isVisible}`, isVisible ? 'green' : 'yellow');
        } catch (e) {
          log(`      Could not check visibility`, 'yellow');
        }
      }
    }
    
    if (!calculatorFound) {
      log('   ⚠️ Calculator elements not found with standard selectors', 'yellow');
      log('   💡 Calculator may be dynamically loaded or use custom components', 'blue');
    }
    
    // Check if there's any select element on the page
    const allSelects = await page.$$('select');
    log(`\n📊 Total select elements found: ${allSelects.length}`, 'blue');
    
    if (allSelects.length > 0) {
      log('   Attempting to interact with first select:', 'cyan');
      try {
        const firstSelect = allSelects[0];
        const options = await firstSelect.$$('option');
        log(`   ✅ Found ${options.length} options`, 'green');
        
        if (options.length > 1) {
          // Try to select the second option
          await firstSelect.selectOption({ index: 1 });
          log('   ✅ Successfully selected an option', 'green');
          
          // Take screenshot after selection
          const screenshotPath2 = path.join(SCREENSHOTS_DIR, '03-calculator-selected.png');
          await page.screenshot({ path: screenshotPath2, fullPage: false });
          log(`   📸 Screenshot saved: ${screenshotPath2}`, 'green');
        }
      } catch (error) {
        log(`   ⚠️ Could not interact with select: ${error.message}`, 'yellow');
      }
    }
    
    return { success: true, calculatorFound };
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  } finally {
    await page.close();
  }
}

async function testNexxDatabase(browser) {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║         TEST 3: NEXX Database (/nexx) + PIN            ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  const page = await browser.newPage();
  const consoleData = await captureConsoleErrors(page);
  
  try {
    log('📍 Navigating to http://localhost:5173/nexx', 'cyan');
    await page.goto(`${BASE_URL}/nexx`, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Take screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, '04-nexx-database.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    log(`📸 Screenshot saved: ${screenshotPath}`, 'green');
    
    log('\n🔍 Looking for PIN entry screen:', 'yellow');
    
    // Look for PIN input
    const pinSelectors = [
      'input[type="password"]',
      'input[type="text"][placeholder*="PIN"]',
      'input[placeholder*="pin"]',
      'input[name="pin"]',
      'input[id*="pin"]',
    ];
    
    let pinInputFound = false;
    let pinInput = null;
    
    for (const selector of pinSelectors) {
      pinInput = await page.$(selector);
      if (pinInput) {
        log(`   ✅ PIN input found: ${selector}`, 'green');
        pinInputFound = true;
        break;
      }
    }
    
    if (pinInputFound && pinInput) {
      log('\n🔐 Attempting to enter PIN: 31618585', 'cyan');
      
      try {
        // Enter PIN
        await pinInput.fill('31618585');
        log('   ✅ PIN entered', 'green');
        
        // Look for submit button
        const submitSelectors = [
          'button[type="submit"]',
          'button:has-text("Enter")',
          'button:has-text("Submit")',
          'button:has-text("Войти")',
          'button:has-text("OK")',
        ];
        
        let submitButton = null;
        for (const selector of submitSelectors) {
          try {
            submitButton = await page.$(selector);
            if (submitButton) {
              log(`   ✅ Submit button found: ${selector}`, 'green');
              break;
            }
          } catch (e) {
            // Try next selector
          }
        }
        
        if (submitButton) {
          await submitButton.click();
          log('   ✅ Submit button clicked', 'green');
          
          // Wait for navigation or content change
          await page.waitForTimeout(2000);
          
          // Take screenshot after PIN entry
          const screenshotPath2 = path.join(SCREENSHOTS_DIR, '05-nexx-after-pin.png');
          await page.screenshot({ path: screenshotPath2, fullPage: true });
          log(`   📸 Screenshot saved: ${screenshotPath2}`, 'green');
          
          // Check if we're still on PIN screen or if we entered
          const stillHasPinInput = await page.$(pinSelectors[0]);
          if (stillHasPinInput) {
            log('   ⚠️ Still on PIN screen - PIN may be incorrect or form not submitted', 'yellow');
          } else {
            log('   ✅ Successfully entered database!', 'green');
          }
        } else {
          log('   ⚠️ Submit button not found', 'yellow');
          log('   💡 Try pressing Enter key', 'blue');
          await pinInput.press('Enter');
          await page.waitForTimeout(2000);
          
          const screenshotPath2 = path.join(SCREENSHOTS_DIR, '05-nexx-after-enter.png');
          await page.screenshot({ path: screenshotPath2, fullPage: true });
          log(`   📸 Screenshot saved: ${screenshotPath2}`, 'green');
        }
      } catch (error) {
        log(`   ❌ Error entering PIN: ${error.message}`, 'red');
      }
    } else {
      log('   ⚠️ PIN input not found', 'yellow');
      log('   💡 Page may already be authenticated or PIN screen not rendered', 'blue');
    }
    
    // Check console errors
    log('\n🐛 Console Errors:', 'yellow');
    if (consoleData.errors.length === 0) {
      log('   ✅ No console errors', 'green');
    } else {
      log(`   ❌ Found ${consoleData.errors.length} errors:`, 'red');
      consoleData.errors.forEach(err => log(`      - ${err}`, 'red'));
    }
    
    return { success: true, pinInputFound, errors: consoleData.errors };
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  } finally {
    await page.close();
  }
}

async function testCabinet(browser) {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║              TEST 4: Cabinet Route (/cabinet)          ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  const page = await browser.newPage();
  const consoleData = await captureConsoleErrors(page);
  
  try {
    log('📍 Navigating to http://localhost:5173/cabinet', 'cyan');
    await page.goto(`${BASE_URL}/cabinet`, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Take screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, '06-cabinet.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    log(`📸 Screenshot saved: ${screenshotPath}`, 'green');
    
    // Check page title
    const title = await page.title();
    log(`📄 Page Title: ${title}`, 'blue');
    
    log('\n🔍 Checking cabinet page elements:', 'yellow');
    
    // Check for common cabinet elements
    const cabinetElements = [
      { name: 'Dashboard', selector: '[class*="dashboard"], [class*="cabinet"]' },
      { name: 'Navigation', selector: 'nav, [role="navigation"]' },
      { name: 'Content Area', selector: 'main, [role="main"]' },
    ];
    
    for (const element of cabinetElements) {
      try {
        const el = await page.$(element.selector);
        if (el) {
          log(`   ✅ ${element.name} found`, 'green');
        } else {
          log(`   ⚠️ ${element.name} not found`, 'yellow');
        }
      } catch (error) {
        log(`   ❌ ${element.name} error: ${error.message}`, 'red');
      }
    }
    
    // Check console errors
    log('\n🐛 Console Errors:', 'yellow');
    if (consoleData.errors.length === 0) {
      log('   ✅ No console errors', 'green');
    } else {
      log(`   ❌ Found ${consoleData.errors.length} errors:`, 'red');
      consoleData.errors.forEach(err => log(`      - ${err}`, 'red'));
    }
    
    return { success: true, errors: consoleData.errors };
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  } finally {
    await page.close();
  }
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║     NEXX Service Center - Browser Testing Suite       ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  log(`📂 Screenshots will be saved to: ${SCREENSHOTS_DIR}\n`, 'blue');
  
  let browser;
  try {
    log('🚀 Launching browser...', 'cyan');
    browser = await chromium.launch({ headless: true });
    log('✅ Browser launched\n', 'green');
    
    const results = {
      landingPage: await testLandingPage(browser),
      calculator: await testCalculator(browser),
      nexxDatabase: await testNexxDatabase(browser),
      cabinet: await testCabinet(browser),
    };
    
    // Summary
    log('\n' + '═'.repeat(60), 'bright');
    log('📊 FINAL TEST SUMMARY', 'bright');
    log('═'.repeat(60), 'bright');
    
    const allErrors = [
      ...(results.landingPage.errors || []),
      ...(results.nexxDatabase.errors || []),
      ...(results.cabinet.errors || []),
    ];
    
    log('\n✅ All Tests Completed', 'green');
    log(`📸 Screenshots saved to: ${SCREENSHOTS_DIR}`, 'blue');
    
    if (allErrors.length > 0) {
      log(`\n⚠️ Total Console Errors: ${allErrors.length}`, 'yellow');
      log('\nUnique Errors:', 'yellow');
      const uniqueErrors = [...new Set(allErrors)];
      uniqueErrors.forEach(err => log(`   - ${err}`, 'red'));
    } else {
      log('\n✅ No Console Errors Detected', 'green');
    }
    
    log('\n' + '═'.repeat(60), 'bright');
    log('\n💡 Review the screenshots in:', 'cyan');
    log(`   ${SCREENSHOTS_DIR}\n`, 'blue');
    
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
