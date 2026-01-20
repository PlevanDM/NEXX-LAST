# NEXX GSM - Simple Deploy Script

Write-Host "NEXX GSM - Deployment to nexxgsm.com"
Write-Host "====================================="
Write-Host ""

# Clean
Write-Host "Step 1: Cleaning old build..."
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
}
Write-Host "OK"
Write-Host ""

# Build
Write-Host "Step 2: Building production..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!"
    exit 1
}
Write-Host "OK"
Write-Host ""

# Validate
Write-Host "Step 3: Validating dist folder..."
if (!(Test-Path "dist/index.html")) {
    Write-Host "ERROR: dist/index.html not found!"
    exit 1
}
Write-Host "OK - dist folder ready"
Write-Host ""

# Deploy options
Write-Host "Step 4: Deploy options:"
Write-Host ""
Write-Host "Option 1: Wrangler CLI"
Write-Host "  Command: wrangler pages deploy dist --project-name=nexxgsm"
Write-Host ""
Write-Host "Option 2: Manual upload"
Write-Host "  1. Open: https://dash.cloudflare.com/ad170d773e79a037e28f4530fd5305a5/pages"
Write-Host "  2. Create project or upload to existing"
Write-Host "  3. Upload dist folder"
Write-Host ""

$deploy = Read-Host "Deploy now with Wrangler? (y/n)"

if ($deploy -eq "y") {
    Write-Host ""
    Write-Host "Deploying with Wrangler..."
    wrangler pages deploy dist --project-name=nexxgsm
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS! Site deployed!"
        Write-Host "URL: https://nexxgsm.com"
    } else {
        Write-Host "Wrangler failed. Please deploy manually."
        Start-Process "https://dash.cloudflare.com/ad170d773e79a037e28f4530fd5305a5/pages"
    }
} else {
    Write-Host "Opening Cloudflare Dashboard..."
    Start-Process "https://dash.cloudflare.com/ad170d773e79a037e28f4530fd5305a5/pages"
}

Write-Host ""
Write-Host "Deployment script completed!"
