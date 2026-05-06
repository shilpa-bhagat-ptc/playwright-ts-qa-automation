/**
 * Excel-to-Playwright Spec Converter
 *
 * Reads manual test cases from an Excel file and generates Playwright
 * TypeScript spec files that follow the project's POM framework conventions.
 *
 * Expected Excel columns (flexible matching, case-insensitive):
 *   - Test Case ID / TC ID / ID
 *   - Test Case Name / Title / Summary
 *   - Module / Page / Section
 *   - Steps / Test Steps / Procedure
 *   - Expected Result / Expected / Validation
 *   - Priority (optional)
 *   - Owner (optional)
 *   - Tags (optional)
 *
 * Usage:
 *   npx ts-node tools/excelToSpec.ts --file <path-to-excel> [--sheet <sheet-name>] [--outdir <output-dir>]
 *
 * Example:
 *   npx ts-node tools/excelToSpec.ts --file "test-cases/QALink_TestCases.xlsx" --outdir tests/specs/generated
 */

import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

// ─── Column Mapping (flexible header matching) ──────────────────────────
const COLUMN_ALIASES: Record<string, string[]> = {
  id: [
    "test case id",
    "tc id",
    "id",
    "testcaseid",
    "tc_id",
    "test id",
    "sr no",
    "s.no",
    "sl no",
  ],
  title: [
    "test case name",
    "title",
    "summary",
    "test case title",
    "name",
    "test name",
    "description",
    "test case description",
  ],
  module: ["module", "page", "section", "area", "feature", "component", "tab"],
  steps: [
    "steps",
    "test steps",
    "procedure",
    "actions",
    "step description",
    "test procedure",
    "action steps",
  ],
  expected: [
    "expected result",
    "expected",
    "validation",
    "expected output",
    "expected results",
    "expected behavior",
  ],
  priority: ["priority", "severity", "importance"],
  owner: ["owner", "assigned to", "tester", "author"],
  tags: ["tags", "labels", "category", "type"],
  precondition: ["precondition", "prerequisites", "pre-condition", "setup"],
};

interface ManualTestCase {
  id: string;
  title: string;
  module: string;
  steps: string[];
  expected: string[];
  priority?: string;
  owner?: string;
  tags?: string;
  precondition?: string;
}

/** Finds the matching column name from headers */
function resolveColumn(headers: string[], aliases: string[]): string | null {
  const normalized = headers.map((h) => h.toLowerCase().trim());
  for (const alias of aliases) {
    const idx = normalized.indexOf(alias);
    if (idx !== -1) return headers[idx];
  }
  // Fuzzy: check if any header contains any alias
  for (const alias of aliases) {
    const match = normalized.findIndex((h) => h.includes(alias));
    if (match !== -1) return headers[match];
  }
  return null;
}

/** Splits multi-line step text into individual steps */
function parseSteps(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(/\n|\r\n?|(?:\d+[\.\)]\s)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Parses Excel file and returns structured test cases */
function parseExcel(filePath: string, sheetName?: string): ManualTestCase[] {
  const workbook = XLSX.readFile(filePath);
  const sheet = sheetName
    ? workbook.Sheets[sheetName]
    : workbook.Sheets[workbook.SheetNames[0]];

  if (!sheet) {
    throw new Error(
      `Sheet "${sheetName || workbook.SheetNames[0]}" not found.`,
    );
  }

  const raw: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
  });
  if (raw.length === 0) throw new Error("Excel sheet is empty.");

  const headers = Object.keys(raw[0]);
  console.log(`   Headers found: ${headers.join(", ")}`);

  // Resolve column mappings
  const colMap: Record<string, string | null> = {};
  for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
    colMap[key] = resolveColumn(headers, aliases);
  }

  if (!colMap.title) {
    throw new Error(
      "Could not find a 'Title' or 'Test Case Name' column in the Excel file.",
    );
  }

  const testCases: ManualTestCase[] = [];

  for (const row of raw) {
    const id = colMap.id
      ? String(row[colMap.id]).trim()
      : `TC_${testCases.length + 1}`;
    const title = colMap.title ? String(row[colMap.title]).trim() : "";
    const module = colMap.module
      ? String(row[colMap.module]).trim()
      : "general";
    const stepsRaw = colMap.steps ? String(row[colMap.steps]) : "";
    const expectedRaw = colMap.expected ? String(row[colMap.expected]) : "";
    const priority = colMap.priority
      ? String(row[colMap.priority]).trim()
      : undefined;
    const owner = colMap.owner ? String(row[colMap.owner]).trim() : undefined;
    const tags = colMap.tags ? String(row[colMap.tags]).trim() : undefined;
    const precondition = colMap.precondition
      ? String(row[colMap.precondition]).trim()
      : undefined;

    if (!title) continue; // Skip empty rows

    testCases.push({
      id,
      title,
      module,
      steps: parseSteps(stepsRaw),
      expected: parseSteps(expectedRaw),
      priority,
      owner,
      tags,
      precondition,
    });
  }

  return testCases;
}

/** Maps module name to a known page object or the generic format */
function mapModuleToPageObject(
  module: string,
): { fixture: string; import: string } | null {
  const moduleMap: Record<string, { fixture: string; import: string }> = {
    home: { fixture: "homePage", import: "HomePage" },
    homepage: { fixture: "homePage", import: "HomePage" },
    planning: { fixture: "planningPage", import: "PlanningPage" },
    planningpage: { fixture: "planningPage", import: "PlanningPage" },
    login: { fixture: "loginPage", import: "LoginPage" },
    loginpage: { fixture: "loginPage", import: "LoginPage" },
  };
  const key = module.toLowerCase().replace(/[\s_-]/g, "");
  return moduleMap[key] || null;
}

/** Generates a Playwright spec file from a group of test cases */
function generateSpec(module: string, testCases: ManualTestCase[]): string {
  const pageObj = mapModuleToPageObject(module);
  const safeModule = module.replace(/[^a-zA-Z0-9]/g, "");

  // Build fixture destructuring
  const fixtures = pageObj
    ? `{ loginPage, ${pageObj.fixture}, page }`
    : "{ loginPage, page }";

  const imports = [
    `import { captureStepScreenshot } from "../../../src/utils/screenshotHelper";`,
    `import { expect, test } from "../../fixtures/fixture";`,
  ];

  const tests = testCases.map((tc) => {
    const stepComments = tc.steps
      .map((step, i) => {
        return `
  // Step ${i + 1}: ${step}
  // TODO: Implement using page object methods
  await captureStepScreenshot(page, testInfo, "step_${String(i + 1).padStart(2, "0")}");`;
      })
      .join("\n");

    const expectedComments = tc.expected
      .map((exp, i) => `  // Validation ${i + 1}: ${exp}`)
      .join("\n");

    const ownerAnnotation = tc.owner ? ` @owner:${tc.owner}` : "";
    const priorityAnnotation = tc.priority ? ` @priority:${tc.priority}` : "";

    return `
test("${tc.id} - ${tc.title.replace(/"/g, '\\"')}", async (${fixtures}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description: "${tc.title.replace(/"/g, '\\"')}${ownerAnnotation}${priorityAnnotation}",
  });
${tc.precondition ? `\n  // Precondition: ${tc.precondition}\n` : ""}
  // ── Test Steps ──────────────────────────────────────
${stepComments}

  // ── Expected Results ────────────────────────────────
${expectedComments}
  // TODO: Add expect() assertions for each validation

  await page.close();
});`;
  });

  return `${imports.join("\n")}

/**
 * Auto-generated from Excel test cases
 * Module: ${module}
 * Generated: ${new Date().toISOString()}
 *
 * TODO: Replace step comments with actual page object method calls.
 */

${tests.join("\n")}
`;
}

async function main() {
  const args = process.argv.slice(2);
  const fileIdx = args.indexOf("--file");
  const sheetIdx = args.indexOf("--sheet");
  const outdirIdx = args.indexOf("--outdir");

  if (fileIdx === -1) {
    console.error(
      "Usage: npx ts-node tools/excelToSpec.ts --file <excel-path> [--sheet <name>] [--outdir <dir>]",
    );
    console.error("\nExpected Excel columns (flexible matching):");
    for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
      console.error(`  ${key}: ${aliases.join(", ")}`);
    }
    process.exit(1);
  }

  const excelPath = args[fileIdx + 1];
  const sheetName = sheetIdx !== -1 ? args[sheetIdx + 1] : undefined;
  const outdir =
    outdirIdx !== -1 ? args[outdirIdx + 1] : "tests/specs/generated";

  if (!fs.existsSync(excelPath)) {
    console.error(`File not found: ${excelPath}`);
    process.exit(1);
  }

  console.log(`\n📊 Excel-to-Spec Converter`);
  console.log(`   File: ${excelPath}`);
  console.log(`   Sheet: ${sheetName || "(first sheet)"}`);
  console.log(`   Output: ${outdir}\n`);

  // Parse
  const testCases = parseExcel(excelPath, sheetName);
  console.log(`   Parsed ${testCases.length} test cases.\n`);

  // Group by module
  const groups = new Map<string, ManualTestCase[]>();
  for (const tc of testCases) {
    const mod = tc.module || "general";
    if (!groups.has(mod)) groups.set(mod, []);
    groups.get(mod)!.push(tc);
  }

  // Generate specs
  if (!fs.existsSync(outdir)) fs.mkdirSync(outdir, { recursive: true });

  for (const [module, cases] of groups) {
    const safeModule = module.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const specContent = generateSpec(module, cases);
    const specPath = path.join(outdir, `${safeModule}.generated.spec.ts`);
    fs.writeFileSync(specPath, specContent);
    console.log(`   📝 ${specPath} (${cases.length} tests)`);
  }

  // Save summary
  const summaryPath = path.join(outdir, "generation-summary.json");
  const summary = {
    sourceFile: excelPath,
    generatedAt: new Date().toISOString(),
    totalTestCases: testCases.length,
    modules: Array.from(groups.entries()).map(([mod, cases]) => ({
      module: mod,
      count: cases.length,
      testIds: cases.map((c) => c.id),
    })),
  };
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log(`\n📋 Summary saved: ${summaryPath}`);
  console.log(
    `\n✅ Generated ${groups.size} spec file(s) with ${testCases.length} total tests.`,
  );
  console.log(`   Next steps:`);
  console.log(`   1. Review generated specs in ${outdir}/`);
  console.log(`   2. Replace TODO comments with page object method calls`);
  console.log(`   3. Run: npx playwright test --project=generatedTests\n`);
}

main().catch((err) => {
  console.error("Conversion failed:", err);
  process.exit(1);
});
