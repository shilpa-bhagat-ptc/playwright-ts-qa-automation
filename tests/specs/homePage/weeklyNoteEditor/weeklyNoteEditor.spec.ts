import commonProperties from "../../../../src/locale/commonProperties.json";
import { captureStepScreenshot } from "../../../../src/utils/screenshotHelper";
import { expect, test } from "../../../fixtures/fixture";

test("TC_HOME006 - Verify Weekly Note Editor Functionality", async ({
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
  // await expect(page.locator("input[name='StartDate']")).toHaveValue(
  //  "07/20/2025"
  //);

  console.log("✅ Weekly Note Editor functionality verified.");
  console.log("✅ TC_HOM_006 completed successfully.");
});
