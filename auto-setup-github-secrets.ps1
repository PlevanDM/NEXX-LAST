# Auto Setup GitHub Secrets for Cloudflare Pages
# Автоматическая настройка GitHub Secrets

$GITHUB_TOKEN = $env:GITHUB_TOKEN
if (-not $GITHUB_TOKEN) {
    Write-Host "❌ GITHUB_TOKEN environment variable is not set!" -ForegroundColor Red
    Write-Host "   Set it with: `$env:GITHUB_TOKEN = 'your_token'" -ForegroundColor Yellow
    exit 1
}
$REPO_OWNER = "PlevanDM"
$REPO_NAME = "nexx-webapp"
$API_BASE = "https://api.github.com"

# Cloudflare credentials
$CLOUDFLARE_API_TOKEN = "519bdfbd2efeaa9c3a418b905202058bac2fc"  # Global API Key (will work as API Token)
$CLOUDFLARE_ACCOUNT_ID = "ad170d773e79a037e28f4530fd5305a5"

Write-Host "=== Auto Setup GitHub Secrets ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "token $GITHUB_TOKEN"
    "Accept" = "application/vnd.github.v3+json"
}

# Step 1: Get public key
Write-Host "[1/3] Getting repository public key..." -ForegroundColor Yellow
try {
    $publicKey = Invoke-RestMethod -Uri "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/public-key" -Headers $headers
    Write-Host "   ✅ Public key retrieved" -ForegroundColor Green
    $keyId = $publicKey.key_id
    $publicKeyBase64 = $publicKey.key
} catch {
    Write-Host "   ❌ Failed to get public key: $_" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    exit 1
}

# Step 2: Encrypt secrets using Node.js
Write-Host ""
Write-Host "[2/3] Encrypting secrets..." -ForegroundColor Yellow

# Check if Node.js is available
$nodeAvailable = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeAvailable) {
    Write-Host "   ❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Setup local encryption helper
$helperDir = ".github-secrets-helper"
if (-not (Test-Path $helperDir)) {
    New-Item -ItemType Directory -Path $helperDir | Out-Null
}

# Install dependencies
Push-Location $helperDir
try {
    if (-not (Test-Path "node_modules")) {
        Write-Host "   Installing encryption dependencies..." -ForegroundColor Gray
        npm install 2>&1 | Out-Null
    }
    
    $encryptedOutput = node encrypt.js $publicKeyBase64 $CLOUDFLARE_API_TOKEN $CLOUDFLARE_ACCOUNT_ID $keyId 2>&1
    $encryptedJson = ($encryptedOutput | Where-Object { $_ -match '^\{' -or $_ -match '^\s*\{' } | Out-String).Trim()
    if (-not $encryptedJson -or $encryptedJson -match "Error|Cannot find|TypeError|Invalid") {
        $errorOutput = $encryptedOutput | Out-String
        throw "Encryption failed: $errorOutput"
    }
    # Extract JSON from output (might have extra text)
    if ($encryptedJson -match '\{.*\}') {
        $encryptedJson = $matches[0]
    }
    $encrypted = $encryptedJson | ConvertFrom-Json
    Write-Host "   ✅ Secrets encrypted" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Encryption failed: $_" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}

# Step 3: Set secrets
Write-Host ""
Write-Host "[3/3] Setting GitHub Secrets..." -ForegroundColor Yellow

$secretsToSet = @{
    "CLOUDFLARE_API_TOKEN" = $encrypted.CLOUDFLARE_API_TOKEN
    "CLOUDFLARE_ACCOUNT_ID" = $encrypted.CLOUDFLARE_ACCOUNT_ID
}

foreach ($secretName in $secretsToSet.Keys) {
    $encryptedData = $encrypted.$secretName
    
    # Ensure we have string values, not arrays
    $encryptedValue = if ($encryptedData.encrypted -is [array]) { $encryptedData.encrypted[0] } else { $encryptedData.encrypted }
    $keyIdValue = if ($encryptedData.key_id -is [array]) { $encryptedData.key_id[0] } else { $encryptedData.key_id }
    
    $body = @{
        encrypted_value = $encryptedValue
        key_id = $keyIdValue
    } | ConvertTo-Json
    
    $headers["Content-Type"] = "application/json"
    
    try {
        $result = Invoke-RestMethod -Uri "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/$secretName" -Method Put -Headers $headers -Body $body
        Write-Host "   ✅ $secretName set successfully" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode -eq 204) {
            Write-Host "   ✅ $secretName set successfully" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Failed to set $secretName : $_" -ForegroundColor Red
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
            if ($_.Exception.Response) {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                Write-Host "   Response: $responseBody" -ForegroundColor Gray
            }
        }
    }
}

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "✅ GitHub Secrets configured!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Go to: https://github.com/$REPO_OWNER/$REPO_NAME/actions" -ForegroundColor White
Write-Host "   2. Run workflow: 'Deploy to Cloudflare Pages' → 'Run workflow'" -ForegroundColor White
Write-Host "   3. Check deployment status" -ForegroundColor White
