import { defineConfig, devices } from "@playwright/test";

const hectorBaseOptions = {
  projectId: "QALink_L10N_tests", // PLW_HECTOR_PROJECT_ID
  releaseStream: "QALink_Playwright", // PLW_HECTOR_RELEASE_STREAM
  releaseBuild: 110, // PLW_HECTOR_RELEASE_BUILD
  serverUrl: "https://hector.ptcnet.ptc.com/Hector", // PLW_HECTOR_URL
  packageId: "demo-package", // PLW_TEST_PACKAGE_ID
  pipelineBuild: 1, // PLW_HECTOR_PIPELINE_BUILD
  developmentBuild: 11, // PLW_HECTOR_DEVELOPMENT_BUILD
  logLevel: "verbose", // PLW_HECTOR_REPORTER_LOG_LEVEL
  outputDir: "reports/test-results", // PLW_HECTOR_REPORTER_OUTPUT_DIR
  includeProjectInTestName: true, // PLW_HECTOR_REPORTER_INCLUDE_PROJECT_NAME
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
    [
      "@ptc-fusion/playwright-hector-reporter",
      // 👇 dynamically set `testCategory` from project.name
      ({ project }) => ({
        ...hectorBaseOptions,
        testCategory: project.name,
      }),
    ],
  ],
});
