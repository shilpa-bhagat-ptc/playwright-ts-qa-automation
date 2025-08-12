// Playwright-ts-QALink/utils/cleanupHelper.ts

import fs from "fs";
import path from "path";

const foldersToClean = [
  "Playwright-ts-QALink/screenshots",
  "Playwright-ts-QALink/test-results",
  "Playwright-ts-QALink/allure-report",
  "Playwright-ts-QALink/reports/html-report",
];

function deleteFolderContents(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        deleteFolderContents(fullPath);
        fs.rmdirSync(fullPath);
      } else {
        fs.unlinkSync(fullPath);
      }
    }
    console.log(`Cleaned: ${folderPath}`);
  } else {
    console.log(`Folder not found: ${folderPath}`);
  }
}

// ⬇️ REQUIRED: default export with single async function
export default async function globalSetup() {
  console.log("Cleaning up reports and screenshots...");
  foldersToClean.forEach(deleteFolderContents);
}
