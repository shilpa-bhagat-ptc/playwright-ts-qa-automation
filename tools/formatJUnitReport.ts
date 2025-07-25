import * as fs from "fs";
import * as path from "path";
import { Builder, parseStringPromise } from "xml2js";

const inputPath = path.resolve(
  __dirname,
  "../reports/test-results/test-results.xml"
);
const outputPath = path.resolve(
  __dirname,
  "../reports/test-results/formatted-test-results.xml"
);

export async function formatXml() {
  try {
    const rawXml = fs.readFileSync(inputPath, "utf-8");
    const parsed = await parseStringPromise(rawXml);

    let testsuite;

    if (parsed.testsuites?.testsuite?.length) {
      testsuite = parsed.testsuites.testsuite[0];
    } else if (parsed.testsuite) {
      testsuite = parsed.testsuite;
    } else {
      throw new Error("No <testsuite> found in XML.");
    }

    for (const testcase of testsuite.testcase || []) {
      delete testcase["system-out"];

      if (testcase.failure) {
        testcase.failure = testcase.failure.map((fail: any) => ({
          $: fail.$,
        }));
      }
    }

    const builder = new Builder({ headless: true });
    const outputXml = builder.buildObject({ testsuite });

    fs.writeFileSync(outputPath, outputXml);
    console.log("✅ Hector-compatible JUnit XML written to:", outputPath);
  } catch (err) {
    console.error("❌ Error formatting XML:", err);
  }
}

formatXml();
