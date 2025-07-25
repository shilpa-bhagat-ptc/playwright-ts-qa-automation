"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
const test_1 = require("@playwright/test");
const homePage_locators_1 = require("../locators/homePage.locators");
class HomePage {
    page;
    constructor(page) {
        this.page = page;
    }
    async waitForHomePageLoaded() {
        await this.page.waitForLoadState("networkidle");
    }
    async navigateToWeeklyNoteTab() {
        console.log("Navigating to Weekly Note tab...");
        await this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.weeklyNoteTab).click();
    }
    async verifyWeeklyNoteTabVisible() {
        await (0, test_1.expect)(this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.weeklyNoteText)).toBeVisible({ timeout: 10000 });
    }
    async openCalendar() {
        await this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.clickOnCalendar).click();
        await (0, test_1.expect)(this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.clickOnCalendar)).toBeVisible();
    }
    async clickOnCalendar() {
        console.log("🗓️ Clicking on calendar input...");
        await this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.clickOnCalendar).click();
    }
    async selectDateFromCalendar(day) {
        console.log("🗓️ Clicking on calendar input...");
        await this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.startDate).click();
        console.log("📅 Waiting for calendar to be visible...");
        await this.page
            .locator("div.datepicker-days")
            .waitFor({ state: "visible" });
        console.log(`🗓️ Selecting day ${day} from calendar...`);
        await this.page
            .locator(`//td[contains(@class, 'day') and not(contains(@class, 'old')) and text()='${day}']`)
            .click();
    }
    async verifyDateIsSet(expectedDate) {
        await (0, test_1.expect)(this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.startDate)).toHaveValue(expectedDate);
    }
    async clickWeeklyNoteButtonAndWait() {
        await Promise.all([
            this.page.waitForLoadState("networkidle"),
            this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.weeklyNoteButton).click(),
        ]);
    }
    async selectReleaseOption(releaseLabel) {
        await this.page.waitForSelector(homePage_locators_1.HOME_PAGE_LOCATORS.selectRelease);
        await this.page.selectOption(homePage_locators_1.HOME_PAGE_LOCATORS.selectRelease, {
            label: releaseLabel,
        });
    }
    async selectProjectManager(managerLabel) {
        await this.page.waitForSelector(homePage_locators_1.HOME_PAGE_LOCATORS.selectManager);
        await this.page.selectOption(homePage_locators_1.HOME_PAGE_LOCATORS.selectManager, {
            label: managerLabel,
        });
    }
    async verifyWeeklyNoteButtonVisible() {
        await (0, test_1.expect)(this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.weeklyNoteButton)).toBeVisible();
    }
    //Production Dashboard Methods
    async clickProductionDashboardTab() {
        await this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.productionDashboardTab).click();
    }
    async setDateRange(fromDate, toDate) {
        console.log("📅 Setting 'From' date...");
        await this.page.evaluate((date) => {
            const input = document.querySelector('input[name="period_from"]');
            if (input) {
                input.value = "";
                input.value = date;
                input.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }, fromDate);
        console.log("📅 Setting 'To' date...");
        await this.page.evaluate((date) => {
            const input = document.querySelector('input[name="period_to"]');
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
            .locator(homePage_locators_1.HOME_PAGE_LOCATORS.productionDashboardLoadButton)
            .waitFor({ state: "visible" });
        await this.page
            .locator(homePage_locators_1.HOME_PAGE_LOCATORS.productionDashboardLoadButton)
            .click();
    }
    async waitForDashboardData() {
        await this.page.waitForSelector(homePage_locators_1.HOME_PAGE_LOCATORS.productionDashboardTableRow, { timeout: 10000 });
    }
    async getTextValuesFromHeader(selector) {
        const elements = this.page.locator(selector);
        const count = await elements.count();
        const values = [];
        for (let i = 0; i < count; i++) {
            const text = await elements.nth(i).innerText();
            values.push(text.trim());
        }
        return values;
    }
    async selectDropdownValueById(prefix, rowId, valueToSelect) {
        const dropdownId = `${prefix}${rowId}`;
        const dropdown = this.page.locator(`select#${dropdownId}`);
        await dropdown.selectOption({ label: valueToSelect });
    }
    async enableFilterCheckbox() {
        const checkbox = this.page.locator("#prod_dashboard_table_filter");
        if (!(await checkbox.isChecked())) {
            await checkbox.check();
        }
    }
    async toggleEnableFilterCheckbox(enable) {
        const checkbox = this.page.locator('//input[@id="prod_dashboard_table_filter"]');
        await checkbox.waitFor({ state: "visible", timeout: 5000 });
        const isChecked = await checkbox.isChecked();
        if (enable !== isChecked) {
            await checkbox.click();
            console.log(`☑️ Checkbox toggled to: ${enable}`);
        }
        else {
            console.log(`⚠️ Checkbox already in desired state: ${enable}`);
        }
    }
    async selectByVisibleText(page, selector, visibleText) {
        await page.selectOption(selector, { label: visibleText });
    }
    async safeClick(locator) {
        await locator.waitFor({ state: "visible" });
        await locator.scrollIntoViewIfNeeded();
        await (0, test_1.expect)(locator).toBeVisible();
        await locator.click();
    }
    async handleBrowserConfirmationPopup(expectedText) {
        this.page.once("dialog", async (dialog) => {
            const message = dialog.message();
            console.log(`🔔 Dialog detected: ${message}`);
            if (!expectedText || message.includes(expectedText)) {
                await dialog.accept();
                console.log("✅ Dialog accepted");
            }
            else {
                await dialog.dismiss();
                console.warn("⚠️ Dialog dismissed (text mismatch)");
            }
        });
    }
    async enterTextInRichTextIframe(noteText) {
        const iframeElement = this.page.frameLocator("iframe.ke-edit-iframe");
        const editorBody = iframeElement.locator("body.ke-content");
        await editorBody.waitFor({ state: "visible" });
        await editorBody.click();
        await editorBody.fill(noteText);
        await editorBody.press("Control+A");
    }
    async navigateToWeeklyEditorTab() {
        await this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.weeklyEditorTab).click();
    }
    async clickSaveWeeklyNoteButton() {
        return this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.saveWeeklyNoteButton).click();
    }
    async enterTextInTextArea(note) {
        await this.page.locator(homePage_locators_1.HOME_PAGE_LOCATORS.editorTextArea).fill(note);
    }
    async clickDateFromCalendar(day) {
        // Open calendar first (click the Week begins input field);
        await this.page.locator('#weeklyNoteEditorForm input[type="text"]').click(); // Adjust selector if needed
        // Wait for calendar popup to be visible
        const dateCell = this.page.locator(`//td[contains(@class, 'day') and text()="${parseInt(day)}"]`);
        await (0, test_1.expect)(dateCell).toBeVisible({ timeout: 5000 });
        // Click on the date
        await dateCell.click();
    }
    async goToTipsSection() {
        await this.page.click("text=Installation Tips");
    }
    async editTip(tipTitle) {
        const editIcon = this.page.locator(`img[alt="Edit the tip - ${tipTitle}"]`);
        await editIcon.click();
    }
    async updateTipContent(newContent) {
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
exports.HomePage = HomePage;
