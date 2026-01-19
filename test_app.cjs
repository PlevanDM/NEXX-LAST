const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log('[PAGE ERROR]', err.message);
  });
  
  console.log('Loading page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  
  console.log('Page loaded, waiting for grid...');
  await page.waitForSelector('.grid', { timeout: 10000 });
  
  console.log('Clicking on first device card...');
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.grid > div');
    console.log('Found cards:', cards.length);
    if (cards.length > 0) {
      cards[0].click();
    }
  });
  
  // Wait for details view to appear or error
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('Done');
  await browser.close();
})();
