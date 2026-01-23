# Deploy via Wrangler with API Token
# Використовує wrangler для деплою (більш надійний метод)

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$ProjectName = "nexx"

Write-Host "=== Deploy via Wrangler ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Wrangler requires API Token (not Global API Key)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Create API Token" -ForegroundColor Cyan
Write-Host "  1. Go to: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/" -ForegroundColor White
Write-Host "  2. Create token with 'Cloudflare Pages:Edit' permission" -ForegroundColor White
Write-Host "  3. Set environment variable:" -ForegroundColor White
Write-Host "     `$env:CLOUDFLARE_API_TOKEN = 'your-token-here'" -ForegroundColor Gray
Write-Host "  4. Run: wrangler pages deploy dist --project-name nexx" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Use Dashboard Upload" -ForegroundColor Cyan
Write-Host "  1. Go to: https://dash.cloudflare.com/" -ForegroundColor White
Write-Host "  2. Pages → nexx → Upload assets" -ForegroundColor White
Write-Host "  3. Upload dist/ folder or ZIP" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: Continue with API method (may not work)" -ForegroundColor Yellow
Write-Host "  .\deploy-global-api.ps1" -ForegroundColor White
Write-Host ""
Write-Host "=== Current Status ===" -ForegroundColor Cyan
Write-Host "  Latest deployment: 2026-01-22 16:06:53" -ForegroundColor Gray
Write-Host "  Production branch: main" -ForegroundColor Gray
Write-Host "  Production URL: https://nexxgsm.com/" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Recommended: Use Dashboard upload for reliable deployment" -ForegroundColor Yellow
