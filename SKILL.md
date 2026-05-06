# QALink Playwright Automation — Framework Skills Guide

## Stack

| Layer       | Tool                                                    |
| ----------- | ------------------------------------------------------- |
| Test runner | Playwright v1.54.1                                      |
| Language    | TypeScript v5.8.3                                       |
| Auth        | `storageState.json` (set in `global-setup.ts`)          |
| Reporting   | Hector Reporter, JUnit XML, HTML                        |
| Test data   | `src/locale/commonProperties.json`, `TestDataGenerator` |
| CI/CD       | Jenkins, GitHub Actions                                 |

---

## Folder Structure

```
tests/
  config/
    global-setup.ts         # login once, saves .auth/storageState.json
  fixtures/
    fixture.ts              # custom fixtures — always import test/expect from here
  specs/
    homePage/               # one folder per tab
      weeklyNote/
        weeklyNoteTests.spec.ts
      ProductionDashboard/
        productionDashboardTest.spec.ts
    planningPage/
      release/
        releaseTests.spec.ts
    executionPage/
    queryPage/
    reportPage/
    userPage/
    adminPage/

src/
  pages/           # Page Object classes
  locators/        # Centralized selector maps
  locale/          # commonProperties.json (test data)
  utils/           # screenshotHelper, testDataGenerator, testUtils
```

---

## TC ID Naming Convention

Format: `TC_<PAGE>_<3-digit-number>`

| Page      | Prefix | Example       |
| --------- | ------ | ------------- |
| Home      | `HOM`  | `TC_HOM_001`  |
| Planning  | `PLAN` | `TC_PLAN_001` |
| Execution | `EXE`  | `TC_EXE_001`  |
| Query     | `QRY`  | `TC_QRY_001`  |
| Report    | `RPT`  | `TC_RPT_001`  |
| User      | `USR`  | `TC_USR_001`  |
| Admin     | `ADM`  | `TC_ADM_001`  |

Rules:

- Always underscore-separated: `TC_HOM_001` not `TC-HOM007` or `TC_HOME002`
- Always 3-digit zero-padded number: `001`, `012`, not `1` or `12`
- End every test with `console.log("TC_XXX_NNN completed successfully.");`

---

## Standard Test File Pattern

```ts
import commonProperties from "../../../../src/locale/commonProperties.json";
import { PAGE_LOCATORS } from "../../../../src/locators/page.locators";
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
import { expect, test } from "../../../fixtures/fixture";

test("TC_HOM_001 - Verify Weekly Note Functionality", async ({
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description: "What this test validates. @owner:Shilpa Bhagat",
  });

  console.log("Step 1: Navigate to Weekly Note tab...");
  await homePage.navigateToWeeklyNoteTab();
  await captureStepScreenshot(page, testInfo, "01_weekly_note_tab");

  console.log("Step 2: Verify tab is visible...");
  await expect(page.locator(PAGE_LOCATORS.someElement)).toBeVisible();
  await captureStepScreenshot(page, testInfo, "02_tab_visible");

  console.log("TC_HOM_001 completed successfully.");
});
```

---

## Available Fixtures

Defined in `tests/fixtures/fixture.ts`. Always import `test` and `expect` from there.

```ts
import { expect, test } from "../../../fixtures/fixture";
```

| Fixture         | Type            | Auto-navigates to                         |
| --------------- | --------------- | ----------------------------------------- |
| `loginPage`     | `LoginPage`     | — (no auto-nav, use only for login tests) |
| `homePage`      | `HomePage`      | `/QALink/jsp/home/` + waits `networkidle` |
| `planningPage`  | `PlanningPage`  | `/QALink/jsp/planning/` + waits `networkidle` |
| `executionPage` | `ExecutionPage` | — (TODO: not implemented yet)             |
| `queryPage`     | `QueryPage`     | — (TODO: not implemented yet)             |
| `reportPage`    | `ReportPage`    | — (TODO: not implemented yet)             |
| `userPage`      | `UserPage`      | — (TODO: not implemented yet)             |
| `adminPage`     | `AdminPage`     | — (TODO: not implemented yet)             |
| `page`          | `Page`          | Raw Playwright page                       |

> Only include fixtures your test actually uses. Do not pull in `loginPage` when auth is already handled via `storageState`.

---

## Page Object Pattern

Location: `src/pages/PageName.ts`

```ts
import { expect, Page } from "@playwright/test";
import { PAGE_LOCATORS } from "../locators/page.locators";

export class SomePage {
  constructor(private page: Page) {}

  async clickSomeTab() {
    await this.page.locator(PAGE_LOCATORS.someTab).click();
  }

  async verifySectionVisible() {
    await expect(this.page.locator(PAGE_LOCATORS.section)).toBeVisible();
  }
}
```

Rules:

- All user actions and assertions belong in the page class, not directly in specs
- Never hardcode selectors in specs — always use the locators file
- Use `waitFor({ state: "visible" })` before clicking elements that may not be immediately ready
- Use `waitForLoadState("networkidle")` for full-page loads after navigation

---

## Locators Pattern

Location: `src/locators/pageName.locators.ts`

```ts
export const PAGE_LOCATORS = {
  someTab: "//a[normalize-space(text())='Tab Name']",
  inputField: 'input[name="fieldName"]',
  dynamicRow: (id: string) => `//tr[@data-id="${id}"]`,
};
```

Rules:

- Prefer `normalize-space()` in XPath for text matching
- Use CSS selectors for IDs and attributes where possible
- Dynamic locators (parameterised) are functions inside the locators object
- Never write raw selectors in spec files or inside `test()` blocks

---

## Test Data Pattern

Static data goes in `src/locale/commonProperties.json`:

```json
{
  "weeklyRelease": { "ALD": "ALD 12.3.2.0" },
  "dateFormat": { "fulldate": "07/13/2025", "date": "13" }
}
```

Dynamic/generated data goes in `src/utils/testDataGenerator.ts` via `TestDataGenerator`:

```ts
TestDataGenerator.username(); // random fake username
TestDataGenerator.password(); // random fake password
TestDataGenerator.planningTabSubOptions(); // array of expected sub-options
```

Usage in specs:

```ts
import commonProperties from "../../../../src/locale/commonProperties.json";
import { TestDataGenerator } from "../../../../src/utils/testDataGenerator";

await homePage.selectReleaseOption(commonProperties.weeklyRelease.ALD);

await loginPage.login(
  TestDataGenerator.username(),
  TestDataGenerator.password(),
);
```

---

## Screenshots Pattern

Use `captureStepScreenshot` at each meaningful step. Label format: `NN_step_description`.

```ts
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";

await captureStepScreenshot(page, testInfo, "01_page_loaded");
await captureStepScreenshot(page, testInfo, "02_form_filled");
await captureStepScreenshot(page, testInfo, "03_result_verified");
```

> `testInfo` must be present in the test signature for screenshots to be attached to the report.

---

## Annotations Pattern

Every test must have a description annotation with `@owner`:

```ts
testInfo.annotations.push({
  type: "description",
  description:
    "Short description of what this test validates. @owner:Your Name",
});
```

---

## Assertions

Prefer `expect` from fixtures over raw Playwright `expect`:

```ts
// Visibility
await expect(page.locator(LOCATORS.element)).toBeVisible();

// Text content
await expect(page.locator(LOCATORS.heading)).toHaveText("Expected Text");

// Value
await expect(page.locator(LOCATORS.input)).toHaveValue("expected");

// Count
await expect(page.locator(LOCATORS.rows)).toHaveCount(5);

// Boolean (use sparingly — prefer direct locator assertions)
const isVisible = await page.locator(LOCATORS.tab).isVisible();
expect(isVisible).toBeTruthy();
```

---

## Auth & Session

- Auth is handled once in `tests/config/global-setup.ts` — logs in as `sbhagat` and saves session to `.auth/storageState.json`
- All tests inherit the session via `use.storageState` in `playwright.config.ts`
- Do not add login steps inside individual tests unless testing invalid login scenarios
- For invalid login tests, instantiate `LoginPage` directly: `new LoginPage(page)`

---

## Playwright Config — Projects

Each project maps to a folder under `tests/specs/`:

| Project name         | Spec folder                 |
| -------------------- | --------------------------- |
| `homePageTests`      | `tests/specs/homePage`      |
| `planningPageTests`  | `tests/specs/planningPage`  |
| `executionPageTests` | `tests/specs/executionPage` |
| `queryPageTests`     | `tests/specs/queryPage`     |
| `reportPageTests`    | `tests/specs/reportPage`    |
| `userPageTests`      | `tests/specs/userPage`      |
| `adminPageTests`     | `tests/specs/adminPage`     |

Run a single project: `npx playwright test --project=homePageTests`

---

## Common Mistakes to Avoid

| Mistake                                          | Fix                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| `await loginPage.navigate` (no `()`)             | `await loginPage.navigate()`                                             |
| Hardcoded XPath in spec: `"//table[@id='x']"`    | Move to locators file                                                    |
| `page.waitForTimeout(3000)`                      | Use `waitForSelector` or `waitForLoadState`                              |
| Importing `loginPage` fixture when not needed    | Only import fixtures the test uses                                       |
| Inconsistent TC ID: `TC-HOM007`, `TC_HOME002`    | Always use `TC_HOM_007` format                                           |
| No `testInfo` param → no screenshots/annotations | Always pass `testInfo` as second arg                                     |
| Commented-out code left in spec                  | Remove before committing                                                 |
| Using `test.describe` inconsistently             | Do not wrap individual tests in `describe` blocks; reserve for API tests |

---

## Adding a New Test — Checklist

- [ ] Create spec file under correct `tests/specs/<tab>/<feature>/` folder
- [ ] Add locators to `src/locators/<page>.locators.ts`
- [ ] Add page methods to `src/pages/<Page>.ts`
- [ ] Add static test data to `src/locale/commonProperties.json` if needed
- [ ] Use TC ID format: `TC_<PREFIX>_<NNN>`
- [ ] Add `testInfo.annotations` with description and `@owner`
- [ ] Use `captureStepScreenshot` at each major step
- [ ] End test with `console.log("TC_XXX_NNN completed successfully.");`
- [ ] Do not add `loginPage` fixture unless explicitly testing login
