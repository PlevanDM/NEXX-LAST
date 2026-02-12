const { chromium } = require("playwright");
async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto("http://localhost:5173/nexx");
  console.log("Loaded /nexx");
  await page.waitForTimeout(5000);
  await page.screenshot({ path: "s01-initial.png" });
  console.log("Screenshot 1");
  const buttons = await page.$$("button");
  console.log("Found " + buttons.length + " buttons");
  for (const btn of buttons) {
    const text = await btn.textContent();
    if (text) console.log("Button: " + text.trim());
  }
  await page.waitForTimeout(10000);
  await browser.close();
}
main();
