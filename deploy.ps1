# NEXX GSM - Auto-Deploy to Cloudflare Pages
# Domain: nexxgsm.com

Write-Host "🚀 NEXX GSM - Deployment Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean old build
Write-Host "1️⃣  Cleaning old build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
}
Write-Host "✅ Cleaned" -ForegroundColor Green
Write-Host ""

# Step 2: Build production
Write-Host "2️⃣  Building production version..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build completed" -ForegroundColor Green
Write-Host ""

# Step 3: Copy assets
Write-Host "3️⃣  Copying assets..." -ForegroundColor Yellow
npm run postbuild
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Asset copy failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Assets copied" -ForegroundColor Green
Write-Host ""

# Step 4: Copy photos to dist
Write-Host "4️⃣  Copying photos..." -ForegroundColor Yellow
$photosExist = $false
if (Test-Path "public\static\images\store-front.jpg") {
    if (!(Test-Path "dist\static\images")) {
        New-Item -ItemType Directory -Path "dist\static\images" -Force | Out-Null
    }
    Copy-Item "public\static\images\*.jpg" "dist\static\images\" -Force -ErrorAction SilentlyContinue
    $photosExist = $true
    Write-Host "✅ Photos copied" -ForegroundColor Green
} else {
    Write-Host "⚠️  No photos found in public\static\images\" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Validate dist folder
Write-Host "5️⃣  Validating dist folder..." -ForegroundColor Yellow
$requiredFiles = @("index.html", "nexx.html", "static\ui-components.js", "static\i18n.js")
$allExist = $true
foreach ($file in $requiredFiles) {
    if (!(Test-Path "dist\$file")) {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        $allExist = $false
    }
}
if ($allExist) {
    Write-Host "✅ All required files present" -ForegroundColor Green
} else {
    Write-Host "❌ Validation failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: Deploy to Cloudflare
Write-Host "6️⃣  Deploying to Cloudflare Pages..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Choose deployment method:" -ForegroundColor Cyan
Write-Host "1. Wrangler CLI (automatic)" -ForegroundColor White
Write-Host "2. Manual upload (open dashboard)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Deploying with Wrangler..." -ForegroundColor Yellow
    
    # Check if wrangler is installed
    $wranglerInstalled = Get-Command wrangler -ErrorAction SilentlyContinue
    if (!$wranglerInstalled) {
        Write-Host "Installing Wrangler..." -ForegroundColor Yellow
        npm install -g wrangler
    }
    
    # Deploy
    wrangler pages deploy dist --project-name=nexxgsm
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Deployed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Your site is live at:" -ForegroundColor Cyan
        Write-Host "   https://nexxgsm.com" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        exit 1
    }
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "📦 Build ready in dist/ folder" -ForegroundColor Green
    Write-Host ""
    Write-Host "Manual deployment steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://dash.cloudflare.com/" -ForegroundColor White
    Write-Host "2. Navigate to Pages - nexxgsm project" -ForegroundColor White
    Write-Host "3. Click Upload or Create deployment" -ForegroundColor White
    Write-Host "4. Upload the dist folder" -ForegroundColor White
    Write-Host ""
    
    # Open Cloudflare dashboard
    Start-Process "https://dash.cloudflare.com/ad170d773e79a037e28f4530fd5305a5/pages"
} else {
    Write-Host "Invalid choice" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✨ Deployment script completed!" -ForegroundColor Green
