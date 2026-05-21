---
name: add-test
description: "Generate a new Playwright test case for the QALink framework following POM pattern, TC ID format, fixture conventions, and screenshot rules."
---

# Add New Playwright Test Case

Generate a complete, ready-to-commit test case for this framework.

## Required Inputs

- **Tab/Page**: Which tab does this test cover? (Home, Planning, Execution, Query, Report, User, Admin)
- **Feature**: What specific feature or section within that tab?
- **TC ID**: Next available ID in the sequence (e.g., `TC_HOM_012`)
- **Description**: One sentence of what this test validates
- **Owner**: Your name (for `@owner:` annotation)
- **Steps**: Numbered list of UI actions and verifications

---

## Generation Rules

### 1. Determine file locations

| Artifact    | Location                                                     |
| ----------- | ------------------------------------------------------------ |
| Spec file   | `tests/specs/<tabName>/<feature>/<featureName>Tests.spec.ts` |
| Locators    | `src/locators/<page>.locators.ts`                            |
| Page object | `src/pages/<Page>.ts`                                        |
| Static data | `src/locale/commonProperties.json`                           |

### 2. Generate the spec file

```ts
import commonProperties from "../../../../src/locale/commonProperties.json";
import { PAGE_LOCATORS } from "../../../../src/locators/page.locators";
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
import { expect, test } from "../../../fixtures/fixture";

test("${TC_ID} - ${FEATURE_DESCRIPTION}", async ({
  ${PAGE_FIXTURE},
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description: "${ONE_SENTENCE_DESCRIPTION} @owner:${OWNER_NAME}",
  });

  // Steps go here
  console.log("${TC_ID} completed successfully.");
});
```

### 3. TC ID format rules

- Format: `TC_<PREFIX>_<NNN>` — always 3-digit zero-padded
- Prefix map: Home=HOM, Planning=PLAN, Execution=EXE, Query=QRY, Report=RPT, User=USR, Admin=ADM
- NEVER: `TC-HOM007` or `TC_HOME_2` or `TC_HOM_7`

### 4. Fixture rules

- Import ONLY fixtures the test uses
- Available: `homePage`, `planningPage`, `executionPage`, `queryPage`, `reportPage`, `userPage`, `adminPage`, `page`
- Fixtures auto-navigate — DO NOT add `page.goto(...)` at start
- DO NOT import `loginPage` (auth is handled via storageState)

### 5. Screenshot rules

Add `captureStepScreenshot(page, testInfo, "NN_step_name")` after each major action:

```ts
await captureStepScreenshot(page, testInfo, "01_navigated_to_tab");
await captureStepScreenshot(page, testInfo, "02_form_submitted");
await captureStepScreenshot(page, testInfo, "03_result_verified");
```

### 6. Assertion rules

Use Playwright `expect` assertions (imported from fixtures):

```ts
await expect(page.locator(PAGE_LOCATORS.element)).toBeVisible();
await expect(page.locator(PAGE_LOCATORS.input)).toHaveValue("expected");
await expect(page.locator(PAGE_LOCATORS.rows)).toHaveCount(5);
```

### 7. Add locators

In `src/locators/<page>.locators.ts`, add any new selectors needed:

```ts
export const PAGE_LOCATORS = {
  // existing...
  newElement: "//xpath/or/css/selector",
  dynamicRow: (id: string) => `//tr[@data-id="${id}"]`,
};
```

### 8. Add page object methods

In `src/pages/<Page>.ts`, add methods for each action:

```ts
async clickNewFeatureButton() {
  await this.page.locator(PAGE_LOCATORS.newButton).click();
}

async verifyNewSectionVisible() {
  await expect(this.page.locator(PAGE_LOCATORS.newSection)).toBeVisible();
}
```

### 9. Handling permission-gated features

If the feature may not be available based on user role:

```ts
const editIcon = page.locator(PAGE_LOCATORS.editIcon);
if (!(await editIcon.isVisible().catch(() => false))) {
  test.skip(true, "Edit icon not visible — user may lack permissions");
  return;
}
```

### 10. Running the test

```powershell
$env:TEST_PROJECT = "${TEST_PROJECT_VALUE}"; npx playwright test tests/specs/${SPEC_PATH} -g "${TC_ID}"
```

---

## Checklist Before Finishing

- [ ] Spec file in correct `tests/specs/<tab>/<feature>/` folder
- [ ] TC ID matches format `TC_<PREFIX>_<NNN>`
- [ ] `testInfo.annotations.push(...)` with description and `@owner:`
- [ ] `captureStepScreenshot` at each major step with `NN_` prefix
- [ ] All locators in `src/locators/*.locators.ts` — none raw in spec
- [ ] All UI actions in page object methods — none raw in spec
- [ ] Ends with `console.log("TC_XXX_NNN completed successfully.");`
- [ ] No `page.goto(...)` at start (fixture handles navigation)
- [ ] No `loginPage` fixture unless testing invalid login
- [ ] No `page.waitForTimeout()` — use `waitForLoadState` or `waitFor({ state: "visible" })`
