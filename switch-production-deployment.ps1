# Switch Production Deployment to Latest
# Перемикає production на останній deployment

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Switch Production Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Get Account ID
$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "$API_BASE/accounts" -Method Get -Headers $headers
    $accountId = $response.result[0].id
    Write-Host "Account ID: $accountId" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}

# Get Latest Deployment
Write-Host ""
Write-Host "Getting latest deployment..." -ForegroundColor Yellow
try {
    $deployments = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects/$ProjectName/deployments?per_page=1" -Method Get -Headers $headers
    
    if (-not $deployments.result -or $deployments.result.Count -eq 0) {
        Write-Host "  No deployments found!" -ForegroundColor Red
        exit 1
    }
    
    $latest = $deployments.result[0]
    Write-Host "  Latest Deployment ID: $($latest.id)" -ForegroundColor Green
    Write-Host "  Status: $($latest.latest_stage.status)" -ForegroundColor $(if ($latest.latest_stage.status -eq "success") { "Green" } else { "Yellow" })
    Write-Host "  URL: $($latest.url)" -ForegroundColor Cyan
    Write-Host "  Created: $($latest.created_on)" -ForegroundColor Gray
    
    if ($latest.latest_stage.status -ne "success") {
        Write-Host ""
        Write-Host "  ⚠️  Deployment not ready yet!" -ForegroundColor Yellow
        Write-Host "  Wait for deployment to complete first." -ForegroundColor White
        exit 1
    }
    
} catch {
    Write-Host "  ERROR: $_" -ForegroundColor Red
    exit 1
}

# Note: Cloudflare Pages API doesn't have direct endpoint to switch production deployment
# Production is automatically set based on production_branch setting
# For manual deployments, they should automatically become production if branch matches

Write-Host ""
Write-Host "ℹ️  Note: Cloudflare Pages automatically sets production based on:" -ForegroundColor Cyan
Write-Host "   - Production branch setting (currently: main)" -ForegroundColor White
Write-Host "   - Latest successful deployment" -ForegroundColor White
Write-Host ""
Write-Host "💡 If deployment is not production:" -ForegroundColor Yellow
Write-Host "   1. Check Cloudflare Dashboard:" -ForegroundColor White
Write-Host "      https://dash.cloudflare.com/" -ForegroundColor Gray
Write-Host "   2. Go to Pages → nexx → Deployments" -ForegroundColor White
Write-Host "   3. Click 'Promote to production' on latest deployment" -ForegroundColor White
Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
