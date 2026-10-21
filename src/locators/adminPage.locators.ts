export const ADMIN_PAGE_LOCATORS = {
  // ── Admin Main Nav Tab ─────────────────────────────────────────────────
  adminTab: "(//a[normalize-space(text())='Admin'])[1]",

  // ── Admin Sub-Tabs ─────────────────────────────────────────────────────
  usersTab: "//a[normalize-space()='Users']",
  officesTab: "//a[normalize-space()='Offices']",
  configurationsTab: "//a[normalize-space()='Configurations']",
  languagesTab: "//a[normalize-space()='Languages']",
  platformsTab: "//a[normalize-space()='Platforms']",
  productsTab: "//a[normalize-space()='Products']",
  componentsTab: "//a[normalize-space()='Components']",
  testTypesTab: "//a[normalize-space()='Test Types']",
  cftReportTab: "//a[normalize-space()='CFT Report']",
  appTypeTab: "//a[normalize-space()='App Type']",
  applicationTab: "//a[normalize-space()='Application']",
  releaseTab: "//a[normalize-space()='Release']",
  capacityTab: "//a[normalize-space()='Capacity']",
  exeTypeTab: "//a[normalize-space()='Exe Type']",
  testPlanTemplateTab: "//a[normalize-space()='Test Plan Template']",
  adminTabSubOptions: "//ul[@class='ul_menu']//a",

  // ── Common Admin Buttons ───────────────────────────────────────────────
  addButton: "//input[@value='Add ...' or @value='Add']",
  editButton: "//input[@value='Edit ...' or @value='Edit']",
  deleteButton: "//input[@value='Delete ...' or @value='Delete']",
  submitButton: "input[value='Submit']",
  cancelButton: "input[value='Cancel']",
  showPageButton: "input[value='Show Page']",
  loadButton: "//input[@value='Load ...' or @value='Load']",
  syncButton: "input[value*='Sync']",
  goBackToAppTypeLink: "//a[normalize-space()='Go back to App Type page']",

  // ── Common Controls ────────────────────────────────────────────────────
  activeOnlyCheckbox: "input[type='checkbox'][name='active_only']",
  activePageCheckbox: "input[type='checkbox'][name='active_page']",
  enableFilterCheckbox: "input[type='checkbox'][name='chk_filter']",
  adminListTable: "//table[contains(@class,'list_table')]",
  adminListTableRows: "//table[contains(@class,'list_table')]//tr[position()>1]",
  adminTableFirstRow: "//table[contains(@class,'list_table')]//tr[2]",
  adminTableFirstRowCheckbox: "//table[contains(@class,'list_table')]//tr[2]//input[@type='checkbox' or @type='radio']",

  // ── Users Tab ──────────────────────────────────────────────────────────
  usersOfficeSelect: "select[name='office_id']",

  // ── Configurations Tab (Admin context) ────────────────────────────────
  configReleaseSelect: "select[name='release']",
  configTypeServerRadio: "input[type='radio'][value='Server']",
  configTypeClientRadio: "input[type='radio'][value='Client']",

  // ── Platform Tab ───────────────────────────────────────────────────────
  platformReleaseSelect: "select[name='release']",

  // ── Release Tab (Admin) ───────────────────────────────────────────────
  releaseNameInput: "input[name='releaseName']",
  releaseL10nManagerSelect: "select[name='pm_id']",
  releasePrioritySelect: "select[name='priority']",
  releaseArchivedSelect: "select[name='archived']",
  releaseActiveOnlySelect: "select[name='active_only']",
  releaseNoTestCaseSelect: "select[name='no_testcase']",
  releaseTestCaseFormatSelect: "select[name='testcases_format']",
};
