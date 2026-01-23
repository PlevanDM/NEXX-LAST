# Quick deploy script
$env:CLOUDFLARE_API_TOKEN = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$env:CLOUDFLARE_EMAIL = "dmitro.plevan@gmail.com"

Write-Host "Building project..." -ForegroundColor Yellow
npm run build

Write-Host "Deploying to Cloudflare Pages..." -ForegroundColor Yellow
Write-Host "Note: If this fails, try: wrangler login" -ForegroundColor Cyan
wrangler pages deploy dist --project-name nexx
