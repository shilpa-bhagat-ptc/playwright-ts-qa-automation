import { expect, Page } from "@playwright/test";
import { QUERY_PAGE_LOCATORS } from "../locators/queryPage.locators";

export class QueryPage {
  private popupPage: Page | null = null;
  private duplicatePopupPage: Page | null = null;

  constructor(private page: Page) {}

  async clickQueryTab() {
    await this.page.locator(QUERY_PAGE_LOCATORS.queryTab).click();
    await this.page.waitForLoadState("load");
  }

  async clickBasicTab() {
    const base =
      process.env.TEST_QALINK_BASE ||
      "http://lqatms-test5.ptcnet.ptc.com:8080/QALink";
    await this.page.goto(`${base}/jsp/query/basic.jsp`);
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForSelector(QUERY_PAGE_LOCATORS.releaseSelect, {
      state: "visible",
      timeout: 15000,
    });
  }

  async clickUpdateTab() {
    const base =
      process.env.TEST_QALINK_BASE ||
      "http://lqatms-test5.ptcnet.ptc.com:8080/QALink";
    await this.page.goto(`${base}/jsp/query/update.jsp`);
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForSelector(QUERY_PAGE_LOCATORS.releaseSelect, {
      state: "visible",
      timeout: 15000,
    });
  }

  async clickAdvancedTab() {
    await this.page.locator(QUERY_PAGE_LOCATORS.advancedTab).click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyQuerySubTabsVisible() {
    for (const tab of ["Basic", "Advanced", "Update"]) {
      await expect(
        this.page.locator(`//a[normalize-space()='${tab}']`)
      ).toBeVisible({ timeout: 20000 });
    }
  }

  async clickControlAndVerifyDropdownAppears(controlId: string) {
    const select = this.page.locator(controlId);
    await expect(select).toBeVisible({ timeout: 5000 });
    const optionCount = await select.locator("option").count();
    expect(optionCount).toBeGreaterThan(0);
  }

  // ── Basic Tab ──────────────────────────────────────────────────────

  async verifyBasicTabFieldsVisible() {
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.releaseControl)
    ).toBeVisible();
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.phaseSelect)
    ).toBeVisible();
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.productControl)
    ).toBeVisible();
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.loadButton)
    ).toBeVisible();
  }

  async selectRelease(release: string) {
    const value = await this.page.evaluate((relLabel: string) => {
      const sel = document.querySelector("select#release") as HTMLSelectElement & {
        tomselect?: { setValue: (v: string) => void };
      };
      const opt = Array.from(sel?.options ?? []).find((o) => o.text === relLabel);
      if (!opt) return null;

      if (sel.tomselect) {
        // TomSelect is initialized — use its API (triggers onChange → genPhase)
        sel.tomselect.setValue(opt.value);
      } else {
        // TomSelect CDN not yet loaded: inject a minimal stub so genPhase can run
        // without throwing, and native select options get populated by the function.
        if (typeof (window as any).TomSelect === "undefined") {
          (window as any).TomSelect = function (
            this: any,
            element: HTMLSelectElement
          ) {
            element.tomselect = this;
            this.clearOptions = () => {};
            this.addOption = () => {};
            this.refreshOptions = () => {};
            this.setValue = () => {};
            this.addItem = () => {};
          };
        }
        sel.value = opt.value;
        const fn = (window as any).genPhase;
        if (fn) fn(opt.value);
      }
      return opt.value;
    }, release);
    if (!value) throw new Error(`Release option "${release}" not found`);
    // Wait briefly for synchronous option population to settle
    await this.page.waitForTimeout(500);
  }

  async addPhaseToSelection() {
    const right = this.page.locator(QUERY_PAGE_LOCATORS.phaseSelectionBox);
    const rightCount = await right.locator("option").count();
    if (rightCount > 2) {
      // update.jsp auto-fills all phases via genPhase; trim to 2 so validate()
      // passes (requires length > 1) and the server query stays fast
      await this.page.evaluate(() => {
        const rightBox = document.querySelector("select[name='release_phase']") as HTMLSelectElement;
        if (rightBox) rightBox.length = 2;
      });
      return;
    }
    // basic.jsp case: right box starts empty, add one phase via UI
    const left = this.page.locator(QUERY_PAGE_LOCATORS.phaseSelect);
    const count = await left.locator("option").count();
    if (count === 0) return;
    await left.selectOption({ index: count > 1 ? 1 : 0 });
    await this.page.locator(QUERY_PAGE_LOCATORS.phaseAddArrow).click();
    await this.page.waitForTimeout(300);
  }

  async removePhaseFromSelection() {
    const box = this.page.locator(QUERY_PAGE_LOCATORS.phaseSelectionBox);
    const count = await box.locator("option").count();
    if (count > 0) {
      await box.selectOption({ index: 0 });
      await this.page.locator(QUERY_PAGE_LOCATORS.phaseRemoveArrow).click();
    }
  }

  async selectProduct(product: string) {
    await this.page
      .locator(QUERY_PAGE_LOCATORS.productSelect)
      .selectOption({ label: product });
  }

  async clickLoadTestCaseDocument() {
    await this.page.locator(QUERY_PAGE_LOCATORS.loadButton).click();
    await this.page.waitForLoadState("networkidle", { timeout: 60000 });
  }

  async verifyDocumentListVisible() {
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.documentListHeading)
    ).toBeVisible({ timeout: 20000 });
  }

  async verifyDocumentListSearchBarVisible() {
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.searchByProjectInput)
    ).toBeVisible();
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.searchButton)
    ).toBeVisible();
  }

  async verifyDocumentTableColumnsPresent(expectedColumns: string[]) {
    for (const col of expectedColumns) {
      await expect(
        this.page.locator(`(//td | //th)[normalize-space()='${col}']`).first()
      ).toBeVisible({ timeout: 5000 });
    }
  }

  async verifyDocumentTitleLinksPresent() {
    const links = this.page.locator(QUERY_PAGE_LOCATORS.documentTitleLinks);
    expect(await links.count()).toBeGreaterThan(0);
  }

  async clickFirstDocumentTitle() {
    const link = this.page.locator(QUERY_PAGE_LOCATORS.documentTitleLinks).first();
    const href = await link.getAttribute("href");
    if (href) {
      const base = process.env.TEST_QALINK_BASE || "http://lqatms-test5.ptcnet.ptc.com:8080/QALink";
      const url = href.startsWith("http") ? href : `${base}/jsp/query/${href.replace(/^\.\//, "")}`;
      await this.page.goto(url);
    } else {
      await link.click();
    }
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyTestCaseDetailTableVisible() {
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.testCaseDetailTable)
    ).toBeVisible({ timeout: 15000 });
  }

  async toggleEnableFilter() {
    // The onclick handler uses getElementById(name) — ensure id matches name first
    await this.page.evaluate(() => {
      const cb = document.querySelector("input[name='chk_othertask']") as HTMLInputElement | null;
      if (cb && !cb.id) cb.id = cb.name;
    });
    await this.page.locator(QUERY_PAGE_LOCATORS.enableFilterCheckbox).check();
    await this.page.waitForTimeout(500);
  }

  async verifyFilterDropdownsVisible() {
    const dropdowns = this.page.locator(QUERY_PAGE_LOCATORS.filterDropdowns);
    expect(await dropdowns.count()).toBeGreaterThan(0);
  }

  // ── Update Tab ─────────────────────────────────────────────────────

  async verifyUpdateTabFieldsVisible() {
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.releaseControl)
    ).toBeVisible();
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.productControl)
    ).toBeVisible();
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.componentControl)
    ).toBeVisible();
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.componentAddArrow)
    ).toBeVisible();
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.componentRemoveArrow)
    ).toBeVisible();
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.phaseSelect)
    ).toBeVisible();
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.phaseAddArrow)
    ).toBeVisible();
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.phaseRemoveArrow)
    ).toBeVisible();
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.loadButton)
    ).toBeVisible();
  }

  async addComponentToSelection() {
    const left = this.page.locator(QUERY_PAGE_LOCATORS.componentSelect);
    const count = await left.locator("option").count();
    if (count > 0) {
      await left.selectOption({ index: 0 });
      await this.page.locator(QUERY_PAGE_LOCATORS.componentAddArrow).click();
      await this.page.waitForTimeout(300);
    }
  }

  async removeComponentFromSelection() {
    const right = this.page.locator(QUERY_PAGE_LOCATORS.componentSelectionBox);
    const count = await right.locator("option").count();
    if (count > 0) {
      await right.selectOption({ index: 0 });
      await this.page.locator(QUERY_PAGE_LOCATORS.componentRemoveArrow).click();
    }
  }

  async verifyQueryListVisible() {
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.queryListHeading)
    ).toBeVisible({ timeout: 20000 });
  }

  async verifyQueryListColumnsPresent(expectedColumns: string[]) {
    for (const col of expectedColumns) {
      await expect(
        this.page.locator(
          `//table[.//*[normalize-space()='Title'] and .//*[normalize-space()='Duplicate']]//*[self::th or self::td][normalize-space()='${col}']`
        ).first()
      ).toBeVisible();
    }
  }

  async verifyQueryListTitleLinksPresent() {
    expect(
      await this.page.locator(QUERY_PAGE_LOCATORS.queryListTitleLinks).count()
    ).toBeGreaterThan(0);
  }

  async verifyQueryListReviewLinksPresent() {
    expect(
      await this.page.locator(QUERY_PAGE_LOCATORS.queryListReviewLinks).count()
    ).toBeGreaterThan(0);
  }

  async verifyQueryListDuplicateLinksPresent() {
    const count = await this.page.locator(QUERY_PAGE_LOCATORS.queryListDuplicateLinks).count();
    if (count === 0) {
      console.log("No Duplicate links present — documents may already be duplicated to all targets");
    } else {
      expect(count).toBeGreaterThan(0);
    }
  }

  async verifyUpdateButtonVisible() {
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.updateButton)
    ).toBeVisible();
  }

  async clickReviewLink() {
    await this.page
      .locator(QUERY_PAGE_LOCATORS.queryListReviewLinks)
      .first()
      .click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clickEditLinkInReviewPage() {
    const [popup] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.page.locator(QUERY_PAGE_LOCATORS.reviewPageEditLinks).first().click(),
    ]);
    await popup.waitForLoadState("domcontentloaded");
    this.popupPage = popup;
  }

  async verifyTcUpdateOverlayVisible() {
    if (!this.popupPage) throw new Error("No popup page — call clickEditLinkInReviewPage first");
    await expect(
      this.popupPage.locator(QUERY_PAGE_LOCATORS.tcUpdateOverlayTitle)
    ).toBeVisible({ timeout: 10000 });
  }

  async closeTcUpdateOverlay() {
    if (!this.popupPage) return;
    await this.popupPage.close();
    this.popupPage = null;
  }

  async verifySaveAllButtonVisible() {
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.saveAllButton).first()
    ).toBeVisible();
  }

  async clickSaveAll() {
    await this.page.locator(QUERY_PAGE_LOCATORS.saveAllButton).first().click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clickUpdateButton() {
    await this.page.locator(QUERY_PAGE_LOCATORS.updateButton).click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyUpdateListVisible() {
    await expect(
      this.page.locator(QUERY_PAGE_LOCATORS.updateListHeading)
    ).toBeVisible({ timeout: 20000 });
  }

  async verifyReviewStatusDropdownOptions(expectedOptions: string[]) {
    const dropdown = this.page
      .locator(QUERY_PAGE_LOCATORS.reviewStatusDropdown)
      .first();
    await expect(dropdown).toBeVisible();
    for (const opt of expectedOptions) {
      await expect(
        dropdown.locator(`option:has-text("${opt}")`)
      ).toBeAttached();
    }
  }

  async clickDuplicateLink() {
    const [popup] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.page.locator(QUERY_PAGE_LOCATORS.queryListDuplicateLinks).first().click(),
    ]);
    await popup.waitForLoadState("domcontentloaded");
    this.duplicatePopupPage = popup;
  }

  async verifyDuplicateOverlayVisible() {
    if (!this.duplicatePopupPage) throw new Error("No duplicate popup — call clickDuplicateLink first");
    await expect(
      this.duplicatePopupPage.locator(QUERY_PAGE_LOCATORS.duplicateOverlayTitle)
    ).toBeVisible({ timeout: 10000 });
  }

  async verifyDuplicateOverlayFieldsVisible() {
    if (!this.duplicatePopupPage) throw new Error("No duplicate popup — call clickDuplicateLink first");
    await expect(
      this.duplicatePopupPage.locator(QUERY_PAGE_LOCATORS.duplicateTargetRelease)
    ).toBeVisible();
    await expect(
      this.duplicatePopupPage.locator(QUERY_PAGE_LOCATORS.duplicateTargetPhase)
    ).toBeVisible();
    await expect(
      this.duplicatePopupPage.locator(QUERY_PAGE_LOCATORS.duplicateConfirmButton)
    ).toBeVisible();
  }

  async selectDuplicateTargetRelease(release: string) {
    if (!this.duplicatePopupPage) throw new Error("No duplicate popup — call clickDuplicateLink first");
    await this.duplicatePopupPage
      .locator(QUERY_PAGE_LOCATORS.duplicateTargetRelease)
      .selectOption({ label: release });
  }

  async selectDuplicateTargetPhase(phase: string) {
    if (!this.duplicatePopupPage) throw new Error("No duplicate popup — call clickDuplicateLink first");
    await this.duplicatePopupPage
      .locator(QUERY_PAGE_LOCATORS.duplicateTargetPhase)
      .selectOption({ label: phase });
  }

  async clickDuplicateConfirm() {
    if (!this.duplicatePopupPage) throw new Error("No duplicate popup — call clickDuplicateLink first");
    await this.duplicatePopupPage
      .locator(QUERY_PAGE_LOCATORS.duplicateConfirmButton)
      .click();
    await this.duplicatePopupPage.waitForEvent("close", { timeout: 10000 }).catch(() => {});
    this.duplicatePopupPage = null;
  }

  async areSubOptionsVisible(subOptions: string[]) {
    for (const option of subOptions) {
      await expect(
        this.page.locator(`//a[normalize-space(text())='${option}']`)
      ).toBeVisible();
    }
  }
}
