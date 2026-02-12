const { chromium } = require("playwright");
async function main() {
  const b = await chromium.launch({ headless: false, slowMo: 500 });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await p.goto("http://localhost:5173/nexx");
  await p.waitForTimeout(3000);
  
  await p.$eval('input[type="password"]', el => el.value = "31618585");
  await p.click('button:has-text("Увійти")');
  await p.waitForTimeout(5000);
  
  await p.click('button:has-text("Услуги")');
  await p.waitForTimeout(2000);
  
  console.log("=== SERVICES MODAL TEST ===\n");
  console.log("TOATE TAB:");
  await p.screenshot({ path: "srv-toate.png" });
  
  const toateText = await p.evaluate(() => document.body.innerText);
  const diagnoza = toateText.includes("Diagnoză") && toateText.includes("Gratuit");
  console.log("  Diagnoză (Gratuit): " + (diagnoza ? "YES" : "NO"));
  console.log("  Înlocuire ecran: " + (toateText.includes("Înlocuire ecran") ? "YES" : "NO"));
  console.log("  Reparație placă: " + (toateText.includes("placă de bază") ? "YES" : "NO"));
  
  const tabs = [
    ["iPhone", "📱iPhone"],
    ["iPad", "📟iPad"], 
    ["MacBook", "💻MacBook"],
    ["Apple Watch", "Apple Watch"],
    ["Extra", "Extra"]
  ];
  
  for (const [name, btnText] of tabs) {
    console.log("\n" + name.toUpperCase() + " TAB:");
    
    await p.evaluate((txt) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes(txt));
      if (btn) btn.click();
    }, btnText);
    
    await p.waitForTimeout(1500);
    await p.screenshot({ path: "srv-" + name.toLowerCase().replace(" ", "-") + ".png" });
    
    const text = await p.evaluate(() => document.body.innerText);
    console.log("  Înlocuire ecran: " + (text.includes("Înlocuire ecran") ? "YES" : "NO"));
    console.log("  Prices visible: " + (text.includes("de la") || text.includes("lei") ? "YES" : "NO"));
  }
  
  console.log("\n✅ DONE");
  await p.waitForTimeout(3000);
  await b.close();
}
main();
