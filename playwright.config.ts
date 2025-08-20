import { defineConfig, devices } from "@playwright/test";

const hectorOptionsALL = {
  projectId: "QALink_L10N_tests", // PLW_HECTOR_PROJECT_ID
  releaseStream: "QALink_Playwright", // PLW_HECTOR_RELEASE_STREAM
  releaseBuild: 100, // PLW_HECTOR_RELEASE_BUILD
  testCategory: "homePageTests", // PLW_HECTOR_CATEGORY

  serverUrl:
    "https://hector.ptcnet.ptc.com/Hector/overview/QALink_L10N_tests/", // PLW_HECTOR_URL
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
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
      },
    },
  ],

  reporter: [
    ["list"],
    ["junit", { outputFile: "reports/test-results/test-results.xml" }],
    ["html", { outputFolder: "reports/html-report", open: "never" }],
    // 👇 custom hector reporter can consume `hectorOptionsALL`
    ["./hector-reporter.ts", hectorOptionsALL],
  ],
});
