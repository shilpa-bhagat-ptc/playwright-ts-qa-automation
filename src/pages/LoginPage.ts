// tests/pages/loginPage.ts
import { Page } from "@playwright/test";
import { testData } from "../data/testData";
import { LOGIN_PAGE_LOCATORS } from "../locators/loginPage.locators";

export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    console.log("➡ Navigating to login page...");
    await this.page.goto(
      "http://lqatms-test3:8080/QALink/jsp/home/login.jsp?page_url=/jsp/home/index.jsp?"
    );
    await this.page.waitForTimeout(6000);
  }

  async loginAsValidUser() {
    console.log("🔐 Logging in with test credentials...");
    await this.page.fill(
      LOGIN_PAGE_LOCATORS.usernameInput,
      testData.validUser.username
    );
    await this.page.waitForTimeout(6000);
    await this.page.fill(
      LOGIN_PAGE_LOCATORS.passwordInput,
      testData.validUser.password
    );
    await this.page.waitForTimeout(6000);
    await this.page.click(LOGIN_PAGE_LOCATORS.loginButton);
    console.log("🔐 Logging successful, waiting for home page...");
  }
  async login(username: string, password: string) {
    console.log("🔐 Logging in with fake credentials...");
    await this.page.fill(LOGIN_PAGE_LOCATORS.usernameInput, username);
    await this.page.fill(LOGIN_PAGE_LOCATORS.passwordInput, password);
    await this.page.click(LOGIN_PAGE_LOCATORS.loginButton); // Adjust as per your actual locator
  }
}
