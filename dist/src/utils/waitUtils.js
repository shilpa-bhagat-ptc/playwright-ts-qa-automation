"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForElementVisible = waitForElementVisible;
exports.waitForElementEnabled = waitForElementEnabled;
exports.waitForNavigationToComplete = waitForNavigationToComplete;
const test_1 = require("@playwright/test");
const timeouts_1 = require("./timeouts");
async function waitForElementVisible(locator, timeout = timeouts_1.TIMEOUTS.MEDIUM) {
    await locator.waitFor({ state: "visible", timeout });
}
async function waitForElementEnabled(locator, timeout = timeouts_1.TIMEOUTS.MEDIUM) {
    await locator.waitFor({ state: "attached", timeout });
    await (0, test_1.expect)(locator).toBeEnabled({ timeout });
}
async function waitForNavigationToComplete(page, timeout = timeouts_1.TIMEOUTS.LONG) {
    await page.waitForLoadState("load", { timeout });
}
