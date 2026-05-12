export const USER_PAGE_LOCATORS = {
  // ── User Tab (Header Navigation) ─────────────────────────────────────────────
  userTab: "(//a[normalize-space(text())='User'])[1]",

  // ── User Sub-Tabs ─────────────────────────────────────────────────────────────
  myTasksTab: "//a[normalize-space()='My Tasks']",
  mySPRsTab: "//a[normalize-space()='My SPRs']",
  resourceTab: "//a[normalize-space()='Resource']",
  myWeeklyGoalTab: "//a[normalize-space()='My Weekly Goal']",
  myProfileTab: "//a[normalize-space()='My Profile']",
  nonTestingResourceTab: "//a[normalize-space()='Non Testing Resource']",
  userTabSubOptions: "//ul[@class='ul_menu']//a",

  // ── My Weekly Goal Page (jsp/user/my_weeklyGoal.jsp) ─────────────────────────
  weekBeginsInput: "//input[@type='text' and @name='StartDate']",
  weekBeginsLabel: "//b[normalize-space()='Week begins:']",
  loadTasksButton: "//input[@value='Load Tasks']",
  testCaseExecutionLabel: "//b[normalize-space()='Test Case Execution']",
  otherTaskLabel: "//b[normalize-space()='Other Tasks']",
  addSprVerificationTaskLink:
    "//input[@value='Add SPR Verification Task' or @name='btn_add_spr_verification_task']",
  addEngineeringTaskButton: "//input[@value='Add Engineering Task']",
  saveActualHoursButton: "//input[contains(@value,'Save Actual Hours')]",
  timeTrackerReportLink: "//input[@value='TimeTracker Report']",

  // Task name links in the loaded task list (anchors inside the result table)
  // Excludes header/footer/menu links and external links like QALink_Archive, mailto: PTC LDEST.
  taskNameLinks:
    "//table//a[@href and not(contains(@href,'logout')) and not(contains(@href,'mailto')) and not(contains(@href,'QALink_Archive')) and not(contains(@class,'tabTxt')) and not(contains(@class,'main_sub_menu')) and not(contains(@class,'header_link')) and (string-length(normalize-space(text())) > 3)]",

  // ── Add SPR Verification Task Popup (opens in NEW WINDOW) ────────────────────
  addSprReleaseSelect: "//select[@name='release']",
  addSprPhaseSelect: "//select[@name='phase']",
  addSprComplexitySelect: "//select[@name='complexity']",
  addSprTaskNameInput: "//input[@name='task_name']",
  addSprAssignedExeNoInput: "//input[@name='total']",
  addSprNoteInput: "//textarea[@name='note']",
  addSprSubmitButton: "//input[@name='Submit' and @value='Submit']",
  addSprCancelButton: "//input[@name='Close' and @value='Cancel']",

  // ── Task Update Popup (opens when clicking a task name link) ─────────────────
  taskUpdatePopupTitle:
    "//*[contains(normalize-space(),'Update') and (contains(normalize-space(),'Execution') or contains(normalize-space(),'Weekly Goal') or contains(normalize-space(),'Other Tasks'))]",
  taskUpdateTaskNameRow: "//td[normalize-space()='Task Name']/following-sibling::td[1]",
  taskUpdateTaskTypeRow: "//td[normalize-space()='Task Type']/following-sibling::td[1]",
  taskUpdateComplexityRow:
    "//td[normalize-space()='Complexity']/following-sibling::td[1]",
  taskUpdateReleaseRow: "//td[normalize-space()='Release']/following-sibling::td[1]",
  taskUpdatePhaseRow: "//td[normalize-space()='Phase']/following-sibling::td[1]",
  taskUpdateProjectManagerRow:
    "//td[normalize-space()='Project Manager']/following-sibling::td[1]",
  taskUpdateNoteRow: "//td[normalize-space()='Note']/following-sibling::td[1]",
  taskUpdateAssignedExeNoRow:
    "//td[contains(normalize-space(),'Assigned Exe')]/following-sibling::td[1]",
  taskUpdateStatusSelect: "//select[@name='status' or @id='status']",
  taskUpdateDoneInput: "//input[@name='done' or @id='done']",
  taskUpdateUpdateButton: "//input[@value='Update']",

  // ── My Profile Page (jsp/user/my_profile.jsp) ────────────────────────────────
  // Profile fields are rendered as labels in the page body (not inputs). Use generic XPath.
  myProfileFirstNameLabel: "//*[normalize-space()='First Name' or normalize-space()='First Name:']",
  myProfileLastNameLabel: "//*[normalize-space()='Last Name' or normalize-space()='Last Name:']",
  myProfileEmailLabel: "//*[normalize-space()='Email' or normalize-space()='Email:']",
  myProfilePhoneLabel: "//*[normalize-space()='Phone' or normalize-space()='Phone:']",
  myProfileAccessLevelLabel:
    "//*[normalize-space()='Access Level' or normalize-space()='Access Level:']",
  myProfileOfficeLabel: "//*[normalize-space()='Office' or normalize-space()='Office:']",
  myProfileLoginNameLabel:
    "//*[normalize-space()='Login Name' or normalize-space()='Login Name:']",
  myProfilePasswordLabel:
    "//*[normalize-space()='Password' or normalize-space()='Password:']",
  editMyProfileButton: "//input[@value='Edit My Profile']",

  // ── Edit My Profile (jsp/user/edit_myProfile.jsp) ────────────────────────────
  editLoginNameInput: "//input[@name='log_name']",
  // Note: 'Passowrd' is the actual misspelled name attribute in the JSP
  editPasswordInput: "//input[@type='password']",
  editEmailInput: "//input[@name='email']",
  editPhoneInput: "//input[@name='phone']",
  editProfileSubmitButton: "//input[@name='submit_Edit' and @value='Submit']",

  // ── My Tasks Page (jsp/user/my_tasks.jsp) ────────────────────────────────────
  myTasksReleaseSelect: "//select[@name='release' and @id='release']",
  myTasksPhaseSelect: "//select[@name='phase']",
  myTasksReleasePhaseSelect: "//select[@name='release_phase']",
  myTasksProductSelect: "//select[@name='product' and @id='product']",
  myTasksProjectManagerSelect: "//select[@name='pm']",
  moveRightButton: "//input[@id='add_release_phase' and @value='>>']",
  moveLeftButton: "//input[@id='del_release_phase' and @value='<<']",
  loadTestCaseAssignmentButton: "//input[@value='Load Test Case Assignment']",

  // ── Resource Page (jsp/user/resource.jsp) ────────────────────────────────────
  resourceOfficeDropdown: "//select[@name='office_id']",
  resourceQaEngineerDropdown: "//select[@name='qa_engineer']",
  resourceAdjTypeDropdown: "//select[@name='resadjtype']",
  resourceStartDateInput: "//input[@type='text' and @name='StartDate']",
  resourceEndDateInput: "//input[@type='text' and @name='EndDate']",
  loadDetailsButton: "//input[@name='load' and @value='Load Details']",
  addRecordsButton: "//input[@name='add' and @value='Add Records']",
  updateRecordsButton: "//input[@name='btnUpdate' and @value='Update Records']",
  deleteRecordsButton: "//input[@name='btnDelete' and @value='Delete Records']",
  resetButton: "//input[@type='reset' and @value='Reset']",
  resourceListTable: "//table[contains(@class,'list_table') or @id='resource_list']",

  // Resource table column headers — these only render after a successful Load with data.
  // Made tolerant: check for column header text using <th> or <td> with bold styling.
  resourceColAll: "//th[normalize-space()='All'] | //td/b[normalize-space()='All']",
  resourceColDate: "//th[normalize-space()='Date'] | //td/b[normalize-space()='Date']",
  resourceColOffice:
    "//th[normalize-space()='Office'] | //td/b[normalize-space()='Office']",
  resourceColQaEngineer:
    "//th[normalize-space()='QA Engineer'] | //td/b[normalize-space()='QA Engineer']",
  resourceColAdjType:
    "//th[normalize-space()='Adj Type'] | //td/b[normalize-space()='Adj Type']",
  resourceColHours:
    "//th[normalize-space()='Hours'] | //td/b[normalize-space()='Hours']",
  resourceColNote: "//th[normalize-space()='Note'] | //td/b[normalize-space()='Note']",

  // ── Non Testing Resource Page (jsp/user/nonTestingAssign.jsp) ────────────────
  nonTestingOfficeDropdown: "//select[@name='office']",
  nonTestingExeTypeDropdown: "//select[@name='exe_type']",
  nonTestingUserDropdown: "//select[@name='user']",
  nonTestingWeekOfStartDate: "//input[@id='weekStartDate']",
  nonTestingWeekOfEndDate: "//input[@id='weekEndDate']",
  // Load button has leading/trailing spaces in value — match by name to be safe
  nonTestingLoadButton: "//input[@name='query' and contains(@value,'Load')]",
  nonTestingAddButton: "//input[@value='Add']",
  nonTestingEditButton: "//input[@value='Edit']",
  nonTestingDeleteButton: "//input[@value='Delete']",
  enableFilterCheckbox:
    "//input[@type='checkbox' and (contains(@name,'filter') or contains(@id,'filter') or contains(@name,'enable'))]",
  nonTestingResourceTable: "//table[contains(@class,'list_table')]",
  nonTestingSubmitButton: "//input[@value='Submit']",
};
