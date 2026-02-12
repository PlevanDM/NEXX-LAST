const { chromium } = require('playwright');
const path = require('path');

async function main() {
  console.log('Testing Services Modal on http://localhost:5173/nexx\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  try {
    // Navigate
    await page.goto('http://localhost:5173/nexx');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'services-01-initial.png' });
    console.log('✅ Initial page loaded\n');
    
    // Try hamburger menu
    const hamburger = await page.$('button:has-text("☰")');
    if (hamburger) {
      await hamburger.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'services-02-hamburger.png' });
      console.log('✅ Hamburger clicked\n');
    }
    
    // Click Services button
    const uslugiBtn = await page.$('button:has-text("Услуги")');
    if (uslugiBtn) {
      await uslugiBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'services-03-modal.png' });
      console.log('✅ Услуги clicked\n');
    }
    
    // Test tabs
    const tabs = ['iPhone', 'iPad', 'MacBook', 'Apple Watch', 'Extra'];
    for (const tab of tabs) {
      const tabBtn = await page.$(`button:has-text("${tab}")`);
      if (tabBtn) {
        await tabBtn.click();
        await page.waitForTimeout(1000);
        const services = await page.$$('[class*="service"]');
        console.log(`${tab}: ${services.length} items`);
        await page.screenshot({ path: `services-04-${tab.replace(' ', '-')}.png` });
      }
    }
    
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

main();
