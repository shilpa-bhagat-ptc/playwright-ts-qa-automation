import { defineConfig, devices } from "@playwright/test";

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

  // outputDir: "/report/test-results",

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",

        //    storageState: "./storageState.json",
      },
    },
  ],

  reporter: [
    ["list"],
    ["junit", { outputFile: "reports/test-results/test-results.xml" }],
    [
      "html",
      {
        outputFolder: "reports/html-report",
        open: "never",
      },
    ],
  ],
});
