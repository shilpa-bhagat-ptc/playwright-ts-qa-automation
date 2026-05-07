import { Page, expect } from "@playwright/test";
import { REPORT_PAGE_LOCATORS } from "../locators/reportPage.locators";

export class ReportPage {
  constructor(private page: Page) {}

  async isReportTabVisible(): Promise<boolean> {
    return this.page.locator(REPORT_PAGE_LOCATORS.reportTab).isVisible();
  }

  async clickReportTab() {
    await this.page.locator(REPORT_PAGE_LOCATORS.reportTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async areSubTabsVisible(subTabs: string[]) {
    for (const tab of subTabs) {
      const locator = `//a[normalize-space()='${tab}']`;
      await expect(this.page.locator(locator)).toBeVisible();
    }
  }

  // ── Overall Tab ────────────────────────────────────────────────────────
  async clickOverallTab() {
    await this.page.locator(REPORT_PAGE_LOCATORS.overallTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectOverallRelease(release: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.overallReleaseSelect).selectOption({ label: release });
  }

  async selectOverallPhase(phase: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.overallPhaseSelect).selectOption({ label: phase });
  }

  async clickOverallPhaseAdd() {
    await this.page.locator(REPORT_PAGE_LOCATORS.overallPhaseAddArrow).click();
  }

  async clickOverallPhaseRemove() {
    await this.page.locator(REPORT_PAGE_LOCATORS.overallPhaseRemoveArrow).click();
  }

  async clickOverallLoad() {
    await this.page.locator(REPORT_PAGE_LOCATORS.overallLoadButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  // ── CFT Report Tab ─────────────────────────────────────────────────────
  async clickCftReportTab() {
    await this.page.locator(REPORT_PAGE_LOCATORS.cftReportTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectCftReport(cftReport: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.cftReportSelect).selectOption({ label: cftReport });
  }

  async selectCftRelease(release: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.cftReleaseSelect).selectOption({ label: release });
  }

  async selectCftPhase(phase: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.cftPhaseSelect).selectOption({ label: phase });
  }

  async clickCftPhaseAdd() {
    await this.page.locator(REPORT_PAGE_LOCATORS.cftPhaseAddArrow).click();
  }

  async clickCftPhaseRemove() {
    await this.page.locator(REPORT_PAGE_LOCATORS.cftPhaseRemoveArrow).click();
  }

  async clickCftComponentAdd() {
    await this.page.locator(REPORT_PAGE_LOCATORS.cftComponentAddArrow).click();
  }

  async clickCftComponentRemove() {
    await this.page.locator(REPORT_PAGE_LOCATORS.cftComponentRemoveArrow).click();
  }

  async selectCftViewDetail() {
    await this.page.locator(REPORT_PAGE_LOCATORS.cftViewDetailRadio).first().click();
  }

  async selectCftViewSummary() {
    await this.page.locator(REPORT_PAGE_LOCATORS.cftViewSummaryRadio).first().click();
  }

  async clickCftGenerate() {
    await this.page.locator(REPORT_PAGE_LOCATORS.cftGenerateButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  // ── TestCase Info Tab ──────────────────────────────────────────────────
  async clickTestCaseInfoTab() {
    await this.page.locator(REPORT_PAGE_LOCATORS.testCaseInfoTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectTestCaseInfoRelease(release: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.testCaseInfoReleaseSelect).selectOption({ label: release });
  }

  async selectTestCaseInfoProduct(product: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.testCaseInfoProductSelect).selectOption({ label: product });
  }

  async clickTestCaseInfoLoad() {
    await this.page.locator(REPORT_PAGE_LOCATORS.testCaseInfoLoadButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  // ── Weekly Report Tab ──────────────────────────────────────────────────
  async clickWeeklyReportTab() {
    await this.page.locator(REPORT_PAGE_LOCATORS.weeklyReportTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectWeeklyReportOffice(office: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.weeklyReportOfficeSelect).selectOption({ label: office });
  }

  async fillWeeklyReportStartDate(date: string) {
    const input = this.page.locator(REPORT_PAGE_LOCATORS.weeklyReportStartDateInput);
    await input.waitFor({ state: "visible" });
    // Set value directly without change event — firing change auto-triggers page reload
    // which closes the page context mid-evaluate. Load Tasks is clicked explicitly after.
    await input.evaluate((el: HTMLInputElement, val: string) => {
      el.removeAttribute("readonly");
      el.value = val;
    }, date);
  }

  async clickWeeklyReportLoad() {
    await this.page.locator(REPORT_PAGE_LOCATORS.weeklyReportLoadButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickWeeklyReportSave() {
    await this.page.locator(REPORT_PAGE_LOCATORS.weeklyReportSaveButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickWeeklyReportSendMail() {
    await this.page.locator(REPORT_PAGE_LOCATORS.weeklyReportSendMailButton).click();
    await this.page.waitForTimeout(2000);
  }

  async clickWeeklyReportPushToTracker() {
    await this.page.locator(REPORT_PAGE_LOCATORS.weeklyReportPushTrackerButton).click();
    await this.page.waitForTimeout(5000);
  }

  async clickWeeklyReportTimeTrackerReport() {
    await this.page.locator(REPORT_PAGE_LOCATORS.weeklyReportTimeTrackerButton).click();
    await this.page.waitForTimeout(2000);
  }

  // ── TimeReport Tab ─────────────────────────────────────────────────────
  async clickTimeReportTab() {
    await this.page.locator(REPORT_PAGE_LOCATORS.timeReportTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectTimeReportRelease(release: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.timeReportReleaseSelect).selectOption({ label: release });
  }

  async selectTimeReportOffice(office: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.timeReportOfficeSelect).selectOption({ label: office });
  }

  async fillTimeReportPeriodFrom(date: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.timeReportPeriodFromInput).fill(date);
  }

  async fillTimeReportPeriodTo(date: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.timeReportPeriodToInput).fill(date);
  }

  async selectTimeReportViewSummary() {
    await this.page.locator(REPORT_PAGE_LOCATORS.timeReportViewSummaryRadio).first().click();
  }

  async clickTimeReportLoad() {
    await this.page.locator(REPORT_PAGE_LOCATORS.timeReportLoadButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  // ── ROI Report Tab ─────────────────────────────────────────────────────
  async clickRoiReportTab() {
    await this.page.locator(REPORT_PAGE_LOCATORS.roiReportTab).click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectRoiOffice(office: string) {
    await this.page.locator(REPORT_PAGE_LOCATORS.roiOfficeSelect).selectOption({ label: office });
  }

  async fillRoiStartDate(date: string) {
    const input = this.page.locator(REPORT_PAGE_LOCATORS.roiStartDateInput);
    await input.waitFor({ state: "visible" });
    await input.evaluate((el: HTMLInputElement, val: string) => {
      el.removeAttribute("readonly");
      el.value = val;
    }, date);
  }

  async fillRoiEndDate(date: string) {
    const input = this.page.locator(REPORT_PAGE_LOCATORS.roiEndDateInput);
    await input.waitFor({ state: "visible" });
    await input.evaluate((el: HTMLInputElement, val: string) => {
      el.removeAttribute("readonly");
      el.value = val;
    }, date);
  }

  async clickRoiLoad() {
    await this.page.locator(REPORT_PAGE_LOCATORS.roiLoadButton).click();
    await this.page.waitForLoadState("networkidle");
  }
}
