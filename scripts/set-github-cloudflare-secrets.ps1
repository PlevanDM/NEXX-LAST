# Set GitHub Actions secrets from local .env
# Requires: gh CLI (gh auth login)
# Usage: .\scripts\set-github-cloudflare-secrets.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
if ((Get-Location).Path -ne $root) { Set-Location $root }
$envPath = Join-Path $root '.env'

if (-not (Test-Path $envPath)) {
    Write-Host "No .env found. Copy .env.example to .env and fill values." -ForegroundColor Yellow
    exit 1
}

$vars = @{}
Get-Content $envPath -Raw | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
        $vars[$matches[1]] = $matches[2].Trim().Trim('"').Trim("'")
    }
}

$accountId = $vars['CLOUDFLARE_ACCOUNT_ID']
$apiToken = $vars['CLOUDFLARE_API_TOKEN'] ?? $vars['CLOUDFLARE_API_KEY']

if (-not $accountId) {
    Write-Host "CLOUDFLARE_ACCOUNT_ID not found in .env" -ForegroundColor Red
    exit 1
}
if (-not $apiToken) {
    Write-Host "CLOUDFLARE_API_TOKEN or CLOUDFLARE_API_KEY not found in .env" -ForegroundColor Red
    Write-Host "Note: wrangler-action needs API Token (not Global Key): https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Yellow
    exit 1
}

$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) {
    Write-Host "gh CLI not found: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host "Or add secrets manually at GitHub repo Settings -> Secrets -> Actions" -ForegroundColor Cyan
    exit 1
}

Write-Host "Setting GitHub Actions secrets from .env..." -ForegroundColor Cyan
$accountId | gh secret set CLOUDFLARE_ACCOUNT_ID
$apiToken | gh secret set CLOUDFLARE_API_TOKEN
Write-Host "Done. Deploy: Actions -> Deploy to Cloudflare Pages -> Re-run" -ForegroundColor Green
