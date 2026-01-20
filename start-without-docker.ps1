# Запуск проекта БЕЗ Docker через локальный сервер + туннель

Write-Host "🚀 Запуск NEXX БЕЗ Docker..." -ForegroundColor Cyan
Write-Host ""

# Проверяем Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js не найден!" -ForegroundColor Red
    Write-Host "Установите Node.js: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js найден: $(node --version)" -ForegroundColor Green

# Проверяем npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm не найден!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ npm найден: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Устанавливаем зависимости если нужно
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Устанавливаю зависимости..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🔨 Собираю production build..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "🌐 Запускаю локальный сервер..." -ForegroundColor Yellow
Write-Host "Приложение будет доступно на: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

# Устанавливаем serve глобально если нужно
if (-not (Get-Command serve -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Устанавливаю serve..." -ForegroundColor Yellow
    npm install -g serve
}

# Запускаем сервер в фоне
$job = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    serve -s dist -l 3000
}

Write-Host "✅ Сервер запущен (PID: $($job.Id))" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Для остановки: Stop-Job -Id $($job.Id); Remove-Job -Id $($job.Id)" -ForegroundColor Gray
Write-Host ""

# Проверяем туннели
Write-Host "🌍 Настройка туннеля для внешнего доступа..." -ForegroundColor Cyan
Write-Host ""

# Проверяем cloudflared
if (Get-Command cloudflared -ErrorAction SilentlyContinue) {
    Write-Host "✅ cloudflared найден!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Для создания Cloudflare Tunnel:" -ForegroundColor Yellow
    Write-Host '  cloudflared tunnel login' -ForegroundColor Gray
    Write-Host '  cloudflared tunnel create nexx-tunnel' -ForegroundColor Gray
    Write-Host '  cloudflared tunnel --url http://localhost:3000' -ForegroundColor Gray
    Write-Host ""
}

# Проверяем ngrok
if (Get-Command ngrok -ErrorAction SilentlyContinue) {
    Write-Host "✅ ngrok найден!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Для создания ngrok туннеля:" -ForegroundColor Yellow
    Write-Host '  ngrok http 3000' -ForegroundColor Gray
    Write-Host ""
}

# Альтернатива: localhost.run
Write-Host "📡 Альтернатива без установки:" -ForegroundColor Yellow
Write-Host "  SSH туннель: ssh -R 80:localhost:3000 ssh.localhost.run" -ForegroundColor Gray
Write-Host ""

# Ждем
Write-Host "Нажмите Ctrl+C для остановки..." -ForegroundColor Yellow
try {
    while ($true) {
        Start-Sleep -Seconds 1
        # Проверяем статус сервера
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 1 -UseBasicParsing -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "`r✅ Сервер работает: http://localhost:3000" -NoNewline -ForegroundColor Green
            }
        } catch {
            Write-Host "`r⏳ Ожидание запуска сервера..." -NoNewline -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host ""
    Write-Host "Останавливаю сервер..." -ForegroundColor Yellow
    Stop-Job -Id $job.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $job.Id -ErrorAction SilentlyContinue
    Write-Host "✅ Остановлено" -ForegroundColor Green
}
