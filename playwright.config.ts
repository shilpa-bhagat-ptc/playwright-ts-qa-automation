import { defineConfig, devices } from "@playwright/test";
import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";

// map classname prefix → category
const categoryMap: Record<string, string> = {
  adminPage: "adminPageTests",
  queryPage: "queryPageTests",
  userPage: "userPageTests",
  reportPage: "reportPageTests",
  executionPage: "executionPageTests",
};

// decide category from junit xml
function resolveCategoryFromJUnit(): string {
  const junitPath = path.resolve("reports/test-results/results.xml"); // adjust file if needed
  if (!fs.existsSync(junitPath)) return "";

  const xml = fs.readFileSync(junitPath, "utf-8");
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);

  const testcases = parsed?.testsuites?.testsuite?.testcase || [];
  if (!testcases || testcases.length === 0) return "";

  // normalize testcases into array
  const tcArray = Array.isArray(testcases) ? testcases : [testcases];
  const classname: string = tcArray[0]["@_classname"] || "";

  // find first matching prefix in our map
  for (const prefix of Object.keys(categoryMap)) {
    if (classname.startsWith(prefix)) {
      return categoryMap[prefix];
    }
  }

  return ""; // nothing if no match
}

const hectorOptionsALL = {
  projectId: "QALink_L10N_tests", // PLW_HECTOR_PROJECT_ID
  releaseStream: "QALink_Playwright", // PLW_HECTOR_RELEASE_STREAM
  releaseBuild: 110, // PLW_HECTOR_RELEASE_BUILD
 testCategory: resolveCategoryFromJUnit(),
   

  serverUrl:
    "https://hector.ptcnet.ptc.com/Hector", // PLW_HECTOR_URL
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
   ['@ptc-fusion/playwright-hector-reporter', hectorOptionsALL]
  ],
});
