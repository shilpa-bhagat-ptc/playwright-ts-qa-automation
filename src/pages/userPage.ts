import { Page, expect } from "@playwright/test";
import { USER_PAGE_LOCATORS } from "../locators/userPage.locators";

// Helper: wait for "load" first (fast), then a short capped networkidle.
// The QALink app has long-running background XHRs that never settle, so a long
// networkidle wait causes test timeouts. 5s is plenty for the actual page transition.
async function waitForPageReady(page: Page) {
  await page.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
}

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

  async clickUserTab() {
    await this.page.locator(USER_PAGE_LOCATORS.userTab).click();
    await waitForPageReady(this.page);
  }

  // Fixture lands on /jsp/user/index.jsp, so sub-tabs are already visible —
  // just click the sub-tab directly.
  async navigateToMyWeeklyGoal() {
    await this.page.locator(USER_PAGE_LOCATORS.myWeeklyGoalTab).click();
    await waitForPageReady(this.page);
  }

  async navigateToMyProfile() {
    await this.page.locator(USER_PAGE_LOCATORS.myProfileTab).click();
    await waitForPageReady(this.page);
  }

  async navigateToMyTasks() {
    await this.page.locator(USER_PAGE_LOCATORS.myTasksTab).click();
    await waitForPageReady(this.page);
  }

  async navigateToResource() {
    await this.page.locator(USER_PAGE_LOCATORS.resourceTab).click();
    await waitForPageReady(this.page);
  }

  async navigateToNonTestingResource() {
    await this.page.locator(USER_PAGE_LOCATORS.nonTestingResourceTab).click();
    await waitForPageReady(this.page);
  }

  async clickLoadTasks() {
    await this.page.locator(USER_PAGE_LOCATORS.loadTasksButton).click();
    await waitForPageReady(this.page);
  }

  async openAddSprPopup(): Promise<Page> {
    const popupPromise = this.page.waitForEvent("popup", { timeout: 10000 });
    await this.page
      .locator(USER_PAGE_LOCATORS.addSprVerificationTaskLink)
      .click();
    const popup = await popupPromise;
    await popup.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
    return popup;
  }

  async clickEditMyProfile() {
    await this.page.locator(USER_PAGE_LOCATORS.editMyProfileButton).click();
    await waitForPageReady(this.page);
  }

  async clickLoadDetails() {
    await this.page.locator(USER_PAGE_LOCATORS.loadDetailsButton).click();
    await waitForPageReady(this.page);
  }

  async clickNonTestingLoad() {
    await this.page.locator(USER_PAGE_LOCATORS.nonTestingLoadButton).click();
    await waitForPageReady(this.page);
  }
}
