import { test as base, Page } from "@playwright/test";
import { HomePage } from "../../src/pages/HomePage";
import { LoginPage } from "../../src/pages/LoginPage";

type Fixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  page: Page;
};
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await use(login);
  },

  homePage: async ({ page }, use) => {
    await page.goto(
      process.env.TEST_BASE_URL ||
        "http://lqatms-test3.ptcnet.ptc.com:8080/QALink/jsp/home/"
    );
    const home = new HomePage(page);
    await home.waitForHomePageLoaded();
    await use(home);
  },
});

export { expect } from "@playwright/test";
