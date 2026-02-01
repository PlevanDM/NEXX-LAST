# Import Exchange Price List (Ukraine) — copy from Desktop and run import
# Копирует .xlsx с рабочего стола в data/exchange-ua и запускает импорт в apple-exchange-ua.json
# Usage: .\scripts\import-exchange-ua-from-desktop.ps1
#    or: npm run import:exchange-ua:desktop

$ErrorActionPreference = "Stop"
# $PSScriptRoot = ...\NEXX LAST\scripts  =>  ProjectRoot = ...\NEXX LAST
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$TargetDir = Join-Path (Join-Path $ProjectRoot "data") "exchange-ua"
$Desktop = [Environment]::GetFolderPath("Desktop")

Write-Host ""
Write-Host "=== Import Exchange UA from Desktop ===" -ForegroundColor Cyan
Write-Host "Desktop: $Desktop" -ForegroundColor Gray
Write-Host "Target:  $TargetDir" -ForegroundColor Gray
Write-Host ""

# Паттерны имён файлов прайса
$patterns = @(
    "*Exchange*Price*.xlsx",
    "*Exchange_Price*.xlsx",
    "*exchange*price*.xlsx",
    "29*.xlsx"
)

$copied = $null
foreach ($pat in $patterns) {
    $files = Get-ChildItem -Path $Desktop -Filter $pat -File -ErrorAction SilentlyContinue
    if ($files) {
        # Берём самый новый по дате изменения
        $latest = $files | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($latest) {
            $dest = Join-Path $TargetDir $latest.Name
            if (-not (Test-Path $TargetDir)) {
                New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
            }
            Copy-Item -LiteralPath $latest.FullName -Destination $dest -Force
            Write-Host "Copied: $($latest.Name) -> data/exchange-ua/" -ForegroundColor Green
            $copied = $dest
            break
        }
    }
}

if (-not $copied) {
    Write-Host "No Exchange Price .xlsx found on Desktop (patterns: *Exchange*Price*.xlsx, 29*.xlsx)." -ForegroundColor Yellow
    Write-Host "Put your .xlsx in: $TargetDir" -ForegroundColor Yellow
    Write-Host "Then run: npm run import:exchange-ua" -ForegroundColor White
    Write-Host ""
    # Всё равно запускаем импорт — возьмёт то, что есть в data/exchange-ua
}

Set-Location $ProjectRoot
Write-Host "Running import..." -ForegroundColor Cyan
if ($copied) {
    node scripts/import-exchange-ua-xlsx.cjs $copied
} else {
    node scripts/import-exchange-ua-xlsx.cjs
}
if ($LASTEXITCODE -ne 0) {
    Write-Host "Import failed (exit $LASTEXITCODE)." -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host ""
Write-Host "Done. Open site -> Прайс Украина to see prices." -ForegroundColor Green
Write-Host ""
