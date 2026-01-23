# Force redeploy to production

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Force Redeploy to Production ===" -ForegroundColor Cyan
Write-Host ""

# Get Account ID
$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
}

$response = Invoke-RestMethod -Uri "$API_BASE/accounts" -Method Get -Headers $headers
$accountId = $response.result[0].id

Write-Host "Account ID: $accountId" -ForegroundColor Green
Write-Host ""

# Build fresh
Write-Host "Building fresh..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Build completed!" -ForegroundColor Green
Write-Host ""

# Create ZIP
Write-Host "Creating deployment package..." -ForegroundColor Yellow
$distPath = Resolve-Path "dist"
$zipPath = Join-Path $PWD "deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $zipPath)
Write-Host "ZIP created: $(Split-Path $zipPath -Leaf)" -ForegroundColor Green
Write-Host ""

# Deploy
Write-Host "Deploying to Cloudflare Pages..." -ForegroundColor Yellow
$uploadUrl = "$API_BASE/accounts/$accountId/pages/projects/$ProjectName/deployments"

$curlHeaders = @(
    "-H", "X-Auth-Key: $GlobalApiKey",
    "-H", "X-Auth-Email: $Email"
)

$curlResult = & curl.exe -X POST $uploadUrl $curlHeaders -F "file=@$zipPath" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== DEPLOYMENT SUCCESSFUL ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Production URL: https://nexxgsm.com/" -ForegroundColor Cyan
    Write-Host "Preview URL: Check Cloudflare Dashboard" -ForegroundColor Gray
    Write-Host ""
    Write-Host "IMPORTANT: Clear browser cache!" -ForegroundColor Yellow
    Write-Host "  - Press Ctrl+Shift+Delete" -ForegroundColor White
    Write-Host "  - Or Ctrl+F5 for hard refresh" -ForegroundColor White
    Write-Host ""
    
    # Try to parse deployment URL from response
    if ($curlResult -match 'https://[a-f0-9]+\.nexx.*\.pages\.dev') {
        $previewUrl = $matches[0]
        Write-Host "Preview URL: $previewUrl" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "Deployment failed!" -ForegroundColor Red
    Write-Host "Response:" -ForegroundColor Yellow
    Write-Host $curlResult -ForegroundColor Gray
}

# Cleanup
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Check deployment status:" -ForegroundColor Cyan
Write-Host "  .\check-deployment.ps1" -ForegroundColor White
