# Check GitHub Status and Updates

Write-Host "=== GitHub Status Check ===" -ForegroundColor Cyan
Write-Host ""

# Current branch
$branch = git branch --show-current
Write-Host "Current branch: $branch" -ForegroundColor Green
Write-Host ""

# Remote info
Write-Host "Remote repository:" -ForegroundColor Yellow
git remote -v
Write-Host ""

# Fetch latest
Write-Host "Fetching latest from GitHub..." -ForegroundColor Yellow
git fetch origin
Write-Host ""

# Check if behind
$behind = git rev-list --count HEAD..origin/main 2>$null
if ($behind -gt 0) {
    Write-Host "⚠️  Local is $behind commit(s) behind GitHub" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "New commits on GitHub:" -ForegroundColor Cyan
    git log HEAD..origin/main --oneline
    Write-Host ""
    Write-Host "To update, run:" -ForegroundColor Yellow
    Write-Host "  git pull origin main" -ForegroundColor White
} else {
    Write-Host "✅ Local is up to date with GitHub" -ForegroundColor Green
}

Write-Host ""

# Check if ahead
$ahead = git rev-list --count origin/main..HEAD 2>$null
if ($ahead -gt 0) {
    Write-Host "⚠️  Local is $ahead commit(s) ahead of GitHub" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Local commits not on GitHub:" -ForegroundColor Cyan
    git log origin/main..HEAD --oneline
    Write-Host ""
    Write-Host "To push, run:" -ForegroundColor Yellow
    Write-Host "  git push origin main" -ForegroundColor White
} else {
    Write-Host "✅ No local commits to push" -ForegroundColor Green
}

Write-Host ""

# Local changes
Write-Host "Local changes:" -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host $status -ForegroundColor Gray
    Write-Host ""
    Write-Host "You have uncommitted changes" -ForegroundColor Yellow
} else {
    Write-Host "  No uncommitted changes" -ForegroundColor Green
}

Write-Host ""

# Latest commits
Write-Host "Latest 10 commits:" -ForegroundColor Cyan
git log --oneline -10 --graph --decorate
Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
if ($behind -eq 0 -and $ahead -eq 0 -and -not $status) {
    Write-Host "✅ Everything is synchronized!" -ForegroundColor Green
} else {
    if ($behind -gt 0) {
        Write-Host "📥 Pull updates: git pull origin main" -ForegroundColor Yellow
    }
    if ($ahead -gt 0) {
        Write-Host "📤 Push changes: git push origin main" -ForegroundColor Yellow
    }
    if ($status) {
        Write-Host "💾 Commit changes: git add . && git commit -m 'message'" -ForegroundColor Yellow
    }
}
