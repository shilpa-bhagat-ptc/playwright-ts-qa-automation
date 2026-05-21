# Playwright QA Automation — GitHub Copilot Plugin

A drop-in GitHub Copilot customization package for Playwright TypeScript QA automation frameworks built on the Page Object Model (POM) pattern.

## What's Included

| File                                                           | What it does                                                                             |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `.github/copilot-instructions.md`                              | Always-on rules: TC ID format, POM pattern, fixture auth, locator rules, common pitfalls |
| `.github/instructions/playwright-qa-framework.instructions.md` | Auto-applied to spec/page/locator files — imports, wait patterns, XPath pitfalls         |
| `.github/prompts/add-test.prompt.md`                           | `/add-test` slash command — generates a full test case                                   |
| `.github/prompts/add-page-object.prompt.md`                    | `/add-page-object` slash command — generates a page object + locators                    |
| `.github/agents/qa-test-writer.agent.md`                       | `qa-test-writer` agent — knows the whole framework, debugs failures                      |
| `.github/skills/playwright-qa/SKILL.md`                        | `/playwright-qa` skill — full step-by-step build guide for new engineers                 |

## Install

### Option 1 — PowerShell (Windows)

```powershell
cd your-project-root
Invoke-Expression (Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-org/playwright-qa-ghcp-plugin/main/install.ps1").Content
```

Or copy the downloaded folder and run locally:

```powershell
cd path\to\playwright-qa-ghcp-plugin
.\install.ps1 -TargetPath "C:\path\to\your\project"
```

### Option 2 — Bash (Mac/Linux)

```bash
cd path/to/playwright-qa-ghcp-plugin
./install.sh /path/to/your/project
```

### Option 3 — Manual

Copy the `.github/` folder into your project root. That's it.

## Usage After Install

Open your project in VS Code with GitHub Copilot enabled.

### Slash Commands

In Copilot Chat (type `/`):

- **`/add-test`** — generates a new test case with correct TC ID, fixture imports, screenshots, annotations
- **`/add-page-object`** — generates a page class + locators file for a new app page

### Agent Mode

Switch Copilot Chat to **Agent** mode → select **`qa-test-writer`**:

- Writes test cases following POM conventions
- Debugs test failures (knows common pitfalls)
- Enforces TC ID format, screenshot coverage, annotation rules

### Skill

In agent mode:

```
/playwright-qa
```

Loads the full framework build guide: global-setup, fixtures, config, page objects, locators, test data, Jenkins/Hector reporting.

### Always-On Instructions

The copilot instructions apply automatically to every Copilot interaction. The framework instructions auto-activate when you open spec files (`tests/**/*.spec.ts`), page objects (`src/pages/**/*.ts`), or locator files (`src/locators/**/*.ts`).

## Framework Conventions Enforced

### TC ID Format

`TC_<PREFIX>_<NNN>` — always underscore-separated, 3-digit zero-padded.

| Page      | Prefix | Example       |
| --------- | ------ | ------------- |
| Home      | `HOM`  | `TC_HOM_001`  |
| Planning  | `PLAN` | `TC_PLAN_001` |
| Execution | `EXE`  | `TC_EXE_001`  |
| Query     | `QRY`  | `TC_QRY_001`  |
| Report    | `RPT`  | `TC_RPT_001`  |
| User      | `USR`  | `TC_USR_001`  |
| Admin     | `ADM`  | `TC_ADM_001`  |

### Auth Model

- Login once in `global-setup.ts` → saves `.auth/storageState.json`
- All tests reuse session via `use.storageState` in config
- Fixtures auto-re-authenticate if session expires (detects redirect + silent downgrade)
- Never add login steps inside tests

### Running Tests

`TEST_PROJECT` env var is required:

```powershell
$env:TEST_PROJECT = "homePageTests"; npx playwright test
```

### Known Pitfalls Caught by the Plugin

| Problem                            | Root Cause                                                  | Fix                                      |
| ---------------------------------- | ----------------------------------------------------------- | ---------------------------------------- |
| `AggregateError` after form submit | `Promise.any([waitForSelector...])` — frame detaches on nav | `waitForLoadState("networkidle")`        |
| XPath + ` option` invalid selector | CSS suffix on XPath string                                  | Check `startsWith('//')`, use `//option` |
| Tests skip unexpectedly            | Permission-gated UI, not auth failure                       | Add `test.skip()` guard                  |
| Missing screenshots in report      | `testInfo` not in test signature                            | Add `testInfo` as param                  |

## Requirements

- VS Code with [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) and [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extensions installed
- Copilot Chat version supporting agent customization (VS Code 1.90+)

## Customizing for Your Project

1. Edit `.github/copilot-instructions.md` — update base URL, TC prefix table if your pages differ
2. Edit `.github/agents/qa-test-writer.agent.md` — update Hector URL, Jenkins job names
3. Edit `.github/skills/playwright-qa/SKILL.md` — update auth credentials, app-specific URLs

## File Structure This Plugin Expects

```
your-project/
  tests/
    config/global-setup.ts
    fixtures/fixture.ts
    specs/<page>/<feature>/*.spec.ts
  src/
    pages/          ← Page Object classes
    locators/       ← *.locators.ts selector maps
    locale/commonProperties.json
    utils/
      screenshotHelper.ts
      testDataGenerator.ts
  playwright.config.ts
```
