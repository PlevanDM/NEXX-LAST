# PowerShell скрипт для запуска с туннелем

Write-Host "🌐 Запуск NEXX с туннелем..." -ForegroundColor Cyan

# Проверяем переменные окружения
$tunnelToken = $env:TUNNEL_TOKEN
$ngrokToken = $env:NGROK_AUTH_TOKEN

if (-not $tunnelToken -and -not $ngrokToken) {
    Write-Host "⚠️  TUNNEL_TOKEN или NGROK_AUTH_TOKEN не установлен" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Для Cloudflare Tunnel:" -ForegroundColor Cyan
    Write-Host '  $env:TUNNEL_TOKEN="your-token"' -ForegroundColor Gray
    Write-Host '  docker-compose -f docker-compose.tunnel.yml up' -ForegroundColor Gray
    Write-Host ""
    Write-Host "Для ngrok:" -ForegroundColor Cyan
    Write-Host '  $env:NGROK_AUTH_TOKEN="your-token"' -ForegroundColor Gray
    Write-Host '  docker-compose -f docker-compose.tunnel.yml --profile ngrok up' -ForegroundColor Gray
    exit 1
}

# Запускаем с туннелем
if ($tunnelToken) {
    Write-Host "☁️  Используется Cloudflare Tunnel" -ForegroundColor Green
    docker-compose -f docker-compose.tunnel.yml up --build
} elseif ($ngrokToken) {
    Write-Host "🔗 Используется ngrok" -ForegroundColor Green
    docker-compose -f docker-compose.tunnel.yml --profile ngrok up --build
}
