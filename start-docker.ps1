# PowerShell скрипт для запуска проекта в Docker на Windows

Write-Host "🚀 Запуск NEXX в Docker..." -ForegroundColor Cyan

# Проверяем наличие Docker
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "✅ Docker найден: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker не установлен!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Установите Docker Desktop для Windows:" -ForegroundColor Yellow
    Write-Host "https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor Blue
    exit 1
}

# Проверяем, запущен ли Docker
try {
    docker info 2>&1 | Out-Null
    Write-Host "✅ Docker daemon запущен" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker daemon не запущен!" -ForegroundColor Red
    Write-Host "Запустите Docker Desktop и попробуйте снова." -ForegroundColor Yellow
    exit 1
}

# Получаем режим (dev или prod)
$MODE = $args[0]
if (-not $MODE) {
    $MODE = "prod"
}

Write-Host ""
Write-Host "📦 Режим: $MODE" -ForegroundColor Cyan
Write-Host ""

if ($MODE -eq "dev") {
    Write-Host "🔧 Запуск в режиме разработки..." -ForegroundColor Yellow
    docker-compose up --build nexx-dev
} elseif ($MODE -eq "prod") {
    Write-Host "🚀 Запуск в production режиме..." -ForegroundColor Yellow
    docker-compose up --build nexx-prod
} else {
    Write-Host "❌ Неверный режим. Используйте: dev или prod" -ForegroundColor Red
    exit 1
}
