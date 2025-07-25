export const HOME_PAGE_LOCATORS = {
  weeklyNoteTab: "//a[normalize-space(text())='Weekly Note']",
  weeklyNoteText: "//b[normalize-space()='Week begins:']",
  clickOnCalendar: 'input[name="StartDate"]',
  startDate: "//b[text()='Week begins:']/following::input[1]",
  weeklyNoteButton: "//input[@value='Load Weekly Note']",
  selectRelease: 'select[id="weekly_release"]',
  selectReleaseOption: "//option[text() = 'ALD 12.3.2.0']",
  optionLocator: '//option[text()[normalize-space()="${visibleText}"]]',
  selectManager: "//select[@id='weekly_project_manager']",

  // Locators for Production Dashboard
  dashboardheaders: "table#prod_dashboard tr.prod_dashboard_tbl_header td",
  prodtableHeaders:
    "//table[@id='prod_dashboard']//tr[@class='prod_dashboard_tbl_header']",
  productionDashboardTab: "//a[normalize-space(text())='Production Dashboard']",
  productionDashboardFromDate: 'input[name="period_from"]',
  productionDashboardToDate: 'input[name="period_to"]',
  productionDashboardLoadButton:
    "//input[@name='submit_query' and @value='Load Production Dashboard']",
  productionDashboardDataGrid: "//table[@id='production_dashboard_grid']",
  productionDashboardTableRow:
    "//table[@id='prod_dashboard']//tr[@class='prod_dashboard_tbl_header']",
  productionDashboardTableCell: ".production-dashboard-table td",
  translationStatusdropdown:
    "//select[@id='translation_note_section_select_4360']",
  prodEditor: "//*[@id='prod_dashboard']/tbody/tr[3]/td[12]/img",
  prodSaveButton:
    "(//input[@type='button' and starts-with(@value, 'Save') and not(ancestor::div[contains(@style, 'display:none')])])[1]",
  weeklyEditorTab: "//a[normalize-space(text())='Weekly Note Editor']",
  editorTextArea: "//textarea[@name='note']",
  saveWeeklyNoteButton: "//input[@value='Save Weekly Note']",
  tipLinks: 'a[href*="tips.jsp?action=list&category="]',
  tip: '//a[normalize-space(text())="Tips"]',
  tipsCategory: "text=Tips Category",
  tipRowByTipText: (tip: string) =>
    `xpath=//tr//a[.//text()[normalize-space()="${tip}"]]`,

  editIconByTip: (tip: string) => `img[alt="Edit the tip - ${tip}"]`,

  deleteIconByTip: (tip: string) => `img[alt="Delete the tip - ${tip}"]`,
  tipRow: (tip: string) =>
    `xpath=//tr//a[.//text()[normalize-space()="${tip}"]]`,
  editIcon: (tip: string) => `//img[@alt="Edit the tip - ${tip}"]`,
  deleteIcon: (tip: string) => `//img[@alt="Delete the tip - ${tip}"]`,
  submit: "//input[@type='submit' and @value='Submit']",
};
