# Connect Cloudflare Pages Project to GitHub Repository
# Подключает проект nexx к GitHub репозиторию

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

# GitHub repository info
$GitHubOwner = "PlevanDM"
$GitHubRepo = "nexx-webapp"
$ProductionBranch = "main"

Write-Host "=== Connect Cloudflare Pages to GitHub ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

# Step 1: Get current project
Write-Host "Getting current project configuration..." -ForegroundColor Yellow
try {
    $projectResponse = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName" -Method Get -Headers $headers
    
    if ($projectResponse.success) {
        $project = $projectResponse.result
        Write-Host "Current project: $($project.name)" -ForegroundColor Green
        
        if ($project.source) {
            Write-Host "Project already has source configured:" -ForegroundColor Yellow
            Write-Host ($project.source | ConvertTo-Json -Depth 5) -ForegroundColor Gray
            Write-Host ""
            Write-Host "To update source, you need to use Cloudflare Dashboard:" -ForegroundColor Cyan
            Write-Host "1. Go to: https://dash.cloudflare.com/" -ForegroundColor White
            Write-Host "2. Pages → $ProjectName → Settings → Source" -ForegroundColor White
            Write-Host "3. Connect to GitHub → Select repository: $GitHubOwner/$GitHubRepo" -ForegroundColor White
            Write-Host "4. Select branch: $ProductionBranch" -ForegroundColor White
            Write-Host "5. Set build command: npm run build" -ForegroundColor White
            Write-Host "6. Set output directory: dist" -ForegroundColor White
            exit 0
        }
    }
} catch {
    Write-Host "Error getting project: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Check if we can update via API
Write-Host ""
Write-Host "Note: Cloudflare Pages API doesn't support connecting GitHub via API directly." -ForegroundColor Yellow
Write-Host "You need to connect via Dashboard:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Steps to connect:" -ForegroundColor Cyan
Write-Host "1. Go to: https://dash.cloudflare.com/" -ForegroundColor White
Write-Host "2. Select your account" -ForegroundColor White
Write-Host "3. Go to: Workers & Pages → Pages → $ProjectName" -ForegroundColor White
Write-Host "4. Click: Settings → Source" -ForegroundColor White
Write-Host "5. Click: 'Connect to Git'" -ForegroundColor White
Write-Host "6. Authorize GitHub if needed" -ForegroundColor White
Write-Host "7. Select repository: $GitHubOwner/$GitHubRepo" -ForegroundColor White
Write-Host "8. Select branch: $ProductionBranch" -ForegroundColor White
Write-Host "9. Configure build:" -ForegroundColor White
Write-Host "   - Build command: npm run build" -ForegroundColor Gray
Write-Host "   - Build output directory: dist" -ForegroundColor Gray
Write-Host "   - Root directory: / (leave empty)" -ForegroundColor Gray
Write-Host "10. Click: 'Save and Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "After connecting, deployments will be automatic on every push to $ProductionBranch" -ForegroundColor Green
