import { Page, expect } from "@playwright/test";
import { ADMIN_PAGE_LOCATORS } from "../locators/adminPage.locators";

export class AdminPage {
  constructor(private page: Page) {}

  async clickTab(tab: keyof typeof ADMIN_PAGE_LOCATORS) {
    const locator = ADMIN_PAGE_LOCATORS[tab];
    await this.page.locator(locator).click();
  }

  async areSubOptionsVisible(subOptions: string[]) {
    for (const option of subOptions) {
      const locator = `//a[normalize-space(text())='${option}']`;
      await expect(this.page.locator(locator)).toBeVisible();
    }
  }
}
