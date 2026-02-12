#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Open browser pages and check their status
.DESCRIPTION
    Opens each page in the default browser with a delay between each
#>

param(
    [string]$BaseUrl = "http://localhost:5173"
)

$pages = @(
    @{ Path = "/"; Name = "Landing Page" },
    @{ Path = "/nexx"; Name = "NEXX Database (PIN)" },
    @{ Path = "/cabinet"; Name = "Cabinet" }
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  NEXX Browser Page Test" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

foreach ($page in $pages) {
    $url = "$BaseUrl$($page.Path)"
    Write-Host "Opening: $($page.Name)" -ForegroundColor Yellow
    Write-Host "URL: $url" -ForegroundColor Gray
    
    try {
        Start-Process $url
        Write-Host "✅ Opened successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to open: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Start-Sleep -Seconds 2
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "All pages opened in browser." -ForegroundColor Green
Write-Host "Please check each tab for:" -ForegroundColor Yellow
Write-Host "  1. Visual appearance" -ForegroundColor Gray
Write-Host "  2. Console errors (F12)" -ForegroundColor Gray
Write-Host "  3. Network errors" -ForegroundColor Gray
Write-Host "  4. Missing content" -ForegroundColor Gray
Write-Host "========================================`n" -ForegroundColor Cyan
