# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Required reading before editing

- [SKILL.md](SKILL.md) — full framework conventions (TC ID format, fixture imports, locator/page-object/data patterns, screenshot/annotation rules, common mistakes). Treat as authoritative; do not restate or contradict it.
- [.github/copilot-instructions.md](.github/copilot-instructions.md) — style rules (POM-only, no raw locators in specs, no hardcoded timeouts).

## Running tests

`playwright.config.ts` requires `TEST_PROJECT` to be set — it reads the env var and points `testDir` at exactly one folder under `tests/specs/`. **Running `npx playwright test` without `TEST_PROJECT` throws.** This is intentional: each Jenkins job runs one suite. There are no Playwright "projects" defined in config; the project name is the env var.

Valid values: `homePageTests`, `adminPageTests`, `planningPageTests`, `queryPageTests`, `userPageTests`, `reportPageTests`, `executionPageTests`.

```powershell
# Single suite (PowerShell)
$env:TEST_PROJECT = "adminPageTests"; npx playwright test

# Single spec file
$env:TEST_PROJECT = "userPageTests"; npx playwright test tests/specs/userPage/userTests.spec.ts

# Single test by title grep
$env:TEST_PROJECT = "userPageTests"; npx playwright test -g "TC_USR_001"

# UI mode / debug
$env:TEST_PROJECT = "homePageTests"; npx playwright test --ui
$env:TEST_PROJECT = "homePageTests"; npx playwright test --debug

# All suites sequentially (local convenience)
./run-all-tests.ps1
```

`workers: 1` and `retries: 1` are fixed in config. `headless: false` by default — tests run with a visible browser. `trace` and `screenshot` are always on.

Posttest hook runs `tools/formatJUnitReport.ts` automatically via `npm test`; if invoking `npx playwright test` directly, that formatter is skipped (Jenkinsfile runs it as a separate stage).

## Architecture — what isn't obvious from the file tree

### Two-layer auth (this is the part that surprises people)

1. `tests/config/global-setup.ts` logs in as `sbhagat`/`123` once at the start of the test run and writes `.auth/storageState.json`. Up to 3 retries with 5s backoff. Config loads this via `use.storageState`.
2. `tests/fixtures/fixture.ts` wraps every page fixture in `navigateAuthenticated()`, which re-authenticates mid-test if the server session expired. It detects two cases: (a) redirect to `login.jsp`, and (b) the app silently downgrading and showing a "Login =>" link instead of "Logout =>" without redirecting. The fixture re-fills credentials inline using `testData.validUser` and re-navigates to the original target.

Do not add login steps inside individual tests. The only exception is invalid-login tests, which instantiate `new LoginPage(page)` directly.

The base URL comes from `TEST_QALINK_BASE` (default `https://lqatms-test5.ptcnet.ptc.com/QALink`), read in [tests/fixtures/fixture.ts](tests/fixtures/fixture.ts), [tests/config/global-setup.ts](tests/config/global-setup.ts) and the POMs. Jenkins sets it from the `QALINK_SERVER_URL` job parameter. Each fixture supports a per-page env override (`TEST_HOME_URL`, `TEST_PLANNING_URL`, etc.).

### Fixtures auto-navigate

Importing the `homePage` / `planningPage` / `executionPage` / `queryPage` / `reportPage` / `userPage` / `adminPage` fixture **already navigated to that page** and waited for `networkidle` (capped at 30s). Do not add a redundant `page.goto(...)` at the start of a test. Only pull in fixtures the test uses — pulling `loginPage` when auth is handled by storageState is a common mistake.

### Reporting

`reporter` in [playwright.config.ts](playwright.config.ts) emits four channels: list, JUnit (`reports/test-results/results.xml`), HTML (`reports/html-report/`, never auto-opens), and `@ptc-fusion/playwright-hector-reporter` which uploads per-test results live to Hector at `https://hector.ptcnet.ptc.com/Hector`. The `testCategory` passed to Hector is the `TEST_PROJECT` env var; `developmentBuild` comes from the `HECTOR_BUILD_NUMBER` env var (Jenkins job parameter of the same name; default 19). Build-level Hector push is done by a separate Jenkins job `Post-Hector-Results_QALink`.

### Jenkins

[Jenkinsfile](Jenkinsfile) has a `TEST_PROJECT` choice parameter that includes `ALL` — when `ALL`, the pipeline loops through every suite, running `npx playwright test` once per `TEST_PROJECT` value. Otherwise it runs once with the selected suite. Artifacts archived: `reports/html-report/**` and `screenshots/**`.

### Self-healing locators

[src/utils/selfHealingLocator.ts](src/utils/selfHealingLocator.ts) provides `resilientLocator(page, { primary, fallbacks, description })` for cases where a locator might drift. Not the default — only use when a locator is known to be fragile. Logs healing events for maintenance review.

## File-organization gotchas

- Spec folders under `tests/specs/` are not all flat. `homePage/`, `planningPage/`, and `queryPage/` have feature sub-folders (e.g., `tests/specs/homePage/weeklyNote/`). Others are flat (`adminPage/adminTests.spec.ts`).
- `src/pages/` has mixed casing: PascalCase for some (`HomePage.ts`, `LoginPage.ts`, `PlanningPage.ts`, `ConfigurationsPage.ts`), camelCase for others (`adminPage.ts`, `userPage.ts`, etc.). Match the existing file when adding methods; don't rename without reason.
- Locators live in `src/locators/*.locators.ts`. Never put raw selectors in specs (see copilot rules).
- Static data lives in `src/locale/commonProperties.json`; dynamic data in `src/utils/testDataGenerator.ts` (`TestDataGenerator` class). Some array constants (e.g., `PRODUCTION_DASHBOARD_HEADERS`) are exported at the bottom of `testDataGenerator.ts` — check there before adding a new file.
- `tests/specs/API/login.spec.ts` is the only API-level test and the only place `test.describe` is used by convention.

## Tooling scripts (`tools/`)

Run via `ts-node`. Most have npm aliases in [package.json](package.json):

- `npm run extract:locators` — MCP-driven locator extraction
- `npm run crawl:pages` — MCP crawler
- `npm run convert:excel` — Excel → spec scaffolding (see `playwright-excel-converter.agent.md`)
- `npm run report:healing` — emit self-healing-locator report
- `npm run ai:analyze` / `ai:select` / `ai:flaky` — AI-driven failure / selection / flake analyzers

## When the user asks about agents or Jenkins auto-heal

[qa-link-jenkins-result-analyzer-auto-healing.agent.md](qa-link-jenkins-result-analyzer-auto-healing.agent.md) defines an agent that polls the Jenkins `playwright-ts-qa-automation` job, analyzes failures, and proposes locator heals on a branch. Its config is in `.env` (template in `.env.example`). The `HECTOR_REPORT_JOB_URL` job is the **only** Jenkins job that agent is permitted to trigger.

## Not in version control / safe to ignore

`.agent-worktree*/`, `.agent-*.tmp`, `.jenkins-build-info.tmp`, `*.log`, `inspect-*.ts`, `screenshots/`, `test-results/`, `reports/html-report/`, `.auth/`, `.env`, `playwright-ts-qa-automation/` (a nested clone), `agent.jar` — all generated or local-only. Don't clean them up unless asked.
