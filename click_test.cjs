// Click test script
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Collect console messages
  const logs = [];
  page.on('console', msg => {
    logs.push({ type: msg.type(), text: msg.text() });
  });
  
  page.on('pageerror', err => {
    logs.push({ type: 'ERROR', text: err.message });
  });
  
  try {
    console.log('Opening page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded');
    
    // Wait for cards to appear
    await page.waitForSelector('.grid > div', { timeout: 10000 });
    console.log('Cards found');
    
    // Count cards
    const cardCount = await page.locator('.grid > div').count();
    console.log(`Found ${cardCount} cards`);
    
    // Click first card
    console.log('Clicking first card...');
    await page.locator('.grid > div').first().click();
    
    // Wait a bit for React to render
    await page.waitForTimeout(2000);
    
    // Check if we have DeviceDetailsView
    const backBtn = await page.locator('button:has-text("← Назад")').count();
    console.log(`Back button found: ${backBtn > 0}`);
    
    // Check page content
    const pageText = await page.textContent('body');
    const hasDetailView = pageText.includes('Обзор устройства') || pageText.includes('Информация') || pageText.includes('Запчасти');
    console.log(`Detail view rendered: ${hasDetailView}`);
    
    console.log('\n=== Console Logs ===');
    logs.forEach(l => console.log(`[${l.type}] ${l.text.substring(0, 200)}`));
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\n=== Console Logs ===');
    logs.forEach(l => console.log(`[${l.type}] ${l.text.substring(0, 200)}`));
  } finally {
    await browser.close();
  }
})();
