# Тест Global API Key
$API_BASE = "https://api.cloudflare.com/client/v4"
$headers = @{
    "X-Auth-Key" = "519bdfbd2efeaa9c3a418b905202058bac2fc"
    "X-Auth-Email" = "dmitro.plevan@gmail.com"
    "Content-Type" = "application/json"
}

Write-Host "🔐 Тестування Global API Key..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$API_BASE/accounts" -Method Get -Headers $headers -ErrorAction Stop
    if ($response.success) {
        $accountId = $response.result[0].id
        Write-Host "✅ Global API Key працює!" -ForegroundColor Green
        Write-Host "   Account ID: $accountId" -ForegroundColor Gray
        Write-Host ""
        Write-Host "💡 Тепер можна використати wrangler login або створити API Token" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Помилка: $($response.errors[0].message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Помилка запиту: $($_.Exception.Message)" -ForegroundColor Red
}
