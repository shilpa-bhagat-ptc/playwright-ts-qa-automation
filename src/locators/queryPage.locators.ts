export const QUERY_PAGE_LOCATORS = {
  // ── Main Nav ────────────────────────────────────────────────────────
  queryTab: "(//a[normalize-space(text())='Query'])[1]",

  // ── Query Sub-Tabs ───────────────────────────────────────────────────
  basicTab: "//a[normalize-space()='Basic']",
  advancedTab: "//a[normalize-space()='Advanced']",
  updateTab: "//a[normalize-space()='Update']",
  queryTabSubOptions: "a.main_sub_menu",

  // ── Basic / Update Tab — Release ─────────────────────────────────────
  releaseControl: "select#release",
  releaseSelect: "select#release",

  // ── Basic / Update Tab — Phase ────────────────────────────────────────
  phaseSelect: "select[name='phase']",
  phaseAddArrow: "input#add_release_phase",
  phaseRemoveArrow: "input#del_release_phase",
  phaseSelectionBox: "select[name='release_phase']",

  // ── Basic / Update Tab — Product ──────────────────────────────────────
  productControl: "select#product",
  productSelect: "select#product",

  // ── Basic / Update Tab — Load Button ─────────────────────────────────
  loadButton: "input[name='submit_query']",

  // ── Update Tab — Component ────────────────────────────────────────────
  componentControl: "select#component",
  componentSelect: "select#component",
  componentAddArrow: "input#add_component",
  componentRemoveArrow: "input#del_component",
  componentSelectionBox: "select#sel_component",

  // ── Basic Tab — Test Case Document List ──────────────────────────────
  documentListHeading: "//h3[contains(normalize-space(),'Test Case Document List')]",
  searchByProjectInput: "input[type='text'][name]",
  searchButton: "//input[@value='Search']",
  documentListTable: "//table[contains(@class,'list_table') or @id='query_list']",
  documentListRows: "//table[.//td[normalize-space()='NO'] or .//th[normalize-space()='NO']]//tr[position()>1]",
  documentListHeaders: "//table[.//td[normalize-space()='NO'] or .//th[normalize-space()='NO']]//tr[1]//td | //table[.//td[normalize-space()='NO'] or .//th[normalize-space()='NO']]//tr[1]//th",
  documentTitleLinks: "//table[.//td[normalize-space()='NO'] or .//th[normalize-space()='NO']]//td//a",

  // ── Test Case Detail List ─────────────────────────────────────────────
  enableFilterCheckbox: "input[type='checkbox'][name='chk_othertask']",
  filterDropdowns: "//table[.//th[normalize-space()='T/C NO'] or .//td[normalize-space()='T/C NO']]//select",
  testCaseDetailTable:
    "//table[.//th[normalize-space()='T/C NO'] or .//td[normalize-space()='T/C NO']]",

  // ── Update Tab — Test Case Document Query List ───────────────────────
  queryListHeading: "//h3[contains(normalize-space(),'Test Case Document Query List')]",
  queryListTable: "//table[.//*[normalize-space()='Title'] and .//*[normalize-space()='Duplicate']]",
  queryListTitleLinks:
    "//table[.//*[normalize-space()='Title'] and .//*[normalize-space()='Duplicate']]//td//a[not(normalize-space()='Duplicate') and not(normalize-space()='Review') and not(normalize-space()='Not Review')]",
  queryListReviewLinks:
    "//table[.//*[normalize-space()='Title'] and .//*[normalize-space()='Duplicate']]//td//a[normalize-space()='Review' or normalize-space()='Not Review']",
  queryListDuplicateLinks:
    "//table[.//*[normalize-space()='Title'] and .//*[normalize-space()='Duplicate']]//td//a[normalize-space()='Duplicate']",
  updateButton: "//input[@value='Update']",

  // ── Test Case Document Update List ───────────────────────────────────
  updateListHeading: "//h3[contains(normalize-space(),'Test Case Document Update List')]",
  updateListTable: "//table[.//select[contains(@name,'tc_status')]]",
  reviewStatusDropdown: "select[name*='tc_status']",
  saveAllButton: "//input[@value='Save All']",

  // ── Review Page ───────────────────────────────────────────────────────
  reviewPageEditLinks: "//td//a[normalize-space()='Edit']",
  tcUpdateOverlayTitle: "//b[normalize-space()='Test Case Update']",
  tcUpdateOverlaySaveButton: "//input[@value='Update']",

  // ── Duplicate Overlay ─────────────────────────────────────────────────
  duplicateOverlayTitle:
    "//b[contains(normalize-space(),'target info of source test case document')]",
  duplicateTargetRelease: "select[name='release_id']",
  duplicateTargetPhase: "select[name='phase']",
  duplicateConfirmButton: "//input[normalize-space(@value)='Duplicate']",
};
