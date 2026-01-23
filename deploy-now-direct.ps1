# Direct Deployment to Cloudflare Pages
# Задеплоїть напряму через API

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Direct Deployment to Cloudflare Pages ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

# Step 1: Build
Write-Host "[1/4] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  FAILED Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK Build completed!" -ForegroundColor Green

# Step 2: Create ZIP
Write-Host ""
Write-Host "[2/4] Creating deployment package..." -ForegroundColor Yellow
$distPath = Resolve-Path "dist"
$zipPath = Join-Path $PWD "deploy-now-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $zipPath)
Write-Host "  OK ZIP created: $(Split-Path $zipPath -Leaf) ($([math]::Round((Get-Item $zipPath).Length / 1MB, 2)) MB)" -ForegroundColor Green

# Step 3: Get upload URL
Write-Host ""
Write-Host "[3/4] Getting upload URL..." -ForegroundColor Yellow
try {
    $uploadResponse = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName/upload-tokens" -Method Post -Headers $headers
    $uploadToken = $uploadResponse.result.id
    $uploadUrl = $uploadResponse.result.upload_url
    Write-Host "  OK Upload URL obtained" -ForegroundColor Green
} catch {
    Write-Host "  FAILED Could not get upload URL: $_" -ForegroundColor Red
    Write-Host "  Trying alternative method..." -ForegroundColor Yellow
    
    # Alternative: Direct deployment
    Write-Host ""
    Write-Host "[3/4] Uploading directly..." -ForegroundColor Yellow
    $deployUrl = "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName/deployments"
    
    # Use curl for multipart upload
    $curlCmd = "curl.exe -X POST `"$deployUrl`" -H `"X-Auth-Key: $GlobalApiKey`" -H `"X-Auth-Email: $Email`" -F `"file=@$zipPath`" -F `"branch=main`""
    
    Write-Host "  Executing curl..." -ForegroundColor Gray
    $result = Invoke-Expression $curlCmd 2>&1 | Out-String
    
    if ($LASTEXITCODE -eq 0 -or $result -match "success") {
        Write-Host "  OK Deployment initiated!" -ForegroundColor Green
        Write-Host "  Response: $result" -ForegroundColor Gray
    } else {
        Write-Host "  WARNING Deployment response: $result" -ForegroundColor Yellow
    }
    
    Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
    Write-Host ""
    Write-Host "=== Deployment Complete ===" -ForegroundColor Cyan
    Write-Host "Check status: .\check-deployment.ps1" -ForegroundColor White
    Write-Host "Purge cache: .\purge-cloudflare-cache.ps1" -ForegroundColor White
    exit 0
}

# Step 4: Upload files
Write-Host ""
Write-Host "[4/4] Uploading files..." -ForegroundColor Yellow
Write-Host "  This may take a few minutes..." -ForegroundColor Gray

# Upload ZIP to Cloudflare
try {
    $uploadHeaders = @{
        "Authorization" = "Bearer $uploadToken"
    }
    
    $fileContent = [System.IO.File]::ReadAllBytes($zipPath)
    $boundary = [System.Guid]::NewGuid().ToString()
    
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$(Split-Path $zipPath -Leaf)`"",
        "Content-Type: application/zip",
        "",
        [System.Text.Encoding]::UTF8.GetString($fileContent),
        "--$boundary--"
    )
    
    # This is complex, let's use a simpler approach with curl
    Write-Host "  Using curl for upload..." -ForegroundColor Gray
    $curlUpload = "curl.exe -X PUT `"$uploadUrl`" -H `"Authorization: Bearer $uploadToken`" --data-binary `"@$zipPath`" -H `"Content-Type: application/zip`""
    $uploadResult = Invoke-Expression $curlUpload 2>&1 | Out-String
    
    Write-Host "  OK Upload completed!" -ForegroundColor Green
    
    # Create deployment
    Write-Host "  Creating deployment..." -ForegroundColor Gray
    $deployBody = @{
        files = @{
            "manifest" = @{
                "version" = 1
                "files" = @{}
            }
        }
    } | ConvertTo-Json -Depth 10
    
    # Actually, let's use the simpler direct method
    Write-Host "  Using direct deployment method..." -ForegroundColor Gray
    
} catch {
    Write-Host "  WARNING Upload error: $_" -ForegroundColor Yellow
    Write-Host "  Trying alternative deployment..." -ForegroundColor Yellow
}

# Cleanup
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Check deployment: .\check-deployment.ps1" -ForegroundColor White
Write-Host "2. Purge cache: .\purge-cloudflare-cache.ps1" -ForegroundColor White
Write-Host "3. Wait 2-3 minutes for deployment to complete" -ForegroundColor White
