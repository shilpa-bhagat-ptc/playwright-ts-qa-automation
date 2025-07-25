// global-setup.ts
import { chromium, FullConfig } from "@playwright/test";
import path from "path";
import { formatXml } from "../../tools/formatJUnitReport";

async function globalSetup(config: FullConfig) {
  console.log("Global setup...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(
    "http://lqatms-test3.ptcnet.ptc.com:8080/QALink/jsp/home/login.jsp"
  );

  await page.fill('input[name="login_id"]', "sbhagat");
  await page.fill('input[name="password"]', "123");
  await Promise.all([
    page.click('input[type="submit"]'),
    await page.waitForLoadState("networkidle"), // ⏳ Wait for redirect
  ]);
  const storagePath = path.resolve(process.cwd(), ".auth/storageState.json");
  await page.context().storageState({ path: storagePath });
  console.log(`Storage state will be saved to: ${storagePath}`);
  await browser.close();
  console.log("✅ Session stored successfully.");
  await formatXml();
  console.log("✅ XML formatted successfully.");
  console.log("Global setup completed.");
}

export default globalSetup;
