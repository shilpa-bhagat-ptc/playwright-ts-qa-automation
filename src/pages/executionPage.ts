import { Page, expect } from "@playwright/test";
import { EXECUTION_PAGE_LOCATORS } from "../locators/executionPage.locators";

export class ExecutionPage {
  constructor(private page: Page) {}

  async isExecutionTabVisible(): Promise<boolean> {
    return this.page.locator(EXECUTION_PAGE_LOCATORS.executionTab).isVisible();
  }

  async clickExecutionTab() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.executionTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickTab(tab: keyof typeof EXECUTION_PAGE_LOCATORS) {
    const locator = EXECUTION_PAGE_LOCATORS[tab] as string;
    await this.page.locator(locator).click();
    await this.page.waitForLoadState("networkidle");
  }

  async areSubOptionsVisible(subOptions: string[]) {
    for (const option of subOptions) {
      const locator = `//a[normalize-space(text())='${option}']`;
      await expect(this.page.locator(locator)).toBeVisible();
    }
  }

  async clickListTab() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.listTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickWeeklyGoalTab() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.weeklyGoalTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickQaLabTab() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.qaLabTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickConfigurationsTab() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.configurationsTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickAnalysisTab() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.analysisTab).click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector(EXECUTION_PAGE_LOCATORS.analysisReleaseSelect, { state: "visible", timeout: 15000 })
      .catch(() => {});
  }

  async clickSearchTab() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.searchTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectListRelease(release: string) {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.listReleaseSelect).selectOption({ label: release });
  }

  async selectListPhase(phase: string) {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.listPhaseSelect).selectOption({ label: phase });
  }

  async clickLoadTestCaseAssignment() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.listLoadButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectWeeklyGoalOffice(office: string) {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.weeklyGoalOfficeSelect).selectOption({ label: office });
  }

  async fillWeeksBegin(date: string) {
    const input = this.page.locator(EXECUTION_PAGE_LOCATORS.weeklyGoalWeekBeginInput);
    await input.waitFor({ state: "visible" });
    // Field is readonly (date picker) — set value via evaluate
    await input.evaluate((el: HTMLInputElement, val: string) => {
      el.removeAttribute("readonly");
      el.value = val;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }, date);
  }

  async clickLoadTask() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.weeklyGoalLoadButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectQaLabRelease(release: string) {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.qaLabReleaseSelect).selectOption({ label: release });
  }

  async selectQaLabStatus(status: string) {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.qaLabStatusSelect).selectOption({ label: status });
  }

  async clickQaLabLoad() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.qaLabLoadButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickQaLabAdd() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.qaLabAddButton).click();
    await this.page.waitForLoadState("load");
  }

  async selectConfigRelease(release: string) {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.configReleaseSelect).selectOption({ label: release });
  }

  async clickShowPage() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.configShowPageButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectAnalysisRelease(release: string) {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.analysisReleaseSelect).selectOption({ label: release });
  }

  async clickAnalysisLoad() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.analysisLoadButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickExecutionSearch() {
    await this.page.locator(EXECUTION_PAGE_LOCATORS.searchButton).click();
    await this.page.waitForLoadState("networkidle");
  }
}
