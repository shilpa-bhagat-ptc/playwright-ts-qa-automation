/**
 * AI Smart Test Selector
 *
 * Determines which Playwright test projects to run based on which files
 * changed in the current Git commit/branch. Maps source file changes to
 * the relevant test projects so Jenkins only runs affected tests.
 *
 * Usage:
 *   npx ts-node tools/aiTestSelector.ts [base-branch]
 *
 * Output:
 *   - Prints the --project flags for `npx playwright test`
 *   - Writes selected projects to reports/test-results/selected-projects.txt
 *
 * Examples:
 *   npx ts-node tools/aiTestSelector.ts main
 *   npx ts-node tools/aiTestSelector.ts origin/main
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Map source paths to Playwright project names from playwright.config.ts
const PATH_TO_PROJECT: { pattern: RegExp; projects: string[] }[] = [
  {
    pattern:
      /src\/locators\/homePage|src\/pages\/HomePage|tests\/specs\/homePage/,
    projects: ["homePageTests"],
  },
  {
    pattern:
      /src\/locators\/planningPage|src\/pages\/PlanningPage|tests\/specs\/planningPage/,
    projects: ["planningPageTests"],
  },
  {
    pattern:
      /src\/locators\/executionPage|src\/pages\/ExecutionPage|tests\/specs\/executionPage/,
    projects: ["executionPageTests"],
  },
  {
    pattern:
      /src\/locators\/queryPage|src\/pages\/QueryPage|tests\/specs\/queryPage/,
    projects: ["queryPageTests"],
  },
  {
    pattern:
      /src\/locators\/userPage|src\/pages\/UserPage|tests\/specs\/userPage/,
    projects: ["userPageTests"],
  },
  {
    pattern:
      /src\/locators\/adminPage|src\/pages\/AdminPage|tests\/specs\/adminPage/,
    projects: ["adminPageTests"],
  },
  {
    pattern:
      /src\/locators\/reportPage|src\/pages\/ReportPage|tests\/specs\/reportPage/,
    projects: ["reportPageTests"],
  },
  {
    pattern:
      /src\/locators\/loginPage|src\/pages\/LoginPage|tests\/config\/global-setup/,
    projects: [
      "homePageTests",
      "planningPageTests",
      "executionPageTests",
      "queryPageTests",
      "userPageTests",
      "adminPageTests",
      "reportPageTests",
    ],
  },
  {
    pattern: /src\/utils\/|src\/data\/|src\/locale\/|tests\/fixtures\//,
    projects: [
      "homePageTests",
      "planningPageTests",
      "executionPageTests",
      "queryPageTests",
      "userPageTests",
      "adminPageTests",
      "reportPageTests",
    ],
  },
  {
    pattern: /playwright\.config\.ts|package\.json|tsconfig\.json/,
    projects: [
      "homePageTests",
      "planningPageTests",
      "executionPageTests",
      "queryPageTests",
      "userPageTests",
      "adminPageTests",
      "reportPageTests",
    ],
  },
];

function getChangedFiles(baseBranch: string): string[] {
  try {
    const diff = execSync(`git diff --name-only ${baseBranch}...HEAD`, {
      encoding: "utf-8",
    });
    return diff.trim().split("\n").filter(Boolean);
  } catch {
    // Fallback: last commit changes
    try {
      const diff = execSync("git diff --name-only HEAD~1", {
        encoding: "utf-8",
      });
      return diff.trim().split("\n").filter(Boolean);
    } catch {
      return [];
    }
  }
}

function selectProjects(changedFiles: string[]): string[] {
  const selected = new Set<string>();

  for (const file of changedFiles) {
    const normalized = file.replace(/\\/g, "/");
    for (const mapping of PATH_TO_PROJECT) {
      if (mapping.pattern.test(normalized)) {
        mapping.projects.forEach((p) => selected.add(p));
      }
    }
  }

  return Array.from(selected);
}

function main() {
  const baseBranch = process.argv[2] || "main";

  console.log(`\n  AI Test Selector - analyzing changes against ${baseBranch}`);
  console.log("=".repeat(60));

  const changedFiles = getChangedFiles(baseBranch);

  if (changedFiles.length === 0) {
    console.log("  No changed files detected. Running all tests.");
    console.log("  Command: npx playwright test");
    return;
  }

  console.log(`  Changed files (${changedFiles.length}):`);
  for (const f of changedFiles) console.log(`    - ${f}`);

  const projects = selectProjects(changedFiles);

  if (projects.length === 0) {
    console.log("\n  No test-relevant changes detected. Skipping test run.");
    const outPath = path.resolve(
      __dirname,
      "../reports/test-results/selected-projects.txt",
    );
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, "SKIP");
    return;
  }

  const projectFlags = projects.map((p) => `--project=${p}`).join(" ");
  const command = `npx playwright test ${projectFlags}`;

  console.log(`\n  Selected projects (${projects.length}):`);
  for (const p of projects) console.log(`    - ${p}`);
  console.log(`\n  Command: ${command}`);
  console.log("=".repeat(60));

  // Write for Jenkins consumption
  const outDir = path.resolve(__dirname, "../reports/test-results");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "selected-projects.txt"), projectFlags);
  console.log(`  Project flags written to: selected-projects.txt`);
}

main();
