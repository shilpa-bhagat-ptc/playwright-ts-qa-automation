"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const testData_1 = require("../data/testData");
const loginPage_locators_1 = require("../locators/loginPage.locators");
class LoginPage {
    page;
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        console.log("➡ Navigating to login page...");
        await this.page.goto("http://lqatms-test3:8080/QALink/jsp/home/login.jsp?page_url=/jsp/home/index.jsp?");
        await this.page.waitForTimeout(6000);
    }
    async loginAsValidUser() {
        console.log("🔐 Logging in with test credentials...");
        await this.page.fill(loginPage_locators_1.LOGIN_PAGE_LOCATORS.usernameInput, testData_1.testData.validUser.username);
        await this.page.waitForTimeout(6000);
        await this.page.fill(loginPage_locators_1.LOGIN_PAGE_LOCATORS.passwordInput, testData_1.testData.validUser.password);
        await this.page.waitForTimeout(6000);
        await this.page.click(loginPage_locators_1.LOGIN_PAGE_LOCATORS.loginButton);
        console.log("🔐 Logging successful, waiting for home page...");
    }
    async login(username, password) {
        console.log("🔐 Logging in with fake credentials...");
        await this.page.fill(loginPage_locators_1.LOGIN_PAGE_LOCATORS.usernameInput, username);
        await this.page.fill(loginPage_locators_1.LOGIN_PAGE_LOCATORS.passwordInput, password);
        await this.page.click(loginPage_locators_1.LOGIN_PAGE_LOCATORS.loginButton); // Adjust as per your actual locator
    }
}
exports.LoginPage = LoginPage;
