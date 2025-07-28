import * as fs from "fs";
import * as path from "path";
import { Builder, parseStringPromise } from "xml2js";

const inputPath = path.resolve(__dirname, "../reports/test-results/test-results.xml");
const outputPath = path.resolve(__dirname, "../reports/test-results/formatted-test-results.xml");

function formatSecondsToHMS(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `0d 0h ${mins}m ${secs}s`;
}

export async function formatXml() {
  try {
    const rawXml = fs.readFileSync(inputPath, "utf-8");
    const parsed = await parseStringPromise(rawXml);

    const testcases: any[] = [];
    let totalTests = 0;
    let totalFailures = 0;
    let totalSkipped = 0;
    let totalTime = 0;
    let hostname = "localhost";
    let timestamp = new Date().toISOString();

    const suiteList = parsed.testsuites?.testsuite || [parsed.testsuite];

    for (const suite of suiteList) {
      const suiteTestcases = suite.testcase || [];
      totalTests += suite.$?.tests
        ? parseInt(suite.$.tests)
        : suiteTestcases.length;
      totalFailures += parseInt(suite.$.failures || "0");
      totalSkipped += parseInt(suite.$.skipped || "0");
      hostname = suite.$.hostname || hostname;
      timestamp = suite.$.timestamp || timestamp;

      for (const testcase of suiteTestcases) {
        delete testcase["system-out"];
        const timeSeconds = parseFloat(testcase.$.time || "0");
        totalTime += timeSeconds;

        const formattedTestcase: any = {
          $: {
            classname: testcase.$.classname,
            name: testcase.$.name,
            time: formatSecondsToHMS(timeSeconds),
          },
        };

        // Preserve <failure> if present
        if (testcase.failure && testcase.failure.length > 0) {
          formattedTestcase.failure = testcase.failure.map((f: any) => ({
            $: {
              message: f.$?.message || "Test failed",
              type: f.$?.type || "Error",
            },
            _: f._ || "",
          }));
        }
