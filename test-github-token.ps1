# Test GitHub Personal Access Token
# Перевірка GitHub токену

$GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"  # Замените на свой токен
$API_BASE = "https://api.github.com"

Write-Host "=== GitHub Token Test ===" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "token $GITHUB_TOKEN"
    "Accept" = "application/vnd.github.v3+json"
}

# Test 1: User Info
Write-Host "1. Testing User Authentication..." -ForegroundColor Yellow
try {
    $user = Invoke-RestMethod -Uri "$API_BASE/user" -Headers $headers
    Write-Host "   ✅ Token is valid" -ForegroundColor Green
    Write-Host "   User: $($user.login)" -ForegroundColor Gray
    Write-Host "   ID: $($user.id)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Token authentication failed: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Repository Access
Write-Host ""
Write-Host "2. Testing Repository Access..." -ForegroundColor Yellow
try {
    $repo = Invoke-RestMethod -Uri "$API_BASE/repos/PlevanDM/nexx-webapp" -Headers $headers
    Write-Host "   ✅ Repository access: OK" -ForegroundColor Green
    Write-Host "   Repository: $($repo.full_name)" -ForegroundColor Gray
    Write-Host "   Private: $($repo.private)" -ForegroundColor Gray
    
    if ($repo.permissions) {
        Write-Host "   Permissions:" -ForegroundColor Gray
        Write-Host "     - Admin: $($repo.permissions.admin)" -ForegroundColor Gray
        Write-Host "     - Push: $($repo.permissions.push)" -ForegroundColor Gray
        Write-Host "     - Pull: $($repo.permissions.pull)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Repository access failed: $_" -ForegroundColor Red
}

# Test 3: GitHub Actions Workflows
Write-Host ""
Write-Host "3. Checking GitHub Actions Workflows..." -ForegroundColor Yellow
try {
    $workflows = Invoke-RestMethod -Uri "$API_BASE/repos/PlevanDM/nexx-webapp/actions/workflows" -Headers $headers
    Write-Host "   ✅ Workflows found: $($workflows.total_count)" -ForegroundColor Green
    foreach ($workflow in $workflows.workflows) {
        Write-Host "     - $($workflow.name) (ID: $($workflow.id))" -ForegroundColor Gray
        Write-Host "       State: $($workflow.state)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  Workflows check failed (may need different scope): $_" -ForegroundColor Yellow
}

# Test 4: Repository Secrets (read-only check)
Write-Host ""
Write-Host "4. Checking Repository Secrets Access..." -ForegroundColor Yellow
try {
    # Note: GitHub Secrets API requires admin:repo scope
    # This will likely fail, but we test it
    $secrets = Invoke-RestMethod -Uri "$API_BASE/repos/PlevanDM/nexx-webapp/actions/secrets" -Headers $headers
    Write-Host "   ✅ Secrets API accessible" -ForegroundColor Green
    Write-Host "   Total secrets: $($secrets.total_count)" -ForegroundColor Gray
} catch {
    Write-Host "   ⚠️  Secrets API not accessible (normal - requires admin:repo scope)" -ForegroundColor Yellow
    Write-Host "   Note: Secrets must be set manually via GitHub UI" -ForegroundColor Gray
}

# Test 5: Check if token can push
Write-Host ""
Write-Host "5. Testing Push Permissions..." -ForegroundColor Yellow
if ($repo.permissions.push) {
    Write-Host "   ✅ Token has push permissions" -ForegroundColor Green
    Write-Host "   Can be used for: git push, API updates" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Token does not have push permissions" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Token Status: ✅ Valid" -ForegroundColor Green
Write-Host "User: $($user.login)" -ForegroundColor White
Write-Host "Repository: PlevanDM/nexx-webapp" -ForegroundColor White
Write-Host ""
Write-Host "💡 This token can be used for:" -ForegroundColor Yellow
Write-Host "   - Git operations (push/pull)" -ForegroundColor White
Write-Host "   - GitHub API calls" -ForegroundColor White
Write-Host "   - Repository management" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  For GitHub Actions Secrets:" -ForegroundColor Yellow
Write-Host "   - Must be set manually via: https://github.com/PlevanDM/nexx-webapp/settings/secrets/actions" -ForegroundColor Gray
Write-Host "   - Or use GitHub CLI: gh secret set CLOUDFLARE_API_TOKEN" -ForegroundColor Gray
