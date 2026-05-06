import { test as base, Page } from "@playwright/test";
import { HomePage } from "../../src/pages/HomePage";
import { LoginPage } from "../../src/pages/LoginPage";
import { PlanningPage } from "../../src/pages/PlanningPage";
import { AdminPage } from "../../src/pages/adminPage";
import { ExecutionPage } from "../../src/pages/executionPage";
import { QueryPage } from "../../src/pages/queryPage";
import { ReportPage } from "../../src/pages/reportPage";
import { UserPage } from "../../src/pages/userPage";

type Fixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  planningPage: PlanningPage;
  executionPage: ExecutionPage;
  queryPage: QueryPage;
  reportPage: ReportPage;
  userPage: UserPage;
  adminPage: AdminPage;
  page: Page;
};

const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPageObj = new LoginPage(page);
    await use(loginPageObj);
  },
  homePage: async ({ page }, use) => {
    await page.goto(
      process.env.TEST_BASE_URL ||
        "http://lqatms-test4.ptcnet.ptc.com:8080/QALink/jsp/home/",
    );
    const homePageObj = new HomePage(page);
    await homePageObj.waitForHomePageLoaded();
    await use(homePageObj);
  },
  planningPage: async ({ page }, use) => {
    await page.goto(
      process.env.TEST_BASE_URL ||
        "http://lqatms-test4.ptcnet.ptc.com:8080/QALink/jsp/planning/",
    );
    const planningPageObj = new PlanningPage(page);
    await use(planningPageObj);
  },
  executionPage: async ({ page }, use) => {
    // TODO: Implement navigation and wait for execution page load
    const executionPageObj = new ExecutionPage(page);
    await use(executionPageObj);
  },
  queryPage: async ({ page }, use) => {
    await page.goto(
      process.env.TEST_QUERY_URL ||
        "http://lqatms-test4.ptcnet.ptc.com:8080/QALink/jsp/query/index.jsp",
    );
    await page.waitForLoadState("networkidle");
    const queryPageObj = new QueryPage(page);
    await use(queryPageObj);
  },
  reportPage: async ({ page }, use) => {
    // TODO: Implement navigation and wait for report page load
    const reportPageObj = new ReportPage(page);
    await use(reportPageObj);
  },
  userPage: async ({ page }, use) => {
    // TODO: Implement navigation and wait for user page load
    const userPageObj = new UserPage(page);
    await use(userPageObj);
  },
  adminPage: async ({ page }, use) => {
    // TODO: Implement navigation and wait for admin page load
    const adminPageObj = new AdminPage(page);
    await use(adminPageObj);
  },
});

export { test };

export { expect } from "@playwright/test";
