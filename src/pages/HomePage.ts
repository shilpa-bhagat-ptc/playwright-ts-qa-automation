import { expect, Locator, Page } from "@playwright/test";
import { HOME_PAGE_LOCATORS } from "../locators/homePage.locators";

export class HomePage {
  constructor(private page: Page) {}

  async waitForHomePageLoaded() {
    await this.page.waitForLoadState("networkidle");
  }

  async navigateToWeeklyNoteTab() {
    console.log("Navigating to Weekly Note tab...");
    await this.page.locator(HOME_PAGE_LOCATORS.weeklyNoteTab).click();
  }

  async verifyWeeklyNoteTabVisible() {
    await expect(
      this.page.locator(HOME_PAGE_LOCATORS.weeklyNoteText)
    ).toBeVisible({ timeout: 10000 });
  }

  async openCalendar() {
    await this.page.locator(HOME_PAGE_LOCATORS.clickOnCalendar).click();
    await expect(
      this.page.locator(HOME_PAGE_LOCATORS.clickOnCalendar)
    ).toBeVisible();
  }

  async clickOnCalendar() {
    console.log("Clicking on calendar input...");
    await this.page.locator(HOME_PAGE_LOCATORS.clickOnCalendar).click();
  }

  async selectDateFromCalendar(day: string) {
    console.log("Clicking on calendar input...");
    await this.page.locator(HOME_PAGE_LOCATORS.startDate).click();

    console.log("Waiting for calendar to be visible...");
    await this.page
      .locator("div.datepicker-days")
      .waitFor({ state: "visible" });

    console.log(`Selecting day ${day} from calendar...`);
    await this.page
      .locator(
        `//td[contains(@class, 'day') and not(contains(@class, 'old')) and text()='${day}']`
      )
      .click();
  }

  async verifyDateIsSet(expectedDate: string) {
    await expect(this.page.locator(HOME_PAGE_LOCATORS.startDate)).toHaveValue(
      expectedDate
    );
  }

  async clickWeeklyNoteButtonAndWait() {
    await Promise.all([
      this.page.waitForLoadState("networkidle"),
      this.page.locator(HOME_PAGE_LOCATORS.weeklyNoteButton).click(),
    ]);
  }

  async selectReleaseOption(releaseLabel: string) {
    await this.page.waitForSelector(HOME_PAGE_LOCATORS.selectRelease);
    await this.page.selectOption(HOME_PAGE_LOCATORS.selectRelease, {
      label: releaseLabel,
    });
  }

  async selectProjectManager(managerLabel: string) {
    await this.page.waitForSelector(HOME_PAGE_LOCATORS.selectManager);
    await this.page.selectOption(HOME_PAGE_LOCATORS.selectManager, {
      label: managerLabel,
    });
  }

  async verifyWeeklyNoteButtonVisible() {
    await expect(
      this.page.locator(HOME_PAGE_LOCATORS.weeklyNoteButton)
    ).toBeVisible();
  }

  //Production Dashboard Methods
  async clickProductionDashboardTab() {
    await this.page.locator(HOME_PAGE_LOCATORS.productionDashboardTab).click();
  }

  async setDateRange(fromDate: string, toDate: string) {
    console.log("Setting 'From' date...");
    await this.page.evaluate((date) => {
      const input = document.querySelector<HTMLInputElement>(
        'input[name="period_from"]'
      );
      if (input) {
        input.value = "";
        input.value = date;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, fromDate);

    console.log("Setting 'To' date...");
    await this.page.evaluate((date) => {
      const input = document.querySelector<HTMLInputElement>(
        'input[name="period_to"]'
      );
      if (input) {
        input.value = "";
        input.value = date;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, toDate);

    await this.page.waitForTimeout(500);
  }

  async clickLoadDashboard() {
    await this.page
      .locator(HOME_PAGE_LOCATORS.productionDashboardLoadButton)
      .waitFor({ state: "visible" });

    await this.page
      .locator(HOME_PAGE_LOCATORS.productionDashboardLoadButton)
      .click();
  }

  async waitForDashboardData() {
    await this.page.waitForSelector(
      HOME_PAGE_LOCATORS.productionDashboardTableRow,
      { timeout: 10000 }
    );
  }

  async getTextValuesFromHeader(selector: string): Promise<string[]> {
    const elements = this.page.locator(selector);
    const count = await elements.count();

    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await elements.nth(i).innerText();
      values.push(text.trim());
    }

    return values;
  }

  async selectDropdownValueById(
    prefix: string,
    rowId: string,
    valueToSelect: string
  ) {
    const dropdownId = `${prefix}${rowId}`;
    const dropdown = this.page.locator(`select#${dropdownId}`);
    await dropdown.selectOption({ label: valueToSelect });
  }

  async enableFilterCheckbox(): Promise<void> {
    const checkbox = this.page.locator("#prod_dashboard_table_filter");
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
  }
  async toggleEnableFilterCheckbox(enable: boolean) {
    const checkbox = this.page.locator(
      '//input[@id="prod_dashboard_table_filter"]'
    );

    await checkbox.waitFor({ state: "visible", timeout: 5000 });

    const isChecked = await checkbox.isChecked();

    if (enable !== isChecked) {
      await checkbox.click();
      console.log(`Checkbox toggled to: ${enable}`);
    } else {
      console.log(`Checkbox already in desired state: ${enable}`);
    }
  }

  async selectByVisibleText(page: Page, selector: string, visibleText: string) {
    await page.selectOption(selector, { label: visibleText });
  }
  async safeClick(locator: Locator) {
    await locator.waitFor({ state: "visible" });
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible();
    await locator.click();
  }

  async handleBrowserConfirmationPopup(expectedText?: string) {
    this.page.once("dialog", async (dialog) => {
      const message = dialog.message();
      console.log(`🔔 Dialog detected: ${message}`);

      if (!expectedText || message.includes(expectedText)) {
        await dialog.accept();
        console.log("✅ Dialog accepted");
      } else {
        await dialog.dismiss();
        console.warn("Dialog dismissed (text mismatch)");
      }
    });
  }
  async enterTextInRichTextIframe(noteText: string) {
    const iframeElement = this.page.frameLocator("iframe.ke-edit-iframe");
    const editorBody = iframeElement.locator("body.ke-content");
    await editorBody.waitFor({ state: "visible" });
    await editorBody.click();
    await editorBody.fill(noteText);
    await editorBody.press("Control+A");
  }

  async navigateToWeeklyEditorTab() {
    await this.page.locator(HOME_PAGE_LOCATORS.weeklyEditorTab).click();
  }
  async clickSaveWeeklyNoteButton() {
    return this.page.locator(HOME_PAGE_LOCATORS.saveWeeklyNoteButton).click();
  }
  async enterTextInTextArea(note: string) {
    await this.page.locator(HOME_PAGE_LOCATORS.editorTextArea).fill(note);
  }
  async clickDateFromCalendar(day: string) {
    // Open calendar first (click the Week begins input field);
    await this.page.locator('input[name="StartDate"]').click(); // Adjust selector if needed

    // Wait for calendar popup to be visible
    const dateCell = this.page.locator(
      `//td[contains(@class, 'day') and text()="${parseInt(day)}"]`
    );
    await expect(dateCell).toBeVisible({ timeout: 5000 });

    // Click on the date
    await dateCell.click();
  }
  async goToTipsSection() {
    await this.page.click("text=Installation Tips");
  }

  async editTip(tipTitle: string) {
    const editIcon = this.page.locator(`img[alt="Edit the tip - ${tipTitle}"]`);
    await editIcon.click();
  }

  async updateTipContent(newContent: string) {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      // Submit opens new window
    ]);

    await newPage.waitForLoadState("domcontentloaded");
    await newPage.locator("//body[@class='ke-content']").fill(newContent);
    await newPage.click('input[type="submit"][name="add"]');
    await newPage.close();
  }
}
