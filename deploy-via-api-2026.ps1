# Cloudflare Pages API Deployment - 2026 Format
# Використовує актуальний формат API згідно з документацією 2026

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Cloudflare Pages API Deployment (2026) ===" -ForegroundColor Cyan
Write-Host ""

# Note: According to 2026 documentation, Pages API requires API Token (Bearer)
# But we'll try Global API Key first, then suggest API Token if it fails

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

# Step 1: Build
Write-Host "[1/5] Building project..." -ForegroundColor Yellow
npm run build | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  FAILED" -ForegroundColor Red
    exit 1
}
Write-Host "  OK" -ForegroundColor Green

# Step 2: Create manifest with SHA256 hashes
Write-Host ""
Write-Host "[2/5] Creating manifest with file hashes..." -ForegroundColor Yellow
$distPath = Resolve-Path "dist"
$files = Get-ChildItem -Path $distPath -Recurse -File | Where-Object { 
    $_.FullName -notmatch '\.zip$' -and 
    $_.FullName -notmatch 'manifest\.json$'
}

$manifestFiles = @{}
foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($distPath.Path.Length + 1).Replace('\', '/')
    $fileHash = (Get-FileHash -Path $file.FullName -Algorithm SHA256).Hash.ToLower()
    $fileSize = $file.Length
    
    # Manifest format: { "path": "hash" }
    $manifestFiles[$relativePath] = $fileHash
}

$manifestJson = $manifestFiles | ConvertTo-Json -Compress
Write-Host "  OK Manifest created with $($manifestFiles.Count) files" -ForegroundColor Green

# Step 3: Create ZIP
Write-Host ""
Write-Host "[3/5] Creating deployment package..." -ForegroundColor Yellow
$zipPath = Join-Path $PWD "deploy-2026-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $zipPath)
Write-Host "  OK ZIP: $([math]::Round((Get-Item $zipPath).Length / 1MB, 2)) MB" -ForegroundColor Green

# Step 4: Deploy using curl with proper format
Write-Host ""
Write-Host "[4/5] Deploying to Cloudflare Pages..." -ForegroundColor Yellow
$deployUrl = "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName/deployments"

# According to 2026 API docs, format is:
# -F branch=main
# -F manifest='{"file1": "hash1", "file2": "hash2"}'
# -F pages_build_output_dir=dist
# -F commit_hash=...
# -F commit_message=...

$commitHash = git rev-parse HEAD 2>$null
if (-not $commitHash) { $commitHash = "manual-deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss')" }

# Escape manifest JSON for curl
$manifestEscaped = $manifestJson -replace '"', '\"'

# Build curl command
$curlArgs = @(
    "-X", "POST",
    $deployUrl,
    "-H", "X-Auth-Key: $GlobalApiKey",
    "-H", "X-Auth-Email: $Email",
    "-F", "branch=main",
    "-F", "manifest=$manifestJson",
    "-F", "pages_build_output_dir=dist",
    "-F", "commit_hash=$commitHash",
    "-F", "commit_message=Deploy via API - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    "-F", "commit_dirty=false",
    "-F", "file=@$zipPath"
)

Write-Host "  Uploading deployment..." -ForegroundColor Gray
$result = & curl.exe $curlArgs 2>&1 | Out-String

# Step 5: Parse response
Write-Host ""
Write-Host "[5/5] Parsing response..." -ForegroundColor Yellow
try {
    $jsonResult = $result | ConvertFrom-Json
    if ($jsonResult.success) {
        Write-Host "  OK Deployment successful!" -ForegroundColor Green
        if ($jsonResult.result.url) {
            Write-Host "  Preview URL: $($jsonResult.result.url)" -ForegroundColor Cyan
        }
        if ($jsonResult.result.id) {
            Write-Host "  Deployment ID: $($jsonResult.result.id)" -ForegroundColor Gray
        }
    } else {
        Write-Host "  FAILED: $($jsonResult.errors[0].message)" -ForegroundColor Red
        if ($jsonResult.errors[0].code -eq 10001) {
            Write-Host ""
            Write-Host "  NOTE: API requires API Token (Bearer), not Global API Key" -ForegroundColor Yellow
            Write-Host "  Create API Token at: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Yellow
            Write-Host "  Permissions needed: Cloudflare Pages - Edit" -ForegroundColor Yellow
        }
        Write-Host "  Full response: $result" -ForegroundColor Gray
    }
} catch {
    Write-Host "  Response (not JSON): $result" -ForegroundColor Yellow
    if ($result -match "401|403|Unauthorized") {
        Write-Host ""
        Write-Host "  NOTE: Authentication failed. API requires API Token (Bearer)" -ForegroundColor Yellow
        Write-Host "  Global API Key may not work with Pages API in 2026" -ForegroundColor Yellow
    }
}

# Cleanup
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
Write-Host "Check: .\check-deployment.ps1" -ForegroundColor White
Write-Host "Purge: .\purge-cloudflare-cache.ps1" -ForegroundColor White
