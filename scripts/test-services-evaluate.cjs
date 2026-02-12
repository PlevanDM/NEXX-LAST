const { chromium } = require("playwright");
async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto("http://localhost:5173/nexx");
  await page.waitForTimeout(3000);
  
  const pinInput = await page.$('input[type="password"]');
  if (pinInput) {
    await pinInput.fill("31618585");
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
    console.log("✅ Modal opened\n");
    
    console.log("TOATE TAB:");
    await page.screenshot({ path: "final-01-toate.png" });
    
    const toateCount = await page.evaluate(() => {
      const items = document.querySelectorAll('text=/Diagnoză|Înlocuire|Reparație/i');
      return items ? items.length : 0;
    });
    console.log("  Services: " + toateCount);
    
    const tabs = [
      { name: "iPhone", text: "📱iPhone" },
      { name: "iPad", text: "📟iPad" },
      { name: "MacBook", text: "💻MacBook" },
      { name: "Watch", text: "Apple Watch" },
      { name: "Extra", text: "Extra" }
    ];
    
    for (const tab of tabs) {
      console.log("\n" + tab.name.toUpperCase() + " TAB:");
      
      await page.evaluate((tabText) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent.includes(tabText));
        if (btn) btn.click();
      }, tab.text);
      
      await page.waitForTimeout(1500);
      await page.screenshot({ path: "final-02-" + tab.name.toLowerCase() + ".png" });
      
      const count = await page.evaluate(() => {
        const modal = document.querySelector('[class*="modal"], [class*="fixed"]');
        if (!modal) return 0;
        const texts = modal.innerText;
        const matches = texts.match(/Înlocuire|Reparație|Diagnoză|Cameră|Port|Carcase/gi);
        return matches ? matches.length : 0;
      });
      
      console.log("  Services: " + count);
    }
    
    console.log("\n✅ TEST COMPLETE");
    
  } else {
    console.log("❌ Modal NOT found");
  }
  
  await page.waitForTimeout(3000);
  await browser.close();
}
main();
