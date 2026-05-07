export const EXECUTION_PAGE_LOCATORS = {
  // ── Main Nav ─────────────────────────────────────────────────────────
  executionTab: "(//a[normalize-space(text())='Execution'])[1]",

  // ── Execution Sub-Tabs ───────────────────────────────────────────────
  listTab: "//a[normalize-space()='List']",
  weeklyGoalTab: "//a[normalize-space()='Weekly Goal']",
  runTab: "//a[normalize-space()='Run']",
  testAutomationTab: "//a[normalize-space()='Test Automation']",
  qaLabTab: "//a[normalize-space()='QALab']",
  configurationsTab: "//a[normalize-space()='Configurations']",
  analysisTab: "//a[normalize-space()='Analysis']",
  searchTab: "//a[normalize-space()='Search']",
  executionTabSubOptions: "//ul[@class='ul_menu']//a",

  // ── List Tab ─────────────────────────────────────────────────────────
  listReleaseSelect: "select[name='release']",
  listPhaseSelect: "//td[normalize-space(.)='Phase:']/following-sibling::td[1]/select",
  listProjectManagerSelect: "//td[normalize-space(.)='Project Manager:']/following-sibling::td[1]/select",
  listProductSelect: "//td[normalize-space(.)='Product:']/following-sibling::td[1]/select",
  listOfficeSelect: "//td[normalize-space(.)='Office:']/following-sibling::td[1]/select",
  listLoadButton: "//input[@value='Load Test Case Assignment']",
  listResultTable: "//table[.//th[normalize-space()='Assignee'] or contains(@class,'list_table')]",

  // ── Weekly Goal Tab ──────────────────────────────────────────────────
  weeklyGoalOfficeSelect: "//td[normalize-space(.)='Office:']/following-sibling::td[1]/select",
  weeklyGoalWeekBeginInput: "//td[normalize-space(.)='Week begins:']/following-sibling::td[1]/input",
  weeklyGoalLoadButton: "//input[@value='Load Tasks']",
  weeklyAssignmentSummaryTable: "//table[.//th[normalize-space()='Installations'] or .//td[normalize-space()='Installations']]",
  weeklyGoalEnableFilter: "input[type='checkbox'][name='chk_othertask']",
  weeklyGoalFilterDropdown: "select[name='filter_status']",

  // ── QA Lab Tab ───────────────────────────────────────────────────────
  qaLabReleaseSelect: "//td[normalize-space(.)='Release:']/following-sibling::td[1]/select",
  qaLabStatusSelect: "//td[normalize-space(.)='Status:']/following-sibling::td[1]/select",
  qaLabProductSelect: "//td[normalize-space(.)='Product:']/following-sibling::td[1]/select",
  qaLabOfficeSelect: "//td[normalize-space(.)='Office:']/following-sibling::td[1]/select",
  qaLabLoadButton: "role=button[name='Load']",
  qaLabAddButton: "role=button[name='Add']",
  qaLabServerList: "//table[.//th[normalize-space()='Server URL'] or .//td[normalize-space()='Server URL']]",
  qaLabEnableFilter: "input[type='checkbox'][name='chk_filter']",
  qaLabAddOverlayTitle: "//b[contains(normalize-space(),'Add New Server')]",
  qaLabServerNameInput: "input[name='server_name']",
  qaLabServerConfigInput: "input[name='configuration']",
  qaLabServerUrlInput: "input[name='server_url']",
  qaLabAddSubmitButton: "//input[@value='Submit']",
  qaLabEditOverlayTitle: "//b[contains(normalize-space(),'Edit The Server')]",
  qaLabEditLink: "//a[normalize-space()='Edit']",

  // ── Configuration Tab ─────────────────────────────────────────────────
  configReleaseSelect: "select[name='release']",
  configTypeServerRadio: "//input[@type='radio' and @value='Server']",
  configTypeClientRadio: "//input[@type='radio' and @value='Client']",
  configActiveOnlyCheckbox: "input[type='checkbox'][name='active_only']",
  configShowPageButton: "//input[@value='Show Page']",
  configResultTable: "//table[contains(@class,'list_table')]",
  configEnableFilter: "input[type='checkbox'][name='chk_filter']",

  // ── Analysis Tab ─────────────────────────────────────────────────────
  analysisReleaseSelect: "//td[normalize-space(.)='Release:']/following-sibling::td[1]/select",
  analysisPhaseSelect: "//td[normalize-space(.)='Phase:']/following-sibling::td[1]/select",
  analysisPhaseAddArrow: "//input[@value='>>']",
  analysisPhaseRemoveArrow: "//input[@value='<<']",
  analysisProductSelect: "//td[normalize-space(.)='Product:']/following-sibling::td[1]/select",
  analysisProjectManagerSelect: "//td[normalize-space(.)='Project Manager:']/following-sibling::td[1]/select",
  analysisOfficeSelect: "//td[normalize-space(.)='Office:']/following-sibling::td[1]/select",
  analysisTestEngineerSelect: "//td[normalize-space(.)='Test Enginner:']/following-sibling::td[1]/select",
  analysisLoadButton: "role=button[name='Load Test Case Assignment']",
  analysisDownloadButton: "role=button[name='Download Green Batch']",
  analysisResultTable: "//table[contains(@class,'list_table')]",
  analysisEnableFilter: "input[type='checkbox'][name='chk_filter']",

  // ── Search Tab ────────────────────────────────────────────────────────
  searchHeading: "//h3[normalize-space()='Test Execution Search']",
  searchReleaseSelect: "//td[normalize-space(.)='Release:']/following-sibling::td[1]/select",
  searchProductSelect: "//td[normalize-space(.)='Product:']/following-sibling::td[1]/select",
  searchVerticalAppSelect: "//td[normalize-space(.)='Vertical App:']/following-sibling::td[1]/select",
  searchLanguageSelect: "//td[normalize-space(.)='Language:']/following-sibling::td[1]/select",
  searchProjectNoInput: "//td[contains(normalize-space(.),'Project/Story No')]/following-sibling::td[1]/input",
  searchKeywordInput: "input[name='test_case_keyword']",
  searchButton: "//input[@value='Execution Search']",
  searchResultTable: "//table[contains(@class,'list_table')]",
};
