# ================================
# NEXX Cloudflare Deploy Script 2026
# Единственный продакшен: nexx-gsm (branch main). Домен: nexxgsm.com
# ================================

param(
    [switch]$SkipBuild,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

# Colors
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   NEXX Cloudflare Deploy 2026         " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ================================
# 1. Check Environment
# ================================

Write-Info "Checking environment..."

# Load .env if exists
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
    Write-Success ".env loaded"
}

# Check required tools
$tools = @("node", "npm", "wrangler")
foreach ($tool in $tools) {
    try {
        $version = & $tool --version 2>$null
        Write-Success "$tool installed: $version"
    } catch {
        Write-Error "$tool not found. Please install it."
        exit 1
    }
}

# ================================
# 2. Check Cloudflare Auth
# ================================

Write-Info "Checking Cloudflare authentication..."

try {
    $whoami = wrangler whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Cloudflare authenticated"
    } else {
        Write-Warning "Not authenticated. Logging in..."
        wrangler login
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to authenticate with Cloudflare"
            exit 1
        }
    }
} catch {
    Write-Error "Failed to check Cloudflare auth: $_"
    exit 1
}

# ================================
# 3. Build Project
# ================================

if (-not $SkipBuild) {
    Write-Info "Building project..."
    
    # Clean dist
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
        Write-Success "Cleaned dist folder"
    }
    
    # Install dependencies
    Write-Info "Installing dependencies..."
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm install failed"
        exit 1
    }
    Write-Success "Dependencies installed"
    
    # Build
    Write-Info "Building with Vite..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed"
        exit 1
    }
    Write-Success "Build completed"
    
    # Verify build
    if (-not (Test-Path "dist/index.html")) {
        Write-Error "Build output missing: dist/index.html not found"
        exit 1
    }
    Write-Success "Build verified"
} else {
    Write-Warning "Skipping build (using existing dist folder)"
}

# ================================
# 4. Deploy to Cloudflare Pages
# ================================

Write-Info "Deploying to Cloudflare Pages..."

if ($Force) {
    Write-Warning "Force deployment enabled"
}

Write-Host ""
Write-Host "Running: wrangler pages deploy dist --project-name=nexx-gsm --branch=main" -ForegroundColor Gray
Write-Host ""

try {
    & wrangler pages deploy dist --project-name=nexx-gsm --branch=main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Success "Deployment successful!"
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "   Site URL: https://nexxgsm.com/" -ForegroundColor Cyan
        Write-Host "   Database: https://nexxgsm.com/nexx" -ForegroundColor Cyan
        Write-Host "   Dashboard: https://dash.cloudflare.com/" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        
        # Cache purge
        $purgeChoice = Read-Host "Purge Cloudflare cache? (y/N)"
        if ($purgeChoice -eq 'y' -or $purgeChoice -eq 'Y') {
            Write-Info "Purging cache..."
            
            $apiKey = $env:CLOUDFLARE_API_KEY
            $email = $env:CLOUDFLARE_EMAIL
            $zoneId = $env:CLOUDFLARE_ZONE_ID
            
            if ($apiKey -and $email -and $zoneId) {
                $headers = @{
                    "X-Auth-Email" = $email
                    "X-Auth-Key" = $apiKey
                    "Content-Type" = "application/json"
                }
                
                $body = @{
                    purge_everything = $true
                } | ConvertTo-Json
                
                try {
                    $response = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/purge_cache" -Method Post -Headers $headers -Body $body
                    if ($response.success) {
                        Write-Success "Cache purged successfully"
                    } else {
                        Write-Warning "Cache purge failed: $($response.errors)"
                    }
                } catch {
                    Write-Warning "Cache purge error: $_"
                }
            } else {
                Write-Warning "Missing Cloudflare credentials in .env"
            }
        }
        
    } else {
        Write-Error "Deployment failed with exit code $LASTEXITCODE"
        exit 1
    }
} catch {
    Write-Error "Deployment error: $_"
    exit 1
}

Write-Host ""
Write-Success "All done!"
Write-Host ""
