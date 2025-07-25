"use strict";
// Playwright-ts-QALink/utils/cleanupHelper.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = globalSetup;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Folders you want to clean
const foldersToClean = [
    "Playwright-ts-QALink/screenshots",
    "Playwright-ts-QALink/test-results",
    "Playwright-ts-QALink/allure-report",
    "Playwright-ts-QALink/reports/html-report",
];
function deleteFolderContents(folderPath) {
    if (fs_1.default.existsSync(folderPath)) {
        const files = fs_1.default.readdirSync(folderPath);
        for (const file of files) {
            const fullPath = path_1.default.join(folderPath, file);
            if (fs_1.default.lstatSync(fullPath).isDirectory()) {
                deleteFolderContents(fullPath);
                fs_1.default.rmdirSync(fullPath);
            }
            else {
                fs_1.default.unlinkSync(fullPath);
            }
        }
        console.log(`✅ Cleaned: ${folderPath}`);
    }
    else {
        console.log(`⚠️ Folder not found: ${folderPath}`);
    }
}
// ⬇️ REQUIRED: default export with single async function
async function globalSetup() {
    console.log("🧹 Cleaning up reports and screenshots...");
    foldersToClean.forEach(deleteFolderContents);
}
