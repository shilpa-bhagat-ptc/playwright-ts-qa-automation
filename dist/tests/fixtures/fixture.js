"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expect = exports.test = void 0;
const test_1 = require("@playwright/test");
const HomePage_1 = require("../../src/pages/HomePage");
const LoginPage_1 = require("../../src/pages/LoginPage");
exports.test = test_1.test.extend({
    loginPage: async ({ page }, use) => {
        const login = new LoginPage_1.LoginPage(page);
        await use(login);
    },
    homePage: async ({ page }, use) => {
        await page.goto(process.env.TEST_BASE_URL ||
            "http://lqatms-test3.ptcnet.ptc.com:8080/QALink/jsp/home/");
        const home = new HomePage_1.HomePage(page);
        await home.waitForHomePageLoaded();
        await use(home);
    },
});
var test_2 = require("@playwright/test");
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return test_2.expect; } });
