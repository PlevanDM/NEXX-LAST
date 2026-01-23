# Setup GitHub Secrets for Cloudflare Pages Deployment
# Настройка GitHub Secrets для автоматического деплоя

param(
    [string]$GitHubToken = "",
    [string]$CloudflareApiToken = "",
    [string]$CloudflareAccountId = "ad170d773e79a037e28f4530fd5305a5"
)

$RepoOwner = "PlevanDM"
$RepoName = "nexx-webapp"

Write-Host "=== GitHub Secrets Setup for Cloudflare Pages ===" -ForegroundColor Cyan
Write-Host ""

if (-not $GitHubToken) {
    Write-Host "❌ GitHub Token is required!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 How to get GitHub Token:" -ForegroundColor Yellow
    Write-Host "   1. Go to: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "   2. Click 'Generate new token' → 'Generate new token (classic)'" -ForegroundColor White
    Write-Host "   3. Select scopes: 'repo' (full control)" -ForegroundColor White
    Write-Host "   4. Copy the token" -ForegroundColor White
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "   .\setup-github-secrets-cloudflare.ps1 -GitHubToken 'ghp_...' -CloudflareApiToken '...'" -ForegroundColor White
    exit 1
}

if (-not $CloudflareApiToken) {
    Write-Host "⚠️  Cloudflare API Token not provided. Using Global API Key as fallback." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 How to get Cloudflare API Token:" -ForegroundColor Yellow
    Write-Host "   1. Go to: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor White
    Write-Host "   2. Click 'Create Token'" -ForegroundColor White
    Write-Host "   3. Use template 'Edit Cloudflare Workers' or create custom:" -ForegroundColor White
    Write-Host "      - Permissions: Account → Cloudflare Pages → Edit" -ForegroundColor White
    Write-Host "   4. Copy the token" -ForegroundColor White
    Write-Host ""
    $CloudflareApiToken = "519bdfbd2efeaa9c3a418b905202058bac2fc" # Global API Key fallback
    Write-Host "Using Global API Key as fallback (less secure)" -ForegroundColor Yellow
}

$headers = @{
    "Authorization" = "token $GitHubToken"
    "Accept" = "application/vnd.github.v3+json"
}

$baseUrl = "https://api.github.com/repos/$RepoOwner/$RepoName"

# Secrets to set
$secrets = @{
    "CLOUDFLARE_API_TOKEN" = $CloudflareApiToken
    "CLOUDFLARE_ACCOUNT_ID" = $CloudflareAccountId
}

Write-Host "[1/3] Checking repository access..." -ForegroundColor Yellow
try {
    $repo = Invoke-RestMethod -Uri $baseUrl -Method Get -Headers $headers
    Write-Host "   ✅ Repository found: $($repo.full_name)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error accessing repository: $_" -ForegroundColor Red
    Write-Host "   Details: $($_.Exception.Message)" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "[2/3] Setting GitHub Secrets..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Note: GitHub Secrets API requires GitHub App or fine-grained tokens." -ForegroundColor Yellow
Write-Host "   Classic tokens cannot set secrets via API." -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Manual Setup Required:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1. Go to: https://github.com/$RepoOwner/$RepoName/settings/secrets/actions" -ForegroundColor White
Write-Host "   2. Click 'New repository secret'" -ForegroundColor White
Write-Host "   3. Add each secret:" -ForegroundColor White
Write-Host ""

foreach ($key in $secrets.Keys) {
    $value = $secrets[$key]
    $displayValue = if ($value.Length -gt 20) { $value.Substring(0, 20) + "..." } else { $value }
    Write-Host "      Name:  $key" -ForegroundColor Green
    Write-Host "      Value: $displayValue" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "[3/3] Verification..." -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ After setting secrets manually:" -ForegroundColor Green
Write-Host "   1. Go to: https://github.com/$RepoOwner/$RepoName/actions" -ForegroundColor White
Write-Host "   2. Run workflow: 'Deploy to Cloudflare Pages' → 'Run workflow'" -ForegroundColor White
Write-Host "   3. Check logs for any errors" -ForegroundColor White
Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Green
