# Script to delete old nexx project
# Requires Cloudflare API Token with Pages:Edit permissions

$CLOUDFLARE_ACCOUNT_ID = "ad170d773e79a037e28f4530fd5305a5"
$CLOUDFLARE_API_TOKEN = "853487a6a39bd7f6f8128b4caf420ac22de33"

Write-Host "Checking projects..." -ForegroundColor Cyan

$projectsUrl = "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects"
$headers = @{
    "Authorization" = "Bearer $CLOUDFLARE_API_TOKEN"
    "Content-Type" = "application/json"
}

try {
    $projectsResponse = Invoke-RestMethod -Uri $projectsUrl -Method Get -Headers $headers
    Write-Host "Found projects:" -ForegroundColor Green
    foreach ($project in $projectsResponse.result) {
        $domainsStr = if ($project.domains) { ($project.domains -join ", ") } else { "none" }
        Write-Host "  - $($project.name) (domains: $domainsStr)" -ForegroundColor Yellow
    }
    
    $nexxProject = $projectsResponse.result | Where-Object { $_.name -eq "nexx" }
    
    if ($nexxProject) {
        Write-Host ""
        Write-Host "Found old 'nexx' project" -ForegroundColor Yellow
        
        $domainsUrl = "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/nexx/domains"
        $domainsResponse = Invoke-RestMethod -Uri $domainsUrl -Method Get -Headers $headers
        
        Write-Host "Custom domains attached:" -ForegroundColor Cyan
        foreach ($domain in $domainsResponse.result) {
            Write-Host "  - $($domain.domain)" -ForegroundColor Yellow
            
            Write-Host "  Deleting domain: $($domain.domain)..." -ForegroundColor Yellow
            $deleteDomainUrl = "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/nexx/domains/$($domain.domain)"
            
            try {
                Invoke-RestMethod -Uri $deleteDomainUrl -Method Delete -Headers $headers
                Write-Host "  Domain deleted: $($domain.domain)" -ForegroundColor Green
            } catch {
                Write-Host "  Error deleting domain: $_" -ForegroundColor Red
            }
        }
        
        Start-Sleep -Seconds 3
        
        Write-Host ""
        Write-Host "Deleting project 'nexx'..." -ForegroundColor Yellow
        $deleteProjectUrl = "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/nexx"
        
        try {
            Invoke-RestMethod -Uri $deleteProjectUrl -Method Delete -Headers $headers
            Write-Host "Project 'nexx' deleted successfully!" -ForegroundColor Green
        } catch {
            Write-Host "Error deleting project: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "Project 'nexx' not found (already deleted?)" -ForegroundColor Cyan
    }
    
    Write-Host ""
    Write-Host "Remaining projects:" -ForegroundColor Cyan
    $remainingProjects = Invoke-RestMethod -Uri $projectsUrl -Method Get -Headers $headers
    foreach ($project in $remainingProjects.result) {
        $domainsList = if ($project.domains) { ($project.domains -join ", ") } else { "none" }
        Write-Host "  $($project.name) - $domainsList" -ForegroundColor Green
    }
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Make sure your API token has Pages:Edit permissions" -ForegroundColor Yellow
}
