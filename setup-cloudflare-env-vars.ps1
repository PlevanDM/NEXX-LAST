# Setup Cloudflare Pages Environment Variables
# Настройка переменных окружения для Cloudflare Pages

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$AccountId = "ad170d773e79a037e28f4530fd5305a5"
$ProjectName = "nexx"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Cloudflare Pages Environment Variables Setup ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

# Remonline Configuration
$REMONLINE_API_KEY = "55f93eacf65e94ef55e6fed9fd41f8c4"
$REMONLINE_BASE_URL = "https://api.remonline.app"
$REMONLINE_BRANCH_ID = "218970"
$REMONLINE_ORDER_TYPE = "334611"

# Vapi AI Configuration
$VAPI_API_KEY = "ae7cb2c0-9b24-48cf-9115-fb15f5042d73"
$VAPI_PHONE_ID = "a725ed7c-0465-4cde-ade7-c346aade9aea"
$VAPI_ASSISTANT_ID = "96cd370d-806f-4cbe-993e-381a5df85d46"

Write-Host "[1/2] Setting environment variables..." -ForegroundColor Yellow

# Environment variables to set
$envVars = @{
    "REMONLINE_API_KEY" = $REMONLINE_API_KEY
    "REMONLINE_BASE_URL" = $REMONLINE_BASE_URL
    "REMONLINE_BRANCH_ID" = $REMONLINE_BRANCH_ID
    "REMONLINE_ORDER_TYPE" = $REMONLINE_ORDER_TYPE
    "VAPI_API_KEY" = $VAPI_API_KEY
    "VAPI_PHONE_ID" = $VAPI_PHONE_ID
    "VAPI_ASSISTANT_ID" = $VAPI_ASSISTANT_ID
}

try {
    # Get project
    $project = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName" -Method Get -Headers $headers
    
    if (-not $project.success) {
        Write-Host "   ❌ Project not found!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "   ✅ Project found: $ProjectName" -ForegroundColor Green
    
    # Set environment variables for production
    Write-Host ""
    Write-Host "[2/2] Setting production environment variables..." -ForegroundColor Yellow
    
    $body = @{
        deployment_configs = @{
            production = @{
                env_vars = @{}
            }
        }
    }
    
    foreach ($key in $envVars.Keys) {
        $body.deployment_configs.production.env_vars[$key] = @{
            value = $envVars[$key]
        }
        Write-Host "   ✅ $key = $($envVars[$key].Substring(0, [Math]::Min(20, $envVars[$key].Length)))..." -ForegroundColor Gray
    }
    
    $updateBody = $body | ConvertTo-Json -Depth 10
    
    $updateResult = Invoke-RestMethod -Uri "$API_BASE/accounts/$AccountId/pages/projects/$ProjectName" -Method Patch -Headers $headers -Body $updateBody
    
    if ($updateResult.success) {
        Write-Host ""
        Write-Host "   ✅ Environment variables set successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Update response: $($updateResult | ConvertTo-Json)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "   ❌ Error: $_" -ForegroundColor Red
    Write-Host "   Details: $($_.Exception.Message)" -ForegroundColor Gray
    
    # Alternative: Try using wrangler secrets
    Write-Host ""
    Write-Host "💡 Alternative: Use wrangler secrets:" -ForegroundColor Yellow
    Write-Host "   wrangler secret put REMONLINE_API_KEY" -ForegroundColor White
    Write-Host "   wrangler secret put VAPI_API_KEY" -ForegroundColor White
}

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Environment variables configured!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Note: Cloudflare Pages environment variables are set per project." -ForegroundColor Yellow
Write-Host "   They will be available in all Functions as env.* variables." -ForegroundColor White
