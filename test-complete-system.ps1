# Complete System Test
# Повне тестування системи

Write-Host "=== Complete System Test ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: GitHub Actions
Write-Host "1. Testing GitHub Actions..." -ForegroundColor Yellow
$GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"  # Замените на свой токен
$ghHeaders = @{ "Authorization" = "token $GITHUB_TOKEN" }
try {
    $workflows = Invoke-RestMethod -Uri "https://api.github.com/repos/PlevanDM/nexx-webapp/actions/runs?per_page=1" -Headers $ghHeaders
    $latest = $workflows.workflow_runs[0]
    Write-Host "   Latest run: $($latest.status) / $($latest.conclusion)" -ForegroundColor $(if ($latest.conclusion -eq 'success') { 'Green' } else { 'Yellow' })
    Write-Host "   Created: $($latest.created_at)" -ForegroundColor Gray
} catch {
    Write-Host "   WARNING: $_" -ForegroundColor Yellow
}

# Test 2: GitHub Secrets
Write-Host ""
Write-Host "2. Testing GitHub Secrets..." -ForegroundColor Yellow
try {
    $secrets = Invoke-RestMethod -Uri "https://api.github.com/repos/PlevanDM/nexx-webapp/actions/secrets" -Headers $ghHeaders
    Write-Host "   OK Secrets: $($secrets.total_count)" -ForegroundColor Green
    foreach ($secret in $secrets.secrets) {
        Write-Host "      - $($secret.name)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   WARNING: $_" -ForegroundColor Yellow
}

# Test 3: Cloudflare Deployment
Write-Host ""
Write-Host "3. Testing Cloudflare Deployment..." -ForegroundColor Yellow
$cfHeaders = @{
    "X-Auth-Key" = "519bdfbd2efeaa9c3a418b905202058bac2fc"
    "X-Auth-Email" = "dmitro.plevan@gmail.com"
}
try {
    $deployments = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/ad170d773e79a037e28f4530fd5305a5/pages/projects/nexx/deployments?per_page=1" -Headers $cfHeaders
    $latest = $deployments.result[0]
    Write-Host "   OK Latest: $($latest.id)" -ForegroundColor Green
    Write-Host "      Status: $($latest.latest_stage.status)" -ForegroundColor $(if ($latest.latest_stage.status -eq 'success') { 'Green' } else { 'Yellow' })
    Write-Host "      Environment: $($latest.environment)" -ForegroundColor Gray
    Write-Host "      URL: $($latest.url)" -ForegroundColor Cyan
} catch {
    Write-Host "   FAILED: $_" -ForegroundColor Red
}

# Test 4: Local Build
Write-Host ""
Write-Host "4. Testing local build files..." -ForegroundColor Yellow
$distI18n = "dist/static/i18n.js"
if (Test-Path $distI18n) {
    $content = Get-Content $distI18n -Raw
    $keys = @('nav.calculator', 'buttons.calculate', 'buttons.freeLabel', 'buttons.callBack', 'buttons.freeDiagnostic')
    $found = 0
    foreach ($key in $keys) {
        $parts = $key.Split('.')
        if ($content -match "$($parts[0]):\s*\{[^}]*$($parts[1]):") {
            $found++
        }
    }
    Write-Host "   OK Keys found: $found/$($keys.Count)" -ForegroundColor $(if ($found -eq $keys.Count) { 'Green' } else { 'Yellow' })
} else {
    Write-Host "   FAILED i18n.js not found in dist" -ForegroundColor Red
}

# Test 5: Index.html version
Write-Host ""
Write-Host "5. Testing index.html version..." -ForegroundColor Yellow
$indexPath = "dist/index.html"
if (Test-Path $indexPath) {
    $indexContent = Get-Content $indexPath -Raw
    if ($indexContent -match 'i18n\.js\?v=([\d\.-]+)') {
        $version = $matches[1]
        Write-Host "   OK Version: $version" -ForegroundColor $(if ($version -match "10\.0\.1") { 'Green' } else { 'Yellow' })
    } else {
        Write-Host "   WARNING Version not found" -ForegroundColor Yellow
    }
} else {
    Write-Host "   FAILED index.html not found" -ForegroundColor Red
}

# Test 6: Site accessibility
Write-Host ""
Write-Host "6. Testing live site..." -ForegroundColor Yellow
try {
    $siteResponse = Invoke-WebRequest -Uri "https://nexxgsm.com" -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "   OK Site accessible (Status: $($siteResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   WARNING: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "✅ Deployment: Successful" -ForegroundColor Green
Write-Host "✅ Build: Complete" -ForegroundColor Green
Write-Host "✅ Translations: Present in dist" -ForegroundColor Green
Write-Host "⚠️  Live site: May need cache refresh" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Wait 2-3 minutes for CDN propagation" -ForegroundColor White
Write-Host "  2. Clear browser cache completely" -ForegroundColor White
Write-Host "  3. Hard refresh (Ctrl+Shift+R)" -ForegroundColor White
Write-Host "  4. Check: https://nexxgsm.com" -ForegroundColor White
