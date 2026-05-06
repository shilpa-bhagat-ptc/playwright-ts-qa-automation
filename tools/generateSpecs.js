/**
 * Generate Playwright spec files from Excel test case data (test-cases-data.json).
 * Maps each test case to the correct tests/specs/{pageArea}/{subFeature}/ directory.
 * Skips files that already have content (>2 bytes).
 */
const fs = require("fs");
const path = require("path");

const data = require("../test-cases-data.json");

// ── Functional Area → Directory Mapping ──────────────────────────────
const AREA_MAP = {
  // HomeTab_TC
  home: { pageArea: "homePage", subFeature: "", prefix: "HOM" },
  "home/production dashboard": {
    pageArea: "homePage",
    subFeature: "ProductionDashboard",
    prefix: "HOM",
  },
  "home/weekly note editor": {
    pageArea: "homePage",
    subFeature: "weeklyNoteEditor",
    prefix: "HOM",
  },
  "home=>tips": { pageArea: "homePage", subFeature: "tips", prefix: "HOM" },
  // QueryTab_TC
  "query tab": { pageArea: "queryPage", subFeature: "", prefix: "QUERY" },
  // ExecutionTab_TC
  "execution tab": {
    pageArea: "executionPage",
    subFeature: "",
    prefix: "EXEC",
  },
  "execution tab/ list tab": {
    pageArea: "executionPage",
    subFeature: "list",
    prefix: "EXEC",
  },
  "execution tab/weekly goal": {
    pageArea: "executionPage",
    subFeature: "weeklyGoal",
    prefix: "EXEC",
  },
  "execution tab/qa lab": {
    pageArea: "executionPage",
    subFeature: "QALab",
    prefix: "EXEC",
  },
  "execution tab/configuration": {
    pageArea: "executionPage",
    subFeature: "configurations",
    prefix: "EXEC",
  },
  "execution tab/analysis": {
    pageArea: "executionPage",
    subFeature: "analysis",
    prefix: "EXEC",
  },
  "execution tab/search": {
    pageArea: "executionPage",
    subFeature: "search",
    prefix: "EXEC",
  },
  // PlanningTab_TC
  "planning tab": {
    pageArea: "planningPage",
    subFeature: "release",
    prefix: "PLAN",
  },
  "planning → release → weekly note": {
    pageArea: "planningPage",
    subFeature: "release",
    prefix: "PLAN",
  },
  "resource capacity tab": {
    pageArea: "planningPage",
    subFeature: "resouceCapacity",
    prefix: "PLAN",
  },
  "analyze tab": {
    pageArea: "planningPage",
    subFeature: "analyze",
    prefix: "PLAN",
  },
  "select tab": {
    pageArea: "planningPage",
    subFeature: "select",
    prefix: "PLAN",
  },
  "advance select": {
    pageArea: "planningPage",
    subFeature: "advanceSelect",
    prefix: "PLAN",
  },
  "test automation": {
    pageArea: "planningPage",
    subFeature: "testAutomation",
    prefix: "PLAN",
  },
  drop: { pageArea: "planningPage", subFeature: "drop", prefix: "PLAN" },
  "weekly gooal": {
    pageArea: "planningPage",
    subFeature: "weeklyGoal",
    prefix: "PLAN",
  },
  assign: { pageArea: "planningPage", subFeature: "assign", prefix: "PLAN" },
  "weekly assign": {
    pageArea: "planningPage",
    subFeature: "weeklyAssign",
    prefix: "PLAN",
  },
  // ReportTab_TC
  report: { pageArea: "reportPage", subFeature: "", prefix: "RPT" },
  "report/overall": {
    pageArea: "reportPage",
    subFeature: "overall",
    prefix: "RPT",
  },
  "report/cft report": {
    pageArea: "reportPage",
    subFeature: "CFTReport",
    prefix: "RPT",
  },
  "report/testcase info": {
    pageArea: "reportPage",
    subFeature: "testCaseInfo",
    prefix: "RPT",
  },
  "report/weekly report": {
    pageArea: "reportPage",
    subFeature: "weeklyReport",
    prefix: "RPT",
  },
  "report/time report": {
    pageArea: "reportPage",
    subFeature: "timeReport",
    prefix: "RPT",
  },
  // UserTab_TC
  "user tab": { pageArea: "userPage", subFeature: "", prefix: "USR" },
  "user tab/my weekly goal": {
    pageArea: "userPage",
    subFeature: "myWeeklyGoal",
    prefix: "USR",
  },
  "user tab/my profile": {
    pageArea: "userPage",
    subFeature: "myProfile",
    prefix: "USR",
  },
  "user/my tasks": {
    pageArea: "userPage",
    subFeature: "myTasks",
    prefix: "USR",
  },
  "user/resource": {
    pageArea: "userPage",
    subFeature: "resources",
    prefix: "USR",
  },
  "user/non testing resource": {
    pageArea: "userPage",
    subFeature: "nonTestingResources",
    prefix: "USR",
  },
  // AdminTab_TC
  "admin tab": { pageArea: "adminPage", subFeature: "", prefix: "ADM" },
  "admin tab/users": {
    pageArea: "adminPage",
    subFeature: "users",
    prefix: "ADM",
  },
  "admin tab/offices": {
    pageArea: "adminPage",
    subFeature: "offices",
    prefix: "ADM",
  },
  "admin tab/configurations": {
    pageArea: "adminPage",
    subFeature: "configurations",
    prefix: "ADM",
  },
  "admin tab/language": {
    pageArea: "adminPage",
    subFeature: "languages",
    prefix: "ADM",
  },
  "admin tab/platforms": {
    pageArea: "adminPage",
    subFeature: "platforms",
    prefix: "ADM",
  },
  "admin tab/products": {
    pageArea: "adminPage",
    subFeature: "products",
    prefix: "ADM",
  },
  "admin tab/components": {
    pageArea: "adminPage",
    subFeature: "components",
    prefix: "ADM",
  },
  "admin tab/ test types": {
    pageArea: "adminPage",
    subFeature: "testTypes",
    prefix: "ADM",
  },
  "admin tab/ctf report": {
    pageArea: "adminPage",
    subFeature: "CFTreport",
    prefix: "ADM",
  },
  "admin tab/ app type": {
    pageArea: "adminPage",
    subFeature: "appType",
    prefix: "ADM",
  },
  "admin tab/application": {
    pageArea: "adminPage",
    subFeature: "applications",
    prefix: "ADM",
  },
  "admin tab/ release": {
    pageArea: "adminPage",
    subFeature: "releases",
    prefix: "ADM",
  },
};

// Sheet fallback for UNSPECIFIED areas
const SHEET_FALLBACK = {
  HomeTab_TC: { pageArea: "homePage", prefix: "HOM" },
  QueryTab_TC: { pageArea: "queryPage", prefix: "QUERY" },
  ExecutionTab_TC: { pageArea: "executionPage", prefix: "EXEC" },
  PlanningTab_TC: { pageArea: "planningPage", prefix: "PLAN" },
  ReportTab_TC: { pageArea: "reportPage", prefix: "RPT" },
  UserTab_TC: { pageArea: "userPage", prefix: "USR" },
  AdminTab_TC: { pageArea: "adminPage", prefix: "ADM" },
};

// Content-based routing for UNSPECIFIED QueryTab rows
function routeUnspecifiedQuery(summary) {
  const s = summary.toLowerCase();
  if (s.includes("basic") || s.includes("load test case document displays"))
    return "basic";
  if (s.includes("update")) return "update";
  if (
    s.includes("hyperlink") ||
    s.includes("filter") ||
    s.includes("review") ||
    s.includes("duplicate")
  )
    return "advanced";
  return "basic";
}

// Content-based routing for UNSPECIFIED Report rows
function routeUnspecifiedReport(summary) {
  const s = summary.toLowerCase();
  if (s.includes("roi")) return "ROIReport";
  if (
    s.includes("weekly report") ||
    s.includes("send mail") ||
    s.includes("push weekly")
  )
    return "weeklyReport";
  if (s.includes("execution") || s.includes("summary report"))
    return "executionReport";
  if (s.includes("overall")) return "overall";
  if (s.includes("cft")) return "CFTReport";
  if (s.includes("time")) return "timeReport";
  return "overall";
}

// Page fixture map
const PAGE_FIXTURES = {
  homePage: {
    fixture: "homePage",
    locators: "HOME_PAGE_LOCATORS",
    locatorFile: "homePage.locators",
  },
  planningPage: {
    fixture: "planningPage",
    locators: "PLANNING_PAGE_LOCATORS",
    locatorFile: "planningPage.locators",
  },
  executionPage: {
    fixture: "page",
    locators: "EXECUTION_PAGE_LOCATORS",
    locatorFile: "executionPage.locators",
  },
  adminPage: {
    fixture: "page",
    locators: "ADMIN_PAGE_LOCATORS",
    locatorFile: "adminPage.locators",
  },
  queryPage: {
    fixture: "page",
    locators: "QUERY_PAGE_LOCATORS",
    locatorFile: "queryPage.locators",
  },
  reportPage: {
    fixture: "page",
    locators: "REPORT_PAGE_LOCATORS",
    locatorFile: "reportPage.locators",
  },
  userPage: {
    fixture: "page",
    locators: "USER_PAGE_LOCATORS",
    locatorFile: "userPage.locators",
  },
};

// Existing spec files with real content (>2 bytes) - DO NOT overwrite
const PROTECTED_SPECS = [
  "tests/specs/homePage/ProductionDashboard/productionDashboardTest.spec.ts",
  "tests/specs/homePage/tips/tipsTests.spec.ts",
  "tests/specs/homePage/weeklyNote/weeklyNoteTests.spec.ts",
  "tests/specs/homePage/weeklyNoteEditor/weeklyNoteEditor.spec.ts",
  "tests/specs/planningPage/release/releaseTests.spec.ts",
  "tests/specs/planningPage/resouceCapacity/resourceCapacityTests.spec.ts",
  "tests/specs/API/login.spec.ts",
];

// Existing spec file names per directory (to avoid duplicate file names)
const EXISTING_SPEC_FILES = {};

function parseSteps(raw) {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((s) => s.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter((s) => s.length > 0 && !s.match(/^[-–—]+$/));
}

function slugify(text) {
  return text
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .substring(0, 40)
    .toLowerCase();
}

function escapeQuotes(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveMapping(tc, sheetName) {
  const areaKey = tc.area.toLowerCase().trim();

  if (areaKey && AREA_MAP[areaKey]) {
    return AREA_MAP[areaKey];
  }

  // UNSPECIFIED area - route by content
  const fallback = SHEET_FALLBACK[sheetName];
  if (!fallback) return null;

  let subFeature = "";
  if (sheetName === "QueryTab_TC") {
    subFeature = routeUnspecifiedQuery(tc.summary);
  } else if (sheetName === "ReportTab_TC") {
    subFeature = routeUnspecifiedReport(tc.summary);
  } else if (sheetName === "PlanningTab_TC") {
    subFeature = "release"; // Default planning unspecified to release
  } else if (sheetName === "AdminTab_TC") {
    subFeature = ""; // Root admin page tests
  }

  return { pageArea: fallback.pageArea, subFeature, prefix: fallback.prefix };
}

// ── Group test cases by target directory ──────────────────────────────
const groups = new Map(); // key: "pageArea/subFeature" -> { pageArea, subFeature, prefix, testCases }

for (const [sheetName, cases] of Object.entries(data)) {
  for (const tc of cases) {
    const mapping = resolveMapping(tc, sheetName);
    if (!mapping) {
      console.warn(
        `  SKIP: No mapping for area="${tc.area}" in ${sheetName}: ${tc.summary}`,
      );
      continue;
    }

    const key = `${mapping.pageArea}/${mapping.subFeature}`;
    if (!groups.has(key)) {
      groups.set(key, {
        pageArea: mapping.pageArea,
        subFeature: mapping.subFeature,
        prefix: mapping.prefix,
        testCases: [],
      });
    }
    groups.get(key).testCases.push(tc);
  }
}

// ── Generate spec files ──────────────────────────────────────────────
let totalFiles = 0;
let totalTests = 0;
let skippedFiles = 0;

for (const [key, group] of groups) {
  const { pageArea, subFeature, prefix, testCases } = group;
  const pageFixture = PAGE_FIXTURES[pageArea] || PAGE_FIXTURES.homePage;

  // Determine output directory
  const specDir = subFeature
    ? path.join("tests", "specs", pageArea, subFeature)
    : path.join("tests", "specs", pageArea);

  // Determine file name - match existing convention
  const specFileName = subFeature
    ? `${subFeature}Tests.spec.ts`
    : `${pageArea.replace("Page", "")}Tests.spec.ts`;

  const specPath = path.join(specDir, specFileName);

  // Check if this file is protected (has real content)
  const isProtected = PROTECTED_SPECS.some((p) => {
    const normalizedP = p.replace(/\//g, path.sep);
    return specPath === normalizedP || specPath.includes(normalizedP);
  });

  // Check if file already exists with real (manually written) content
  const fullPath = path.resolve(specPath);
  if (isProtected && fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    if (stat.size > 10) {
      console.log(`  SKIP (protected): ${specPath} (${stat.size} bytes)`);
      skippedFiles++;
      continue;
    }
  }

  // Ensure directory exists
  fs.mkdirSync(specDir, { recursive: true });

  // Build fixture destructuring
  const hasCustomFixture = pageFixture.fixture !== "page";
  const fixtures = hasCustomFixture
    ? `{ loginPage, ${pageFixture.fixture}, page }`
    : "{ loginPage, page }";

  // Build imports - adjust depth based on whether spec is in a subfolder
  const srcPrefix = subFeature ? "../../../../src" : "../../../src";
  const fixturePrefix = subFeature ? "../../../fixtures" : "../../fixtures";
  const imports = [
    `import { captureStepScreenshot } from "${srcPrefix}/utils/screenshotHelper";`,
    `import { expect, test } from "${fixturePrefix}/fixture";`,
  ];

  // Generate tests
  const tests = testCases.map((tc, idx) => {
    const tcNum = String(idx + 1).padStart(3, "0");
    const tcId = tc.id
      ? `TC_${prefix}_${String(tc.id).padStart(3, "0")}`
      : `TC_${prefix}_${tcNum}`;
    const steps = parseSteps(tc.steps);
    const expectedSteps = parseSteps(tc.expected);
    const owner = tc.owner || "QA Team";
    const summary = escapeQuotes(tc.summary);

    const stepCode = steps
      .map((step, i) => {
        const stepNum = String(i + 1).padStart(2, "0");
        const stepSlug = slugify(step).substring(0, 30);
        return `
  // Step ${i + 1}: ${escapeQuotes(step)}
  // TODO: Implement using page object methods
  await captureStepScreenshot(page, testInfo, "${stepNum}_${stepSlug}");`;
      })
      .join("\n");

    const expectedCode = expectedSteps
      .map((exp, i) => {
        return `  // Expected ${i + 1}: ${escapeQuotes(exp)}`;
      })
      .join("\n");

    const precondition = tc.prereq
      ? `\n  // Precondition: ${escapeQuotes(tc.prereq)}\n`
      : "";

    return `
test("${tcId} - ${summary}", async (${fixtures}, testInfo) => {
  testInfo.annotations.push({
    type: "description",
    description: "${summary} @owner:${escapeQuotes(owner)}",
  });
${precondition}
  // ── Test Steps ──────────────────────────────────────
${stepCode}

  // ── Expected Results ────────────────────────────────
${expectedCode}
  // TODO: Add expect() assertions for each validation

  await page.close();
});`;
  });

  const fileContent = `${imports.join("\n")}

/**
 * Auto-generated from Excel: QALink Test Cases.xlsx
 * Page Area: ${pageArea}${subFeature ? ` / ${subFeature}` : ""}
 * Test Cases: ${testCases.length}
 * Generated: ${new Date().toISOString().split("T")[0]}
 *
 * TODO: Replace step comments with actual page object method calls.
 */
${tests.join("\n")}
`;

  fs.writeFileSync(specPath, fileContent, "utf-8");
  console.log(`  CREATED: ${specPath} (${testCases.length} tests)`);
  totalFiles++;
  totalTests += testCases.length;
}

console.log(`\n=== Summary ===`);
console.log(`  Files created: ${totalFiles}`);
console.log(`  Total tests: ${totalTests}`);
console.log(`  Files skipped (had content): ${skippedFiles}`);
