# Check Cloudflare Pages Deployment Status

$GlobalApiKey = "853487a6a39bd7f6f8128b4caf420ac22de33"
$Email = "dmitro.plevan@gmail.com"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Checking Cloudflare Pages Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Get Account ID
$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
}

try {
    $response = Invoke-RestMethod -Uri "$API_BASE/accounts" -Method Get -Headers $headers
    $accountId = $response.result[0].id
    Write-Host "Account ID: $accountId" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}

# Get Project
Write-Host ""
Write-Host "Checking project '$ProjectName'..." -ForegroundColor Yellow
try {
    $projects = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects" -Method Get -Headers $headers
    $project = $projects.result | Where-Object { $_.name -eq $ProjectName }
    
    if (-not $project) {
        Write-Host "  Project not found!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  Project found!" -ForegroundColor Green
    Write-Host "  Production URL: $($project.production_branch)" -ForegroundColor Gray
} catch {
    Write-Host "  ERROR: $_" -ForegroundColor Red
    exit 1
}

# Get Latest Deployments
Write-Host ""
Write-Host "Latest deployments:" -ForegroundColor Yellow
try {
    $deployments = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects/$ProjectName/deployments" -Method Get -Headers $headers
    
    if ($deployments.result -and $deployments.result.Count -gt 0) {
        $latest = $deployments.result[0]
        Write-Host ""
        Write-Host "  Latest Deployment:" -ForegroundColor Cyan
        Write-Host "    ID: $($latest.id)" -ForegroundColor Gray
        Write-Host "    Status: $($latest.latest_stage.status)" -ForegroundColor $(if ($latest.latest_stage.status -eq "success") { "Green" } else { "Yellow" })
        Write-Host "    URL: $($latest.url)" -ForegroundColor Cyan
        Write-Host "    Created: $($latest.created_on)" -ForegroundColor Gray
        
        if ($latest.latest_stage.status -ne "success") {
            Write-Host "    Stage: $($latest.latest_stage.name)" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "  Recent deployments (last 5):" -ForegroundColor Cyan
        $deployments.result | Select-Object -First 5 | ForEach-Object {
            $statusColor = if ($_.latest_stage.status -eq "success") { "Green" } else { "Yellow" }
            Write-Host "    - $($_.created_on) | $($_.latest_stage.status) | $($_.url)" -ForegroundColor $statusColor
        }
    } else {
        Write-Host "  No deployments found!" -ForegroundColor Red
    }
} catch {
    Write-Host "  ERROR: $_" -ForegroundColor Red
    Write-Host "  Response: $($_.Exception.Response)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Production URL: https://nexxgsm.com/" -ForegroundColor Cyan
Write-Host ""
Write-Host "If updates not visible:" -ForegroundColor Yellow
Write-Host "  1. Clear browser cache (Ctrl+Shift+Delete)" -ForegroundColor White
Write-Host "  2. Try hard refresh (Ctrl+F5)" -ForegroundColor White
Write-Host "  3. Check if deployment is still in progress" -ForegroundColor White
Write-Host "  4. Wait a few minutes for CDN propagation" -ForegroundColor White
