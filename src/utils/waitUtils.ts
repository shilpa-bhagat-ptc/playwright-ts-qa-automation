import { expect, Locator, Page } from "@playwright/test";
import { TIMEOUTS } from "./timeouts";

export async function waitForElementVisible(
  locator: Locator,
  timeout = TIMEOUTS.MEDIUM
) {
  await locator.waitFor({ state: "visible", timeout });
}

export async function waitForElementEnabled(
  locator: Locator,
  timeout = TIMEOUTS.MEDIUM
) {
  await locator.waitFor({ state: "attached", timeout });
  await expect(locator).toBeEnabled({ timeout });
}

export async function waitForNavigationToComplete(
  page: Page,
  timeout = TIMEOUTS.LONG
) {
  await page.waitForLoadState("load", { timeout });
}
