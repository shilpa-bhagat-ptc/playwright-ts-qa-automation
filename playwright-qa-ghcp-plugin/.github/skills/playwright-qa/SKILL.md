---
name: playwright-qa
description: "Use when: building a Playwright TypeScript QA automation framework from scratch, replicating the QALink test architecture, or onboarding engineers to this POM+fixture+storageState pattern."
---

# Playwright QA Framework — Build Guide

This skill teaches you to build a Playwright TypeScript automation framework using the POM pattern with shared session auth, custom fixtures, and Jenkins/Hector reporting integration.

## What You'll Build

```
project/
  tests/
    config/global-setup.ts        ← login once, save session
    fixtures/fixture.ts           ← custom fixtures with auth re-check
    specs/<page>/<feature>/*.spec.ts
  src/
    pages/                        ← Page Object classes
    locators/                     ← Selector maps
    locale/commonProperties.json  ← Static test data
    utils/
      screenshotHelper.ts
      testDataGenerator.ts
      selfHealingLocator.ts
  playwright.config.ts
  package.json
```

---

## Step 1: Project Setup

```bash
npm init playwright@latest
npm install --save-dev typescript @types/node
npm install --save-dev @faker-js/faker   # for TestDataGenerator
```

`tsconfig.json` — strict mode, ES module output:

```json
{
  "compilerOptions": {
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ES2020",
    "esModuleInterop": true
  }
}
```

---

## Step 2: Global Setup (Login Once)

`tests/config/global-setup.ts`:

```ts
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const AUTH_FILE = path.join(process.cwd(), ".auth/storageState.json");
const BASE_URL = process.env.TEST_BASE_URL || "http://yourapp.com";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

export default async function globalSetup() {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const page = await browser.newPage();
    try {
      await page.goto(`${BASE_URL}/login`);
      await page.fill(
        'input[name="username"]',
        process.env.TEST_USER || "admin",
      );
      await page.fill(
        'input[name="password"]',
        process.env.TEST_PASS || "password",
      );
      await page.click('input[type="submit"]');
      await page.waitForLoadState("networkidle");

      // Verify login succeeded
      if ((await page.locator("text=Logout").count()) === 0) {
        throw new Error("Login failed — Logout link not found");
      }

      await page.context().storageState({ path: AUTH_FILE });
      console.log(`[global-setup] Session saved on attempt ${attempt}`);
      break;
    } catch (e) {
      console.error(`[global-setup] Attempt ${attempt} failed:`, e);
      await page.close();
      if (attempt === MAX_RETRIES) throw e;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }

  await browser.close();
}
```

---

## Step 3: Playwright Config

`playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";
import path from "path";

const TEST_PROJECT = process.env.TEST_PROJECT;
if (!TEST_PROJECT) throw new Error("TEST_PROJECT env var is required");

const specDirs: Record<string, string> = {
  homePageTests: "tests/specs/homePage",
  adminPageTests: "tests/specs/adminPage",
  planningPageTests: "tests/specs/planningPage",
  queryPageTests: "tests/specs/queryPage",
  userPageTests: "tests/specs/userPage",
  reportPageTests: "tests/specs/reportPage",
  executionPageTests: "tests/specs/executionPage",
};

if (!specDirs[TEST_PROJECT])
  throw new Error(`Unknown TEST_PROJECT: ${TEST_PROJECT}`);

export default defineConfig({
  testDir: path.join(__dirname, specDirs[TEST_PROJECT]),
  globalSetup: "./tests/config/global-setup.ts",
  workers: 1,
  retries: 1,
  timeout: 60000,
  use: {
    storageState: ".auth/storageState.json",
    headless: false,
    screenshot: "on",
    trace: "on",
  },
  reporter: [
    ["list"],
    ["junit", { outputFile: "reports/test-results/results.xml" }],
    ["html", { outputFolder: "reports/html-report", open: "never" }],
  ],
});
```

---

## Step 4: Custom Fixtures with Auth Re-check

`tests/fixtures/fixture.ts`:

```ts
import { test as base, expect } from "@playwright/test";
import { HomePage } from "../../src/pages/HomePage";
import { LoginPage } from "../../src/pages/LoginPage";

const BASE_URL = process.env.TEST_BASE_URL || "http://yourapp.com";

async function navigateAuthenticated(page: any, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Detect session expiry: redirect to login page
  if (page.url().includes("/login")) {
    await page.fill('input[name="username"]', "admin");
    await page.fill('input[name="password"]', "password");
    await page.click('input[type="submit"]');
    await page.waitForLoadState("networkidle");
    await page.goto(url, { waitUntil: "domcontentloaded" });
  }

  // Detect silent downgrade: app shows Login link instead of Logout
  const loginLink = page.locator("a", { hasText: "Login =>" });
  if (await loginLink.isVisible().catch(() => false)) {
    await page.fill('input[name="username"]', "admin");
    await page.fill('input[name="password"]', "password");
    await page.click('input[type="submit"]');
    await page.waitForLoadState("networkidle");
    await page.goto(url, { waitUntil: "domcontentloaded" });
  }

  await page
    .waitForLoadState("networkidle", { timeout: 30000 })
    .catch(() => {});
}

export const test = base.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    await navigateAuthenticated(page, `${BASE_URL}/home`);
    await use(new HomePage(page));
  },

  // Add more page fixtures here...
});

export { expect };
```

---

## Step 5: Page Object Pattern

`src/pages/HomePage.ts`:

```ts
import { expect, Page } from "@playwright/test";
import { HOME_PAGE_LOCATORS } from "../locators/homePage.locators";

export class HomePage {
  constructor(private page: Page) {}

  async navigateToWeeklyNoteTab() {
    await this.page.locator(HOME_PAGE_LOCATORS.weeklyNoteTab).click();
  }

  async verifyWeeklyNoteTabVisible() {
    await expect(
      this.page.locator(HOME_PAGE_LOCATORS.weeklyNoteText),
    ).toBeVisible({ timeout: 10000 });
  }

  // Dropdown helper: gracefully falls back if exact label not found
  private async selectOptionWithFallback(selector: string, label: string) {
    await this.page.waitForSelector(selector);
    const optionSelector = selector.startsWith("//")
      ? `${selector}//option`
      : `${selector} option`;
    const options = await this.page.locator(optionSelector).allTextContents();
    const match = options.find((o) => o.trim() === label);
    if (match) {
      await this.page.selectOption(selector, { label });
    } else {
      const firstNonEmpty = options.findIndex((o) => o.trim() !== "");
      if (firstNonEmpty >= 0) {
        await this.page.selectOption(selector, { index: firstNonEmpty });
      }
    }
  }
}
```

---

## Step 6: Locators Pattern

`src/locators/homePage.locators.ts`:

```ts
export const HOME_PAGE_LOCATORS = {
  // Navigation tabs — XPath for text matching
  weeklyNoteTab: "//a[normalize-space(text())='Weekly Note']",

  // Form inputs — CSS for IDs/names
  releaseSelect: "select#release",
  managerSelect: "//select[@id='project_manager']",
  startDate: 'input[name="StartDate"]',

  // Dynamic locators (parameterised functions)
  editIconByTip: (tipTitle: string) => `img[alt="Edit the tip - ${tipTitle}"]`,
  tipRowByText: (text: string) => `//tr[td[normalize-space()="${text}"]]`,
};
```

---

## Step 7: Test Data

`src/locale/commonProperties.json`:

```json
{
  "weeklyRelease": { "ALD": "ALD 12.3.2.0" },
  "dateFormat": { "fulldate": "07/13/2025", "date": "13" },
  "projectManagers": { "John_Smith": "Smith, John" }
}
```

`src/utils/testDataGenerator.ts`:

```ts
import { faker } from "@faker-js/faker";

export class TestDataGenerator {
  static username(): string {
    return faker.internet.userName();
  }
  static password(): string {
    return faker.internet.password();
  }
  static email(): string {
    return faker.internet.email();
  }
}
```

---

## Step 8: Screenshot Helper

`src/utils/screenshotHelper.ts`:

```ts
import { Page, TestInfo } from "@playwright/test";

export async function captureStepScreenshot(
  page: Page,
  testInfo: TestInfo,
  stepName: string,
): Promise<void> {
  const screenshotPath = `screenshots/${testInfo.title}-${stepName}.png`;
  const buffer = await page.screenshot({
    path: screenshotPath,
    fullPage: false,
  });
  await testInfo.attach(stepName, { body: buffer, contentType: "image/png" });
}
```

---

## Step 9: Write a Test

`tests/specs/homePage/weeklyNote/weeklyNoteTests.spec.ts`:

```ts
import commonProperties from "../../../../src/locale/commonProperties.json";
import { HOME_PAGE_LOCATORS } from "../../../../src/locators/homePage.locators";
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
import { expect, test } from "../../../fixtures/fixture";

test("TC_HOM_001 - Verify Weekly Note Tab is Visible", async ({
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verifies the Weekly Note tab is visible on the home page. @owner:Your Name",
  });

  console.log("Navigating to Weekly Note tab...");
  await homePage.navigateToWeeklyNoteTab();
  await captureStepScreenshot(page, testInfo, "01_weekly_note_tab");

  console.log("Verifying tab content visible...");
  await homePage.verifyWeeklyNoteTabVisible();
  await captureStepScreenshot(page, testInfo, "02_content_visible");

  console.log("TC_HOM_001 completed successfully.");
});
```

Run it:

```powershell
$env:TEST_PROJECT = "homePageTests"; npx playwright test -g "TC_HOM_001"
```

---

## Common Mistakes Reference

| Mistake                                               | Symptom                                           | Fix                                                            |
| ----------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| `Promise.any([waitForSelector...])` after form submit | `AggregateError: All promises were rejected`      | Use `waitForLoadState("networkidle")`                          |
| XPath selector + ` option` suffix                     | Invalid selector error                            | Check `selector.startsWith('//')` and use `//option` for XPath |
| Missing `TEST_PROJECT` env var                        | Config throws on startup                          | Always set before running                                      |
| `loginPage` fixture in non-login test                 | Wastes setup time, may conflict with storageState | Remove it                                                      |
| `page.goto(...)` at test start when using fixtures    | Double navigation, potential auth miss            | Remove — fixtures auto-navigate                                |
| Hardcoded `waitForTimeout(3000)`                      | Flaky tests on slow CI                            | Use `waitForLoadState` or `waitFor({ state: "visible" })`      |

---

## Jenkins + Hector Setup

Add to `playwright.config.ts` reporters array:

```ts
["@ptc-fusion/playwright-hector-reporter", {
  hectorUrl: "https://your-hector.com/Hector",
  testCategory: process.env.TEST_PROJECT,
  developmentBuild: 1,  // bump this per branch
}],
```

`Jenkinsfile` pattern:

```groovy
parameters {
  choice(name: 'TEST_PROJECT', choices: ['homePageTests', 'adminPageTests', 'ALL'])
}
stages {
  stage('Test') {
    steps {
      script {
        def suites = params.TEST_PROJECT == 'ALL'
          ? ['homePageTests', 'adminPageTests', 'planningPageTests']
          : [params.TEST_PROJECT]
        suites.each { suite ->
          withEnv(["TEST_PROJECT=${suite}"]) {
            sh 'npx playwright test'
          }
        }
      }
    }
  }
}
post {
  always {
    archiveArtifacts 'reports/html-report/**,screenshots/**'
    junit 'reports/test-results/results.xml'
  }
}
```
