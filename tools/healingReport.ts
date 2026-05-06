/**
 * Healing Report Generator
 *
 * Reads the self-healing log and produces a summary report showing
 * which locators are frequently failing and need manual updates.
 *
 * Usage:
 *   npx ts-node tools/healingReport.ts
 */

import fs from "fs";
import path from "path";

interface HealingLogEntry {
  timestamp: string;
  description: string;
  primarySelector: string;
  usedSelector: string;
  strategy: string;
  pageUrl: string;
}

const LOG_PATH = path.join("reports", "self-healing-log.json");

function main() {
  if (!fs.existsSync(LOG_PATH)) {
    console.log("No self-healing log found. All locators are healthy.");
    return;
  }

  const log: HealingLogEntry[] = JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));

  if (log.length === 0) {
    console.log("Self-healing log is empty. No issues detected.");
    return;
  }

  // Group by primary selector
  const groups = new Map<string, HealingLogEntry[]>();
  for (const entry of log) {
    const key = entry.primarySelector;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }

  // Sort by frequency
  const sorted = Array.from(groups.entries()).sort(
    (a, b) => b[1].length - a[1].length,
  );

  console.log("\n🩺 Self-Healing Locator Report");
  console.log("═".repeat(70));
  console.log(`   Total heal events: ${log.length}`);
  console.log(`   Unique broken locators: ${groups.size}`);
  console.log("═".repeat(70));

  for (const [selector, entries] of sorted) {
    const latest = entries[entries.length - 1];
    console.log(`\n  🔴 ${latest.description} (${entries.length} heals)`);
    console.log(`     Primary:  ${selector}`);
    console.log(`     Last healed: ${latest.usedSelector}`);
    console.log(`     Strategy: ${latest.strategy}`);
    console.log(`     Page: ${latest.pageUrl}`);
    console.log(
      `     Suggestion: Update the primary locator to "${latest.usedSelector}"`,
    );
  }

  console.log("\n" + "═".repeat(70));
  console.log("  Run this after each test suite to track locator health.\n");
}

main();
