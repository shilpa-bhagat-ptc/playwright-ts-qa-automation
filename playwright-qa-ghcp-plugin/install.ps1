# Playwright QA GHCP Plugin — Installer (PowerShell)
# Usage: .\install.ps1 [-TargetPath "C:\path\to\your\project"]

param(
    [string]$TargetPath = (Get-Location).Path
)

$SourceDir = Join-Path $PSScriptRoot ".github"
$DestDir   = Join-Path $TargetPath ".github"

Write-Host ""
Write-Host "Playwright QA GitHub Copilot Plugin Installer" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Source : $SourceDir"
Write-Host "Target : $DestDir"
Write-Host ""

if (-not (Test-Path $SourceDir)) {
    Write-Error "Source .github/ folder not found at: $SourceDir"
    exit 1
}

# Create destination subdirectories
$subdirs = @("instructions", "prompts", "agents", "skills\playwright-qa")
foreach ($sub in $subdirs) {
    $path = Join-Path $DestDir $sub
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "  Created: .github\$sub" -ForegroundColor Green
    }
}

# Copy files
$files = @(
    @{ Src = "copilot-instructions.md";                                      Dst = "copilot-instructions.md" },
    @{ Src = "instructions\playwright-qa-framework.instructions.md";          Dst = "instructions\playwright-qa-framework.instructions.md" },
    @{ Src = "prompts\add-test.prompt.md";                                   Dst = "prompts\add-test.prompt.md" },
    @{ Src = "prompts\add-page-object.prompt.md";                            Dst = "prompts\add-page-object.prompt.md" },
    @{ Src = "agents\qa-test-writer.agent.md";                               Dst = "agents\qa-test-writer.agent.md" },
    @{ Src = "skills\playwright-qa\SKILL.md";                                Dst = "skills\playwright-qa\SKILL.md" }
)

$copied = 0
$skipped = 0

foreach ($f in $files) {
    $src = Join-Path $SourceDir $f.Src
    $dst = Join-Path $DestDir   $f.Dst

    if (-not (Test-Path $src)) {
        Write-Warning "  Missing source: $($f.Src)"
        continue
    }

    if (Test-Path $dst) {
        $choice = Read-Host "  Overwrite existing .github\$($f.Dst)? [y/N]"
        if ($choice -ne 'y' -and $choice -ne 'Y') {
            Write-Host "  Skipped: .github\$($f.Dst)" -ForegroundColor Yellow
            $skipped++
            continue
        }
    }

    Copy-Item -Path $src -Destination $dst -Force
    Write-Host "  Copied : .github\$($f.Dst)" -ForegroundColor Green
    $copied++
}

Write-Host ""
Write-Host "Done. $copied file(s) installed, $skipped skipped." -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Open your project in VS Code"
Write-Host "  2. In Copilot Chat, type / to see /add-test and /add-page-object"
Write-Host "  3. Switch to Agent mode and select 'qa-test-writer'"
Write-Host "  4. Type /playwright-qa for the full framework build guide"
Write-Host ""
