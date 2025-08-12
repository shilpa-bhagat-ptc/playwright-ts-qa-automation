import { Page, test } from "@playwright/test";
import fs from "fs";
import path from "path";

export async function captureStepScreenshot(
  page: Page,
  testInfo: any,
  stepName: string
) {
  // 🧼 Sanitize test title for folder name
  const safeTitle = testInfo.title.replace(/[^a-zA-Z0-9-_]/g, "_");
  const dir = path.join("screenshots", safeTitle);

  // Optional: Set test timeout
  test.setTimeout(60000);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(dir, `${stepName}-${timestamp}.png`);

  try {
    await page.waitForLoadState("domcontentloaded", { timeout: 10000 });

    await page.screenshot({
      path: filePath,
      fullPage: false,
      timeout: 10000,
    });

    console.log(`Screenshot captured: ${filePath}`);
  } catch (error) {
    console.error(`Failed to capture screenshot at step "${stepName}":`, error);
  }
}
