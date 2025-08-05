export const PLANNING_PAGE_LOCATORS = {
  planningTab: "//td[@class='tabsel']//a[normalize-space(.)='Planning']",
  releaseTab: "//a[normalize-space()='Release']",
  releaseInput: "input#release_name_id",
  // releaseDropdown: "//select[@id='weekly_release']",
  planningTabSubOptions: "//ul[@class='ul_menu']//a",
  tableTitle: "//span[contains(text(), 'PTC Arbortext Authoring')]",
  tableHeader:
    "//table[contains(@class, 'MsoNormalTable') and contains(@class, 'ke-zeroborder')]//tbody/tr[2]",
  relaseInbox: "//input[@id='release_name_id']",
};
