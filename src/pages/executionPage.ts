import { Page, expect } from "@playwright/test";
import { EXECUTION_PAGE_LOCATORS } from "../locators/executionPage.locators";

export class ExecutionPage {
  constructor(private page: Page) {}

  async clickTab(tab: keyof typeof EXECUTION_PAGE_LOCATORS) {
    const locator = EXECUTION_PAGE_LOCATORS[tab];
    await this.page.locator(locator).click();
  }

  async areSubOptionsVisible(subOptions: string[]) {
    for (const option of subOptions) {
      const locator = `//a[normalize-space(text())='${option}']`;
      await expect(this.page.locator(locator)).toBeVisible();
    }
  }
}
