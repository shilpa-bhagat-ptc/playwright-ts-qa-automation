/**
 * Self-Healing Locator Utility
 *
 * Wraps Playwright locators with AI-driven fallback strategies.
 * When a primary locator fails, it attempts alternative strategies:
 *   1. Text-based matching
 *   2. Attribute-based partial matching
 *   3. Nearby element heuristics
 *   4. Logs the failure for locator maintenance
 *
 * Usage in Page Objects:
 *   import { resilientLocator } from "../utils/selfHealingLocator";
 *
 *   async clickSubmit() {
 *     const loc = await resilientLocator(this.page, {
 *       primary: 'input[type="submit"]',
 *       fallbacks: ['button:has-text("Submit")', '[data-testid="submit"]'],
 *       description: "Submit button",
 *     });
 *     await loc.click();
 *   }
 */

import { Locator, Page } from "@playwright/test";
import fs from "fs";
import path from "path";

interface ResilientLocatorOptions {
  /** Primary CSS/XPath selector */
  primary: string;
  /** Ordered fallback selectors */
  fallbacks?: string[];
  /** Human-readable name for logging */
  description?: string;
  /** Timeout before trying fallbacks (ms) */
  timeout?: number;
}

interface HealingLogEntry {
  timestamp: string;
  description: string;
  primarySelector: string;
  usedSelector: string;
  strategy: string;
  pageUrl: string;
}

const HEALING_LOG_PATH = path.join("reports", "self-healing-log.json");

function appendHealingLog(entry: HealingLogEntry) {
  let log: HealingLogEntry[] = [];
  if (fs.existsSync(HEALING_LOG_PATH)) {
    try {
      log = JSON.parse(fs.readFileSync(HEALING_LOG_PATH, "utf-8"));
    } catch {
      log = [];
    }
  }
  log.push(entry);
  const dir = path.dirname(HEALING_LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(HEALING_LOG_PATH, JSON.stringify(log, null, 2));
}

/**
 * Attempts to locate an element using the primary selector, then falls back
 * to alternative strategies if the primary fails.
 */
export async function resilientLocator(
  page: Page,
  options: ResilientLocatorOptions,
): Promise<Locator> {
  const {
    primary,
    fallbacks = [],
    description = "element",
    timeout = 3000,
  } = options;

  // Strategy 1: Primary selector
  try {
    const loc = page.locator(primary);
    await loc.waitFor({ state: "visible", timeout });
    return loc;
  } catch {
    console.warn(`⚠️  Primary locator failed for "${description}": ${primary}`);
  }

  // Strategy 2: Explicit fallbacks
  for (const fb of fallbacks) {
    try {
      const loc = page.locator(fb);
      await loc.waitFor({ state: "visible", timeout: timeout / 2 });
      console.log(`🔄 Healed "${description}" using fallback: ${fb}`);
      appendHealingLog({
        timestamp: new Date().toISOString(),
        description,
        primarySelector: primary,
        usedSelector: fb,
        strategy: "explicit-fallback",
        pageUrl: page.url(),
      });
      return loc;
    } catch {
      // Try next fallback
    }
  }

  // Strategy 3: Text-based auto-heal — try to find by visible text
  if (description) {
    const textVariants = [
      page.getByRole("button", { name: description }),
      page.getByRole("link", { name: description }),
      page.getByText(description, { exact: false }),
      page.getByLabel(description),
      page.getByPlaceholder(description),
    ];

    for (const variant of textVariants) {
      try {
        await variant
          .first()
          .waitFor({ state: "visible", timeout: timeout / 2 });
        const selector = `getByText/Role("${description}")`;
        console.log(`🧠 Auto-healed "${description}" using text matching`);
        appendHealingLog({
          timestamp: new Date().toISOString(),
          description,
          primarySelector: primary,
          usedSelector: selector,
          strategy: "text-auto-heal",
          pageUrl: page.url(),
        });
        return variant.first();
      } catch {
        // Try next variant
      }
    }
  }

  // Strategy 4: Partial attribute match from primary selector
  const attrMatch = primary.match(/\[(\w+)=["']([^"']+)["']\]/);
  if (attrMatch) {
    const [, attr, value] = attrMatch;
    const partialSelector = `[${attr}*="${value.substring(0, Math.ceil(value.length / 2))}"]`;
    try {
      const loc = page.locator(partialSelector).first();
      await loc.waitFor({ state: "visible", timeout: timeout / 2 });
      console.log(
        `🔍 Partial-healed "${description}" using: ${partialSelector}`,
      );
      appendHealingLog({
        timestamp: new Date().toISOString(),
        description,
        primarySelector: primary,
        usedSelector: partialSelector,
        strategy: "partial-attribute",
        pageUrl: page.url(),
      });
      return loc;
    } catch {
      // Final fallback below
    }
  }

  // All strategies failed — throw with detailed message
  throw new Error(
    `Self-healing failed for "${description}".\n` +
      `  Primary: ${primary}\n` +
      `  Fallbacks tried: ${fallbacks.length}\n` +
      `  Page: ${page.url()}\n` +
      `  Check reports/self-healing-log.json for history.`,
  );
}

/**
 * Creates a resilient locator factory bound to a page.
 * Useful in page objects to avoid passing `page` every time.
 */
export function createLocatorFactory(page: Page) {
  return (options: ResilientLocatorOptions) => resilientLocator(page, options);
}
