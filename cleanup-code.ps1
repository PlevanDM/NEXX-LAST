# ================================
# NEXX Code Cleanup Script 2026
# Removes duplicates, old files, and optimizes
# ================================

param(
    [switch]$DryRun,
    [switch]$SkipBackup
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   NEXX Code Cleanup 2026" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "[DRY RUN MODE] No files will be deleted" -ForegroundColor Yellow
    Write-Host ""
}

# ================================
# BACKUP
# ================================

if (-not $SkipBackup -and -not $DryRun) {
    Write-Host "[INFO] Creating backup..." -ForegroundColor Cyan
    $backupDir = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    # Backup important files
    Copy-Item "public\static" -Destination "$backupDir\static" -Recurse -Force
    Write-Host "[OK] Backup created: $backupDir" -ForegroundColor Green
    Write-Host ""
}

# ================================
# 1. REMOVE DUPLICATE .js FILES
# ================================

Write-Host "1. Removing duplicate .js files (keeping .min.js)..." -ForegroundColor Yellow

$jsFiles = Get-ChildItem "public\static\*.js" -File | Where-Object { 
    $_.Name -notlike "*.min.js" -and 
    $_.Name -ne "vendor" -and
    (Test-Path "public\static\$($_.BaseName).min.js")
}

$deletedCount = 0
foreach ($file in $jsFiles) {
    $minFile = "public\static\$($file.BaseName).min.js"
    if (Test-Path $minFile) {
        $size = [math]::Round($file.Length / 1KB, 1)
        Write-Host "   [DELETE] $($file.Name) ($size KB)" -ForegroundColor Gray
        
        if (-not $DryRun) {
            Remove-Item $file.FullName -Force
            $deletedCount++
        }
    }
}

Write-Host "   [OK] Removed $deletedCount duplicate files" -ForegroundColor Green
Write-Host ""

# ================================
# 2. REMOVE OLD DEPLOY SCRIPTS
# ================================

Write-Host "2. Removing old deploy scripts..." -ForegroundColor Yellow

$oldScripts = @(
    "deploy.ps1",
    "deploy-simple.ps1", 
    "deploy-cloudflare.ps1",
    "deploy-via-api-2026.ps1",
    "setup-cloudflare-complete.ps1",
    "setup-cloudflare-complete-2026.ps1",
    "setup-cloudflare-deploy-2026.ps1",
    "setup-cloudflare-env-vars.ps1",
    "setup-git-ssh.ps1",
    "publish.ps1",
    "update.ps1",
    "sync.ps1",
    "check-deployment.ps1",
    "auto-setup-github-secrets.ps1"
)

$deletedScripts = 0
foreach ($script in $oldScripts) {
    if (Test-Path $script) {
        Write-Host "   [DELETE] $script" -ForegroundColor Gray
        
        if (-not $DryRun) {
            Remove-Item $script -Force
            $deletedScripts++
        }
    }
}

Write-Host "   [OK] Removed $deletedScripts old scripts" -ForegroundColor Green
Write-Host ""

# ================================
# 3. REMOVE TEST/UNUSED FILES
# ================================

Write-Host "3. Removing test and unused files..." -ForegroundColor Yellow

$unusedFiles = @(
    "public\test-auth.html",
    "vectors.db-shm",
    "vectors.db-wal",
    "test-cloudflare-api.js"
)

$deletedUnused = 0
foreach ($file in $unusedFiles) {
    if (Test-Path $file) {
        Write-Host "   [DELETE] $file" -ForegroundColor Gray
        
        if (-not $DryRun) {
            Remove-Item $file -Force
            $deletedUnused++
        }
    }
}

Write-Host "   [OK] Removed $deletedUnused unused files" -ForegroundColor Green
Write-Host ""

# ================================
# 4. REMOVE DUPLICATE LOGOS
# ================================

Write-Host "4. Checking duplicate logo files..." -ForegroundColor Yellow

$logoFiles = Get-ChildItem "public\static" -Filter "nexx-logo*" -File
Write-Host "   Found $($logoFiles.Count) logo files:" -ForegroundColor Cyan

$logoSizes = @{}
foreach ($logo in $logoFiles) {
    $sizeKB = [math]::Round($logo.Length / 1KB, 1)
    $logoSizes[$logo.Name] = $sizeKB
    
    $color = "White"
    if ($sizeKB -gt 500) {
        $color = "Red"
    } elseif ($sizeKB -gt 100) {
        $color = "Yellow"
    }
    
    Write-Host "   - $($logo.Name): $sizeKB KB" -ForegroundColor $color
}

# Keep only essential logos
$keepLogos = @(
    "nexx-logo.png",           # Main logo (small)
    "nexx-logo.svg",           # SVG version
    "favicon.ico"              # Favicon
)

$deletedLogos = 0
foreach ($logo in $logoFiles) {
    if ($logo.Name -notin $keepLogos -and $logo.Length -gt 100KB) {
        Write-Host "   [DELETE] $($logo.Name) (too large)" -ForegroundColor Gray
        
        if (-not $DryRun) {
            # Uncomment to actually delete
            # Remove-Item $logo.FullName -Force
            # $deletedLogos++
        }
    }
}

Write-Host "   [INFO] Large logos can be optimized/removed manually" -ForegroundColor Yellow
Write-Host ""

# ================================
# 5. REMOVE OLD DOCUMENTATION
# ================================

Write-Host "5. Cleaning old documentation..." -ForegroundColor Yellow

$oldDocs = Get-ChildItem "*.md" -File | Where-Object {
    $_.Name -match "(AUDIT|CLEANUP|SESSION|WORK-COMPLETE|TODO|IMPLEMENTATION|TESTING|TRANSLATION|VERIFY|CHANGELOG)"
}

if ($oldDocs.Count -gt 0) {
    Write-Host "   Found $($oldDocs.Count) old doc files (moving to archive)" -ForegroundColor Cyan
    
    if (-not $DryRun) {
        $archiveDir = "docs-archive"
        if (-not (Test-Path $archiveDir)) {
            New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null
        }
        
        foreach ($doc in $oldDocs) {
            Write-Host "   [MOVE] $($doc.Name) -> docs-archive/" -ForegroundColor Gray
            Move-Item $doc.FullName -Destination $archiveDir -Force
        }
    }
}

Write-Host "   [OK] Documentation organized" -ForegroundColor Green
Write-Host ""

# ================================
# SUMMARY
# ================================

Write-Host "========================================" -ForegroundColor Green
Write-Host "   CLEANUP SUMMARY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN - No files were deleted" -ForegroundColor Yellow
    Write-Host "Run without -DryRun to actually clean up" -ForegroundColor Yellow
} else {
    Write-Host "Files removed:" -ForegroundColor Cyan
    Write-Host "  - Duplicate .js: $deletedCount" -ForegroundColor White
    Write-Host "  - Old scripts: $deletedScripts" -ForegroundColor White
    Write-Host "  - Unused files: $deletedUnused" -ForegroundColor White
    Write-Host "  - Docs archived: $($oldDocs.Count)" -ForegroundColor White
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review changes" -ForegroundColor White
Write-Host "  2. Test site locally: npm run dev" -ForegroundColor White
Write-Host "  3. Deploy if OK: .\deploy-2026.ps1" -ForegroundColor White
Write-Host ""

Write-Host "[OK] Cleanup complete!" -ForegroundColor Green
Write-Host ""
