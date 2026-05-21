"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const TEMPLATE_FILES = [
    "copilot-instructions.md",
    "instructions/playwright-qa-framework.instructions.md",
    "prompts/add-test.prompt.md",
    "prompts/add-page-object.prompt.md",
    "agents/qa-test-writer.agent.md",
    "skills/playwright-qa/SKILL.md",
];
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("playwright-qa.installTemplates", () => installTemplates(context)), vscode.commands.registerCommand("playwright-qa.showGuide", () => showGuide(context)));
}
async function installTemplates(context) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders?.length) {
        vscode.window.showErrorMessage("No workspace folder open. Open your project folder first.");
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
            const choice = await vscode.window.showWarningMessage(`.github/${relPath} already exists. Overwrite?`, { modal: false }, "Overwrite", "Skip");
            if (choice !== "Overwrite") {
                skipped++;
                continue;
            }
        }
        fs.copyFileSync(src, dst);
        copied++;
    }
    vscode.window
        .showInformationMessage(`Playwright QA: ${copied} file(s) installed, ${skipped} skipped. Open Copilot Chat and type / to use /add-test or /add-page-object.`, "Show Guide")
        .then((action) => {
        if (action === "Show Guide") {
            vscode.commands.executeCommand("playwright-qa.showGuide");
        }
    });
}
function showGuide(context) {
    const skillPath = path.join(context.extensionPath, "templates", ".github", "skills", "playwright-qa", "SKILL.md");
    if (!fs.existsSync(skillPath)) {
        vscode.window.showErrorMessage("Guide file not found in extension.");
        return;
    }
    vscode.commands.executeCommand("markdown.showPreview", vscode.Uri.file(skillPath));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map