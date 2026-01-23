# Deploy with Proper Manifest
# Задеплоїть з правильним manifest файлом

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Deploy with Manifest ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
}

# Step 1: Build
Write-Host "[1/5] Building..." -ForegroundColor Yellow
npm run build | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  FAILED" -ForegroundColor Red
    exit 1
}
Write-Host "  OK" -ForegroundColor Green

# Step 2: Create manifest
Write-Host ""
Write-Host "[2/5] Creating manifest..." -ForegroundColor Yellow
$distPath = Resolve-Path "dist"
$files = Get-ChildItem -Path $distPath -Recurse -File | Where-Object { $_.FullName -notmatch '\.zip$' }

$manifestFiles = @{}
foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($distPath.Path.Length + 1).Replace('\', '/')
    $fileHash = (Get-FileHash -Path $file.FullName -Algorithm SHA256).Hash
    $fileSize = $file.Length
    
    $manifestFiles[$relativePath] = @{
        version = 1
        hash = $fileHash
        size = $fileSize
    }
}

$manifest = @{
    version = 1
    files = $manifestFiles
}

$manifestPath = Join-Path $distPath "manifest.json"
$manifest | ConvertTo-Json -Depth 10 | Out-File -FilePath $manifestPath -Encoding UTF8
Write-Host "  OK Manifest created with $($manifestFiles.Count) files" -ForegroundColor Green

# Step 3: Create ZIP
Write-Host ""
Write-Host "[3/5] Creating ZIP..." -ForegroundColor Yellow
$zipPath = Join-Path $PWD "deploy-manifest-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $zipPath)
Write-Host "  OK ZIP: $([math]::Round((Get-Item $zipPath).Length / 1MB, 2)) MB" -ForegroundColor Green

# Step 4: Deploy
Write-Host ""
Write-Host "[4/5] Deploying..." -ForegroundColor Yellow
$deployUrl = "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName/deployments"

# Read manifest content
$manifestContent = Get-Content $manifestPath -Raw

# Use curl with manifest
$curlCmd = "curl.exe -X POST `"$deployUrl`" -H `"X-Auth-Key: $GlobalApiKey`" -H `"X-Auth-Email: $Email`" -F `"file=@$zipPath`" -F `"manifest=@$manifestPath;type=application/json`" -F `"branch=main`""

Write-Host "  Uploading..." -ForegroundColor Gray
$result = Invoke-Expression $curlCmd 2>&1 | Out-String

# Parse response
try {
    $jsonResult = $result | ConvertFrom-Json
    if ($jsonResult.success) {
        Write-Host "  OK Deployment successful!" -ForegroundColor Green
        if ($jsonResult.result.url) {
            Write-Host "  Preview: $($jsonResult.result.url)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "  FAILED: $($jsonResult.errors[0].message)" -ForegroundColor Red
        Write-Host "  Full response: $result" -ForegroundColor Gray
    }
} catch {
    Write-Host "  Response: $result" -ForegroundColor Yellow
}

# Step 5: Cleanup
Write-Host ""
Write-Host "[5/5] Cleanup..." -ForegroundColor Yellow
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
Remove-Item $manifestPath -Force -ErrorAction SilentlyContinue
Write-Host "  OK" -ForegroundColor Green

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
Write-Host "Check: .\check-deployment.ps1" -ForegroundColor White
Write-Host "Purge: .\purge-cloudflare-cache.ps1" -ForegroundColor White
