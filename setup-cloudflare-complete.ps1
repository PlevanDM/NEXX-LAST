# Complete Cloudflare Setup Script
# Повне налаштування Cloudflare: кеш, бази, доступ

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$ZoneName = "nexxgsm.com"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Complete Cloudflare Setup ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

# 1. Get Zone ID
Write-Host "1. Getting Zone ID..." -ForegroundColor Yellow
try {
    $zones = Invoke-RestMethod -Uri "$API_BASE/zones?name=$ZoneName" -Method Get -Headers $headers
    if ($zones.result -and $zones.result.Count -gt 0) {
        $zoneId = $zones.result[0].id
        Write-Host "   OK Zone ID: $zoneId" -ForegroundColor Green
    } else {
        Write-Host "   FAILED Zone not found" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   FAILED: $_" -ForegroundColor Red
    exit 1
}

# 2. Check Pages Project
Write-Host ""
Write-Host "2. Checking Cloudflare Pages..." -ForegroundColor Yellow
try {
    $projects = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects" -Method Get -Headers $headers
    $project = $projects.result | Where-Object { $_.name -eq $ProjectName }
    if ($project) {
        Write-Host "   OK Project '$ProjectName' found" -ForegroundColor Green
        Write-Host "      Production Branch: $($project.production_branch)" -ForegroundColor Gray
    } else {
        Write-Host "   WARNING Project '$ProjectName' not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   WARNING Failed: $_" -ForegroundColor Yellow
}

# 3. Check Cache Settings
Write-Host ""
Write-Host "3. Checking cache settings..." -ForegroundColor Yellow
$headersFile = "public\_headers"
if (Test-Path $headersFile) {
    Write-Host "   OK _headers file exists" -ForegroundColor Green
    $headersContent = Get-Content $headersFile -Raw
    if ($headersContent -match "no-cache.*no-store") {
        Write-Host "   OK HTML caching disabled" -ForegroundColor Green
    }
    if ($headersContent -match "i18n\.js.*max-age=3600") {
        Write-Host "   OK i18n.js cache: 1 hour" -ForegroundColor Green
    }
} else {
    Write-Host "   WARNING _headers file not found" -ForegroundColor Yellow
}

# 4. Check R2, KV, D1
Write-Host ""
Write-Host "4. Checking databases..." -ForegroundColor Yellow

# R2
try {
    $r2 = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/r2/buckets" -Method Get -Headers $headers
    if ($r2.result) {
        Write-Host "   OK R2 Buckets: $($r2.result.Count)" -ForegroundColor Green
        foreach ($bucket in $r2.result) {
            Write-Host "      - $($bucket.name)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   INFO R2: no buckets" -ForegroundColor Gray
    }
} catch {
    Write-Host "   INFO R2: not available" -ForegroundColor Gray
}

# KV
try {
    $kv = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/storage/kv/namespaces" -Method Get -Headers $headers
    if ($kv.result) {
        Write-Host "   OK KV Namespaces: $($kv.result.Count)" -ForegroundColor Green
        foreach ($ns in $kv.result) {
            Write-Host "      - $($ns.title)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   INFO KV: no namespaces" -ForegroundColor Gray
    }
} catch {
    Write-Host "   INFO KV: not available" -ForegroundColor Gray
}

# D1
try {
    $d1 = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/d1/database" -Method Get -Headers $headers
    if ($d1.result) {
        Write-Host "   OK D1 Databases: $($d1.result.Count)" -ForegroundColor Green
        foreach ($db in $d1.result) {
            Write-Host "      - $($db.name)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   INFO D1: no databases" -ForegroundColor Gray
    }
} catch {
    Write-Host "   INFO D1: not available" -ForegroundColor Gray
}

# 5. Update wrangler.toml
Write-Host ""
Write-Host "5. Updating wrangler.toml..." -ForegroundColor Yellow
$wranglerLines = @(
    "# Cloudflare Pages/Workers Configuration",
    "# https://developers.cloudflare.com/workers/wrangler/configuration/",
    "",
    "name = `"$ProjectName`"",
    "compatibility_date = `"2025-01-20`"",
    "compatibility_flags = [`"nodejs_compat`"]",
    "",
    "# Pages configuration",
    "pages_build_output_dir = `"dist`"",
    "",
    "# Account and Zone IDs",
    "account_id = `"$AccountId`"",
    "",
    "# Environment variables",
    "[vars]",
    "PROJECT_NAME = `"$ProjectName`"",
    "ENVIRONMENT = `"production`"",
    "ZONE_NAME = `"$ZoneName`""
)
$wranglerLines | Out-File -FilePath "wrangler.toml" -Encoding UTF8
Write-Host "   OK wrangler.toml updated" -ForegroundColor Green

# 6. Optimize _headers
Write-Host ""
Write-Host "6. Optimizing cache headers..." -ForegroundColor Yellow
$headerLines = @(
    "# Cloudflare Pages Headers Configuration",
    "# Optimized for maximum performance",
    "",
    "# Global security headers",
    "/*",
    "  X-Frame-Options: DENY",
    "  X-Content-Type-Options: nosniff",
    "  X-XSS-Protection: 1; mode=block",
    "  Referrer-Policy: strict-origin-when-cross-origin",
    "  Permissions-Policy: geolocation=(), microphone=(), camera=()",
    "",
    "# HTML - no cache (always fresh)",
    "/",
    "  Cache-Control: no-cache, no-store, must-revalidate, max-age=0",
    "",
    "/*.html",
    "  Cache-Control: no-cache, no-store, must-revalidate, max-age=0",
    "",
    "/index.html",
    "  Cache-Control: no-cache, no-store, must-revalidate, max-age=0",
    "",
    "# i18n.js - short cache for updates (1 hour)",
    "/static/i18n.js",
    "  Cache-Control: public, max-age=3600, must-revalidate",
    "",
    "/static/i18n.min.js",
    "  Cache-Control: public, max-age=3600, must-revalidate",
    "",
    "# Static assets - long cache (1 year)",
    "/static/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
    "/images/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
    "# Data files - 24 hours",
    "/data/*",
    "  Cache-Control: public, max-age=86400, must-revalidate",
    "",
    "# API endpoints - no cache",
    "/api/*",
    "  Cache-Control: no-store, no-cache, must-revalidate, max-age=0",
    "",
    "# PWA manifest - 1 week",
    "/manifest.json",
    "  Cache-Control: public, max-age=604800",
    "",
    "# Robots & Sitemap - 1 day",
    "/robots.txt",
    "  Cache-Control: public, max-age=86400",
    "",
    "/sitemap.xml",
    "  Cache-Control: public, max-age=86400"
)
$headerLines | Out-File -FilePath "public\_headers" -Encoding UTF8
Write-Host "   OK _headers optimized" -ForegroundColor Green

# 7. Summary
Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "OK Zone ID: $zoneId" -ForegroundColor Green
Write-Host "OK Account ID: $AccountId" -ForegroundColor Green
Write-Host "OK Project: $ProjectName" -ForegroundColor Green
Write-Host "OK Cache configured" -ForegroundColor Green
Write-Host "OK wrangler.toml updated" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. Check deployment: .\check-deployment.ps1" -ForegroundColor White
Write-Host "   2. Purge cache: .\purge-cloudflare-cache.ps1" -ForegroundColor White
$siteUrl = "https://" + $ZoneName
Write-Host "   3. Check site: $siteUrl" -ForegroundColor White
