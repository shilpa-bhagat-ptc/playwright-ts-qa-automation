//import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
// Update the import path to the correct location of your fixture file
import { captureStepScreenshot } from "../../src/utils/screenshotHelper";
import { expect, test } from "../fixtures/fixture";
// Add the following import or definition for HOME_PAGE_LOCATORS
import commonProperties from "../../src/locale/commonProperties.json";
import { HOME_PAGE_LOCATORS } from "../../src/locators/homePage.locators";

import {
  PRODUCTION_DASHBOARD_HEADERS,
  TestDataGenerator,
} from "../../src/utils/testDataGenerator";
import { LoginPage } from "../../src/pages/LoginPage";

test("TC_HOM_001 - Verify Home Tab Navigation and Content", async ({
  loginPage,
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description: "valid login functionality @owner:Shilpa Bhagat",
  });

  console.log("➡ Navigating to login pageb...");
  await loginPage.navigate;
  console.log("➡ Logging in with valid credentials...");
  await captureStepScreenshot(page, testInfo, "Login with valid credentials");
  console.log("➡ Verifying successful login...");
  await homePage.waitForHomePageLoaded();
  console.log("➡ Navigating to Home Page...");
});

test("TC_HOM_004 - Verify Weekly Note Functionality", async ({
  loginPage,
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Tests navigation, calendar selection, and weekly note handling on Home tab. @owner:Shilpa Bhagat",
  });

  console.log("➡ Navigating to Weekly Note tab...");
  await homePage.navigateToWeeklyNoteTab();

  console.log("✅ Verifying Weekly Note tab is visible...");
  await homePage.verifyWeeklyNoteTabVisible();
  await captureStepScreenshot(page, testInfo, "03_click-weekly-note-tab");

  console.log("🔍 Checking if Weekly Note tab is visible...");
  const weeklyNoteTabHeader = await page
    .locator(HOME_PAGE_LOCATORS.weeklyNoteTab)
    .isVisible();
  expect(weeklyNoteTabHeader).toBeTruthy();

  console.log("📅 Opening calendar...");
  await homePage.openCalendar();
  await captureStepScreenshot(page, testInfo, "04_open-calendar");

  console.log(`🗓️ Selecting date: ${commonProperties.dateFormat.date}`);
  await homePage.selectDateFromCalendar(commonProperties.dateFormat.date);
  await captureStepScreenshot(page, testInfo, "05_select-date");

  console.log("📅 Verifying selected date in calendar input...");
  const selectedDateValue = await page.inputValue(
    HOME_PAGE_LOCATORS.clickOnCalendar
  );
  expect(selectedDateValue).toBe(commonProperties.dateFormat.fulldate);

  console.log("📝 Clicking Weekly Note button and waiting for data...");
  await homePage.clickWeeklyNoteButtonAndWait();
  await captureStepScreenshot(page, testInfo, "06_click-weekly-note-btn");

  console.log(
    `📦 Selecting release option: ${commonProperties.weeklyRelease.ALD}`
  );
  await homePage.selectReleaseOption(commonProperties.weeklyRelease.ALD);
  await captureStepScreenshot(page, testInfo, "07_select-release");

  console.log(
    `👨‍💼 Selecting project manager: ${commonProperties.projectManagers.Gadge_Praful}`
  );
  await page.waitForSelector(HOME_PAGE_LOCATORS.selectManager, {
    state: "visible",
    timeout: 50000,
  });

  await homePage.selectProjectManager(
    commonProperties.projectManagers.Gadge_Praful
  );
  await captureStepScreenshot(page, testInfo, "08_select-project-manager");

  console.log("✅ TC_HOM_001 completed successfully.");
});

test("TC_HOM_002 - Validate the Production Dashboard Functionality", async ({
  loginPage,
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Validate filters and table layout in Production Dashboard. @owner:Shilpa Bhagat",
  });
  await expect(
    page.locator(HOME_PAGE_LOCATORS.productionDashboardTab)
  ).toBeVisible({ timeout: 1000 });
  await homePage.clickProductionDashboardTab();
  console.log("✅ Clicked on Production Dashboard tab.");

  // 🔄 Wait until tab is visible

  console.log("📌 Production Dashboard tab is visible.");

  await captureStepScreenshot(page, testInfo, "02_open_production_dashboard");

  await homePage.setDateRange(
    commonProperties.ProductionDashboard.Production_StartDate,
    commonProperties.ProductionDashboard.Production_EndDate
  );
  console.log("📅 Set production start and end dates.");

  await captureStepScreenshot(page, testInfo, "03_set_dates");

  console.log("🔄 Clicking 'Load Production Dashboard' button...");
  await homePage.clickLoadDashboard();

  // 🕐 Wait for dashboard table or some element that signifies data is ready
  await homePage.waitForDashboardData();
  console.log("📊 Dashboard data loaded successfully.");

  await captureStepScreenshot(page, testInfo, "04_load_dashboard");

  console.log("📋 Validating table headers...");

  // ⏳ Ensure headers are visible before grabbing them
  await expect(page.locator(HOME_PAGE_LOCATORS.dashboardheaders)).toHaveCount(
    PRODUCTION_DASHBOARD_HEADERS.length,
    { timeout: 1000 }
  );

  const actualHeaders = await homePage.getTextValuesFromHeader(
    HOME_PAGE_LOCATORS.dashboardheaders
  );
  const expectedHeaders = PRODUCTION_DASHBOARD_HEADERS;

  console.log("✅ Actual Headers:", actualHeaders);
  console.log("🧾 Expected Headers:", expectedHeaders);

  await captureStepScreenshot(page, testInfo, "05_validate-headers");

  expect(actualHeaders).toEqual(expectedHeaders);

  console.log("🎉 TC_HOM_002 completed successfully.");
  await page.close();
});

test("TC_HOM_003 - Validate the update Production Dashboard Functionality", async ({
  loginPage,
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Validates dropdowns, and data grid of Production Dashboard tab. @owner:Shilpa Bhagat",
  });

  console.log("➡ Navigating to Production Dashboard tab...");
  await homePage.clickProductionDashboardTab();

  await captureStepScreenshot(page, testInfo, "01_production_dashboard_tab");

  console.log("📅 Setting date range...");
  await homePage.setDateRange(
    commonProperties.ProductionDashboard.Production_StartDate,
    commonProperties.ProductionDashboard.Production_EndDate
  );
  await captureStepScreenshot(page, testInfo, "02_date_range_set");

  console.log("🔄 Loading dashboard...");
  await homePage.clickLoadDashboard();

  // 🔁 Add custom wait for data or spinner to disappear
  await homePage.waitForDashboardData(); // If implemented as discussed before

  // ✅ Confirm dashboard table is visible
  await expect(page.locator("//table[@id='prod_dashboard']")).toBeVisible({
    timeout: 50000,
  });
  await captureStepScreenshot(page, testInfo, "03_dashboard_loaded");

  console.log("📂 Selecting translation status...");
  await expect(
    page.locator(HOME_PAGE_LOCATORS.translationStatusdropdown)
  ).toBeVisible({ timeout: 5000 });
  await page.locator(HOME_PAGE_LOCATORS.translationStatusdropdown).click();
  await page
    .locator(HOME_PAGE_LOCATORS.translationStatusdropdown)
    .selectOption({ label: "Plan" });
  await captureStepScreenshot(page, testInfo, "04_translation_status_selected");

  console.log("⚠ Handling confirmation popup (if any)...");
  await homePage.handleBrowserConfirmationPopup();
  await captureStepScreenshot(page, testInfo, "05_confirmation_handled");

  console.log("📝 Clicking editor...");
  await expect(page.locator(HOME_PAGE_LOCATORS.prodEditor)).toBeVisible({
    timeout: 5000,
  });
  await page.locator(HOME_PAGE_LOCATORS.prodEditor).click();
  await captureStepScreenshot(page, testInfo, "06_editor_clicked");

  console.log("✍ Entering text in rich text editor...");
  await homePage.enterTextInRichTextIframe(
    commonProperties.editorText.editorText
  );
  await captureStepScreenshot(page, testInfo, "07_editor_text_entered");

  console.log("🔍 Verifying editor text...");
  const iframe = page.frameLocator("iframe.ke-edit-iframe");
  await expect(
    iframe.locator("body", {
      hasText: commonProperties.editorText.editorText,
    })
  ).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "08_editor_text_verified");

  console.log("💾 Clicking save button...");
  await expect(page.locator(HOME_PAGE_LOCATORS.prodSaveButton)).toBeVisible({
    timeout: 5000,
  });
  await page.locator(HOME_PAGE_LOCATORS.prodSaveButton).click();
  await captureStepScreenshot(page, testInfo, "09_save_button_clicked");

  console.log("🎉 ✅ TC_HOM_003 completed successfully.");
});

test("TC_HOME004 - Invalid login using Faker-generated credentials", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(
    TestDataGenerator.username(),
    TestDataGenerator.password()
  );

  console.log("🔐 Attempting to log in with invalid credentials...");
  const errorMessage = page.locator("text=Login Incorrect!");
  await expect(errorMessage).toBeVisible();
});

test("TC_HOME005 - Verify Weekly Note Editor Functionality", async ({
  loginPage,
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Validates that notes can be created and saved using the Weekly Note Editor. @owner:Shilpa Bhagat",
  });
  console.log("➡ Navigating to Weekly Note Editor tab...");
  await homePage.navigateToWeeklyEditorTab();

  console.log("✅ Verifying Weekly Note Editor tab is visible...");
  await homePage.verifyWeeklyNoteTabVisible();

  console.log("📸 Capturing screenshot after Weekly Note Editor tab click...");
  await captureStepScreenshot(page, testInfo, "01_click-weekly-note-tab");

  console.log("🗓️ Opening calendar...");
  await homePage.openCalendar();

  console.log(
    `📅 Clicking date from calendar: ${commonProperties.editorDate.Date}`
  );
  await homePage.clickDateFromCalendar(commonProperties.editorDate.Date);

  console.log("🟡 Clicking Load Weekly Note and waiting...");
  await homePage.clickWeeklyNoteButtonAndWait();

  console.log(
    `✏️ Entering weekly note text: "${commonProperties.editorText.enterText}"`
  );
  await homePage.enterTextInTextArea(commonProperties.editorText.enterText);

  console.log("📸 Capturing screenshot after filling text...");
  await captureStepScreenshot(page, testInfo, "02_fill-weekly-note");

  console.log("💾 Clicking Save Weekly Note...");
  await homePage.clickSaveWeeklyNoteButton();

  console.log("📸 Capturing screenshot after saving note...");
  await captureStepScreenshot(page, testInfo, "03_save-weekly-note");

  console.log("🔁 Navigating to Weekly Note tab...");
  await homePage.navigateToWeeklyNoteTab();

  console.log("📸 Capturing screenshot after navigating to Weekly Note tab...");
  await captureStepScreenshot(page, testInfo, "04_navigate-weekly-note");

  console.log("🔍 Verifying current URL contains 'weekly_note.jsp'...");
  await expect(page).toHaveURL(/.*weekly_note\.jsp.*/);

  console.log("🔍 Verifying 'Load Weekly Note' button is visible...");
  await expect(page.locator("text=Load Weekly Note")).toBeVisible();

  console.log("🔍 Verifying selected date value is correct...");
  await expect(page.locator("input[name='StartDate']")).toHaveValue(
    "07/20/2025"
  );

  console.log("✅ Weekly Note Editor functionality verified.");
});

test("TC-HOM006 - Validate Tips Tab Links and Category Section", async ({
  loginPage,
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Validate all visible tip links and the Tips Category section. @owner:Shilpa Bhagat",
  });

  console.log("📁 Navigating to Tips tab...");
  await page.click(HOME_PAGE_LOCATORS.tip);
  await captureStepScreenshot(page, testInfo, "01_tips_tab_clicked");

  console.log('🔍 Verifying "Tips Category" section is visible...');
  await expect(page.locator(HOME_PAGE_LOCATORS.tipsCategory)).toBeVisible();
  await captureStepScreenshot(page, testInfo, "02_tips_category_visible");

  console.log("🔗 Checking all visible tip links...");
  const tipLinks = page.locator(HOME_PAGE_LOCATORS.tipLinks);
  const linkCount = await tipLinks.count();
  expect(linkCount).toBeGreaterThan(0);
  await captureStepScreenshot(page, testInfo, "03_tip_links_detected");

  for (let i = 0; i < linkCount; i++) {
    const link = tipLinks.nth(i);
    const linkText = await link.innerText();
    const href = await link.getAttribute("href");

    console.log(`🔗 Found link: ${linkText.trim()} => ${href}`);
    expect(href).toContain("tips.jsp?action=list&category=");
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /category_id=\d+/);
  }

  await captureStepScreenshot(page, testInfo, "04_all_links_validated");

  console.log("✅ All tips links validated successfully.");
});

test("TC-HOM007 - Validate Installation Tips and associated Edit/Delete icons", async ({
  loginPage,
  homePage,
  page,
}) => {
  await page.click(HOME_PAGE_LOCATORS.tip);

  const installationTipsLink = page.locator("a", {
    hasText: "Installation Tips",
  });
  await expect(installationTipsLink).toBeVisible();
  await installationTipsLink.click();

  // Step 3: Validate tips
  const tips = TestDataGenerator.installationTips();

  for (const tip of tips) {
    console.log(`🔍 Validating tip: "${tip}"`);

    // Get row that contains the tip
    const tipRow = page.locator(HOME_PAGE_LOCATORS.tipRowByTipText(tip));
    await expect(tipRow).toBeVisible();

    // Use direct locator relative to that row
    const editIcon = page.locator(HOME_PAGE_LOCATORS.editIconByTip(tip));
    await expect(editIcon).toBeVisible();
    console.log(`✅ Edit icon is visible for "${tip}"`);

    // Directly locate Delete icon by alt attribute
    const deleteIcon = page.locator(HOME_PAGE_LOCATORS.deleteIconByTip(tip));
    await expect(deleteIcon).toBeVisible();
    console.log(`✅ Delete icon is visible for "${tip}"`);
  }
});

test("TC-HOM008 - Edit tip and verify updated datetime", async ({
  page,
  context,
  homePage,
}) => {
  await page.click(HOME_PAGE_LOCATORS.tip);
  await homePage.goToTipsSection();

  console.log("🔍 Navigated to Tips section");

  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    homePage.editTip(commonProperties.tips.enterText),
  ]);

  console.log("🪟 Popup window opened for tip editing");
  await popup.screenshot({ path: "screenshots/tip-edit-popup-opened.png" });

  await expect(popup.locator("h3")).toHaveText(commonProperties.tips.tipUpdate);
  console.log("✅ Tips Update title verified");

  await expect(popup.locator('input[name="title"]')).toHaveValue(
    commonProperties.tips.tipTitle
  );
  console.log("✅ Title field validated");

  await popup
    .frameLocator("iframe.ke-edit-iframe")
    .locator("body")
    .fill(commonProperties.tips.tipUpdateText + new Date().toLocaleString());
  console.log("📝 Note updated inside editor");

  await popup.screenshot({ path: "screenshots/tip-edit-filled.png" });

  await popup.locator(HOME_PAGE_LOCATORS.submit).click();
  console.log("✅ Submit button clicked");

  await homePage.goToTipsSection();
  console.log("🔄 Returned to Tips section after submission");

  await page.screenshot({ path: "screenshots/tips-after-update.png" });
});
