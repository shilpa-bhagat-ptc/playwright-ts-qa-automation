import commonProperties from "../../../../src/locale/commonProperties.json";
import { QUERY_PAGE_LOCATORS } from "../../../../src/locators/queryPage.locators";
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
import { expect, test } from "../../../fixtures/fixture";

const UPDATE_LIST_COLUMNS = [
  "Release", "Phase", "Product", "Component", "Title",
  "Duplicate", "Main ProjID", "Complexity", "QA Author",
  "Last Update", "Total T/C", "Review Status", "Review Comment",
];
const REVIEW_STATUS_OPTIONS = ["In Review", "Reviewed", "Ready for Run", "Not Localization"];

async function loadUpdateQueryList(queryPage: any, page: any) {
  await queryPage.clickUpdateTab();
  await queryPage.selectRelease(commonProperties.query.release);
  await queryPage.addPhaseToSelection();
  await queryPage.selectProduct(commonProperties.query.product);
  await queryPage.clickLoadTestCaseDocument();
}

test("TC_QRY_005 - Verify the Update tab fields and component/phase transfer arrows", async ({
  queryPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify Update tab has Release, Product, Component (with >> << arrows), Phase (with >> << arrows), and Load Test Case Document button. @owner:Payal Nit",
  });

  console.log("Clicking on the Update sub-tab...");
  await queryPage.clickUpdateTab();
  await captureStepScreenshot(page, testInfo, "01_update_tab_opened");

  console.log("Verifying all Update tab fields are visible...");
  await queryPage.verifyUpdateTabFieldsVisible();
  await captureStepScreenshot(page, testInfo, "02_update_fields_visible");

  console.log("Clicking Release control and verifying TomSelect dropdown opens...");
  await queryPage.clickControlAndVerifyDropdownAppears(QUERY_PAGE_LOCATORS.releaseControl);
  await captureStepScreenshot(page, testInfo, "03_release_dropdown_visible");
  await page.keyboard.press("Escape");

  console.log("Clicking Product control and verifying TomSelect dropdown opens...");
  await queryPage.clickControlAndVerifyDropdownAppears(QUERY_PAGE_LOCATORS.productControl);
  await captureStepScreenshot(page, testInfo, "04_product_dropdown_visible");
  await page.keyboard.press("Escape");

  console.log(`Selecting Release: ${commonProperties.query.release}`);
  await queryPage.selectRelease(commonProperties.query.release);
  await captureStepScreenshot(page, testInfo, "05_release_selected");

  console.log("Verifying Component dropdown is visible...");
  await expect(page.locator(QUERY_PAGE_LOCATORS.componentControl)).toBeVisible();
  await captureStepScreenshot(page, testInfo, "06_component_visible");

  console.log("Adding a Component using >> arrow...");
  await queryPage.addComponentToSelection();
  await captureStepScreenshot(page, testInfo, "07_component_added");

  console.log("Removing Component using << arrow...");
  await queryPage.removeComponentFromSelection();
  await captureStepScreenshot(page, testInfo, "08_component_removed");

  console.log("Verifying Phase dropdown is populated after Release selection...");
  await expect(page.locator(QUERY_PAGE_LOCATORS.phaseSelect)).toBeVisible();
  await captureStepScreenshot(page, testInfo, "09_phase_visible");

  console.log("Adding a Phase using >> arrow...");
  await queryPage.addPhaseToSelection();
  await captureStepScreenshot(page, testInfo, "10_phase_added");

  console.log("Removing Phase using << arrow...");
  await queryPage.removePhaseFromSelection();
  await captureStepScreenshot(page, testInfo, "11_phase_removed");

  console.log("Verifying Load Test Case Document button is visible...");
  await expect(page.locator(QUERY_PAGE_LOCATORS.loadButton)).toBeVisible();
  await captureStepScreenshot(page, testInfo, "12_load_button_visible");

  console.log("TC_QRY_005 completed successfully.");
});

test("TC_QRY_006 - Verify Test Case Document Query List loads with correct columns and action links", async ({
  queryPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify that after clicking Load on Update tab, the Query List section shows all table columns, hyperlinked Title, Review Status, Duplicate links, and Update button. @owner:Payal Nit",
  });

  console.log("Navigating to Update tab and loading document list...");
  await loadUpdateQueryList(queryPage, page);
  await captureStepScreenshot(page, testInfo, "01_query_list_loaded");

  console.log("Verifying Test Case Document Query List section is visible...");
  await queryPage.verifyQueryListVisible();
  await captureStepScreenshot(page, testInfo, "02_query_list_visible");

  console.log("Verifying all table columns are present...");
  await queryPage.verifyQueryListColumnsPresent(UPDATE_LIST_COLUMNS);
  await captureStepScreenshot(page, testInfo, "03_columns_verified");

  console.log("Verifying Title hyperlinks are present...");
  await queryPage.verifyQueryListTitleLinksPresent();
  await captureStepScreenshot(page, testInfo, "04_title_links_present");

  console.log("Verifying Review Status hyperlinks are present...");
  await queryPage.verifyQueryListReviewLinksPresent();
  await captureStepScreenshot(page, testInfo, "05_review_links_present");

  console.log("Verifying Duplicate hyperlinks are present...");
  await queryPage.verifyQueryListDuplicateLinksPresent();
  await captureStepScreenshot(page, testInfo, "06_duplicate_links_present");

  console.log("Verifying Update button is visible...");
  await queryPage.verifyUpdateButtonVisible();
  await captureStepScreenshot(page, testInfo, "07_update_button_visible");

  console.log("TC_QRY_006 completed successfully.");
});

test("TC_QRY_007 - Verify Review link opens test case detail with Edit overlay, Save All, and Enable Filter", async ({
  queryPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify clicking Review link opens detailed test case view with Edit overlay, Save All button, and Enable Filter dropdown functionality. @owner:Payal Nit",
  });

  console.log("Navigating to Update tab and loading document list...");
  await loadUpdateQueryList(queryPage, page);
  await captureStepScreenshot(page, testInfo, "01_query_list_loaded");

  console.log("Clicking the Review Status hyperlink...");
  await queryPage.clickReviewLink();
  await captureStepScreenshot(page, testInfo, "02_review_page_opened");

  console.log("Verifying test case detail table is visible...");
  await queryPage.verifyTestCaseDetailTableVisible();
  await captureStepScreenshot(page, testInfo, "03_tc_detail_visible");

  console.log("Clicking the Edit link for the first test case...");
  await queryPage.clickEditLinkInReviewPage();
  await captureStepScreenshot(page, testInfo, "04_edit_clicked");

  console.log("Verifying Test Case Update overlay is visible...");
  await queryPage.verifyTcUpdateOverlayVisible();
  await captureStepScreenshot(page, testInfo, "05_overlay_visible");

  console.log("Saving and closing the overlay...");
  await queryPage.closeTcUpdateOverlay();
  await captureStepScreenshot(page, testInfo, "06_overlay_closed");

  console.log("Verifying Save All button is visible...");
  await queryPage.verifySaveAllButtonVisible();
  await captureStepScreenshot(page, testInfo, "07_save_all_visible");

  console.log("Clicking Save All...");
  await queryPage.clickSaveAll();
  await captureStepScreenshot(page, testInfo, "08_save_all_clicked");

  console.log("Verifying Enable Filter checkbox is visible...");
  await expect(page.locator(QUERY_PAGE_LOCATORS.enableFilterCheckbox)).toBeVisible();
  await captureStepScreenshot(page, testInfo, "09_enable_filter_visible");

  console.log("Enabling filter and verifying filter dropdowns appear...");
  await queryPage.toggleEnableFilter();
  await queryPage.verifyFilterDropdownsVisible();
  await captureStepScreenshot(page, testInfo, "10_filter_dropdowns_visible");

  console.log("TC_QRY_007 completed successfully.");
});

test("TC_QRY_008 - Verify Update button opens Update List with editable fields and Review Status dropdown values", async ({
  queryPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify clicking Update button opens Test Case Document Update List with editable fields and correct Review Status options: In review, Reviewed, Ready to Run, Not Localized. @owner:Payal Nit",
  });

  console.log("Navigating to Update tab and loading document list...");
  await loadUpdateQueryList(queryPage, page);
  await captureStepScreenshot(page, testInfo, "01_query_list_loaded");

  console.log("Clicking the Update button...");
  await queryPage.clickUpdateButton();
  await captureStepScreenshot(page, testInfo, "02_update_clicked");

  console.log("Verifying Test Case Document Update List section is visible...");
  await queryPage.verifyUpdateListVisible();
  await captureStepScreenshot(page, testInfo, "03_update_list_visible");

  console.log("Verifying update list table is visible...");
  await expect(page.locator(QUERY_PAGE_LOCATORS.updateListTable)).toBeVisible();
  await captureStepScreenshot(page, testInfo, "04_table_visible");

  console.log("Verifying Review Status dropdown has correct options...");
  await queryPage.verifyReviewStatusDropdownOptions(REVIEW_STATUS_OPTIONS);
  await captureStepScreenshot(page, testInfo, "05_review_status_verified");

  console.log("Verifying Save All button is visible...");
  await queryPage.verifySaveAllButtonVisible();
  await captureStepScreenshot(page, testInfo, "06_save_all_visible");

  console.log("Clicking Save All...");
  await queryPage.clickSaveAll();
  await captureStepScreenshot(page, testInfo, "07_save_all_clicked");

  console.log("TC_QRY_008 completed successfully.");
});

test("TC_QRY_009 - Verify Duplicate hyperlink opens overlay and duplicates document to target release and phase", async ({
  queryPage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Verify clicking Duplicate link opens overlay with Release, Phase fields and Duplicate button, and submitting duplicates the document to the selected target. @owner:Payal Nit",
  });

  console.log("Navigating to Update tab and loading document list...");
  await loadUpdateQueryList(queryPage, page);
  await captureStepScreenshot(page, testInfo, "01_query_list_loaded");

  console.log("Clicking the Duplicate hyperlink for the first document...");
  await queryPage.clickDuplicateLink();
  await captureStepScreenshot(page, testInfo, "02_duplicate_clicked");

  console.log("Verifying Duplicate overlay title is visible...");
  await queryPage.verifyDuplicateOverlayVisible();
  await captureStepScreenshot(page, testInfo, "03_overlay_visible");

  console.log("Verifying overlay has Release, Phase, and Duplicate button...");
  await queryPage.verifyDuplicateOverlayFieldsVisible();
  await captureStepScreenshot(page, testInfo, "04_overlay_fields_visible");

  console.log(`Selecting target Release: ${commonProperties.query.targetRelease}`);
  await queryPage.selectDuplicateTargetRelease(commonProperties.query.targetRelease);
  await captureStepScreenshot(page, testInfo, "05_target_release_selected");

  console.log(`Selecting target Phase: ${commonProperties.query.targetPhase}`);
  await queryPage.selectDuplicateTargetPhase(commonProperties.query.targetPhase);
  await captureStepScreenshot(page, testInfo, "06_target_phase_selected");

  console.log("Clicking Duplicate button to confirm...");
  await queryPage.clickDuplicateConfirm();
  await captureStepScreenshot(page, testInfo, "07_duplicate_confirmed");

  console.log("Verifying duplicated document appears in Query List...");
  await queryPage.verifyQueryListVisible();
  await captureStepScreenshot(page, testInfo, "08_list_updated");

  console.log("TC_QRY_009 completed successfully.");
});
