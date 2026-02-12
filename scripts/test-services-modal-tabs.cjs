const { chromium } = require("playwright");
async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto("http://localhost:5173/nexx");
  console.log("Step 1: Loaded /nexx");
  await page.waitForTimeout(3000);
  
  const pinInput = await page.$('input[type="password"]');
  if (pinInput) {
    console.log("Step 2: Entering PIN and logging in");
    await pinInput.fill("31618585");
    await page.waitForTimeout(300);
    const loginBtn = await page.$('button:has-text("Увійти")');
    if (loginBtn) {
      await loginBtn.click();
      await page.waitForTimeout(5000);
      console.log("Step 3: Logged in successfully");
    }
  }
  
  const uslugiBtn = await page.$('button:has-text("Услуги")');
  if (uslugiBtn) {
    console.log("Step 4: Clicking Услуги button");
    await uslugiBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "services-modal-01-toate.png" });
    console.log("Step 5: Services modal opened (Toate tab)");
    
    const modal = await page.$('[role="dialog"]');
    if (modal) {
      console.log("\n✅ Modal is present in DOM");
      
      const serviceItems = await modal.$$('div[class*="grid"] > div, li');
      console.log("Services in Toate tab: " + serviceItems.length);
      
      const diagnoza = await modal.$('text=/Diagnoză/i');
      if (diagnoza) console.log("  ✅ Diagnoză service found");
      
      const gratuit = await modal.$('text=/Gratuit/i');
      if (gratuit) console.log("  ✅ Gratuit label found");
      
      const prices = await modal.$$('text=/de la.*lei/i, text=/[0-9]+-[0-9]+ lei/i, text=/[0-9]+ lei/i');
      console.log("  💰 Price badges: " + prices.length);
      
      console.log("\nStep 6: Testing category tabs inside modal");
      
      const tabs = [
        { name: "iPhone", selector: 'button:has-text("iPhone")' },
        { name: "iPad", selector: 'button:has-text("iPad")' },
        { name: "MacBook", selector: 'button:has-text("MacBook")' },
        { name: "Apple Watch", selector: 'button:has-text("Apple Watch")' },
        { name: "Extra", selector: 'button:has-text("Extra")' }
      ];
      
      for (const tab of tabs) {
        console.log("\n  Testing: " + tab.name);
        
        const tabButtons = await modal.$$(tab.selector);
        console.log("    Found " + tabButtons.length + " matching buttons");
        
        if (tabButtons.length > 0) {
          const tabBtn = tabButtons[0];
          await tabBtn.click();
          await page.waitForTimeout(1500);
          
          const items = await modal.$$('div[class*="grid"] > div, li, [class*="service"]');
          console.log("    Items shown: " + items.length);
          
          const tabPrices = await modal.$$('text=/de la/i, text=/[0-9]+ lei/i');
          console.log("    Prices: " + tabPrices.length);
          
          await page.screenshot({ path: "services-modal-" + tab.name.toLowerCase().replace(" ", "-") + ".png" });
          console.log("    📸 Screenshot saved");
        }
      }
      
      console.log("\n✅ Test Complete!");
      
    } else {
      console.log("❌ Modal not found");
    }
  } else {
    console.log("❌ Услуги button not found");
  }
  
  await page.waitForTimeout(5000);
  await browser.close();
}
main();
