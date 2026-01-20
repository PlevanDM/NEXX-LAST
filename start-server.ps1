# Простой скрипт запуска сервера

Write-Host "🚀 Запуск NEXX сервера..." -ForegroundColor Cyan

cd $PSScriptRoot

# Проверяем, что dist существует
if (-not (Test-Path "dist")) {
    Write-Host "❌ Папка dist не найдена. Запускаю сборку..." -ForegroundColor Yellow
    npm run build
}

Write-Host ""
Write-Host "🌐 Запускаю сервер на http://localhost:3000" -ForegroundColor Green
Write-Host "Нажмите Ctrl+C для остановки" -ForegroundColor Yellow
Write-Host ""

# Запускаем serve
npx serve -s dist -l 3000
