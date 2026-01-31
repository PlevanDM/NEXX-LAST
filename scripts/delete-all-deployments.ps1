# Delete all Cloudflare Pages deployments
# Удаление всех деплоев Cloudflare Pages
# По умолчанию: nexx (старый проект). Основной продакшен: nexx-gsm.

param(
    [string]$Email = $env:CLOUDFLARE_EMAIL,
    [string]$GlobalApiKey = $env:CLOUDFLARE_GLOBAL_API_KEY,
    [string]$AccountId = "ad170d773e79a037e28f4530fd5305a5",
    [string]$ProjectName = "nexx"
)

if (-not $GlobalApiKey) {
    Write-Host "ERROR: Set CLOUDFLARE_GLOBAL_API_KEY in environment (or pass -GlobalApiKey). Never commit API keys to git." -ForegroundColor Red
    exit 1
}
if (-not $Email) { $Email = "dmitro.plevan@gmail.com" }

Write-Host "Deleting all deployments from project '$ProjectName'..." -ForegroundColor Yellow
Write-Host ""

$headers = @{
    "X-Auth-Email" = $Email
    "X-Auth-Key" = $GlobalApiKey
    "Content-Type" = "application/json"
}

$deploymentsUrl = "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName/deployments"
$allDeployments = @()

# Get and delete deployments in batches (API returns max 25 at a time)
Write-Host "Step 1: Fetching and deleting deployments in batches..." -ForegroundColor Cyan
$totalDeleted = 0
$totalFailed = 0
$totalSkipped = 0
$iteration = 0
$maxIterations = 20  # Safety limit

try {
    do {
        $iteration++
        Write-Host "   Iteration $iteration : Fetching deployments..." -ForegroundColor Gray
        
        $response = Invoke-RestMethod -Uri $deploymentsUrl -Method Get -Headers $headers -ErrorAction Stop
        
        if (-not $response.success -or -not $response.result -or $response.result.Count -eq 0) {
            Write-Host "     No more deployments found." -ForegroundColor Green
            break
        }
        
        $deployments = $response.result
        Write-Host "     Found $($deployments.Count) deployments to delete..." -ForegroundColor Gray
        
        # Delete each deployment
        foreach ($deployment in $deployments) {
            $deploymentId = $deployment.id
            $deploymentStage = $deployment.latest_stage.name
            
            # Skip production deployments with aliases
            if ($deployment.aliases -and $deployment.aliases.Count -gt 0) {
                $totalSkipped++
                continue
            }
            
            $deleteUrl = "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName/deployments/$deploymentId"
            
            try {
                Invoke-RestMethod -Uri $deleteUrl -Method Delete -Headers $headers -ErrorAction Stop | Out-Null
                $totalDeleted++
            } catch {
                $statusCode = $_.Exception.Response.StatusCode.value__
                if ($statusCode -eq 404) {
                    # Already deleted
                    $totalDeleted++
                } elseif ($statusCode -eq 403) {
                    $totalSkipped++
                } else {
                    $totalFailed++
                }
            }
            
            # Small delay
            if ($totalDeleted % 10 -eq 0) {
                Start-Sleep -Milliseconds 200
            }
        }
        
        Write-Host "     Deleted $totalDeleted total, failed $totalFailed, skipped $totalSkipped" -ForegroundColor Cyan
        
        # Wait a bit before next fetch
        if ($deployments.Count -gt 0) {
            Start-Sleep -Seconds 2
        }
        
    } while ($iteration -lt $maxIterations)
    
    Write-Host "   Processed $iteration iterations" -ForegroundColor Green
    
} catch {
    Write-Host "   ERROR: Could not fetch deployments" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Gray
    }
    exit 1
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "   Deleted: $totalDeleted deployments" -ForegroundColor Green
if ($totalFailed -gt 0) {
    Write-Host "   Failed: $totalFailed deployments" -ForegroundColor Yellow
}
if ($totalSkipped -gt 0) {
    Write-Host "   Skipped: $totalSkipped deployments (protected/production)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Waiting 10 seconds for Cloudflare to process..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Step 2: Delete custom domains
Write-Host ""
Write-Host "Step 2: Deleting custom domains..." -ForegroundColor Cyan
$domainsUrl = "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName/domains"

try {
    $domainsResponse = Invoke-RestMethod -Uri $domainsUrl -Method Get -Headers $headers -ErrorAction Stop
    
    if ($domainsResponse.success -and $domainsResponse.result) {
        $domains = $domainsResponse.result
        Write-Host "   Found $($domains.Count) custom domains" -ForegroundColor Gray
        
        foreach ($domain in $domains) {
            $domainName = $domain.name
            $deleteDomainUrl = "$domainsUrl/$domainName"
            
            try {
                Invoke-RestMethod -Uri $deleteDomainUrl -Method Delete -Headers $headers -ErrorAction Stop | Out-Null
                Write-Host "   Deleted domain: $domainName" -ForegroundColor Green
            } catch {
                Write-Host "   Failed to delete domain $domainName : $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "   No custom domains found" -ForegroundColor Gray
    }
} catch {
    Write-Host "   Could not fetch domains: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "   Waiting 5 seconds..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Step 3: Try to delete project now
Write-Host ""
Write-Host "Step 3: Attempting to delete project..." -ForegroundColor Cyan
$deleteProjectUrl = "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName"

try {
    $projectResponse = Invoke-RestMethod -Uri $deleteProjectUrl -Method Delete -Headers $headers -ErrorAction Stop
    Write-Host "   SUCCESS: Project deleted!" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 404) {
        Write-Host "   Project already deleted" -ForegroundColor Green
    } elseif ($statusCode -eq 400) {
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Response: $responseBody" -ForegroundColor Yellow
        }
        Write-Host "   You may need to delete remaining items manually via dashboard:" -ForegroundColor Yellow
        Write-Host "   https://dash.cloudflare.com/$AccountId/pages/view/$ProjectName" -ForegroundColor Cyan
    } else {
        Write-Host "   Could not delete project: Status $statusCode" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
