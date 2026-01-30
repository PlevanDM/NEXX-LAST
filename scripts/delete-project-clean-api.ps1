# Delete Cloudflare Pages project using Global API Key for clean installation

param(
    [string]$Email = "dmitro.plevan@gmail.com",
    [string]$GlobalApiKey = "853487a6a39bd7f6f8128b4caf420ac22de33"
)

Write-Host "Deleting Cloudflare Pages project for clean installation..." -ForegroundColor Yellow
Write-Host ""

# Get Account ID via API
Write-Host "Getting Account ID via API..." -ForegroundColor Cyan
$apiHeaders = @{
    "X-Auth-Email" = $Email
    "X-Auth-Key" = $GlobalApiKey
    "Content-Type" = "application/json"
}

try {
    $accountsUrl = "https://api.cloudflare.com/client/v4/accounts"
    $accountsResponse = Invoke-RestMethod -Uri $accountsUrl -Method Get -Headers $apiHeaders -ErrorAction Stop
    
    if ($accountsResponse.success -and $accountsResponse.result -and $accountsResponse.result.Count -gt 0) {
        $accountId = $accountsResponse.result[0].id
        Write-Host "   OK: Account ID: $accountId" -ForegroundColor Green
        Write-Host "   Account Name: $($accountsResponse.result[0].name)" -ForegroundColor Gray
    } else {
        Write-Host "   WARNING: Could not get Account ID from API" -ForegroundColor Yellow
        $accountId = Read-Host "   Enter Account ID manually"
    }
} catch {
    Write-Host "   WARNING: API error: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   Trying to get Account ID from wrangler..." -ForegroundColor Yellow
    try {
        $whoamiJson = wrangler whoami --json 2>&1
        $accountInfo = $whoamiJson | ConvertFrom-Json
        if ($accountInfo -and $accountInfo.accountId) {
            $accountId = $accountInfo.accountId
            Write-Host "   OK: Account ID from wrangler: $accountId" -ForegroundColor Green
        } else {
            $accountId = Read-Host "   Enter Account ID manually"
        }
    } catch {
        $accountId = Read-Host "   Enter Account ID manually"
    }
}
Write-Host ""

# Delete all deployments first, then project
Write-Host "Deleting all deployments and project 'nexx'..." -ForegroundColor Yellow

$projectName = "nexx"
$headers = @{
    "X-Auth-Email" = $Email
    "X-Auth-Key" = $GlobalApiKey
    "Content-Type" = "application/json"
}

# Step 1: Get all deployments (with pagination)
Write-Host "   Step 1: Getting all deployments (with pagination)..." -ForegroundColor Cyan
$deploymentsUrl = "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/$projectName/deployments"
$allDeployments = @()
$page = 1
$perPage = 100

try {
    # Try without pagination first
    Write-Host "     Fetching all deployments..." -ForegroundColor Gray
    $deploymentsResponse = Invoke-RestMethod -Uri $deploymentsUrl -Method Get -Headers $headers -ErrorAction Stop
        
        if ($deploymentsResponse.success -and $deploymentsResponse.result) {
            $allDeployments += $deploymentsResponse.result
            $pageNum = $page
            $pageCount = $deploymentsResponse.result.Count
            $totalCount = $allDeployments.Count
            Write-Host "     Page ${pageNum}: Found ${pageCount} deployments (Total: ${totalCount})" -ForegroundColor Gray
            $page++
        } else {
            break
        }
    } while ($deploymentsResponse.result.Count -eq $perPage)
    
    Write-Host "   Found total: $($allDeployments.Count) deployments" -ForegroundColor Cyan
    
    # Step 2: Delete all deployments
    if ($allDeployments.Count -gt 0) {
        Write-Host "   Step 2: Deleting all $($allDeployments.Count) deployments..." -ForegroundColor Cyan
        $deletedCount = 0
        $failedCount = 0
        $batchSize = 10
        $batch = 0
        
        foreach ($deployment in $allDeployments) {
            $deploymentId = $deployment.id
            $deleteDeploymentUrl = "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/$projectName/deployments/$deploymentId"
            
            try {
                Invoke-RestMethod -Uri $deleteDeploymentUrl -Method Delete -Headers $headers -ErrorAction Stop | Out-Null
                $deletedCount++
                
                # Show progress every batch
                if ($deletedCount % $batchSize -eq 0) {
                    Write-Host "     Progress: Deleted $deletedCount / $($allDeployments.Count) deployments..." -ForegroundColor Gray
                }
            } catch {
                $failedCount++
                if ($failedCount -le 5) {
                    Write-Host "     Warning: Could not delete deployment $deploymentId - $($_.Exception.Message)" -ForegroundColor Yellow
                }
            }
            
            # Small delay to avoid rate limiting
            if ($deletedCount % 20 -eq 0) {
                Start-Sleep -Milliseconds 500
            }
        }
        
        Write-Host "   Deleted: $deletedCount deployments" -ForegroundColor Green
        if ($failedCount -gt 0) {
            Write-Host "   Failed: $failedCount deployments" -ForegroundColor Yellow
        }
        Write-Host "   Waiting 15 seconds for Cloudflare to process..." -ForegroundColor Yellow
        Start-Sleep -Seconds 15
    }
} catch {
    Write-Host "   Warning: Could not get deployments: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Step 3: Delete project
Write-Host "   Step 3: Deleting project..." -ForegroundColor Cyan
$deleteUrl = "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/$projectName"

try {
    $response = Invoke-RestMethod -Uri $deleteUrl -Method Delete -Headers $headers -ErrorAction Stop
    Write-Host "   OK: Project deleted successfully!" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 404) {
        Write-Host "   INFO: Project not found (may already be deleted)" -ForegroundColor Cyan
    } elseif ($statusCode -eq 403) {
        Write-Host "   ERROR: Access denied. Check API key permissions." -ForegroundColor Red
        Write-Host "   Global API Key needs: Account -> Cloudflare Pages -> Edit" -ForegroundColor Yellow
    } elseif ($statusCode -eq 400) {
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "   WARNING: $responseBody" -ForegroundColor Yellow
        }
        Write-Host "   Project may still have deployments. Continuing with fresh deployment..." -ForegroundColor Yellow
    } else {
        Write-Host "   WARNING: Delete error: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "   Status Code: $statusCode" -ForegroundColor Yellow
        Write-Host "   Continuing with fresh deployment..." -ForegroundColor Yellow
    }
}
Write-Host ""

# Clean local dist folder
Write-Host "Cleaning local dist folder..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
    Write-Host "   OK: dist folder cleaned" -ForegroundColor Green
} else {
    Write-Host "   INFO: dist folder does not exist" -ForegroundColor Cyan
}
Write-Host ""

# Build project
Write-Host "Building project..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ERROR: Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "   OK: Build completed" -ForegroundColor Green
Write-Host ""

# Deploy new project
Write-Host "Deploying new project..." -ForegroundColor Cyan
wrangler pages deploy dist --project-name nexx
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ERROR: Deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "OK: Clean installation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Site available at: https://nexxgsm.com" -ForegroundColor Cyan
Write-Host "Dashboard: https://dash.cloudflare.com/" -ForegroundColor Cyan
Write-Host ""
