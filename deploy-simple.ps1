# Simple Deployment - Manual Upload Instructions

Write-Host "=== NEXX WebApp Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Build
Write-Host "Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Build completed!" -ForegroundColor Green
Write-Host ""

# Create ZIP for manual upload
Write-Host "Creating ZIP archive for upload..." -ForegroundColor Yellow
$distPath = Resolve-Path "dist"
$zipPath = Join-Path $PWD "nexx-deploy.zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $zipPath)

$zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host "ZIP created: $zipPath ($zipSize MB)" -ForegroundColor Green
Write-Host ""

Write-Host "=== Manual Upload Instructions ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open Cloudflare Dashboard:" -ForegroundColor Yellow
Write-Host "   https://dash.cloudflare.com/" -ForegroundColor White
Write-Host ""
Write-Host "2. Go to Pages → nexx project" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Click 'Upload assets' button" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Upload this file:" -ForegroundColor Yellow
Write-Host "   $zipPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Wait for deployment to complete" -ForegroundColor Yellow
Write-Host ""
Write-Host "6. Check your site:" -ForegroundColor Yellow
Write-Host "   https://nexxgsm.com/" -ForegroundColor Cyan
Write-Host ""
Write-Host "=== Alternative: Use Wrangler Login ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "In a new terminal window, run:" -ForegroundColor Yellow
Write-Host "  wrangler login" -ForegroundColor White
Write-Host "  wrangler pages deploy dist --project-name nexx" -ForegroundColor White
Write-Host ""
