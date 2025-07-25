"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureStepScreenshot = captureStepScreenshot;
const test_1 = require("@playwright/test");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function captureStepScreenshot(page, testInfo, stepName) {
    const dir = path_1.default.join("screenshots", testInfo.title.replace(/\s+/g, "_"));
    // Set timeout for this step only (optional)
    test_1.test.setTimeout(60000);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = path_1.default.join(dir, `${stepName}-${timestamp}.png`);
    try {
        // Ensure page is stable before screenshot
        await page.waitForLoadState("domcontentloaded", { timeout: 10000 });
        // Use a shorter timeout to prevent hanging
        await page.screenshot({
            path: filePath,
            fullPage: false, // Change to true if absolutely needed
            timeout: 10000, // Avoid waiting forever
        });
        console.log(`📸 Screenshot captured: ${filePath}`);
    }
    catch (error) {
        console.error(`❌ Failed to capture screenshot at step "${stepName}":`, error);
    }
}
