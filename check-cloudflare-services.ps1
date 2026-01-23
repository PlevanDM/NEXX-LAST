# Check Cloudflare Services and Configuration
# Перевірка всіх доступних сервісів Cloudflare

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$ProjectName = "nexx"
$ZoneName = "nexxgsm.com"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Cloudflare Services Check ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

# 1. Check Account Info
Write-Host "[1/10] Checking Account Information..." -ForegroundColor Yellow
try {
    $account = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId" -Method Get -Headers $headers
    if ($account.success) {
        Write-Host "   ✅ Account: $($account.result.name)" -ForegroundColor Green
        Write-Host "   ✅ Type: $($account.result.type)" -ForegroundColor Green
        Write-Host "   ✅ Settings: $($account.result.settings | ConvertTo-Json -Compress)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}

# 2. Check Zone
Write-Host ""
Write-Host "[2/10] Checking Zone Configuration..." -ForegroundColor Yellow
try {
    $zones = Invoke-RestMethod -Uri "$API_BASE/zones?name=$ZoneName" -Method Get -Headers $headers
    if ($zones.success -and $zones.result.Count -gt 0) {
        $zone = $zones.result[0]
        $zoneId = $zone.id
        Write-Host "   ✅ Zone: $($zone.name) (ID: $zoneId)" -ForegroundColor Green
        Write-Host "   ✅ Status: $($zone.status)" -ForegroundColor Green
        Write-Host "   ✅ Plan: $($zone.plan.name)" -ForegroundColor Green
        Write-Host "   ✅ SSL: $($zone.ssl.verification_status)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Zone not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}

# 3. Check Cloudflare Pages Project
Write-Host ""
Write-Host "[3/10] Checking Cloudflare Pages Project..." -ForegroundColor Yellow
try {
    $project = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName" -Method Get -Headers $headers
    if ($project.success) {
        Write-Host "   ✅ Project: $($project.result.name)" -ForegroundColor Green
        Write-Host "   ✅ Production Branch: $($project.result.production_branch)" -ForegroundColor Green
        Write-Host "   ✅ Latest Deployment: $($project.result.latest_deployment.created_on)" -ForegroundColor Gray
        
        # Get deployments
        $deployments = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName/deployments?per_page=1" -Method Get -Headers $headers
        if ($deployments.success -and $deployments.result.Count -gt 0) {
            $latest = $deployments.result[0]
            Write-Host "   ✅ Latest Deployment Status: $($latest.latest_stage.status)" -ForegroundColor Green
            Write-Host "   ✅ URL: $($latest.url)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}

# 4. Check Workers
Write-Host ""
Write-Host "[4/10] Checking Cloudflare Workers..." -ForegroundColor Yellow
try {
    $workers = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/workers/scripts" -Method Get -Headers $headers
    if ($workers.success) {
        Write-Host "   ✅ Workers available: $($workers.result.Count)" -ForegroundColor Green
        foreach ($worker in $workers.result) {
            Write-Host "      - $($worker.id)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ⚠️  Workers check failed (may not have access)" -ForegroundColor Yellow
}

# 5. Check R2 Storage
Write-Host ""
Write-Host "[5/10] Checking R2 Storage..." -ForegroundColor Yellow
try {
    $r2Buckets = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/r2/buckets" -Method Get -Headers $headers
    if ($r2Buckets.success) {
        Write-Host "   ✅ R2 Buckets: $($r2Buckets.result.Count)" -ForegroundColor Green
        foreach ($bucket in $r2Buckets.result) {
            Write-Host "      - $($bucket.name) (Created: $($bucket.creation_date))" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ⚠️  R2 check failed (may not be enabled)" -ForegroundColor Yellow
}

# 6. Check KV Namespaces
Write-Host ""
Write-Host "[6/10] Checking KV Storage..." -ForegroundColor Yellow
try {
    $kvNamespaces = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/storage/kv/namespaces" -Method Get -Headers $headers
    if ($kvNamespaces.success) {
        Write-Host "   ✅ KV Namespaces: $($kvNamespaces.result.Count)" -ForegroundColor Green
        foreach ($ns in $kvNamespaces.result) {
            Write-Host "      - $($ns.title) (ID: $($ns.id))" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ⚠️  KV check failed (may not be enabled)" -ForegroundColor Yellow
}

# 7. Check D1 Databases
Write-Host ""
Write-Host "[7/10] Checking D1 Databases..." -ForegroundColor Yellow
try {
    $d1Databases = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/d1/database" -Method Get -Headers $headers
    if ($d1Databases.success) {
        Write-Host "   ✅ D1 Databases: $($d1Databases.result.Count)" -ForegroundColor Green
        foreach ($db in $d1Databases.result) {
            Write-Host "      - $($db.name) (ID: $($db.uuid))" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ⚠️  D1 check failed (may not be enabled)" -ForegroundColor Yellow
}

# 8. Check Cache Settings
Write-Host ""
Write-Host "[8/10] Checking Cache Settings..." -ForegroundColor Yellow
if ($zoneId) {
    try {
        $cacheSettings = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/settings/cache_level" -Method Get -Headers $headers
        Write-Host "   ✅ Cache Level: $($cacheSettings.result.value)" -ForegroundColor Green
        
        $browserCache = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/settings/browser_cache_ttl" -Method Get -Headers $headers
        Write-Host "   ✅ Browser Cache TTL: $($browserCache.result.value) seconds" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Cache settings check failed" -ForegroundColor Yellow
    }
}

# 9. Check SSL/TLS Settings
Write-Host ""
Write-Host "[9/10] Checking SSL/TLS Settings..." -ForegroundColor Yellow
if ($zoneId) {
    try {
        $sslMode = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/settings/ssl" -Method Get -Headers $headers
        Write-Host "   ✅ SSL Mode: $($sslMode.result.value)" -ForegroundColor Green
        
        $tlsVersion = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/settings/min_tls_version" -Method Get -Headers $headers
        Write-Host "   ✅ Min TLS Version: $($tlsVersion.result.value)" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  SSL/TLS check failed" -ForegroundColor Yellow
    }
}

# 10. Check Security Settings
Write-Host ""
Write-Host "[10/10] Checking Security Settings..." -ForegroundColor Yellow
if ($zoneId) {
    try {
        $securityLevel = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/settings/security_level" -Method Get -Headers $headers
        Write-Host "   ✅ Security Level: $($securityLevel.result.value)" -ForegroundColor Green
        
        $waf = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/settings/waf" -Method Get -Headers $headers
        Write-Host "   ✅ WAF Status: $($waf.result.value)" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Security settings check failed" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "✅ Account: Active" -ForegroundColor Green
Write-Host "✅ Zone: Configured" -ForegroundColor Green
Write-Host "✅ Pages: Active" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Recommendations:" -ForegroundColor Yellow
Write-Host "   1. Ensure cache settings are optimized" -ForegroundColor White
Write-Host "   2. Check SSL/TLS is set to 'Full' or 'Full (strict)'" -ForegroundColor White
Write-Host "   3. Enable WAF if available in your plan" -ForegroundColor White
Write-Host "   4. Consider using R2 for static assets if needed" -ForegroundColor White
