"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForElementToBeReady = waitForElementToBeReady;
exports.clearAndType = clearAndType;
exports.selectByVisibleText = selectByVisibleText;
exports.safeClick = safeClick;
exports.isElementVisible = isElementVisible;
const test_1 = require("@playwright/test");
//Wait for element to be visible and enabled before interacting
async function waitForElementToBeReady(page, selector, timeout = 5000) {
    const locator = page.locator(selector);
    await locator.waitFor({ state: "visible", timeout });
    await (0, test_1.expect)(locator).toBeEnabled();
}
// Type text into a field after clearing existing content
async function clearAndType(page, selector, text) {
    const element = page.locator(selector);
    await element.fill(""); // clears the field
    await element.type(text);
}
//Select dropdown by visible text
async function selectByVisibleText(page, selector, visibleText) {
    await page.selectOption(selector, { label: visibleText });
}
//Wait and click an element safely
async function safeClick(page, selector, timeout = 5000) {
    await waitForElementToBeReady(page, selector, timeout);
    await page.locator(selector).click();
}
// Check if element is visible on the page
async function isElementVisible(page, selector) {
    return await page.locator(selector).isVisible();
}
