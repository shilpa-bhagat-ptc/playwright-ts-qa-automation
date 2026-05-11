import commonProperties from "../../../../src/locale/commonProperties.json";
import { HOME_PAGE_LOCATORS } from "../../../../src/locators/homePage.locators";
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
import { expect, test } from "../../../fixtures/fixture";

test("TC_HOM_006 - Verify Weekly Note Editor Functionality", async ({
  loginPage,
  homePage,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description:
      "Validates that notes can be created and saved using the Weekly Note Editor. @owner:Shilpa Bhagat",
  });
  console.log("Navigating to Weekly Note tab first...");
  await homePage.navigateToWeeklyNoteTab();
  await page.waitForLoadState("networkidle");

  console.log("Checking if Weekly Note Editor tab is visible...");
  const editorTabVisible = await page.locator(HOME_PAGE_LOCATORS.weeklyEditorTab).isVisible();
  if (!editorTabVisible) {
    test.skip(true, "Weekly Note Editor tab not visible — user may lack permissions");
    return;
  }
  console.log("Navigating to Weekly Note Editor tab...");
  await homePage.navigateToWeeklyEditorTab();

  console.log("Verifying Weekly Note Editor tab is visible...");
  await homePage.verifyWeeklyNoteTabVisible();

  console.log("Capturing screenshot after Weekly Note Editor tab click...");
  await captureStepScreenshot(page, testInfo, "01_click-weekly-note-tab");

  console.log(
    `Setting date from calendar: ${commonProperties.editorDate.Date}`
  );
  await homePage.selectDateFromCalendar(commonProperties.editorDate.Date);

  console.log("Clicking Load Weekly Note and waiting...");
  await homePage.clickWeeklyNoteButtonAndWait();

  // Capture the editor URL we landed on after Load so we can return here
  // exactly to verify the saved note persists.
  const editorLoadedUrl = page.url();
  console.log(`Editor URL after Load: ${editorLoadedUrl}`);

  console.log(
    `Entering weekly note text: "${commonProperties.editorText.enterText}"`
  );
  await homePage.enterTextInTextArea(commonProperties.editorText.enterText);

  console.log("Capturing screenshot after filling text...");
  await captureStepScreenshot(page, testInfo, "02_fill-weekly-note");

  console.log("Clicking Save Weekly Note...");
  await homePage.clickSaveWeeklyNoteButton();

  console.log("Capturing screenshot after saving note...");
  await captureStepScreenshot(page, testInfo, "03_save-weekly-note");

  console.log("Navigating to Weekly Note tab...");
  await homePage.navigateToWeeklyNoteTab();

  console.log("Capturing screenshot after navigating to Weekly Note tab...");
  await captureStepScreenshot(page, testInfo, "04_navigate-weekly-note");

  console.log("Verifying current URL contains 'weekly_note.jsp'...");
  await expect(page).toHaveURL(/.*weekly_note\.jsp.*/);

  console.log("Verifying 'Load Weekly Note' button is visible...");
  await expect(page.locator("text=Load Weekly Note")).toBeVisible();

  console.log(`Re-loading the same week via captured URL and verifying saved note text persists (manual step 6)...`);
  console.log(`Returning to: ${editorLoadedUrl}`);
  await page.goto(editorLoadedUrl, { waitUntil: "load" });
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

  const textArea = page.locator(HOME_PAGE_LOCATORS.editorTextArea);
  await expect(
    textArea.first(),
    "expected saved note text to persist in textarea after navigate-away-and-reload",
  ).toHaveValue(new RegExp(commonProperties.editorText.enterText), { timeout: 15000 });

  console.log("Weekly Note Editor functionality verified — note persistence confirmed.");
  console.log("TC_HOM_006 completed successfully.");
});
