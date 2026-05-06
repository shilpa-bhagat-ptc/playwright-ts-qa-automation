/**
 * AI Test Failure Analyzer
 *
 * Parses JUnit XML test results after a Playwright run, categorizes failures
 * by root cause pattern, and generates an actionable summary report.
 *
 * Categories:
 *   - LOCATOR:  Element not found / selector broken
 *   - TIMEOUT:  Navigation or action timed out
 *   - ASSERTION: Expected vs actual mismatch
 *   - NETWORK:  HTTP / API errors
 *   - AUTH:     Session / login failures
 *   - UNKNOWN:  Unclassified
 *
 * Usage:
 *   npx ts-node tools/aiFailureAnalyzer.ts [path-to-results.xml]
 */

import fs from "fs";
import path from "path";
import { parseStringPromise } from "xml2js";

type FailureCategory =
  | "LOCATOR"
  | "TIMEOUT"
  | "ASSERTION"
  | "NETWORK"
  | "AUTH"
  | "UNKNOWN";

interface AnalyzedFailure {
  testName: string;
  className: string;
  category: FailureCategory;
  message: string;
  suggestion: string;
}

interface AnalysisReport {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  failures: AnalyzedFailure[];
  categorySummary: Record<FailureCategory, number>;
  retryRecommendation: string[];
  blockerTests: string[];
}

const CATEGORY_PATTERNS: { category: FailureCategory; patterns: RegExp[] }[] = [
  {
    category: "LOCATOR",
    patterns: [
      /locator\b.*resolved to \d+ element/i,
      /waiting for (locator|selector)/i,
      /element not found/i,
      /no element matches/i,
      /strict mode violation/i,
    ],
  },
  {
    category: "TIMEOUT",
    patterns: [
      /timeout \d+ms exceeded/i,
      /waiting for navigation/i,
      /page\.goto.*timeout/i,
      /timed? ?out/i,
      /exceeded the maximum/i,
    ],
  },
  {
    category: "ASSERTION",
    patterns: [
      /expect\(.*\)\./i,
      /expected .* to (be|have|contain|equal|match)/i,
      /toBeVisible|toHaveText|toContain|toBe\b/i,
      /assertion failed/i,
      /received.*expected/i,
    ],
  },
  {
    category: "NETWORK",
    patterns: [
      /net::ERR_/i,
      /ECONNREFUSED/i,
      /status (4\d{2}|5\d{2})/i,
      /fetch failed/i,
      /network error/i,
    ],
  },
  {
    category: "AUTH",
    patterns: [
      /login/i,
      /session expired/i,
      /unauthorized/i,
      /401/,
      /storageState/i,
      /authentication/i,
    ],
  },
];

function categorize(message: string): FailureCategory {
  for (const { category, patterns } of CATEGORY_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(message)) return category;
    }
  }
  return "UNKNOWN";
}

function suggest(category: FailureCategory, message: string): string {
  switch (category) {
    case "LOCATOR":
      return "Locator is broken or page structure changed. Run `npm run crawl:pages` to re-extract locators via MCP, or check self-healing report with `npm run report:healing`.";
    case "TIMEOUT":
      return "Page or element load is slow. Check if the server is responding. Consider increasing timeout or adding explicit waits in the page object.";
    case "ASSERTION":
      return "Test data or UI content has changed. Verify expected values in testData/commonProperties.json match the current application state.";
    case "NETWORK":
      return "Application server may be down or unreachable. Verify the base URL and network connectivity from the Jenkins agent.";
    case "AUTH":
      return "Login or session issue. Check credentials in global-setup.ts and verify the auth storage state file is being created.";
    case "UNKNOWN":
      return "Review the full error trace manually. Consider adding this pattern to aiFailureAnalyzer.ts for future classification.";
  }
}

async function analyze(xmlPath: string): Promise<AnalysisReport> {
  const raw = fs.readFileSync(xmlPath, "utf-8");
  const parsed = await parseStringPromise(raw);

  let suites: any[] = [];
  if (parsed.testsuite) suites = [parsed.testsuite];
  else if (parsed.testsuites?.testsuite) suites = parsed.testsuites.testsuite;

  const failures: AnalyzedFailure[] = [];
  let totalTests = 0;
  let totalFailures = 0;
  let totalSkipped = 0;

  for (const suite of suites) {
    totalTests += parseInt(suite.$.tests || "0");
    totalFailures += parseInt(suite.$.failures || "0");
    totalSkipped += parseInt(suite.$.skipped || "0");

    for (const tc of suite.testcase || []) {
      if (!tc.failure) continue;
      const msg = tc.failure[0]._ || tc.failure[0].$.message || "No message";
      const category = categorize(msg);

      failures.push({
        testName: tc.$.name,
        className: tc.$.classname || "",
        category,
        message: msg.substring(0, 300),
        suggestion: suggest(category, msg),
      });
    }
  }

  const categorySummary: Record<FailureCategory, number> = {
    LOCATOR: 0,
    TIMEOUT: 0,
    ASSERTION: 0,
    NETWORK: 0,
    AUTH: 0,
    UNKNOWN: 0,
  };
  for (const f of failures) categorySummary[f.category]++;

  // Tests that are likely transient and worth retrying
  const retryRecommendation = failures
    .filter((f) => f.category === "TIMEOUT" || f.category === "NETWORK")
    .map((f) => f.testName);

  // Tests that indicate a real bug/blocker
  const blockerTests = failures
    .filter((f) => f.category === "ASSERTION" || f.category === "LOCATOR")
    .map((f) => f.testName);

  return {
    totalTests,
    passed: totalTests - totalFailures - totalSkipped,
    failed: totalFailures,
    skipped: totalSkipped,
    failures,
    categorySummary,
    retryRecommendation,
    blockerTests,
  };
}

function printReport(report: AnalysisReport): void {
  console.log("\n" + "=".repeat(70));
  console.log("  AI FAILURE ANALYSIS REPORT");
  console.log("=".repeat(70));
  console.log(
    `  Total: ${report.totalTests} | Passed: ${report.passed} | Failed: ${report.failed} | Skipped: ${report.skipped}`,
  );
  console.log("-".repeat(70));

  console.log("\n  FAILURE BREAKDOWN BY CATEGORY:");
  for (const [cat, count] of Object.entries(report.categorySummary)) {
    if (count > 0) console.log(`    ${cat}: ${count}`);
  }

  if (report.failures.length > 0) {
    console.log("\n  DETAILED FAILURES:");
    for (const f of report.failures) {
      console.log(`\n    [${f.category}] ${f.testName}`);
      console.log(`      Class: ${f.className}`);
      console.log(`      Error: ${f.message.substring(0, 150)}...`);
      console.log(`      Fix:   ${f.suggestion}`);
    }
  }

  if (report.retryRecommendation.length > 0) {
    console.log("\n  RETRY CANDIDATES (transient failures):");
    for (const t of report.retryRecommendation) console.log(`    - ${t}`);
  }

  if (report.blockerTests.length > 0) {
    console.log("\n  BLOCKERS (need investigation):");
    for (const t of report.blockerTests) console.log(`    - ${t}`);
  }

  console.log("\n" + "=".repeat(70));
}

async function main() {
  const xmlPath =
    process.argv[2] ||
    path.resolve(__dirname, "../reports/test-results/results.xml");

  if (!fs.existsSync(xmlPath)) {
    console.error(`Results file not found: ${xmlPath}`);
    process.exit(1);
  }

  const report = await analyze(xmlPath);

  // Print to console
  printReport(report);

  // Write JSON report for Jenkins or downstream consumption
  const jsonPath = path.resolve(
    path.dirname(xmlPath),
    "ai-failure-analysis.json",
  );
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`\n  JSON report saved to: ${jsonPath}`);

  // Write retry list for selective re-run
  if (report.retryRecommendation.length > 0) {
    const retryGrep = report.retryRecommendation
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    const retryPath = path.resolve(
      path.dirname(xmlPath),
      "retry-grep-pattern.txt",
    );
    fs.writeFileSync(retryPath, retryGrep);
    console.log(`  Retry grep pattern saved to: ${retryPath}`);
  }

  // Exit with failure if blockers exist
  if (report.blockerTests.length > 0) {
    process.exit(1);
  }
}

main();
