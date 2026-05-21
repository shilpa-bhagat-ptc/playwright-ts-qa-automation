---
applyTo: "tests/**/*.spec.ts,src/pages/**/*.ts,src/locators/**/*.ts"
description: "Playwright QA framework conventions for QALink — POM pattern, TC ID format, fixtures, locators, screenshots, auth rules. Apply to all spec files and page objects."
---

# Playwright QA Framework — File-Level Instructions

## Spec Files (`tests/specs/**/*.spec.ts`)

### Required imports (exact order)

```ts
import commonProperties from "../../../../src/locale/commonProperties.json";
import { PAGE_LOCATORS } from "../../../../src/locators/page.locators";
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
import { TestDataGenerator } from "../../../../src/utils/testDataGenerator";
import { expect, test } from "../../../fixtures/fixture";
```

Adjust `../../../../` depth to match actual nesting. Never import from `@playwright/test` directly.

### Test block structure

```ts
test("TC_HOM_001 - Verify Feature Name", async ({
  homePage, // only fixtures this test uses
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description: "One sentence of what is validated. @owner:Your Name",
  });

  console.log("Step description...");
  await homePage.someAction();
  await captureStepScreenshot(page, testInfo, "01_action_done");

  console.log("TC_HOM_001 completed successfully.");
});
```

### TC ID rules

- Format: `TC_<PREFIX>_<NNN>` e.g. `TC_HOM_001`, `TC_QRY_012`
- NEVER: `TC-HOM007`, `TC_HOME002`, `TC_HOM_1`
- Prefix map: HOM, PLAN, EXE, QRY, RPT, USR, ADM

### Fixture rules

- Pull ONLY the fixtures the test uses
- Fixtures auto-navigate: `homePage` → home page, `planningPage` → planning page, etc.
- NO `page.goto(...)` at the start of tests (fixture already did it)
- NO `loginPage` fixture unless the test is explicitly testing invalid login

### Permission-gated features

When a feature requires admin/elevated permissions that may not be available:

```ts
if (!(await someIcon.isVisible().catch(() => false))) {
  test.skip(true, "Feature not visible — user may lack permissions");
  return;
}
```

---

## Page Object Files (`src/pages/*.ts`)

### Class structure

```ts
import { expect, Page } from "@playwright/test";
import { PAGE_LOCATORS } from "../locators/page.locators";

export class SomePage {
  constructor(private page: Page) {}

  async clickTab() {
    await this.page.locator(PAGE_LOCATORS.tab).click();
  }

  async verifySectionVisible() {
    await expect(this.page.locator(PAGE_LOCATORS.section)).toBeVisible();
  }
}
```

### Method naming

- Actions: `click*`, `select*`, `enter*`, `navigate*`, `toggle*`
- Assertions: `verify*`, `expect*`
- Wait helpers: `waitFor*`

### Wait patterns

```ts
// After clicking a tab or button that loads content:
await this.page.waitForLoadState("networkidle");

// Before clicking a conditionally-shown element:
await element.waitFor({ state: "visible" });

// For dropdowns: always waitForSelector first
await this.page.waitForSelector(selector);
```

### XPath + option selector pitfall

```ts
// WRONG — appending CSS to XPath:
const optionSelector = `${xpathSelector} option`;

// CORRECT — check selector type first:
const optionSelector = selector.startsWith("//")
  ? `${selector}//option`
  : `${selector} option`;
```

### Post-navigation waits

```ts
// CORRECT — survives frame detach on navigation:
await this.page.waitForLoadState("networkidle", { timeout: 60000 });

// WRONG — throws AggregateError if page navigates and frame detaches:
await Promise.any([
  this.page.waitForSelector(LOCATORS.heading),
  this.page.waitForSelector(LOCATORS.altHeading),
]);
```

---

## Locator Files (`src/locators/*.locators.ts`)

```ts
export const PAGE_LOCATORS = {
  // CSS (preferred for IDs/attributes)
  submitButton: 'input[type="submit"][name="add"]',
  releaseSelect: "select#release",

  // XPath with normalize-space (preferred for text matching)
  weeklyNoteTab: "//a[normalize-space(text())='Weekly Note']",

  // Parameterised (function)
  editIconByTip: (tipTitle: string) => `img[alt="Edit the tip - ${tipTitle}"]`,
  tipRowByTipText: (text: string) => `//tr[td[normalize-space()="${text}"]]`,
};
```

Rules:

- Never duplicate a locator across files
- Text-matching selectors use `normalize-space()` to handle whitespace
- Element IDs/names use CSS, not XPath
