const { chromium } = require("playwright");
async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto("http://localhost:5173/nexx");
  console.log("Step 1: Loaded /nexx");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "services-01-login.png" });
  
  const pinInput = await page.$('input[type="password"]');
  if (pinInput) {
    console.log("Step 2: Found PIN input, entering 31618585");
    await pinInput.fill("31618585");
    await page.waitForTimeout(500);
    
    const loginBtn = await page.$('button:has-text("Увійти")');
    if (loginBtn) {
      console.log("Step 3: Clicking login button");
      await loginBtn.click();
      await page.waitForTimeout(5000);
      await page.screenshot({ path: "services-02-logged-in.png" });
      console.log("Step 4: Logged in, checking for Services button");
    }
  }
  
  const allButtons = await page.$$("button");
  console.log("Found " + allButtons.length + " buttons:");
  for (const btn of allButtons) {
    const text = await btn.textContent();
    if (text) console.log("  - " + text.trim());
  }
  
  const uslugiBtn = await page.$('button:has-text("Услуги")');
  if (uslugiBtn) {
    console.log("\nStep 5: Found Services button! Clicking it...");
    await uslugiBtn.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "services-03-modal-opened.png" });
    console.log("Step 6: Services modal should be open");
    
    const tabs = ["iPhone", "iPad", "MacBook", "Apple Watch", "Extra"];
    for (const tabName of tabs) {
      const tab = await page.$('button:has-text("' + tabName + '")');
      if (tab) {
        console.log("\nTesting tab: " + tabName);
        await tab.click();
        await page.waitForTimeout(1500);
        
        const services = await page.$$('[class*="service-item"], li');
        console.log("  Services found: " + services.length);
        
        const prices = await page.$$('text=/де ла.*лей/i');
        console.log("  Prices found: " + prices.length);
        
        await page.screenshot({ path: "services-04-" + tabName.toLowerCase().replace(" ", "-") + ".png" });
      }
    }
  } else {
    console.log("\nServices button NOT found");
  }
  
  await page.waitForTimeout(5000);
  await browser.close();
}
main();
