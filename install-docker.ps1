# Скрипт установки Docker Desktop через winget

Write-Host "🐳 Установка Docker Desktop..." -ForegroundColor Cyan

# Проверяем наличие winget
try {
    winget --version | Out-Null
    Write-Host "✅ winget найден" -ForegroundColor Green
} catch {
    Write-Host "❌ winget не найден. Установите Docker Desktop вручную:" -ForegroundColor Red
    Write-Host "https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor Blue
    exit 1
}

# Проверяем, не установлен ли уже Docker
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "✅ Docker уже установлен!" -ForegroundColor Green
    docker --version
    exit 0
}

Write-Host ""
Write-Host "Устанавливаю Docker Desktop через winget..." -ForegroundColor Yellow
Write-Host "Это может занять несколько минут..." -ForegroundColor Yellow
Write-Host ""

# Устанавливаем Docker Desktop
try {
    winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements
    Write-Host ""
    Write-Host "✅ Docker Desktop установлен!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Следующие шаги:" -ForegroundColor Cyan
    Write-Host "1. Запустите Docker Desktop из меню Пуск" -ForegroundColor Yellow
    Write-Host "2. Дождитесь полной загрузки (иконка в трее перестанет мигать)" -ForegroundColor Yellow
    Write-Host "3. Запустите: .\start-docker.ps1" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Ошибка установки!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Попробуйте установить вручную:" -ForegroundColor Yellow
    Write-Host "https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor Blue
    exit 1
}
