# NEXX WebApp - Скрипт публікації змін на GitHub
# Додає, комітить та пушить зміни

param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

Write-Host "📤 Публікація змін на GitHub..." -ForegroundColor Cyan
Write-Host ""

# Перевірка статусу
Write-Host "📊 Поточний статус:" -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "➕ Додавання змін..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "💾 Створення коміту: $Message" -ForegroundColor Yellow
git commit -m $Message

Write-Host ""
Write-Host "🚀 Відправка на GitHub..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
git push origin $currentBranch

Write-Host ""
Write-Host "✅ Зміни успішно опубліковано!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Переглянути на GitHub: https://github.com/PlevanDM/nexx-webapp" -ForegroundColor Cyan
