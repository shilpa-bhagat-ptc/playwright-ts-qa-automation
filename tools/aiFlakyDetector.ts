/**
 * AI Flaky Test Detector
 *
 * Aggregates multiple JUnit XML result files (from past runs) and identifies
 * tests that intermittently pass/fail. Outputs a flaky test report and an
 * optional quarantine grep pattern to skip them in CI.
 *
 * Usage:
 *   npx ts-node tools/aiFlakyDetector.ts [results-directory]
 *
 * It reads all *.xml files in the directory and cross-references test names
 * across runs to find inconsistent outcomes.
 */

import fs from "fs";
import path from "path";
import { parseStringPromise } from "xml2js";

interface TestOutcome {
  name: string;
  className: string;
  passed: number;
  failed: number;
  skipped: number;
  failureMessages: string[];
}

async function parseResultFile(
  xmlPath: string,
): Promise<Map<string, { passed: boolean; message?: string }>> {
  const results = new Map<string, { passed: boolean; message?: string }>();
  const raw = fs.readFileSync(xmlPath, "utf-8");
  const parsed = await parseStringPromise(raw);

  let suites: any[] = [];
  if (parsed.testsuite) suites = [parsed.testsuite];
  else if (parsed.testsuites?.testsuite) suites = parsed.testsuites.testsuite;

  for (const suite of suites) {
    for (const tc of suite.testcase || []) {
      const key = `${tc.$.classname || ""}::${tc.$.name}`;
      if (tc.failure) {
        const msg = tc.failure[0]._ || tc.failure[0].$.message || "";
        results.set(key, { passed: false, message: msg.substring(0, 200) });
      } else if (!tc.skipped) {
        results.set(key, { passed: true });
      }
    }
  }

  return results;
}

function computeFlakyScore(outcome: TestOutcome): number {
  const total = outcome.passed + outcome.failed;
  if (total < 2) return 0;
  const failRate = outcome.failed / total;
  // Flaky = neither always passing nor always failing
  return Math.min(failRate, 1 - failRate) * 2; // 0 to 1, peak at 50/50
}

async function main() {
  const resultsDir =
    process.argv[2] || path.resolve(__dirname, "../reports/test-results");

  if (!fs.existsSync(resultsDir)) {
    console.error(`Results directory not found: ${resultsDir}`);
    process.exit(1);
  }

  const xmlFiles = fs
    .readdirSync(resultsDir)
    .filter((f) => f.endsWith(".xml"))
    .map((f) => path.join(resultsDir, f));

  if (xmlFiles.length === 0) {
    console.log("No XML result files found.");
    return;
  }

  console.log(
    `\n  AI Flaky Test Detector - analyzing ${xmlFiles.length} result file(s)`,
  );
  console.log("=".repeat(60));

  // Aggregate outcomes across all files
  const outcomes = new Map<string, TestOutcome>();

  for (const xmlFile of xmlFiles) {
    const fileResults = await parseResultFile(xmlFile);
    for (const [key, result] of fileResults) {
      if (!outcomes.has(key)) {
        const [className, name] = key.split("::");
        outcomes.set(key, {
          name: name || key,
          className: className || "",
          passed: 0,
          failed: 0,
          skipped: 0,
          failureMessages: [],
        });
      }
      const o = outcomes.get(key)!;
      if (result.passed) o.passed++;
      else {
        o.failed++;
        if (result.message) o.failureMessages.push(result.message);
      }
    }
  }

  // Find flaky tests (score > 0)
  const flaky: { outcome: TestOutcome; score: number }[] = [];
  for (const outcome of outcomes.values()) {
    const score = computeFlakyScore(outcome);
    if (score > 0) flaky.push({ outcome, score });
  }

  flaky.sort((a, b) => b.score - a.score);

  if (flaky.length === 0) {
    console.log(
      "  No flaky tests detected. All tests have consistent outcomes.",
    );
    return;
  }

  console.log(`\n  FLAKY TESTS DETECTED: ${flaky.length}`);
  console.log("-".repeat(60));

  for (const { outcome, score } of flaky) {
    const total = outcome.passed + outcome.failed;
    const severity = score > 0.7 ? "HIGH" : score > 0.3 ? "MEDIUM" : "LOW";
    console.log(
      `\n  [${severity}] ${outcome.name} (flaky score: ${(score * 100).toFixed(0)}%)`,
    );
    console.log(`    Class: ${outcome.className}`);
    console.log(
      `    Runs: ${total} | Passed: ${outcome.passed} | Failed: ${outcome.failed}`,
    );
    if (outcome.failureMessages.length > 0) {
      console.log(
        `    Last failure: ${outcome.failureMessages[outcome.failureMessages.length - 1].substring(0, 120)}...`,
      );
    }
  }

  // Write quarantine pattern
  const quarantineNames = flaky
    .filter((f) => f.score > 0.3)
    .map((f) => f.outcome.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (quarantineNames.length > 0) {
    const grepPattern = quarantineNames.join("|");
    const quarantinePath = path.join(resultsDir, "quarantine-grep.txt");
    fs.writeFileSync(quarantinePath, grepPattern);
    console.log(`\n  Quarantine grep pattern saved to: ${quarantinePath}`);
    console.log(
      `  Use: npx playwright test --grep-invert "${grepPattern}" to skip flaky tests`,
    );
  }

  // Write JSON report
  const reportPath = path.join(resultsDir, "flaky-test-report.json");
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      flaky.map((f) => ({ ...f.outcome, flakyScore: f.score })),
      null,
      2,
    ),
  );
  console.log(`  JSON report saved to: ${reportPath}`);
  console.log("=".repeat(60));
}

main();
