# Check Cloudflare Pages Environment Variables
# Проверка переменных окружения Cloudflare Pages

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Cloudflare Pages Environment Variables Check ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

try {
    $project = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName" -Method Get -Headers $headers
    
    if (-not $project.success) {
        Write-Host "❌ Project not found!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Project: $ProjectName" -ForegroundColor Green
    Write-Host ""
    
    # Check environment variables
    if ($project.result.deployment_configs) {
        Write-Host "Environment Variables:" -ForegroundColor Yellow
        
        $prodEnvVars = $null
        if ($project.result.deployment_configs.production) {
            $prodEnvVars = $project.result.deployment_configs.production.env_vars
        }
        
        if ($prodEnvVars) {
            Write-Host "  Production:" -ForegroundColor Cyan
            foreach ($key in $prodEnvVars.PSObject.Properties.Name) {
                $value = $prodEnvVars.$key.value
                $displayValue = if ($value.Length -gt 20) { $value.Substring(0, 20) + "..." } else { $value }
                Write-Host "    ✅ $key = $displayValue" -ForegroundColor Green
            }
        } else {
            Write-Host "  ⚠️  No production environment variables set" -ForegroundColor Yellow
        }
        
        $previewEnvVars = $null
        if ($project.result.deployment_configs.preview) {
            $previewEnvVars = $project.result.deployment_configs.preview.env_vars
        }
        
        if ($previewEnvVars) {
            Write-Host "  Preview:" -ForegroundColor Cyan
            foreach ($key in $previewEnvVars.PSObject.Properties.Name) {
                $value = $previewEnvVars.$key.value
                $displayValue = if ($value.Length -gt 20) { $value.Substring(0, 20) + "..." } else { $value }
                Write-Host "    ✅ $key = $displayValue" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "⚠️  No environment variables configured" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "💡 To set environment variables:" -ForegroundColor Yellow
        Write-Host "   .\setup-cloudflare-env-vars.ps1" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "   Details: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
