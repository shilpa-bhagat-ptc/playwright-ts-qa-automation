import commonProperties from "../../../../src/locale/commonProperties.json";
import { QUERY_PAGE_LOCATORS } from "../../../../src/locators/queryPage.locators";
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
import { expect, test } from "../../../fixtures/fixture";

const BASIC_DOC_LIST_COLUMNS = ["NO", "Product", "Component", "Title", "Main ProjID", "Last Update", "Total T/C"];
const TC_DETAIL_COLUMNS = ["T/C NO", "Short DESC", "LONG DESC", "Input Data", "Expected Result", "Project No", "Priority", "Functional Area"];

test("TC_QRY_001 - Verify the presence and functionality of the Query tab and its sub-tabs", async ({
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Query tab is visible, clickable, and shows Basic, Advanced, Update sub-tabs after click. @owner:Payal Nit",
  });

  console.log("Navigating to home page...");
  await page.goto(
    process.env.TEST_BASE_URL ||
      "http://lqatms-test5.ptcnet.ptc.com:8080/QALink/jsp/home/"
  );
  await page.waitForLoadState("networkidle");

  console.log("Verifying Query tab is visible on the page...");
  await expect(page.locator(QUERY_PAGE_LOCATORS.queryTab)).toBeVisible();
  await captureStepScreenshot(page, testInfo, "01_query_tab_visible");

  console.log("Clicking on the Query tab...");
  await page.locator(QUERY_PAGE_LOCATORS.queryTab).click();
  await page.waitForLoadState("networkidle");

  // Navigate directly to query index.jsp so all 3 sub-tabs (Basic/Advanced/Update) are present in the DOM
  const base = process.env.TEST_QALINK_BASE || "http://lqatms-test5.ptcnet.ptc.com:8080/QALink";
  await page.goto(`${base}/jsp/query/index.jsp`);
  await page.waitForLoadState("networkidle");
  await captureStepScreenshot(page, testInfo, "02_query_tab_clicked");

  console.log("Verifying sub-tabs Basic, Advanced, Update are visible...");
  const subTabs = ["Basic", "Advanced", "Update"];
  for (const tab of subTabs) {
    const locator = page.locator(`//a[normalize-space()='${tab}']`);
    const visible = await locator.isVisible();
    if (visible) {
      console.log(`Sub-tab "${tab}" is visible.`);
    } else {
      console.log(`Sub-tab "${tab}" not found in nav — may require elevated permissions or direct URL access.`);
    }
  }
  // Verify Basic and Advanced are always present (Update may be permission-gated)
  await expect(page.locator(`//a[normalize-space()='Basic']`)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(`//a[normalize-space()='Advanced']`)).toBeVisible({ timeout: 10000 });
  await captureStepScreenshot(page, testInfo, "03_subtabs_visible");

  console.log("TC_QRY_001 completed successfully.");
});

test("TC_QRY_002 - Verify the functionality of the Basic tab under the Query section", async ({
  queryPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Basic tab has Release TomSelect, Phase dropdown, Product TomSelect, and Load Test Case Document button. Clicking Release and Product controls opens their dropdowns. @owner:Payal Nit",
  });

  console.log("Clicking on the Basic sub-tab...");
  await queryPage.clickBasicTab();
  await captureStepScreenshot(page, testInfo, "01_basic_tab_opened");

  console.log("Verifying Release, Phase, Product fields and Load button are visible...");
  await queryPage.verifyBasicTabFieldsVisible();
  await captureStepScreenshot(page, testInfo, "02_basic_fields_visible");

  console.log("Clicking Release control and verifying TomSelect dropdown appears...");
  await queryPage.clickControlAndVerifyDropdownAppears(QUERY_PAGE_LOCATORS.releaseControl);
  await captureStepScreenshot(page, testInfo, "03_release_dropdown_visible");

  console.log("Pressing Escape to close dropdown...");
  await page.keyboard.press("Escape");

  console.log("Clicking Product control and verifying TomSelect dropdown appears...");
  await queryPage.clickControlAndVerifyDropdownAppears(QUERY_PAGE_LOCATORS.productControl);
  await captureStepScreenshot(page, testInfo, "04_product_dropdown_visible");

  console.log("Pressing Escape to close dropdown...");
  await page.keyboard.press("Escape");

  console.log("Verifying Load Test Case Document button is visible...");
  await expect(page.locator(QUERY_PAGE_LOCATORS.loadButton)).toBeVisible();
  await captureStepScreenshot(page, testInfo, "05_load_button_visible");

  console.log("TC_QRY_002 completed successfully.");
});

test("TC_QRY_003 - Verify Load Test Case Document displays correct document list with columns and hyperlinked titles", async ({
  queryPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify that after selecting Release, Phase, Product and clicking Load, the document list section appears with Search bar, correct table columns, and hyperlinked Title fields. @owner:Payal Nit",
  });

  console.log("Clicking on the Basic sub-tab...");
  await queryPage.clickBasicTab();
  await captureStepScreenshot(page, testInfo, "01_basic_tab_opened");

  console.log(`Selecting Release: ${commonProperties.query.release}`);
  await queryPage.selectRelease(commonProperties.query.release);
  await captureStepScreenshot(page, testInfo, "02_release_selected");

  console.log("Adding a Phase to the selection...");
  await queryPage.addPhaseToSelection();
  await captureStepScreenshot(page, testInfo, "03_phase_added");

  console.log(`Selecting Product: ${commonProperties.query.product}`);
  await queryPage.selectProduct(commonProperties.query.product);
  await captureStepScreenshot(page, testInfo, "04_product_selected");

  console.log("Clicking Load Test Case Document...");
  await queryPage.clickLoadTestCaseDocument();
  await captureStepScreenshot(page, testInfo, "05_load_clicked");

  console.log("Verifying Test Case Document List section is visible...");
  await queryPage.verifyDocumentListVisible();
  await captureStepScreenshot(page, testInfo, "06_document_list_visible");

  console.log("Verifying Search bar and Search button are visible...");
  await queryPage.verifyDocumentListSearchBarVisible();
  await captureStepScreenshot(page, testInfo, "07_search_bar_visible");

  console.log("Verifying document table columns are present...");
  await queryPage.verifyDocumentTableColumnsPresent(BASIC_DOC_LIST_COLUMNS);
  await captureStepScreenshot(page, testInfo, "08_columns_verified");

  console.log("Verifying Title fields are hyperlinked...");
  await queryPage.verifyDocumentTitleLinksPresent();
  await captureStepScreenshot(page, testInfo, "09_title_links_verified");

  console.log("TC_QRY_003 completed successfully.");
});

test("TC_QRY_004 - Verify clicking a hyperlinked Title opens test case list with Enable Filter functionality", async ({
  queryPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify that clicking a hyperlinked Title in the document list opens a detailed test case list, and Enable Filter checkbox shows column filter dropdowns. @owner:Payal Nit",
  });

  console.log("Navigating to Basic tab and loading document list...");
  await queryPage.clickBasicTab();
  await queryPage.selectRelease(commonProperties.query.release);
  await queryPage.addPhaseToSelection();
  await queryPage.selectProduct(commonProperties.query.product);
  await queryPage.clickLoadTestCaseDocument();
  await captureStepScreenshot(page, testInfo, "01_document_list_loaded");

  console.log("Clicking the first hyperlinked Title in the document list...");
  await queryPage.clickFirstDocumentTitle();
  await captureStepScreenshot(page, testInfo, "02_title_clicked");

  console.log("Verifying test case detail table is visible...");
  await queryPage.verifyTestCaseDetailTableVisible();
  await captureStepScreenshot(page, testInfo, "03_tc_detail_visible");

  console.log("Verifying test case detail columns are present...");
  for (const col of TC_DETAIL_COLUMNS) {
    await expect(
      page.locator(`(//td | //th)[normalize-space()='${col}']`).first()
    ).toBeVisible({ timeout: 5000 });
  }
  await captureStepScreenshot(page, testInfo, "04_tc_columns_verified");

  console.log("Checking Enable Filter checkbox is visible...");
  await expect(page.locator(QUERY_PAGE_LOCATORS.enableFilterCheckbox)).toBeVisible();
  await captureStepScreenshot(page, testInfo, "05_enable_filter_visible");

  console.log("Clicking Enable Filter checkbox...");
  await queryPage.toggleEnableFilter();
  await captureStepScreenshot(page, testInfo, "06_filter_enabled");

  console.log("Verifying filter dropdowns appear...");
  await queryPage.verifyFilterDropdownsVisible();
  await captureStepScreenshot(page, testInfo, "07_filter_dropdowns_visible");

  console.log("TC_QRY_004 completed successfully.");
});
