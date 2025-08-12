import * as fs from "fs";
import * as path from "path";
import { Builder, parseStringPromise } from "xml2js";

// Format seconds into "0d 0h Xm Ys"
function formatSecondsToHMS(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `0d 0h ${mins}m ${secs}s`;
}

export async function formatXml(
  inputPath: string = path.resolve(
    __dirname,
    "../reports/test-results/test-results.xml"
  ),
  outputPath: string = path.resolve(
    __dirname,
    "../reports/test-results/formatted-test-results.xml"
  )
) {
  try {
    if (!fs.existsSync(inputPath)) {
      console.warn("Input XML file not found →", inputPath);
      return;
    }

    const rawXml = fs.readFileSync(inputPath, "utf-8");
    const parsed = await parseStringPromise(rawXml);

    let suiteList: any[] = [];

    if (parsed.testsuite) {
      suiteList = [parsed.testsuite];
    } else if (parsed.testsuites?.testsuite) {
      suiteList = parsed.testsuites.testsuite;
    } else {
      console.warn("No <testsuite> found in XML. Skipping formatting.");
      return;
    }

    const testcases: any[] = [];
    let totalTests = 0;
    let totalFailures = 0;
    let totalSkipped = 0;
    let totalTime = 0;
    let hostname = "localhost";
    let timestamp = new Date().toISOString();

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
        const timeSeconds = parseFloat(testcase.$.time || "0");
        totalTime += timeSeconds;

        const testNode: any = {
          $: {
            classname: testcase.$.classname,
            name: testcase.$.name,
            time: formatSecondsToHMS(timeSeconds),
          },
        };

        // Preserve <failure> if test failed, but crop the logs
        if (testcase.failure) {
          const failureAttrs = testcase.failure[0].$ || {};
          let failureMessage = testcase.failure[0]._ || "";

          // Trim large logs, keep first 200 chars
          if (failureMessage.length > 200) {
            failureMessage =
              failureMessage.substring(0, 200) + "...[truncated]";
          }

          testNode.failure = [
            {
              $: {
                message: failureAttrs.message || "Test failed",
                type: failureAttrs.type || "Error",
              },
              _: failureMessage,
            },
          ];
        }

        testcases.push(testNode);
      }
    }

    const formatted = {
      testsuite: {
        $: {
          name: "Suite1",
          hostname,
          timestamp,
          tests: totalTests.toString(),
          failures: totalFailures.toString(),
          skipped: totalSkipped.toString(),
          time: formatSecondsToHMS(totalTime),
        },
        testcase: testcases,
      },
    };

    const builder = new Builder({ headless: true });
    const outputXml = builder.buildObject(formatted);
    fs.writeFileSync(outputPath, outputXml);

    console.log(
      "Final formatted XML written with",
      testcases.length,
      "test cases →",
      outputPath
    );
  } catch (err) {
    console.error("Error formatting XML:", err);
  }
}

// Allow CLI usage
if (require.main === module) {
  formatXml();
}
