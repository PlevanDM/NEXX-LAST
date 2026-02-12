# Push full project to https://github.com/PlevanDM/last26
# Run from project root: .\scripts\push-to-last26.ps1
# Requires: Git in PATH

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

$last26 = "https://github.com/PlevanDM/last26.git"

# Check git
$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
    Write-Host "Git not found in PATH. Run commands from DEPLOY-TO-LAST26.md manually in Git Bash or install Git." -ForegroundColor Red
    exit 1
}

# Add remote if not exists
$remotes = git remote
if ($remotes -notcontains "last26") {
    Write-Host "Adding remote last26..." -ForegroundColor Cyan
    git remote add last26 $last26
} else {
    Write-Host "Remote last26 already exists." -ForegroundColor Gray
    git remote set-url last26 $last26
}

Write-Host "Pushing main to last26..." -ForegroundColor Cyan
git push -u last26 main
Write-Host "Done. Project is at https://github.com/PlevanDM/last26" -ForegroundColor Green
