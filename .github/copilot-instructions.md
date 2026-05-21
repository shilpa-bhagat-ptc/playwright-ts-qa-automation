# Copilot Project Instructions

This is a Playwright-based UI automation framework written in TypeScript targeting the QALink web application. These instructions govern all Copilot assistance in this repo.

## Architecture Overview

- **Pattern**: Page Object Model (POM) — all UI interactions go through page classes
- **Auth**: Single login in `tests/config/global-setup.ts` → `.auth/storageState.json` shared by all tests
- **Fixtures**: `tests/fixtures/fixture.ts` — ALWAYS import `test` and `expect` from here, never from `@playwright/test` directly
- **Locators**: `src/locators/*.locators.ts` — NEVER put raw selectors in spec files
- **Test data**: Static → `src/locale/commonProperties.json`; Dynamic → `src/utils/testDataGenerator.ts`

## Running Tests

`TEST_PROJECT` env var is **required** — it points `testDir` to one `tests/specs/<suite>` folder.

```powershell
$env:TEST_PROJECT = "homePageTests"; npx playwright test
$env:TEST_PROJECT = "queryPageTests"; npx playwright test tests/specs/queryPage/update/updateTests.spec.ts
$env:TEST_PROJECT = "userPageTests"; npx playwright test -g "TC_USR_001"
```

Valid values: `homePageTests`, `adminPageTests`, `planningPageTests`, `queryPageTests`, `userPageTests`, `reportPageTests`, `executionPageTests`

## TC ID Format

`TC_<PREFIX>_<NNN>` — always underscore-separated, always 3-digit zero-padded.

| Page      | Prefix | Example       |
| --------- | ------ | ------------- |
| Home      | `HOM`  | `TC_HOM_001`  |
| Planning  | `PLAN` | `TC_PLAN_001` |
| Execution | `EXE`  | `TC_EXE_001`  |
| Query     | `QRY`  | `TC_QRY_001`  |
| Report    | `RPT`  | `TC_RPT_001`  |
| User      | `USR`  | `TC_USR_001`  |
| Admin     | `ADM`  | `TC_ADM_001`  |

## Code Style

- Modern TypeScript with strict typing
- `async/await` only — no `.then()` chaining
- ES Modules (`import/export`) only
- `workers: 1`, `retries: 1`, `headless: false` are fixed in config — do not override in tests

## Page Object Rules

- Every page has a class in `src/pages/` — methods named `verbNoun` (e.g., `selectReleaseOption`, `verifyTableVisible`)
- Constructor takes `private page: Page` — no other dependencies
- No raw selectors inside page methods — always reference `PAGE_LOCATORS.fieldName`
- Use `waitFor({ state: "visible" })` before clicks on conditionally-rendered elements
- Use `waitForLoadState("networkidle")` after full-page navigation

## Locator Rules

- Prefer CSS for IDs/attributes: `'select#release'`, `'input[name="StartDate"]'`
- Use XPath with `normalize-space()` for text matching: `"//a[normalize-space(text())='Tab Name']"`
- Parameterised locators are functions: `dynamicRow: (id: string) => \`//tr[@data-id="${id}"]\``
- When appending ` option` to select a locator, check if it is XPath first — XPath needs `//option` not ` option`

## Test File Rules

- Import from fixtures, not from `@playwright/test`
- Add `testInfo.annotations.push({ type: "description", description: "... @owner:Name" })` in every test
- Call `captureStepScreenshot(page, testInfo, "NN_step_name")` after each major step
- End every test with `console.log("TC_XXX_NNN completed successfully.");`
- Do NOT add `page.goto(...)` at the start — fixtures already navigate and wait
- Do NOT import `loginPage` fixture unless testing invalid login
- Do NOT use `test.describe` except in `tests/specs/API/` files

## Auth Rules

- Do not add login steps inside tests — `storageState` handles session for all tests
- For invalid-login tests only: instantiate `new LoginPage(page)` directly
- Session re-auth is handled automatically by the fixture if session expires mid-run

## Screenshot Rules

```ts
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";

await captureStepScreenshot(page, testInfo, "01_page_loaded");
await captureStepScreenshot(page, testInfo, "02_form_submitted");
```

Format: `NN_snake_case_description` — numeric prefix for ordering in report.

## Don'ts

- Don't put raw selectors in spec files — always locators file
- Don't use `setTimeout` or `page.waitForTimeout` — use Playwright waits/assertions
- Don't store credentials in test files
- Don't run `npx playwright test` without `TEST_PROJECT` — it throws by design
- Don't use `Promise.any([waitForSelector, waitForSelector])` for post-navigation waits — use `waitForLoadState("networkidle")` instead (frame detach causes `AggregateError`)
- Don't import unused fixtures — each fixture auto-navigates on setup
