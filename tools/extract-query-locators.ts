import { chromium, Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Utility to generate a locator key from a selector
function toLocatorKey(selector: string) {
  // Example: //a[normalize-space()='Basic'] => basicTab
  const match = selector.match(/\[normalize-space\(\)='([^']+)'\]/);
  if (match) {
    return match[1].replace(/\s+/g, "") + "Tab";
  }
  // Fallback
  return selector.replace(/[^a-zA-Z0-9]/g, "_");
}

// Utility to read existing locators from a file
function readExistingLocators(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf-8");
  const regex = /([a-zA-Z0-9_]+):\s*([`'"])(.+?)\2/g;
  const locators: Record<string, string> = {};
  let match;
  while ((match = regex.exec(content))) {
    locators[match[1]] = match[3];
  }
  return locators;
}

// Utility to append new locators to the locators file
function appendLocators(filePath: string, newLocators: Record<string, string>) {
  let content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : "export const QUERY_PAGE_LOCATORS = {\n";
  // Remove trailing '};' if present
  content = content.replace(/};?\s*$/, "");
  for (const [key, value] of Object.entries(newLocators)) {
    content += `  ${key}: \
    \\"${value}",\n`;
  }
  content += "};\n";
  fs.writeFileSync(filePath, content, "utf-8");
}

async function extractTabLocators(page: Page, tabSelector: string) {
  await page.click(tabSelector);
  await page.waitForTimeout(1000);
  // Find actionable elements
  const locators: Record<string, string> = {};
  const elements = await page.$$("a,button,input,select,textarea");
  for (const el of elements) {
    const role = await el.getAttribute("role");
    const text = await el.textContent();
    if (text && text.trim().length > 0) {
      const selector = `//${await el.evaluate((e) => e.tagName.toLowerCase())}[normalize-space(text())='${text.trim()}']`;
      const key = toLocatorKey(selector);
      locators[key] = selector;
    }
  }
  return locators;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("https://lqatms-test3.ptcnet.ptc.com/QALink/jsp/query/");

  // Example: crawl Query page tabs
  const tabSelectors = [
    "//a[normalize-space()='Basic']",
    "//a[normalize-space()='Advanced']",
    "//a[normalize-space()='Update']",
  ];
  const locatorsFile = path.resolve(
    __dirname,
    "../src/locators/queryPage.locators.ts",
  );
  const existingLocators = readExistingLocators(locatorsFile);
  let allNewLocators: Record<string, string> = {};

  for (const tabSelector of tabSelectors) {
    try {
      const newLocators = await extractTabLocators(page, tabSelector);
      for (const [key, value] of Object.entries(newLocators)) {
        if (
          !Object.values(existingLocators).includes(value) &&
          !Object.values(allNewLocators).includes(value)
        ) {
          allNewLocators[key] = value;
        }
      }
    } catch (e) {
      console.error(`Failed to extract for tab ${tabSelector}:`, e);
    }
  }

  if (Object.keys(allNewLocators).length > 0) {
    appendLocators(locatorsFile, allNewLocators);
    console.log("New locators added:", allNewLocators);
  } else {
    console.log("No new locators found.");
  }

  await browser.close();
})();
