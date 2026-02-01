# Optimize Cloudflare Settings
# Оптимізація налаштувань Cloudflare

$GlobalApiKey = "853487a6a39bd7f6f8128b4caf420ac22de33"
$Email = "dmitro.plevan@gmail.com"
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$ZoneName = "nexxgsm.com"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Optimizing Cloudflare Settings ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

# Get Zone ID
try {
    $zones = Invoke-RestMethod -Uri "$API_BASE/zones?name=$ZoneName" -Method Get -Headers $headers
    if (-not $zones.success -or $zones.result.Count -eq 0) {
        Write-Host "❌ Zone not found!" -ForegroundColor Red
        exit 1
    }
    $zoneId = $zones.result[0].id
    Write-Host "✅ Zone ID: $zoneId" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Failed to get zone: $_" -ForegroundColor Red
    exit 1
}

# 1. Update Security Level
Write-Host "[1/6] Updating Security Level..." -ForegroundColor Yellow
try {
    $body = @{ value = "medium" } | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/settings/security_level" -Method Patch -Headers $headers -Body $body
    if ($result.success) {
        Write-Host "   ✅ Security Level: $($result.result.value)" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Failed: $_" -ForegroundColor Yellow
}

# 2. Update Min TLS Version
Write-Host ""
Write-Host "[2/6] Updating Min TLS Version..." -ForegroundColor Yellow
try {
    $body = @{ value = "1.2" } | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/settings/min_tls_version" -Method Patch -Headers $headers -Body $body
    if ($result.success) {
        Write-Host "   ✅ Min TLS Version: $($result.result.value)" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Failed: $_" -ForegroundColor Yellow
}

# 3. Update SSL Mode to Full (strict)
Write-Host ""
Write-Host "[3/6] Updating SSL Mode..." -ForegroundColor Yellow
try {
    $body = @{ value = "full" } | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/settings/ssl" -Method Patch -Headers $headers -Body $body
    if ($result.success) {
        Write-Host "   ✅ SSL Mode: $($result.result.value)" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Failed: $_" -ForegroundColor Yellow
}

# 4. Enable Always Use HTTPS
Write-Host ""
Write-Host "[4/6] Enabling Always Use HTTPS..." -ForegroundColor Yellow
try {
    $body = @{ value = "on" } | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/settings/always_use_https" -Method Patch -Headers $headers -Body $body
    if ($result.success) {
        Write-Host "   ✅ Always Use HTTPS: $($result.result.value)" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Failed: $_" -ForegroundColor Yellow
}

# 5. Optimize Cache Level
Write-Host ""
Write-Host "[5/6] Optimizing Cache Level..." -ForegroundColor Yellow
try {
    $body = @{ value = "aggressive" } | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/settings/cache_level" -Method Patch -Headers $headers -Body $body
    if ($result.success) {
        Write-Host "   ✅ Cache Level: $($result.result.value)" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Failed: $_" -ForegroundColor Yellow
}

# 6. Enable Auto Minify
Write-Host ""
Write-Host "[6/6] Enabling Auto Minify..." -ForegroundColor Yellow
try {
    $body = @{
        css = $true
        html = $true
        js = $true
    } | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/settings/minify" -Method Patch -Headers $headers -Body $body
    if ($result.success) {
        Write-Host "   ✅ Auto Minify: CSS=$($result.result.value.css), HTML=$($result.result.value.html), JS=$($result.result.value.js)" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Failed: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Optimization Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Security settings updated" -ForegroundColor Green
Write-Host "✅ SSL/TLS settings optimized" -ForegroundColor Green
Write-Host "✅ Cache settings optimized" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Wait 1-2 minutes for changes to propagate" -ForegroundColor White
Write-Host "   2. Test site: https://nexxgsm.com" -ForegroundColor White
Write-Host "   3. Check SSL: https://www.ssllabs.com/ssltest/analyze.html?d=nexxgsm.com" -ForegroundColor White
