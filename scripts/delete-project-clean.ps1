# Delete Cloudflare Pages project for clean installation

Write-Host "Deleting Cloudflare Pages project for clean installation..." -ForegroundColor Yellow
Write-Host ""

# Check authentication
Write-Host "Checking authentication..." -ForegroundColor Cyan
$whoami = wrangler whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ERROR: Not authenticated! Run: wrangler login" -ForegroundColor Red
    exit 1
}
Write-Host "   OK: Authenticated" -ForegroundColor Green
Write-Host ""

# Get Account ID
Write-Host "Getting Account ID..." -ForegroundColor Cyan
try {
    $whoamiJson = wrangler whoami --json 2>&1
    $accountInfo = $whoamiJson | ConvertFrom-Json
    if ($accountInfo -and $accountInfo.accountId) {
        $accountId = $accountInfo.accountId
        Write-Host "   OK: Account ID: $accountId" -ForegroundColor Green
    } else {
        Write-Host "   WARNING: Could not get Account ID automatically" -ForegroundColor Yellow
        $accountId = Read-Host "   Enter Account ID manually"
    }
} catch {
    Write-Host "   WARNING: Could not get Account ID automatically" -ForegroundColor Yellow
    $accountId = Read-Host "   Enter Account ID manually"
}
Write-Host ""

# Get API Token
Write-Host "Getting API Token..." -ForegroundColor Cyan
$apiToken = $env:CLOUDFLARE_API_TOKEN
if (!$apiToken) {
    Write-Host "   WARNING: CLOUDFLARE_API_TOKEN not set" -ForegroundColor Yellow
    Write-Host "   Create token at: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Yellow
    Write-Host "   Required permissions: Account -> Cloudflare Pages -> Edit" -ForegroundColor Yellow
    Write-Host ""
    $apiToken = Read-Host "   Enter API Token (or press Enter to skip deletion)"
    if (!$apiToken) {
        Write-Host ""
        Write-Host "   WARNING: Skipping deletion. Will only do fresh deployment." -ForegroundColor Yellow
        Write-Host ""
        $skipDelete = $true
    }
} else {
    Write-Host "   OK: API Token found" -ForegroundColor Green
}
Write-Host ""

# Delete project via API
if (!$skipDelete -and $apiToken) {
    Write-Host "Deleting project 'nexx'..." -ForegroundColor Yellow
    
    $projectName = "nexx"
    $headers = @{
        "Authorization" = "Bearer $apiToken"
        "Content-Type" = "application/json"
    }
    
    $deleteUrl = "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/$projectName"
    
    try {
        $response = Invoke-RestMethod -Uri $deleteUrl -Method Delete -Headers $headers -ErrorAction Stop
        Write-Host "   OK: Project deleted successfully!" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 404) {
            Write-Host "   INFO: Project not found (may already be deleted)" -ForegroundColor Cyan
        } else {
            Write-Host "   WARNING: Delete error: $($_.Exception.Message)" -ForegroundColor Yellow
            Write-Host "   Continuing with fresh deployment..." -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

# Clean local dist folder
Write-Host "Cleaning local dist folder..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
    Write-Host "   OK: dist folder cleaned" -ForegroundColor Green
} else {
    Write-Host "   INFO: dist folder does not exist" -ForegroundColor Cyan
}
Write-Host ""

# Build project
Write-Host "Building project..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ERROR: Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "   OK: Build completed" -ForegroundColor Green
Write-Host ""

# Deploy new project
Write-Host "Deploying new project..." -ForegroundColor Cyan
wrangler pages deploy dist --project-name nexx-gsm --branch main
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ERROR: Deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "OK: Clean installation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Site available at: https://nexxgsm.com" -ForegroundColor Cyan
Write-Host "Dashboard: https://dash.cloudflare.com/" -ForegroundColor Cyan
Write-Host ""
