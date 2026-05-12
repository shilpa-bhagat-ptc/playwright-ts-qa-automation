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

  private async waitForLoad() {
    await this.page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  }

  // ── Admin Main Tab ─────────────────────────────────────────────────────
  async clickAdminTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.adminTab).click();
    await this.waitForLoad();
  }

  // ── Users Sub-Tab ──────────────────────────────────────────────────────
  async clickUsersTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.usersTab).click();
    await this.waitForLoad();
  }

  async selectUsersOffice(office: string) {
    const select = this.page.locator(ADMIN_PAGE_LOCATORS.usersOfficeSelect);
    try {
      await select.selectOption({ label: office });
    } catch {
      await select.selectOption({ index: 0 });
    }
  }

  async clickShowPage() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.showPageButton).click();
    await this.waitForLoad();
  }

  // ── Offices Sub-Tab ───────────────────────────────────────────────────
  async clickOfficesTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.officesTab).click();
    await this.waitForLoad();
  }

  // ── Configurations Sub-Tab ────────────────────────────────────────────
  async clickConfigurationsTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.configurationsTab).click();
    await this.waitForLoad();
  }

  async selectConfigRelease(releaseIndex = 0) {
    await this.page.locator(ADMIN_PAGE_LOCATORS.configReleaseSelect).selectOption({ index: releaseIndex });
  }

  // ── Languages Sub-Tab ─────────────────────────────────────────────────
  async clickLanguagesTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.languagesTab).click();
    await this.waitForLoad();
  }

  // ── Platforms Sub-Tab ─────────────────────────────────────────────────
  async clickPlatformsTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.platformsTab).click();
    await this.waitForLoad();
  }

  async selectPlatformRelease(releaseIndex = 0) {
    await this.page.locator(ADMIN_PAGE_LOCATORS.platformReleaseSelect).selectOption({ index: releaseIndex });
  }

  // ── Products Sub-Tab ──────────────────────────────────────────────────
  async clickProductsTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.productsTab).click();
    await this.waitForLoad();
  }

  // ── Components Sub-Tab ────────────────────────────────────────────────
  async clickComponentsTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.componentsTab).click();
    await this.waitForLoad();
  }

  // ── Test Types Sub-Tab ────────────────────────────────────────────────
  async clickTestTypesTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.testTypesTab).click();
    await this.waitForLoad();
  }

  // ── CFT Report Sub-Tab (Admin) ────────────────────────────────────────
  async clickCftReportAdminTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.cftReportTab).click();
    await this.waitForLoad();
  }

  // ── App Type Sub-Tab ──────────────────────────────────────────────────
  async clickAppTypeTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.appTypeTab).click();
    await this.waitForLoad();
  }

  // ── Application Sub-Tab ───────────────────────────────────────────────
  async clickApplicationTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.applicationTab).click();
    await this.waitForLoad();
  }

  // ── Release Sub-Tab (Admin) ───────────────────────────────────────────
  async clickReleaseTab() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.releaseTab).click();
    await this.waitForLoad();
  }

  async clickLoad() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.loadButton).click();
    await this.waitForLoad();
  }

  // ── Common Add / Edit / Delete ─────────────────────────────────────────
  async clickAdd() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.addButton).click();
    await this.page.waitForLoadState("load", { timeout: 30000 }).catch(() => {});
  }

  async clickEdit() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.editButton).click();
    await this.page.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
  }

  async clickDelete() {
    await this.page.locator(ADMIN_PAGE_LOCATORS.deleteButton).click();
    await this.page.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
  }

  // ── Active Only Checkbox ───────────────────────────────────────────────
  async checkActiveOnly() {
    const cb = this.page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox);
    if (!(await cb.isChecked().catch(() => false))) {
      await cb.check();
      await this.waitForLoad();
    }
  }

  async uncheckActiveOnly() {
    const cb = this.page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox);
    if (await cb.isChecked().catch(() => false)) {
      await cb.uncheck();
      await this.waitForLoad();
    }
  }
}
