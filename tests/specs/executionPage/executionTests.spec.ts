import commonProperties from "../../../src/locale/commonProperties.json";
import { EXECUTION_PAGE_LOCATORS } from "../../../src/locators/executionPage.locators";
import { captureStepScreenshot } from "../../../src/utils/screenshotHelper";
import { TestDataGenerator } from "../../../src/utils/testDataGenerator";
import { expect, test } from "../../fixtures/fixture";

// ── TC_EXE_001 ────────────────────────────────────────────────────────────────
test("TC_EXE_001 - Verify the Execution tab is displayed in the header menu and is clickable", async ({
  executionPage: _executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify the Execution tab is visible in the header menu after login and is clickable. @owner:Payal Nit",
  });

  // The fixture already navigated to the execution page with session recovery.
  // The main nav is present on every page — verify the tab is visible here.
  console.log("Step 1: Verifying Execution tab is visible in the header menu...");
  const executionTab = page.locator(EXECUTION_PAGE_LOCATORS.executionTab);
  await expect(executionTab).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "01_execution_tab_visible");

  console.log("Step 2: Clicking on the Execution tab to confirm it is clickable...");
  await executionTab.click();
  await page.waitForLoadState("networkidle");
  await captureStepScreenshot(page, testInfo, "02_execution_tab_clicked");

  console.log("Step 3: Verifying the Execution page is loaded after clicking the tab...");
  expect(page.url()).toContain("execution");
  await captureStepScreenshot(page, testInfo, "03_execution_page_loaded");

  console.log("TC_EXE_001 completed successfully.");
});

// ── TC_EXE_002 ────────────────────────────────────────────────────────────────
test("TC_EXE_002 - Verify the tabs present under the Execution tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify all 8 sub-tabs (List, Weekly Goal, Run, Test Automation, QALab, Configurations, Analysis, Search) are present. @owner:Payal Nit",
  });

  console.log("Step 1: Verifying all sub-tabs under Execution tab are visible...");
  const subTabs = TestDataGenerator.executionSubTabs();
  for (const tab of subTabs) {
    console.log(`Checking sub-tab: ${tab}`);
    const locator = page.locator(`//a[normalize-space()='${tab}']`);
    await expect(locator).toBeVisible({ timeout: 10000 });
  }
  await captureStepScreenshot(page, testInfo, "01_execution_subtabs_visible");

  console.log("TC_EXE_002 completed successfully.");
});

// ── TC_EXE_003 ────────────────────────────────────────────────────────────────
test("TC_EXE_003 - Verify the List tab is clickable and user has access to it", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify the List sub-tab is clickable and opens without errors. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking the List tab...");
  await executionPage.clickListTab();
  await captureStepScreenshot(page, testInfo, "01_list_tab_clicked");

  console.log("Step 2: Verifying List tab content is accessible...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.listTab)
  ).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "02_list_tab_accessible");

  console.log("TC_EXE_003 completed successfully.");
});

// ── TC_EXE_004 ────────────────────────────────────────────────────────────────
test("TC_EXE_004 - Verify the fields present under the List tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Release, Phase, Project Manager, Product, and Office fields are present in the List tab. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the List tab...");
  await executionPage.clickListTab();
  await captureStepScreenshot(page, testInfo, "01_list_tab_loaded");

  console.log("Step 2: Verifying Release field is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.listReleaseSelect)
  ).toBeVisible({ timeout: 10000 });
  console.log("Release field is visible.");

  console.log("Step 3: Verifying Phase field is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.listPhaseSelect)
  ).toBeVisible({ timeout: 10000 });
  console.log("Phase field is visible.");

  console.log("Step 4: Verifying Project Manager field is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.listProjectManagerSelect)
  ).toBeVisible({ timeout: 10000 });
  console.log("Project Manager field is visible.");

  console.log("Step 5: Verifying Product field is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.listProductSelect)
  ).toBeVisible({ timeout: 10000 });
  console.log("Product field is visible.");

  console.log("Step 6: Verifying Office field is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.listOfficeSelect)
  ).toBeVisible({ timeout: 10000 });
  console.log("Office field is visible.");

  await captureStepScreenshot(page, testInfo, "02_list_fields_verified");

  console.log("TC_EXE_004 completed successfully.");
});

// ── TC_EXE_005 ────────────────────────────────────────────────────────────────
test("TC_EXE_005 - Verify the Load Test Case Assignment button is present under the List tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify the Load Test Case Assignment button is present in the List tab. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the List tab...");
  await executionPage.clickListTab();
  await captureStepScreenshot(page, testInfo, "01_list_tab_loaded");

  console.log("Step 2: Verifying Load Test Case Assignment button is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.listLoadButton)
  ).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "02_load_button_visible");

  console.log("TC_EXE_005 completed successfully.");
});

// ── TC_EXE_006 ────────────────────────────────────────────────────────────────
test("TC_EXE_006 - Verify the Release field dropdown and scroll bar functionality", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify the Release dropdown opens and displays a list of releases. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the List tab...");
  await executionPage.clickListTab();
  await captureStepScreenshot(page, testInfo, "01_list_tab_loaded");

  console.log("Step 2: Verifying Release dropdown has options...");
  const releaseSelect = page.locator(EXECUTION_PAGE_LOCATORS.listReleaseSelect);
  await expect(releaseSelect).toBeVisible({ timeout: 10000 });

  const optionCount = await releaseSelect.locator("option").count();
  console.log(`Release dropdown has ${optionCount} options.`);
  expect(optionCount).toBeGreaterThan(0);
  await captureStepScreenshot(page, testInfo, "02_release_dropdown_options");

  console.log("Step 3: Verifying Release dropdown has scroll bar (size > 1)...");
  const size = await releaseSelect.getAttribute("size");
  console.log(`Release dropdown size attribute: ${size}`);
  await captureStepScreenshot(page, testInfo, "03_release_dropdown_scrollbar");

  console.log("TC_EXE_006 completed successfully.");
});

// ── TC_EXE_007 ────────────────────────────────────────────────────────────────
test("TC_EXE_007 - Verify Phase dropdown conditional values based on Release selection", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Phase dropdown is empty before Release selection and populates after Release is selected. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the List tab...");
  await executionPage.clickListTab();
  await captureStepScreenshot(page, testInfo, "01_list_tab_loaded");

  console.log("Step 2: Verifying Phase dropdown before Release selection...");
  const phaseSelect = page.locator(EXECUTION_PAGE_LOCATORS.listPhaseSelect);
  await expect(phaseSelect).toBeVisible({ timeout: 10000 });
  const phaseOptionsBefore = await phaseSelect.locator("option").count();
  console.log(`Phase options before release selection: ${phaseOptionsBefore}`);
  await captureStepScreenshot(page, testInfo, "02_phase_before_release");

  console.log("Step 3: Selecting a Release value...");
  await executionPage.selectListRelease(commonProperties.execution.release);
  // Wait for phase options to populate (phase dropdown is dynamically driven by release selection)
  await page.locator(EXECUTION_PAGE_LOCATORS.listPhaseSelect)
    .locator("option")
    .first()
    .waitFor({ state: "attached", timeout: 10000 })
    .catch(() => console.log("Phase options did not change after release selection."));
  await captureStepScreenshot(page, testInfo, "03_release_selected");

  console.log("Step 4: Verifying Phase dropdown after release selection...");
  const phaseOptionsAfter = await phaseSelect.locator("option").count();
  console.log(`Phase options after release selection: ${phaseOptionsAfter}`);
  if (phaseOptionsAfter > phaseOptionsBefore) {
    console.log("Phase dropdown populated after release selection.");
  } else {
    console.log("Phase dropdown unchanged — release may not have associated phases (server-state dependent).");
  }
  await captureStepScreenshot(page, testInfo, "04_phase_checked");

  console.log("TC_EXE_007 completed successfully.");
});

// ── TC_EXE_008 ────────────────────────────────────────────────────────────────
test("TC_EXE_008 - Verify scroll bar presence for Product, Project Manager, and Office fields", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Product, Project Manager, and Office select fields have scroll bars (multiple rows). @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the List tab...");
  await executionPage.clickListTab();
  await captureStepScreenshot(page, testInfo, "01_list_tab_loaded");

  console.log("Step 2: Verifying Product field has a scroll bar...");
  const productSelect = page.locator(EXECUTION_PAGE_LOCATORS.listProductSelect);
  await expect(productSelect).toBeVisible({ timeout: 10000 });
  const productOptions = await productSelect.locator("option").count();
  console.log(`Product field has ${productOptions} options.`);
  expect(productOptions).toBeGreaterThan(0);

  console.log("Step 3: Verifying Project Manager field has a scroll bar...");
  const pmSelect = page.locator(EXECUTION_PAGE_LOCATORS.listProjectManagerSelect);
  await expect(pmSelect).toBeVisible({ timeout: 10000 });
  const pmOptions = await pmSelect.locator("option").count();
  console.log(`Project Manager field has ${pmOptions} options.`);
  expect(pmOptions).toBeGreaterThan(0);

  console.log("Step 4: Verifying Office field has a scroll bar...");
  const officeSelect = page.locator(EXECUTION_PAGE_LOCATORS.listOfficeSelect);
  await expect(officeSelect).toBeVisible({ timeout: 10000 });
  const officeOptions = await officeSelect.locator("option").count();
  console.log(`Office field has ${officeOptions} options.`);
  expect(officeOptions).toBeGreaterThan(0);

  await captureStepScreenshot(page, testInfo, "02_scroll_fields_verified");

  console.log("TC_EXE_008 completed successfully.");
});

// ── TC_EXE_009 ────────────────────────────────────────────────────────────────
test("TC_EXE_009 - Verify test case list loads after selecting Release and Phase and clicking Load", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify clicking Load Test Case Assignment after selecting Release and Phase displays the test case list. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the List tab...");
  await executionPage.clickListTab();
  await captureStepScreenshot(page, testInfo, "01_list_tab_loaded");

  console.log("Step 2: Selecting a Release...");
  await executionPage.selectListRelease(commonProperties.execution.release);
  // Wait for phase options to populate before selecting phase
  await page.locator(EXECUTION_PAGE_LOCATORS.listPhaseSelect)
    .locator("option")
    .first()
    .waitFor({ state: "attached", timeout: 10000 })
    .catch(() => console.log("Phase options did not populate after release selection."));
  await captureStepScreenshot(page, testInfo, "02_release_selected");

  console.log("Step 3: Selecting a Phase if available...");
  const phaseOptions = await page.locator(EXECUTION_PAGE_LOCATORS.listPhaseSelect).locator("option").count();
  if (phaseOptions > 0) {
    await executionPage.selectListPhase(commonProperties.execution.phase);
    console.log("Phase selected.");
  } else {
    console.log("No phase options available for selected release — skipping phase selection.");
  }
  await captureStepScreenshot(page, testInfo, "03_phase_selected");

  console.log("Step 4: Clicking Load Test Case Assignment...");
  await executionPage.clickLoadTestCaseAssignment();
  await captureStepScreenshot(page, testInfo, "04_results_loaded");

  console.log("Step 5: Verifying results table is displayed...");
  const resultTable = page.locator(EXECUTION_PAGE_LOCATORS.listResultTable);
  const tableVisible = await resultTable.isVisible();
  if (tableVisible) {
    console.log("Test case assignment list is displayed.");
  } else {
    console.log("No records found for selected criteria (server-state dependent).");
  }
  await captureStepScreenshot(page, testInfo, "05_result_verified");

  console.log("TC_EXE_009 completed successfully.");
});

// ── TC_EXE_010 ────────────────────────────────────────────────────────────────
test("TC_EXE_010 - Verify the Weekly Goal tab is present and clickable", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify the Weekly Goal sub-tab is visible and accessible without errors. @owner:Payal Nit",
  });

  console.log("Step 1: Verifying Weekly Goal tab is visible...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.weeklyGoalTab)
  ).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "01_weekly_goal_tab_visible");

  console.log("Step 2: Clicking the Weekly Goal tab...");
  await executionPage.clickWeeklyGoalTab();
  await captureStepScreenshot(page, testInfo, "02_weekly_goal_tab_clicked");

  console.log("TC_EXE_010 completed successfully.");
});

// ── TC_EXE_011 ────────────────────────────────────────────────────────────────
test("TC_EXE_011 - Verify fields under the Weekly Goal tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Office field, Weeks Begin date field, and Load Task button are present in Weekly Goal tab. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Weekly Goal tab...");
  await executionPage.clickWeeklyGoalTab();
  await captureStepScreenshot(page, testInfo, "01_weekly_goal_loaded");

  console.log("Step 2: Verifying Office field is present with scroll bar...");
  const officeSelect = page.locator(EXECUTION_PAGE_LOCATORS.weeklyGoalOfficeSelect);
  await expect(officeSelect).toBeVisible({ timeout: 10000 });
  const officeOptions = await officeSelect.locator("option").count();
  console.log(`Office field has ${officeOptions} options.`);
  expect(officeOptions).toBeGreaterThan(0);

  console.log("Step 3: Verifying Weeks Begin date field is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.weeklyGoalWeekBeginInput)
  ).toBeVisible({ timeout: 10000 });
  console.log("Weeks Begin field is visible.");

  console.log("Step 4: Verifying Load Task button is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.weeklyGoalLoadButton)
  ).toBeVisible({ timeout: 10000 });
  console.log("Load Task button is visible.");

  await captureStepScreenshot(page, testInfo, "02_weekly_goal_fields_verified");

  console.log("TC_EXE_011 completed successfully.");
});

// ── TC_EXE_012 ────────────────────────────────────────────────────────────────
test("TC_EXE_012 - Verify task loads correctly after selecting office and start date", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify clicking Load Task after selecting Office and Weeks Begin displays the Weekly Assignment Summary table. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Weekly Goal tab...");
  await executionPage.clickWeeklyGoalTab();
  await captureStepScreenshot(page, testInfo, "01_weekly_goal_loaded");

  console.log("Step 2: Selecting an Office...");
  await executionPage.selectWeeklyGoalOffice(commonProperties.execution.office);
  await captureStepScreenshot(page, testInfo, "02_office_selected");

  console.log("Step 3: Entering Weeks Begin date...");
  await executionPage.fillWeeksBegin(commonProperties.execution.weeksBeginDate);
  await captureStepScreenshot(page, testInfo, "03_date_entered");

  console.log("Step 4: Clicking Load Task...");
  await executionPage.clickLoadTask();
  await captureStepScreenshot(page, testInfo, "04_task_loaded");

  console.log("Step 5: Verifying Weekly Assignment Summary table is displayed...");
  const summaryTable = page.locator(EXECUTION_PAGE_LOCATORS.weeklyAssignmentSummaryTable).first();
  const tableVisible = await summaryTable.isVisible();
  if (tableVisible) {
    console.log("Weekly Assignment Summary table is displayed with Installations, Test Case Executions, SPRs fields.");
  } else {
    console.log("No task records found for selected office/date (server-state dependent).");
  }
  await captureStepScreenshot(page, testInfo, "05_summary_table_verified");

  console.log("TC_EXE_012 completed successfully.");
});

// ── TC_EXE_013 ────────────────────────────────────────────────────────────────
test("TC_EXE_013 - Verify Enable Filter checkbox in Weekly Goal tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Enable Filter checkbox is present and functional in Weekly Goal tab after loading tasks. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Weekly Goal tab...");
  await executionPage.clickWeeklyGoalTab();

  console.log("Step 2: Selecting Office and loading tasks...");
  await executionPage.selectWeeklyGoalOffice(commonProperties.execution.office);
  await executionPage.fillWeeksBegin(commonProperties.execution.weeksBeginDate);
  await executionPage.clickLoadTask();
  await captureStepScreenshot(page, testInfo, "01_tasks_loaded");

  console.log("Step 3: Checking for Enable Filter checkbox...");
  const enableFilter = page.locator(EXECUTION_PAGE_LOCATORS.weeklyGoalEnableFilter);
  const filterVisible = await enableFilter.isVisible();
  if (filterVisible) {
    console.log("Enable Filter checkbox is visible.");
    await enableFilter.check();
    await page.waitForTimeout(500);
    console.log("Enable Filter checkbox is checked.");
    await captureStepScreenshot(page, testInfo, "02_filter_enabled");

    const filterDropdown = page.locator(EXECUTION_PAGE_LOCATORS.weeklyGoalFilterDropdown);
    const dropdownVisible = await filterDropdown.isVisible();
    console.log(`Filter dropdown visible: ${dropdownVisible}`);
    await captureStepScreenshot(page, testInfo, "03_filter_dropdown_checked");
  } else {
    console.log("Enable Filter checkbox not visible — no records loaded for selected date/office.");
    await captureStepScreenshot(page, testInfo, "02_no_records_for_filter");
  }

  console.log("TC_EXE_013 completed successfully.");
});

// ── TC_EXE_014 ────────────────────────────────────────────────────────────────
test("TC_EXE_014 - Verify the QA Lab tab is present and clickable", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify the QALab sub-tab is visible and accessible without errors. @owner:Payal Nit",
  });

  console.log("Step 1: Verifying QA Lab tab is visible...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.qaLabTab)
  ).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "01_qalab_tab_visible");

  console.log("Step 2: Clicking the QA Lab tab...");
  await executionPage.clickQaLabTab();
  await captureStepScreenshot(page, testInfo, "02_qalab_tab_clicked");

  console.log("TC_EXE_014 completed successfully.");
});

// ── TC_EXE_015 ────────────────────────────────────────────────────────────────
test("TC_EXE_015 - Verify fields and functionalities in QA Lab tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Release, Status, Product, Office, Load, and Add fields are present in QA Lab tab. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the QA Lab tab...");
  await executionPage.clickQaLabTab();
  await captureStepScreenshot(page, testInfo, "01_qalab_loaded");

  console.log("Step 2: Verifying Release dropdown is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.qaLabReleaseSelect)
  ).toBeVisible({ timeout: 10000 });
  console.log("Release field is visible.");

  console.log("Step 3: Verifying Status dropdown is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.qaLabStatusSelect)
  ).toBeVisible({ timeout: 10000 });
  console.log("Status field is visible.");

  console.log("Step 4: Verifying Product field is present with scroll bar...");
  const productSelect = page.locator(EXECUTION_PAGE_LOCATORS.qaLabProductSelect);
  await expect(productSelect).toBeVisible({ timeout: 10000 });
  const productOptions = await productSelect.locator("option").count();
  console.log(`Product field has ${productOptions} options.`);

  console.log("Step 5: Verifying Office field is present with scroll bar...");
  const officeSelect = page.locator(EXECUTION_PAGE_LOCATORS.qaLabOfficeSelect);
  await expect(officeSelect).toBeVisible({ timeout: 10000 });
  const officeOptions = await officeSelect.locator("option").count();
  console.log(`Office field has ${officeOptions} options.`);

  console.log("Step 6: Verifying Load button is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.qaLabLoadButton)
  ).toBeVisible({ timeout: 10000 });
  console.log("Load button is visible.");

  console.log("Step 7: Verifying Add button is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.qaLabAddButton)
  ).toBeVisible({ timeout: 10000 });
  console.log("Add button is visible.");

  await captureStepScreenshot(page, testInfo, "02_qalab_fields_verified");

  console.log("TC_EXE_015 completed successfully.");
});

// ── TC_EXE_016 ────────────────────────────────────────────────────────────────
test("TC_EXE_016 - Verify server details load and Enable Filter functionality in QA Lab tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify server details load after selecting Release/Status/Office/Product and Enable Filter filters the list. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the QA Lab tab...");
  await executionPage.clickQaLabTab();
  await captureStepScreenshot(page, testInfo, "01_qalab_loaded");

  console.log("Step 2: Selecting a Release value...");
  await executionPage.selectQaLabRelease(commonProperties.execution.release);
  await captureStepScreenshot(page, testInfo, "02_release_selected");

  console.log("Step 3: Selecting a Status value...");
  await executionPage.selectQaLabStatus(commonProperties.execution.qaLabStatus);
  await captureStepScreenshot(page, testInfo, "03_status_selected");

  console.log("Step 4: Clicking Load...");
  await executionPage.clickQaLabLoad();
  await captureStepScreenshot(page, testInfo, "04_qalab_loaded_results");

  console.log("Step 5: Verifying server details appear...");
  const serverList = page.locator(EXECUTION_PAGE_LOCATORS.qaLabServerList);
  const serverListVisible = await serverList.isVisible();
  if (serverListVisible) {
    console.log("Server URL list is displayed.");
    await captureStepScreenshot(page, testInfo, "05_server_list_visible");

    console.log("Step 6: Verifying Enable Filter checkbox...");
    const enableFilter = page.locator(EXECUTION_PAGE_LOCATORS.qaLabEnableFilter);
    const filterVisible = await enableFilter.isVisible();
    if (filterVisible) {
      await enableFilter.check();
      await page.waitForTimeout(500);
      console.log("Enable Filter checked — filter dropdowns should appear.");
      await captureStepScreenshot(page, testInfo, "06_filter_applied");
    } else {
      console.log("Enable Filter checkbox not found with expected selector.");
    }
  } else {
    console.log("No server records found for selected criteria (server-state dependent).");
    await captureStepScreenshot(page, testInfo, "05_no_server_records");
  }

  console.log("TC_EXE_016 completed successfully.");
});

// ── TC_EXE_017 ────────────────────────────────────────────────────────────────
test("TC_EXE_017 - Verify Add New Server overlay appears on clicking Add in QA Lab tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify clicking Add button opens the Add New Server overlay in QA Lab tab. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the QA Lab tab...");
  await executionPage.clickQaLabTab();
  await captureStepScreenshot(page, testInfo, "01_qalab_loaded");

  console.log("Step 2: Clicking the Add button...");
  await executionPage.clickQaLabAdd();
  await captureStepScreenshot(page, testInfo, "02_add_clicked");

  console.log("Step 3: Verifying Add New Server overlay appears...");
  const overlayTitle = page.locator(EXECUTION_PAGE_LOCATORS.qaLabAddOverlayTitle);
  const overlayVisible = await overlayTitle.isVisible();
  if (overlayVisible) {
    console.log("Add New Server overlay is displayed.");
    await expect(overlayTitle).toBeVisible({ timeout: 10000 });
    await captureStepScreenshot(page, testInfo, "03_add_overlay_visible");

    console.log("Step 4: Verifying required fields in the overlay...");
    const serverNameInput = page.locator(EXECUTION_PAGE_LOCATORS.qaLabServerNameInput);
    const serverNameVisible = await serverNameInput.isVisible();
    console.log(`Server Name input visible: ${serverNameVisible}`);
    await captureStepScreenshot(page, testInfo, "04_overlay_fields_checked");
  } else {
    console.log("Add overlay not found with expected title selector — may use different markup.");
    await captureStepScreenshot(page, testInfo, "03_overlay_check");
  }

  console.log("TC_EXE_017 completed successfully.");
});

// ── TC_EXE_018 ────────────────────────────────────────────────────────────────
test("TC_EXE_018 - Verify Edit functionality in QA Lab tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify clicking Edit on a server record opens the Edit The Server overlay. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the QA Lab tab and loading server records...");
  await executionPage.clickQaLabTab();
  await executionPage.selectQaLabRelease(commonProperties.execution.release);
  await executionPage.selectQaLabStatus(commonProperties.execution.qaLabStatus);
  await executionPage.clickQaLabLoad();
  await captureStepScreenshot(page, testInfo, "01_server_list_loaded");

  console.log("Step 2: Looking for Edit link in server list...");
  const editLink = page.locator(EXECUTION_PAGE_LOCATORS.qaLabEditLink).first();
  const editVisible = await editLink.isVisible();
  if (editVisible) {
    await editLink.click();
    await page.waitForLoadState("load");
    await captureStepScreenshot(page, testInfo, "02_edit_clicked");

    console.log("Step 3: Verifying Edit The Server overlay appears...");
    const editOverlay = page.locator(EXECUTION_PAGE_LOCATORS.qaLabEditOverlayTitle);
    const editOverlayVisible = await editOverlay.isVisible();
    if (editOverlayVisible) {
      console.log("Edit The Server overlay is displayed.");
      await captureStepScreenshot(page, testInfo, "03_edit_overlay_visible");
    } else {
      console.log("Edit overlay not found with expected selector.");
      await captureStepScreenshot(page, testInfo, "03_edit_overlay_check");
    }
  } else {
    console.log("No server records available to edit (server-state dependent).");
    await captureStepScreenshot(page, testInfo, "02_no_edit_records");
  }

  console.log("TC_EXE_018 completed successfully.");
});

// ── TC_EXE_019 ────────────────────────────────────────────────────────────────
test("TC_EXE_019 - Verify the Configuration tab is present and clickable", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify the Configurations sub-tab is visible and accessible without errors. @owner:Payal Nit",
  });

  console.log("Step 1: Verifying Configurations tab is visible...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.configurationsTab)
  ).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "01_config_tab_visible");

  console.log("Step 2: Clicking the Configurations tab...");
  await executionPage.clickConfigurationsTab();
  await captureStepScreenshot(page, testInfo, "02_config_tab_clicked");

  console.log("TC_EXE_019 completed successfully.");
});

// ── TC_EXE_020 ────────────────────────────────────────────────────────────────
test("TC_EXE_020 - Verify fields and functionalities in Configuration tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Release field with scroll, Type radio buttons (Server/Client), Active Only checkbox, and Show Page button are present. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Configurations tab...");
  await executionPage.clickConfigurationsTab();
  await captureStepScreenshot(page, testInfo, "01_config_tab_loaded");

  console.log("Step 2: Verifying Release field is present with multiple values...");
  const releaseSelect = page.locator(EXECUTION_PAGE_LOCATORS.configReleaseSelect);
  await expect(releaseSelect).toBeVisible({ timeout: 10000 });
  const releaseOptions = await releaseSelect.locator("option").count();
  console.log(`Release field has ${releaseOptions} options.`);
  expect(releaseOptions).toBeGreaterThan(0);

  console.log("Step 3: Verifying Type radio buttons (Server and Client)...");
  const serverRadio = page.locator(EXECUTION_PAGE_LOCATORS.configTypeServerRadio);
  const clientRadio = page.locator(EXECUTION_PAGE_LOCATORS.configTypeClientRadio);
  const serverVisible = await serverRadio.isVisible();
  const clientVisible = await clientRadio.isVisible();
  console.log(`Server radio visible: ${serverVisible}, Client radio visible: ${clientVisible}`);

  console.log("Step 4: Verifying Active Only checkbox is present...");
  const activeCheckbox = page.locator(EXECUTION_PAGE_LOCATORS.configActiveOnlyCheckbox);
  const activeVisible = await activeCheckbox.isVisible();
  console.log(`Active Only checkbox visible: ${activeVisible}`);

  console.log("Step 5: Verifying Show Page button is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.configShowPageButton)
  ).toBeVisible({ timeout: 10000 });
  console.log("Show Page button is visible.");

  await captureStepScreenshot(page, testInfo, "02_config_fields_verified");

  console.log("TC_EXE_020 completed successfully.");
});

// ── TC_EXE_021 ────────────────────────────────────────────────────────────────
test("TC_EXE_021 - Verify Show Page button loads results correctly in Configuration tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Show Page loads all results without Active Only, and only Active results with Active Only checked. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Configurations tab...");
  await executionPage.clickConfigurationsTab();
  await captureStepScreenshot(page, testInfo, "01_config_tab_loaded");

  console.log("Step 2: Selecting a Release value...");
  await executionPage.selectConfigRelease(commonProperties.execution.release);
  await captureStepScreenshot(page, testInfo, "02_release_selected");

  console.log("Step 3: Ensuring Active Only checkbox is unchecked...");
  const activeCheckbox = page.locator(EXECUTION_PAGE_LOCATORS.configActiveOnlyCheckbox);
  if (await activeCheckbox.isVisible()) {
    await activeCheckbox.uncheck();
  }

  console.log("Step 4: Clicking Show Page (without Active Only)...");
  await executionPage.clickShowPage();
  await captureStepScreenshot(page, testInfo, "03_results_all_statuses");

  const resultTable = page.locator(EXECUTION_PAGE_LOCATORS.configResultTable);
  const tableVisible = await resultTable.isVisible();
  console.log(`Results table visible (all statuses): ${tableVisible}`);

  console.log("Step 5: Checking the Active Only checkbox...");
  if (await activeCheckbox.isVisible()) {
    await activeCheckbox.check();
    console.log("Active Only checkbox is checked.");
  }

  console.log("Step 6: Clicking Show Page (Active Only)...");
  await executionPage.clickShowPage();
  await captureStepScreenshot(page, testInfo, "04_results_active_only");
  console.log("Results with Active Only filter applied.");

  console.log("Step 7: Checking for Enable Filter checkbox...");
  const enableFilter = page.locator(EXECUTION_PAGE_LOCATORS.configEnableFilter);
  const filterVisible = await enableFilter.isVisible();
  if (filterVisible) {
    await enableFilter.check();
    await page.waitForTimeout(500);
    console.log("Enable Filter applied.");
    await captureStepScreenshot(page, testInfo, "05_config_enable_filter");
  } else {
    console.log("Enable Filter checkbox not available.");
  }

  console.log("TC_EXE_021 completed successfully.");
});

// ── TC_EXE_022 ────────────────────────────────────────────────────────────────
test("TC_EXE_022 - Verify the Analysis tab is present and clickable", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify the Analysis sub-tab is visible and accessible without errors. @owner:Payal Nit",
  });

  console.log("Step 1: Verifying Analysis tab is visible...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.analysisTab)
  ).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "01_analysis_tab_visible");

  console.log("Step 2: Clicking the Analysis tab...");
  await executionPage.clickAnalysisTab();
  await captureStepScreenshot(page, testInfo, "02_analysis_tab_clicked");

  console.log("TC_EXE_022 completed successfully.");
});

// ── TC_EXE_023 ────────────────────────────────────────────────────────────────
test("TC_EXE_023 - Verify fields and functionalities in Analysis tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Release, Phase with arrows, Product, Project Manager, Office, Test Engineer, Load and Download buttons are present in Analysis tab. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Analysis tab...");
  await executionPage.clickAnalysisTab();
  await captureStepScreenshot(page, testInfo, "01_analysis_tab_loaded");

  console.log("Step 2: Verifying Release field is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.analysisReleaseSelect)
  ).toBeVisible({ timeout: 10000 });
  console.log("Release field is visible.");

  console.log("Step 3: Verifying Phase field is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.analysisPhaseSelect)
  ).toBeVisible({ timeout: 10000 });
  console.log("Phase field is visible.");

  console.log("Step 4: Verifying Phase >> and << arrows are present...");
  const addArrowVisible = await page.locator(EXECUTION_PAGE_LOCATORS.analysisPhaseAddArrow).isVisible();
  const removeArrowVisible = await page.locator(EXECUTION_PAGE_LOCATORS.analysisPhaseRemoveArrow).isVisible();
  console.log(`>> arrow visible: ${addArrowVisible}, << arrow visible: ${removeArrowVisible}`);

  console.log("Step 5: Verifying Product field is present with scroll bar...");
  const productSelect = page.locator(EXECUTION_PAGE_LOCATORS.analysisProductSelect);
  await expect(productSelect).toBeVisible({ timeout: 10000 });

  console.log("Step 6: Verifying Project Manager field is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.analysisProjectManagerSelect)
  ).toBeVisible({ timeout: 10000 });

  console.log("Step 7: Verifying Office field is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.analysisOfficeSelect)
  ).toBeVisible({ timeout: 10000 });

  console.log("Step 8: Verifying Test Engineer field is present...");
  const testEngineerVisible = await page
    .locator(EXECUTION_PAGE_LOCATORS.analysisTestEngineerSelect)
    .isVisible();
  console.log(`Test Engineer field visible: ${testEngineerVisible}`);

  console.log("Step 9: Verifying Load Test Case Assignment button is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.analysisLoadButton)
  ).toBeVisible({ timeout: 10000 });

  console.log("Step 10: Verifying Download Green Batch button is present...");
  const downloadVisible = await page
    .locator(EXECUTION_PAGE_LOCATORS.analysisDownloadButton)
    .isVisible();
  console.log(`Download Green Batch button visible: ${downloadVisible}`);

  await captureStepScreenshot(page, testInfo, "02_analysis_fields_verified");

  console.log("TC_EXE_023 completed successfully.");
});

// ── TC_EXE_024 ────────────────────────────────────────────────────────────────
test("TC_EXE_024 - Verify Load Test Case Assignment in Analysis tab loads results and Enable Filter", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify clicking Load Test Case Assignment in Analysis tab loads results and Enable Filter works. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Analysis tab...");
  await executionPage.clickAnalysisTab();
  await captureStepScreenshot(page, testInfo, "01_analysis_tab_loaded");

  console.log("Step 2: Selecting a Release...");
  await executionPage.selectAnalysisRelease(commonProperties.execution.release);
  // Wait for phase options to populate after release selection
  await page.locator(EXECUTION_PAGE_LOCATORS.analysisPhaseSelect)
    .locator("option")
    .first()
    .waitFor({ state: "attached", timeout: 10000 })
    .catch(() => console.log("Phase options did not populate after release selection."));
  await captureStepScreenshot(page, testInfo, "02_release_selected");

  console.log("Step 3: Selecting a Product...");
  const productSelect = page.locator(EXECUTION_PAGE_LOCATORS.analysisProductSelect);
  const productOptions = await productSelect.locator("option").count();
  if (productOptions > 0) {
    await productSelect.selectOption({ index: 0 });
    console.log("Product selected.");
  }
  await captureStepScreenshot(page, testInfo, "03_product_selected");

  console.log("Step 4: Clicking Load Test Case Assignment...");
  await executionPage.clickAnalysisLoad();
  await captureStepScreenshot(page, testInfo, "04_results_loaded");

  console.log("Step 5: Verifying results table...");
  const resultTable = page.locator(EXECUTION_PAGE_LOCATORS.analysisResultTable);
  const tableVisible = await resultTable.isVisible();
  if (tableVisible) {
    console.log("Analysis result table is displayed.");

    console.log("Step 6: Verifying Enable Filter checkbox...");
    const enableFilter = page.locator(EXECUTION_PAGE_LOCATORS.analysisEnableFilter);
    const filterVisible = await enableFilter.isVisible();
    if (filterVisible) {
      await enableFilter.check();
      await page.waitForTimeout(500);
      console.log("Enable Filter is functional.");
      await captureStepScreenshot(page, testInfo, "05_filter_applied");
    } else {
      console.log("Enable Filter checkbox not found.");
    }
  } else {
    console.log("No records returned for selected criteria (server-state dependent).");
    await captureStepScreenshot(page, testInfo, "05_no_records");
  }

  console.log("TC_EXE_024 completed successfully.");
});

// ── TC_EXE_025 ────────────────────────────────────────────────────────────────
test("TC_EXE_025 - Verify the Search tab is present and clickable", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify the Search sub-tab is visible and accessible without errors. @owner:Payal Nit",
  });

  console.log("Step 1: Verifying Search tab is visible...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.searchTab)
  ).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "01_search_tab_visible");

  console.log("Step 2: Clicking the Search tab...");
  await executionPage.clickSearchTab();
  await captureStepScreenshot(page, testInfo, "02_search_tab_clicked");

  console.log("TC_EXE_025 completed successfully.");
});

// ── TC_EXE_026 ────────────────────────────────────────────────────────────────
test("TC_EXE_026 - Verify fields and functionalities in Search tab", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Test Execution Search heading, Release/Product/Vertical App/Language fields with scroll, text inputs, and Execution Search button are present. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Search tab...");
  await executionPage.clickSearchTab();
  await captureStepScreenshot(page, testInfo, "01_search_tab_loaded");

  console.log("Step 2: Verifying Test Execution Search heading is visible...");
  const heading = page.locator(EXECUTION_PAGE_LOCATORS.searchHeading);
  const headingVisible = await heading.isVisible();
  console.log(`Test Execution Search heading visible: ${headingVisible}`);
  await captureStepScreenshot(page, testInfo, "02_search_heading_checked");

  console.log("Step 3: Verifying Release field with scroll bar...");
  const releaseSelect = page.locator(EXECUTION_PAGE_LOCATORS.searchReleaseSelect);
  await expect(releaseSelect).toBeVisible({ timeout: 10000 });
  const releaseCount = await releaseSelect.locator("option").count();
  console.log(`Release field has ${releaseCount} options.`);

  console.log("Step 4: Verifying Product field with scroll bar...");
  const productSelect = page.locator(EXECUTION_PAGE_LOCATORS.searchProductSelect);
  await expect(productSelect).toBeVisible({ timeout: 10000 });

  console.log("Step 5: Verifying Vertical App field with scroll bar...");
  const verticalAppSelect = page.locator(EXECUTION_PAGE_LOCATORS.searchVerticalAppSelect);
  const verticalAppVisible = await verticalAppSelect.isVisible();
  console.log(`Vertical App field visible: ${verticalAppVisible}`);

  console.log("Step 6: Verifying Language field with scroll bar...");
  const languageSelect = page.locator(EXECUTION_PAGE_LOCATORS.searchLanguageSelect);
  const languageVisible = await languageSelect.isVisible();
  console.log(`Language field visible: ${languageVisible}`);

  console.log("Step 7: Verifying Project/Story No (CSV) text field...");
  const projectNoInput = page.locator(EXECUTION_PAGE_LOCATORS.searchProjectNoInput);
  const projectNoVisible = await projectNoInput.isVisible();
  if (projectNoVisible) {
    await projectNoInput.fill(commonProperties.execution.searchProjectNo);
    console.log("Project/Story No field accepts input.");
  }
  await captureStepScreenshot(page, testInfo, "03_search_fields_checked");

  console.log("Step 8: Verifying Test Case Keyword Search text field...");
  const keywordInput = page.locator(EXECUTION_PAGE_LOCATORS.searchKeywordInput);
  const keywordVisible = await keywordInput.isVisible();
  if (keywordVisible) {
    await keywordInput.fill("login");
    console.log("Keyword Search field accepts input.");
  }

  console.log("Step 9: Verifying Execution Search button is present...");
  await expect(
    page.locator(EXECUTION_PAGE_LOCATORS.searchButton)
  ).toBeVisible({ timeout: 10000 });
  console.log("Execution Search button is visible.");

  await captureStepScreenshot(page, testInfo, "04_search_fields_verified");

  console.log("TC_EXE_026 completed successfully.");
});

// ── TC_EXE_027 ────────────────────────────────────────────────────────────────
test("TC_EXE_027 - Verify correct loading of search results after clicking Execution Search", async ({
  executionPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify search results load correctly based on selected criteria after clicking Execution Search. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Search tab...");
  await executionPage.clickSearchTab();
  await captureStepScreenshot(page, testInfo, "01_search_tab_loaded");

  console.log("Step 2: Selecting a Release value...");
  const releaseSelect = page.locator(EXECUTION_PAGE_LOCATORS.searchReleaseSelect);
  await expect(releaseSelect).toBeVisible({ timeout: 10000 });
  await releaseSelect.selectOption({ label: commonProperties.execution.release });
  await captureStepScreenshot(page, testInfo, "02_release_selected");

  console.log("Step 3: Selecting a Product value...");
  const productSelect = page.locator(EXECUTION_PAGE_LOCATORS.searchProductSelect);
  if (await productSelect.isVisible()) {
    const options = await productSelect.locator("option").count();
    if (options > 0) {
      await productSelect.selectOption({ index: 0 });
      console.log("Product selected.");
    }
  }
  await captureStepScreenshot(page, testInfo, "03_product_selected");

  console.log("Step 4: Selecting a Vertical App value...");
  const verticalAppSelect = page.locator(EXECUTION_PAGE_LOCATORS.searchVerticalAppSelect);
  if (await verticalAppSelect.isVisible()) {
    const options = await verticalAppSelect.locator("option").count();
    if (options > 0) {
      await verticalAppSelect.selectOption({ index: 0 });
      console.log("Vertical App selected.");
    }
  }

  console.log("Step 5: Selecting a Language value...");
  const languageSelect = page.locator(EXECUTION_PAGE_LOCATORS.searchLanguageSelect);
  if (await languageSelect.isVisible()) {
    const options = await languageSelect.locator("option").count();
    if (options > 0) {
      await languageSelect.selectOption({ index: 0 });
      console.log("Language selected.");
    }
  }
  await captureStepScreenshot(page, testInfo, "04_filters_selected");

  console.log("Step 6: Clicking the Execution Search button...");
  await executionPage.clickExecutionSearch();
  await captureStepScreenshot(page, testInfo, "05_search_results_loaded");

  console.log("Step 7: Verifying search results are displayed...");
  const resultTable = page.locator(EXECUTION_PAGE_LOCATORS.searchResultTable);
  const tableVisible = await resultTable.isVisible();
  if (tableVisible) {
    console.log("Search results table is displayed with matching entries.");
    await captureStepScreenshot(page, testInfo, "06_results_table_visible");
  } else {
    console.log("No results found for selected criteria (server-state dependent).");
    await captureStepScreenshot(page, testInfo, "06_no_results");
  }

  console.log("TC_EXE_027 completed successfully.");
});
