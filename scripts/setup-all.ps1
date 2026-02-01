# Full setup: RemOnline + Site + Cloudflare
# Usage: .\scripts\setup-all.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
if ((Get-Location).Path -ne $root) { Set-Location $root }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   NEXX Full Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load .env
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2].Trim().Trim('"'), "Process")
        }
    }
}

# 1. RemOnline
Write-Host "[1/4] RemOnline API config..." -ForegroundColor Yellow
$roKey = $env:REMONLINE_API_KEY
if (-not $roKey -and (Test-Path .env)) {
    $line = Get-Content .env -ErrorAction SilentlyContinue | Where-Object { $_ -match '^REMONLINE_API_KEY=' } | Select-Object -First 1
    if ($line) { $roKey = ($line -replace '^REMONLINE_API_KEY=', '').Trim().Trim('"') }
}
if ($roKey) { node scripts/configure-remonline-api.cjs --api-key=$roKey } else { Write-Host "  Skip (no REMONLINE_API_KEY in .env)" -ForegroundColor Gray }
Write-Host ""

# 2. Test APIs
Write-Host "[2/4] Testing APIs..." -ForegroundColor Yellow
npm run test:apis
Write-Host ""

# 3. Build
Write-Host "[3/4] Build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 4. Cloudflare secrets (optional)
Write-Host "[4/4] Cloudflare Pages secrets (requires wrangler login)..." -ForegroundColor Yellow
$doSecrets = Read-Host "Upload secrets to Cloudflare Pages? (y/n)"
if ($doSecrets -eq 'y') {
    & "$PSScriptRoot\setup-cloudflare-secrets.ps1"
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "  Local: npm run preview" -ForegroundColor Gray
Write-Host "  Deploy: npm run deploy" -ForegroundColor Gray
Write-Host ""
