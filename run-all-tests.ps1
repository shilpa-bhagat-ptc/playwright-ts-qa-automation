$ErrorActionPreference = "Continue"
$categories = @(
  "homePageTests",
  "adminPageTests",
  "planningPageTests",
  "queryPageTests",
  "reportPageTests",
  "executionPageTests",
  "userPageTests"
)

$summary = @()
foreach ($cat in $categories) {
  $env:TEST_PROJECT = $cat
  $logFile = "test-output-$cat.log"
  Write-Host ""
  Write-Host "=================================================================="
  Write-Host "RUNNING: $cat"
  Write-Host "=================================================================="
  $startTime = Get-Date

  npx playwright test 2>&1 | Tee-Object -FilePath $logFile | Out-Null

  $duration = (Get-Date) - $startTime
  $content = Get-Content $logFile -Raw
  $passedMatch = [regex]::Match($content, '(\d+)\s+passed')
  $failedMatch = [regex]::Match($content, '(\d+)\s+failed')
  $passed = if ($passedMatch.Success) { [int]$passedMatch.Groups[1].Value } else { 0 }
  $failed = if ($failedMatch.Success) { [int]$failedMatch.Groups[1].Value } else { 0 }

  Write-Host ">>> RESULT: $cat = $passed passed, $failed failed (duration: $($duration.ToString('mm\:ss')))"

  $summary += [pscustomobject]@{
    Category = $cat
    Passed   = $passed
    Failed   = $failed
    Duration = $duration.ToString('mm\:ss')
  }
}

Write-Host ""
Write-Host "=================================================================="
Write-Host "FINAL SUMMARY"
Write-Host "=================================================================="
$summary | Format-Table -AutoSize | Out-String | Write-Host
$totalPassed = ($summary | Measure-Object -Property Passed -Sum).Sum
$totalFailed = ($summary | Measure-Object -Property Failed -Sum).Sum
Write-Host "TOTAL: $totalPassed passed, $totalFailed failed across all categories"
