# List All Cloudflare Pages Projects
# Shows all Pages projects and their status

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Cloudflare Pages Projects ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

try {
    Write-Host "Getting list of projects..." -ForegroundColor Yellow
    $projectsResponse = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects" -Method Get -Headers $headers
    
    if ($projectsResponse.success) {
        $projects = $projectsResponse.result
        Write-Host "Found projects: $($projects.Count)" -ForegroundColor Green
        Write-Host ""
        
        foreach ($project in $projects) {
            Write-Host "Project: $($project.name)" -ForegroundColor Cyan
            Write-Host "   ID: $($project.id)" -ForegroundColor Gray
            Write-Host "   Production Branch: $($project.production_branch)" -ForegroundColor Gray
            Write-Host "   Created: $($project.created_on)" -ForegroundColor Gray
            Write-Host "   Modified: $($project.modified_on)" -ForegroundColor Gray
            
            # Get latest deployment
            try {
                $deploymentsResponse = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects/$($project.name)/deployments?per_page=1" -Method Get -Headers $headers
                if ($deploymentsResponse.success -and $deploymentsResponse.result.Count -gt 0) {
                    $latestDeployment = $deploymentsResponse.result[0]
                    Write-Host "   Latest Deployment:" -ForegroundColor Yellow
                    Write-Host "      ID: $($latestDeployment.id)" -ForegroundColor Gray
                    Write-Host "      Status: $($latestDeployment.latest_stage.status)" -ForegroundColor $(if ($latestDeployment.latest_stage.status -eq 'success') { 'Green' } else { 'Yellow' })
                    Write-Host "      URL: $($latestDeployment.url)" -ForegroundColor Gray
                    Write-Host "      Created: $($latestDeployment.created_on)" -ForegroundColor Gray
                }
            } catch {
                Write-Host "   Warning: Could not get deployments: $($_.Exception.Message)" -ForegroundColor Yellow
            }
            
            Write-Host ""
        }
        
        # Check for duplicates
        $duplicates = $projects | Group-Object -Property name | Where-Object { $_.Count -gt 1 }
        if ($duplicates) {
            Write-Host "WARNING: Found duplicate projects!" -ForegroundColor Red
            foreach ($dup in $duplicates) {
                Write-Host "   Duplicate: $($dup.Name) (count: $($dup.Count))" -ForegroundColor Red
            }
        } else {
            Write-Host "No duplicates found" -ForegroundColor Green
        }
        
    } else {
        Write-Host "Error getting projects: $($projectsResponse.errors)" -ForegroundColor Red
    }
} catch {
    Write-Host "API Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Details: $($_.Exception)" -ForegroundColor Gray
}
