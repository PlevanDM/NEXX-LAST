# Check Production Branch and Latest Deployment

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
}

$response = Invoke-RestMethod -Uri "$API_BASE/accounts" -Method Get -Headers $headers
$accountId = $response.result[0].id

Write-Host "=== Production Configuration Check ===" -ForegroundColor Cyan
Write-Host ""

# Get Project Details
$projectHeaders = $headers.Clone()
$projectHeaders["Content-Type"] = "application/json"

$project = (Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects/$ProjectName" -Method Get -Headers $headers).result

Write-Host "Project: $($project.name)" -ForegroundColor Green
Write-Host "Production Branch: $($project.production_branch)" -ForegroundColor $(if ($project.production_branch -eq "main") { "Green" } else { "Yellow" })
Write-Host ""

# Get ALL deployments (more recent)
Write-Host "Recent Deployments (last 10):" -ForegroundColor Yellow
$deployments = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects/$ProjectName/deployments?per_page=10" -Method Get -Headers $headers

if ($deployments.result) {
    $deployments.result | ForEach-Object {
        $time = [DateTime]::Parse($_.created_on).ToString("yyyy-MM-dd HH:mm:ss")
        $status = $_.latest_stage.status
        $statusColor = if ($status -eq "success") { "Green" } elseif ($status -eq "active") { "Cyan" } else { "Yellow" }
        Write-Host "  $time | $status | $($_.id)" -ForegroundColor $statusColor
        if ($_.url) {
            Write-Host "    URL: $($_.url)" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "  No deployments found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Production URL: https://nexxgsm.com/" -ForegroundColor Cyan
Write-Host ""
Write-Host "If production branch is not 'main', update it:" -ForegroundColor Yellow
Write-Host "  Cloudflare Dashboard → Pages → nexx → Settings → Production branch" -ForegroundColor White
