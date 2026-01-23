# Check Cloudflare Pages Repository Connection
# Проверяет какой репозиторий подключен к проекту Pages

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Cloudflare Pages Repository Check ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

try {
    Write-Host "Getting project details..." -ForegroundColor Yellow
    $projectResponse = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName" -Method Get -Headers $headers
    
    if ($projectResponse.success) {
        $project = $projectResponse.result
        Write-Host "Project: $($project.name)" -ForegroundColor Green
        Write-Host "Production Branch: $($project.production_branch)" -ForegroundColor Gray
        
        # Check source configuration
        if ($project.source) {
            Write-Host ""
            Write-Host "Source Configuration:" -ForegroundColor Yellow
            Write-Host "  Type: $($project.source.type)" -ForegroundColor Gray
            if ($project.source.config) {
                Write-Host "  Config:" -ForegroundColor Gray
                $project.source.config | ConvertTo-Json -Depth 5 | Write-Host
            }
        } else {
            Write-Host ""
            Write-Host "No source repository configured" -ForegroundColor Yellow
            Write-Host "This project uses manual deployments" -ForegroundColor Gray
        }
        
        # Check latest deployments
        Write-Host ""
        Write-Host "Latest Deployments:" -ForegroundColor Yellow
        $deploymentsResponse = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName/deployments?per_page=5" -Method Get -Headers $headers
        if ($deploymentsResponse.success) {
            foreach ($deployment in $deploymentsResponse.result) {
                Write-Host "  Deployment: $($deployment.id)" -ForegroundColor Cyan
                Write-Host "    Status: $($deployment.latest_stage.status)" -ForegroundColor $(if ($deployment.latest_stage.status -eq 'success') { 'Green' } else { 'Yellow' })
                Write-Host "    Created: $($deployment.created_on)" -ForegroundColor Gray
                if ($deployment.deployment_trigger) {
                    Write-Host "    Trigger: $($deployment.deployment_trigger.type)" -ForegroundColor Gray
                    if ($deployment.deployment_trigger.metadata) {
                        Write-Host "    Branch: $($deployment.deployment_trigger.metadata.branch)" -ForegroundColor Gray
                        Write-Host "    Commit: $($deployment.deployment_trigger.metadata.commit_hash)" -ForegroundColor Gray
                    }
                }
                Write-Host ""
            }
        }
        
    } else {
        Write-Host "Error: $($projectResponse.errors)" -ForegroundColor Red
    }
} catch {
    Write-Host "API Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Current Git Remote:" -ForegroundColor Cyan
git remote -v
