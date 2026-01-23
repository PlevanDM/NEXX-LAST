# Test GitHub Secrets API Access
# Тестування доступу до GitHub Secrets API

$GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"  # Замените на свой токен
$REPO_OWNER = "PlevanDM"
$REPO_NAME = "nexx-webapp"
$API_BASE = "https://api.github.com"

Write-Host "=== Testing GitHub Secrets API ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "token $GITHUB_TOKEN"
    "Accept" = "application/vnd.github.v3+json"
}

# Test 1: Get public key
Write-Host "1. Getting repository public key..." -ForegroundColor Yellow
try {
    $publicKey = Invoke-RestMethod -Uri "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/public-key" -Headers $headers
    Write-Host "   ✅ Public key retrieved" -ForegroundColor Green
    Write-Host "   Key ID: $($publicKey.key_id)" -ForegroundColor Gray
    Write-Host "   Key (first 50 chars): $($publicKey.key.Substring(0, [Math]::Min(50, $publicKey.key.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed to get public key: $_" -ForegroundColor Red
    Write-Host "   Error details: $($_.Exception.Message)" -ForegroundColor Gray
    exit 1
}

# Test 2: List existing secrets
Write-Host ""
Write-Host "2. Listing existing secrets..." -ForegroundColor Yellow
try {
    $secrets = Invoke-RestMethod -Uri "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/actions/secrets" -Headers $headers
    Write-Host "   ✅ Secrets API accessible" -ForegroundColor Green
    Write-Host "   Total secrets: $($secrets.total_count)" -ForegroundColor Gray
    if ($secrets.secrets -and $secrets.secrets.Count -gt 0) {
        foreach ($secret in $secrets.secrets) {
            Write-Host "     - $($secret.name) (updated: $($secret.updated_at))" -ForegroundColor Gray
        }
    } else {
        Write-Host "     No secrets found" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Failed to list secrets: $_" -ForegroundColor Red
    Write-Host "   Error details: $($_.Exception.Message)" -ForegroundColor Gray
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "   ⚠️  Token may need 'admin:repo' scope" -ForegroundColor Yellow
    }
}

# Test 3: Check Node.js and tweetnacl
Write-Host ""
Write-Host "3. Checking encryption tools..." -ForegroundColor Yellow
$nodeAvailable = Get-Command node -ErrorAction SilentlyContinue
if ($nodeAvailable) {
    Write-Host "   ✅ Node.js found: $(node --version)" -ForegroundColor Green
    try {
        $naclCheck = node -e "require('tweetnacl'); console.log('OK')" 2>&1
        if ($naclCheck -eq "OK") {
            Write-Host "   ✅ tweetnacl installed" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  tweetnacl not found" -ForegroundColor Yellow
            Write-Host "   Install with: npm install -g tweetnacl" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   ⚠️  tweetnacl check failed" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  Node.js not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "API Access: ✅ Ready" -ForegroundColor Green
Write-Host "Public Key: ✅ Available" -ForegroundColor Green
Write-Host ""
Write-Host "💡 To set secrets, run:" -ForegroundColor Yellow
Write-Host "   .\setup-github-secrets.ps1 -CloudflareApiToken 'your_token'" -ForegroundColor White
