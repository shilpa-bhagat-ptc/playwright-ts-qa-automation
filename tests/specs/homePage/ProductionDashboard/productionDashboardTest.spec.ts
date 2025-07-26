import commonProperties from "../../../../src/locale/commonProperties.json";
import { HOME_PAGE_LOCATORS } from "../../../../src/locators/homePage.locators";
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
import { PRODUCTION_DASHBOARD_HEADERS } from "../../../../src/utils/testDataGenerator";
import { expect, test } from "../../../fixtures/fixture";

test("TC_HOM_004 - Validate the Production Dashboard Functionality", async ({
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

  await homePage.waitForDashboardData();
  console.log("📊 Dashboard data loaded successfully.");

  await captureStepScreenshot(page, testInfo, "04_load_dashboard");

  console.log("📋 Validating table headers...");

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

  await page.close();
  console.log("✅ TC_HOM_004 completed successfully.");
});

test("TC_HOM_005 - Validate the update Production Dashboard Functionality", async ({
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

  await homePage.waitForDashboardData();

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

  console.log("🎉 ✅ TC_HOM_005 completed successfully.");
});
