# Deploy with explicit branch specification

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Deploy to Production Branch ===" -ForegroundColor Cyan
Write-Host ""

# Get Account ID
$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
}

$response = Invoke-RestMethod -Uri "$API_BASE/accounts" -Method Get -Headers $headers
$accountId = $response.result[0].id

# Build
Write-Host "Building..." -ForegroundColor Yellow
npm run build | Out-Null
Write-Host "Build completed!" -ForegroundColor Green
Write-Host ""

# Create ZIP
$distPath = Resolve-Path "dist"
$zipPath = Join-Path $PWD "deploy-main.zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $zipPath)
Write-Host "ZIP created" -ForegroundColor Green
Write-Host ""

# Deploy with branch specification
Write-Host "Deploying to 'main' branch..." -ForegroundColor Yellow
$uploadUrl = "$API_BASE/accounts/$accountId/pages/projects/$ProjectName/deployments"

# Try with branch parameter
$curlCmd = "curl.exe -X POST `"$uploadUrl`" -H `"X-Auth-Key: $GlobalApiKey`" -H `"X-Auth-Email: $Email`" -F `"file=@$zipPath`" -F `"branch=main`""

Write-Host "Executing: $curlCmd" -ForegroundColor Gray
$result = Invoke-Expression $curlCmd 2>&1

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "=== SUCCESS ===" -ForegroundColor Green
    Write-Host $result -ForegroundColor Gray
    Write-Host ""
    Write-Host "Production: https://nexxgsm.com/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Wait 2-3 minutes, then:" -ForegroundColor Yellow
    Write-Host "  1. Clear cache (Ctrl+Shift+Delete)" -ForegroundColor White
    Write-Host "  2. Hard refresh (Ctrl+F5)" -ForegroundColor White
    Write-Host "  3. Check in incognito mode" -ForegroundColor White
} else {
    Write-Host "=== ERROR ===" -ForegroundColor Red
    Write-Host $result -ForegroundColor Gray
    Write-Host ""
    Write-Host "Try manual deployment via Dashboard:" -ForegroundColor Yellow
    Write-Host "  https://dash.cloudflare.com/" -ForegroundColor Cyan
}

# Cleanup
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
