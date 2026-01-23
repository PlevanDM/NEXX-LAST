# NEXX WebApp - Повна синхронізація з GitHub
# Оновлює локальний репозиторій та показує різницю

Write-Host "🔄 Повна синхронізація з GitHub..." -ForegroundColor Cyan
Write-Host ""

# Перевірка локальних змін
Write-Host "📊 Перевірка локальних змін..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  Увага! Є незбережені зміни:" -ForegroundColor Red
    git status
    Write-Host ""
    $response = Read-Host "Продовжити синхронізацію? (y/n)"
    if ($response -ne "y") {
        Write-Host "❌ Синхронізацію скасовано" -ForegroundColor Red
        exit
    }
} else {
    Write-Host "✅ Локальні зміни відсутні" -ForegroundColor Green
}

Write-Host ""
Write-Host "⬇️  Отримання оновлень з GitHub..." -ForegroundColor Yellow
git fetch origin

Write-Host ""
Write-Host "📥 Застосування оновлень..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
git pull origin $currentBranch

Write-Host ""
Write-Host "📋 Статус після синхронізації:" -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "📊 Останні 10 комітів:" -ForegroundColor Cyan
git log --oneline --graph -10

Write-Host ""
Write-Host "✅ Синхронізацію завершено!" -ForegroundColor Green
