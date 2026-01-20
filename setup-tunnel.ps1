# Скрипт для настройки туннеля БЕЗ Docker

Write-Host "🌐 Настройка туннеля для NEXX..." -ForegroundColor Cyan
Write-Host ""

# Проверяем наличие cloudflared
if (Get-Command cloudflared -ErrorAction SilentlyContinue) {
    Write-Host "✅ cloudflared найден!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Запускаю Cloudflare Tunnel на порту 3000..." -ForegroundColor Yellow
    cloudflared tunnel --url http://localhost:3000
    exit 0
}

# Проверяем наличие ngrok
if (Get-Command ngrok -ErrorAction SilentlyContinue) {
    Write-Host "✅ ngrok найден!" -ForegroundColor Green
    Write-Host ""
    
    if (-not $env:NGROK_AUTH_TOKEN) {
        Write-Host "⚠️  NGROK_AUTH_TOKEN не установлен" -ForegroundColor Yellow
        Write-Host "Получите токен на https://ngrok.com/" -ForegroundColor Cyan
        Write-Host "Затем установите: `$env:NGROK_AUTH_TOKEN='your-token'" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Запускаю без авторизации (ограниченно):" -ForegroundColor Yellow
    }
    
    ngrok http 3000
    exit 0
}

# Предлагаем установку
Write-Host "❌ Не найдено ни cloudflared, ни ngrok" -ForegroundColor Red
Write-Host ""
Write-Host "Установите один из вариантов:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Cloudflare Tunnel (рекомендуется):" -ForegroundColor Cyan
Write-Host "   winget install --id Cloudflare.cloudflared" -ForegroundColor Gray
Write-Host ""
Write-Host "2. ngrok:" -ForegroundColor Cyan
Write-Host "   winget install --id ngrok.ngrok" -ForegroundColor Gray
Write-Host "   Или скачайте: https://ngrok.com/download" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Альтернатива без установки:" -ForegroundColor Cyan
Write-Host "   SSH туннель: ssh -R 80:localhost:3000 ssh.localhost.run" -ForegroundColor Gray
Write-Host ""
