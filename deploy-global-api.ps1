# Deploy via Cloudflare Pages API using Global API Key
# Correct format with manifest

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Deploy via Global API Key ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get Account ID
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

# Step 2: Check/Create Project
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

# Step 3: Build
Write-Host "[3/5] Building project..." -ForegroundColor Yellow
npm run build | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Build completed!" -ForegroundColor Green

# Step 4: Create ZIP
Write-Host "[4/5] Creating deployment package..." -ForegroundColor Yellow
$distPath = Resolve-Path "dist"
$zipPath = Join-Path $PWD "deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $zipPath)
Write-Host "  ZIP created: $(Split-Path $zipPath -Leaf)" -ForegroundColor Green

# Step 5: Deploy with proper format
Write-Host "[5/5] Deploying to Cloudflare Pages..." -ForegroundColor Yellow
$uploadUrl = "$API_BASE/accounts/$accountId/pages/projects/$ProjectName/deployments"

# Use curl with proper multipart form data
$curlHeaders = @(
    "-H", "X-Auth-Key: $GlobalApiKey",
    "-H", "X-Auth-Email: $Email"
)

# Try deployment with branch parameter
Write-Host "  Uploading..." -ForegroundColor Gray
$result = & curl.exe -X POST $uploadUrl $curlHeaders -F "file=@$zipPath" -F "branch=main" 2>&1

# Save response for debugging
$responseFile = "deploy-response-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
$result | Out-File -FilePath $responseFile -Encoding UTF8

if ($LASTEXITCODE -eq 0) {
    # Try to parse JSON response
    try {
        $jsonResult = $result | ConvertFrom-Json
        if ($jsonResult.success) {
            Write-Host ""
            Write-Host "=== ✅ DEPLOYMENT SUCCESSFUL ===" -ForegroundColor Green
            if ($jsonResult.result.url) {
                Write-Host "  Preview URL: $($jsonResult.result.url)" -ForegroundColor Cyan
            }
            if ($jsonResult.result.id) {
                Write-Host "  Deployment ID: $($jsonResult.result.id)" -ForegroundColor Gray
            }
            Write-Host "  Response saved to: $responseFile" -ForegroundColor Gray
        } else {
            Write-Host ""
            Write-Host "=== ⚠️  DEPLOYMENT RESPONSE ===" -ForegroundColor Yellow
            Write-Host $result -ForegroundColor Gray
            Write-Host "  Full response saved to: $responseFile" -ForegroundColor Gray
        }
    } catch {
        # If not JSON, show raw response
        Write-Host ""
        Write-Host "=== ⚠️  DEPLOYMENT RESPONSE (not JSON) ===" -ForegroundColor Yellow
        Write-Host "  Response:" -ForegroundColor Gray
        Write-Host $result -ForegroundColor White
        Write-Host "  Full response saved to: $responseFile" -ForegroundColor Gray
        Write-Host ""
        Write-Host "💡 If deployment not appearing:" -ForegroundColor Cyan
        Write-Host "   1. Check Cloudflare Dashboard manually" -ForegroundColor White
        Write-Host "   2. Use Dashboard upload: Pages → nexx → Upload assets" -ForegroundColor White
        Write-Host "   3. Or use wrangler login method" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "🌐 Production URL: https://nexxgsm.com/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Wait 2-3 minutes for deployment to process" -ForegroundColor White
    Write-Host "  2. Clear browser cache (Ctrl+Shift+Delete)" -ForegroundColor White
    Write-Host "  3. Hard refresh (Ctrl+F5)" -ForegroundColor White
    Write-Host "  4. Check deployment status:" -ForegroundColor White
    Write-Host "     .\check-deployment.ps1" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "=== ❌ DEPLOYMENT FAILED ===" -ForegroundColor Red
    Write-Host "Response:" -ForegroundColor Yellow
    Write-Host $result -ForegroundColor Gray
    Write-Host ""
    Write-Host "Trying to parse error..." -ForegroundColor Yellow
    
    try {
        $errorJson = $result | ConvertFrom-Json
        if ($errorJson.errors) {
            foreach ($err in $errorJson.errors) {
                Write-Host "  Error $($err.code): $($err.message)" -ForegroundColor Red
            }
        }
    } catch {
        Write-Host "  Raw error: $result" -ForegroundColor Red
    }
}

# Cleanup
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
