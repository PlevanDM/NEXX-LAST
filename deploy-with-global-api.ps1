# NEXX WebApp - Деплой з Global API Key
# Використовує Global API Key замість API Token

param(
    [string]$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc",
    [string]$Email = "dmitro.plevan@gmail.com"
)

Write-Host "🚀 Деплой NEXX WebApp на Cloudflare Pages..." -ForegroundColor Cyan
Write-Host ""

# Встановлення змінних середовища для Global API Key
Write-Host "🔐 Налаштування Global API Key..." -ForegroundColor Yellow
$env:CLOUDFLARE_API_TOKEN = $GlobalApiKey
$env:CLOUDFLARE_EMAIL = $Email

# Для Global API Key потрібно використовувати інший формат
# Wrangler підтримує Global API Key через змінні середовища
Write-Host "   📧 Email: $Email" -ForegroundColor Gray
Write-Host "   🔑 API Key: $($GlobalApiKey.Substring(0, 8))..." -ForegroundColor Gray
Write-Host ""

# Спробуємо використати wrangler з Global API Key
# Wrangler потребує CLOUDFLARE_API_TOKEN, але для Global API Key
# потрібно також встановити CLOUDFLARE_EMAIL

# Альтернатива: використати Cloudflare API напряму
Write-Host "📦 Збірка проекту..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Помилка збірки!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Збірка завершена!" -ForegroundColor Green
Write-Host ""

# Спробуємо деплой через wrangler
Write-Host "🌐 Деплой на Cloudflare Pages через Wrangler..." -ForegroundColor Yellow
wrangler pages deploy dist --project-name nexx
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Деплой успішно завершено!" -ForegroundColor Green
    Write-Host "🌐 Сайт доступний на: https://nexxgsm.com/" -ForegroundColor Cyan
    exit 0
}

# Якщо wrangler не працює, спробуємо через Cloudflare API напряму
Write-Host ""
Write-Host "⚠️  Wrangler не працює, спробуємо через Cloudflare API..." -ForegroundColor Yellow
Write-Host ""

# Отримуємо Account ID та інші дані
$API_BASE = "https://api.cloudflare.com/client/v4"
$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

Write-Host "📋 Отримання Account ID..." -ForegroundColor Yellow
try {
    $accountsResponse = Invoke-RestMethod -Uri "$API_BASE/accounts" -Method Get -Headers $headers -ErrorAction Stop
    if ($accountsResponse.success -and $accountsResponse.result.Count -gt 0) {
        $accountId = $accountsResponse.result[0].id
        Write-Host "   ✅ Account ID: $accountId" -ForegroundColor Green
        
        # Отримуємо список проектів Pages
        Write-Host "📋 Отримання списку проектів Pages..." -ForegroundColor Yellow
        $projectsResponse = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects" -Method Get -Headers $headers -ErrorAction Stop
        
        if ($projectsResponse.success) {
            $project = $projectsResponse.result | Where-Object { $_.name -eq "nexx" } | Select-Object -First 1
            
            if ($project) {
                Write-Host "   ✅ Проект 'nexx' знайдено!" -ForegroundColor Green
                Write-Host ""
                Write-Host "📤 Завантаження файлів..." -ForegroundColor Yellow
                Write-Host "   ⚠️  Для завантаження через API потрібен спеціальний скрипт." -ForegroundColor Yellow
                Write-Host "   💡 Рекомендується використати wrangler login або правильний API Token" -ForegroundColor Cyan
            } else {
                Write-Host "   ⚠️  Проект 'nexx' не знайдено. Створіть його через Dashboard." -ForegroundColor Yellow
            }
        } else {
            Write-Host "   ⚠️  Не вдалося отримати список проектів." -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️  Не вдалося отримати Account ID." -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Помилка API: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Рекомендації:" -ForegroundColor Cyan
    Write-Host "   1. Перевірте правильність Global API Key" -ForegroundColor White
    Write-Host "   2. Спробуйте: wrangler login" -ForegroundColor White
    Write-Host "   3. Або створіть API Token з правами на Pages" -ForegroundColor White
}

Write-Host ""
Write-Host "📖 Детальні інструкції: DEPLOY-INSTRUCTIONS.md" -ForegroundColor Cyan
