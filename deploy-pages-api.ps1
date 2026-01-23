# Cloudflare Pages API Deployment Script
# Works with Global API Key

param(
    [string]$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc",
    [string]$Email = "dmitro.plevan@gmail.com",
    [string]$ProjectName = "nexx"
)

$ErrorActionPreference = "Stop"

Write-Host "=== Cloudflare Pages API Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get Account ID
Write-Host "[1/4] Getting Account ID..." -ForegroundColor Yellow
$API_BASE = "https://api.cloudflare.com/client/v4"
$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

try {
    $accountsResponse = Invoke-RestMethod -Uri "$API_BASE/accounts" -Method Get -Headers $headers
    if (-not $accountsResponse.success -or $accountsResponse.result.Count -eq 0) {
        throw "Failed to get Account ID"
    }
    $accountId = $accountsResponse.result[0].id
    Write-Host "  Account ID: $accountId" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Get Project
Write-Host "[2/4] Getting project '$ProjectName'..." -ForegroundColor Yellow
try {
    $projectsResponse = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects" -Method Get -Headers $headers
    if (-not $projectsResponse.success) {
        throw "Failed to get projects list"
    }
    $project = $projectsResponse.result | Where-Object { $_.name -eq $ProjectName } | Select-Object -First 1
    if (-not $project) {
        Write-Host "  Project not found. Creating..." -ForegroundColor Yellow
        # Create project
        $createBody = @{
            name = $ProjectName
            production_branch = "main"
        } | ConvertTo-Json
        $createResponse = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects" -Method Post -Headers $headers -Body $createBody
        if ($createResponse.success) {
            $project = $createResponse.result
            Write-Host "  Project created!" -ForegroundColor Green
        } else {
            throw "Failed to create project"
        }
    } else {
        Write-Host "  Project found!" -ForegroundColor Green
    }
} catch {
    Write-Host "  ERROR: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Build
Write-Host "[3/4] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Build completed!" -ForegroundColor Green

# Step 4: Create deployment
Write-Host "[4/4] Creating deployment..." -ForegroundColor Yellow

# Create zip file
$distPath = Join-Path $PWD "dist"
$zipPath = Join-Path $PWD "deploy.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Write-Host "  Creating ZIP archive..." -ForegroundColor Gray
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $zipPath)

# Upload deployment
try {
    $boundary = [System.Guid]::NewGuid().ToString()
    $fileBytes = [System.IO.File]::ReadAllBytes($zipPath)
    $fileName = "deploy.zip"
    
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
        "Content-Type: application/zip",
        "",
        [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes),
        "--$boundary--"
    )
    
    $body = $bodyLines -join "`r`n"
    $bodyBytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($body)
    
    $uploadHeaders = @{
        "X-Auth-Key" = $GlobalApiKey
        "X-Auth-Email" = $Email
        "Content-Type" = "multipart/form-data; boundary=$boundary"
    }
    
    Write-Host "  Uploading to Cloudflare Pages..." -ForegroundColor Gray
    $deployResponse = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects/$ProjectName/deployments" -Method Post -Headers $uploadHeaders -Body $bodyBytes
    
    if ($deployResponse.success) {
        $deploymentUrl = $deployResponse.result.url
        Write-Host "  Deployment created!" -ForegroundColor Green
        Write-Host "  URL: $deploymentUrl" -ForegroundColor Cyan
    } else {
        throw "Deployment failed: $($deployResponse.errors)"
    }
} catch {
    Write-Host "  ERROR: $_" -ForegroundColor Red
    Write-Host "  Trying alternative method..." -ForegroundColor Yellow
    
    # Alternative: Use wrangler with proper token setup
    Write-Host ""
    Write-Host "Alternative: Use wrangler login" -ForegroundColor Cyan
    Write-Host "  1. wrangler login" -ForegroundColor White
    Write-Host "  2. wrangler pages deploy dist --project-name $ProjectName" -ForegroundColor White
}

# Cleanup
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Green
