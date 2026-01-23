# NEXX WebApp - Деплой через Cloudflare Pages API
# Використовує Global API Key для прямого завантаження

param(
    [string]$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc",
    [string]$Email = "dmitro.plevan@gmail.com",
    [string]$ProjectName = "nexx"
)

Write-Host "🚀 Деплой NEXX WebApp через Cloudflare Pages API..." -ForegroundColor Cyan
Write-Host ""

$API_BASE = "https://api.cloudflare.com/client/v4"
$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

# Крок 1: Отримати Account ID
Write-Host "📋 Крок 1: Отримання Account ID..." -ForegroundColor Yellow
try {
    $accountsResponse = Invoke-RestMethod -Uri "$API_BASE/accounts" -Method Get -Headers $headers -ErrorAction Stop
    if (-not $accountsResponse.success -or $accountsResponse.result.Count -eq 0) {
        Write-Host "   ❌ Не вдалося отримати Account ID" -ForegroundColor Red
        exit 1
    }
    $accountId = $accountsResponse.result[0].id
    Write-Host "   ✅ Account ID: $accountId" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Помилка: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   💡 Перевірте правильність Global API Key та Email" -ForegroundColor Yellow
    exit 1
}

# Крок 2: Перевірити/створити проект
Write-Host ""
Write-Host "📋 Крок 2: Перевірка проекту '$ProjectName'..." -ForegroundColor Yellow
try {
    $projectsResponse = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects" -Method Get -Headers $headers -ErrorAction Stop
    
    if ($projectsResponse.success) {
        $project = $projectsResponse.result | Where-Object { $_.name -eq $ProjectName } | Select-Object -First 1
        
        if ($project) {
            Write-Host "   ✅ Проект '$ProjectName' знайдено!" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Проект '$ProjectName' не знайдено." -ForegroundColor Yellow
            Write-Host "   💡 Створіть проект через Dashboard: https://dash.cloudflare.com/" -ForegroundColor Cyan
            Write-Host "   Або використайте: wrangler pages project create $ProjectName" -ForegroundColor Cyan
            exit 1
        }
    }
} catch {
    Write-Host "   ❌ Помилка: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Крок 3: Збірка проекту
Write-Host ""
Write-Host "📦 Крок 3: Збірка проекту..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Помилка збірки!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Збірка завершена!" -ForegroundColor Green

# Крок 4: Створити deployment через API
Write-Host ""
Write-Host "📤 Крок 4: Створення deployment..." -ForegroundColor Yellow
Write-Host "   ⚠️  Для завантаження файлів через API потрібен спеціальний процес." -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Рекомендований спосіб:" -ForegroundColor Cyan
Write-Host "   1. Авторизуйтеся через браузер:" -ForegroundColor White
Write-Host "      wrangler login" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Потім виконайте:" -ForegroundColor White
Write-Host "      wrangler pages deploy dist --project-name $ProjectName" -ForegroundColor Gray
Write-Host ""
Write-Host "   Або створіть API Token з правами на Pages:" -ForegroundColor White
Write-Host "   https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Gray
Write-Host ""

# Альтернатива: спробувати через wrangler з правильними налаштуваннями
Write-Host "🔄 Спробую альтернативний метод..." -ForegroundColor Yellow

# Створити тимчасовий .wrangler/config.toml або використати інший підхід
Write-Host "   💡 Для Global API Key краще використати:" -ForegroundColor Cyan
Write-Host "      - Wrangler login (через браузер)" -ForegroundColor White
Write-Host "      - Або API Token замість Global API Key" -ForegroundColor White
