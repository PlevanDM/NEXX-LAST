# Delete Duplicate Cloudflare Pages Project
# Удаляет дубликат проекта nexx-v2

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$ProjectToDelete = "nexx-v2"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Delete Duplicate Pages Project ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

Write-Host "WARNING: This will delete project: $ProjectToDelete" -ForegroundColor Red
Write-Host "Press Ctrl+C to cancel, or wait 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    Write-Host "Deleting project $ProjectToDelete..." -ForegroundColor Yellow
    $deleteResponse = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects/$ProjectToDelete" -Method Delete -Headers $headers
    
    if ($deleteResponse.success) {
        Write-Host "SUCCESS: Project $ProjectToDelete deleted!" -ForegroundColor Green
    } else {
        Write-Host "Error: $($deleteResponse.errors)" -ForegroundColor Red
    }
} catch {
    Write-Host "API Error: $($_.Exception.Message)" -ForegroundColor Red
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($errorDetails) {
        Write-Host "Details: $($errorDetails | ConvertTo-Json)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Listing remaining projects..." -ForegroundColor Cyan
& "$PSScriptRoot\list-cloudflare-pages-projects.ps1"
