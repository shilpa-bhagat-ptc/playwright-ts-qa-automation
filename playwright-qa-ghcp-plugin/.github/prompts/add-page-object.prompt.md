---
name: add-page-object
description: "Generate a new Page Object class and its locators file for the QALink Playwright framework. Use when adding a new application page/tab to the test suite."
---

# Add New Page Object

Generate a complete, correctly structured page object class with its locators file.

## Required Inputs

- **Page name**: The application tab/page (e.g., "Settings", "Reports")
- **Class name**: PascalCase (e.g., `SettingsPage`)
- **File name**: Match existing conventions — check `src/pages/` for mixed casing; PascalCase for new files
- **Actions to support**: List of UI interactions this page needs

---

## 1. Create Locators File

Path: `src/locators/<pageName>.locators.ts`

```ts
export const PAGE_NAME_LOCATORS = {
  // Tab/navigation selectors (use XPath with normalize-space for text)
  someTab: "//a[normalize-space(text())='Tab Label']",

  // Form inputs (use CSS for id/name attributes)
  inputField: 'input[name="fieldName"]',
  selectField: "select#selectId",

  // Buttons
  submitButton: 'input[type="submit"][name="submitName"]',
  loadButton: "//input[@value='Load']",

  // Tables and rows
  tableHeading: "//h2[contains(text(),'Expected Heading')]",
  tableRow: "//table[@id='mainTable']//tbody//tr",

  // Parameterised locators (functions)
  rowByName: (name: string) => `//tr[td[normalize-space()="${name}"]]`,
  editIcon: (label: string) => `img[alt="Edit - ${label}"]`,
};
```

### Selector rules

- IDs and attributes → CSS: `'select#release'`, `'input[name="StartDate"]'`
- Text matching → XPath with `normalize-space()`: `"//a[normalize-space(text())='Text']"`
- Mixed content → XPath `contains()`: `"//div[contains(@class,'active')]"`
- Dynamic rows → parameterised functions

---

## 2. Create Page Object Class

Path: `src/pages/<PageName>.ts`

```ts
import { expect, Page } from "@playwright/test";
import { PAGE_NAME_LOCATORS } from "../locators/pageName.locators";

export class PageName {
  constructor(private page: Page) {}

  // Navigation
  async navigateToSubTab() {
    await this.page.locator(PAGE_NAME_LOCATORS.someTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  // Actions
  async selectOption(label: string) {
    await this.page.waitForSelector(PAGE_NAME_LOCATORS.selectField);
    await this.page.selectOption(PAGE_NAME_LOCATORS.selectField, { label });
  }

  async clickLoadButton() {
    await this.page.locator(PAGE_NAME_LOCATORS.loadButton).click();
    await this.page.waitForLoadState("networkidle", { timeout: 60000 });
  }

  async enterText(text: string) {
    await this.page.locator(PAGE_NAME_LOCATORS.inputField).fill(text);
  }

  // Assertions
  async verifyHeadingVisible() {
    await expect(
      this.page.locator(PAGE_NAME_LOCATORS.tableHeading),
    ).toBeVisible({ timeout: 20000 });
  }

  async verifyRowCount(expectedMin: number) {
    const rows = this.page.locator(PAGE_NAME_LOCATORS.tableRow);
    await expect(rows).toHaveCount(expectedMin);
  }

  // Popup/overlay handling
  async clickEditAndWaitForPopup(label: string) {
    const [popup] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.page.locator(PAGE_NAME_LOCATORS.editIcon(label)).click(),
    ]);
    await popup.waitForLoadState("domcontentloaded");
    return popup;
  }

  // Dialog handling
  async handleConfirmationDialog(expectedText?: string) {
    this.page.once("dialog", async (dialog) => {
      const message = dialog.message();
      if (!expectedText || message.includes(expectedText)) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }
}
```

---

## 3. Register in Fixture

Add the new page to `tests/fixtures/fixture.ts`:

```ts
import { PageName } from "../../src/pages/PageName";

// Inside the test.extend({}) call:
pageName: async ({ page }, use) => {
  const targetUrl = process.env.TEST_PAGENAME_URL || `${BASE_URL}/jsp/pagename/`;
  await navigateAuthenticated(page, targetUrl);
  await use(new PageName(page));
},
```

---

## 4. Key Patterns

### XPath + CSS option selector pitfall

```ts
// WRONG — mixing XPath with CSS suffix:
const opts = `${xpathSelector} option`;

// CORRECT:
const opts = selector.startsWith("//")
  ? `${selector}//option`
  : `${selector} option`;
```

### Waiting after navigation

```ts
// Use networkidle for full-page loads (covers all assets)
await this.page.waitForLoadState("networkidle", { timeout: 60000 });

// Use domcontentloaded for popup windows
await popup.waitForLoadState("domcontentloaded");
```

### Resilient locator (for known-fragile selectors)

```ts
import { resilientLocator } from "../utils/selfHealingLocator";

const button = await resilientLocator(this.page, {
  primary: PAGE_NAME_LOCATORS.submitButton,
  fallbacks: ['input[type="submit"]', '//button[text()="Submit"]'],
  description: "submit button",
});
await button.click();
```

---

## Checklist

- [ ] Locators file at `src/locators/<pageName>.locators.ts`
- [ ] Page class at `src/pages/<PageName>.ts`
- [ ] All selectors in locators file — none hardcoded in class
- [ ] Methods use `waitFor({ state: "visible" })` before conditional clicks
- [ ] Navigation methods use `waitForLoadState("networkidle")`
- [ ] No raw `page.waitForTimeout()` calls
- [ ] Fixture registered in `tests/fixtures/fixture.ts`
