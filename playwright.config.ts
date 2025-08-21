import { defineConfig, devices } from "@playwright/test";

const hectorBaseOptions = {
  projectId: "QALink_L10N_tests",
  releaseStream: "QALink_Playwright",
  releaseBuild: 110,
  serverUrl: "https://hector.ptcnet.ptc.com/Hector",
  packageId: "demo-package",
  pipelineBuild: 1,
  developmentBuild: 11,
  logLevel: "verbose",
  outputDir: "reports/test-results",
  includeProjectInTestName: true,
  testCategory: process.env.PLW_HECTOR_CATEGORY || "default", // 👈 auto-matched from Jenkins
};

export default defineConfig({
  testDir: "./tests/specs",
  testMatch: ["*.spec.ts"],

  globalSetup: require.resolve("./tests/config/global-setup"),

  use: {
    storageState: ".auth/storageState.json",
    headless: false,
    ignoreHTTPSErrors: true,
    trace: "on",
    screenshot: "on",
  },

  projects: [
    { name: "homePageTests", use: { ...devices["Desktop Chrome"] } },
    { name: "adminPageTests", use: { ...devices["Desktop Chrome"] } },
    { name: "planningPageTests", use: { ...devices["Desktop Chrome"] } },
    { name: "queryPageTests", use: { ...devices["Desktop Chrome"] } },
    { name: "userPageTests", use: { ...devices["Desktop Chrome"] } },
    { name: "reportPageTests", use: { ...devices["Desktop Chrome"] } },
    { name: "executionPageTests", use: { ...devices["Desktop Chrome"] } },
  ],

  reporter: [
    ["list"],
    ["junit", { outputFile: "reports/test-results/test-results.xml" }],
    ["html", { outputFolder: "reports/html-report", open: "never" }],
    ["@ptc-fusion/playwright-hector-reporter", hectorBaseOptions],
  ],
});
