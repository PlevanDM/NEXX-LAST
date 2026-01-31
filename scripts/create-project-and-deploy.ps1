# Create new Cloudflare Pages project and deploy

param(
    [string]$Email = "dmitro.plevan@gmail.com",
    [string]$GlobalApiKey = "853487a6a39bd7f6f8128b4caf420ac22de33",
    [string]$AccountId = "ad170d773e79a037e28f4530fd5305a5",
    [string]$ProjectName = "nexx-gsm"
)

Write-Host "Creating new Cloudflare Pages project and deploying..." -ForegroundColor Yellow
Write-Host ""

$headers = @{
    "X-Auth-Email" = $Email
    "X-Auth-Key" = $GlobalApiKey
    "Content-Type" = "application/json"
}

# Create project
Write-Host "Step 1: Creating project '$ProjectName'..." -ForegroundColor Cyan
$createProjectUrl = "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects"

$projectBody = @{
    name = $ProjectName
    production_branch = "main"
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri $createProjectUrl -Method Post -Headers $headers -Body $projectBody -ErrorAction Stop
    
    if ($createResponse.success) {
        Write-Host "   SUCCESS: Project created!" -ForegroundColor Green
    } else {
        Write-Host "   Project may already exist or error occurred" -ForegroundColor Yellow
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 409) {
        Write-Host "   Project already exists (this is OK)" -ForegroundColor Green
    } else {
        Write-Host "   Warning: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Step 2: Deploying project..." -ForegroundColor Cyan
wrangler pages deploy dist --project-name $ProjectName

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Clean installation completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Site will be available at: https://nexxgsm.com" -ForegroundColor Cyan
    Write-Host "Dashboard: https://dash.cloudflare.com/$AccountId/pages/view/$ProjectName" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "ERROR: Deployment failed!" -ForegroundColor Red
    exit 1
}
