const { chromium } = require("playwright");

(async () => {
  const b = await chromium.launch({ headless: false });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log("Step 1: Navigate and login");
  await p.goto("http://localhost:5173/nexx");
  await p.waitForTimeout(4000);
  
  await p.$eval('input[type="password"]', el => el.value = "31618585");
  await p.click('button:has-text("Увійти")');
  await p.waitForTimeout(6000);
  console.log("Step 2: Logged in");
  
  await p.click('button:has-text("Услуги")');
  await p.waitForTimeout(3000);
  console.log("Step 3: Services modal opened");
  
  await p.screenshot({ path: "report-01-toate.png", fullPage: true });
  console.log("Screenshot: report-01-toate.png (Toate tab)");
  
  console.log("\nManual tab switching (wait 10 seconds per tab)...");
  console.log("Please manually click: iPhone, iPad, MacBook, Apple Watch, Extra");
  console.log("Screenshots will be taken automatically every 10 seconds");
  
  for (let i = 2; i <= 6; i++) {
    await p.waitForTimeout(10000);
    await p.screenshot({ path: "report-0" + i + "-tab.png", fullPage: true });
    console.log("Screenshot: report-0" + i + "-tab.png");
  }
  
  console.log("\n✅ All screenshots captured");
  await p.waitForTimeout(2000);
  await b.close();
})();
