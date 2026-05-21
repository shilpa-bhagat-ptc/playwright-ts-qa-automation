#!/usr/bin/env bash
# Playwright QA GHCP Plugin — Installer (Bash)
# Usage: ./install.sh [/path/to/your/project]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${1:-$(pwd)}"
SRC="$SCRIPT_DIR/.github"
DST="$TARGET/.github"

echo ""
echo "Playwright QA GitHub Copilot Plugin Installer"
echo "================================================"
echo "Source : $SRC"
echo "Target : $DST"
echo ""

if [[ ! -d "$SRC" ]]; then
  echo "ERROR: Source .github/ not found at $SRC" >&2
  exit 1
fi

# Create subdirectories
for sub in instructions prompts agents "skills/playwright-qa"; do
  mkdir -p "$DST/$sub"
done

copy_file() {
  local src="$SRC/$1"
  local dst="$DST/$1"

  if [[ ! -f "$src" ]]; then
    echo "  WARNING: missing $1"
    return
  fi

  if [[ -f "$dst" ]]; then
    read -rp "  Overwrite existing .github/$1? [y/N] " choice
    if [[ "$choice" != "y" && "$choice" != "Y" ]]; then
      echo "  Skipped : .github/$1"
      return
    fi
  fi

  cp "$src" "$dst"
  echo "  Copied  : .github/$1"
}

copy_file "copilot-instructions.md"
copy_file "instructions/playwright-qa-framework.instructions.md"
copy_file "prompts/add-test.prompt.md"
copy_file "prompts/add-page-object.prompt.md"
copy_file "agents/qa-test-writer.agent.md"
copy_file "skills/playwright-qa/SKILL.md"

echo ""
echo "Done. Open your project in VS Code and use:"
echo "  /add-test           — generate a new test case"
echo "  /add-page-object    — generate a page object + locators"
echo "  /playwright-qa      — full framework build guide"
echo "  Agent: qa-test-writer — debugging and test writing"
echo ""
