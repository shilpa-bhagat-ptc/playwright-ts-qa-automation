import { expect, Page } from "@playwright/test";
import { PLANNING_PAGE_LOCATORS } from "../locators/planningPage.locators";

export class PlanningPage {
  constructor(private page: Page) {}

  async isPlanningTabVisible() {
    await expect(
      this.page.locator(PLANNING_PAGE_LOCATORS.planningTab)
    ).toBeVisible();
  }

  async clickPlanningTab(testInfo: any) {
    await this.page.locator(PLANNING_PAGE_LOCATORS.planningTab).click();
  }
  async clickReleaseTab(testInfo: any) {
    await this.page.locator(PLANNING_PAGE_LOCATORS.releaseTab).click();
  }

  async areSubOptionsVisible(subOptions: string[]) {
    for (const option of subOptions) {
      // Build locator for each sub-option by visible text
      const locator = `//a[normalize-space(.)='${option}']`;
      await expect(
        this.page.locator(locator),
        `${option} sub-option should be visible`
      ).toBeVisible();
    }
  }
  async selectRelease(productName: string, testInfo?: any) {
    console.log("Clicking the Release dropdown...");

    // Step 1: Click on the Release box
    const releaseBox = this.page.locator(PLANNING_PAGE_LOCATORS.releaseInput);
    await releaseBox.click();

    // Step 2: Wait for the list to appear (visible items only)
    const productList = this.page.locator(
      "//ul[@class='es-list']/li[not(contains(@style, 'display: none'))]"
    );
    await productList.first().waitFor({ timeout: 5000 });

    // Step 3: Find the product by name and click it
    const productOption = this.page.locator(
      `//ul[@class='es-list']/li[normalize-space(text())='${productName}' and not(contains(@style, 'display: none'))]`
    );

    const isVisible = await productOption.isVisible();
    if (!isVisible) {
      throw new Error(
        `Product "${productName}" not found in visible dropdown options.`
      );
    }

    await productOption.click();
    console.log(`Selected product: ${productName}`);
  }
}
