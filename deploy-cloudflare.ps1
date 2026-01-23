# NEXX WebApp - Деплой на Cloudflare Pages
# Автоматичний деплой з виправленнями перекладів

Write-Host "🚀 Деплой NEXX WebApp на Cloudflare Pages..." -ForegroundColor Cyan
Write-Host ""

# Перевірка авторизації
Write-Host "🔐 Перевірка авторизації..." -ForegroundColor Yellow
$whoami = wrangler whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ⚠️  Не авторизовано!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Варіанти авторизації:" -ForegroundColor Cyan
    Write-Host "   1. Через браузер (рекомендовано):" -ForegroundColor White
    Write-Host "      wrangler login" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   2. Через API токен:" -ForegroundColor White
    Write-Host "      `$env:CLOUDFLARE_API_TOKEN = 'ваш_токен'" -ForegroundColor Gray
    Write-Host "      (Токен має мати права на Cloudflare Pages)" -ForegroundColor Gray
    Write-Host ""
    
    $response = Read-Host "Спробувати авторизуватися зараз? (y/n)"
    if ($response -eq "y") {
        Write-Host ""
        Write-Host "   Відкривається браузер для авторизації..." -ForegroundColor Yellow
        wrangler login
    } else {
        Write-Host ""
        Write-Host "   ❌ Деплой скасовано. Авторизуйтеся та спробуйте знову." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ✅ Авторизовано!" -ForegroundColor Green
    Write-Host $whoami
}
Write-Host ""

# Збірка проекту
Write-Host "📦 Збірка проекту..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Помилка збірки!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Збірка завершена!" -ForegroundColor Green
Write-Host ""

# Деплой
Write-Host "🌐 Деплой на Cloudflare Pages..." -ForegroundColor Yellow
wrangler pages deploy dist --project-name nexx
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Помилка деплою!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Деплой успішно завершено!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Сайт доступний на: https://nexxgsm.com/" -ForegroundColor Cyan
Write-Host "📊 Переглянути деплої: https://dash.cloudflare.com/" -ForegroundColor Cyan
