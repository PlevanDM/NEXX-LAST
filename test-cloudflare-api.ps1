# NEXX WebApp - Тест Cloudflare Global API
# Перевіряє підключення до Cloudflare API

param(
    [string]$Token = "519bdfbd2efeaa9c3a418b905202058bac2fc",
    [string]$Email = "dmitro.plevan@gmail.com"
)

Write-Host "🌐 Тестування Cloudflare Global API..." -ForegroundColor Cyan
Write-Host ""

# API endpoints
$API_BASE = "https://api.cloudflare.com/client/v4"

# Determine token type (API Token vs Global API Key)
# API Token: longer, uses Bearer auth
# Global API Key: shorter, uses X-Auth-Key + X-Auth-Email
$isApiToken = $Token.Length -gt 40

if ($isApiToken) {
    # API Token format
    $HEADERS = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }
} else {
    # Global API Key format
    $HEADERS = @{
        "X-Auth-Key" = $Token
        "X-Auth-Email" = $Email
        "Content-Type" = "application/json"
    }
}

Write-Host "📋 Конфігурація:" -ForegroundColor Yellow
Write-Host "  Token: $($Token.Substring(0, 8))..." -ForegroundColor Gray
Write-Host "  Email: $Email" -ForegroundColor Gray
Write-Host "  API Base: $API_BASE" -ForegroundColor Gray
Write-Host ""

# Test 1: Verify Token
Write-Host "1️⃣  Тест: Перевірка токену (GET /user/tokens/verify)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_BASE/user/tokens/verify" -Method Get -Headers $HEADERS -ErrorAction Stop
    if ($response.success) {
        Write-Host "   ✅ Токен валідний!" -ForegroundColor Green
        Write-Host "   📧 Email: $($response.result.email)" -ForegroundColor Gray
        Write-Host "   🆔 ID: $($response.result.id)" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Помилка: $($response.errors.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Помилка запиту: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get User Details
Write-Host "2️⃣  Тест: Отримання інформації про користувача (GET /user)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_BASE/user" -Method Get -Headers $HEADERS -ErrorAction Stop
    if ($response.success) {
        Write-Host "   ✅ Дані отримано!" -ForegroundColor Green
        Write-Host "   👤 Ім'я: $($response.result.first_name) $($response.result.last_name)" -ForegroundColor Gray
        Write-Host "   📧 Email: $($response.result.email)" -ForegroundColor Gray
        Write-Host "   🌍 Країна: $($response.result.country)" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Помилка: $($response.errors.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Помилка запиту: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: List Zones (domains)
Write-Host "3️⃣  Тест: Список зон (GET /zones)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_BASE/zones" -Method Get -Headers $HEADERS -ErrorAction Stop
    if ($response.success) {
        Write-Host "   ✅ Знайдено зон: $($response.result.Count)" -ForegroundColor Green
        foreach ($zone in $response.result) {
            Write-Host "   🌐 $($zone.name) (ID: $($zone.id))" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ❌ Помилка: $($response.errors.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Помилка запиту: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: List Pages Projects
Write-Host "4️⃣  Тест: Список Pages проектів (GET /accounts/{account_id}/pages/projects)" -ForegroundColor Yellow
Write-Host "   ⚠️  Потрібен Account ID для цього тесту" -ForegroundColor Yellow
Write-Host ""

# Test 5: Get Account Details
Write-Host "5️⃣  Тест: Список акаунтів (GET /accounts)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_BASE/accounts" -Method Get -Headers $HEADERS -ErrorAction Stop
    if ($response.success) {
        Write-Host "   ✅ Знайдено акаунтів: $($response.result.Count)" -ForegroundColor Green
        foreach ($account in $response.result) {
            Write-Host "   🏢 $($account.name) (ID: $($account.id))" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ❌ Помилка: $($response.errors.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Помилка запиту: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ Тестування завершено!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Для використання токену в Wrangler:" -ForegroundColor Cyan
Write-Host "   wrangler secret put CLOUDFLARE_API_TOKEN" -ForegroundColor Gray
Write-Host "   (введіть токен при запиті)" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Або встановіть змінну середовища:" -ForegroundColor Cyan
Write-Host "   `$env:CLOUDFLARE_API_TOKEN = '$Token'" -ForegroundColor Gray
