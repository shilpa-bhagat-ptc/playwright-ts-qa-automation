/**
 * MCP Multi-Page Crawler
 *
 * Navigates through multiple tabs/pages of the QA app using the stored auth
 * session, extracts locators from each page, and generates a complete set of
 * locator files and page objects for the entire application.
 *
 * Usage:
 *   npx ts-node tools/mcpCrawler.ts
 *
 * Configure pages to crawl in the PAGES_TO_CRAWL array below.
 */

import { chromium, Page } from "@playwright/test";
import fs from "fs";
import path from "path";

interface CrawlTarget {
  name: string;
  url: string;
  /** Optional actions to perform before extraction (e.g., click a tab) */
  preActions?: (page: Page) => Promise<void>;
}

const BASE_URL =
  process.env.TEST_BASE_URL || "http://lqatms-test5.ptcnet.ptc.com:8080/QALink";

/**
 * Add/remove pages you want to crawl here.
 * Each entry becomes a separate locator + page object file.
 */
const PAGES_TO_CRAWL: CrawlTarget[] = [
  {
    name: "homePage",
    url: `${BASE_URL}/jsp/home/`,
  },
  {
    name: "planningPage",
    url: `${BASE_URL}/jsp/planning/`,
  },
  {
    name: "adminPage",
    url: `${BASE_URL}/jsp/admin/`,
  },
  {
    name: "queryPage",
    url: `${BASE_URL}/jsp/query/`,
  },
  {
    name: "reportPage",
    url: `${BASE_URL}/jsp/report/`,
  },
  {
    name: "executionPage",
    url: `${BASE_URL}/jsp/execution/`,
  },
  {
    name: "userPage",
    url: `${BASE_URL}/jsp/user/`,
  },
];

interface ExtractedLocator {
  name: string;
  selector: string;
  type: string;
  text?: string;
  attributes: Record<string, string>;
}

async function extractLocators(page: Page): Promise<ExtractedLocator[]> {
  return page.evaluate(() => {
    const selectors = [
      "a[href]",
      "button",
      "input",
      "select",
      "textarea",
      "table",
      "[role='button']",
      "[role='tab']",
      "[role='link']",
      "[role='menuitem']",
      "[onclick]",
      "img[alt]",
    ];

    const seen = new Set<string>();
    const results: ExtractedLocator[] = [];

    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const id = el.getAttribute("id");
        const name = el.getAttribute("name");
        const type = el.getAttribute("type") || "";
        const text = (el.textContent || "").trim().substring(0, 80);
        const role = el.getAttribute("role") || "";
        const alt = el.getAttribute("alt") || "";
        const cls = el.getAttribute("class") || "";
        const href = el.getAttribute("href") || "";
        const value = el.getAttribute("value") || "";

        let bestSelector = "";
        let locName = "";

        if (id) {
          bestSelector = `#${id}`;
          locName = toCamel(id);
        } else if (name) {
          bestSelector = `${tag}[name="${name}"]`;
          locName = toCamel(name);
        } else if (alt) {
          bestSelector = `${tag}[alt="${alt}"]`;
          locName = toCamel(alt.substring(0, 40));
        } else if (text && text.length < 50) {
          bestSelector = `${tag}:has-text("${text.substring(0, 40)}")`;
          locName = toCamel(text.substring(0, 40));
        } else if (value) {
          bestSelector = `${tag}[value="${value}"]`;
          locName = toCamel(value.substring(0, 40));
        } else if (cls) {
          bestSelector = `${tag}.${cls.split(" ")[0]}`;
          locName = toCamel(`${tag}_${cls.split(" ")[0]}`);
        } else return;

        if (seen.has(bestSelector)) return;
        seen.add(bestSelector);

        const attrs: Record<string, string> = {};
        if (id) attrs.id = id;
        if (name) attrs.name = name;
        if (type) attrs.type = type;
        if (cls) attrs.class = cls;
        if (href) attrs.href = href;
        if (value) attrs.value = value;
        if (alt) attrs.alt = alt;
        if (role) attrs.role = role;

        results.push({
          name: locName || `${tag}Element`,
          selector: bestSelector,
          type: tag,
          text: text || undefined,
          attributes: attrs,
        });
      });
    }

    return results;

    function toCamel(str: string): string {
      return str
        .replace(/[^a-zA-Z0-9]+/g, " ")
        .trim()
        .split(" ")
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
        )
        .join("");
    }
  });
}

async function main() {
  const authPath = path.resolve(process.cwd(), ".auth/storageState.json");
  if (!fs.existsSync(authPath)) {
    console.error(
      "No auth state found. Run `npx playwright test --project=globalSetup` first.",
    );
    process.exit(1);
  }

  const outDir = path.join("tools", "extracted");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: authPath,
    ignoreHTTPSErrors: true,
  });

  console.log(
    `\n🕷️  MCP Multi-Page Crawler — ${PAGES_TO_CRAWL.length} pages\n`,
  );

  const summary: { page: string; count: number }[] = [];

  for (const target of PAGES_TO_CRAWL) {
    console.log(`📄 Crawling: ${target.name} (${target.url})`);
    const page = await context.newPage();

    try {
      await page.goto(target.url, { waitUntil: "networkidle", timeout: 30000 });
      if (target.preActions) await target.preActions(page);
      await page.waitForTimeout(1500);

      const locators = await extractLocators(page);
      console.log(`   Found ${locators.length} elements`);

      // Save JSON
      fs.writeFileSync(
        path.join(outDir, `${target.name}.locators.json`),
        JSON.stringify(locators, null, 2),
      );

      // Save screenshot
      await page.screenshot({
        path: path.join(outDir, `${target.name}.screenshot.png`),
        fullPage: true,
      });

      summary.push({ page: target.name, count: locators.length });
    } catch (err) {
      console.error(`   ❌ Failed: ${err}`);
      summary.push({ page: target.name, count: -1 });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Print summary
  console.log("\n📊 Crawl Summary:");
  console.log("─".repeat(40));
  for (const s of summary) {
    const status = s.count >= 0 ? `${s.count} elements` : "FAILED";
    console.log(`  ${s.page.padEnd(20)} ${status}`);
  }
  console.log("─".repeat(40));
  console.log(`\n✅ Results saved in: ${outDir}/`);
  console.log(
    "   Use mcpLocatorExtractor.ts for individual page generation.\n",
  );
}

main().catch((err) => {
  console.error("Crawl failed:", err);
  process.exit(1);
});
