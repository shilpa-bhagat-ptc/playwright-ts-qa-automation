export const PLANNING_PAGE_LOCATORS = {
  // ── Main Navigation Tabs (extracted via Playwright MCP) ─────────────
  homeTab: "//a[normalize-space(text())='Home']",
  queryTab: "//a[normalize-space(text())='Query']",
  planningTab: "//td[@class='tabsel']//a[normalize-space(.)='Planning']",
  executionTab: "//a[normalize-space(text())='Execution']",
  reportTab: "//a[normalize-space(text())='Report']",
  userTab: "//a[normalize-space(text())='User']",
  adminTab: "//a[normalize-space(text())='Admin']",

  // ── Planning Sub-Option Tabs (extracted via Playwright MCP) ─────────
  releaseTab: "//a[normalize-space()='Release']",
  resourceCapacityTab: "//a[normalize-space()='Resource Capacity']",
  analyzeTab: "//a[normalize-space()='Analyze']",
  syncQAStatusTab: "//a[normalize-space()='SyncQAStatus']",
  selectTab: "//a[normalize-space()='Select']",
  advanceSelectTab: "//a[normalize-space()='Advance Select']",
  testAutomationTab: "//a[normalize-space()='Test Automation']",
  dropTab: "//a[normalize-space()='Drop']",
  delegateTab: "//a[normalize-space()='Delegate']",
  weeklyGoalTab: "//a[normalize-space()='Weekly Goal']",
  assignTab: "//a[normalize-space()='Assign']",
  weeklyAssignTab: "//a[normalize-space()='Weekly Assign']",
  planningTabSubOptions: "//ul[@class='ul_menu']//a",

  // ── Release Page Elements (extracted via Playwright MCP) ────────────
  releaseInput: "input#release_name_id",
  relaseInbox: "//input[@id='release_name_id']",

  // ── Table Elements ──────────────────────────────────────────────────
  tableTitle: "//span[contains(text(), 'PTC Arbortext Authoring')]",
  tableHeader:
    "//table[contains(@class, 'MsoNormalTable') and contains(@class, 'ke-zeroborder')]//tbody/tr[2]",
  testPlan: "//div//a[@id='sub_tab1_id']",

  // ── Header / Utility Links (extracted via Playwright MCP) ───────────
  welcomeText: "//td[contains(text(),'Welcome')]",
  qaLinkArchiveLink: "//a[normalize-space()='QALink_Archive']",
  logoutLink: "//a[normalize-space()='Logout']",

  // ── Footer Navigation (extracted via Playwright MCP) ────────────────
  footerHomeLink:
    "//table//a[normalize-space()='Home'][ancestor::*[contains(@class,'footer') or position()=last()]]",
  footerPlanningLink:
    "//table//a[normalize-space()='Planning'][ancestor::*[contains(@class,'footer') or position()=last()]]",
};
