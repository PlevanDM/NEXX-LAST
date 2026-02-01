# Purge Cloudflare Cache for nexxgsm.com
# Set CLOUDFLARE_GLOBAL_API_KEY and CLOUDFLARE_EMAIL in env, or use .env

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }
$envPath = Join-Path $root '.env'
if ((Test-Path $envPath) -and -not $env:CLOUDFLARE_GLOBAL_API_KEY) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^\s*CLOUDFLARE_GLOBAL_API_KEY\s*=\s*(.+)$') { $env:CLOUDFLARE_GLOBAL_API_KEY = $matches[1].Trim().Trim('"') }
        if ($_ -match '^\s*CLOUDFLARE_API_KEY\s*=\s*(.+)$' -and -not $env:CLOUDFLARE_GLOBAL_API_KEY) { $env:CLOUDFLARE_GLOBAL_API_KEY = $matches[1].Trim().Trim('"') }
        if ($_ -match '^\s*CLOUDFLARE_EMAIL\s*=\s*(.+)$') { $env:CLOUDFLARE_EMAIL = $matches[1].Trim().Trim('"') }
    }
}
$GlobalApiKey = if ($env:CLOUDFLARE_GLOBAL_API_KEY) { $env:CLOUDFLARE_GLOBAL_API_KEY } else { $env:CLOUDFLARE_API_KEY }
$Email = $env:CLOUDFLARE_EMAIL
if (-not $GlobalApiKey) {
    Write-Host "ERROR: Set CLOUDFLARE_GLOBAL_API_KEY in .env or environment" -ForegroundColor Red
    exit 1
}
if (-not $Email) { $Email = "dmitro.plevan@gmail.com" }

$ZoneName = "nexxgsm.com"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Cloudflare Cache Purge ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get Zone ID
Write-Host "[1/3] Getting Zone ID..." -ForegroundColor Yellow
$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

try {
    $zonesResponse = Invoke-RestMethod -Uri "$API_BASE/zones?name=$ZoneName" -Method Get -Headers $headers -ErrorAction Stop
    if (-not $zonesResponse.success -or $zonesResponse.result.Count -eq 0) {
        Write-Host "  ❌ Zone not found" -ForegroundColor Red
        exit 1
    }
    $zoneId = $zonesResponse.result[0].id
    Write-Host "  Zone ID: $zoneId" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Purge Everything
Write-Host "[2/3] Purging all cache..." -ForegroundColor Yellow
try {
    $purgeBody = @{
        purge_everything = $true
    } | ConvertTo-Json
    
    $purgeResponse = Invoke-RestMethod -Uri "$API_BASE/zones/$zoneId/purge_cache" -Method Post -Headers $headers -Body $purgeBody -ErrorAction Stop
    
    if ($purgeResponse.success) {
        Write-Host "  ✅ Cache purged successfully!" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Response: $($purgeResponse | ConvertTo-Json)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Verify
Write-Host "[3/3] Cache purge completed!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Wait 30-60 seconds for cache to clear" -ForegroundColor White
Write-Host "  2. Hard refresh browser (Ctrl+F5)" -ForegroundColor White
Write-Host "  3. Check site: https://nexxgsm.com/" -ForegroundColor White
Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
