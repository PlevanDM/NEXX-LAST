# Deploy via Wrangler with Global API Key as Token
# Спробує використати Global API Key як API Token

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$ProjectName = "nexx"

Write-Host "=== Deploy via Wrangler (Auto) ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build
Write-Host "[1/3] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Build completed!" -ForegroundColor Green

# Step 2: Try wrangler with Global API Key as token
Write-Host "[2/3] Setting up wrangler..." -ForegroundColor Yellow

# Set environment variables
$env:CLOUDFLARE_API_TOKEN = $GlobalApiKey
$env:CLOUDFLARE_EMAIL = $Email

Write-Host "  Using Global API Key as API Token..." -ForegroundColor Gray

# Step 3: Deploy
Write-Host "[3/3] Deploying to Cloudflare Pages..." -ForegroundColor Yellow
Write-Host "  This may fail if Global API Key doesn't work as API Token" -ForegroundColor Gray
Write-Host "  If it fails, you'll need to use 'wrangler login' manually" -ForegroundColor Gray
Write-Host ""

wrangler pages deploy dist --project-name $ProjectName

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== ✅ DEPLOYMENT SUCCESSFUL ===" -ForegroundColor Green
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
    Write-Host "=== ❌ DEPLOYMENT FAILED ===" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Alternative solutions:" -ForegroundColor Yellow
    Write-Host "  1. Run 'wrangler login' manually (opens browser)" -ForegroundColor White
    Write-Host "  2. Then run: wrangler pages deploy dist --project-name nexx" -ForegroundColor White
    Write-Host "  3. Or use Dashboard upload: https://dash.cloudflare.com/" -ForegroundColor White
    Write-Host "     Pages → nexx → Upload assets" -ForegroundColor Gray
}

# Cleanup
Remove-Item Env:CLOUDFLARE_API_TOKEN -ErrorAction SilentlyContinue
Remove-Item Env:CLOUDFLARE_EMAIL -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
