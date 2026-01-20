# Простой скрипт запуска туннеля для NEXX

Write-Host "🌐 Запуск туннеля для NEXX..." -ForegroundColor Cyan
Write-Host ""

cd $PSScriptRoot

# Проверяем, что сервер запущен
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Сервер работает на http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "❌ Сервер не запущен на порту 3000!" -ForegroundColor Red
    Write-Host "Запустите сначала: npx serve -s dist -l 3000" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Пробуем найти cloudflared
$cloudflaredPath = $null

# Вариант 1: В PATH
try {
    $cloudflaredPath = Get-Command cloudflared -ErrorAction Stop | Select-Object -ExpandProperty Source
    Write-Host "✅ cloudflared найден: $cloudflaredPath" -ForegroundColor Green
} catch {
    # Вариант 2: Стандартное расположение
    $standardPath = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
    if (Test-Path $standardPath) {
        $cloudflaredPath = $standardPath
        Write-Host "✅ cloudflared найден: $cloudflaredPath" -ForegroundColor Green
    } else {
        # Вариант 3: В WinGet Packages
        $winGetPath = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter "cloudflared.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
        if ($winGetPath) {
            $cloudflaredPath = $winGetPath
            Write-Host "✅ cloudflared найден: $cloudflaredPath" -ForegroundColor Green
        } else {
            # Вариант 4: В Program Files
            $progFilesPath = Get-ChildItem -Path "$env:ProgramFiles" -Recurse -Filter "cloudflared.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
            if ($progFilesPath) {
                $cloudflaredPath = $progFilesPath
                Write-Host "✅ cloudflared найден: $cloudflaredPath" -ForegroundColor Green
            }
        }
    }
}

if (-not $cloudflaredPath) {
    Write-Host "❌ cloudflared не найден!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Установите cloudflared:" -ForegroundColor Yellow
    Write-Host "  winget install --id Cloudflare.cloudflared" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Или используйте альтернативу:" -ForegroundColor Yellow
    Write-Host "  ngrok http 3000" -ForegroundColor Gray
    Write-Host "  ssh -R 80:localhost:3000 ssh.localhost.run" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "🚀 Запускаю туннель..." -ForegroundColor Cyan
Write-Host "URL будет показан ниже:" -ForegroundColor Yellow
Write-Host ""

# Запускаем туннель
& $cloudflaredPath tunnel --url http://localhost:3000
