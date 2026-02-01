# ================================
# Deploy to Git - Clean Export
# Экспортирует проект в чистую папку (только tracked файлы, без мусора)
# и пушит в git
# ================================

param(
    [Parameter(Mandatory=$false)]
    [string]$TargetDir = "",
    [string]$RemoteUrl = "",
    [string]$Branch = "main",
    [string]$CommitMsg = "chore: deploy clean build",
    [switch]$ExportOnly,
    [switch]$Push
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot | Split-Path -Parent

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   NEXX Git Clean Deploy               " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$OutputDir = if ($TargetDir) { $TargetDir } else { Join-Path $ProjectRoot "deploy-git-output" }

# 1. Export current state (including uncommitted) via robocopy - no junk
Write-Host "[1/4] Exporting clean project (current state, no node_modules/dist)..." -ForegroundColor Yellow
Push-Location $ProjectRoot

if (Test-Path $OutputDir) { Remove-Item $OutputDir -Recurse -Force }
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

& robocopy $ProjectRoot $OutputDir /E /XD node_modules dist build .wrangler .cache .git deploy-git-output agent-transcripts agent-tools mcps /XF .env .dev.vars *.log /NFL /NDL /NJH /NJS /NC /NS /NP 2>$null
if ($LASTEXITCODE -ge 8) { Write-Host "  Robocopy error (code $LASTEXITCODE)" -ForegroundColor Red; Pop-Location; exit 1 }
Pop-Location
$fileCount = (Get-ChildItem -Path $OutputDir -Recurse -File -ErrorAction SilentlyContinue).Count
Write-Host "  Copied $fileCount files" -ForegroundColor Green

Write-Host ""

if ($ExportOnly) {
    Write-Host "Export only - done. Output: $OutputDir" -ForegroundColor Green
    exit 0
}

# 2. Git init / add remote
Push-Location $OutputDir
try {
    if (!(Test-Path ".git")) {
        Write-Host "[2/4] Initializing git repository" -ForegroundColor Yellow
        git init -b $Branch 2>$null
        if ($RemoteUrl) {
            git remote add origin $RemoteUrl 2>$null
            Write-Host "  Remote: $RemoteUrl" -ForegroundColor Green
        }
        Write-Host "  Init done" -ForegroundColor Green
    } else {
        Write-Host "[2/4] Using existing git repository" -ForegroundColor Yellow
    }
    Write-Host ""

    # 3. Add, commit (use parent repo config if local not set)
    Write-Host "[3/4] Adding files and committing" -ForegroundColor Yellow
    $gitUser = git -C $ProjectRoot config user.email 2>$null
    $gitName = git -C $ProjectRoot config user.name 2>$null
    if ($gitUser) { git config user.email $gitUser 2>$null }
    if ($gitName) { git config user.name $gitName 2>$null }
    if (-not $gitUser) { git config user.email "deploy@nexx.local" 2>$null }
    if (-not $gitName) { git config user.name "NEXX Deploy" 2>$null }
    git add -A
    $status = git status --short 2>$null
    if ($status) {
        git commit -m $CommitMsg 2>&1
        if ($LASTEXITCODE -eq 0) { Write-Host "  Committed." -ForegroundColor Green } else { Write-Host "  Commit failed (check git config)" -ForegroundColor Red; Pop-Location; exit 1 }
    } else {
        $rev = git rev-parse HEAD 2>$null
        if (-not $rev) {
            git commit -m $CommitMsg --allow-empty
            Write-Host "  Initial commit." -ForegroundColor Green
        } else {
            Write-Host "  No changes to commit." -ForegroundColor Gray
        }
    }
    Write-Host ""

    # 4. Push
    Write-Host "[4/4] Push to remote" -ForegroundColor Yellow
    $remote = git remote 2>$null
    if ($remote) {
        git push -u origin $Branch 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Pushed to origin/$Branch" -ForegroundColor Green
        } else {
            Write-Host "  Push failed (may need: git push -u origin $Branch --force)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  No remote. Add: git remote add origin <url>" -ForegroundColor Yellow
    }
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "Done. Clean project: $OutputDir" -ForegroundColor Green
Write-Host ""
