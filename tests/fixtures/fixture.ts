import { test as base, Page } from "@playwright/test";
import { testData } from "../../src/data/testData";
import { HomePage } from "../../src/pages/HomePage";
import { LoginPage } from "../../src/pages/LoginPage";
import { PlanningPage } from "../../src/pages/PlanningPage";
import { AdminPage } from "../../src/pages/adminPage";
import { ExecutionPage } from "../../src/pages/executionPage";
import { QueryPage } from "../../src/pages/queryPage";
import { ReportPage } from "../../src/pages/reportPage";
import { UserPage } from "../../src/pages/userPage";

const BASE = "http://lqatms-test4.ptcnet.ptc.com:8080/QALink";

// Navigates to targetUrl, re-authenticates if the server session has expired.
// Detects two cases: (1) redirect to login.jsp, (2) app serves degraded content
// with a "Login =>" link instead of "Logout =>" without redirecting.
async function navigateAuthenticated(page: Page, targetUrl: string) {
  await page.goto(targetUrl);
  // Cap networkidle wait to 30s — the app can have long-running background XHR that never settles,
  // which would otherwise consume the entire 120s test timeout before the test body even starts.
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});

  const onLoginPage = page.url().includes("login.jsp");
  // When authenticated, the nav bar shows a "Logout" link; a session expiry without redirect
  // replaces it with a "Login" link. Require both: no logout link AND a login link present.
  const hasLogoutLink = !onLoginPage && (await page.locator('a[href*="logout.jsp"]').count()) > 0;
  const hasLoginLink = !onLoginPage && !hasLogoutLink && (await page.locator('a[href*="login.jsp"]').count()) > 0;

  if (onLoginPage || hasLoginLink) {
    if (hasLoginLink) {
      await page.goto(`${BASE}/jsp/home/login.jsp`);
      await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    }
    await page.fill('input[name="login_id"]', testData.validUser.username);
    await page.fill('input[name="password"]', testData.validUser.password);
    await page.click('input[type="submit"][value="Log In"]');
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    // Always navigate to targetUrl after login — server may redirect to home,
    // not necessarily back to the original target page.
    await page.goto(targetUrl);
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  }
}

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
    await navigateAuthenticated(
      page,
      process.env.TEST_BASE_URL || `${BASE}/jsp/home/`,
    );
    const homePageObj = new HomePage(page);
    await use(homePageObj);
  },
  planningPage: async ({ page }, use) => {
    await navigateAuthenticated(
      page,
      process.env.TEST_PLANNING_URL || `${BASE}/jsp/planning/`,
    );
    const planningPageObj = new PlanningPage(page);
    await use(planningPageObj);
  },
  executionPage: async ({ page }, use) => {
    await navigateAuthenticated(
      page,
      process.env.TEST_EXECUTION_URL || `${BASE}/jsp/execution/index.jsp`,
    );
    const executionPageObj = new ExecutionPage(page);
    await use(executionPageObj);
  },
  queryPage: async ({ page }, use) => {
    await navigateAuthenticated(
      page,
      process.env.TEST_QUERY_URL || `${BASE}/jsp/query/index.jsp`,
    );
    const queryPageObj = new QueryPage(page);
    await use(queryPageObj);
  },
  reportPage: async ({ page }, use) => {
    await navigateAuthenticated(
      page,
      process.env.TEST_REPORT_URL || `${BASE}/jsp/report/overall.jsp`,
    );
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
