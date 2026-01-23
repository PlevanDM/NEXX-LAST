# Direct Cloudflare Pages API Deployment
# Works with Global API Key - bypasses wrangler

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Direct Cloudflare Pages API Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Get Account ID
Write-Host "[1/5] Getting Account ID..." -ForegroundColor Yellow
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

# Check/Create Project
Write-Host "[2/5] Checking project..." -ForegroundColor Yellow
try {
    $projects = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects" -Method Get -Headers $headers
    $project = $projects.result | Where-Object { $_.name -eq $ProjectName }
    
    if (-not $project) {
        Write-Host "  Creating project..." -ForegroundColor Gray
        $createBody = @{ name = $ProjectName; production_branch = "main" } | ConvertTo-Json
        $createHeaders = $headers.Clone()
        $createHeaders["Content-Type"] = "application/json"
        $project = (Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects" -Method Post -Headers $createHeaders -Body $createBody).result
        Write-Host "  Project created!" -ForegroundColor Green
    } else {
        Write-Host "  Project found!" -ForegroundColor Green
    }
} catch {
    Write-Host "  ERROR: $_" -ForegroundColor Red
    exit 1
}

# Build
Write-Host "[3/5] Building..." -ForegroundColor Yellow
npm run build | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Build completed!" -ForegroundColor Green

# Create ZIP
Write-Host "[4/5] Creating deployment package..." -ForegroundColor Yellow
$distPath = Resolve-Path "dist"
$zipPath = Join-Path $PWD "deploy-temp.zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $zipPath)
Write-Host "  ZIP created: $zipPath" -ForegroundColor Green

# Deploy via API
Write-Host "[5/5] Uploading to Cloudflare Pages..." -ForegroundColor Yellow

# Use curl for multipart upload (more reliable)
$curlPath = "curl.exe"
if (-not (Get-Command $curlPath -ErrorAction SilentlyContinue)) {
    Write-Host "  ERROR: curl not found. Installing..." -ForegroundColor Red
    Write-Host "  Alternative: Use wrangler login method" -ForegroundColor Yellow
    exit 1
}

$uploadUrl = "$API_BASE/accounts/$accountId/pages/projects/$ProjectName/deployments"
$curlHeaders = @(
    "-H", "X-Auth-Key: $GlobalApiKey",
    "-H", "X-Auth-Email: $Email"
)

Write-Host "  Uploading via API..." -ForegroundColor Gray

# Try curl upload
$curlResult = & $curlPath -X POST $uploadUrl $curlHeaders -F "file=@$zipPath" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Site: https://nexxgsm.com/" -ForegroundColor Cyan
} else {
    Write-Host "  Upload failed. Response:" -ForegroundColor Red
    Write-Host $curlResult -ForegroundColor Gray
    Write-Host ""
    Write-Host "SOLUTION: Use wrangler login" -ForegroundColor Cyan
    Write-Host "  1. Remove-Item Env:CLOUDFLARE_API_TOKEN -ErrorAction SilentlyContinue" -ForegroundColor White
    Write-Host "  2. wrangler login" -ForegroundColor White
    Write-Host "  3. wrangler pages deploy dist --project-name $ProjectName" -ForegroundColor White
}

# Cleanup
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Green
