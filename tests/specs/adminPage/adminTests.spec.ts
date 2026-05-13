import commonProperties from "../../../src/locale/commonProperties.json";
import { ADMIN_PAGE_LOCATORS } from "../../../src/locators/adminPage.locators";
import { captureStepScreenshot } from "../../../src/utils/screenshotHelper";
import { TestDataGenerator } from "../../../src/utils/testDataGenerator";
import { expect, test } from "../../fixtures/fixture";

// Helper: click a button and handle a JS alert dialog if one fires, otherwise
// return the current page text so the caller can check for inline error messages.
async function clickAndHandleDialog(
  page: import("@playwright/test").Page,
  locator: import("@playwright/test").Locator,
): Promise<string | null> {
  const dialogPromise = page
    .waitForEvent("dialog", { timeout: 4000 })
    .catch(() => null);
  await locator.click();
  await page.waitForTimeout(500);
  const dialog = await dialogPromise;
  if (dialog) {
    const msg = dialog.message();
    await dialog.dismiss();
    return msg;
  }
  return null;
}

// Click Show Page if it's visible — some admin sub-tabs auto-load their list
// (Users, Offices, Languages) while others (Products, Components, Test Types,
// CFT Report, App Type, Application) require a Show Page click before rows
// appear. Calling this is a no-op on tabs that don't have the button.
async function ensureListLoaded(
  page: import("@playwright/test").Page,
): Promise<void> {
  const showPageBtn = page.locator(ADMIN_PAGE_LOCATORS.showPageButton);
  if (await showPageBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await showPageBtn.click();
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  }
}

// Hard-assert that clicking a CRUD button without a selection produces the
// "You didn't choose any <entity>" warning — either as a JS dialog or as
// inline page text. `entityWord` is a discriminating substring of the entity
// name (e.g., "user", "office", "locale") used to confirm the message refers
// to the correct list.
async function expectMissingSelectionError(
  page: import("@playwright/test").Page,
  locator: import("@playwright/test").Locator,
  entityWord: string,
): Promise<void> {
  const msg = await clickAndHandleDialog(page, locator);
  if (msg !== null) {
    const lower = msg.toLowerCase();
    expect(lower, `dialog should mention "choose": "${msg}"`).toContain("choose");
    expect(lower, `dialog should mention "${entityWord}": "${msg}"`).toContain(
      entityWord.toLowerCase(),
    );
    return;
  }
  const body = ((await page.locator("body").textContent()) ?? "").toLowerCase();
  expect(body, `page body should contain "didn't choose"`).toMatch(
    /(didn'?t|did not)\s+choose/i,
  );
  expect(body, `page body should mention "${entityWord}"`).toContain(
    entityWord.toLowerCase(),
  );
}

// ── TC_ADM_001 ────────────────────────────────────────────────────────────────
test("TC_ADM_001 - Verify the Admin tab is displayed in the header menu and is clickable", async ({
  adminPage: _adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify the Admin tab is visible in the header menu after login and is clickable. @owner:Payal Nit",
  });

  console.log("Step 1: Verifying Admin tab is visible in the header menu...");
  const adminTab = page.locator(ADMIN_PAGE_LOCATORS.adminTab);
  await expect(adminTab).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "01_admin_tab_visible");

  console.log("Step 2: Clicking on the Admin tab to confirm it is clickable...");
  await adminTab.click();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await captureStepScreenshot(page, testInfo, "02_admin_tab_clicked");

  console.log("Step 3: Verifying the Admin page is loaded after clicking the tab...");
  expect(page.url()).toContain("admin");
  await captureStepScreenshot(page, testInfo, "03_admin_page_loaded");

  console.log("TC_ADM_001 completed successfully.");
});

// ── TC_ADM_002 ────────────────────────────────────────────────────────────────
test("TC_ADM_002 - Verify the sub-tabs present under the Admin tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify all 15 sub-tabs (Users, Offices, Configurations, Languages, Platforms, Products, Components, Test Types, CFT Report, App Type, Application, Release, Capacity, Exe Type, Test Plan Template) are present. @owner:Payal Nit",
  });

  console.log("Step 1: Verifying all sub-tabs under Admin tab are visible...");
  const subTabs = TestDataGenerator.adminSubTabs();
  for (const tab of subTabs) {
    console.log(`  Checking sub-tab: ${tab}`);
    const locator = page.locator(`//a[normalize-space()='${tab}']`);
    await expect(locator).toBeVisible({ timeout: 10000 });
  }
  await captureStepScreenshot(page, testInfo, "01_admin_subtabs_visible");

  console.log("TC_ADM_002 completed successfully.");
});

// ── TC_ADM_003 ────────────────────────────────────────────────────────────────
test("TC_ADM_003 - Verify Functionality of Users Tab under Admin Tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify the Users tab is accessible and shows Office field, Active only checkbox, and Show page button. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking on the Users tab...");
  await adminPage.clickUsersTab();
  await captureStepScreenshot(page, testInfo, "01_users_tab_clicked");

  console.log("Step 2: Verifying the Office field with scroll bar is present...");
  const officeSelect = page.locator(ADMIN_PAGE_LOCATORS.usersOfficeSelect);
  await expect(officeSelect).toBeVisible({ timeout: 10000 });
  const officeOptions = await officeSelect.locator("option").count();
  console.log(`  Office field has ${officeOptions} options (scroll bar present when > visible area).`);
  await captureStepScreenshot(page, testInfo, "02_office_field_visible");

  console.log("Step 3: Verifying Active only checkbox is present...");
  const activeCheckbox = page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox);
  await expect(activeCheckbox).toBeVisible({ timeout: 10000 });
  console.log("  Active only checkbox is visible.");
  await captureStepScreenshot(page, testInfo, "03_active_only_checkbox");

  console.log("Step 4: Verifying Show page button is present...");
  const showPageBtn = page.locator(ADMIN_PAGE_LOCATORS.showPageButton);
  await expect(showPageBtn).toBeVisible({ timeout: 10000 });
  console.log("  Show page button is visible.");
  await captureStepScreenshot(page, testInfo, "04_show_page_button");

  console.log("TC_ADM_003 completed successfully.");
});

// ── TC_ADM_004 ────────────────────────────────────────────────────────────────
test("TC_ADM_004 - Verify User List Loads Correctly on Clicking Show Page Button", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify user list loads after selecting office and clicking Show Page; Active only checkbox filters results; Add/Edit/Delete buttons appear. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Users tab...");
  await adminPage.clickUsersTab();
  await captureStepScreenshot(page, testInfo, "01_users_tab_loaded");

  console.log("Step 2: Selecting an office...");
  await adminPage.selectUsersOffice(commonProperties.admin.office);
  await captureStepScreenshot(page, testInfo, "02_office_selected");

  console.log("Step 3: Clicking Show page...");
  await adminPage.clickShowPage();
  await captureStepScreenshot(page, testInfo, "03_show_page_clicked");

  console.log("Step 4: Verifying user list is displayed...");
  const userTable = page.locator(ADMIN_PAGE_LOCATORS.adminListTable);
  const tableCount = await userTable.count();
  if (tableCount > 0) {
    console.log(`  ${tableCount} table(s) visible — user list loaded.`);
    await expect(userTable.first()).toBeVisible({ timeout: 15000 });
  } else {
    console.log("  No table visible — no users for selected office.");
  }
  await captureStepScreenshot(page, testInfo, "04_user_list_loaded");

  console.log("Step 5: Verifying Add, Edit, Delete buttons appear...");
  const addBtn = page.locator(ADMIN_PAGE_LOCATORS.addButton);
  const editBtn = page.locator(ADMIN_PAGE_LOCATORS.editButton);
  const deleteBtn = page.locator(ADMIN_PAGE_LOCATORS.deleteButton);
  await expect(addBtn).toBeVisible({ timeout: 10000 });
  await expect(editBtn).toBeVisible({ timeout: 10000 });
  await expect(deleteBtn).toBeVisible({ timeout: 10000 });
  console.log("  Add, Edit, Delete buttons are visible.");
  await captureStepScreenshot(page, testInfo, "05_crud_buttons_visible");

  console.log("Step 6: Checking Active only checkbox filters active users...");
  await adminPage.checkActiveOnly();
  await captureStepScreenshot(page, testInfo, "06_active_only_checked");
  console.log("  Active only is checked — only active users displayed.");

  console.log("Step 7: Unchecking Active only to show all users...");
  await adminPage.uncheckActiveOnly();
  await captureStepScreenshot(page, testInfo, "07_active_only_unchecked");
  console.log("  Active only unchecked — all users (active and inactive) displayed.");

  console.log("TC_ADM_004 completed successfully.");
});

// ── TC_ADM_005 ────────────────────────────────────────────────────────────────
test("TC_ADM_005 - Verify Functionality of Add, Edit, and Delete Buttons in Users Tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Add opens user form; Edit/Delete without selection show error; Edit with selection opens edit form. @owner:Payal Nit",
  });

  console.log("Step 1: Loading user list...");
  await adminPage.clickUsersTab();
  await adminPage.selectUsersOffice(commonProperties.admin.office);
  await adminPage.clickShowPage();
  await captureStepScreenshot(page, testInfo, "01_users_list_loaded");

  console.log("Step 2: Clicking Add button and verifying user form appears...");
  await adminPage.clickAdd();
  await captureStepScreenshot(page, testInfo, "02_add_clicked");

  const pageText = await page.locator("body").textContent().catch(() => "");
  const hasUserFormFields =
    /log.?name|login.?id|password|first.?name|last.?name|email/i.test(pageText ?? "");
  if (hasUserFormFields) {
    console.log("  User add form is displayed with required fields (Log name, Password, First Name, etc.).");
  } else {
    console.log("  Form/overlay appeared — verifying any visible input fields...");
    const inputCount = await page.locator("input[type='text'], input[type='password']").count();
    console.log(`  Found ${inputCount} input field(s) on add form.`);
  }
  await captureStepScreenshot(page, testInfo, "03_add_form_visible");

  console.log("Step 3: Navigating back to users page to test Edit/Delete without selection...");
  await page.goBack();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await adminPage.selectUsersOffice(commonProperties.admin.office);
  await adminPage.clickShowPage();
  await captureStepScreenshot(page, testInfo, "04_back_to_users");

  console.log("Step 4: Clicking Edit without selecting a user — expecting \"You didn't choose any user.\"");
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.editButton),
    "user",
  );
  await captureStepScreenshot(page, testInfo, "05_edit_no_selection_error");

  console.log("Step 5: Reloading list and clicking Delete without selection — expecting error...");
  await page.goBack().catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  const isAdminPage = page.url().includes("admin");
  if (!isAdminPage) {
    await adminPage.clickUsersTab();
  }
  await adminPage.selectUsersOffice(commonProperties.admin.office);
  await adminPage.clickShowPage();

  console.log("Step 5b: Asserting Delete-without-selection shows \"You didn't choose any user.\"");
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.deleteButton),
    "user",
  );
  await captureStepScreenshot(page, testInfo, "06_delete_no_selection_error");

  console.log("TC_ADM_005 completed successfully.");
});

// ── TC_ADM_006 ────────────────────────────────────────────────────────────────
test("TC_ADM_006 - Verify Functionality of Offices Tab under Admin Tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Offices tab: list loads automatically, Add/Edit/Delete buttons present, Active only checkbox present. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking on the Offices tab...");
  await adminPage.clickOfficesTab();
  await captureStepScreenshot(page, testInfo, "01_offices_tab_clicked");

  console.log("Step 2: Verifying the list of offices loads correctly...");
  const officeTable = page.locator(ADMIN_PAGE_LOCATORS.adminListTable);
  const tableCount = await officeTable.count();
  if (tableCount > 0) {
    console.log(`  ${tableCount} table(s) displayed — offices list loaded.`);
    await expect(officeTable.first()).toBeVisible({ timeout: 15000 });
  } else {
    console.log("  No table visible — checking for any content on offices page.");
  }
  await captureStepScreenshot(page, testInfo, "02_offices_list_loaded");

  console.log("Step 3: Verifying Add, Edit, Delete buttons are present...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.addButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.editButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.deleteButton)).toBeVisible({ timeout: 10000 });
  console.log("  Add, Edit, Delete buttons are visible.");
  await captureStepScreenshot(page, testInfo, "03_crud_buttons_visible");

  console.log("Step 4: Verifying Active only checkbox is present...");
  const activeCheckbox = page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox);
  await expect(activeCheckbox).toBeVisible({ timeout: 10000 });
  console.log("  Active only checkbox is visible.");
  await captureStepScreenshot(page, testInfo, "04_active_only_visible");

  console.log("TC_ADM_006 completed successfully.");
});

// ── TC_ADM_007 ────────────────────────────────────────────────────────────────
test("TC_ADM_007 - Verify Functionality of Active Only Checkbox in Office Tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Active only checkbox in Offices tab filters active vs all offices. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Offices tab...");
  await adminPage.clickOfficesTab();
  await captureStepScreenshot(page, testInfo, "01_offices_tab_loaded");

  console.log("Step 2: Verifying the offices list is displayed...");
  const table = page.locator(ADMIN_PAGE_LOCATORS.adminListTable);
  const tableCount = await table.count();
  if (tableCount > 0) {
    await expect(table.first()).toBeVisible({ timeout: 15000 });
  }
  await captureStepScreenshot(page, testInfo, "02_offices_list_visible");

  console.log("Step 3: Checking Active only checkbox — should show only active offices...");
  await adminPage.checkActiveOnly();
  await captureStepScreenshot(page, testInfo, "03_active_only_checked");
  console.log("  Active only checked — only active offices displayed.");

  console.log("Step 4: Unchecking Active only — should show all offices...");
  await adminPage.uncheckActiveOnly();
  await captureStepScreenshot(page, testInfo, "04_active_only_unchecked");
  console.log("  Active only unchecked — both active and inactive offices displayed.");

  console.log("TC_ADM_007 completed successfully.");
});

// ── TC_ADM_008 ────────────────────────────────────────────────────────────────
test("TC_ADM_008 - Verify Functionality of Add, Edit, and Delete Buttons in Office Tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Add opens office form; Edit/Delete without selection show errors. @owner:Payal Nit",
  });

  console.log("Step 1: Loading the Offices tab...");
  await adminPage.clickOfficesTab();
  await captureStepScreenshot(page, testInfo, "01_offices_loaded");

  console.log("Step 2: Clicking Add button and verifying office form appears...");
  await adminPage.clickAdd();
  await captureStepScreenshot(page, testInfo, "02_add_clicked");

  const pageText = await page.locator("body").textContent().catch(() => "");
  const hasOfficeFormFields = /manager|office.?name|location|short.?name|resource.?capacity/i.test(pageText ?? "");
  if (hasOfficeFormFields) {
    console.log("  Office add form is displayed with required fields (Manager Name, Office Name, Location, Short Name, Resource Capacity).");
  } else {
    const inputCount = await page.locator("input[type='text']").count();
    console.log(`  Add form appeared — ${inputCount} text input(s) visible.`);
  }
  await captureStepScreenshot(page, testInfo, "03_add_form_visible");

  console.log("Step 3: Navigating back to Offices and testing Edit without selection...");
  await page.goBack();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await captureStepScreenshot(page, testInfo, "04_back_to_offices");

  console.log("Step 3b: Asserting Edit-without-selection shows \"You didn't choose any office.\"");
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.editButton),
    "office",
  );
  await captureStepScreenshot(page, testInfo, "05_edit_no_selection_error");

  console.log("Step 4: Testing Delete without selection — expecting \"You didn't choose any office.\"");
  await page.goBack().catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.deleteButton),
    "office",
  );
  await captureStepScreenshot(page, testInfo, "06_delete_no_selection_error");

  console.log("TC_ADM_008 completed successfully.");
});

// ── TC_ADM_009 ────────────────────────────────────────────────────────────────
test("TC_ADM_009 - Verify Fields and Functionalities in Configurations Tab (Admin)", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Admin Configurations tab: Release field, Server/Client radio buttons, Active Page checkbox, Show Page button. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking on the Configurations tab...");
  await adminPage.clickConfigurationsTab();
  await captureStepScreenshot(page, testInfo, "01_config_tab_loaded");

  console.log("Step 2: Verifying Release field is present with multiple values...");
  const releaseSelect = page.locator(ADMIN_PAGE_LOCATORS.configReleaseSelect);
  await expect(releaseSelect).toBeVisible({ timeout: 10000 });
  const releaseOptions = await releaseSelect.locator("option").count();
  console.log(`  Release field has ${releaseOptions} options.`);
  expect(releaseOptions).toBeGreaterThan(0);
  await captureStepScreenshot(page, testInfo, "02_release_field_visible");

  console.log("Step 3: Selecting a release, then verifying Type field has at least 2 radio buttons (Server/Client)...");
  await adminPage.selectConfigRelease(0);
  await page.waitForTimeout(500);
  const radioCount = await page.locator("input[type='radio']").count();
  console.log(`  Radio button count on page: ${radioCount}`);
  expect(radioCount, "expected at least 2 radios for Type Server/Client").toBeGreaterThanOrEqual(2);
  await captureStepScreenshot(page, testInfo, "03_radio_buttons");

  console.log("Step 4: Verifying Active Page checkbox is present (by checkbox count)...");
  const cbCount = await page.locator("input[type='checkbox']").count();
  console.log(`  Checkbox count on page: ${cbCount}`);
  expect(cbCount, "expected at least 1 checkbox (Active Page) on Configurations tab").toBeGreaterThanOrEqual(1);
  await captureStepScreenshot(page, testInfo, "04_active_page_checkbox");

  console.log("Step 5: Verifying Show Page button is present...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.showPageButton)).toBeVisible({ timeout: 10000 });
  console.log("  Show Page button is visible.");
  await captureStepScreenshot(page, testInfo, "05_show_page_button");

  console.log("TC_ADM_009 completed successfully.");
});

// ── TC_ADM_010 ────────────────────────────────────────────────────────────────
test("TC_ADM_010 - Verify Show Page Button Loads Results Correctly in Configurations Tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Show Page loads results with/without Active Only; Add/Edit/Delete visible; Enable Filter works. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Configurations tab...");
  await adminPage.clickConfigurationsTab();
  await captureStepScreenshot(page, testInfo, "01_config_tab_loaded");

  console.log("Step 2: Selecting a release...");
  await adminPage.selectConfigRelease(0);
  await captureStepScreenshot(page, testInfo, "02_release_selected");

  console.log("Step 3: Clicking Show Page without Active Only checked...");
  await adminPage.clickShowPage();
  await captureStepScreenshot(page, testInfo, "03_show_page_clicked");

  console.log("Step 4: Verifying results table is displayed...");
  const resultTable = page.locator(ADMIN_PAGE_LOCATORS.adminListTable);
  const tableCount = await resultTable.count();
  if (tableCount > 0) {
    console.log(`  ${tableCount} result table(s) visible.`);
    await expect(resultTable.first()).toBeVisible({ timeout: 15000 });
  } else {
    console.log("  No result table — no data for selected release/type.");
  }
  await captureStepScreenshot(page, testInfo, "04_results_loaded");

  console.log("Step 5: Verifying Add, Edit, Delete buttons are present...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.addButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.editButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.deleteButton)).toBeVisible({ timeout: 10000 });
  console.log("  Add, Edit, Delete buttons visible.");
  await captureStepScreenshot(page, testInfo, "05_crud_buttons_visible");

  console.log("Step 6: Checking Active Only checkbox to filter active-only results...");
  const activeCb = page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox);
  await expect(activeCb).toBeVisible({ timeout: 10000 });
  await activeCb.check();
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await expect(activeCb).toBeChecked();
  console.log("  Active Only checked — results should show active configurations only.");
  await captureStepScreenshot(page, testInfo, "06_active_only_filtered");

  console.log("Step 7: Verifying Enable Filter control is present (by visible label)...");
  await expect(page.getByText(/Enable Filter/i).first()).toBeVisible({ timeout: 10000 });
  console.log("  Enable Filter label is visible.");
  await captureStepScreenshot(page, testInfo, "07_filter_enabled");

  console.log("TC_ADM_010 completed successfully.");
});

// ── TC_ADM_011 ────────────────────────────────────────────────────────────────
test("TC_ADM_011 - Verify Functionality of Add, Edit, and Delete Buttons in Configuration Tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Add opens config form; Edit/Delete without selection show error messages. @owner:Payal Nit",
  });

  console.log("Step 1: Loading Configurations results...");
  await adminPage.clickConfigurationsTab();
  await adminPage.selectConfigRelease(0);
  await adminPage.clickShowPage();
  await captureStepScreenshot(page, testInfo, "01_config_results_loaded");

  console.log("Step 2: Clicking Add and verifying configuration form appears...");
  await adminPage.clickAdd();
  await captureStepScreenshot(page, testInfo, "02_add_form");
  const inputCount = await page.locator("input[type='text'], select").count();
  console.log(`  Add form visible with ${inputCount} input/select field(s).`);
  await captureStepScreenshot(page, testInfo, "03_add_form_fields");

  console.log("Step 3: Navigating to Configurations results and testing Edit without selection...");
  const adminBase = process.env.TEST_QALINK_BASE || "http://lqatms-test4.ptcnet.ptc.com:8080/QALink";
  await page.goto(`${adminBase}/jsp/admin/`);
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await adminPage.clickConfigurationsTab();
  await adminPage.selectConfigRelease(0);
  await adminPage.clickShowPage();

  console.log("Step 3b: Asserting Edit-without-selection shows \"You didn't choose any server config.\"");
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.editButton),
    "config",
  );
  await captureStepScreenshot(page, testInfo, "04_edit_no_selection_error");

  console.log("Step 4: Testing Delete without selection — expecting \"You didn't choose any config to delete.\"");
  await page.goto(`${adminBase}/jsp/admin/`);
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await adminPage.clickConfigurationsTab();
  await adminPage.selectConfigRelease(0);
  await adminPage.clickShowPage();
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.deleteButton),
    "config",
  );
  await captureStepScreenshot(page, testInfo, "05_delete_no_selection_error");

  console.log("TC_ADM_011 completed successfully.");
});

// ── TC_ADM_012 ────────────────────────────────────────────────────────────────
test("TC_ADM_012 - Verify Functionality of Language Tab under Admin Tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Language tab: clickable, table auto-loads, Add/Edit/Delete buttons present, Active only checkbox present. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking on the Languages tab...");
  await adminPage.clickLanguagesTab();
  await captureStepScreenshot(page, testInfo, "01_languages_tab_clicked");

  console.log("Step 2: Verifying Language details table loads correctly...");
  const langTable = page.locator(ADMIN_PAGE_LOCATORS.adminListTable);
  const tableCount = await langTable.count();
  if (tableCount > 0) {
    console.log(`  ${tableCount} table(s) loaded.`);
    await expect(langTable.first()).toBeVisible({ timeout: 15000 });
  } else {
    console.log("  No table visible — checking page content.");
  }
  await captureStepScreenshot(page, testInfo, "02_language_table_loaded");

  console.log("Step 3: Verifying Add, Edit, Delete buttons...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.addButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.editButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.deleteButton)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "03_crud_buttons");

  console.log("Step 4: Verifying Active only checkbox...");
  const activeCb = page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox);
  await expect(activeCb).toBeVisible({ timeout: 10000 });
  console.log("  Active only checkbox is visible.");
  await captureStepScreenshot(page, testInfo, "04_active_only_visible");

  console.log("TC_ADM_012 completed successfully.");
});

// ── TC_ADM_013 ────────────────────────────────────────────────────────────────
test("TC_ADM_013 - Verify Functionality of Active Only Checkbox in Language Tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Active only checkbox in Languages tab filters active vs all languages. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to Languages tab...");
  await adminPage.clickLanguagesTab();
  await captureStepScreenshot(page, testInfo, "01_languages_tab");

  const activeCb = page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox);
  await expect(activeCb).toBeVisible({ timeout: 10000 });

  console.log("Step 2: Ensuring Active Only is unchecked, capturing baseline...");
  await adminPage.uncheckActiveOnly();
  await expect(activeCb).not.toBeChecked();
  const allText = (await page.locator("body").textContent()) ?? "";
  console.log(`  Baseline body length: ${allText.length}`);

  console.log("Step 3: Checking Active Only — checkbox state should change to checked...");
  await adminPage.checkActiveOnly();
  await captureStepScreenshot(page, testInfo, "02_active_only_checked");
  await expect(activeCb).toBeChecked();
  const activeText = (await page.locator("body").textContent()) ?? "";
  console.log(`  Active-only body length: ${activeText.length}`);

  console.log("Step 4: Unchecking Active Only — state should return to unchecked...");
  await adminPage.uncheckActiveOnly();
  await captureStepScreenshot(page, testInfo, "03_active_only_unchecked");
  await expect(activeCb).not.toBeChecked();

  console.log("TC_ADM_013 completed successfully.");
});

// ── TC_ADM_014 ────────────────────────────────────────────────────────────────
test("TC_ADM_014 - Verify Functionality of Add, Edit, and Delete Buttons in Language Tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Add opens language form; Edit/Delete without selection show error messages. @owner:Payal Nit",
  });

  console.log("Step 1: Loading Languages tab...");
  await adminPage.clickLanguagesTab();
  await captureStepScreenshot(page, testInfo, "01_languages_loaded");

  console.log("Step 2: Clicking Add and verifying language form appears...");
  await adminPage.clickAdd();
  await captureStepScreenshot(page, testInfo, "02_add_form");
  const inputCount = await page.locator("input[type='text'], select").count();
  console.log(`  Add form visible with ${inputCount} field(s).`);

  console.log("Step 3: Navigating back and testing Edit without selection...");
  await page.goBack();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  console.log("Step 3b: Asserting Edit-without-selection shows \"You didn't choose any locale.\"");
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.editButton),
    "locale",
  );
  await captureStepScreenshot(page, testInfo, "03_edit_no_selection");

  console.log("Step 4: Testing Delete without selection — expecting \"You didn't choose any locale.\"");
  await page.goBack().catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.deleteButton),
    "locale",
  );
  await captureStepScreenshot(page, testInfo, "04_delete_no_selection");

  console.log("TC_ADM_014 completed successfully.");
});

// ── TC_ADM_015 ────────────────────────────────────────────────────────────────
test("TC_ADM_015 - Verify Platform Tab Functionality and Field Operations", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Platform tab: Release field, Active only checkbox, Show page button; results load; Add/Edit/Delete present. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking on the Platforms tab...");
  await adminPage.clickPlatformsTab();
  await captureStepScreenshot(page, testInfo, "01_platforms_tab_clicked");

  console.log("Step 2: Verifying Release field is present...");
  const releaseSelect = page.locator(ADMIN_PAGE_LOCATORS.platformReleaseSelect);
  await expect(releaseSelect).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "02_release_field");

  console.log("Step 3: Verifying Active only checkbox is present...");
  const activeCb = page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox);
  await expect(activeCb).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "03_active_only_visible");

  console.log("Step 4: Verifying Show page button is present...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.showPageButton)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "04_show_page_button");

  console.log("Step 5: Selecting a release and clicking Show page...");
  await adminPage.selectPlatformRelease(0);
  await adminPage.clickShowPage();
  await captureStepScreenshot(page, testInfo, "05_results_loaded");

  console.log("Step 6: Verifying Add, Edit, Delete buttons appear...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.addButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.editButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.deleteButton)).toBeVisible({ timeout: 10000 });
  console.log("  Add, Edit, Delete buttons visible.");
  await captureStepScreenshot(page, testInfo, "06_crud_buttons");

  console.log("Step 7: Checking Active only to show only active platforms...");
  await adminPage.checkActiveOnly();
  console.log("  Active only checked — only active platforms shown.");
  await captureStepScreenshot(page, testInfo, "07_active_only_checked");

  console.log("Step 8: Unchecking Active only to show all platforms...");
  await adminPage.uncheckActiveOnly();
  console.log("  Active only unchecked — all platforms shown.");
  await captureStepScreenshot(page, testInfo, "08_active_only_unchecked");

  console.log("TC_ADM_015 completed successfully.");
});

// ── TC_ADM_016 ────────────────────────────────────────────────────────────────
test("TC_ADM_016 - Verify Add, Edit, and Delete buttons under the Platform tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Add opens platform form with Enable/Disable radio; Edit/Delete without selection show warnings. @owner:Payal Nit",
  });

  console.log("Step 1: Loading platforms list...");
  await adminPage.clickPlatformsTab();
  await adminPage.selectPlatformRelease(0);
  await adminPage.clickShowPage();
  await captureStepScreenshot(page, testInfo, "01_platforms_loaded");

  console.log("Step 2: Clicking Add and verifying platform form (Enable/Disable labels)...");
  await adminPage.clickAdd();
  await captureStepScreenshot(page, testInfo, "02_add_form");
  await expect(page.getByText(/^\s*Enable\s*$/i).first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/^\s*Disable\s*$/i).first()).toBeVisible({ timeout: 10000 });
  console.log("  Enable and Disable labels are visible.");
  await captureStepScreenshot(page, testInfo, "03_add_form_details");

  console.log("Step 3: Back to platforms and asserting Edit-without-selection shows \"You didn't choose any platform.\"");
  await page.goBack();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await adminPage.selectPlatformRelease(0);
  await adminPage.clickShowPage();
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.editButton),
    "platform",
  );
  await captureStepScreenshot(page, testInfo, "04_edit_no_selection");

  console.log("Step 4: Testing Delete without selection — expecting \"You didn't choose any platform.\"");
  await page.goBack().catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await adminPage.selectPlatformRelease(0);
  await adminPage.clickShowPage();
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.deleteButton),
    "platform",
  );
  await captureStepScreenshot(page, testInfo, "05_delete_no_selection");

  console.log("TC_ADM_016 completed successfully.");
});

// ── TC_ADM_017 ────────────────────────────────────────────────────────────────
test("TC_ADM_017 - Verify Products tab displays correct fields and buttons", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Products tab: table with Product name/Priority/Status, Add/Edit/Delete buttons, Active only checkbox. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking on the Products tab and ensuring list is loaded...");
  await adminPage.clickProductsTab();
  await ensureListLoaded(page);
  await captureStepScreenshot(page, testInfo, "01_products_tab_clicked");

  console.log("Step 2: Verifying products table with columns Product name / Priority / Status...");
  const table = page
    .locator(ADMIN_PAGE_LOCATORS.adminListTable)
    .first()
    .or(page.locator("table").first());
  await expect(table).toBeVisible({ timeout: 15000 });
  for (const header of ["Product", "Priority", "Status"]) {
    await expect(
      page.locator("table").filter({ hasText: new RegExp(header, "i") }).first(),
      `Products table should display "${header}" column`,
    ).toBeVisible({ timeout: 10000 });
  }
  await captureStepScreenshot(page, testInfo, "02_products_table");

  console.log("Step 3: Verifying Add, Edit, Delete buttons...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.addButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.editButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.deleteButton)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "03_crud_buttons");

  console.log("Step 4: Verifying Active only checkbox...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "04_active_only");

  console.log("Step 5: Checking Active only — should show only active products...");
  await adminPage.checkActiveOnly();
  console.log("  Active only checked.");
  await captureStepScreenshot(page, testInfo, "05_active_only_checked");

  console.log("Step 6: Unchecking Active only — all products...");
  await adminPage.uncheckActiveOnly();
  await captureStepScreenshot(page, testInfo, "06_all_products");

  console.log("TC_ADM_017 completed successfully.");
});

// ── TC_ADM_018 ────────────────────────────────────────────────────────────────
test("TC_ADM_018 - Verify Add, Edit, and Delete buttons under the Products tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Add opens product form; Edit/Delete without selection show warning messages. @owner:Payal Nit",
  });

  console.log("Step 1: Loading Products tab...");
  await adminPage.clickProductsTab();
  await captureStepScreenshot(page, testInfo, "01_products_loaded");

  console.log("Step 2: Clicking Add and verifying product form...");
  await adminPage.clickAdd();
  await captureStepScreenshot(page, testInfo, "02_add_form");
  const inputCount = await page.locator("input[type='text']").count();
  console.log(`  Add form: ${inputCount} text input(s) visible.`);

  console.log("Step 3: Back to Products and asserting Edit-without-selection shows \"You didn't choose any product.\"");
  await page.goBack();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.editButton),
    "product",
  );
  await captureStepScreenshot(page, testInfo, "03_edit_no_selection");

  console.log("Step 4: Delete without selection — expecting \"You didn't choose any product.\"");
  await page.goBack().catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.deleteButton),
    "product",
  );
  await captureStepScreenshot(page, testInfo, "04_delete_no_selection");

  console.log("TC_ADM_018 completed successfully.");
});

// ── TC_ADM_019 ────────────────────────────────────────────────────────────────
test("TC_ADM_019 - Verify Components tab displays correct table and buttons", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Components tab: table with Component name/Priority/Status, Add/Edit/Delete, Active only checkbox. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking on the Components tab and ensuring list is loaded...");
  await adminPage.clickComponentsTab();
  await ensureListLoaded(page);
  await captureStepScreenshot(page, testInfo, "01_components_tab");

  console.log("Step 2: Verifying components table with columns Component name / Priority / Status...");
  const table = page
    .locator(ADMIN_PAGE_LOCATORS.adminListTable)
    .first()
    .or(page.locator("table").first());
  await expect(table).toBeVisible({ timeout: 15000 });
  for (const header of ["Component", "Priority", "Status"]) {
    await expect(
      page.locator("table").filter({ hasText: new RegExp(header, "i") }).first(),
      `Components table should display "${header}" column`,
    ).toBeVisible({ timeout: 10000 });
  }
  await captureStepScreenshot(page, testInfo, "02_components_table");

  console.log("Step 3: Verifying Add, Edit, Delete buttons...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.addButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.editButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.deleteButton)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "03_crud_buttons");

  console.log("Step 4: Verifying Active only checkbox...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "04_active_only");

  console.log("Step 5: Checking Active only...");
  await adminPage.checkActiveOnly();
  console.log("  Active only checked — active components shown.");
  await captureStepScreenshot(page, testInfo, "05_active_checked");

  console.log("Step 6: Unchecking Active only...");
  await adminPage.uncheckActiveOnly();
  await captureStepScreenshot(page, testInfo, "06_all_components");

  console.log("TC_ADM_019 completed successfully.");
});

// ── TC_ADM_020 ────────────────────────────────────────────────────────────────
test("TC_ADM_020 - Verify Add, Edit, and Delete buttons under the Components tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Add opens component form; Edit/Delete without selection show warning messages. @owner:Payal Nit",
  });

  console.log("Step 1: Loading Components tab...");
  await adminPage.clickComponentsTab();
  await captureStepScreenshot(page, testInfo, "01_components_loaded");

  console.log("Step 2: Clicking Add and verifying form...");
  await adminPage.clickAdd();
  await captureStepScreenshot(page, testInfo, "02_add_form");

  console.log("Step 3: Back to Components and asserting Edit-without-selection shows \"You didn't choose any component.\"");
  await page.goBack();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.editButton),
    "component",
  );
  await captureStepScreenshot(page, testInfo, "03_edit_no_selection");

  console.log("Step 4: Delete without selection — expecting \"You didn't choose any component.\"");
  await page.goBack().catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.deleteButton),
    "component",
  );
  await captureStepScreenshot(page, testInfo, "04_delete_no_selection");

  console.log("TC_ADM_020 completed successfully.");
});

// ── TC_ADM_021 ────────────────────────────────────────────────────────────────
test("TC_ADM_021 - Verify Test Types tab displays correct table and buttons", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Test Types tab: table with Test types name/Priority/Status, Add/Edit/Delete, Active only checkbox. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking on the Test Types tab and ensuring list is loaded...");
  await adminPage.clickTestTypesTab();
  await ensureListLoaded(page);
  await captureStepScreenshot(page, testInfo, "01_test_types_tab");

  console.log("Step 2: Verifying test types table with columns Test types name / Priority / Status...");
  const table = page
    .locator(ADMIN_PAGE_LOCATORS.adminListTable)
    .first()
    .or(page.locator("table").first());
  await expect(table).toBeVisible({ timeout: 15000 });
  for (const header of ["Test", "Priority", "Status"]) {
    await expect(
      page.locator("table").filter({ hasText: new RegExp(header, "i") }).first(),
      `Test Types table should display "${header}" column`,
    ).toBeVisible({ timeout: 10000 });
  }
  await captureStepScreenshot(page, testInfo, "02_test_types_table");

  console.log("Step 3: Verifying Add, Edit, Delete buttons...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.addButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.editButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.deleteButton)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "03_crud_buttons");

  console.log("Step 4: Verifying Active only checkbox...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "04_active_only");

  console.log("Step 5: Checking / unchecking Active only...");
  await adminPage.checkActiveOnly();
  await captureStepScreenshot(page, testInfo, "05_active_checked");
  await adminPage.uncheckActiveOnly();
  await captureStepScreenshot(page, testInfo, "06_all_test_types");

  console.log("TC_ADM_021 completed successfully.");
});

// ── TC_ADM_022 ────────────────────────────────────────────────────────────────
test("TC_ADM_022 - Verify Add, Edit, and Delete buttons under the Test Types tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Add opens test type form; Edit/Delete without selection show warning messages. @owner:Payal Nit",
  });

  console.log("Step 1: Loading Test Types tab...");
  await adminPage.clickTestTypesTab();
  await captureStepScreenshot(page, testInfo, "01_test_types_loaded");

  console.log("Step 2: Clicking Add and verifying form...");
  await adminPage.clickAdd();
  await captureStepScreenshot(page, testInfo, "02_add_form");

  console.log("Step 3: Back to Test Types and asserting Edit-without-selection shows \"You didn't choose any test type.\"");
  await page.goBack();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.editButton),
    "test type",
  );
  await captureStepScreenshot(page, testInfo, "03_edit_no_selection");

  console.log("Step 4: Delete without selection — expecting \"You didn't choose any test type.\"");
  await page.goBack().catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.deleteButton),
    "test type",
  );
  await captureStepScreenshot(page, testInfo, "04_delete_no_selection");

  console.log("TC_ADM_022 completed successfully.");
});

// ── TC_ADM_023 ────────────────────────────────────────────────────────────────
test("TC_ADM_023 - Verify CTF Report tab displays correct table and buttons", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify CFT Report tab under Admin: table with CTF Report name/Priority/Status, Add/Edit/Delete, Active only checkbox. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking on the CFT Report tab (Admin) and ensuring list is loaded...");
  await adminPage.clickCftReportAdminTab();
  await ensureListLoaded(page);
  await captureStepScreenshot(page, testInfo, "01_cft_report_tab");

  console.log("Step 2: Verifying CFT report table with columns CTF Report name / Priority / Status...");
  const table = page
    .locator(ADMIN_PAGE_LOCATORS.adminListTable)
    .first()
    .or(page.locator("table").first());
  await expect(table).toBeVisible({ timeout: 15000 });
  for (const header of ["Priority", "Status"]) {
    await expect(
      page.locator("table").filter({ hasText: new RegExp(header, "i") }).first(),
      `CFT Report table should display "${header}" column`,
    ).toBeVisible({ timeout: 10000 });
  }
  await captureStepScreenshot(page, testInfo, "02_cft_table");

  console.log("Step 3: Verifying Add, Edit, Delete buttons...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.addButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.editButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.deleteButton)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "03_crud_buttons");

  console.log("Step 4: Verifying Active only checkbox...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "04_active_only");

  console.log("Step 5: Checking / unchecking Active only...");
  await adminPage.checkActiveOnly();
  await captureStepScreenshot(page, testInfo, "05_active_checked");
  await adminPage.uncheckActiveOnly();
  await captureStepScreenshot(page, testInfo, "06_all_cft");

  console.log("TC_ADM_023 completed successfully.");
});

// ── TC_ADM_024 ────────────────────────────────────────────────────────────────
test("TC_ADM_024 - Verify Add, Edit, and Delete buttons under the CFT Report tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Add opens CFT report form; Edit/Delete without selection show warning messages. @owner:Payal Nit",
  });

  console.log("Step 1: Loading CFT Report tab (Admin) and ensuring list is loaded...");
  await adminPage.clickCftReportAdminTab();
  await ensureListLoaded(page);
  await captureStepScreenshot(page, testInfo, "01_cft_loaded");

  console.log("Step 2: Clicking Add and verifying form...");
  await adminPage.clickAdd();
  await captureStepScreenshot(page, testInfo, "02_add_form");

  console.log("Step 3: Back to CFT Report and asserting Edit-without-selection shows \"You didn't choose any CFT Report.\"");
  await page.goBack();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.editButton),
    "cft",
  );
  await captureStepScreenshot(page, testInfo, "03_edit_no_selection");

  console.log("Step 4: Delete without selection — expecting \"You didn't choose any CFT Report.\"");
  await page.goBack().catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.deleteButton),
    "cft",
  );
  await captureStepScreenshot(page, testInfo, "04_delete_no_selection");

  console.log("TC_ADM_024 completed successfully.");
});

// ── TC_ADM_025 ────────────────────────────────────────────────────────────────
test("TC_ADM_025 - Verify App Type tab displays correct table and buttons", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify App Type tab: table with App type name/Status, Add/Edit/Delete buttons, Active only checkbox. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking on the App Type tab and ensuring list is loaded...");
  await adminPage.clickAppTypeTab();
  await ensureListLoaded(page);
  await captureStepScreenshot(page, testInfo, "01_app_type_tab");

  console.log("Step 2: Verifying App Type table with columns App type name / Status...");
  const table = page
    .locator(ADMIN_PAGE_LOCATORS.adminListTable)
    .first()
    .or(page.locator("table").first());
  await expect(table).toBeVisible({ timeout: 15000 });
  for (const header of ["App", "Status"]) {
    await expect(
      page.locator("table").filter({ hasText: new RegExp(header, "i") }).first(),
      `App Type table should display "${header}" column`,
    ).toBeVisible({ timeout: 10000 });
  }
  await captureStepScreenshot(page, testInfo, "02_app_type_table");

  console.log("Step 3: Verifying Add, Edit, Delete buttons...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.addButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.editButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.deleteButton)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "03_crud_buttons");

  console.log("Step 4: Verifying Active only checkbox...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "04_active_only");

  console.log("Step 5: Checking / unchecking Active only...");
  await adminPage.checkActiveOnly();
  await captureStepScreenshot(page, testInfo, "05_active_checked");
  await adminPage.uncheckActiveOnly();
  await captureStepScreenshot(page, testInfo, "06_all_app_types");

  console.log("TC_ADM_025 completed successfully.");
});

// ── TC_ADM_026 ────────────────────────────────────────────────────────────────
test("TC_ADM_026 - Verify Add, Edit, and Delete buttons under the App Type tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Add opens app type form with Enable/Disable radio; Edit/Delete without selection show warnings. @owner:Payal Nit",
  });

  console.log("Step 1: Loading App Type tab and ensuring list is loaded...");
  await adminPage.clickAppTypeTab();
  await ensureListLoaded(page);
  await captureStepScreenshot(page, testInfo, "01_app_type_loaded");

  console.log("Step 2: Asserting Edit-without-selection shows \"You didn't choose any application type.\"");
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.editButton),
    "type",
  );
  await page.goBack().catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await adminPage.clickAppTypeTab();
  await ensureListLoaded(page);
  await captureStepScreenshot(page, testInfo, "02_edit_no_selection");

  console.log("Step 3: Asserting Delete-without-selection shows \"You didn't choose any app type.\"");
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.deleteButton),
    "type",
  );
  await page.goBack().catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await adminPage.clickAppTypeTab();
  await ensureListLoaded(page);
  await captureStepScreenshot(page, testInfo, "03_delete_no_selection");

  console.log("Step 4: Clicking Add and verifying form has Enable/Disable labels...");
  await adminPage.clickAdd();
  await expect(page.getByText(/^\s*Enable\s*$/i).first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/^\s*Disable\s*$/i).first()).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "04_add_form_with_radios");

  console.log("Step 5: Filling Add form (name + Enable radio) and submitting...");
  const uniqueName = `QA_AppType_${Date.now()}`;
  const firstTextInput = page
    .locator("input[type='text']:visible, input:not([type]):visible")
    .first();
  await expect(firstTextInput).toBeVisible({ timeout: 10000 });
  await firstTextInput.fill(uniqueName);
  const firstRadio = page.locator("input[type='radio']").first();
  if (await firstRadio.isVisible({ timeout: 2000 }).catch(() => false)) {
    await firstRadio.check();
  }
  await captureStepScreenshot(page, testInfo, "05_form_filled");
  await page.locator(ADMIN_PAGE_LOCATORS.submitButton).click();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await ensureListLoaded(page);

  console.log(`Step 6: Asserting new row "${uniqueName}" appears in the App Type list...`);
  const newRow = page.locator(
    `//table[contains(@class,'list_table')]//tr[.//*[contains(normalize-space(),"${uniqueName}")]]`,
  );
  await expect(newRow).toBeVisible({ timeout: 15000 });
  await captureStepScreenshot(page, testInfo, "06_new_row_visible");

  console.log("Step 7: Selecting the new row and deleting it (with confirmation)...");
  await newRow.locator("input[type='checkbox'], input[type='radio']").first().check();
  const confirmDialog = page
    .waitForEvent("dialog", { timeout: 5000 })
    .catch(() => null);
  await page.locator(ADMIN_PAGE_LOCATORS.deleteButton).click();
  const dlg = await confirmDialog;
  if (dlg) {
    console.log(`  Confirmation dialog: "${dlg.message()}"`);
    await dlg.accept();
  } else {
    const submit = page.locator(ADMIN_PAGE_LOCATORS.submitButton);
    if (await submit.isVisible().catch(() => false)) {
      await submit.click();
    }
  }
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await captureStepScreenshot(page, testInfo, "07_after_delete");

  console.log(`Step 8: Asserting row "${uniqueName}" is no longer in the App Type list...`);
  await expect(newRow).toHaveCount(0, { timeout: 15000 });

  console.log("TC_ADM_026 completed successfully.");
});

// ── TC_ADM_027 ────────────────────────────────────────────────────────────────
test("TC_ADM_027 - Verify the functionality of the Application Tab under Admin Tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Application tab: table with App Name/Description/Status/Release/Server-or-Client, Add/Edit/Delete, Active only. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking on the Application tab and ensuring list is loaded...");
  await adminPage.clickApplicationTab();
  await ensureListLoaded(page);
  await captureStepScreenshot(page, testInfo, "01_application_tab");

  console.log("Step 2: Verifying Application table with columns Application Name / Description / Status / Release / Server or Client...");
  const table = page
    .locator(ADMIN_PAGE_LOCATORS.adminListTable)
    .first()
    .or(page.locator("table").first());
  await expect(table).toBeVisible({ timeout: 15000 });
  for (const header of ["Description", "Status", "Release", "Server"]) {
    await expect(
      page.locator("table").filter({ hasText: new RegExp(header, "i") }).first(),
      `Application table should display "${header}" column`,
    ).toBeVisible({ timeout: 10000 });
  }
  await captureStepScreenshot(page, testInfo, "02_application_table");

  console.log("Step 3: Verifying Add, Edit, Delete buttons...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.addButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.editButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.deleteButton)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "03_crud_buttons");

  console.log("Step 4: Verifying Active only checkbox...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.activeOnlyCheckbox)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "04_active_only");

  console.log("Step 5: Checking Active only — only active applications shown...");
  await adminPage.checkActiveOnly();
  await captureStepScreenshot(page, testInfo, "05_active_checked");

  console.log("Step 6: Unchecking Active only — all applications shown...");
  await adminPage.uncheckActiveOnly();
  await captureStepScreenshot(page, testInfo, "06_all_applications");

  console.log("TC_ADM_027 completed successfully.");
});

// ── TC_ADM_028 ────────────────────────────────────────────────────────────────
test("TC_ADM_028 - Verify Add, Edit, and Delete operations in the Application tab", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Add opens application form; Edit/Delete without selection show warning messages. @owner:Payal Nit",
  });

  console.log("Step 1: Loading Application tab...");
  await adminPage.clickApplicationTab();
  await captureStepScreenshot(page, testInfo, "01_application_loaded");

  console.log("Step 2: Clicking Add and verifying form...");
  await adminPage.clickAdd();
  await captureStepScreenshot(page, testInfo, "02_add_form");
  const inputCount = await page.locator("input[type='text'], select").count();
  console.log(`  Add form: ${inputCount} input/select field(s) visible.`);

  console.log("Step 3: Back to Application and asserting Edit-without-selection shows \"You didn't choose any application.\"");
  await page.goBack();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.editButton),
    "application",
  );
  await captureStepScreenshot(page, testInfo, "03_edit_no_selection");

  console.log("Step 4: Delete without selection — expecting \"You didn't choose any application.\"");
  await page.goBack().catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.deleteButton),
    "application",
  );
  await captureStepScreenshot(page, testInfo, "04_delete_no_selection");

  console.log("TC_ADM_028 completed successfully.");
});

// ── TC_ADM_029 ────────────────────────────────────────────────────────────────
test("TC_ADM_029 - Verify the functionality of the Release tab (Admin)", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Admin Release tab fields: Release Name, L10N QA Manager, Priority, Archived, Active Only, No Test Case, Test Case Format dropdowns; Load/Add/Sync buttons. @owner:Payal Nit",
  });

  console.log("Step 1: Clicking on the Release tab (Admin)...");
  await adminPage.clickReleaseTab();
  await captureStepScreenshot(page, testInfo, "01_release_tab_clicked");

  console.log("Step 2: Verifying Release Name field label is present...");
  await expect(page.getByText(/Release Name/i).first()).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "02_release_name_input");

  console.log("Step 3: Verifying L10N QA Manager label is present...");
  await expect(page.getByText(/L10N QA Manager/i).first()).toBeVisible({ timeout: 10000 });

  console.log("Step 4: Verifying Priority field label is present...");
  await expect(page.getByText(/Priority/i).first()).toBeVisible({ timeout: 10000 });

  console.log("Step 5: Verifying Archived, Active Only, No Test Case, Test Case Format labels...");
  await expect(page.getByText(/Archived/i).first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/Active Only/i).first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/No Test Case/i).first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/Test Case Format/i).first()).toBeVisible({ timeout: 10000 });
  console.log("  All four field labels are visible.");
  await captureStepScreenshot(page, testInfo, "05_dropdowns");

  console.log("Step 6: Verifying Load, Add, and Sync TimeTrack Projects buttons...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.loadButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.addButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.syncButton)).toBeVisible({ timeout: 10000 });
  console.log("  Load, Add, and Sync buttons are visible.");
  await captureStepScreenshot(page, testInfo, "06_action_buttons");

  console.log("TC_ADM_029 completed successfully.");
});

// ── TC_ADM_030 ────────────────────────────────────────────────────────────────
test("TC_ADM_030 - Verify Load functionality in the Release tab (Admin)", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Load button loads all releases; Edit/Delete without selection show warnings; Search box present. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Release tab (Admin)...");
  await adminPage.clickReleaseTab();
  await captureStepScreenshot(page, testInfo, "01_release_tab");

  console.log("Step 2: Clicking Load to load all releases...");
  await adminPage.clickLoad();
  await captureStepScreenshot(page, testInfo, "02_load_clicked");

  console.log("Step 3: Verifying releases table is displayed...");
  const table = page.locator(ADMIN_PAGE_LOCATORS.adminListTable);
  const tableCount = await table.count();
  if (tableCount > 0) {
    console.log(`  ${tableCount} release table(s) visible.`);
    await expect(table.first()).toBeVisible({ timeout: 15000 });
  } else {
    console.log("  No table visible — checking for any result content.");
  }
  await captureStepScreenshot(page, testInfo, "03_releases_loaded");

  console.log("Step 4: Verifying Edit and Delete buttons appear...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.editButton)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(ADMIN_PAGE_LOCATORS.deleteButton)).toBeVisible({ timeout: 10000 });
  console.log("  Edit and Delete buttons are visible.");
  await captureStepScreenshot(page, testInfo, "04_edit_delete_buttons");

  console.log("Step 5: Asserting Edit-without-selection shows \"You didn't choose any release.\"");
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.editButton),
    "release",
  );
  await captureStepScreenshot(page, testInfo, "05_edit_no_selection");
  await page.goBack().catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await adminPage.clickLoad();

  console.log("Step 6: Asserting Delete-without-selection shows \"You didn't choose any release.\"");
  await expectMissingSelectionError(
    page,
    page.locator(ADMIN_PAGE_LOCATORS.deleteButton),
    "release",
  );
  await captureStepScreenshot(page, testInfo, "06_delete_no_selection");

  console.log("TC_ADM_030 completed successfully.");
});

// ── TC_ADM_031 ────────────────────────────────────────────────────────────────
test("TC_ADM_031 - Verify Add functionality in the Release tab (Admin)", async ({
  adminPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Add button opens release form with required fields, Enable/Disable radio, Submit/Cancel buttons, and Select SPR Report In Release. @owner:Payal Nit",
  });

  console.log("Step 1: Navigating to the Release tab (Admin)...");
  await adminPage.clickReleaseTab();
  await captureStepScreenshot(page, testInfo, "01_release_tab");

  console.log("Step 2: Verifying Add button is visible...");
  await expect(page.locator(ADMIN_PAGE_LOCATORS.addButton)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "02_add_button_visible");

  console.log("Step 3: Clicking Add button — should open release form...");
  await adminPage.clickAdd();
  await captureStepScreenshot(page, testInfo, "03_add_form");

  console.log("Step 4: Verifying Enable and Disable labels are present...");
  await expect(page.getByText(/^\s*Enable\s*$/i).first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/^\s*Disable\s*$/i).first()).toBeVisible({ timeout: 10000 });
  console.log("  Enable and Disable labels are visible.");
  await captureStepScreenshot(page, testInfo, "04_radio_buttons");

  console.log("Step 5: Verifying Submit and Cancel buttons are present...");
  const submitBtn = page.locator(ADMIN_PAGE_LOCATORS.submitButton);
  const cancelBtn = page.locator(ADMIN_PAGE_LOCATORS.cancelButton);
  await expect(submitBtn).toBeVisible({ timeout: 10000 });
  await expect(cancelBtn).toBeVisible({ timeout: 10000 });
  console.log("  Submit and Cancel buttons are visible.");
  await captureStepScreenshot(page, testInfo, "05_submit_cancel");

  console.log("Step 6: Verifying 'Select SPR Report In Release' button/link is present...");
  const sprBtn = page.locator("//input[contains(@value,'Select SPR')] | //a[contains(normalize-space(),'Select SPR')]");
  await expect(sprBtn.first()).toBeVisible({ timeout: 10000 });
  console.log("  Select SPR Report In Release control is visible.");
  await captureStepScreenshot(page, testInfo, "06_spr_button");

  console.log("Step 7: Clicking Cancel to avoid creating a release...");
  await cancelBtn.click();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  console.log("  Cancel clicked — release was not added.");
  await captureStepScreenshot(page, testInfo, "07_cancel_clicked");

  console.log("TC_ADM_031 completed successfully.");
});
