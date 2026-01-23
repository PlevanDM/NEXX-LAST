# Aggressive Cloudflare Cache Purge
# Агрессивная очистка кеша Cloudflare

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$ZoneName = "nexxgsm.com"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Aggressive Cloudflare Cache Purge ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

# Get Zone ID
Write-Host "[1/4] Getting Zone ID..." -ForegroundColor Yellow
try {
    $zones = Invoke-RestMethod -Uri "$API_BASE/zones?name=$ZoneName" -Method Get -Headers $headers
    if (-not $zones.success -or $zones.result.Count -eq 0) {
        Write-Host "   ❌ Zone not found!" -ForegroundColor Red
        exit 1
    }
    $zoneId = $zones.result[0].id
    Write-Host "   ✅ Zone ID: $zoneId" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
    exit 1
}

# Purge Everything
Write-Host ""
Write-Host "[2/4] Purging ALL cache..." -ForegroundColor Yellow
try {
    $body = @{ purge_everything = $true } | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/purge_cache" -Method Post -Headers $headers -Body $body
    if ($result.success) {
        Write-Host "   ✅ All cache purged!" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}

# Purge by URL (specific files)
Write-Host ""
Write-Host "[3/4] Purging specific files..." -ForegroundColor Yellow
try {
    $files = @(
        "https://nexxgsm.com/",
        "https://nexxgsm.com/index.html",
        "https://nexxgsm.com/static/i18n.js",
        "https://nexxgsm.com/static/i18n.min.js",
        "https://nexxgsm.com/static/price-calculator.js",
        "https://nexxgsm.com/static/price-calculator.min.js",
        "https://nexxgsm.com/static/database.js",
        "https://nexxgsm.com/static/database.min.js",
        "https://nexxgsm.com/data/master-db.json"
    )
    $body = @{ files = $files } | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/purge_cache" -Method Post -Headers $headers -Body $body
    if ($result.success) {
        Write-Host "   ✅ Specific files purged!" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Specific purge failed: $_" -ForegroundColor Yellow
}

# Check Cloudflare Pages deployment
Write-Host ""
Write-Host "[4/4] Checking latest deployment..." -ForegroundColor Yellow
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$ProjectName = "nexx"
try {
    $deployments = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName/deployments?per_page=1" -Method Get -Headers $headers
    if ($deployments.success -and $deployments.result.Count -gt 0) {
        $latest = $deployments.result[0]
        Write-Host "   ✅ Latest Deployment:" -ForegroundColor Green
        Write-Host "      ID: $($latest.id)" -ForegroundColor Gray
        Write-Host "      Status: $($latest.latest_stage.status)" -ForegroundColor Gray
        Write-Host "      Created: $($latest.created_on)" -ForegroundColor Gray
        Write-Host "      URL: $($latest.url)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ⚠️  Deployment check failed: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Cache purged aggressively!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 For other devices:" -ForegroundColor Yellow
Write-Host "   1. Wait 2-3 minutes for CDN propagation" -ForegroundColor White
Write-Host "   2. Clear browser cache completely (Ctrl+Shift+Delete)" -ForegroundColor White
Write-Host "   3. Hard refresh (Ctrl+F5 or Cmd+Shift+R)" -ForegroundColor White
Write-Host "   4. Try incognito/private mode" -ForegroundColor White
Write-Host "   5. Check: https://nexxgsm.com/?v=$(Get-Date -Format 'yyyyMMddHHmmss')" -ForegroundColor White
