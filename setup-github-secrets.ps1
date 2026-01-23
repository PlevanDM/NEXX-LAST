# Setup GitHub Actions Secrets using Personal Access Token
# Налаштування GitHub Actions Secrets через токен

param(
    [string]$CloudflareApiToken = "",
    [string]$CloudflareAccountId = "ad170d773e79a037e28f4530fd5305a5"
)

$GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"  # Замените на свой токен
$REPO_OWNER = "PlevanDM"
$REPO_NAME = "nexx-webapp"
$API_BASE = "https://api.github.com"

Write-Host "=== GitHub Actions Secrets Setup ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "token $GITHUB_TOKEN"
    "Accept" = "application/vnd.github.v3+json"
}

# Check if Cloudflare API Token is provided
if ([string]::IsNullOrWhiteSpace($CloudflareApiToken)) {
    Write-Host "⚠️  Cloudflare API Token not provided" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  .\setup-github-secrets.ps1 -CloudflareApiToken 'your_cloudflare_token'" -ForegroundColor White
    Write-Host ""
    Write-Host "Or set secrets manually:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions" -ForegroundColor Gray
    Write-Host "  2. Add: CLOUDFLARE_API_TOKEN" -ForegroundColor Gray
    Write-Host "  3. Add: CLOUDFLARE_ACCOUNT_ID = $CloudflareAccountId" -ForegroundColor Gray
    Write-Host ""
    exit 0
}

# Function to encrypt secret using GitHub's public key (NaCl/libsodium)
function Encrypt-GitHubSecret {
    param(
        [string]$PlainText,
        [string]$PublicKeyBase64
    )
    
    # GitHub uses NaCl/libsodium for encryption (Box encryption with Curve25519)
    # We'll use Node.js with tweetnacl first (already installed), then Python as fallback
    
    # Try Node.js first (tweetnacl is installed)
    $nodeAvailable = Get-Command node -ErrorAction SilentlyContinue
    
    if ($nodeAvailable) {
        # Escape the strings for JavaScript (use single quotes in JS, escape single quotes and backslashes)
        $escapedPublicKey = $PublicKeyBase64 -replace '\\', '\\\\' -replace "'", "\'"
        $escapedPlainText = $PlainText -replace '\\', '\\\\' -replace "'", "\'" -replace "`n", "\\n" -replace "`r", "\\r" -replace "`$", "\\$"
        
        # Get project root directory for node_modules
        $projectRoot = $PSScriptRoot
        if (-not $projectRoot) {
            $projectRoot = (Get-Location).Path
        }
        $naclPath = Join-Path $projectRoot "node_modules\tweetnacl" | Resolve-Path -ErrorAction SilentlyContinue
        if (-not $naclPath) {
            $naclPath = Join-Path $projectRoot "node_modules\tweetnacl"
        }
        $blake2bPath = Join-Path $projectRoot "node_modules\blake2b" | Resolve-Path -ErrorAction SilentlyContinue
        if (-not $blake2bPath) {
            $blake2bPath = Join-Path $projectRoot "node_modules\blake2b"
        }
        $naclPathJs = $naclPath -replace '\\', '/' -replace "'", "\'"
        $blake2bPathJs = $blake2bPath -replace '\\', '/' -replace "'", "\'"
        
        $nodeScript = @"
// Use absolute paths to modules
const path = require('path');
const naclPath = '$naclPathJs';
const blake2bPath = '$blake2bPathJs';
const nacl = require(naclPath);
const blake2b = require(blake2bPath);

try {
    // Decode GitHub's public key (base64)
    const publicKeyBytes = Buffer.from('$escapedPublicKey', 'base64');
    
    // Convert message to Uint8Array
    const message = new TextEncoder().encode('$escapedPlainText');
    
    // Generate ephemeral key pair for this encryption
    const ephemeralKeyPair = nacl.box.keyPair();
    
    // GitHub uses crypto_box_seal format:
    // nonce = blake2b(ephemeral_public_key + recipient_public_key, 24 bytes)
    // For blake2b, we'll use crypto.createHash with a workaround
    // Actually, GitHub uses libsodium's crypto_box_seal which uses a specific nonce generation
    // Let's use the standard approach: nonce from blake2b hash of both public keys
    
    // Create nonce using blake2b: hash(ephemeral_pubkey + recipient_pubkey) -> 24 bytes
    // Since Node.js crypto doesn't have blake2b directly, we'll use a workaround
    // GitHub's actual implementation uses libsodium's crypto_box_seal
    // For now, let's try using a random nonce and see if it works
    // Actually, let's implement sealed box manually:
    
    // GitHub's sealed box uses: nonce = blake2b(ephemeral_pubkey + recipient_pubkey, output_length=24)
    const combinedPubKeys = Buffer.concat([
        Buffer.from(ephemeralKeyPair.publicKey),
        Buffer.from(publicKeyBytes)
    ]);
    
    // Generate nonce using blake2b (24 bytes output)
    const hash = blake2b(24);
    hash.update(combinedPubKeys);
    const nonce = hash.digest();
    
    // Encrypt using NaCl box
    const encrypted = nacl.box(message, nonce, publicKeyBytes, ephemeralKeyPair.secretKey);
    
    // GitHub sealed box format: ephemeral_public_key (32 bytes) + encrypted_message
    const combined = new Uint8Array(32 + encrypted.length);
    combined.set(ephemeralKeyPair.publicKey, 0);
    combined.set(encrypted, 32);
    
    // Convert to base64
    const encryptedValue = Buffer.from(combined).toString('base64');
    
    console.log(JSON.stringify({
        encrypted_value: encryptedValue,
        key_id: null
    }));
} catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
        console.log(JSON.stringify({
            error: 'tweetnacl not installed. Install with: npm install tweetnacl'
        }));
    } else {
        console.log(JSON.stringify({error: e.message + ' | ' + e.stack}));
    }
    process.exit(1);
}
"@
        
        $tempScript = [System.IO.Path]::GetTempFileName() + ".js"
        $nodeScript | Out-File -FilePath $tempScript -Encoding UTF8
        
        try {
            $nodeOutput = node $tempScript 2>&1
            $stdout = $nodeOutput | Where-Object { $_ -isnot [System.Management.Automation.ErrorRecord] } | Out-String
            $stderr = $nodeOutput | Where-Object { $_ -is [System.Management.Automation.ErrorRecord] } | ForEach-Object { $_.Exception.Message } | Out-String
            
            if ($stderr -and $stderr.Trim()) {
                Write-Host "  ⚠️  Node.js error: $stderr" -ForegroundColor Yellow
                return $null
            }
            
            $stdout = $stdout.Trim()
            if ($stdout) {
                try {
                    $result = $stdout | ConvertFrom-Json
                    
                    if ($result.error) {
                        Write-Host "  ⚠️  Node.js encryption error: $($result.error)" -ForegroundColor Yellow
                        return $null
                    }
                    
                    if ($result.encrypted_value) {
                        return $result
                    }
                } catch {
                    Write-Host "  ⚠️  Failed to parse Node.js output: $_" -ForegroundColor Yellow
                    Write-Host "  Output: $stdout" -ForegroundColor Gray
                    return $null
                }
            }
            
            return $null
        } catch {
            Write-Host "  ⚠️  Node.js encryption failed: $_" -ForegroundColor Yellow
            return $null
        } finally {
            Remove-Item $tempScript -ErrorAction SilentlyContinue
        }
    }
    
    # Fallback: Try Python with pynacl if available
    $pythonAvailable = Get-Command python -ErrorAction SilentlyContinue
    
    if ($pythonAvailable) {
        # Create temporary Python script for encryption
        $pythonScript = @"
import base64
import json
import sys
try:
    from nacl import encoding
    from nacl.public import PublicKey, Box
    from nacl.utils import random
    
    # Decode public key
    public_key_bytes = base64.b64decode('$PublicKeyBase64')
    public_key = PublicKey(public_key_bytes)
    
    # Generate ephemeral key pair
    from nacl.public import PrivateKey
    ephemeral_private = PrivateKey.generate()
    ephemeral_public = ephemeral_private.public_key
    
    # Create box
    box = Box(ephemeral_private, public_key)
    
    # Encrypt message
    message = '$PlainText'.encode('utf-8')
    encrypted = box.encrypt(message)
    
    # Return base64 encoded encrypted message
    result = {
        'encrypted_value': base64.b64encode(encrypted).decode('utf-8'),
        'key_id': None
    }
    print(json.dumps(result))
except ImportError:
    print(json.dumps({'error': 'pynacl not installed. Install with: pip install pynacl'}))
    sys.exit(1)
except Exception as e:
    print(json.dumps({'error': str(e)}))
    sys.exit(1)
"@
        
        $tempScript = [System.IO.Path]::GetTempFileName() + ".py"
        $pythonScript | Out-File -FilePath $tempScript -Encoding UTF8
        
        try {
            $pythonOutput = python $tempScript 2>&1
            $result = $pythonOutput | ConvertFrom-Json
            
            if ($result.error) {
                Write-Host "  ⚠️  Python pynacl not installed" -ForegroundColor Yellow
                Write-Host "  Install with: pip install pynacl" -ForegroundColor Gray
                return $null
            }
            
            return $result
        } catch {
            Write-Host "  ⚠️  Python encryption failed: $_" -ForegroundColor Yellow
            return $null
        } finally {
            Remove-Item $tempScript -ErrorAction SilentlyContinue
        }
    }
    
    return $null
}

# Function to create or update secret via API
function Set-GitHubSecret {
    param(
        [string]$SecretName,
        [string]$SecretValue
    )
    
    Write-Host "Setting secret: $SecretName..." -ForegroundColor Yellow
    
    # Get public key for encryption
    try {
        $publicKeyResponse = Invoke-RestMethod -Uri "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/public-key" -Headers $headers
        $publicKey = $publicKeyResponse.key
        $keyId = $publicKeyResponse.key_id
        
        Write-Host "  ✅ Got public key (ID: $keyId)" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Failed to get public key: $_" -ForegroundColor Red
        return $false
    }
    
    # Encrypt the secret
    $encryptedResult = Encrypt-GitHubSecret -PlainText $SecretValue -PublicKeyBase64 $publicKey
    
    if (-not $encryptedResult -or $encryptedResult.error) {
        Write-Host "  ⚠️  Encryption failed. Trying alternative method..." -ForegroundColor Yellow
        
        # Alternative: Use GitHub CLI if available
        $ghAvailable = Get-Command gh -ErrorAction SilentlyContinue
        if ($ghAvailable) {
            Write-Host "  Using GitHub CLI as fallback..." -ForegroundColor Gray
            $env:GITHUB_TOKEN = $GITHUB_TOKEN
            $result = gh secret set $SecretName --repo "$REPO_OWNER/$REPO_NAME" --body $SecretValue 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "    ✅ $SecretName set successfully via CLI" -ForegroundColor Green
                return $true
            } else {
                Write-Host "    ❌ Failed: $result" -ForegroundColor Red
                return $false
            }
        } else {
            Write-Host "  ❌ Cannot encrypt secret. Please install:" -ForegroundColor Red
            Write-Host "     - Python with pynacl: pip install pynacl" -ForegroundColor Gray
            Write-Host "     - Or GitHub CLI: winget install --id GitHub.cli" -ForegroundColor Gray
            return $false
        }
    }
    
    # Send encrypted secret to GitHub API
    try {
        $body = @{
            encrypted_value = $encryptedResult.encrypted_value
            key_id = $keyId
        } | ConvertTo-Json
        
        $putHeaders = $headers.Clone()
        $putHeaders["Content-Type"] = "application/json"
        
        $response = Invoke-RestMethod -Uri "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/$SecretName" -Method Put -Headers $putHeaders -Body $body
        
        Write-Host "  ✅ $SecretName set successfully via API" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "  ❌ Failed to set secret via API: $_" -ForegroundColor Red
        if ($_.Exception.Response.StatusCode -eq 404) {
            Write-Host "     Note: Token may need 'admin:repo' scope" -ForegroundColor Yellow
        }
        return $false
    }
}

# Set secrets via API
Write-Host "Setting secrets via GitHub API..." -ForegroundColor Yellow
Write-Host ""

$successCount = 0

# Set CLOUDFLARE_API_TOKEN
if (Set-GitHubSecret -SecretName "CLOUDFLARE_API_TOKEN" -SecretValue $CloudflareApiToken) {
    $successCount++
}

Write-Host ""

# Set CLOUDFLARE_ACCOUNT_ID
if (Set-GitHubSecret -SecretName "CLOUDFLARE_ACCOUNT_ID" -SecretValue $CloudflareAccountId) {
    $successCount++
}

Write-Host ""

if ($successCount -eq 2) {
    Write-Host "✅ All secrets set successfully!" -ForegroundColor Green
} elseif ($successCount -eq 1) {
    Write-Host "⚠️  One secret was set, but one failed" -ForegroundColor Yellow
} else {
    Write-Host "❌ Failed to set secrets via API" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative options:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Option 1: Install Python with pynacl" -ForegroundColor Yellow
    Write-Host "  pip install pynacl" -ForegroundColor White
    Write-Host "  Then run this script again" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2: Install GitHub CLI" -ForegroundColor Yellow
    Write-Host "  winget install --id GitHub.cli" -ForegroundColor White
    Write-Host "  Then use: gh secret set CLOUDFLARE_API_TOKEN --repo $REPO_OWNER/$REPO_NAME" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 3: Set secrets manually" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions" -ForegroundColor White
    Write-Host "  2. Click 'New repository secret'" -ForegroundColor White
    Write-Host "  3. Name: CLOUDFLARE_API_TOKEN" -ForegroundColor White
    Write-Host "     Value: $CloudflareApiToken" -ForegroundColor Gray
    Write-Host "  4. Click 'New repository secret' again" -ForegroundColor White
    Write-Host "  5. Name: CLOUDFLARE_ACCOUNT_ID" -ForegroundColor White
    Write-Host "     Value: $CloudflareAccountId" -ForegroundColor Gray
    Write-Host ""
}

# Verify secrets
Write-Host ""
Write-Host "Verifying secrets..." -ForegroundColor Yellow
try {
    $secrets = Invoke-RestMethod -Uri "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/actions/secrets" -Headers $headers
    Write-Host "  Total secrets: $($secrets.total_count)" -ForegroundColor Gray
    if ($secrets.secrets) {
        foreach ($secret in $secrets.secrets) {
            Write-Host "    - $($secret.name) (updated: $($secret.updated_at))" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "  ⚠️  Could not verify secrets: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "After secrets are set, GitHub Actions will automatically deploy on push to main" -ForegroundColor White
Write-Host "Test by pushing a commit or manually triggering the workflow" -ForegroundColor Gray
