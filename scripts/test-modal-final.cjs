const { chromium } = require("playwright");
async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto("http://localhost:5173/nexx");
  await page.waitForTimeout(3000);
  
  const pinInput = await page.$('input[type="password"]');
  if (pinInput) {
    await pinInput.fill("31618585");
    await page.waitForTimeout(300);
    const loginBtn = await page.$('button:has-text("Увійти")');
    await loginBtn.click();
    await page.waitForTimeout(5000);
  }
  
  const uslugiBtn = await page.$('button:has-text("Услуги")');
  await uslugiBtn.click();
  await page.waitForTimeout(2000);
  
  console.log("=== SERVICII DISPONIBILE MODAL TEST ===\n");
  
  const modalTitle = await page.$('text=/Servicii disponibile/i');
  if (modalTitle) {
    console.log("✅ Modal opened successfully\n");
    
    console.log("--- TOATE TAB (All Services) ---");
    await page.screenshot({ path: "modal-01-toate.png", fullPage: true });
    
    const toateServices = await page.$$eval('text=/Diagnoză|Înlocuire|Reparație|Cameră|Port|Carcase|Sticle|Tastatura|Microfon|Trackpad|Top Case|Difuzor|Touch ID/i', els => els.length);
    console.log("Services found: " + toateServices);
    
    const diagnoza = await page.$('text=/Diagnoză/i');
    const gratuitLabel = await page.$('text=/Gratuit/i');
    console.log("✅ Diagnoză: " + (diagnoza ? "YES" : "NO"));
    console.log("✅ Gratuit label: " + (gratuitLabel ? "YES" : "NO"));
    
    const allPrices = await page.$$('text=/de la [0-9]+.*lei/i, text=/[0-9]+-[0-9]+/');
    console.log("💰 Price badges visible: " + allPrices.length + "\n");
    
    const tabs = ["iPhone", "iPad", "MacBook", "Apple Watch", "Extra"];
    
    for (const tabName of tabs) {
      console.log("--- " + tabName.toUpperCase() + " TAB ---");
      
      const tabBtn = await page.$('button:has-text("' + tabName + '")');
      if (tabBtn) {
        await tabBtn.click();
        await page.waitForTimeout(1500);
        
        await page.screenshot({ path: "modal-02-" + tabName.toLowerCase().replace(" ", "-") + ".png", fullPage: true });
        
        const services = await page.$$eval('text=/Înlocuire|Reparație|Cameră|Port|Carcase|Sticle|Tastatura|Microfon|Trackpad|Top Case|Difuzor|Touch ID|Diagnoză/i', els => els.length);
        console.log("Services in tab: " + services);
        
        const prices = await page.$$('text=/de la [0-9]+/i, text=/[0-9]+-[0-9]+ lei/i');
        console.log("Prices showing: " + prices.length + "\n");
      }
    }
    
    console.log("✅ TEST COMPLETE");
    
  } else {
    console.log("❌ Modal NOT found");
  }
  
  await page.waitForTimeout(3000);
  await browser.close();
}
main();
