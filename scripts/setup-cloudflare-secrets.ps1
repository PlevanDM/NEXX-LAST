# Set Cloudflare Pages secrets (RemOnline, etc.) from .dev.vars
# Requires: wrangler login
# Usage: .\scripts\setup-cloudflare-secrets.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
if ((Get-Location).Path -ne $root) { Set-Location $root }

$devVars = Join-Path $root '.dev.vars'
if (-not (Test-Path $devVars)) {
    Write-Host "No .dev.vars found. Run: npm run configure:remonline" -ForegroundColor Red
    exit 1
}

Write-Host "Uploading secrets to Cloudflare Pages (nexx-gsm) from .dev.vars..." -ForegroundColor Cyan
npx wrangler pages secret bulk .dev.vars --project-name=nexx-gsm
if ($LASTEXITCODE -eq 0) {
    Write-Host "Done. Deploy to apply: npm run deploy" -ForegroundColor Green
} else {
    Write-Host "Run: wrangler login" -ForegroundColor Yellow
}
