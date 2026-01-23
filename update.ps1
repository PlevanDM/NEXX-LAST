# NEXX WebApp - Скрипт оновлення з GitHub
# Отримує останні зміни з репозиторію

Write-Host "🔄 Оновлення проекту NEXX з GitHub..." -ForegroundColor Cyan
Write-Host ""

# Перевірка статусу
Write-Host "📊 Перевірка поточного статусу..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "⬇️  Отримання оновлень з GitHub..." -ForegroundColor Yellow
git fetch origin

Write-Host ""
Write-Host "📥 Застосування оновлень..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
git pull origin $currentBranch

Write-Host ""
Write-Host "✅ Оновлення завершено!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Останні 5 комітів:" -ForegroundColor Cyan
git log --oneline -5

Write-Host ""
Write-Host "💡 Для встановлення залежностей виконайте: npm install" -ForegroundColor Yellow
Write-Host "💡 Для збірки проекту виконайте: npm run build" -ForegroundColor Yellow
Write-Host "💡 Для деплою виконайте: npm run deploy" -ForegroundColor Yellow
