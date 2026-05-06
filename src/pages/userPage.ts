import { Page, expect } from "@playwright/test";
import { USER_PAGE_LOCATORS } from "../locators/userPage.locators";

export class UserPage {
  constructor(private page: Page) {}

  async clickTab(tab: keyof typeof USER_PAGE_LOCATORS) {
    const locator = USER_PAGE_LOCATORS[tab];
    await this.page.locator(locator).click();
  }

  async areSubOptionsVisible(subOptions: string[]) {
    for (const option of subOptions) {
      const locator = `//a[normalize-space(text())='${option}']`;
      await expect(this.page.locator(locator)).toBeVisible();
    }
  }
}
