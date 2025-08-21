import { defineConfig, devices } from "@playwright/test";
import path from "path";

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
};

// ✅ Read TEST_PROJECT parameter from Jenkins (passed as env var)
const selectedProject = process.env.TEST_PROJECT;

// Map Jenkins param -> folder
const projectDirMap: Record<string, string> = {
  homePageTests: "tests/specs/homePage",
  adminPageTests: "tests/specs/adminPage",
  planningPageTests: "tests/specs/planningPage",
  queryPageTests: "tests/specs/queryPage",
  userPageTests: "tests/specs/userPage",
  reportPageTests: "tests/specs/reportPage",
  executionPageTests: "tests/specs/executionPage",
};

export default defineConfig({
  testDir: "./tests/specs",

  globalSetup: require.resolve("./tests/config/global-setup"),

  use: {
    storageState: ".auth/storageState.json",
    headless: false,
    ignoreHTTPSErrors: true,
    trace: "on",
    screenshot: "on",
  },

  // ✅ Only include the project selected in Jenkins
  projects: selectedProject
    ? [
        {
          name: selectedProject,
          testDir: projectDirMap[selectedProject] || "tests/specs",
          use: { ...devices["Desktop Chrome"] },
        },
      ]
    : Object.entries(projectDirMap).map(([name, dir]) => ({
        name,
        testDir: dir,
        use: { ...devices["Desktop Chrome"] },
      })),

  reporter: [
    ["list"],
    ["junit", { outputFile: "reports/test-results/test-results.xml" }],
    ["html", { outputFolder: "reports/html-report", open: "never" }],
    [
      "@ptc-fusion/playwright-hector-reporter",
      ({ project }) => ({
        ...hectorBaseOptions,
        testCategory: project.name,
      }),
    ],
  ],
});
