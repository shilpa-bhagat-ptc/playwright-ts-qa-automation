"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// global-setup.ts
const test_1 = require("@playwright/test");
const path_1 = __importDefault(require("path"));
async function globalSetup(config) {
    console.log("Global setup...");
    const browser = await test_1.chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("http://lqatms-test3.ptcnet.ptc.com:8080/QALink/jsp/home/login.jsp");
    await page.fill('input[name="login_id"]', "sbhagat");
    await page.fill('input[name="password"]', "123");
    await Promise.all([
        page.click('input[type="submit"]'),
        await page.waitForLoadState("networkidle"), // ⏳ Wait for redirect
    ]);
    const storagePath = path_1.default.resolve(process.cwd(), ".auth/storageState.json");
    await page.context().storageState({ path: storagePath });
    console.log(`Storage state will be saved to: ${storagePath}`);
    await browser.close();
    console.log("✅ Session stored successfully.");
}
exports.default = globalSetup;
