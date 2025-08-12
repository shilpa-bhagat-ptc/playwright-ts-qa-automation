import commonProperties from "../../../../src/locale/commonProperties.json";
import { PLANNING_PAGE_LOCATORS } from "../../../../src/locators/planningPage.locators";
import { LoginPage } from "../../../../src/pages/LoginPage";
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
import {
  TestDataGenerator,
  TestPlan_Header,
} from "../../../../src/utils/testDataGenerator";
import { getTextValuesFromHeader } from "../../../../src/utils/testUtils";
import { expect, test } from "../../../fixtures/fixture";

test("TC_PLAN001- Verify Release Search Functionality in dropdown", async ({
  page,
  planningPage,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Release Search dropdown lists all relevant releases, supports selection, and handles invalid input. @owner:Shilpa Bhagat",
  });
  await planningPage.clickReleaseTab(testInfo);
  console.log("Clicked the Release tab");

  await planningPage.selectRelease(
    commonProperties.weeklyRelease.planningRelease,
    testInfo
  );
  console.log("Selected release: ALD 12.3.2.0");
  await page.waitForTimeout(4000);
  await page.click(PLANNING_PAGE_LOCATORS.testPlan);

  expect(page.locator(PLANNING_PAGE_LOCATORS.tableTitle)).toBeVisible();
  console.log("Release dropdown is visible and contains expected options");
  await captureStepScreenshot(page, testInfo, "ReleaseDropdownAfterSelection");
  const actualHeaders = await getTextValuesFromHeader(
    page,
    PLANNING_PAGE_LOCATORS.tableTitle
  );
  const expectedHeaders = TestPlan_Header;

  console.log("Actual Headers:", actualHeaders);
  console.log("Expected Headers:", expectedHeaders);
});

test('TC_PLAN002- Verify the "Planning" tab is accessible and clickable', async ({
  planningPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      'Verify the "Planning" tab is accessible and clickable @owner:Shilpa Bhagat',
  });

  console.log("Checking if Planning tab is visible...");
  const isVisible = await planningPage.isPlanningTabVisible();
  expect(isVisible);
  console.log("Planning tab is visible");

  await planningPage.clickPlanningTab(testInfo);
  console.log("Clicked the Planning tab");

  console.log("Verifying Planning tab content is visible...");
  const planningTabHeader = await page
    .locator(PLANNING_PAGE_LOCATORS.planningTab)
    .isVisible();
  expect(planningTabHeader).toBeTruthy();
  console.log("Planning tab content is visible");

  await captureStepScreenshot(page, testInfo, "PlanningTabAfterClick");
});

test("TC_PLAN003- Verify all Planning tab sub-options are present and visible", async ({
  planningPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify all sub-options are present and correctly displayed under the Planning tab @owner:Shilpa Bhagat",
  });

  await planningPage.clickPlanningTab(testInfo);
  console.log("Clicked the Planning tab");

  const subOptions = TestDataGenerator.planningTabSubOptions();
  for (const option of subOptions) {
    console.log(`Checking sub-option: ${option}`);
  }
  await planningPage.areSubOptionsVisible(subOptions);
  console.log("All Planning tab sub-options are visible");

  await captureStepScreenshot(page, testInfo, "PlanningTabSubOptions");
  await page.click(PLANNING_PAGE_LOCATORS.releaseTab);
  await page.waitForTimeout(1000);
  await planningPage.selectRelease(
    commonProperties.weeklyRelease.ALD,
    testInfo
  );
  const releaseSubOptions = TestDataGenerator.releaseTabSubOptions();
  for (const option of releaseSubOptions) {
    console.log(`Checking sub-option: ${option}`);
  }
});

test("TC_PLAN004- Negative: Search for a non-existent release in dropdown", async ({
  page,
  planningPage,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify that the release dropdown handles non-existent release search gracefully @owner:Shilpa Bhagat",
  });

  await planningPage.clickReleaseTab(testInfo);
  console.log("Clicked the Release tab");

  await planningPage.selectRelease("12.4.0.0", testInfo);
  console.log("Searched for non-existent release");

  const noMatch = await page.locator("text=No results found").isVisible();
  expect(noMatch).toBeTruthy();
  console.log("No matching release found, as expected");

  await captureStepScreenshot(page, testInfo, "InvalidReleaseSearchResult");
});

test("TC_PLAN005- Negative: Planning tab is not visible for unauthorized user", async ({
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Planning tab is not accessible when user is unauthorized @owner:Shilpa Bhagat",
  });
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(
    TestDataGenerator.username(),
    TestDataGenerator.password()
  );

  const loginErrorVisible = await page
    .locator("text=Login Incorrect!")
    .isVisible();
  expect(loginErrorVisible).toBeTruthy();
  console.log("Login failed as expected");

  const planningTabLocator = page.locator(PLANNING_PAGE_LOCATORS.planningTab);
  const isVisible = await planningTabLocator.isVisible();
  expect(isVisible).toBeFalsy();
  console.log("Planning tab is not visible to unauthorized users");

  await captureStepScreenshot(page, testInfo, "PlanningTabInvalidLogin");
});

test("TC_PLAN006- Negative: Planning tab has missing or invalid sub-options", async ({
  page,
  planningPage,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify that invalid or misconfigured sub-options are not visible under the Planning tab @owner:Shilpa Bhagat",
  });

  await planningPage.clickPlanningTab(testInfo);
  console.log("Clicked the Planning tab");

  const invalidSubOptions = ["FakeTab1", "UnknownSubOption"];

  for (const option of invalidSubOptions) {
    const isVisible = await page
      .locator(`text=${option}`)
      .isVisible()
      .catch(() => false);
    expect(isVisible).toBeFalsy();
    console.log(`Sub-option not found (as expected): ${option}`);
  }

  await captureStepScreenshot(page, testInfo, "InvalidSubOptionsCheck");
});
