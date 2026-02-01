# Set GitHub Actions secrets from local .env (for Deploy to Cloudflare Pages)
# Requires: gh CLI (gh auth login)
# Usage: .\scripts\set-github-cloudflare-secrets.ps1
# Repo: PlevanDM/1 (override with env GITHUB_REPO=Owner/Repo)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
if ((Get-Location).Path -ne $root) { Set-Location $root }
$envPath = Join-Path $root '.env'

if (-not (Test-Path $envPath)) {
    Write-Host "No .env found. Copy .env.example to .env and fill CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN." -ForegroundColor Yellow
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
    Write-Host "Create API Token: https://dash.cloudflare.com/profile/api-tokens (template: Edit Cloudflare Workers)" -ForegroundColor Yellow
    exit 1
}

$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) {
    Write-Host "gh CLI not found. Install: https://cli.github.com/ then run: gh auth login" -ForegroundColor Yellow
    Write-Host "Or add secrets manually: https://github.com/PlevanDM/1/settings/secrets/actions" -ForegroundColor Cyan
    exit 1
}

$repo = $env:GITHUB_REPO
if (-not $repo) {
    try {
        $remote = (git remote get-url origin 2>$null) -replace '\.git$','' -replace '^https://github\.com/','' -replace '^git@github\.com:',''
        if ($remote) { $repo = $remote }
    } catch {}
}
if (-not $repo) { $repo = 'PlevanDM/1' }

Write-Host "Setting GitHub Actions secrets from .env (repo: $repo)..." -ForegroundColor Cyan
$accountId | gh secret set CLOUDFLARE_ACCOUNT_ID --repo $repo
$apiToken | gh secret set CLOUDFLARE_API_TOKEN --repo $repo
Write-Host "Done. Next: GitHub Actions -> Deploy to Cloudflare Pages -> Re-run all jobs" -ForegroundColor Green
