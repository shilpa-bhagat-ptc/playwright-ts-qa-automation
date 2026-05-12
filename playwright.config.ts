import { defineConfig } from "@playwright/test";
import fs from "fs";
import path from "path";

const hectorBaseOptions = {
  projectId: "QALink_L10N_tests",
  releaseStream: "QALink_Playwright",
  releaseBuild: 110,
  serverUrl: "https://hector.ptcnet.ptc.com/Hector",
  packageId: "demo-package",
  pipelineBuild: 1,
  developmentBuild: 13,
  logLevel: "verbose",
  outputDir: "reports/test-results",
  includeProjectInTestName: true,
};

// ✅ Read from Jenkins parameter
const testCategory = process.env.TEST_PROJECT;

// ✅ Validate category
const validCategories = [
  "homePageTests",
  "adminPageTests",
  "planningPageTests",
  "queryPageTests",
  "userPageTests",
  "reportPageTests",
  "executionPageTests",
];

if (!testCategory) {
  throw new Error(
    `❌ TEST_PROJECT not set. Please provide one of: ${validCategories.join(", ")}`,
  );
}

if (!validCategories.includes(testCategory)) {
  throw new Error(
    `❌ Invalid TEST_PROJECT="${testCategory}". Must be one of: ${validCategories.join(", ")}`,
  );
}

// ✅ Map TEST_PROJECT → folder
const folderMap: Record<string, string> = {
  homePageTests: "homePage",
  adminPageTests: "adminPage",
  planningPageTests: "planningPage",
  queryPageTests: "queryPage",
  userPageTests: "userPage",
  reportPageTests: "reportPage",
  executionPageTests: "executionPage",
};

const selectedFolder = folderMap[testCategory];
const testDir = path.join(__dirname, "tests", "specs", selectedFolder);

// ✅ Ensure folder exists
if (!fs.existsSync(testDir)) {
  throw new Error(`❌ Test folder does not exist: ${testDir}`);
}

export default defineConfig({
  testDir,
  testMatch: ["*.spec.ts"],

  globalSetup: require.resolve("./tests/config/global-setup"),
  timeout: 120000,
  retries: 1,
  workers: 1,

  use: {
    storageState: ".auth/storageState.json",
    headless: false,
    ignoreHTTPSErrors: true,
    trace: "on",
    screenshot: "on",
  },

  reporter: [
    ["list"],
    ["junit", { outputFile: "reports/test-results/results.xml" }],
    ["html", { outputFolder: "reports/html-report", open: "never" }],
    [
      "@ptc-fusion/playwright-hector-reporter",
      {
        ...hectorBaseOptions,
        testCategory, // ✅ direct from Jenkins param
      },
    ],
  ],
});
