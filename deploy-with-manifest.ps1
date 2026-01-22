# Deploy via Cloudflare Pages API with Auto-Generated Manifest
# Автоматично створює manifest та деплоїть

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Deploy with Auto-Generated Manifest ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get Account ID
Write-Host "[1/6] Getting Account ID..." -ForegroundColor Yellow
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

# Step 2: Check Project
Write-Host "[2/6] Checking project..." -ForegroundColor Yellow
try {
    $projects = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects" -Method Get -Headers $headers
    $project = $projects.result | Where-Object { $_.name -eq $ProjectName }
    
    if (-not $project) {
        Write-Host "  Project not found!" -ForegroundColor Red
        exit 1
    }
    Write-Host "  Project found!" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Build
Write-Host "[3/6] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Build completed!" -ForegroundColor Green

# Step 4: Create ZIP
Write-Host "[4/6] Creating deployment package..." -ForegroundColor Yellow
$distPath = Resolve-Path "dist"
$zipPath = Join-Path $PWD "deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $zipPath)
Write-Host "  ZIP created: $(Split-Path $zipPath -Leaf)" -ForegroundColor Green

# Step 5: Generate Manifest
Write-Host "[5/6] Generating manifest..." -ForegroundColor Yellow

# Function to calculate SHA256 hash
function Get-FileHashSHA256 {
    param([string]$FilePath)
    $hash = Get-FileHash -Path $FilePath -Algorithm SHA256
    return "sha256-$($hash.Hash.ToLower())"
}

# Create manifest structure
$manifest = @{
    files = @{}
}

# Get all files from dist directory
$files = Get-ChildItem -Path $distPath -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($distPath.Length + 1).Replace('\', '/')
    $fileInfo = @{
        hash = Get-FileHashSHA256 -FilePath $_.FullName
        size = $_.Length
    }
    $manifest.files[$relativePath] = $fileInfo
}

# Save manifest to JSON file
$manifestPath = Join-Path $PWD "manifest-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$manifest | ConvertTo-Json -Depth 10 | Out-File -FilePath $manifestPath -Encoding UTF8

Write-Host "  Manifest created: $(Split-Path $manifestPath -Leaf)" -ForegroundColor Green
Write-Host "  Files in manifest: $($manifest.files.Count)" -ForegroundColor Gray

# Step 6: Deploy with manifest
Write-Host "[6/6] Deploying to Cloudflare Pages..." -ForegroundColor Yellow
$uploadUrl = "$API_BASE/accounts/$accountId/pages/projects/$ProjectName/deployments"

Write-Host "  Uploading with manifest..." -ForegroundColor Gray

# Use Invoke-WebRequest for multipart/form-data
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = @()
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"file`"; filename=`"$(Split-Path $zipPath -Leaf)`""
$bodyLines += "Content-Type: application/zip"
$bodyLines += ""
$bodyLines += [System.IO.File]::ReadAllBytes($zipPath) | ForEach-Object { [char]$_ }
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"manifest`""
$bodyLines += "Content-Type: application/json"
$bodyLines += ""
$bodyLines += (Get-Content -Path $manifestPath -Raw)
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"branch`""
$bodyLines += ""
$bodyLines += "main"
$bodyLines += "--$boundary--"

# This approach is too complex. Use curl with proper escaping
# Try using curl with manifest file reference
$result = & curl.exe -X POST $uploadUrl `
    -H "X-Auth-Key: $GlobalApiKey" `
    -H "X-Auth-Email: $Email" `
    -F "file=@$zipPath;type=application/zip" `
    -F "manifest=@$manifestPath;type=application/json" `
    -F "branch=main" `
    --silent --show-error 2>&1

# Save response
$responseFile = "deploy-response-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
$result | Out-File -FilePath $responseFile -Encoding UTF8

if ($LASTEXITCODE -eq 0) {
    try {
        # Extract JSON from curl output (skip progress lines)
        # Find JSON object in output (starts with { and ends with })
        $jsonText = ""
        $inJson = $false
        $braceCount = 0
        
        foreach ($line in $result) {
            if ($line -match '\{') {
                $inJson = $true
                $braceCount = ($line.ToCharArray() | Where-Object { $_ -eq '{' }).Count - ($line.ToCharArray() | Where-Object { $_ -eq '}' }).Count
                $jsonText = $line
            } elseif ($inJson) {
                $jsonText += "`n" + $line
                $braceCount += ($line.ToCharArray() | Where-Object { $_ -eq '{' }).Count - ($line.ToCharArray() | Where-Object { $_ -eq '}' }).Count
                if ($braceCount -le 0) {
                    break
                }
            }
        }
        
        if ($jsonText) {
            $jsonResult = $jsonText | ConvertFrom-Json
            if ($jsonResult.success) {
                Write-Host ""
                Write-Host "=== ✅ DEPLOYMENT SUCCESSFUL ===" -ForegroundColor Green
                if ($jsonResult.result.url) {
                    Write-Host "  Preview URL: $($jsonResult.result.url)" -ForegroundColor Cyan
                }
                if ($jsonResult.result.id) {
                    Write-Host "  Deployment ID: $($jsonResult.result.id)" -ForegroundColor Gray
                }
                
                # Cleanup
                Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
                Remove-Item $manifestPath -Force -ErrorAction SilentlyContinue
                
                Write-Host ""
                Write-Host "🌐 Production URL: https://nexxgsm.com/" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "💡 Next steps:" -ForegroundColor Yellow
                Write-Host "  1. Wait 2-3 minutes for deployment to process" -ForegroundColor White
                Write-Host "  2. Clear browser cache (Ctrl+Shift+Delete)" -ForegroundColor White
                Write-Host "  3. Hard refresh (Ctrl+F5)" -ForegroundColor White
                Write-Host "  4. Check deployment status:" -ForegroundColor White
                Write-Host "     .\check-deployment.ps1" -ForegroundColor Gray
                Write-Host "  5. Purge cache:" -ForegroundColor White
                Write-Host "     .\purge-cloudflare-cache.ps1" -ForegroundColor Gray
            } else {
                Write-Host ""
                Write-Host "=== ⚠️  DEPLOYMENT FAILED ===" -ForegroundColor Yellow
                if ($jsonResult.errors) {
                    foreach ($err in $jsonResult.errors) {
                        Write-Host "  Error $($err.code): $($err.message)" -ForegroundColor Red
                    }
                }
                Write-Host "  Full response saved to: $responseFile" -ForegroundColor Gray
            }
        } else {
            Write-Host ""
            Write-Host "=== ⚠️  Could not parse response ===" -ForegroundColor Yellow
            Write-Host "  Response saved to: $responseFile" -ForegroundColor Gray
            Write-Host "  Last 10 lines:" -ForegroundColor Gray
            $result | Select-Object -Last 10 | ForEach-Object { Write-Host "    $_" -ForegroundColor White }
        }
    } catch {
        Write-Host ""
        Write-Host "=== ⚠️  Error parsing response ===" -ForegroundColor Yellow
        Write-Host "  Error: $_" -ForegroundColor Red
        Write-Host "  Response saved to: $responseFile" -ForegroundColor Gray
    }
} else {
    Write-Host ""
    Write-Host "=== ❌ DEPLOYMENT FAILED ===" -ForegroundColor Red
    Write-Host "  Response saved to: $responseFile" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
