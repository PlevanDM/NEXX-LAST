# Setup Cloudflare Cache Rules to bypass caching for JS/CSS files
# Based on forum solution

param(
    [string]$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc",
    [string]$Email = "dmitro.plevan@gmail.com",
    [string]$ZoneName = "nexxgsm.com"
)

$ErrorActionPreference = "Stop"

Write-Host "Setting up Cloudflare Cache Rules..." -ForegroundColor Cyan

# Get Zone ID
Write-Host "Getting Zone ID for $ZoneName..." -ForegroundColor Yellow
$zoneResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones?name=$ZoneName" -Method GET -Headers @{
    "X-Auth-Email" = $Email
    "X-Auth-Key" = $GlobalApiKey
    "Content-Type" = "application/json"
}

if (-not $zoneResponse.success -or $zoneResponse.result.Count -eq 0) {
    Write-Host "Failed to get zone ID" -ForegroundColor Red
    exit 1
}

$zoneId = $zoneResponse.result[0].id
Write-Host "Zone ID: $zoneId" -ForegroundColor Green

# Check existing cache rules
Write-Host "Checking existing cache rules..." -ForegroundColor Yellow
try {
    $existingRulesResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/cache/rules" -Method GET -Headers @{
        "X-Auth-Email" = $Email
        "X-Auth-Key" = $GlobalApiKey
        "Content-Type" = "application/json"
    }
    
    if (-not $existingRulesResponse.success) {
        Write-Host "API returned error: $($existingRulesResponse.errors | ConvertTo-Json)" -ForegroundColor Red
        Write-Host "Note: Cache Rules API might require a paid plan. Trying alternative approach..." -ForegroundColor Yellow
        Write-Host "We'll use aggressive cache purging instead and update service worker." -ForegroundColor Yellow
        exit 0
    }
} catch {
    Write-Host "Cache Rules API not available: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "This feature may require a paid Cloudflare plan." -ForegroundColor Yellow
    Write-Host "Alternative: We've updated the service worker to not cache JS/CSS files." -ForegroundColor Cyan
    exit 0
}

Write-Host "Found $($existingRulesResponse.result.Count) existing cache rules" -ForegroundColor Yellow

# Check if our rule already exists
$existingRule = $existingRulesResponse.result | Where-Object { $_.description -eq "NEXX: Bypass cache for JS/CSS files" }

$expression = '(http.request.uri.path matches "^/static/.*\.(js|css)$" or http.request.uri.path matches "^/static/.*\.min\.(js|css)$")'

if ($existingRule) {
    Write-Host "Cache rule already exists (ID: $($existingRule.id))" -ForegroundColor Yellow
    Write-Host "Updating existing rule..." -ForegroundColor Yellow
    
    $updateBodyObj = @{
        description = "NEXX: Bypass cache for JS/CSS files"
        expression = $expression
        action = @{
            cache = @{
                bypass = $true
            }
        }
    }
    $updateBody = $updateBodyObj | ConvertTo-Json -Depth 10
    
    $updateResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/cache/rules/$($existingRule.id)" -Method PUT -Headers @{
        "X-Auth-Email" = $Email
        "X-Auth-Key" = $GlobalApiKey
        "Content-Type" = "application/json"
    } -Body $updateBody
    
    if ($updateResponse.success) {
        Write-Host "Cache rule updated successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to update cache rule" -ForegroundColor Red
        Write-Host ($updateResponse | ConvertTo-Json -Depth 5) -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Creating new cache rule..." -ForegroundColor Yellow
    
    $createBodyObj = @{
        description = "NEXX: Bypass cache for JS/CSS files"
        expression = $expression
        action = @{
            cache = @{
                bypass = $true
            }
        }
    }
    $createBody = $createBodyObj | ConvertTo-Json -Depth 10
    
    $createResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/cache/rules" -Method POST -Headers @{
        "X-Auth-Email" = $Email
        "X-Auth-Key" = $GlobalApiKey
        "Content-Type" = "application/json"
    } -Body $createBody
    
    if ($createResponse.success) {
        Write-Host "Cache rule created successfully!" -ForegroundColor Green
        Write-Host "Rule ID: $($createResponse.result.id)" -ForegroundColor Cyan
    } else {
        Write-Host "Failed to create cache rule" -ForegroundColor Red
        Write-Host ($createResponse | ConvertTo-Json -Depth 5) -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Cache Rules setup complete!" -ForegroundColor Green
Write-Host "This rule will bypass Cloudflare cache for all .js and .css files in /static/" -ForegroundColor Cyan
Write-Host "Files will always be fetched fresh from Pages origin" -ForegroundColor Cyan
