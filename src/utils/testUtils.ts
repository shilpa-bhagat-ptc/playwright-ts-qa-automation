import { Page, expect } from "@playwright/test";

//Wait for element to be visible and enabled before interacting

export async function waitForElementToBeReady(
  page: Page,
  selector: string,
  timeout = 5000
) {
  const locator = page.locator(selector);
  await locator.waitFor({ state: "visible", timeout });
  await expect(locator).toBeEnabled();
}

// Type text into a field after clearing existing content

export async function clearAndType(page: Page, selector: string, text: string) {
  const element = page.locator(selector);
  await element.fill(""); // clears the field
  await element.type(text);
}

//Select dropdown by visible text

export async function selectByVisibleText(
  page: Page,
  selector: string,
  visibleText: string
) {
  await page.selectOption(selector, { label: visibleText });
}

//Wait and click an element safely

export async function safeClick(page: Page, selector: string, timeout = 5000) {
  await waitForElementToBeReady(page, selector, timeout);
  await page.locator(selector).click();
}

// Check if element is visible on the page

export async function isElementVisible(
  page: Page,
  selector: string
): Promise<boolean> {
  return await page.locator(selector).isVisible();
}
