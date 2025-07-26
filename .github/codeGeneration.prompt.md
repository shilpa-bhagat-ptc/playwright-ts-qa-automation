# Code Generation Prompt for Playwright Automation Framework

This project is a UI test automation framework built with Playwright using TypeScript. Use the following guidance when generating tests, page objects, locators, or utilities:

## ✅ When Generating Tests

- All tests use `@playwright/test`.
- Each test must be wrapped in `test("description", async ({ page }, testInfo) => { ... })`.
- Always add a `testInfo.annotations.push()` block to describe the test.
- Include meaningful step-level screenshots using `await captureStepScreenshot(page, testInfo, "step_name")`.
- Use page object methods (e.g., `loginPage.loginAsValidUser()`), not raw locators in test files.
- Use `expect()` assertions to validate behavior (e.g., `expect(locator).toBeVisible()`).

## ✅ When Generating Page Object Methods

- All page objects extend a `Page` classwise like HomePage,LoginPage 
- Store element locators in separate `*.locators.ts` files and reference them via constants.
- Method names should be descriptive (e.g., `selectDateFromCalendar`, `verifyWeeklyNoteTabVisible`).
- Avoid hardcoded selectors inside methods; reuse locator constants.

## ✅ When Generating Utilities

- Utilities go in `utils/` and must export clearly named async functions.
- Example: `captureStepScreenshot(page, testInfo, stepName)` for screenshot logging.

## ✅ Conventions

- Use `async/await` for all Playwright commands.
- Keep function bodies concise and modular.
- Always import locators and properties from `../locators/...` or `../locale/commonProperties.json`.
- Follow TypeScript best practices: type safety, clear function/param names.

## ❌ Don'ts

- ❌ Don’t use `setTimeout()` — use Playwright’s built-in wait mechanisms.
- ❌ Don’t include raw selectors in test files.
- ❌ Don’t write tests without annotations or screenshots.
- ❌ Don’t hardcode data — use `TestDataGenerator` or `commonProperties`.

## ✅ Sample Test Snippet

```ts
test("Verify Login with valid credentials", async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  testInfo.annotations.push({
    type: "description",
    description: "Logs in using valid credentials and verifies the homepage.",
  });

  await loginPage.navigate();
  await captureStepScreenshot(page, testInfo, "01_navigate");

  await loginPage.loginAsValidUser();
  await captureStepScreenshot(page, testInfo, "02_login_success");

  await expect(page.locator("#homepage-title")).toBeVisible();
});
