# Working Cloudflare Pages Deployment Script
# Based on official Cloudflare API documentation

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "Cloudflare Pages Deployment" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get Account ID
Write-Host "Step 1: Getting Account ID..." -ForegroundColor Yellow
$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
}

try {
    $response = Invoke-RestMethod -Uri "$API_BASE/accounts" -Method Get -Headers $headers
    $accountId = $response.result[0].id
    Write-Host "  Account ID: $accountId" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Build
Write-Host "Step 2: Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Build completed!" -ForegroundColor Green

# Step 3: Deploy using wrangler with environment variables
Write-Host "Step 3: Deploying..." -ForegroundColor Yellow
Write-Host "  Note: Using wrangler with Global API Key setup" -ForegroundColor Gray

# Set environment variables for wrangler
$env:CLOUDFLARE_API_TOKEN = $GlobalApiKey
$env:CLOUDFLARE_EMAIL = $Email

# Try deployment
wrangler pages deploy dist --project-name $ProjectName

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Deployment completed!" -ForegroundColor Green
    Write-Host "Site: https://nexxgsm.com/" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Wrangler deployment failed. Trying alternative..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "RECOMMENDED: Use wrangler login" -ForegroundColor Cyan
    Write-Host "  1. Remove env vars: Remove-Item Env:CLOUDFLARE_API_TOKEN" -ForegroundColor White
    Write-Host "  2. Login: wrangler login" -ForegroundColor White
    Write-Host "  3. Deploy: wrangler pages deploy dist --project-name $ProjectName" -ForegroundColor White
}
