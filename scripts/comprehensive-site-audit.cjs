#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'audit-screenshots');

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
  log(`   📸 ${filename}`, 'green');
  screenshotCounter++;
  return filepath;
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║     COMPREHENSIVE SITE AUDIT - Production Ready?      ║', 'bright');
  log('║              http://localhost:5173/                    ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');
  
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  const allErrors = [];
  const allWarnings = [];
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      allErrors.push(text);
      log(`      🔴 ${text}`, 'red');
    } else if (type === 'warning') {
      allWarnings.push(text);
    }
  });
  
  page.on('pageerror', error => {
    allErrors.push(`Page Error: ${error.message}`);
    log(`      ❌ ${error.message}`, 'red');
  });
  
  const results = {};
  
  try {
    // TEST 1: LANDING PAGE
    log('═'.repeat(60), 'cyan');
    log('TEST 1: LANDING PAGE', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    await takeScreenshot(page, 'landing-page');
    
    // Check hero
    const hero = await page.$('section, .hero-bg, h1');
    log(`   Hero section: ${hero ? '✅' : '❌'}`, hero ? 'green' : 'red');
    results.hero = !!hero;
    
    // Check sections
    const sections = [
      { id: 'services', name: 'Services' },
      { id: 'calculator', name: 'Calculator' },
      { id: 'why-us', name: 'Why Us' },
      { id: 'gallery', name: 'Gallery' },
      { id: 'reviews', name: 'Reviews' },
      { id: 'track-order', name: 'Track Order' },
      { id: 'appointment', name: 'Appointment' },
      { id: 'contacts', name: 'Contact' },
    ];
    
    for (const sec of sections) {
      const el = await page.$(`#${sec.id}, [id="${sec.id}"]`);
      log(`   ${sec.name}: ${el ? '✅' : '⚠️'}`, el ? 'green' : 'yellow');
      results[sec.id] = !!el;
    }
    
    // Check footer
    const footer = await page.$('footer, [role="contentinfo"]');
    log(`   Footer: ${footer ? '✅' : '❌'}`, footer ? 'green' : 'red');
    results.footer = !!footer;
    
    if (footer) {
      const footerText = await footer.textContent();
      const hasCUI = footerText.includes('53879866') || footerText.includes('CUI');
      log(`   Footer has CUI: ${hasCUI ? '✅' : '⚠️'}`, hasCUI ? 'green' : 'yellow');
    }
    
    // TEST 2: HEADER/NAVIGATION
    log('\n' + '═'.repeat(60), 'cyan');
    log('TEST 2: HEADER/NAVIGATION', 'bright');
    log('═'.repeat(60), 'cyan');
    
    const headerChecks = await page.evaluate(() => {
      const header = document.querySelector('header, nav');
      if (!header) return {};
      
      return {
        hasLogo: !!header.querySelector('img, [class*="logo"]'),
        links: Array.from(header.querySelectorAll('a')).map(a => a.textContent.trim()).filter(t => t),
        buttons: Array.from(header.querySelectorAll('button')).map(b => b.textContent.trim()).filter(t => t),
      };
    });
    
    log(`   Logo: ${headerChecks.hasLogo ? '✅' : '⚠️'}`, headerChecks.hasLogo ? 'green' : 'yellow');
    log(`   Links: ${headerChecks.links?.join(', ')}`, 'blue');
    log(`   Buttons: ${headerChecks.buttons?.join(', ')}`, 'blue');
    
    results.header = headerChecks;
    
    // TEST 3: PRICE CALCULATOR
    log('\n' + '═'.repeat(60), 'cyan');
    log('TEST 3: PRICE CALCULATOR', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.evaluate(() => {
      const calc = document.getElementById('calculator');
      if (calc) calc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(2000);
    
    await takeScreenshot(page, 'calculator-section');
    
    const calcCheck = await page.evaluate(() => {
      const calc = document.getElementById('calculator');
      if (!calc) return { exists: false };
      
      return {
        exists: true,
        hasSelects: calc.querySelectorAll('select').length,
        hasButtons: calc.querySelectorAll('button').length,
        hasInputs: calc.querySelectorAll('input').length,
        text: calc.textContent.substring(0, 200)
      };
    });
    
    log(`   Calculator exists: ${calcCheck.exists ? '✅' : '❌'}`, calcCheck.exists ? 'green' : 'red');
    if (calcCheck.exists) {
      log(`   Interactive elements: ${calcCheck.hasSelects + calcCheck.hasButtons + calcCheck.hasInputs}`, 'blue');
    }
    
    results.calculator = calcCheck;
    
    // Try interacting with calculator
    const calcButtons = await page.$$('#calculator button, #calculator [role="button"]');
    if (calcButtons.length > 0) {
      log(`   Found ${calcButtons.length} clickable elements`, 'blue');
      try {
        await calcButtons[0].click({ force: true });
        await page.waitForTimeout(1000);
        await takeScreenshot(page, 'calculator-clicked');
        log('   ✅ Clicked first element', 'green');
      } catch (e) {
        log(`   ⚠️ Could not click: ${e.message}`, 'yellow');
      }
    }
    
    // TEST 4: CALLBACK MODAL
    log('\n' + '═'.repeat(60), 'cyan');
    log('TEST 4: CALLBACK MODAL', 'bright');
    log('═'.repeat(60), 'cyan');
    
    const callbackExists = await page.evaluate(() => typeof window.openCallbackModal === 'function');
    log(`   window.openCallbackModal exists: ${callbackExists ? '✅' : '⚠️'}`, callbackExists ? 'green' : 'yellow');
    
    if (callbackExists) {
      await page.evaluate(() => window.openCallbackModal && window.openCallbackModal());
      await page.waitForTimeout(1500);
      await takeScreenshot(page, 'callback-modal');
      
      const modalVisible = await page.evaluate(() => {
        const modals = document.querySelectorAll('[role="dialog"], [class*="modal"]');
        return modals.length > 0;
      });
      
      log(`   Modal appeared: ${modalVisible ? '✅' : '⚠️'}`, modalVisible ? 'green' : 'yellow');
      
      // Close modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
    
    results.callbackModal = callbackExists;
    
    // TEST 5: GALLERY
    log('\n' + '═'.repeat(60), 'cyan');
    log('TEST 5: GALLERY SECTION', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.evaluate(() => {
      const gallery = document.getElementById('gallery');
      if (gallery) gallery.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(2000);
    
    await takeScreenshot(page, 'gallery-section');
    
    const galleryCheck = await page.evaluate(() => {
      const images = document.querySelectorAll('#gallery img, [id*="gallery"] img, section img');
      const loadedImages = Array.from(images).filter(img => img.complete && img.naturalHeight > 0);
      
      return {
        totalImages: images.length,
        loadedImages: loadedImages.length,
        brokenImages: images.length - loadedImages.length,
        imageSrcs: Array.from(images).slice(0, 5).map(img => img.src)
      };
    });
    
    log(`   Total images: ${galleryCheck.totalImages}`, 'blue');
    log(`   Loaded: ${galleryCheck.loadedImages}`, galleryCheck.loadedImages > 0 ? 'green' : 'yellow');
    log(`   Broken: ${galleryCheck.brokenImages}`, galleryCheck.brokenImages > 0 ? 'red' : 'green');
    
    results.gallery = galleryCheck;
    
    // TEST 6: CONTACT SECTION
    log('\n' + '═'.repeat(60), 'cyan');
    log('TEST 6: CONTACT SECTION', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.evaluate(() => {
      const contact = document.getElementById('contacts') || document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(2000);
    
    await takeScreenshot(page, 'contact-section');
    
    const contactCheck = await page.evaluate(() => {
      const contactSection = document.getElementById('contacts') || document.getElementById('contact');
      if (!contactSection) return { exists: false };
      
      const text = contactSection.textContent;
      return {
        exists: true,
        hasAddress: text.includes('Calea') || text.includes('București') || text.includes('Sector'),
        hasMap: !!contactSection.querySelector('iframe, [class*="map"]'),
        hasPhone: /\+?\d{10,}/.test(text) || text.includes('tel:'),
        text: text.substring(0, 300)
      };
    });
    
    log(`   Contact section: ${contactCheck.exists ? '✅' : '❌'}`, contactCheck.exists ? 'green' : 'red');
    if (contactCheck.exists) {
      log(`   Has address: ${contactCheck.hasAddress ? '✅' : '⚠️'}`, contactCheck.hasAddress ? 'green' : 'yellow');
      log(`   Has map: ${contactCheck.hasMap ? '✅' : '⚠️'}`, contactCheck.hasMap ? 'green' : 'yellow');
      log(`   Has phone: ${contactCheck.hasPhone ? '✅' : '⚠️'}`, contactCheck.hasPhone ? 'green' : 'yellow');
    }
    
    results.contact = contactCheck;
    
    // TEST 7: CABINET PAGE
    log('\n' + '═'.repeat(60), 'cyan');
    log('TEST 7: CABINET PAGE', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.goto(`${BASE_URL}/cabinet`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    await takeScreenshot(page, 'cabinet-page');
    
    const cabinetCheck = await page.evaluate(() => {
      return {
        title: document.title,
        hasLoginForm: !!document.querySelector('form, input[type="password"], [class*="login"]'),
        hasCabinetContent: !!document.querySelector('[class*="cabinet"], [class*="dashboard"]'),
        bodyText: document.body.textContent.substring(0, 200)
      };
    });
    
    log(`   Page title: ${cabinetCheck.title}`, 'blue');
    log(`   Has login form: ${cabinetCheck.hasLoginForm ? '✅' : '⚠️'}`, cabinetCheck.hasLoginForm ? 'green' : 'yellow');
    log(`   Has cabinet content: ${cabinetCheck.hasCabinetContent ? '✅' : '⚠️'}`, cabinetCheck.hasCabinetContent ? 'green' : 'yellow');
    
    results.cabinet = cabinetCheck;
    
    // TEST 8: NEXX DATABASE
    log('\n' + '═'.repeat(60), 'cyan');
    log('TEST 8: NEXX DATABASE', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.goto(`${BASE_URL}/nexx.html`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    await takeScreenshot(page, 'nexx-database');
    
    const nexxCheck = await page.evaluate(() => {
      return {
        title: document.title,
        hasPINForm: !!document.querySelector('input[type="password"], [placeholder*="PIN"]'),
        hasContent: document.body.textContent.length > 100,
        bodyText: document.body.textContent.substring(0, 200)
      };
    });
    
    log(`   Page title: ${nexxCheck.title}`, 'blue');
    log(`   Has PIN form: ${nexxCheck.hasPINForm ? '✅' : '⚠️'}`, nexxCheck.hasPINForm ? 'green' : 'yellow');
    log(`   Has content: ${nexxCheck.hasContent ? '✅' : '❌'}`, nexxCheck.hasContent ? 'green' : 'red');
    
    results.nexx = nexxCheck;
    
    // TEST 9: SERVICE WORKER
    log('\n' + '═'.repeat(60), 'cyan');
    log('TEST 9: SERVICE WORKER', 'bright');
    log('═'.repeat(60), 'cyan');
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const swCheck = await page.evaluate(() => {
      return {
        supported: 'serviceWorker' in navigator,
        controller: navigator.serviceWorker?.controller ? 'Active' : 'Not active',
        ready: !!navigator.serviceWorker?.ready
      };
    });
    
    log(`   Service Worker supported: ${swCheck.supported ? '✅' : '⚠️'}`, swCheck.supported ? 'green' : 'yellow');
    log(`   Status: ${swCheck.controller}`, swCheck.controller === 'Active' ? 'green' : 'yellow');
    
    results.serviceWorker = swCheck;
    
    // FINAL SUMMARY
    log('\n' + '═'.repeat(60), 'bright');
    log('📊 COMPREHENSIVE AUDIT SUMMARY', 'bright');
    log('═'.repeat(60), 'bright');
    
    log('\n✅ WORKING FEATURES:', 'green');
    const working = [];
    if (results.hero) working.push('Hero Section');
    if (results.services) working.push('Services');
    if (results.calculator?.exists) working.push('Calculator');
    if (results.reviews) working.push('Reviews');
    if (results.contacts) working.push('Contact');
    if (results.footer) working.push('Footer');
    if (results.header?.hasLogo) working.push('Header Logo');
    if (results.callbackModal) working.push('Callback Modal');
    if (results.gallery?.totalImages > 0) working.push('Gallery');
    
    working.forEach(f => log(`   ✅ ${f}`, 'green'));
    
    log('\n⚠️ ISSUES FOUND:', 'yellow');
    const issues = [];
    if (!results['why-us']) issues.push('Why Us section not found');
    if (!results['track-order']) issues.push('Track Order section not found');
    if (!results['appointment']) issues.push('Appointment section not found');
    if (results.gallery?.brokenImages > 0) issues.push(`${results.gallery.brokenImages} broken images`);
    if (!results.contact?.hasMap) issues.push('No map in contact section');
    if (allErrors.length > 0) issues.push(`${allErrors.length} console errors`);
    
    if (issues.length > 0) {
      issues.forEach(i => log(`   ⚠️ ${i}`, 'yellow'));
    } else {
      log('   ✅ No issues found!', 'green');
    }
    
    log('\n🐛 CONSOLE ERRORS:', allErrors.length > 0 ? 'red' : 'green');
    if (allErrors.length > 0) {
      const uniqueErrors = [...new Set(allErrors)];
      uniqueErrors.forEach((e, i) => log(`   ${i + 1}. ${e}`, 'red'));
    } else {
      log('   ✅ No console errors!', 'green');
    }
    
    log(`\n⚠️ CONSOLE WARNINGS: ${allWarnings.length}`, 'yellow');
    if (allWarnings.length > 0) {
      const uniqueWarnings = [...new Set(allWarnings)];
      uniqueWarnings.slice(0, 3).forEach((w, i) => log(`   ${i + 1}. ${w.substring(0, 100)}...`, 'yellow'));
    }
    
    log(`\n📸 Screenshots: ${screenshotCounter - 1}`, 'cyan');
    log(`📂 Location: ${SCREENSHOTS_DIR}`, 'blue');
    
    const score = (working.length / (working.length + issues.length)) * 100;
    log(`\n🎯 Production Readiness Score: ${score.toFixed(0)}%`, score > 80 ? 'green' : 'yellow');
    
    if (score >= 90) {
      log('✅ READY FOR PRODUCTION!', 'green');
    } else if (score >= 70) {
      log('⚠️ MOSTLY READY - Minor fixes needed', 'yellow');
    } else {
      log('❌ NOT READY - Major issues need fixing', 'red');
    }
    
    log('\n✅ Audit Completed!', 'green');
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
