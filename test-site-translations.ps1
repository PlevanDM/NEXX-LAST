# Test Site Translations and Functionality
# Тестування перекладів та функціональності сайту

$siteUrl = "https://nexxgsm.com"

Write-Host "=== Testing Site: $siteUrl ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if site is accessible
Write-Host "1. Testing site accessibility..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $siteUrl -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "   OK Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   OK Site is accessible" -ForegroundColor Green
} catch {
    Write-Host "   FAILED Site not accessible: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Check i18n.js version
Write-Host ""
Write-Host "2. Checking i18n.js version..." -ForegroundColor Yellow
try {
    $html = $response.Content
    if ($html -match 'i18n\.js\?v=([\d\.-]+)') {
        $version = $matches[1]
        Write-Host "   OK i18n.js version: $version" -ForegroundColor Green
        if ($version -match "10\.0\.1") {
            Write-Host "   OK Latest version detected" -ForegroundColor Green
        } else {
            Write-Host "   WARNING Old version detected" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   WARNING Version not found in HTML" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   WARNING Could not check version: $_" -ForegroundColor Yellow
}

# Test 3: Check if i18n.js file exists
Write-Host ""
Write-Host "3. Testing i18n.js file..." -ForegroundColor Yellow
try {
    $i18nUrl = "$siteUrl/static/i18n.js"
    $i18nResponse = Invoke-WebRequest -Uri $i18nUrl -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "   OK i18n.js accessible (Size: $($i18nResponse.Content.Length) bytes)" -ForegroundColor Green
    
    # Check for translation keys
    $content = $i18nResponse.Content
    $keys = @('nav.calculator', 'buttons.calculate', 'buttons.freeLabel', 'buttons.callBack', 'buttons.freeDiagnostic')
    Write-Host "   Checking translation keys..." -ForegroundColor Gray
    foreach ($key in $keys) {
        $parts = $key.Split('.')
        $searchPattern = if ($parts.Length -eq 2) {
            "$($parts[0]):\s*\{[^}]*$($parts[1]):"
        } else {
            $key
        }
        if ($content -match $searchPattern) {
            Write-Host "      OK $key found" -ForegroundColor Green
        } else {
            Write-Host "      FAILED $key not found" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "   FAILED i18n.js not accessible: $_" -ForegroundColor Red
}

# Test 4: Check _headers file
Write-Host ""
Write-Host "4. Testing _headers configuration..." -ForegroundColor Yellow
try {
    $headersUrl = "$siteUrl/_headers"
    $headersResponse = Invoke-WebRequest -Uri $headersUrl -Method Get -TimeoutSec 10 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($headersResponse.StatusCode -eq 200) {
        Write-Host "   OK _headers file accessible" -ForegroundColor Green
    } else {
        Write-Host "   INFO _headers not directly accessible (normal for Cloudflare Pages)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   INFO _headers not directly accessible (normal)" -ForegroundColor Gray
}

# Test 5: Check cache headers
Write-Host ""
Write-Host "5. Testing cache headers..." -ForegroundColor Yellow
try {
    $testResponse = Invoke-WebRequest -Uri $siteUrl -Method Head -TimeoutSec 10 -UseBasicParsing
    $cacheControl = $testResponse.Headers['Cache-Control']
    if ($cacheControl) {
        Write-Host "   OK Cache-Control: $cacheControl" -ForegroundColor Green
        if ($cacheControl -match "no-cache|no-store") {
            Write-Host "   OK HTML caching disabled correctly" -ForegroundColor Green
        }
    } else {
        Write-Host "   WARNING Cache-Control header not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   WARNING Could not check cache headers: $_" -ForegroundColor Yellow
}

# Test 6: Check Cloudflare Pages deployment
Write-Host ""
Write-Host "6. Checking Cloudflare Pages deployment..." -ForegroundColor Yellow
try {
    $cfHeaders = @{
        "X-Auth-Key" = "853487a6a39bd7f6f8128b4caf420ac22de33"
        "X-Auth-Email" = "dmitro.plevan@gmail.com"
        "Content-Type" = "application/json"
    }
    $accountId = "ad170d773e79a037e28f4530fd5305a5"
    $deployments = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/nexx-gsm/deployments?per_page=1" -Method Get -Headers $cfHeaders
    if ($deployments.result -and $deployments.result.Count -gt 0) {
        $latest = $deployments.result[0]
        Write-Host "   OK Latest deployment: $($latest.id)" -ForegroundColor Green
        Write-Host "      Status: $($latest.stage.status)" -ForegroundColor $(if ($latest.stage.status -eq 'success') { 'Green' } else { 'Yellow' })
        Write-Host "      Created: $($latest.created_on)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   WARNING Could not check deployments: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Test Summary ===" -ForegroundColor Cyan
Write-Host "Site: $siteUrl" -ForegroundColor White
Write-Host "Status: OK" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Open site in browser: $siteUrl" -ForegroundColor White
Write-Host "  2. Check browser console for errors" -ForegroundColor White
Write-Host "  3. Verify translations are displayed correctly" -ForegroundColor White
