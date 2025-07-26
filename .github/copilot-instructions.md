# Copilot Project Instructions

This is a Playwright-based UI automation framework written in TypeScript. The following instructions should guide GitHub Copilot and Copilot Chat in assisting with development, test writing, and code maintenance.

## Code Style

- Use modern TypeScript syntax with strict typing.
- Keep test files clean and minimal — move logic to Page Object classes or utilities.
- Prefer async/await and avoid callbacks or `.then()` chaining.
- Use ES Modules (`import/export`) only.

## Playwright Usage

- All tests use the `@playwright/test` runner.
- Follow Playwright best practices: clean setup, teardown, and isolated tests.
- Add a descriptive annotation using `testInfo.annotations.push({ ... })` in every test.
- Use `expect()` for assertions.
- Use `captureStepScreenshot()` after major test steps.

## Page Object Model (POM)

- Interactions with the app must go through page objects (e.g., `LoginPage`, `HomePage`).
- Locators should be stored in `*.locators.ts` files and imported into page classes.
- Page Object methods should be descriptive (`selectReleaseOption`, `navigateToWeeklyNoteTab`), and not contain hardcoded locators or test logic.

## Test Data

- Use `TestDataGenerator` to generate dynamic test data (e.g. names, emails, passwords).
- Static values like dropdown options, labels, and dates are stored in `commonProperties.json`.

## File Organization

- `tests/` – All Playwright test specs
- `pages/` – Page Object classes
- `utils/` – Helper functions (e.g. screenshots, test data)
- `locators/` – Centralized locator definitions
- `locale/` – JSON files for language-specific properties

## Conventions

- Always include screenshots for key actions using `captureStepScreenshot(page, testInfo, 'step-name')`.
- Prefer meaningful test names like `"Validate Production Dashboard Filters"`.
- Tests should be reliable and not flaky — avoid hardcoded timeouts; use Playwright waits/assertions instead.

## Good Practices

- Ensure all Playwright test steps are wrapped in `await` calls.
- Validate both UI presence (visibility, state) and data accuracy (table contents, dropdown values).
- Keep test files under 200 lines if possible; split into multiple tests if needed.
- Avoid unnecessary `console.log()` calls in committed code.

## Don't

- Don’t use raw locators in test files — always use methods from page classes.
- Don’t use `setTimeout` for waiting — use `await expect().toBeVisible()` or `waitFor*()` instead.
- Don’t store sensitive test credentials in test files — use environment configs instead.
