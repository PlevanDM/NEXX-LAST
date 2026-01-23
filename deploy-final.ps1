# Final Deployment Script
# Tries multiple methods

Write-Host "=== NEXX WebApp Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Check if wrangler is authenticated
Write-Host "[1/3] Checking authentication..." -ForegroundColor Yellow
$whoami = wrangler whoami 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Authenticated!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "[2/3] Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✅ Build completed!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "[3/3] Deploying to Cloudflare Pages..." -ForegroundColor Yellow
    wrangler pages deploy dist --project-name nexx
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "=== ✅ DEPLOYMENT SUCCESSFUL ===" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Production URL: https://nexxgsm.com/" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "💡 Next steps:" -ForegroundColor Yellow
        Write-Host "  1. Clear browser cache (Ctrl+Shift+Delete)" -ForegroundColor White
        Write-Host "  2. Hard refresh (Ctrl+F5)" -ForegroundColor White
        Write-Host "  3. Check in incognito mode" -ForegroundColor White
    } else {
        Write-Host "  ❌ Deployment failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  ⚠️  Not authenticated" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please authenticate first:" -ForegroundColor Cyan
    Write-Host "  1. Run: wrangler login" -ForegroundColor White
    Write-Host "  2. Then run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use manual upload:" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://dash.cloudflare.com/" -ForegroundColor White
    Write-Host "  2. Pages → nexx → Upload assets" -ForegroundColor White
    Write-Host "  3. Upload dist/ folder" -ForegroundColor White
    exit 1
}
