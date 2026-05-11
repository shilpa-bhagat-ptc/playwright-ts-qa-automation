import commonProperties from "../../../../src/locale/commonProperties.json";
import { HOME_PAGE_LOCATORS } from "../../../../src/locators/homePage.locators";
import { LoginPage } from "../../../../src/pages/LoginPage";
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
import { TestDataGenerator } from "../../../../src/utils/testDataGenerator";
import { expect, test } from "../../../fixtures/fixture";

test("TC_HOM_001 - Verify Home Tab Navigation and Content", async ({
  loginPage,
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description: "valid login functionality @owner:Shilpa Bhagat",
  });

  console.log("Navigating to login pageb...");
  console.log("Logging in with valid credentials...");
  await captureStepScreenshot(page, testInfo, "Login with valid credentials");
  console.log("Verifying successful login...");
  await homePage.waitForHomePageLoaded();
  console.log("Navigating to Home Page...");
  await expect(page.locator(HOME_PAGE_LOCATORS.weeklyNoteTab)).toBeVisible({ timeout: 15000 });
  console.log("TC_HOM_001 completed successfully.");
});

test("TC_HOM_002 - Invalid login using Faker-generated credentials", async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      TestDataGenerator.username(),
      TestDataGenerator.password()
    );

    console.log(" Attempting to log in with invalid credentials...");
    const errorMessage = page.locator("text=Login Incorrect!");
    await expect(errorMessage).toBeVisible();
    console.log("TC_HOM_002 completed successfully.");
  } finally {
    await context.close();
  }
});

test("TC_HOM_003 - Verify Weekly Note Functionality", async ({
  loginPage,
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Tests navigation, calendar selection, and weekly note handling on Home tab. @owner:Shilpa Bhagat",
  });

  console.log(" Navigating to Weekly Note tab...");
  await homePage.navigateToWeeklyNoteTab();

  console.log(" Verifying Weekly Note tab is visible...");
  await homePage.verifyWeeklyNoteTabVisible();
  await captureStepScreenshot(page, testInfo, "03_click-weekly-note-tab");

  console.log(" Checking if Weekly Note tab is visible...");
  const weeklyNoteTabHeader = await page
    .locator(HOME_PAGE_LOCATORS.weeklyNoteTab)
    .isVisible();
  expect(weeklyNoteTabHeader).toBeTruthy();

  await captureStepScreenshot(page, testInfo, "04_open-calendar");

  console.log(` Selecting date: ${commonProperties.dateFormat.date}`);
  await homePage.selectDateFromCalendar(commonProperties.dateFormat.date);
  await captureStepScreenshot(page, testInfo, "05_select-date");

  console.log(" Verifying selected date in calendar input...");
  const selectedDateValue = await page.inputValue(
    HOME_PAGE_LOCATORS.clickOnCalendar
  );
  expect(selectedDateValue).toBe(commonProperties.dateFormat.fulldate);

  console.log(" Clicking Weekly Note button and waiting for data...");
  await homePage.clickWeeklyNoteButtonAndWait();
  await captureStepScreenshot(page, testInfo, "06_click-weekly-note-btn");

  console.log(
    ` Selecting release option: ${commonProperties.weeklyRelease.ALD}`
  );
  await homePage.selectReleaseOption(commonProperties.weeklyRelease.ALD);
  await captureStepScreenshot(page, testInfo, "07_select-release");

  console.log(
    ` Selecting project manager: ${commonProperties.projectManagers.Gadge_Praful}`
  );
  await page.waitForSelector(HOME_PAGE_LOCATORS.selectManager, {
    state: "visible",
    timeout: 50000,
  });

  await homePage.selectProjectManager(
    commonProperties.projectManagers.Gadge_Praful
  );
  await captureStepScreenshot(page, testInfo, "08_select-project-manager");

  console.log(" Verifying weekly data is displayed after release+manager selection (manual case 1 step 5)...");
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  const bodyText = (await page.locator("body").textContent()) ?? "";
  expect(
    /Priority/i.test(bodyText),
    "expected 'Priority' heading/label to appear in weekly data",
  ).toBeTruthy();
  expect(
    /Status/i.test(bodyText),
    "expected 'Status' heading/label to appear in weekly data",
  ).toBeTruthy();
  const linkCount = await page.locator("a[href]").count();
  console.log(`  Page contains ${linkCount} hyperlinks total.`);
  expect(linkCount, "expected hyperlinks to be present on weekly note page").toBeGreaterThan(0);

  console.log("TC_HOM_003 completed successfully.");
});
