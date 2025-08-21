import { defineConfig, devices } from "@playwright/test";

const baseHector = {
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
};

// Function to build hector reporter options for a project
function hectorOptions(testCategory: string) {
  return {
    ...baseHector,
    testCategory,
  };
}

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
    { name: "adminPageTests", testDir: "tests/specs/adminPage" },
    { name: "planningPageTests", testDir: "tests/specs/planningPage" },
    { name: "queryPageTests", testDir: "tests/specs/queryPage" },
    { name: "userPageTests", testDir: "tests/specs/userPage" },
    { name: "reportPageTests", testDir: "tests/specs/reportPage" },
    { name: "executionPageTests", testDir: "tests/specs/executionPage" },
    { name: "homePageTests", testDir: "tests/specs/homePage" },
  ],

  reporter: [
    ["list"],
    ["junit", { outputFile: "reports/test-results/results.xml" }],
    ["html", { outputFolder: "reports/html-report", open: "never" }],
    // 👇 reporter picks testCategory dynamically at runtime
    ["@ptc-fusion/playwright-hector-reporter", hectorOptions(process.env.PW_PROJECT || "default")],
  ],
});
