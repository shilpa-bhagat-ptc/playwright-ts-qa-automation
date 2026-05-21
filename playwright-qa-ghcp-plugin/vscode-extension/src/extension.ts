import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

const TEMPLATE_FILES = [
  "copilot-instructions.md",
  "instructions/playwright-qa-framework.instructions.md",
  "prompts/add-test.prompt.md",
  "prompts/add-page-object.prompt.md",
  "agents/qa-test-writer.agent.md",
  "skills/playwright-qa/SKILL.md",
];

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("playwright-qa.installTemplates", () =>
      installTemplates(context),
    ),
    vscode.commands.registerCommand("playwright-qa.showGuide", () =>
      showGuide(context),
    ),
  );
}

async function installTemplates(context: vscode.ExtensionContext) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders?.length) {
    vscode.window.showErrorMessage(
      "No workspace folder open. Open your project folder first.",
    );
    return;
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;
  const templateRoot = path.join(context.extensionPath, "templates", ".github");
  const destRoot = path.join(workspaceRoot, ".github");

  const subdirs = [
    "instructions",
    "prompts",
    "agents",
    path.join("skills", "playwright-qa"),
  ];
  for (const sub of subdirs) {
    fs.mkdirSync(path.join(destRoot, sub), { recursive: true });
  }

  let copied = 0;
  let skipped = 0;

  for (const relPath of TEMPLATE_FILES) {
    const src = path.join(templateRoot, relPath);
    const dst = path.join(destRoot, relPath);

    if (!fs.existsSync(src)) {
      vscode.window.showWarningMessage(`Missing template: ${relPath}`);
      continue;
    }

    if (fs.existsSync(dst)) {
      const choice = await vscode.window.showWarningMessage(
        `.github/${relPath} already exists. Overwrite?`,
        { modal: false },
        "Overwrite",
        "Skip",
      );
      if (choice !== "Overwrite") {
        skipped++;
        continue;
      }
    }

    fs.copyFileSync(src, dst);
    copied++;
  }

  vscode.window
    .showInformationMessage(
      `Playwright QA: ${copied} file(s) installed, ${skipped} skipped. Open Copilot Chat and type / to use /add-test or /add-page-object.`,
      "Show Guide",
    )
    .then((action) => {
      if (action === "Show Guide") {
        vscode.commands.executeCommand("playwright-qa.showGuide");
      }
    });
}

function showGuide(context: vscode.ExtensionContext) {
  const skillPath = path.join(
    context.extensionPath,
    "templates",
    ".github",
    "skills",
    "playwright-qa",
    "SKILL.md",
  );
  if (!fs.existsSync(skillPath)) {
    vscode.window.showErrorMessage("Guide file not found in extension.");
    return;
  }
  vscode.commands.executeCommand(
    "markdown.showPreview",
    vscode.Uri.file(skillPath),
  );
}

export function deactivate() {}
