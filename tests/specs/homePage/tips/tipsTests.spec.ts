import commonProperties from "../../../../src/locale/commonProperties.json";
import { HOME_PAGE_LOCATORS } from "../../../../src/locators/homePage.locators";
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
import { TestDataGenerator } from "../../../../src/utils/testDataGenerator";
import { expect, test } from "../../../fixtures/fixture";

test("TC-HOM007 - Validate Tips Tab Links and Category Section", async ({
  loginPage,
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Validate all visible tip links and the Tips Category section. @owner:Shilpa Bhagat",
  });

  console.log("Navigating to Tips tab...");
  await page.click(HOME_PAGE_LOCATORS.tip);
  await captureStepScreenshot(page, testInfo, "01_tips_tab_clicked");

  console.log('Verifying "Tips Category" section is visible...');
  await expect(page.locator(HOME_PAGE_LOCATORS.tipsCategory)).toBeVisible();
  await captureStepScreenshot(page, testInfo, "02_tips_category_visible");

  console.log("Checking all visible tip links...");
  const tipLinks = page.locator(HOME_PAGE_LOCATORS.tipLinks);
  const linkCount = await tipLinks.count();
  expect(linkCount).toBeGreaterThan(0);
  await captureStepScreenshot(page, testInfo, "03_tip_links_detected");

  for (let i = 0; i < linkCount; i++) {
    const link = tipLinks.nth(i);
    const linkText = await link.innerText();
    const href = await link.getAttribute("href");

    console.log(`Found link: ${linkText.trim()} => ${href}`);
    expect(href).toContain("tips.jsp?action=list&category=");
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /category_id=\d+/);
  }

  await captureStepScreenshot(page, testInfo, "04_all_links_validated");

  console.log("All tips links validated successfully.");
  console.log("TC_HOM_007 completed successfully.");
});

test("TC-HOM008 - Validate Installation Tips and associated Edit/Delete icons", async ({
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
    console.log(`Validating tip: "${tip}"`);

    // Get row that contains the tip
    const tipRow = page.locator(HOME_PAGE_LOCATORS.tipRowByTipText(tip));
    await expect(tipRow).toBeVisible();

    // Use direct locator relative to that row
    const editIcon = page.locator(HOME_PAGE_LOCATORS.editIconByTip(tip));
    await expect(editIcon).toBeVisible();
    console.log(`Edit icon is visible for "${tip}"`);

    // Directly locate Delete icon by alt attribute
    const deleteIcon = page.locator(HOME_PAGE_LOCATORS.deleteIconByTip(tip));
    await expect(deleteIcon).toBeVisible();
    console.log(`Delete icon is visible for "${tip}"`);
    console.log("TC_HOM_008 completed successfully.");
  }
});

test("TC-HOM009 - Edit tip and verify updated datetime", async ({
  page,
  context,
  homePage,
}) => {
  await page.click(HOME_PAGE_LOCATORS.tip);
  await homePage.goToTipsSection();

  console.log("Navigated to Tips section");

  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    homePage.editTip(commonProperties.tips.enterText),
  ]);

  console.log("Popup window opened for tip editing");
  await popup.screenshot({ path: "screenshots/tip-edit-popup-opened.png" });

  await expect(popup.locator("h3")).toHaveText(commonProperties.tips.tipUpdate);
  console.log("Tips Update title verified");

  await expect(popup.locator('input[name="title"]')).toHaveValue(
    commonProperties.tips.tipTitle
  );
  console.log("Title field validated");

  await popup
    .frameLocator("iframe.ke-edit-iframe")
    .locator("body")
    .fill(commonProperties.tips.tipUpdateText + new Date().toLocaleString());
  console.log("Note updated inside editor");

  await popup.screenshot({ path: "screenshots/tip-edit-filled.png" });

  await popup.locator(HOME_PAGE_LOCATORS.submit).click();
  console.log("Submit button clicked");

  await homePage.goToTipsSection();
  console.log("Returned to Tips section after submission");

  await page.screenshot({ path: "screenshots/tips-after-update.png" });
  console.log("TC_HOM_009 completed successfully.");
});
test("TC-HOM010 - Validate Tips Tab Links", async ({
  loginPage,
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Validate all visible tip links and the Tips Category section. @owner:Shilpa Bhagat",
  });

  console.log("Navigating to Tips tab...");
  await page.click(HOME_PAGE_LOCATORS.tip);
  await captureStepScreenshot(page, testInfo, "01_tips_tab_clicked");

  console.log('Verifying "Tips Category" section is visible...');
  await expect(page.locator(HOME_PAGE_LOCATORS.tipsCategory)).toBeVisible();
  await captureStepScreenshot(page, testInfo, "02_tips_category_visible");

  console.log("Checking all visible tip links...");
  const tipLinks = page.locator(HOME_PAGE_LOCATORS.tipLinks);
  const linkCount = await tipLinks.count();
  expect(linkCount).toBeGreaterThan(0);
});
