# Check All Available Cloudflare Features and APIs
# Перевіряє всі доступні функції Cloudflare

$GlobalApiKey = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$Email = "dmitro.plevan@gmail.com"
$API_BASE = "https://api.cloudflare.com/client/v4"

Write-Host "=== Cloudflare Features Check ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-Auth-Key" = $GlobalApiKey
    "X-Auth-Email" = $Email
    "Content-Type" = "application/json"
}

# Get Account ID
try {
    $response = Invoke-RestMethod -Uri "$API_BASE/accounts" -Method Get -Headers $headers
    $accountId = $response.result[0].id
    Write-Host "✅ Account ID: $accountId" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get Account ID: $_" -ForegroundColor Red
    exit 1
}

# Check Zones
Write-Host ""
Write-Host "=== Zones (Domains) ===" -ForegroundColor Yellow
try {
    $zones = Invoke-RestMethod -Uri "$API_BASE/zones" -Method Get -Headers $headers
    foreach ($zone in $zones.result) {
        Write-Host "  ✅ Zone: $($zone.name) (ID: $($zone.id))" -ForegroundColor Green
        Write-Host "     Status: $($zone.status)" -ForegroundColor Gray
        Write-Host "     Plan: $($zone.plan.name)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ❌ Failed to get zones: $_" -ForegroundColor Red
}

# Check Pages Projects
Write-Host ""
Write-Host "=== Cloudflare Pages ===" -ForegroundColor Yellow
try {
    $projects = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/pages/projects" -Method Get -Headers $headers
    foreach ($project in $projects.result) {
        Write-Host "  ✅ Project: $($project.name)" -ForegroundColor Green
        Write-Host "     Production Branch: $($project.production_branch)" -ForegroundColor Gray
        Write-Host "     Created: $($project.created_on)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ❌ Failed to get Pages projects: $_" -ForegroundColor Red
}

# Check Workers
Write-Host ""
Write-Host "=== Cloudflare Workers ===" -ForegroundColor Yellow
try {
    $workers = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/workers/scripts" -Method Get -Headers $headers
    if ($workers.result) {
        foreach ($worker in $workers.result) {
            Write-Host "  ✅ Worker: $($worker.id)" -ForegroundColor Green
        }
    } else {
        Write-Host "  ℹ️  No Workers found" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ℹ️  Workers API not accessible or no workers" -ForegroundColor Gray
}

# Check R2 Buckets
Write-Host ""
Write-Host "=== R2 Storage ===" -ForegroundColor Yellow
try {
    $r2 = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/r2/buckets" -Method Get -Headers $headers
    if ($r2.result) {
        foreach ($bucket in $r2.result) {
            Write-Host "  ✅ R2 Bucket: $($bucket.name)" -ForegroundColor Green
        }
    } else {
        Write-Host "  ℹ️  No R2 buckets found" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ℹ️  R2 API not accessible or no buckets" -ForegroundColor Gray
}

# Check KV Namespaces
Write-Host ""
Write-Host "=== KV Storage ===" -ForegroundColor Yellow
try {
    $kv = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/storage/kv/namespaces" -Method Get -Headers $headers
    if ($kv.result) {
        foreach ($ns in $kv.result) {
            Write-Host "  ✅ KV Namespace: $($ns.title) (ID: $($ns.id))" -ForegroundColor Green
        }
    } else {
        Write-Host "  ℹ️  No KV namespaces found" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ℹ️  KV API not accessible or no namespaces" -ForegroundColor Gray
}

# Check D1 Databases
Write-Host ""
Write-Host "=== D1 Databases ===" -ForegroundColor Yellow
try {
    $d1 = Invoke-RestMethod -Uri "$API_BASE/accounts/$accountId/d1/database" -Method Get -Headers $headers
    if ($d1.result) {
        foreach ($db in $d1.result) {
            Write-Host "  ✅ D1 Database: $($db.name) (ID: $($db.uuid))" -ForegroundColor Green
        }
    } else {
        Write-Host "  ℹ️  No D1 databases found" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ℹ️  D1 API not accessible or no databases" -ForegroundColor Gray
}

# Check User Info
Write-Host ""
Write-Host "=== User Information ===" -ForegroundColor Yellow
try {
    $user = Invoke-RestMethod -Uri "$API_BASE/user" -Method Get -Headers $headers
    Write-Host "  ✅ Email: $($user.result.email)" -ForegroundColor Green
    Write-Host "     Username: $($user.result.username)" -ForegroundColor Gray
} catch {
    Write-Host "  ❌ Failed to get user info: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Account ID: $accountId" -ForegroundColor White
Write-Host "Email: $Email" -ForegroundColor White
Write-Host ""
Write-Host "💡 To enable full automation, you need:" -ForegroundColor Yellow
Write-Host "   1. API Token (not Global Key) for Pages deployment" -ForegroundColor White
Write-Host "   2. Create at: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Gray
Write-Host "   3. Permissions: Cloudflare Pages → Edit" -ForegroundColor Gray
