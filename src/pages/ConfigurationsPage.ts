import { Page } from "@playwright/test";
import { CONFIGURATIONS_PAGE_LOCATORS } from "../locators/configurationsPage.locators";

export class ConfigurationsPage {
  constructor(private page: Page) {}

  async selectRelease(index = 0) {
    await this.page
      .locator(CONFIGURATIONS_PAGE_LOCATORS.releaseField)
      .selectOption({ index });
  }

  async getReleaseOptions() {
    return this.page
      .locator(CONFIGURATIONS_PAGE_LOCATORS.releaseOptions)
      .allTextContents();
  }

  async selectType(type: "Server" | "Client") {
    const locator =
      type === "Server"
        ? CONFIGURATIONS_PAGE_LOCATORS.typeServerRadio
        : CONFIGURATIONS_PAGE_LOCATORS.typeClientRadio;
    await this.page.locator(locator).check();
  }

  async setActivePage(checked: boolean) {
    const cb = this.page.locator(
      CONFIGURATIONS_PAGE_LOCATORS.activePageCheckbox,
    );
    if ((await cb.isChecked()) !== checked) {
      await cb.click();
    }
  }

  async clickShowPage() {
    await this.page
      .locator(CONFIGURATIONS_PAGE_LOCATORS.showPageButton)
      .click();
  }

  async setEnableFilter(checked: boolean) {
    const cb = this.page.locator(
      CONFIGURATIONS_PAGE_LOCATORS.enableFilterCheckbox,
    );
    if ((await cb.isChecked()) !== checked) {
      await cb.click();
    }
  }

  async selectFilterValue(value: string) {
    await this.page
      .locator(CONFIGURATIONS_PAGE_LOCATORS.filterDropdown)
      .selectOption({ label: value });
  }

  async getStatuses() {
    return this.page
      .locator(CONFIGURATIONS_PAGE_LOCATORS.statusCells)
      .allTextContents();
  }

  async isResultsTableVisible() {
    return this.page
      .locator(CONFIGURATIONS_PAGE_LOCATORS.resultsTable)
      .isVisible();
  }
}
