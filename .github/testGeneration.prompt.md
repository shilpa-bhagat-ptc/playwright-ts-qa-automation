## Goal

Generate robust, readable, and maintainable Playwright tests using the Page Object Model (POM) and utility functions for screenshots and test data. The framework is written in TypeScript.

## Guidelines for Test Generation

1. **Framework**:

   - Use `@playwright/test` for writing tests.
   - Follow the Playwright test structure: `test(name, async ({ page }, testInfo) => { ... })`
   - Always include `testInfo.annotations.push({ type: "description", description: "..." })` for better reporting.

2. **Page Object Model (POM)**:

   - Use `LoginPage`, `HomePage`, and other page classes for actions.
   - Keep logic and locators out of the test files — only call reusable methods from page objects.

3. **Test Steps (common)**:

   - Login using valid credentials via `LoginPage.loginAsValidUser()`
   - Use helper functions like `captureStepScreenshot(page, testInfo, stepName)` at key points
   - Navigate to various tabs using the HomePage (e.g., `navigateToWeeklyNoteTab()`, `clickProductionDashboardTab()`)
   - Perform actions like selecting dates, dropdowns, toggling filters, etc.
   - Validate visible elements using `expect(locator).toBeVisible()` or table content with `expect(...).toEqual(...)`

4. **Test Data**:

   - Dynamic data like usernames and passwords should be generated using `TestDataGenerator`
   - Common constants like date formats, dropdown options, and headers are defined in `commonProperties.json`

5. **Error Validations**:

   - When testing invalid input (e.g. login), expect an error message or visible alert
   - Use clear selector locators or Playwright assertions for error message validation

6. **Test Coverage Scope**:
   - Weekly note tab UI and data entry
   - Production dashboard data load and header validation
   - Dashboard filters, dropdown validations, and dialog interactions
   - Negative scenarios (e.g. invalid login)

## Example Actions to Cover

- Navigate to a tab and validate it loads
- Set a date range using a calendar widget
- Select dropdown options
- Open modals/dialogs from rows
- Verify table headers match expected structure
- Take screenshots for reporting
- Validate login success/failure

## Expected Output Format

- One Playwright `test()` block per scenario
- Descriptive names and clear annotations
- Consistent use of `await` for async actions
- Use of `expect` for assertions and verifications
- No raw locators inside tests — only in Page Objects
